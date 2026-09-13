"""Czyści modele fasoli z Tripo: podstawki, tło, drzazgi. Zapisuje lekki GLB
(pozycje, normalne, uv, indeksy, tylko baseColor)."""
import sys, io, json, struct, numpy as np
sys.path.insert(0, __import__("os").path.dirname(__file__))
from glb_faces import face_data, is_white, preview
from glb_parts import parts

def komponenty(path):
    js, b, pos, tri, ps = parts(path)
    lab = np.zeros(len(tri), dtype=int)
    for p in ps:
        lab[p["faces"]] = p["id"]
    info = {p["id"]: p for p in ps}
    return lab, info

REGULY = {
    1: dict(dol=-0.295, plyta=-0.255),
    2: dict(dol=-0.45),
    3: dict(dol=-0.435, cienkie=0.03),
    4: dict(dol=-0.455, gora=0.49),
    5: dict(dol=-0.465, gora=0.49, cienkie=0.03, tlo_x=-0.09),
}

def wytnij(i, src, dst):
    js, bin_, pos, uv, tri, col, cen, nrm, area = face_data(src)
    R = REGULY[i]
    vy = pos[tri][:, :, 1]
    usun = np.zeros(len(tri), bool)
    usun |= vy.max(1) < R["dol"]
    if "plyta" in R:  # jasna, płaska podstawka o nierównej grubości
        usun |= (vy.max(1) < R["plyta"]) & (col.mean(1) > 195)
    if "gora" in R: usun |= vy.min(1) > R["gora"]
    ext = np.sort(pos[tri].max(1) - pos[tri].min(1), axis=1)  # drzazgi: długie, cieniutkie trójkąty
    usun |= (ext[:, 2] > 0.25) & (ext[:, 1] < 0.02)
    if "cienkie" in R:
        lab, info = komponenty(src)
        for cid, p in info.items():
            e = p["ext"]
            if e.min() / max(e.max(), 1e-9) < R["cienkie"] and p["nf"] < 400:
                usun |= lab == cid
    if "tlo_x" in R:
        duze = area > 3 * np.median(area)
        usun |= (np.abs(nrm[:, 0]) > 0.75) & (cen[:, 0] < R["tlo_x"]) & (is_white(col, 150, 40) | duze)
        plansza = (np.abs(nrm[:, 0]) > 0.6) & (cen[:, 0] < -0.10) & (cen[:, 0] > -0.15) & (area > 5 * np.median(area))
        usun |= plansza
    keep = ~usun
    print(f"f{i}: usuwam {usun.sum()} z {len(tri)} ścianek")
    preview(pos, tri, col, usun, f"f{i}_cut.png")
    t = tri[keep]
    used, inv = np.unique(t.reshape(-1), return_inverse=True)
    t2 = inv.reshape(-1, 3).astype(np.uint32)
    P = pos[used].astype(np.float32); U = uv[used].astype(np.float32)
    # normalne z pliku
    from glb_parts import accessor
    prim = js["meshes"][0]["primitives"][0]
    N = accessor(js, bin_, prim["attributes"]["NORMAL"])[used].astype(np.float32)
    mat = js["materials"][prim["material"]]
    ti = mat["pbrMetallicRoughness"]["baseColorTexture"]["index"]
    img = js["images"][js["textures"][ti]["source"]]
    bv = js["bufferViews"][img["bufferView"]]
    raw = bin_[bv.get("byteOffset", 0): bv.get("byteOffset", 0) + bv["byteLength"]]
    zapisz(dst, P, N, U, t2, raw, img.get("mimeType", "image/jpeg"), f"fasola_{i}")

def zapisz(dst, P, N, U, T, img, mime, nazwa):
    blobs = [P.tobytes(), N.tobytes(), U.tobytes(), T.tobytes(), img]
    views, off, buf = [], 0, b""
    for k, bl in enumerate(blobs):
        pad = (-len(bl)) % 4
        views.append({"buffer": 0, "byteOffset": off, "byteLength": len(bl), **({"target": 34962} if k < 3 else {"target": 34963} if k == 3 else {})})
        buf += bl + b"\0" * pad; off += len(bl) + pad
    js = {
        "asset": {"version": "2.0", "generator": "EwolucJA glb_clean"},
        "scene": 0, "scenes": [{"nodes": [0]}], "nodes": [{"mesh": 0, "name": nazwa}],
        "meshes": [{"name": nazwa, "primitives": [{"attributes": {"POSITION": 0, "NORMAL": 1, "TEXCOORD_0": 2}, "indices": 3, "material": 0}]}],
        "accessors": [
            {"bufferView": 0, "componentType": 5126, "count": len(P), "type": "VEC3", "min": P.min(0).tolist(), "max": P.max(0).tolist()},
            {"bufferView": 1, "componentType": 5126, "count": len(N), "type": "VEC3"},
            {"bufferView": 2, "componentType": 5126, "count": len(U), "type": "VEC2"},
            {"bufferView": 3, "componentType": 5125, "count": T.size, "type": "SCALAR"},
        ],
        "bufferViews": views,
        "buffers": [{"byteLength": len(buf)}],
        "images": [{"bufferView": 4, "mimeType": mime, "name": nazwa}],
        "samplers": [{"magFilter": 9729, "minFilter": 9987, "wrapS": 10497, "wrapT": 10497}],
        "textures": [{"sampler": 0, "source": 0}],
        "materials": [{"name": nazwa, "pbrMetallicRoughness": {"baseColorTexture": {"index": 0}, "metallicFactor": 0.0, "roughnessFactor": 0.85}}],
    }
    jb = json.dumps(js, separators=(",", ":")).encode()
    jb += b" " * ((-len(jb)) % 4)
    total = 12 + 8 + len(jb) + 8 + len(buf)
    with open(dst, "wb") as f:
        f.write(b"glTF" + struct.pack("<II", 2, total))
        f.write(struct.pack("<II", len(jb), 0x4E4F534A) + jb)
        f.write(struct.pack("<II", len(buf), 0x004E4942) + buf)

if __name__ == "__main__":
    for i in range(1, 6):
        wytnij(i, f"f{i}.glb", f"fasola_{i}.raw.glb")
