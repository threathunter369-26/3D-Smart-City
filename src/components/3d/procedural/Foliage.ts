import * as THREE from 'three';
import { CityMaterials } from '../../../utils/materials';

export class FoliageBuilder {
  materials: CityMaterials;

  constructor(materials: CityMaterials) {
    this.materials = materials;
  }

  buildFoliage(): THREE.Group {
    const group = new THREE.Group();
    group.name = 'City_Foliage';

    // Tree coordinates around plazas, temple, station, avenues, and parks
    const treeCoords: [number, number, number][] = [
      // Along Temple grounds
      [-19, 12, 1.1], [-16, 12, 1.0], [-13, 12, 1.2],
      [-22, 9, 1.0], [-22, 6, 1.1], [-22, 3, 0.9],
      [-14, 3, 1.0], [-16, -1, 1.1], [-18, -1, 0.9],
      // Around Tokyo Station Plaza
      [-8, 6.5, 1.0], [-6, 6.5, 0.95], [-4, 6.5, 1.1], [-2, 6.5, 1.0],
      [0, 6.5, 1.15], [2, 6.5, 0.9], [4, 6.5, 1.05], [6, 6.5, 1.1],
      // Around Stadium
      [-13, -11, 1.2], [-11, -15, 1.1], [-8, -17, 1.0], [-4, -18, 1.2],
      [1, -17, 1.0], [4, -15, 1.1], [6, -12, 0.95],
      // Around Tokyo Tower base
      [-14, -4, 1.1], [-14, -7, 1.0], [-6, -4, 0.9], [-6, -7, 1.15],
      // Along East Promenade & Bridges
      [12, -8, 1.0], [12, -5, 1.1], [12, 4, 1.0], [12, 8, 1.2], [12, 12, 0.95],
      // Canal waterfront park
      [31, -2, 1.1], [31, 2, 1.0], [31, 6, 1.15], [31, 10, 0.95], [31, 14, 1.0],
      // West residential gardens
      [-26, 10, 1.0], [-26, 6, 1.1], [-26, -6, 0.9], [-26, -10, 1.1],
    ];

    treeCoords.forEach(([tx, tz, scale]) => {
      const tree = this.createStylizedTree(scale);
      tree.position.set(tx, 0, tz);
      group.add(tree);
    });

    // Park Planter Boxes with Low Shrub hedges
    const planters: [number, number, number, number][] = [
      [-12, 3.2, 4, 0.8],
      [4, 3.2, 4, 0.8],
      [-12, -3.2, 4, 0.8],
      [4, -3.2, 4, 0.8],
    ];

    planters.forEach(([px, pz, pw, pd]) => {
      const box = new THREE.Mesh(
        new THREE.BoxGeometry(pw, 0.35, pd),
        this.materials.sidewalkBorder
      );
      box.position.set(px, 0.18, pz);
      box.receiveShadow = true;
      group.add(box);

      const hedge = new THREE.Mesh(
        new THREE.BoxGeometry(pw * 0.92, 0.35, pd * 0.85),
        this.materials.treeFoliageGreen
      );
      hedge.position.set(px, 0.45, pz);
      hedge.castShadow = true;
      group.add(hedge);
    });

    return group;
  }

  private createStylizedTree(scale: number = 1.0): THREE.Group {
    const tree = new THREE.Group();

    // 1. Trunk
    const trunkH = 1.2 * scale;
    const trunk = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12 * scale, 0.18 * scale, trunkH, 8),
      this.materials.treeTrunkWood
    );
    trunk.position.y = trunkH / 2;
    trunk.castShadow = true;
    tree.add(trunk);

    // 2. Layered Stylized Foliage (2 rounded puff spheres for rich volume)
    const folGeo1 = new THREE.SphereGeometry(0.9 * scale, 12, 10);
    folGeo1.scale(1, 0.85, 1);
    const fol1 = new THREE.Mesh(
      folGeo1,
      Math.random() > 0.4 ? this.materials.treeFoliageGreen : this.materials.treeFoliageMint
    );
    fol1.position.y = trunkH + 0.6 * scale;
    fol1.castShadow = true;
    fol1.receiveShadow = true;
    tree.add(fol1);

    const folGeo2 = new THREE.SphereGeometry(0.65 * scale, 10, 8);
    const fol2 = new THREE.Mesh(
      folGeo2,
      this.materials.treeFoliageMint
    );
    fol2.position.set(0.1 * scale, trunkH + 1.2 * scale, 0);
    fol2.castShadow = true;
    tree.add(fol2);

    return tree;
  }
}
