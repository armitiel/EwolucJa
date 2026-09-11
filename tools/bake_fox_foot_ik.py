import bpy
import json
import math
import os
import sys
from mathutils import Matrix


RIG_NAME = "Armature"
ACTION_NAME = "fox_pickup"


def hierarchy_depth(pose_bone):
    depth = 0
    parent = pose_bone.parent
    while parent:
        depth += 1
        parent = parent.parent
    return depth


def point_world(obj, point):
    return obj.matrix_world @ point


def foot_ranges(scene, rig):
    values = {name: [] for name in ("L_Foot", "R_Foot")}
    for frame in range(scene.frame_start, scene.frame_end + 1):
        scene.frame_set(frame)
        bpy.context.view_layer.update()
        for name in values:
            values[name].append(tuple(point_world(rig, rig.pose.bones[name].head)))
    return {
        name: [max(axis) - min(axis) for axis in zip(*samples)]
        for name, samples in values.items()
    }


def main():
    output_path = os.path.abspath(sys.argv[-1])
    scene = bpy.context.scene
    rig = bpy.data.objects[RIG_NAME]
    action = bpy.data.actions[ACTION_NAME]
    rig.animation_data_create()
    for track in rig.animation_data.nla_tracks:
        track.mute = True
    rig.animation_data.action = action

    before = foot_ranges(scene, rig)
    scene.frame_set(scene.frame_start)
    bpy.context.view_layer.update()

    helpers = []
    constraints = []
    for side in ("L", "R"):
        foot = rig.pose.bones[f"{side}_Foot"]
        calf = rig.pose.bones[f"{side}_Calf"]
        helper = bpy.data.objects.new(f"CODEX_{side}_FootLock", None)
        scene.collection.objects.link(helper)
        helper.empty_display_type = "PLAIN_AXES"
        helper.empty_display_size = 0.05
        helper.matrix_world.translation = point_world(rig, foot.head)
        helpers.append(helper)

        ik = calf.constraints.new("IK")
        ik.name = "CODEX_FootLock"
        ik.target = helper
        ik.chain_count = 2
        ik.use_tail = True
        ik.use_stretch = False
        constraints.append((calf, ik))

    # Capture the evaluated visual pose while the temporary IK pins both ankles.
    visual = {}
    for frame in range(scene.frame_start, scene.frame_end + 1):
        scene.frame_set(frame)
        bpy.context.view_layer.update()
        visual[frame] = {bone.name: bone.matrix.copy() for bone in rig.pose.bones}

    for bone, constraint in constraints:
        bone.constraints.remove(constraint)
    for helper in helpers:
        bpy.data.objects.remove(helper, do_unlink=True)

    action.name = "fox_pickup_pre_ik"
    old_final = bpy.data.actions.get(ACTION_NAME)
    if old_final and old_final != action:
        bpy.data.actions.remove(old_final)
    final = bpy.data.actions.new(ACTION_NAME)
    final.use_fake_user = True
    rig.animation_data.action = final

    ordered_bones = sorted(rig.pose.bones, key=hierarchy_depth)
    for frame in range(scene.frame_start, scene.frame_end + 1):
        scene.frame_set(frame)
        for bone in rig.pose.bones:
            bone.matrix_basis = Matrix.Identity(4)
        bpy.context.view_layer.update()

        for bone in ordered_bones:
            bone.rotation_mode = "QUATERNION"
            bone.matrix = visual[frame][bone.name]
            bpy.context.view_layer.update()

        for bone in rig.pose.bones:
            bone.keyframe_insert(data_path="location", frame=frame, group=bone.name)
            bone.keyframe_insert(data_path="rotation_quaternion", frame=frame, group=bone.name)
            bone.keyframe_insert(data_path="scale", frame=frame, group=bone.name)

    if hasattr(final, "fcurves"):
        curves = final.fcurves
    else:
        curves = []
    for curve in curves:
        for key in curve.keyframe_points:
            key.interpolation = "LINEAR"

    after = foot_ranges(scene, rig)
    scene.frame_set(scene.frame_start)
    bpy.ops.wm.save_as_mainfile(filepath=output_path)
    print("CODEX_FOOT_IK=" + json.dumps({"before": before, "after": after, "output": output_path}))


if __name__ == "__main__":
    main()
