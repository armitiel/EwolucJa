# blender -b -P scripts/blender/kroliczek_build.py
# Etap C pipeline'u: normalizacja, klipy (idle/hop/walk), tekstury 512, eksport glb + podglad.
import bpy, math, mathutils, os, json
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
ID = "kroliczek"; SCALE_M = 0.45; TEX = 512; FPS = 24
SRC = os.path.join(ROOT, "assets/postac", ID, "tripo/tripo-out/kroliczek-walk-d91ea2c1/model.glb")
OUT = os.path.join(ROOT, "assets/postac", ID, "export", ID + ".glb")
BLEND = os.path.join(ROOT, "assets/postac", ID, "blender", ID + ".blend")
PREV = os.path.join(ROOT, "tmp", "kroliczek_prev")
V = mathutils.Vector

bpy.ops.wm.read_homefile(use_empty=True)
sc = bpy.context.scene; sc.render.fps = FPS
bpy.ops.import_scene.gltf(filepath=SRC)
# --- sprzatanie: pomocnicza sfera Tripo ---
for o in list(bpy.data.objects):
    if o.type == "MESH" and o.name.startswith("Icosphere"):
        bpy.data.objects.remove(o, do_unlink=True)
arm = next(o for o in bpy.data.objects if o.type == "ARMATURE")
mesh = next(o for o in bpy.data.objects if o.type == "MESH")
arm.name = ID; mesh.name = ID + "_mesh"; arm.data.name = ID + "_rig"; mesh.data.name = ID + "_mesh"

# --- akcje Tripo zawieraja klucze na OBIEKCIE armatury (location/scale wezla) -
# nadpisywalyby nasza skale i pivot przy kazdej ewaluacji. Zostawiamy tylko kanaly kosci.
for a in bpy.data.actions:
    for fc in [fc for fc in a.fcurves if not fc.data_path.startswith("pose.bones")]:
        a.fcurves.remove(fc)
if arm.animation_data and arm.animation_data.action: arm.animation_data.action = None

# --- orientacja: przod = -Y (glTF -> +Z w Three.js). Kierunek: Root -> Head_0 ---
head = arm.data.bones["tripo::Head_0"].head_local; root = arm.data.bones["tripo::Root"].head_local
ang = math.atan2(head.y - root.y, head.x - root.x)          # obecny kat przodu
# UWAGA: importer glTF ustawia rotation_mode=QUATERNION - bez przelaczenia na XYZ
# przypisanie rotation_euler jest ignorowane (tak zgubilismy 3 przebiegi). Render front/side
# pokazal, ze surowy model Tripo (orientation=align_image) patrzy w +X -> obrot -90 st. wokol Z.
arm.rotation_mode = "XYZ"
arm.rotation_euler = (0, 0, -math.pi/2)
bpy.context.view_layer.update()

def bbox():
    dg = bpy.context.evaluated_depsgraph_get(); me = mesh.evaluated_get(dg)
    pts = [me.matrix_world @ v.co for v in me.data.vertices]
    return V([min(p[i] for p in pts) for i in range(3)]), V([max(p[i] for p in pts) for i in range(3)])
# pomiar w pozie spoczynkowej, bez akcji
arm.animation_data.action = None
for t in arm.animation_data.nla_tracks: t.mute = True
arm.data.pose_position = "REST"; bpy.context.view_layer.update()
mn, mx = bbox(); h = mx.z - mn.z; s = SCALE_M / h
arm.scale = (s, s, s); bpy.context.view_layer.update()
mn, mx = bbox()
arm.location -= V(((mx.x+mn.x)/2, (mx.y+mn.y)/2, mn.z)); bpy.context.view_layer.update()
print("ROT after set", [round(v,3) for v in arm.rotation_euler], "ang", round(ang,3), "objfc", [(a.name, [fc.data_path for fc in a.fcurves if not fc.data_path.startswith("pose.bones")]) for a in bpy.data.actions])
mn, mx = bbox(); print("NORMALIZED bbox", [round(v,3) for v in mn], [round(v,3) for v in mx], "scale", round(s,4))
arm.data.pose_position = "POSE"
# UWAGA: transformacje zostaja na obiekcie armatury (glTF zapisze je jako transform wezla);
# transform_apply na armaturze z rigiem Tripo przesuwal mesh o +1 m (bind pose) - nie uzywac.

