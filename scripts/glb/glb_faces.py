# SPDX-FileCopyrightText: © 2026 Amitiel Angelisme <armitiel@gmail.com>
# SPDX-License-Identifier: LicenseRef-EwolucJA-Proprietary
#
# EwolucJA — gra edukacyjna dla dzieci.
# Produkt powstał w ramach projektu Stowarzyszenia na Rzecz Edukacji „Pomost”;
# autorskie prawa majątkowe pozostają przy autorze. Licencja: LICENSE.
"""Kolor ścianek z tekstury + podgląd (białe = kandydaci do usunięcia)."""
import sys, io, json, numpy as np
from PIL import Image
sys.path.insert(0, __import__("os").path.dirname(__file__))
from glb_parts import read_glb, accessor

def face_data(path):
    js, bin_ = read_glb(path)
    prim = js["meshes"][0]["primitives"][0]
    pos = accessor(js, bin_, prim["attributes"]["POSITION"]).astype(np.float64)
    uv = accessor(js, bin_, prim["attributes"]["TEXCOORD_0"]).astype(np.float64)
    tri = accessor(js, bin_, prim["indices"]).reshape(-1, 3).astype(np.int64)
    mat = js["materials"][prim["material"]]
    ti = mat["pbrMetallicRoughness"]["baseColorTexture"]["index"]
    img_i = js["textures"][ti]["source"]
    bv = js["bufferViews"][js["images"][img_i]["bufferView"]]
    raw = bin_[bv.get("byteOffset", 0): bv.get("byteOffset", 0) + bv["byteLength"]]
    img = np.asarray(Image.open(io.BytesIO(raw)).convert("RGB"))
    H, W, _ = img.shape
    cuv = uv[tri].mean(1)
    px = np.clip((cuv[:, 0] * W).astype(int), 0, W - 1)
    py = np.clip((cuv[:, 1] * H).astype(int), 0, H - 1)
    col = img[py, px].astype(np.float64)
    cen = pos[tri].mean(1)
    a, b, c = pos[tri[:, 0]], pos[tri[:, 1]], pos[tri[:, 2]]
    nrm = np.cross(b - a, c - a)
    area = np.linalg.norm(nrm, axis=1) / 2
    nrm = nrm / np.maximum(np.linalg.norm(nrm, axis=1)[:, None], 1e-12)
    return js, bin_, pos, uv, tri, col, cen, nrm, area

def is_white(col, lo=185, spread=28):
    return (col.min(1) > lo) & ((col.max(1) - col.min(1)) < spread)

def preview(pos, tri, col, mask, out, size=500):
    """Rzut z przodu (x,y) i z boku (z,y); maska = czerwone."""
    from PIL import ImageDraw
    cen = pos[tri].mean(1)
    canv = Image.new("RGB", (size * 2, size), (40, 40, 40))
    d = ImageDraw.Draw(canv)
    for k, (ax, ay) in enumerate([(0, 1), (2, 1)]):
        order = np.argsort(cen[:, 2 - ax if ax == 0 else 0])
        for f in order:
            p = pos[tri[f]]
            pts = [((p[i, ax] + 0.5) * size * 0.9 + size * 0.05 + k * size, (0.5 - p[i, ay]) * size * 0.9 + size * 0.05) for i in range(3)]
            c = (255, 40, 40) if mask[f] else tuple(int(v) for v in col[f])
            d.polygon(pts, fill=c)
    canv.save(out)

if __name__ == "__main__":
    for path in sys.argv[1:]:
        js, bin_, pos, uv, tri, col, cen, nrm, area = face_data(path)
        w = is_white(col)
        print(path, "faces", len(tri), "white", w.sum(), "white area %.1f%%" % (100 * area[w].sum() / area.sum()))
        preview(pos, tri, col, w, path.replace("/", "_").replace(".glb", "_faces.png"))
