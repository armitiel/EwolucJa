import bpy, mathutils
V = mathutils.Vector
bpy.ops.wm.open_mainfile(filepath=r"assets/postac/kroliczek/blender/kroliczek.blend")
arm = bpy.data.objects["kroliczek"]; mesh = bpy.data.objects["kroliczek_mesh"]
def ebb(tag):
    bpy.context.view_layer.update(); dg = bpy.context.evaluated_depsgraph_get(); me = mesh.evaluated_get(dg)
    pts = [me.matrix_world @ v.co for v in me.data.vertices]
    print("BB", tag, [round(min(p[i] for p in pts),2) for i in range(3)], [round(max(p[i] for p in pts),2) for i in range(3)])
ad = arm.animation_data
print("TRACKS", [(t.name, t.mute) for t in ad.nla_tracks], "action", ad.action.name if ad.action else None, "pose_pos", arm.data.pose_position)
for t in ad.nla_tracks: t.mute = True
ad.action = None; arm.data.pose_position = "REST"; ebb("REST")
arm.data.pose_position = "POSE"; ebb("POSE none")
r = arm.pose.bones["tripo::Root"]; print("ROOT pose", [round(v,3) for v in r.location], [round(v,3) for v in r.rotation_quaternion], [round(v,3) for v in r.scale], "mode", r.rotation_mode)
for n in ("hop","idle","walk"):
    ad.action = bpy.data.actions[n]
    for f in (1, 12):
        bpy.context.scene.frame_set(f); ebb(f"{n} f{f}")
    r = arm.pose.bones["tripo::Root"]; print("  ROOT", n, [round(v,3) for v in r.location], [round(v,3) for v in r.rotation_quaternion], [round(v,3) for v in r.scale])
print("MESHPARENT", mesh.parent_type, [round(v,3) for v in mesh.matrix_parent_inverse.translation], "arm", [round(v,3) for v in arm.location], round(arm.scale.x,3), [round(v,2) for v in arm.rotation_euler])
