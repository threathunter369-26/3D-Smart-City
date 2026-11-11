import * as THREE from 'three';
import { CityMaterials } from '../../../utils/materials';

export class PedestriansBuilder {
  materials: CityMaterials;

  constructor(materials: CityMaterials) {
    this.materials = materials;
  }

  buildPedestrians(): THREE.Group {
    const group = new THREE.Group();
    group.name = 'City_Pedestrians';

    // Positions across plazas, crosswalks, station front, and temple path
    const pedestrianSpots: [number, number, number][] = [
      // Tokyo Station plaza
      [-4, 8, 0], [-2, 9, 1], [0, 8.5, 2], [3, 9, 3], [5, 8.2, 4],
      [-5, 10, 1], [-1, 10.5, 0], [2, 10.2, 2], [6, 10, 3],
      // Presentation screen gathering
      [10.2, 8.8, 0], // Presenter
      [11.5, 9.8, 1], // Observer 1
      [11.8, 8.2, 2], // Observer 2
      // Near 3D ground chart pedestals
      [-8.5, 9.5, 3], [-5.5, 12.5, 4],
      // Near Temple gate
      [-17, 9, 0], [-15, 9.5, 2], [-14, 8, 1], [-18, 10.5, 3],
      // Near Tokyo Tower base
      [-12, -1, 4], [-8, -1, 0], [-10, -8, 1], [-7, -7, 2],
      // Near Stadium
      [-4, -7, 3], [-1, -8, 2], [-7, -8.5, 1], [2, -7.5, 0],
      // Along Sidewalks & Crosswalks
      [-10, 2.8, 1], [-10, -2.8, 3], [6, 2.8, 2], [6, -2.8, 0],
      [12, 2.5, 4], [12, -2.5, 1], [-20, 2.5, 2],
    ];

    pedestrianSpots.forEach(([px, pz, colorIdx]) => {
      const isPresenter = px === 10.2 && pz === 8.8;
      const ped = this.createPedestrian(colorIdx, isPresenter);
      ped.position.set(px, 0.1, pz);
      group.add(ped);
    });

    return group;
  }

  private createPedestrian(colorIdx: number, isPresenter: boolean = false): THREE.Group {
    const p = new THREE.Group();

    const shirtMat = this.materials.pedestrianClothes[colorIdx % this.materials.pedestrianClothes.length];
    const pantsMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.7 });

    // 1. Legs (2 slender cylinders)
    const legGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.45, 6);
    const leftLeg = new THREE.Mesh(legGeo, pantsMat);
    leftLeg.position.set(-0.08, 0.22, 0);
    p.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeo, pantsMat);
    rightLeg.position.set(0.08, 0.22, 0);
    p.add(rightLeg);

    // 2. Torso (Colored shirt / jacket)
    const torsoGeo = new THREE.BoxGeometry(0.3, 0.45, 0.2);
    const torso = new THREE.Mesh(torsoGeo, shirtMat);
    torso.position.y = 0.65;
    torso.castShadow = true;
    p.add(torso);

    // 3. Head
    const headGeo = new THREE.SphereGeometry(0.12, 8, 8);
    const head = new THREE.Mesh(headGeo, this.materials.pedestrianSkin);
    head.position.y = 0.98;
    p.add(head);

    // Hair cap
    const hairGeo = new THREE.SphereGeometry(0.13, 8, 6, 0, Math.PI * 2, 0, Math.PI / 2);
    const hairMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.9 });
    const hair = new THREE.Mesh(hairGeo, hairMat);
    hair.position.y = 1.0;
    p.add(hair);

    // Presenter special arm pointing to screen
    if (isPresenter) {
      const armGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.45, 6);
      const arm = new THREE.Mesh(armGeo, shirtMat);
      arm.position.set(0.25, 0.75, 0.1);
      arm.rotation.z = -Math.PI / 3;
      p.add(arm);

      // Pointer wand
      const wand = new THREE.Mesh(
        new THREE.CylinderGeometry(0.015, 0.015, 0.6, 4),
        this.materials.templeGold
      );
      wand.position.set(0.48, 0.95, 0.1);
      wand.rotation.z = -Math.PI / 3;
      p.add(wand);
    }

    return p;
  }
}
