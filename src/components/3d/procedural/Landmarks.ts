import * as THREE from 'three';
import { CityMaterials } from '../../../utils/materials';

export class LandmarksBuilder {
  materials: CityMaterials;

  constructor(materials: CityMaterials) {
    this.materials = materials;
  }

  // --- 1. TOKYO TOWER ---
  createTokyoTower(x: number, z: number): THREE.Group {
    const group = new THREE.Group();
    group.position.set(x, 0, z);
    group.name = 'Landmark_TokyoTower';
    group.userData = { landmarkId: 'tokyo-tower', name: 'Tokyo Communications Tower' };

    // Base podium building (FootTown)
    const baseGeo = new THREE.BoxGeometry(7, 2, 7);
    const baseMesh = new THREE.Mesh(baseGeo, this.materials.whiteFacade);
    baseMesh.position.y = 1;
    baseMesh.castShadow = true;
    baseMesh.receiveShadow = true;
    group.add(baseMesh);

    // 4 Splayed Legs
    const legGeo = new THREE.CylinderGeometry(0.3, 0.55, 10, 6);
    const legAngles = [Math.PI / 4, (3 * Math.PI) / 4, (5 * Math.PI) / 4, (7 * Math.PI) / 4];
    const legRadius = 3.2;

    legAngles.forEach((angle) => {
      const leg = new THREE.Mesh(legGeo, this.materials.tokyoTowerRed);
      const lx = Math.cos(angle) * legRadius;
      const lz = Math.sin(angle) * legRadius;
      leg.position.set(lx, 6, lz);
      // Lean inwards towards center
      leg.lookAt(0, 12, 0);
      leg.rotateX(Math.PI / 2);
      leg.castShadow = true;
      group.add(leg);
    });

    // Lower Arch support
    const archGeo = new THREE.TorusGeometry(2.5, 0.25, 8, 16, Math.PI);
    const archMesh = new THREE.Mesh(archGeo, this.materials.tokyoTowerRed);
    archMesh.position.y = 4.5;
    archMesh.rotation.x = Math.PI;
    group.add(archMesh);

    // Lower Lattice Trunk (Alternating Red/White)
    const lowerTrunk1 = new THREE.Mesh(
      new THREE.CylinderGeometry(1.6, 2.6, 5, 8),
      this.materials.tokyoTowerWhite
    );
    lowerTrunk1.position.y = 11.5;
    lowerTrunk1.castShadow = true;
    group.add(lowerTrunk1);

    // Main Observation Deck (2 floors)
    const deckGeo = new THREE.CylinderGeometry(3.2, 3.4, 2.2, 16);
    const deckMesh = new THREE.Mesh(deckGeo, this.materials.tokyoTowerWhite);
    deckMesh.position.y = 15;
    deckMesh.castShadow = true;
    group.add(deckMesh);

    const deckGlass = new THREE.Mesh(
      new THREE.CylinderGeometry(3.3, 3.3, 1.2, 16),
      this.materials.cyanGlass
    );
    deckGlass.position.y = 15;
    group.add(deckGlass);

    // Middle Tapered Lattice (Red/White Bands)
    const midBand1 = new THREE.Mesh(
      new THREE.CylinderGeometry(1.1, 1.6, 6, 8),
      this.materials.tokyoTowerRed
    );
    midBand1.position.y = 19;
    midBand1.castShadow = true;
    group.add(midBand1);

    const midBand2 = new THREE.Mesh(
      new THREE.CylinderGeometry(0.8, 1.1, 5, 8),
      this.materials.tokyoTowerWhite
    );
    midBand2.position.y = 24.5;
    midBand2.castShadow = true;
    group.add(midBand2);

    // Top Observation Deck
    const topDeck = new THREE.Mesh(
      new THREE.CylinderGeometry(1.4, 1.4, 1.2, 12),
      this.materials.tokyoTowerRed
    );
    topDeck.position.y = 27.5;
    topDeck.castShadow = true;
    group.add(topDeck);

    // Spire and Antenna Mast
    const spireGeo = new THREE.CylinderGeometry(0.12, 0.45, 9, 8);
    const spireMesh = new THREE.Mesh(spireGeo, this.materials.tokyoTowerWhite);
    spireMesh.position.y = 32.5;
    spireMesh.castShadow = true;
    group.add(spireMesh);

    // Top Red Beacon Light
    const beaconGeo = new THREE.SphereGeometry(0.35, 12, 12);
    const beacon = new THREE.Mesh(beaconGeo, this.materials.cyberOrangeGlow);
    beacon.position.y = 37.2;
    group.add(beacon);

    return group;
  }

