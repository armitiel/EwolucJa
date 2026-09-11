import bpy
import json
import math
import os
import sys
from mathutils import Matrix, Vector


SOURCE_RIG = "RootNode"
TARGET_RIG = "Armature"
SOURCE_ACTION = "podnoszenie_RootNode"
LOCKED_SOURCE_ACTION = "podnoszenie_footlock"
TARGET_ACTION = "fox_pickup"

# Source DeepMotion bone -> target Lisek bone.
BONE_MAP = {
    "hips_JNT": "Hip",
    "spine_JNT": "Waist",
    "spine1_JNT": "Spine01",
    "spine2_JNT": "Spine02",
    "neck_JNT": "NeckTwist01",
    "head_JNT": "Head",
    "l_shoulder_JNT": "L_Clavicle",
    "l_arm_JNT": "L_Upperarm",
    "l_forearm_JNT": "L_Forearm",
    "l_hand_JNT": "L_Hand",
    "r_shoulder_JNT": "R_Clavicle",
    "r_arm_JNT": "R_Upperarm",
    "r_forearm_JNT": "R_Forearm",
    "r_hand_JNT": "R_Hand",
    "l_upleg_JNT": "L_Thigh",
    "l_leg_JNT": "L_Calf",
    "l_foot_JNT": "L_Foot",
    "r_upleg_JNT": "R_Thigh",
    "r_leg_JNT": "R_Calf",
    "r_foot_JNT": "R_Foot",
}


def action_fcurves(action):
    # Blender 4.x actions expose fcurves directly. Keep a small compatibility
    # fallback for layered actions used by newer Blender versions.
    if hasattr(action, "fcurves"):
        return list(action.fcurves)
    curves = []
    for layer in getattr(action, "layers", []):
        for strip in getattr(layer, "strips", []):
            for bag in getattr(strip, "channelbags", []):
                curves.extend(list(bag.fcurves))
    return curves


def mute_nla(obj):
    if not obj.animation_data:
        return
    for track in obj.animation_data.nla_tracks:
        track.mute = True


def ensure_action(obj, action):
    obj.animation_data_create()
    mute_nla(obj)
    obj.animation_data.action = action


def bone_head_armature_space(obj, name):
    return obj.pose.bones[name].head.copy()


def average_foot_position(obj, left_name, right_name):
    return (bone_head_armature_space(obj, left_name) + bone_head_armature_space(obj, right_name)) * 0.5


def remove_action_if_present(name):
    old = bpy.data.actions.get(name)
    if old:
        for obj in bpy.data.objects:
            if obj.animation_data and obj.animation_data.action == old:
                obj.animation_data.action = None
        bpy.data.actions.remove(old)


def lock_source_feet(scene, source, base_action, start, end):
    remove_action_if_present(LOCKED_SOURCE_ACTION)
    locked = base_action.copy()
    locked.name = LOCKED_SOURCE_ACTION
    locked.use_fake_user = True
    ensure_action(source, locked)

    scene.frame_set(start)
    bpy.context.view_layer.update()
    reference = average_foot_position(source, "l_foot_JNT", "r_foot_JNT")

    before = []
    corrections = []
    for frame in range(start, end + 1):
        scene.frame_set(frame)
        bpy.context.view_layer.update()
        current = average_foot_position(source, "l_foot_JNT", "r_foot_JNT")
        before.append(tuple(current))
        correction = reference - current
        corrections.append(tuple(correction))

        hips = source.pose.bones["hips_JNT"]
        corrected_matrix = hips.matrix.copy()
        corrected_matrix.translation += correction
        hips.matrix = corrected_matrix
        hips.keyframe_insert(data_path="location", frame=frame, group="hips_JNT")

    for curve in action_fcurves(locked):
        for point in curve.keyframe_points:
            point.interpolation = "LINEAR"

    # Verify the baked correction after reevaluation.
    after = []
    for frame in range(start, end + 1):
        scene.frame_set(frame)
        bpy.context.view_layer.update()
        after.append(tuple(average_foot_position(source, "l_foot_JNT", "r_foot_JNT")))

    return locked, reference, before, after, corrections


def hierarchy_depth(pose_bone):
    depth = 0
    parent = pose_bone.parent
    while parent:
        depth += 1
        parent = parent.parent
    return depth


def matrix_with_rotation_and_translation(rotation, translation):
    matrix = rotation.to_matrix().to_4x4()
    matrix.translation = translation
    return matrix


