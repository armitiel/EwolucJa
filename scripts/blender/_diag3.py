import bpy, math, os
bpy.ops.wm.open_mainfile(filepath=r"assets/postac/kroliczek/blender/kroliczek.blend")
sc = bpy.context.scene; arm = bpy.data.objects["kroliczek"]; ad = arm.animation_data
for t in ad.nla_tracks: t.mute = True
cam = bpy.data.objects.new("cam", bpy.data.cameras.new("cam")); sc.collection.objects.link(cam); sc.camera = cam; cam.data.lens = 50
sc.render.engine = "BLENDER_WORKBENCH"; sc.display.shading.light = "STUDIO"; sc.display.shading.color_type = "TEXTURE"
def shot(name, pos, rot):
    cam.location = pos; cam.rotation_euler = [math.radians(v) for v in rot]
    sc.render.filepath = os.path.join(r"C:\Users\DELL\EwolucJA\tmp\kroliczek_prev", name + ".png"); bpy.ops.render.render(write_still=True)
sc.render.resolution_x = sc.render.resolution_y = 384
SIDE = ((1.4, 0, 0.25), (90, 0, 90)); FRONT = ((0, -1.4, 0.25), (90, 0, 0))
arm.data.pose_position = "REST"; ad.action = None
shot("rest_side", *SIDE); shot("rest_front", *FRONT)
arm.data.pose_position = "POSE"; ad.action = bpy.data.actions["walk"]
for f in (1, 18, 30, 45):
    sc.frame_set(f); shot(f"walk{f:02d}_side", *SIDE)
sc.frame_set(18); shot("walk18_front", *FRONT)
ad.action = bpy.data.actions["hop"]; sc.frame_set(1); shot("hop01_side", *SIDE); sc.frame_set(12); shot("hop12_side", *SIDE)
print("DIAG3_OK")