# --- material: tylko Base Color (jak fox.glb), tekstury 512 ---
mat = mesh.data.materials[0]; nt = mat.node_tree
bsdf = next(n for n in nt.nodes if n.type == "BSDF_PRINCIPLED")
for inp in ("Normal", "Metallic", "Roughness"):
    for l in list(bsdf.inputs[inp].links): nt.links.remove(l)
bsdf.inputs["Roughness"].default_value = 0.85; bsdf.inputs["Metallic"].default_value = 0.0
for n in [n for n in nt.nodes if n.type in ("TEX_IMAGE","NORMAL_MAP","SEPARATE_COLOR") and not (n.type=="TEX_IMAGE" and n.outputs["Color"].is_linked)]:
    nt.nodes.remove(n)
for img in list(bpy.data.images):
    if img.users == 0: bpy.data.images.remove(img)
for img in bpy.data.images:
    if img.size[0] > TEX: img.scale(TEX, TEX)

# --- klipy ---
walk = bpy.data.actions[0]; walk.name = "walk"; walk.use_fake_user = True
pb = arm.pose.bones
def axis_local(bone, world_axis):
    M = (arm.matrix_world @ bone.bone.matrix_local).to_3x3()
    return (M.inverted() @ V(world_axis)).normalized()
rootb = pb["tripo::Root"]; rootb.rotation_mode = "QUATERNION"
UP = axis_local(rootb, (0,0,1)); SIDE = axis_local(rootb, (1,0,0))
EARS = [pb[n] for n in ("tripo::Head_1","tripo::Head_2","bone_9","bone_10") if n in pb]
for e in EARS: e.rotation_mode = "QUATERNION"

# Poza bazowa: identycznosc = poza bindowania Tripo (rozstawione lapy), NIE stanie.
# Bierzemy poze z klatki walk, w ktorej korpus jest najnizej (kontakt z ziemia) i budujemy na niej idle/hop.
def snapshot_pose():
    return {b.name: (b.location.copy(), b.rotation_quaternion.copy() if b.rotation_mode=="QUATERNION" else b.rotation_euler.to_quaternion(), b.scale.copy()) for b in pb}
for b in pb: b.location=(0,0,0); b.rotation_mode='QUATERNION'; b.rotation_quaternion=(1,0,0,0); b.scale=(1,1,1)
BASE = snapshot_pose()  # rest = poprawne stanie (sprawdzone renderem); walk ma jedna lape wysunieta
for b in pb: b.rotation_mode = "QUATERNION"
def clear_pose():
    for b in pb:
        loc, rot, scl = BASE[b.name]; b.location = loc; b.rotation_quaternion = rot; b.scale = scl
def key_all(f):
    for b in pb:
        b.keyframe_insert("location", frame=f); b.keyframe_insert("rotation_quaternion", frame=f)
def key_root(f, dz, pitch_deg, ears_deg=0.0):
    clear_pose()
    bl, br, bs = BASE[rootb.name]
    rootb.location = bl + UP * (dz / s)
    rootb.rotation_quaternion = br @ mathutils.Quaternion(SIDE, math.radians(pitch_deg))
    for e in EARS:
        el, er, es = BASE[e.name]
        e.rotation_quaternion = er @ mathutils.Quaternion(axis_local(e, (1,0,0)), math.radians(ears_deg))
    key_all(f)

def new_action(name):
    act = bpy.data.actions.new(name); act.use_fake_user = True
    if arm.animation_data is None: arm.animation_data_create()
    arm.animation_data.action = act; return act

# hop: 20 klatek, petla, w miejscu (gra przesuwa)  dz w metrach, pitch: + = nos w gore
hop = new_action("hop")
for f, dz, pitch, ears in [(1,0.0,0,0),(4,-0.03,-4,6),(8,0.10,14,-14),(12,0.15,4,-8),(16,0.02,-10,12),(19,-0.01,-2,4),(21,0.0,0,0)]:
    key_root(f, dz, pitch, ears)
