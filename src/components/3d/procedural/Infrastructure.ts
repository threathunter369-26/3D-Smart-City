import * as THREE from 'three';
import { CityMaterials } from '../../../utils/materials';

export class InfrastructureBuilder {
  materials: CityMaterials;

  constructor(materials: CityMaterials) {
    this.materials = materials;
  }

  buildGroundAndRoads(): THREE.Group {
    const group = new THREE.Group();
    group.name = 'City_Infrastructure';

    // 1. Pearl White Main Ground Base Slab
    const groundGeo = new THREE.BoxGeometry(76, 1.2, 76);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0xebf3fa, // Pearl white / soft ice-blue tint
      roughness: 0.45,
      metalness: 0.05,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.position.y = -0.6;
    ground.receiveShadow = true;
    group.add(ground);

    // Subtle isometric grid lines on the outer edges (smart-city cyber grid)
    const gridHelper = new THREE.GridHelper(74, 37, 0x93c5fd, 0xdbeafe);
    gridHelper.position.y = 0.02;
    group.add(gridHelper);

    // 2. Water Canal (Right / Bay side)
    const waterGroup = this.buildWaterCanal();
    group.add(waterGroup);

    // 3. Roads & Intersections Network
    const roadGroup = this.buildRoadNetwork();
    group.add(roadGroup);

    // 4. Bridges over the Canal
    const bridgeGroup = this.buildBridges();
    group.add(bridgeGroup);

    // 5. Streetlights
    const lightsGroup = this.buildStreetlights();
    group.add(lightsGroup);

    return group;
  }

  private buildWaterCanal(): THREE.Group {
    const group = new THREE.Group();
    group.name = 'Water_Canal';

    // Canal trench bed (sunken)
    const bedGeo = new THREE.BoxGeometry(16, 0.6, 52);
    const bedMat = new THREE.MeshStandardMaterial({
      color: 0x1e3a5f,
      roughness: 0.8,
    });
    const bed = new THREE.Mesh(bedGeo, bedMat);
    bed.position.set(22, -0.4, 6);
    bed.receiveShadow = true;
    group.add(bed);

    // Water Surface (with high specularity and translucent blue)
    const waterGeo = new THREE.PlaneGeometry(15.6, 51.6, 16, 16);
    const waterMesh = new THREE.Mesh(waterGeo, this.materials.waterSurface);
    waterMesh.rotation.x = -Math.PI / 2;
    waterMesh.position.set(22, -0.05, 6);
    waterMesh.receiveShadow = true;
    waterMesh.name = 'Canal_Water_Surface';
    group.add(waterMesh);

    // Canal seawall embankments
    const wallGeo = new THREE.BoxGeometry(0.6, 0.8, 52);
    const leftWall = new THREE.Mesh(wallGeo, this.materials.sidewalkConcrete);
    leftWall.position.set(14.2, 0.3, 6);
    leftWall.receiveShadow = true;
    group.add(leftWall);

    const rightWall = new THREE.Mesh(wallGeo, this.materials.sidewalkConcrete);
    rightWall.position.set(29.8, 0.3, 6);
    rightWall.receiveShadow = true;
    group.add(rightWall);

    return group;
  }

  private buildRoadNetwork(): THREE.Group {
    const group = new THREE.Group();
    group.name = 'Road_Network';

    // Road segments: [x, z, width, depth, rotationY?]
    const roadSegments: [number, number, number, number][] = [
      // Main central boulevard (E-W)
      [0, 0, 48, 4.4],
      // North Avenue (E-W)
      [-2, -18, 42, 4.0],
      // South Avenue (E-W)
      [-2, 16, 42, 4.0],
      // West Avenue (N-S)
      [-24, -2, 4.0, 40],
      // Tower Avenue (N-S)
      [-10, -2, 4.2, 40],
      // Station / Center Avenue (N-S)
      [6, -2, 4.2, 40],
      // Canal-side Promenade Road (N-S)
      [14, -2, 3.8, 40],
    ];

    roadSegments.forEach(([rx, rz, rw, rd]) => {
      const roadGeo = new THREE.BoxGeometry(rw, 0.08, rd);
      const road = new THREE.Mesh(roadGeo, this.materials.roadAsphalt);
      road.position.set(rx, 0.04, rz);
      road.receiveShadow = true;
      group.add(road);

      // Sidewalk borders on both sides
      const isEastWest = rw > rd;
      if (isEastWest) {
        // North/South sidewalks
        const curbN = new THREE.Mesh(
          new THREE.BoxGeometry(rw, 0.16, 1.2),
          this.materials.sidewalkConcrete
        );
        curbN.position.set(rx, 0.08, rz - rd / 2 - 0.6);
        curbN.receiveShadow = true;
        group.add(curbN);

        const curbS = new THREE.Mesh(
          new THREE.BoxGeometry(rw, 0.16, 1.2),
          this.materials.sidewalkConcrete
        );
        curbS.position.set(rx, 0.08, rz + rd / 2 + 0.6);
        curbS.receiveShadow = true;
        group.add(curbS);
      }
    });

    // Zebra Crosswalks at major intersections
    const crosswalkLocations: [number, number, boolean][] = [
      [-10, -2.6, false],
      [-10, 2.6, false],
      [-7.6, 0, true],
      [-12.4, 0, true],
      [6, -2.6, false],
      [6, 2.6, false],
      [3.6, 0, true],
      [8.4, 0, true],
      [-24, -2.6, false],
      [-24, 2.6, false],
    ];

    crosswalkLocations.forEach(([cx, cz, isRotated]) => {
      const cw = this.buildZebraCrossing(isRotated);
      cw.position.set(cx, 0.09, cz);
      group.add(cw);
    });

    return group;
  }

