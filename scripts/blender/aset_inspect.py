# blender -b -P scripts/blender/aset_inspect.py -- <glb> <out.json>
import bpy, sys, json, mathutils
argv = sys.argv[sys.argv.index("--")+1:]
glb, out = argv[0], argv[1]
bpy.ops.wm.read_homefile(use_empty=True)
bpy.ops.import_scene.gltf(filepath=glb)
objs = list(bpy.context.scene.objects)
arm = next((o for o in objs if o.type == "ARMATURE"), None)
meshes = [o for o in objs if o.type == "MESH"]
pts = [m.matrix_world @ mathutils.Vector(c) for m in meshes for c in m.bound_box]
mn = [min(p[i] for p in pts) for i in range(3)]; mx = [max(p[i] for p in pts) for i in range(3)]
info = {"objects": [(o.name, o.type, o.parent.name if o.parent else None, tuple(round(v,3) for v in o.scale)) for o in objs],
        "bbox_min": [round(v,3) for v in mn], "bbox_max": [round(v,3) for v in mx],
        "tris": sum(sum(len(p.vertices)-2 for p in m.data.polygons) for m in meshes),
        "actions": [(a.name, list(a.frame_range), len(a.fcurves)) for a in bpy.data.actions],
        "images": [(i.name, list(i.size)) for i in bpy.data.images],
        "materials": [m.name for m in bpy.data.materials]}
if arm:
    info["bones"] = [(b.name, b.parent.name if b.parent else None, [round(v,3) for v in (arm.matrix_world @ b.head_local)]) for b in arm.data.bones]
    info["nla"] = [(t.name, [s.name for s in t.strips]) for t in (arm.animation_data.nla_tracks if arm.animation_data else [])]
    info["active_action"] = arm.animation_data.action.name if arm.animation_data and arm.animation_data.action else None
json.dump(info, open(out, "w"), indent=1)
print("INSPECT_OK", out)
