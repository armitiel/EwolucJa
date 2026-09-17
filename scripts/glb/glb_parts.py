# EwolucJA — gra edukacyjna dla dzieci.
# © 2026 Amitiel Angelisme. Wszelkie prawa zastrzeżone.
# Powstało w ramach projektu Stowarzyszenia na Rzecz Edukacji „Pomost”.
# Prawa autorskie należą do autora. Pełna nota: LICENSE.
"""Lekki parser GLB (jeden mesh, jeden primitive) + składowe spójne."""
import json, struct, sys, numpy as np
from scipy.sparse import coo_matrix
from scipy.sparse.csgraph import connected_components

CT = {5120: np.int8, 5121: np.uint8, 5122: np.int16, 5123: np.uint16, 5125: np.uint32, 5126: np.float32}
NC = {"SCALAR": 1, "VEC2": 2, "VEC3": 3, "VEC4": 4}

def read_glb(path):
    b = open(path, "rb").read()
    assert b[:4] == b"glTF"
    ln, ty = struct.unpack_from("<II", b, 12)
    js = json.loads(b[20:20 + ln])
    off = 20 + ln
    ln2, ty2 = struct.unpack_from("<II", b, off)
    bin_ = b[off + 8: off + 8 + ln2]
    return js, bin_

def accessor(js, bin_, idx):
    a = js["accessors"][idx]
    bv = js["bufferViews"][a["bufferView"]]
    dt = CT[a["componentType"]]; n = NC[a["type"]]
    start = bv.get("byteOffset", 0) + a.get("byteOffset", 0)
    stride = bv.get("byteStride", 0)
    if stride and stride != n * np.dtype(dt).itemsize:
        raise RuntimeError("stride")
    arr = np.frombuffer(bin_, dtype=dt, count=a["count"] * n, offset=start)
    return arr.reshape(a["count"], n)

def parts(path):
    js, bin_ = read_glb(path)
    prim = js["meshes"][0]["primitives"][0]
    pos = accessor(js, bin_, prim["attributes"]["POSITION"]).astype(np.float64)
    idx = accessor(js, bin_, prim["indices"]).reshape(-1).astype(np.int64)
    tri = idx.reshape(-1, 3)
    # sklej wierzchołki po pozycji (szwy UV)
    key = np.round(pos * 1e4).astype(np.int64)
    _, inv = np.unique(key, axis=0, return_inverse=True)
    inv = inv.reshape(-1)
    t = inv[tri]
    n = inv.max() + 1
    rows = np.concatenate([t[:, 0], t[:, 1], t[:, 2]])
    cols = np.concatenate([t[:, 1], t[:, 2], t[:, 0]])
    g = coo_matrix((np.ones(len(rows)), (rows, cols)), shape=(n, n))
    k, lab = connected_components(g, directed=False)
    flab = lab[t[:, 0]]
    out = []
    for c in range(k):
        f = np.where(flab == c)[0]
        v = pos[tri[f].reshape(-1)]
        mn, mx = v.min(0), v.max(0)
        out.append(dict(id=c, faces=f, nf=len(f), mn=mn, mx=mx, ext=mx - mn, c=(mn + mx) / 2))
    out.sort(key=lambda p: -p["nf"])
    return js, bin_, pos, tri, out

if __name__ == "__main__":
    for path in sys.argv[1:]:
        js, bin_, pos, tri, ps = parts(path)
        print("==", path, "parts", len(ps), "faces", len(tri), "bbox", np.round(pos.min(0), 3), np.round(pos.max(0), 3))
        for p in ps[:14]:
            e = p["ext"]
            print(f"  #{p['id']:3d} faces={p['nf']:6d} ext={np.round(e,3)} c={np.round(p['c'],3)} thin={e.min()/max(e.max(),1e-9):.3f}")
