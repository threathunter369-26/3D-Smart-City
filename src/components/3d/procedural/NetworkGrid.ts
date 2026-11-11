import * as THREE from 'three';
import { CityMaterials } from '../../../utils/materials';

export class NetworkGridBuilder {
  materials: CityMaterials;
  pulses: { mesh: THREE.Mesh; start: THREE.Vector3; end: THREE.Vector3; progress: number; speed: number }[] = [];

  constructor(materials: CityMaterials) {
    this.materials = materials;
  }

  buildNetwork(): { group: THREE.Group; update: (delta: number) => void } {
    const group = new THREE.Group();
    group.name = 'City_NetworkGrid';
    this.pulses = [];

    // Key IoT transmitter node coordinates
    const nodes: THREE.Vector3[] = [
      new THREE.Vector3(-10, 36, -4),   // Tokyo Tower top
      new THREE.Vector3(24, 46, -18),   // Skytree top
      new THREE.Vector3(-18, 26, -6),   // Financial Tower
      new THREE.Vector3(8, 22, -6),     // Tech Hub
      new THREE.Vector3(-2, 12, 4),     // Tokyo Station
      new THREE.Vector3(-4, 10, -12),   // National Stadium
      new THREE.Vector3(20, 16, 10),    // Waterfront Pier
      new THREE.Vector3(-6, 22, -14),   // Traffic Board
      new THREE.Vector3(10, 24, -12),   // Energy Board
      new THREE.Vector3(24, 20, -6),    // Air Quality Board
    ];

    // Node glowing spheres
    const nodeGeo = new THREE.SphereGeometry(0.35, 12, 12);
    nodes.forEach((pos) => {
      const nodeMesh = new THREE.Mesh(nodeGeo, this.materials.cyberCyanGlow);
      nodeMesh.position.copy(pos);
      group.add(nodeMesh);

      // Node cyber halo ring
      const halo = new THREE.Mesh(
        new THREE.RingGeometry(0.5, 0.7, 16),
        this.materials.cyberCyanGlow
      );
      halo.position.copy(pos);
      halo.rotation.x = Math.PI / 2;
      group.add(halo);
    });

    // Connection line pairs between nodes
    const connections: [number, number][] = [
      [0, 1], // Tokyo Tower <-> Skytree
      [0, 2], // Tokyo Tower <-> Financial Tower
      [0, 5], // Tokyo Tower <-> Stadium
      [1, 3], // Skytree <-> Tech Hub
      [1, 9], // Skytree <-> Air Board
      [2, 7], // Financial <-> Traffic Board
      [3, 8], // Tech Hub <-> Energy Board
      [4, 0], // Station <-> Tokyo Tower
      [4, 6], // Station <-> Waterfront
      [3, 6], // Tech Hub <-> Waterfront
    ];

    const lineMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.5,
      linewidth: 1,
    });

    const pulseGeo = new THREE.SphereGeometry(0.25, 8, 8);

    connections.forEach(([iA, iB]) => {
      const pA = nodes[iA];
      const pB = nodes[iB];

      const lineGeo = new THREE.BufferGeometry().setFromPoints([pA, pB]);
      const line = new THREE.Line(lineGeo, lineMat);
      group.add(line);

      // Create animated glowing data packet along this line
      const pulseMesh = new THREE.Mesh(pulseGeo, this.materials.cyberCyanGlow);
      pulseMesh.position.copy(pA);
      group.add(pulseMesh);

      this.pulses.push({
        mesh: pulseMesh,
        start: pA,
        end: pB,
        progress: Math.random(),
        speed: 0.25 + Math.random() * 0.35,
      });
    });

    // Animation update
    const update = (delta: number) => {
      this.pulses.forEach((p) => {
        p.progress += p.speed * delta;
        if (p.progress >= 1.0) p.progress = 0;
        p.mesh.position.lerpVectors(p.start, p.end, p.progress);
      });
    };

    return { group, update };
  }
}
