import bpy
import os
import sys
from mathutils import Vector


output_dir = os.path.abspath(sys.argv[-1])
os.makedirs(output_dir, exist_ok=True)

scene = bpy.context.scene
scene.render.engine = "BLENDER_WORKBENCH"
scene.display.shading.light = "STUDIO"
scene.display.shading.show_shadows = True
scene.display.shading.show_cavity = True
scene.display.shading.cavity_type = "WORLD"
scene.render.resolution_x = 600
scene.render.resolution_y = 600
scene.render.resolution_percentage = 100
scene.render.image_settings.file_format = "PNG"
scene.render.film_transparent = False

target = bpy.data.objects["Armature"]
fox_meshes = [obj for obj in bpy.data.objects if obj.type == "MESH" and obj.parent == target]

for obj in bpy.data.objects:
    if obj.type == "MESH" and obj not in fox_meshes:
        obj.hide_render = True
    if obj.type == "ARMATURE":
        obj.hide_render = True

camera_data = bpy.data.cameras.new("CODEX_PreviewCamera")
camera = bpy.data.objects.new("CODEX_PreviewCamera", camera_data)
scene.collection.objects.link(camera)
scene.camera = camera
camera.data.type = "ORTHO"


def evaluated_bounds():
    depsgraph = bpy.context.evaluated_depsgraph_get()
    points = []
    for obj in fox_meshes:
        evaluated = obj.evaluated_get(depsgraph)
        mesh = evaluated.to_mesh()
        try:
            points.extend([evaluated.matrix_world @ vertex.co for vertex in mesh.vertices])
        finally:
            evaluated.to_mesh_clear()
    minimum = Vector((min(p.x for p in points), min(p.y for p in points), min(p.z for p in points)))
    maximum = Vector((max(p.x for p in points), max(p.y for p in points), max(p.z for p in points)))
    return minimum, maximum


frames = [1, 95, 155, 215, 290]
for frame in frames:
    scene.frame_set(frame)
    bpy.context.view_layer.update()
    minimum, maximum = evaluated_bounds()
    center = (minimum + maximum) * 0.5
    extent = maximum - minimum
    distance = max(extent.length * 2.0, 3.0)
    camera.location = center + Vector((distance * 0.55, -distance, distance * 0.35))
    camera.rotation_euler = (center - camera.location).to_track_quat("-Z", "Y").to_euler()
    camera.data.ortho_scale = max(extent.x, extent.y, extent.z) * 1.35
    scene.render.filepath = os.path.join(output_dir, f"frame_{frame:03d}.png")
    bpy.ops.render.render(write_still=True)

print("CODEX_PREVIEW=" + output_dir)