hop.frame_range = (1, 21)
# idle: 48 klatek, oddech + drgnienie ucha
idle = new_action("idle")
for f, dz, pitch, ears in [(1,0,0,0),(12,0.006,1,0),(24,0,0,0),(30,0.002,0,-6),(34,0.002,0,3),(38,0.002,0,0),(48,0,0,0)]:
    key_root(f, dz, pitch, ears)
idle.frame_range = (1, 48)
for act in (hop, idle):
    for fc in act.fcurves:
        for k in fc.keyframe_points: k.interpolation = "BEZIER"; k.easing = "AUTO"
        m = fc.modifiers.new("CYCLES")

# --- NLA: jedna sciezka na klip ---
ad = arm.animation_data
for t in list(ad.nla_tracks): ad.nla_tracks.remove(t)
for a in (idle, hop, walk):
    tr = ad.nla_tracks.new(); tr.name = a.name
    st = tr.strips.new(a.name, int(a.frame_range[0]), a); st.name = a.name
ad.action = None
sc.frame_start, sc.frame_end = 1, 48

# --- eksport ---
os.makedirs(os.path.dirname(OUT), exist_ok=True); os.makedirs(os.path.dirname(BLEND), exist_ok=True)
bpy.ops.object.select_all(action="DESELECT"); arm.select_set(True); mesh.select_set(True)
bpy.ops.export_scene.gltf(filepath=OUT, export_format="GLB", use_selection=True,
    export_yup=True, export_apply=True, export_texcoords=True, export_normals=True, export_tangents=False,
    export_materials="EXPORT", export_image_format="WEBP", export_image_quality=85,
    export_animations=True, export_animation_mode="NLA_TRACKS", export_frame_range=True,
    export_force_sampling=True, export_optimize_animation_size=True, export_bake_animation=False,
    export_anim_single_armature=True, export_reset_pose_bones=True, export_rest_position_armature=True,
    export_skins=True, export_all_influences=False, export_morph=False, export_lights=False, export_cameras=False,
    export_extras=False)
bpy.ops.wm.save_as_mainfile(filepath=BLEND)

# --- podglad: Workbench, 4 klatki hop ---
os.makedirs(PREV, exist_ok=True)
cam = bpy.data.objects.new("cam", bpy.data.cameras.new("cam")); sc.collection.objects.link(cam)
cam.location = (0.75, -0.95, 0.5); cam.rotation_euler = (math.radians(68), 0, math.radians(38)); sc.camera = cam
cam.data.lens = 50
sc.render.engine = "BLENDER_WORKBENCH"; sc.display.shading.light = "STUDIO"; sc.display.shading.color_type = "TEXTURE"
sc.render.resolution_x = sc.render.resolution_y = 512; sc.render.film_transparent = False
ad.action = hop
for f in (1, 8, 12, 16):
    sc.frame_set(f); sc.render.filepath = os.path.join(PREV, f"hop_{f:02d}.png"); bpy.ops.render.render(write_still=True)
ad.action = None; sc.frame_set(1)
for name, pos, rot in (("rest_front", (0, -1.3, 0.25), (90, 0, 0)), ("rest_side", (1.3, 0, 0.25), (90, 0, 90))):
    cam.location = pos; cam.rotation_euler = [math.radians(v) for v in rot]
    sc.render.filepath = os.path.join(PREV, name + ".png"); bpy.ops.render.render(write_still=True)
mn, mx = bbox()
print("ROT at end", [round(v,3) for v in arm.rotation_euler], [round(v,3) for v in arm.location], round(arm.scale.x,3))
print("BUILD_OK", json.dumps({"bbox_min": [round(v,3) for v in mn], "bbox_max": [round(v,3) for v in mx],
      "actions": [(a.name, list(a.frame_range)) for a in bpy.data.actions], "images": [(i.name, list(i.size)) for i in bpy.data.images],
      "tris": sum(len(p.vertices)-2 for p in mesh.data.polygons)}))
