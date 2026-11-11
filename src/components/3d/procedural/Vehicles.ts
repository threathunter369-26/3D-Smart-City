import * as THREE from 'three';
import { CityMaterials } from '../../../utils/materials';

export interface VehicleEntity {
  mesh: THREE.Group;
  speed: number;
  route: THREE.Vector3[];
  currentWaypoint: number;
  progress: number;
}

export class VehiclesBuilder {
  materials: CityMaterials;
  vehicles: VehicleEntity[] = [];
  canalBoat: THREE.Group | null = null;
  boatProgress: number = 0;

  constructor(materials: CityMaterials) {
    this.materials = materials;
  }

  buildVehicles(): { group: THREE.Group; update: (delta: number) => void } {
    const group = new THREE.Group();
    group.name = 'City_Vehicles';
    this.vehicles = [];

    // Define 4 closed road loops for realistic traffic circulation:
    // Route 1: Main East-West Boulevard Loop
    const route1 = [
      new THREE.Vector3(-22, 0.25, 0.9),
      new THREE.Vector3(12, 0.25, 0.9),
      new THREE.Vector3(12, 0.25, -0.9),
      new THREE.Vector3(-22, 0.25, -0.9),
    ];

    // Route 2: Tower Avenue & North Loop
    const route2 = [
      new THREE.Vector3(-10, 0.25, 14),
      new THREE.Vector3(-10, 0.25, -16),
      new THREE.Vector3(-11.5, 0.25, -16),
      new THREE.Vector3(-11.5, 0.25, 14),
    ];

    // Route 3: Station & Center Loop
    const route3 = [
      new THREE.Vector3(6, 0.25, -16),
      new THREE.Vector3(6, 0.25, 14),
      new THREE.Vector3(4.5, 0.25, 14),
      new THREE.Vector3(4.5, 0.25, -16),
    ];

    // Route 4: Bridge Crossing Loop to Waterfront
    const route4 = [
      new THREE.Vector3(12, 0.75, 0),
      new THREE.Vector3(30, 0.75, 0),
      new THREE.Vector3(30, 0.75, 16),
      new THREE.Vector3(12, 0.75, 16),
    ];

    const routes = [route1, route2, route3, route4];

    // Spawn 14 animated vehicles
    for (let i = 0; i < 14; i++) {
      const route = routes[i % routes.length];
      const type = i % 4 === 0 ? 'bus' : i % 3 === 0 ? 'truck' : 'car';
      const paintMat = this.materials.carPaints[i % this.materials.carPaints.length];

      const vMesh = this.createVehicleMesh(type, paintMat);
      const startWaypoint = i % (route.length - 1);
      vMesh.position.copy(route[startWaypoint]);
      group.add(vMesh);

      this.vehicles.push({
        mesh: vMesh,
        speed: 3.5 + Math.random() * 2.0,
        route,
        currentWaypoint: startWaypoint,
        progress: (i * 0.25) % 1,
      });
    }

    // Build Canal Ferry Boat (Tokyo Cruise water taxi)
    const boat = this.createCanalBoat();
    boat.position.set(22, 0.15, -18);
    group.add(boat);
    this.canalBoat = boat;

    // Animation update callback
    const update = (delta: number) => {
      // Update road vehicles
      this.vehicles.forEach((veh) => {
        const p1 = veh.route[veh.currentWaypoint];
        const nextIdx = (veh.currentWaypoint + 1) % veh.route.length;
        const p2 = veh.route[nextIdx];

        const segLength = p1.distanceTo(p2);
        veh.progress += (veh.speed * delta) / (segLength || 1);

        if (veh.progress >= 1.0) {
          veh.progress = 0;
          veh.currentWaypoint = nextIdx;
        }

        const np1 = veh.route[veh.currentWaypoint];
        const np2 = veh.route[(veh.currentWaypoint + 1) % veh.route.length];
        veh.mesh.position.lerpVectors(np1, np2, veh.progress);

        // Orient vehicle towards heading
        const dir = new THREE.Vector3().subVectors(np2, np1).normalize();
        if (dir.lengthSq() > 0.001) {
          veh.mesh.lookAt(
            veh.mesh.position.x + dir.x,
            veh.mesh.position.y,
            veh.mesh.position.z + dir.z
          );
        }
      });

      // Update canal boat cruising back and forth along canal
      if (this.canalBoat) {
        this.boatProgress += delta * 0.08;
        const zPos = -18 + Math.sin(this.boatProgress) * 20;
        this.canalBoat.position.z = zPos;
        // Direction heading
        const forward = Math.cos(this.boatProgress) >= 0;
        this.canalBoat.rotation.y = forward ? 0 : Math.PI;
        // Subtle water bobbing
        this.canalBoat.position.y = 0.12 + Math.sin(this.boatProgress * 4) * 0.04;
      }
    };

    return { group, update };
  }