  // --- 2. TOKYO SKYTREE ---
  createSkytree(x: number, z: number): THREE.Group {
    const group = new THREE.Group();
    group.position.set(x, 0, z);
    group.name = 'Landmark_Skytree';
    group.userData = { landmarkId: 'skytree', name: 'Metropolitan Sky Needle' };

    // Base shopping podium (Solamachi)
    const basePodium = new THREE.Mesh(
      new THREE.BoxGeometry(10, 2.5, 8),
      this.materials.whiteFacade
    );
    basePodium.position.y = 1.25;
    basePodium.castShadow = true;
    basePodium.receiveShadow = true;
    group.add(basePodium);

    // Main tapering lattice body (Triangular base to circular top)
    const lowerLattice = new THREE.Mesh(
      new THREE.CylinderGeometry(1.8, 3.8, 20, 16),
      this.materials.skytreeLattice
    );
    lowerLattice.position.y = 12.5;
    lowerLattice.castShadow = true;
    group.add(lowerLattice);

    // Outer lattice ring ribcage
    for (let h = 4; h <= 20; h += 4) {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(3.6 - h * 0.08, 0.12, 6, 16),
        this.materials.skytreeLattice
      );
      ring.position.y = h;
      ring.rotation.x = Math.PI / 2;
      group.add(ring);
    }

    // First Observation Deck (Tembo Deck) - 3 Tiered Cylinders
    const temboBase = new THREE.Mesh(
      new THREE.CylinderGeometry(3.6, 2.2, 1.2, 24),
      this.materials.pureWhite
    );
    temboBase.position.y = 23;
    group.add(temboBase);

    const temboGlass = new THREE.Mesh(
      new THREE.CylinderGeometry(3.8, 3.6, 2.4, 24),
      this.materials.cyanGlass
    );
    temboGlass.position.y = 24.8;
    group.add(temboGlass);

    const temboRoof = new THREE.Mesh(
      new THREE.CylinderGeometry(2.4, 3.8, 1, 24),
      this.materials.pureWhite
    );
    temboRoof.position.y = 26.5;
    group.add(temboRoof);

    // Mid tower section
    const midSection = new THREE.Mesh(
      new THREE.CylinderGeometry(1.2, 1.8, 8, 16),
      this.materials.skytreeLattice
    );
    midSection.position.y = 31;
    group.add(midSection);

    // Upper Observation Deck (Tembo Galleria)
    const galleria = new THREE.Mesh(
      new THREE.CylinderGeometry(2.2, 2.2, 1.8, 20),
      this.materials.cyanGlass
    );
    galleria.position.y = 36;
    group.add(galleria);

