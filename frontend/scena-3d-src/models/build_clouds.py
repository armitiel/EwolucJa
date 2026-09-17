# EwolucJA — gra edukacyjna dla dzieci.
# © 2026 Amitiel Angelisme. Wszelkie prawa zastrzeżone.
# Powstało w ramach projektu Stowarzyszenia na Rzecz Edukacji „Pomost”.
# Prawa autorskie należą do autora. Pełna nota: LICENSE.
import bpy, json, math
from pathlib import Path
root=Path(__file__).resolve().parent
variants=[
[(-.72,0,0,.43),(-.22,.19,0,.60),(.38,.06,0,.49),(.83,-.04,0,.32)],
[(-.58,0,0,.40),(-.06,.20,0,.59),(.51,.02,0,.43)],
[(-.91,-.03,0,.35),(-.43,.13,0,.49),(.12,.26,0,.61),(.65,.05,0,.43),(.97,-.06,0,.27)]]
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)
models=[]
for idx, lobes in enumerate(variants):
    parts=[]
    for x,y,z,r in lobes:
        bpy.ops.mesh.primitive_uv_sphere_add(segments=24,ring_count=16,radius=r,location=(x,y,z))
        obj=bpy.context.object
        obj.scale=(1,.86,.68)
        bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
        # A soft underside, not coplanar overlapping caps.
        for v in obj.data.vertices:
            world_y=v.co.y+y
            if world_y<-.14: v.co.y=-.14+.11*math.tanh((world_y+.14)/.11)-y
        parts.append(obj)
    bpy.ops.object.select_all(action='DESELECT')
    for o in parts:o.select_set(True)
    bpy.context.view_layer.objects.active=parts[0]
    bpy.ops.object.join()
    obj=bpy.context.object
    bpy.ops.object.transform_apply(location=True,rotation=True,scale=True)
    obj.name=f'Cloud_{idx+1:02d}'
    obj.data.remesh_voxel_size=.045
    bpy.ops.object.voxel_remesh()
    mod=obj.modifiers.new('Soft union','SMOOTH');mod.factor=1.3;mod.iterations=5
    bpy.ops.object.modifier_apply(modifier=mod.name)
    mod=obj.modifiers.new('Low poly','DECIMATE');mod.ratio=.16
    bpy.ops.object.modifier_apply(modifier=mod.name)
    obj.data.calc_loop_triangles()
    positions=[];normals=[]
    for tri in obj.data.loop_triangles:
        for vi in tri.vertices:
            v=obj.data.vertices[vi]
            positions.extend(round(c,5) for c in v.co)
            normals.extend(round(c,5) for c in v.normal)
    models.append(dict(position=positions,normal=normals))
    for poly in obj.data.polygons:poly.use_smooth=True
    print(obj.name,len(obj.data.loop_triangles),'triangles')
(root/'clouds.json').write_text(json.dumps(models,separators=(',',':')))
bpy.ops.wm.save_as_mainfile(filepath=str(root/'clouds.blend'))

