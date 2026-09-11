import bpy
import os
import sys


SOURCE_ACTION = "fox_pickup"
EDIT_ACTION = "fox_pickup_edit"
RIG_NAME = "Armature"

EDIT_BONES = {
    "L_Clavicle",
    "L_Upperarm",
    "L_Forearm",
    "L_Hand",
    "R_Clavicle",
    "R_Upperarm",
    "R_Forearm",
    "R_Hand",
}


def keep_sparse_keys(fcurve, start, end, step=8):
    values = {frame: fcurve.evaluate(frame) for frame in range(start, end + 1, step)}
    values[start] = fcurve.evaluate(start)
    values[end] = fcurve.evaluate(end)
    fcurve.keyframe_points.clear()
    for frame in sorted(values):
        point = fcurve.keyframe_points.insert(frame, values[frame], options={"FAST"})
        point.interpolation = "BEZIER"
        point.handle_left_type = "AUTO_CLAMPED"
        point.handle_right_type = "AUTO_CLAMPED"
    fcurve.update()


def main():
    output_path = os.path.abspath(sys.argv[-1])
    scene = bpy.context.scene
    rig = bpy.data.objects[RIG_NAME]
    base = bpy.data.actions[SOURCE_ACTION]

    old = bpy.data.actions.get(EDIT_ACTION)
    if old:
        bpy.data.actions.remove(old)
    edit = base.copy()
    edit.name = EDIT_ACTION
    edit.use_fake_user = True

    start = max(1, int(scene.frame_start))
    end = int(scene.frame_end)
    for curve in edit.fcurves:
        if any(f'pose.bones["{bone}"]' in curve.data_path for bone in EDIT_BONES):
            keep_sparse_keys(curve, start, end, step=8)

    rig.animation_data_create()
    for track in rig.animation_data.nla_tracks:
        track.mute = True
    rig.animation_data.action = edit

    # Hide the DeepMotion reference by default, but keep it in the file so it
    # can be revealed for comparison at any time.
    for name in ("RootNode", "Mannequin_Female"):
        obj = bpy.data.objects.get(name)
        if obj:
            obj.hide_viewport = True
            obj.hide_render = True

    # Timeline landmarks for the five useful editing phases.
    scene.timeline_markers.clear()
    for name, frame in (
        ("START", start),
        ("SIEGANIE", 95),
        ("NAJNIZEJ", 155),
        ("PODNIESIENIE", 215),
        ("KONIEC", end),
    ):
        scene.timeline_markers.new(name, frame=frame)

    scene.frame_set(155)
    bpy.context.view_layer.objects.active = rig
    rig.select_set(True)
    for obj in bpy.context.selected_objects:
        if obj != rig:
            obj.select_set(False)

    # Make the armature easy to select through the mesh and preselect the bones
    # that are most important for fixing torso intersections.
    rig.show_in_front = True
    rig.data.display_type = "OCTAHEDRAL"
    bpy.ops.object.mode_set(mode="POSE")
    for bone in rig.data.bones:
        bone.select = bone.name in {"L_Clavicle", "L_Upperarm", "R_Clavicle", "R_Upperarm"}
    rig.data.bones.active = rig.data.bones.get("L_Upperarm")

    if bpy.data.workspaces.get("Animation"):
        bpy.context.window.workspace = bpy.data.workspaces["Animation"]

    bpy.ops.wm.save_as_mainfile(filepath=output_path)
    print(f"CODEX_EDIT_FILE={output_path}")


if __name__ == "__main__":
    main()