  private createVehicleMesh(
    type: 'car' | 'truck' | 'bus',
    paintMat: THREE.MeshStandardMaterial
  ): THREE.Group {
    const v = new THREE.Group();

    if (type === 'bus') {
      // Modern smart city transit bus
      const body = new THREE.Mesh(new THREE.BoxGeometry(1.3, 1.2, 3.4), paintMat);
      body.position.y = 0.6;
      body.castShadow = true;
      v.add(body);

      // Glass panoramic strip
      const glass = new THREE.Mesh(
        new THREE.BoxGeometry(1.32, 0.45, 3.2),
        this.materials.cyanGlass
      );
      glass.position.y = 0.8;
      v.add(glass);

      // White roof
      const roof = new THREE.Mesh(
        new THREE.BoxGeometry(1.28, 0.15, 3.3),
        this.materials.pureWhite
      );
      roof.position.y = 1.25;
      v.add(roof);
    } else if (type === 'truck') {
      // Light delivery truck
      const cab = new THREE.Mesh(
        new THREE.BoxGeometry(1.2, 1.1, 1.2),
        paintMat
      );
      cab.position.set(0, 0.6, 0.8);
      cab.castShadow = true;
      v.add(cab);

      const cargo = new THREE.Mesh(
        new THREE.BoxGeometry(1.25, 1.3, 1.8),
        this.materials.pureWhite
      );
      cargo.position.set(0, 0.75, -0.6);
      cargo.castShadow = true;
      v.add(cargo);
    } else {
      // Clean sedan / taxi
      const lower = new THREE.Mesh(
        new THREE.BoxGeometry(1.1, 0.45, 2.2),
        paintMat
      );
      lower.position.y = 0.3;
      lower.castShadow = true;
      v.add(lower);

      const cabin = new THREE.Mesh(
        new THREE.BoxGeometry(0.95, 0.4, 1.2),
        this.materials.cyanGlass
      );
      cabin.position.set(0, 0.65, -0.1);
      v.add(cabin);
    }

    // Wheels (4 black cylinders)
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.9 });
    const wheelGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.18, 8);
    [
      [-0.6, 0.2, 0.8],
      [0.6, 0.2, 0.8],
      [-0.6, 0.2, -0.8],
      [0.6, 0.2, -0.8],
    ].forEach(([wx, wy, wz]) => {
      const wheel = new THREE.Mesh(wheelGeo, wheelMat);
      wheel.position.set(wx, wy, wz);
      wheel.rotation.z = Math.PI / 2;
      v.add(wheel);
    });

    // Headlights
    const lightMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    [-0.38, 0.38].forEach((lx) => {
      const headlight = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.1, 0.05), lightMat);
      headlight.position.set(lx, 0.35, 1.12);
      v.add(headlight);
    });

    return v;
  }

  private createCanalBoat(): THREE.Group {
    const boat = new THREE.Group();
    boat.name = 'Canal_Ferry_Boat';

    // Hull (streamlined modern water taxi)
    const hullGeo = new THREE.BoxGeometry(3.6, 0.9, 8.4);
    const hull = new THREE.Mesh(hullGeo, this.materials.pureWhite);
    hull.position.y = 0.45;
    hull.castShadow = true;
    boat.add(hull);

    // Cyan panoramic glass cabin
    const cabin = new THREE.Mesh(
      new THREE.BoxGeometry(3.2, 0.9, 6.2),
      this.materials.cyanGlass
    );
    cabin.position.set(0, 1.1, -0.4);
    boat.add(cabin);

    // Roof solar deck
    const roof = new THREE.Mesh(
      new THREE.BoxGeometry(3.3, 0.15, 6.4),
      this.materials.darkGlass
    );
    roof.position.set(0, 1.6, -0.4);
    boat.add(roof);

    return boat;
  }
}