    // High Spire Needle
    const spire = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.8, 12, 12),
      this.materials.skytreeLattice
    );
    spire.position.y = 42.5;
    spire.castShadow = true;
    group.add(spire);

    // Cyan Beacon Light Tip
    const tip = new THREE.Mesh(
      new THREE.SphereGeometry(0.35, 12, 12),
      this.materials.cyberCyanGlow
    );
    tip.position.y = 48.6;
    group.add(tip);

    return group;
  }

  // --- 3. TOKYO STATION (RED-BRICK HERITAGE TERMINAL) ---
  createTokyoStation(x: number, z: number): THREE.Group {
    const group = new THREE.Group();
    group.position.set(x, 0, z);
    group.name = 'Landmark_TokyoStation';
    group.userData = { landmarkId: 'tokyo-station', name: 'Central Heritage Station' };

    // Plaza platform
    const plaza = new THREE.Mesh(
      new THREE.BoxGeometry(22, 0.4, 10),
      this.materials.sidewalkConcrete
    );
    plaza.position.y = 0.2;
    plaza.receiveShadow = true;
    group.add(plaza);

    // Central Red Brick Main Body
    const mainBody = new THREE.Mesh(
      new THREE.BoxGeometry(18, 3.6, 5),
      this.materials.brickStation
    );
    mainBody.position.y = 2.2;
    mainBody.castShadow = true;
    mainBody.receiveShadow = true;
    group.add(mainBody);

    // Mansard Slate Roof
    const roofGeo = new THREE.BoxGeometry(18.4, 1.4, 5.4);
    const roof = new THREE.Mesh(roofGeo, this.materials.slateRoof);
    roof.position.y = 4.6;
    roof.castShadow = true;
    group.add(roof);

    // Dormer windows on roof
    for (let dx = -7; dx <= 7; dx += 2.8) {
      const dormer = new THREE.Mesh(
        new THREE.BoxGeometry(0.8, 0.8, 0.6),
        this.materials.pureWhite
      );
      dormer.position.set(dx, 5.1, 2.5);
      group.add(dormer);
    }

    // North & South Domed Pavilions
    [-8, 8].forEach((px) => {
      // Pavilion brick tower
      const pav = new THREE.Mesh(
        new THREE.BoxGeometry(4.4, 4.8, 5.6),
        this.materials.brickStation
      );
      pav.position.set(px, 2.8, 0);
      pav.castShadow = true;
      group.add(pav);

      // Pavilion Dome Roof (Octagonal Mansard Dome)
      const domeRoof = new THREE.Mesh(
        new THREE.CylinderGeometry(1.2, 2.8, 2.6, 8),
        this.materials.slateRoof
      );
      domeRoof.position.set(px, 6.4, 0);
      domeRoof.castShadow = true;
      group.add(domeRoof);

      // Top Dome Finial
      const finial = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.25, 1.2, 6),
        this.materials.templeGold
      );
      finial.position.set(px, 8.2, 0);
      group.add(finial);
    });

    // Central Portico & Clock Tower
    const portico = new THREE.Mesh(
      new THREE.BoxGeometry(5.2, 5.2, 5.8),
      this.materials.brickStation
    );
    portico.position.set(0, 3.0, 0.2);
    portico.castShadow = true;
    group.add(portico);

    const clockGable = new THREE.Mesh(
      new THREE.CylinderGeometry(1.4, 3.2, 2.4, 6),
      this.materials.slateRoof
    );
    clockGable.position.set(0, 6.7, 0.2);
    group.add(clockGable);

    // Clock face
    const clockFace = new THREE.Mesh(
      new THREE.CylinderGeometry(0.6, 0.6, 0.2, 16),
      this.materials.pureWhite
    );
    clockFace.rotation.x = Math.PI / 2;
    clockFace.position.set(0, 5.8, 3.1);
    group.add(clockFace);

    // Entrance arches with warm glow
    for (let ax = -1.6; ax <= 1.6; ax += 1.6) {
      const arch = new THREE.Mesh(
        new THREE.BoxGeometry(0.9, 1.8, 0.4),
        this.materials.darkGlass
      );
      arch.position.set(ax, 1.2, 3.1);
      group.add(arch);
    }

    return group;
  }

  // --- 4. TRADITIONAL TEMPLE, PAGODA & GATE (ASAKUSA STYLE) ---
  createTempleComplex(x: number, z: number): THREE.Group {
    const group = new THREE.Group();
    group.position.set(x, 0, z);
    group.name = 'Landmark_TempleComplex';
    group.userData = { landmarkId: 'sensoji-temple', name: 'Asakusa Heritage Pagoda & Gate' };

    // Temple stone foundation
    const foundation = new THREE.Mesh(
      new THREE.BoxGeometry(16, 0.4, 18),
      this.materials.sidewalkConcrete
    );
    foundation.position.y = 0.2;
    foundation.receiveShadow = true;
    group.add(foundation);

    // --- A. Red Kaminarimon Gate (Front) ---
    const gateGroup = new THREE.Group();
    gateGroup.position.set(0, 0, 5.5);

    // Red timber pillars
    const pillarGeo = new THREE.CylinderGeometry(0.3, 0.35, 4, 12);
    [-2.2, 2.2].forEach((px) => {
      const p = new THREE.Mesh(pillarGeo, this.materials.templeWood);
      p.position.set(px, 2, 0);
      p.castShadow = true;
      gateGroup.add(p);
    });

    // Crossbeams
    const beam1 = new THREE.Mesh(
      new THREE.BoxGeometry(5.8, 0.5, 0.8),
      this.materials.templeWood
    );
    beam1.position.set(0, 3.6, 0);
    gateGroup.add(beam1);

    // Giant Red Lantern (Chochin)
    const lantern = new THREE.Mesh(
      new THREE.CylinderGeometry(0.8, 0.8, 1.8, 16),
      this.materials.templeWood
    );
    lantern.position.set(0, 2.2, 0);
    gateGroup.add(lantern);

    // Gate Curved Eaves Roof
    const gateRoof = new THREE.Mesh(
      new THREE.ConeGeometry(3.6, 1.6, 4),
      this.materials.templeRoof
    );
    gateRoof.position.set(0, 4.8, 0);
    gateRoof.rotation.y = Math.PI / 4;
    gateRoof.scale.set(1.4, 0.8, 1.0);
    gateRoof.castShadow = true;
    gateGroup.add(gateRoof);

    group.add(gateGroup);

    // --- B. 5-Story Pagoda (Goju-no-To) on the Left ---
    const pagodaGroup = new THREE.Group();
    pagodaGroup.position.set(-4.5, 0, -2.5);

    // Pagoda base
    const pagBase = new THREE.Mesh(
      new THREE.BoxGeometry(4.2, 1, 4.2),
      this.materials.templeWood
    );
    pagBase.position.y = 0.5;
    pagodaGroup.add(pagBase);

    // 5 Tiers with stepped roofs
    const tiers = 5;
    for (let t = 0; t < tiers; t++) {
      const yBase = 1.0 + t * 2.1;
      const scale = 1.0 - t * 0.12;

      // Tier room body
      const room = new THREE.Mesh(
        new THREE.BoxGeometry(2.4 * scale, 1.2, 2.4 * scale),
        this.materials.templeWood
      );
      room.position.y = yBase + 0.6;
      room.castShadow = true;
      pagodaGroup.add(room);

      // Curved Eave Roof
      const roofMesh = new THREE.Mesh(
        new THREE.ConeGeometry(2.6 * scale, 0.9, 4),
        this.materials.templeRoof
      );
      roofMesh.position.y = yBase + 1.6;
      roofMesh.rotation.y = Math.PI / 4;
      roofMesh.scale.set(1.2, 0.7, 1.2);
      roofMesh.castShadow = true;
      pagodaGroup.add(roofMesh);
    }

    // Sorin Finial (Golden Rings & Spear)
    const sorin = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.2, 3.2, 8),
      this.materials.templeGold
    );
    sorin.position.y = 13.0;
    pagodaGroup.add(sorin);

    group.add(pagodaGroup);

    // --- C. Main Worship Hall (Hondo) on the Right ---
    const hallGroup = new THREE.Group();
    hallGroup.position.set(2.5, 0, -2.5);

    const hallBody = new THREE.Mesh(
      new THREE.BoxGeometry(7, 3.2, 6.5),
      this.materials.templeWood
    );
    hallBody.position.y = 1.8;
    hallBody.castShadow = true;
    hallGroup.add(hallBody);

    // Hall Grand Eaves Roof
    const hallRoof = new THREE.Mesh(
      new THREE.ConeGeometry(6.2, 2.8, 4),
      this.materials.templeRoof
    );
    hallRoof.position.y = 4.6;
    hallRoof.rotation.y = Math.PI / 4;
    hallRoof.scale.set(1.3, 0.9, 1.15);
    hallRoof.castShadow = true;
    hallGroup.add(hallRoof);

    // Front Offering Porch
    const porch = new THREE.Mesh(
      new THREE.BoxGeometry(4.5, 0.6, 2),
      this.materials.templeWood
    );
    porch.position.set(0, 0.6, 3.8);
    hallGroup.add(porch);

    group.add(hallGroup);

    return group;
  }

  // --- 5. NATIONAL STADIUM (CIRCULAR OLYMPIC ARENA) ---
  createNationalStadium(x: number, z: number): THREE.Group {
    const group = new THREE.Group();
    group.position.set(x, 0, z);
    group.name = 'Landmark_NationalStadium';
    group.userData = { landmarkId: 'national-stadium', name: 'National Circular Arena' };

    // Podium Base
    const podium = new THREE.Mesh(
      new THREE.CylinderGeometry(11, 11.5, 0.6, 36),
      this.materials.sidewalkConcrete
    );
    podium.position.y = 0.3;
    podium.receiveShadow = true;
    group.add(podium);

    // Outer Ring Walls with Multi-Tiered Wooden Louvers
    const outerWall = new THREE.Mesh(
      new THREE.CylinderGeometry(9.5, 10.2, 3.8, 36),
      this.materials.stadiumWhite
    );
    outerWall.position.y = 2.4;
    outerWall.castShadow = true;
    outerWall.receiveShadow = true;
    group.add(outerWall);

    // 3 Rings of Wooden Louvers (Kengo Kuma design)
    [1.4, 2.5, 3.6].forEach((yPos) => {
      const louver = new THREE.Mesh(
        new THREE.TorusGeometry(9.8 - (yPos - 1.4) * 0.15, 0.22, 6, 36),
        this.materials.stadiumWood
      );
      louver.position.y = yPos;
      louver.rotation.x = Math.PI / 2;
      group.add(louver);
    });

    // Cantilevered Roof Ring
    const roofRing = new THREE.Mesh(
      new THREE.CylinderGeometry(6.2, 9.6, 0.8, 36),
      this.materials.stadiumWhite
    );
    roofRing.position.y = 4.6;
    roofRing.castShadow = true;
    group.add(roofRing);

    // Inner Open Hole
    const innerRoofBevel = new THREE.Mesh(
      new THREE.TorusGeometry(6.2, 0.35, 8, 36),
      this.materials.whiteFacade
    );
    innerRoofBevel.position.y = 4.6;
    innerRoofBevel.rotation.x = Math.PI / 2;
    group.add(innerRoofBevel);

    // Inner Seating Tiers (Terraced Bowl)
    const seating = new THREE.Mesh(
      new THREE.CylinderGeometry(6.0, 4.2, 2.2, 32),
      this.materials.pureWhite
    );
    seating.position.y = 2.4;
    group.add(seating);

    // Sunken Green Pitch / Playing Turf
    const pitch = new THREE.Mesh(
      new THREE.CylinderGeometry(4.0, 4.0, 0.3, 32),
      this.materials.stadiumTurf
    );
    pitch.position.y = 1.35;
    group.add(pitch);

    // Running Track Oval
    const track = new THREE.Mesh(
      new THREE.RingGeometry(3.2, 4.0, 32),
      this.materials.brickStation
    );
    track.position.y = 1.51;
    track.rotation.x = -Math.PI / 2;
    group.add(track);

    return group;
  }

  // --- 6. WATERFRONT PIER, FERRIS WHEEL & WATERWAY ---
  createWaterfrontAndWheel(x: number, z: number): THREE.Group {
    const group = new THREE.Group();
    group.position.set(x, 0, z);
    group.name = 'Landmark_Waterfront';
    group.userData = { landmarkId: 'waterfront-promenade', name: 'Bay Area Ferry Terminal & Ferris Wheel' };

    // Waterfront Pier Platform
    const pier = new THREE.Mesh(
      new THREE.BoxGeometry(10, 0.8, 14),
      this.materials.sidewalkConcrete
    );
    pier.position.set(0, 0.4, 0);
    pier.receiveShadow = true;
    group.add(pier);

    // Terminal Building
    const terminal = new THREE.Mesh(
      new THREE.BoxGeometry(6, 3, 4.5),
      this.materials.whiteFacade
    );
    terminal.position.set(0, 2.2, -3.5);
    terminal.castShadow = true;
    group.add(terminal);

    const terminalGlass = new THREE.Mesh(
      new THREE.BoxGeometry(6.1, 1.8, 2.5),
      this.materials.cyanGlass
    );
    terminalGlass.position.set(0, 2.2, -2.5);
    group.add(terminalGlass);

    // Ferris Wheel A-Frame Legs
    const legGeo = new THREE.CylinderGeometry(0.2, 0.35, 11, 8);
    const legLeft = new THREE.Mesh(legGeo, this.materials.pureWhite);
    legLeft.position.set(-1.8, 5.5, 3);
    legLeft.rotation.z = -0.22;
    legLeft.castShadow = true;
    group.add(legLeft);

    const legRight = new THREE.Mesh(legGeo, this.materials.pureWhite);
    legRight.position.set(1.8, 5.5, 3);
    legRight.rotation.z = 0.22;
    legRight.castShadow = true;
    group.add(legRight);

    // Ferris Wheel Rotating Group
    const wheelGroup = new THREE.Group();
    wheelGroup.position.set(0, 10.5, 3);
    wheelGroup.name = 'Animated_FerrisWheel';

    // Outer & Inner Rims
    const outerRim = new THREE.Mesh(
      new THREE.TorusGeometry(6.2, 0.18, 8, 32),
      this.materials.pureWhite
    );
    wheelGroup.add(outerRim);

    const innerRim = new THREE.Mesh(
      new THREE.TorusGeometry(3.6, 0.12, 8, 24),
      this.materials.pureWhite
    );
    wheelGroup.add(innerRim);

    // Center axle
    const axle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.8, 0.8, 0.8, 16),
      this.materials.templeGold
    );
    axle.rotation.x = Math.PI / 2;
    wheelGroup.add(axle);

    // Spokes & Gondolas
    const gondolaCount = 16;
    for (let i = 0; i < gondolaCount; i++) {
      const angle = (i / gondolaCount) * Math.PI * 2;
      // Spoke rod
      const spoke = new THREE.Mesh(
        new THREE.CylinderGeometry(0.06, 0.06, 6.2, 6),
        this.materials.pureWhite
      );
      spoke.position.set((Math.cos(angle) * 6.2) / 2, (Math.sin(angle) * 6.2) / 2, 0);
      spoke.rotation.z = angle - Math.PI / 2;
      wheelGroup.add(spoke);

      // Passenger Gondola pod
      const pod = new THREE.Mesh(
        new THREE.BoxGeometry(0.8, 0.9, 0.7),
        i % 2 === 0 ? this.materials.cyanGlass : this.materials.whiteFacade
      );
      pod.position.set(Math.cos(angle) * 6.2, Math.sin(angle) * 6.2, 0);
      wheelGroup.add(pod);
    }

    group.add(wheelGroup);

    return group;
  }
}