  private buildZebraCrossing(isVertical: boolean): THREE.Group {
    const group = new THREE.Group();
    const stripes = 6;
    const stripeMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.3,
    });

    for (let i = 0; i < stripes; i++) {
      const offset = (i - (stripes - 1) / 2) * 0.45;
      const stripeGeo = isVertical
        ? new THREE.BoxGeometry(0.24, 0.02, 3.2)
        : new THREE.BoxGeometry(3.2, 0.02, 0.24);
      const stripe = new THREE.Mesh(stripeGeo, stripeMat);
      if (isVertical) stripe.position.x = offset;
      else stripe.position.z = offset;
      group.add(stripe);
    }
    return group;
  }

  private buildBridges(): THREE.Group {
    const group = new THREE.Group();
    group.name = 'Canal_Bridges';

    // 2 Modern Bridges crossing the canal (at z = 0 and z = 16)
    [0, 16].forEach((bz) => {
      const bridge = new THREE.Group();
      bridge.position.set(22, 0, bz);

      // Deck
      const deck = new THREE.Mesh(
        new THREE.BoxGeometry(16.5, 0.5, 4.4),
        this.materials.roadAsphalt
      );
      deck.position.y = 0.6;
      deck.castShadow = true;
      deck.receiveShadow = true;
      bridge.add(deck);

      // White parapets/railings
      [-2.3, 2.3].forEach((pz) => {
        const rail = new THREE.Mesh(
          new THREE.BoxGeometry(16.5, 0.6, 0.2),
          this.materials.pureWhite
        );
        rail.position.set(0, 1.0, pz);
        rail.castShadow = true;
        bridge.add(rail);

        // Glass acoustic panels on railing
        const glassRail = new THREE.Mesh(
          new THREE.BoxGeometry(16.5, 0.5, 0.05),
          this.materials.cyanGlass
        );
        glassRail.position.set(0, 1.5, pz);
        bridge.add(glassRail);
      });

      // Bridge structural piers
      [-5, 5].forEach((px) => {
        const pier = new THREE.Mesh(
          new THREE.CylinderGeometry(0.6, 0.8, 1.2, 12),
          this.materials.sidewalkConcrete
        );
        pier.position.set(px, 0, 0);
        pier.castShadow = true;
        bridge.add(pier);
      });

      group.add(bridge);
    });

    return group;
  }

  private buildStreetlights(): THREE.Group {
    const group = new THREE.Group();
    group.name = 'Streetlights';

    const lightCoords: [number, number][] = [
      [-20, 2.8], [-14, 2.8], [-6, 2.8], [0, 2.8], [10, 2.8],
      [-20, -2.8], [-14, -2.8], [-6, -2.8], [0, -2.8], [10, -2.8],
      [7.8, -14], [7.8, -8], [7.8, 8], [7.8, 14],
      [-8.2, -14], [-8.2, -8], [-8.2, 8], [-8.2, 14],
    ];

    lightCoords.forEach(([lx, lz]) => {
      const lamp = new THREE.Group();
      lamp.position.set(lx, 0, lz);

      // Pole
      const pole = new THREE.Mesh(
        new THREE.CylinderGeometry(0.06, 0.09, 3.2, 8),
        this.materials.sidewalkBorder
      );
      pole.position.y = 1.6;
      lamp.add(pole);

      // Curved lamp arm
      const arm = new THREE.Mesh(
        new THREE.BoxGeometry(0.6, 0.06, 0.06),
        this.materials.sidewalkBorder
      );
      arm.position.set(0.25, 3.1, 0);
      lamp.add(arm);

      // Glowing Light fixture
      const fixture = new THREE.Mesh(
        new THREE.BoxGeometry(0.35, 0.08, 0.2),
        this.materials.cyberCyanGlow
      );
      fixture.position.set(0.5, 3.05, 0);
      lamp.add(fixture);

      group.add(lamp);
    });

    return group;
  }
}