def retarget_to_fox(scene, source, target, start, end):
    remove_action_if_present(TARGET_ACTION)
    action = bpy.data.actions.new(TARGET_ACTION)
    action.use_fake_user = True
    ensure_action(target, action)

    mapped = [(source_name, target_name) for source_name, target_name in BONE_MAP.items()]
    mapped.sort(key=lambda pair: hierarchy_depth(target.pose.bones[pair[1]]))

    source_world_rot = source.matrix_world.to_quaternion()
    target_world_rot_inv = target.matrix_world.to_quaternion().inverted()
    target_rest_world_rot = {
        target_name: (target.matrix_world @ target.data.bones[target_name].matrix_local).to_quaternion()
        for _, target_name in mapped
    }
    source_rest_world_rot = {
        source_name: (source.matrix_world @ source.data.bones[source_name].matrix_local).to_quaternion()
        for source_name, _ in mapped
    }

    foot_reference = None
    foot_samples = []

    for frame in range(start, end + 1):
        scene.frame_set(frame)

        # Start every sample from the fox rest pose. This avoids accumulating
        # transforms while frames are sampled out of an empty target action.
        for pose_bone in target.pose.bones:
            pose_bone.matrix_basis = Matrix.Identity(4)
        bpy.context.view_layer.update()

        for source_name, target_name in mapped:
            src_pose = source.pose.bones[source_name]
            dst_pose = target.pose.bones[target_name]

            current_source_world_rot = (source.matrix_world @ src_pose.matrix).to_quaternion()
            delta_world = current_source_world_rot @ source_rest_world_rot[source_name].inverted()
            desired_world_rot = delta_world @ target_rest_world_rot[target_name]
            desired_armature_rot = target_world_rot_inv @ desired_world_rot

            current_translation = dst_pose.matrix.translation.copy()
            dst_pose.matrix = matrix_with_rotation_and_translation(desired_armature_rot, current_translation)
            bpy.context.view_layer.update()

        # Lock the fox feet after applying all leg rotations. Moving Hip by the
        # shared foot error preserves the crouch while removing global sliding.
        current_feet = average_foot_position(target, "L_Foot", "R_Foot")
        if foot_reference is None:
            foot_reference = current_feet.copy()
        correction = foot_reference - current_feet
        hip = target.pose.bones["Hip"]
        hip_matrix = hip.matrix.copy()
        hip_matrix.translation += correction
        hip.matrix = hip_matrix
        bpy.context.view_layer.update()

        for _, target_name in mapped:
            pose_bone = target.pose.bones[target_name]
            pose_bone.rotation_mode = "QUATERNION"
            pose_bone.keyframe_insert(data_path="rotation_quaternion", frame=frame, group=target_name)
        hip.keyframe_insert(data_path="location", frame=frame, group="Hip")

        foot_samples.append(tuple(average_foot_position(target, "L_Foot", "R_Foot")))

    for curve in action_fcurves(action):
        for point in curve.keyframe_points:
            point.interpolation = "LINEAR"

    return action, foot_reference, foot_samples


def vector_range(samples):
    axes = list(zip(*samples))
    return [max(axis) - min(axis) for axis in axes]


def main():
    if len(sys.argv) < 2:
        raise RuntimeError("Pass an output .blend path after --")
    output_path = os.path.abspath(sys.argv[-1])

    scene = bpy.context.scene
    source = bpy.data.objects[SOURCE_RIG]
    target = bpy.data.objects[TARGET_RIG]
    original = bpy.data.actions[SOURCE_ACTION]

    start = max(1, int(math.floor(original.frame_range[0])))
    end = int(math.ceil(original.frame_range[1]))
    scene.frame_start = start
    scene.frame_end = end

    locked, source_ref, source_before, source_after, corrections = lock_source_feet(
        scene, source, original, start, end
    )
    target_action, target_ref, target_samples = retarget_to_fox(
        scene, source, target, start, end
    )

    # Keep the useful actions active in the saved deliverable.
    ensure_action(source, locked)
    ensure_action(target, target_action)
    scene.frame_set(start)

    report = {
        "input": bpy.data.filepath,
        "output": output_path,
        "frame_range": [start, end],
        "source_action": locked.name,
        "target_action": target_action.name,
        "source_average_foot_range_before": vector_range(source_before),
        "source_average_foot_range_after": vector_range(source_after),
        "target_average_foot_range": vector_range(target_samples),
        "max_source_correction": [
            max(abs(c[i]) for c in corrections) for i in range(3)
        ],
    }

    bpy.ops.wm.save_as_mainfile(filepath=output_path)
    print("CODEX_RETARGET=" + json.dumps(report))


if __name__ == "__main__":
    main()
