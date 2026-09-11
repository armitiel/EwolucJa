import bpy, math, mathutils, os, json
V = mathutils.Vector
SRC = r"assets/postac/kroliczek/tripo/tripo-out/kroliczek-walk-d91ea2c1/model.glb"
bpy.ops.wm.read_homefile(use_empty=True); bpy.ops.import_scene.gltf(filepath=SRC)
for o in list(bpy.data.objects):
    if o.type == "MESH" and o.name.startswith("Icosphere"): bpy.data.objects.remove(o, do_unlink=True)
arm = next(o for o in bpy.data.objects if o.type == "ARMATURE"); mesh = next(o for o in bpy.data.objects if o.type == "MESH")
def ebb(tag):
    dg = bpy.context.evaluated_depsgraph_get(); me = mesh.evaluated_get(dg)
    pts = [me.matrix_world @ v.co for v in me.data.vertices]
    mn = [round(min(p[i] for p in pts),3) for i in range(3)]; mx = [round(max(p[i] for p in pts),3) for i in range(3)]
    print("BB", tag, mn, mx, "arm.loc", [round(v,3) for v in arm.location], "arm.scale", round(arm.scale.x,3), "mesh.parent", mesh.parent.name if mesh.parent else None, "mesh.matrix_world.z", round(mesh.matrix_world.translation.z,3))
arm.animation_data.action = None
ebb("import(no action)")
arm.animation_data.action = bpy.data.actions[0]; bpy.context.scene.frame_set(1); ebb("walk f1")
arm.animation_data.action = None; bpy.context.view_layer.update(); ebb("no action again")
arm.data.pose_position = 'REST'; bpy.context.view_layer.update(); ebb("REST")
print("MODS", [(m.type, m.object.name if getattr(m,'object',None) else None) for m in mesh.modifiers])
print("NLA", [(t.name, t.mute, [s.name for s in t.strips]) for t in arm.animation_data.nla_tracks])
