/** Three fused, editable Blender clouds. Geometry is bundled, with no extra requests. */
import { BufferGeometry, Color, Float32BufferAttribute, Group, Mesh, MeshLambertMaterial } from 'three';
import modele from '../models/clouds.json';

function geometria(model) {
  const g = new BufferGeometry();
  g.setAttribute('position', new Float32BufferAttribute(model.position, 3));
  g.setAttribute('normal', new Float32BufferAttribute(model.normal, 3));
  const colors = [];
  const bottom = new Color(0xdceafb), top = new Color(0xfffdf5), c = new Color();
  for (let i = 0; i < model.position.length; i += 3) {
    const h = Math.max(0, Math.min(1, (model.position[i+1] + .25) / .95));
    c.copy(bottom).lerp(top, Math.sqrt(h));
    colors.push(c.r,c.g,c.b);
  }
  g.setAttribute('color', new Float32BufferAttribute(colors,3));
  g.computeBoundingSphere();
  return g;
}

export const CHMURY = {
  ile: 4, skalaOd: .40, skalaDo: .58,
  tempoOd: .022, tempoDo: .028, glebokosc: -45,
};

export class Chmury {
  constructor(opcje = {}) {
    const C = this.C = { ...CHMURY, ...opcje };
    this.grupa = new Group();
    this.grupa.name = 'chmury';
    // Ambient transmission keeps the underside pale, without transparent shells.
    this.material = new MeshLambertMaterial({ vertexColors: true,
      emissive: 0xc4d9ed, emissiveIntensity: .65, flatShading: false });
    this.geometrie = modele.map(geometria);
    let seed = 20260912;
    const los = () => (seed = seed * 16807 % 2147483647) / 2147483647;
    this.sztuki = [];
    for (let i=0; i<C.ile; i++) {
      const mesh = new Mesh(this.geometrie[i%3], this.material);
      mesh.frustumCulled = false;
      mesh.rotation.set(.08, (los()-.5)*.28, (los()-.5)*.055);
      const skala = C.skalaOd + los()*(C.skalaDo-C.skalaOd);
      this.grupa.add(mesh);
      this.sztuki.push({mesh,skala,
        x:-1.15+(i+.5)*2.3/C.ile,
        postep:(i+.4)/C.ile,
        tempo:C.tempoOd+los()*(C.tempoDo-C.tempoOd)});
    }
  }
  podepnijDoKamery(camera) { camera.add(this.grupa); this.kamera=camera; }
  aktualizuj(dt,stan,predkosc=0) {
    const k=this.kamera;
    if (!k) return;
    const W=(k.right-k.left)/2/(k.zoom||1), H=(k.top-k.bottom)/2/(k.zoom||1);
    for (const s of this.sztuki) {
      // Orthographic camera: approach is expressed through scale and upward motion.
      // A little wind remains while idle; walking makes the clouds approach faster.
      s.postep=(s.postep + Math.max(0,dt)*s.tempo*(1+Math.min(2,Math.max(0,predkosc))*.45))%1;
      const p=s.postep;
      const near=s.skala*Math.min(1,W/5.25)*2.4;
      const emergence=Math.min(1,p/.10);
      const size=near*(.24+.76*p*p)*emergence*emergence*(3-2*emergence);
      s.mesh.scale.setScalar(size);
      // At the end the WHOLE cloud is above the frame before it wraps to the horizon.
      const radius=s.mesh.geometry.boundingSphere.radius;
      const y=.48*H+p*(.60*H+near*radius*1.4);
      const x=s.x*W*(.60+.28*p);
      s.mesh.position.set(x,y,this.C.glebokosc);

    }
  }
}
