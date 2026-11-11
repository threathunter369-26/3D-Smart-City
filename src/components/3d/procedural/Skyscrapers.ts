import * as THREE from 'three';
import { CityMaterials } from '../../../utils/materials';

export interface BuildingConfig {
  x: number;
  z: number;
  width: number;
  depth: number;
  height: number;
  style: 'blue-glass-tower' | 'stepped-highrise' | 'commercial-office' | 'midrise-block' | 'tech-hub';
  name: string;
  landmarkId?: string;
  rotationY?: number;
}

export class SkyscrapersBuilder {
  materials: CityMaterials;

  constructor(materials: CityMaterials) {
    this.materials = materials;
  }

  createBuilding(config: BuildingConfig): THREE.Group {
    const group = new THREE.Group();
    group.position.set(config.x, 0, config.z);
    if (config.rotationY) group.rotation.y = config.rotationY;
    group.name = `Building_${config.name.replace(/\s+/g, '_')}`;
    group.userData = {
      isBuilding: true,
      name: config.name,
      height: config.height,
      landmarkId: config.landmarkId,
    };

    switch (config.style) {
      case 'blue-glass-tower':
        this.buildBlueGlassTower(group, config);
        break;
      case 'stepped-highrise':
        this.buildSteppedHighrise(group, config);
        break;
      case 'commercial-office':
        this.buildCommercialOffice(group, config);
        break;
      case 'tech-hub':
        this.buildTechHub(group, config);
        break;
      case 'midrise-block':
      default:
        this.buildMidriseBlock(group, config);
        break;
    }

    return group;
  }

  private buildBlueGlassTower(group: THREE.Group, c: BuildingConfig) {
    // 1. Podium / Entrance lobby
    const podiumH = 2.4;
    const podium = new THREE.Mesh(
      new THREE.BoxGeometry(c.width * 1.1, podiumH, c.depth * 1.1),
      this.materials.whiteFacade
    );
    podium.position.y = podiumH / 2;
    podium.castShadow = true;
    podium.receiveShadow = true;
    group.add(podium);

    // Glass lobby entrance
    const lobbyGlass = new THREE.Mesh(
      new THREE.BoxGeometry(c.width * 0.9, podiumH * 0.8, c.depth * 1.12),
      this.materials.cyanGlass
    );
    lobbyGlass.position.y = podiumH * 0.45;
    group.add(lobbyGlass);

    // 2. Main Glass Tower Shaft
    const towerH = c.height - podiumH - 3;
    const towerShaft = new THREE.Mesh(
      new THREE.BoxGeometry(c.width, towerH, c.depth),
      this.materials.windowGrid
    );
    towerShaft.position.y = podiumH + towerH / 2;
    towerShaft.castShadow = true;
    towerShaft.receiveShadow = true;
    group.add(towerShaft);

    // Vertical structural mullions/accent fins
    const finThick = 0.2;
    [-c.width / 2, c.width / 2].forEach((fx) => {
      const fin = new THREE.Mesh(
        new THREE.BoxGeometry(finThick, towerH + 2, c.depth + 0.2),
        this.materials.whiteFacade
      );
      fin.position.set(fx, podiumH + towerH / 2, 0);
      fin.castShadow = true;
      group.add(fin);
    });

    // 3. Top Crown & Helipad / Rooftop Chillers
    const crownH = 2.2;
    const crown = new THREE.Mesh(
      new THREE.BoxGeometry(c.width * 0.95, crownH, c.depth * 0.95),
      this.materials.whiteFacade
    );
    crown.position.y = c.height - crownH / 2;
    crown.castShadow = true;
    group.add(crown);

    // Rooftop Chillers / HVAC
    const chiller1 = new THREE.Mesh(
      new THREE.BoxGeometry(1.6, 1.2, 1.8),
      this.materials.metalChiller
    );
    chiller1.position.set(-c.width * 0.2, c.height + 0.6, -c.depth * 0.2);
    group.add(chiller1);

    const chiller2 = new THREE.Mesh(
      new THREE.BoxGeometry(1.4, 0.9, 1.4),
      this.materials.metalChiller
    );
    chiller2.position.set(c.width * 0.2, c.height + 0.45, -c.depth * 0.2);
    group.add(chiller2);

    // Helipad marking ring on roof
    const helipadRing = new THREE.Mesh(
      new THREE.RingGeometry(1.2, 1.45, 24),
      this.materials.cyberCyanGlow
    );
    helipadRing.position.set(0, c.height + 0.05, c.depth * 0.15);
    helipadRing.rotation.x = -Math.PI / 2;
    group.add(helipadRing);

    // Antenna Mast
    const mast = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.2, 4.5, 6),
      this.materials.tokyoTowerWhite
    );
    mast.position.set(0, c.height + 2.25, -c.depth * 0.2);
    group.add(mast);
  }

  private buildSteppedHighrise(group: THREE.Group, c: BuildingConfig) {
    // 3 stepped tiers
    const tier1H = c.height * 0.4;
    const tier2H = c.height * 0.35;
    const tier3H = c.height * 0.25;

    // Tier 1 Base
    const t1 = new THREE.Mesh(
      new THREE.BoxGeometry(c.width, tier1H, c.depth),
      this.materials.windowGridDark
    );
    t1.position.y = tier1H / 2;
    t1.castShadow = true;
    group.add(t1);

    // Tier 1 Horizontal White Band
    const band1 = new THREE.Mesh(
      new THREE.BoxGeometry(c.width + 0.3, 0.6, c.depth + 0.3),
      this.materials.pureWhite
    );
    band1.position.y = tier1H;
    group.add(band1);

    // Tier 2 Setback
    const t2 = new THREE.Mesh(
      new THREE.BoxGeometry(c.width * 0.8, tier2H, c.depth * 0.8),
      this.materials.windowGrid
    );
    t2.position.y = tier1H + tier2H / 2;
    t2.castShadow = true;
    group.add(t2);

    // Tier 2 Band
    const band2 = new THREE.Mesh(
      new THREE.BoxGeometry(c.width * 0.8 + 0.3, 0.5, c.depth * 0.8 + 0.3),
      this.materials.pureWhite
    );
    band2.position.y = tier1H + tier2H;
    group.add(band2);

    // Tier 3 Top
    const t3 = new THREE.Mesh(
      new THREE.BoxGeometry(c.width * 0.6, tier3H, c.depth * 0.6),
      this.materials.cyanGlass
    );
    t3.position.y = tier1H + tier2H + tier3H / 2;
    t3.castShadow = true;
    group.add(t3);

    // Rooftop elevator penthouse
    const penthouse = new THREE.Mesh(
      new THREE.BoxGeometry(c.width * 0.3, 1.5, c.depth * 0.3),
      this.materials.whiteFacade
    );
    penthouse.position.y = c.height + 0.75;
    group.add(penthouse);
  }

  private buildCommercialOffice(group: THREE.Group, c: BuildingConfig) {
    // Modern 6-9 story office with white mullions and blue glass
    const basePodium = new THREE.Mesh(
      new THREE.BoxGeometry(c.width * 1.05, 1.8, c.depth * 1.05),
      this.materials.whiteFacade
    );
    basePodium.position.y = 0.9;
    group.add(basePodium);

    const bodyH = c.height - 2.8;
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(c.width, bodyH, c.depth),
      this.materials.windowGrid
    );
    body.position.y = 1.8 + bodyH / 2;
    body.castShadow = true;
    body.receiveShadow = true;
    group.add(body);

    // Entrance canopy
    const canopy = new THREE.Mesh(
      new THREE.BoxGeometry(c.width * 0.5, 0.2, 1.5),
      this.materials.pureWhite
    );
    canopy.position.set(0, 1.8, c.depth / 2 + 0.75);
    group.add(canopy);

    // Rooftop perimeter parapet
    const parapet = new THREE.Mesh(
      new THREE.BoxGeometry(c.width * 0.98, 0.8, c.depth * 0.98),
      this.materials.whiteFacade
    );
    parapet.position.y = c.height - 0.4;
    group.add(parapet);

    // Rooftop solar panels
    const solarGeo = new THREE.BoxGeometry(1.8, 0.15, 1.2);
    const solar1 = new THREE.Mesh(solarGeo, this.materials.darkGlass);
    solar1.position.set(-c.width * 0.2, c.height + 0.1, 0);
    solar1.rotation.x = 0.2;
    group.add(solar1);

    const solar2 = new THREE.Mesh(solarGeo, this.materials.darkGlass);
    solar2.position.set(c.width * 0.2, c.height + 0.1, 0);
    solar2.rotation.x = 0.2;
    group.add(solar2);
  }

  private buildTechHub(group: THREE.Group, c: BuildingConfig) {
    // Glass cube with cyber frame and diagonal architectural bracings
    const bodyH = c.height - 2;
    const mainCube = new THREE.Mesh(
      new THREE.BoxGeometry(c.width, bodyH, c.depth),
      this.materials.cyanGlass
    );
    mainCube.position.y = bodyH / 2 + 0.2;
    mainCube.castShadow = true;
    group.add(mainCube);

    // White perimeter exo-skeleton
    const exoFrame = new THREE.Mesh(
      new THREE.BoxGeometry(c.width + 0.4, 0.6, c.depth + 0.4),
      this.materials.pureWhite
    );
    exoFrame.position.y = bodyH / 2 + 0.2;
    group.add(exoFrame);

    // Top tech deck with glowing cyber antennas
    const topDeck = new THREE.Mesh(
      new THREE.BoxGeometry(c.width * 0.8, 1.4, c.depth * 0.8),
      this.materials.whiteFacade
    );
    topDeck.position.y = bodyH + 0.9;
    group.add(topDeck);

    // Satellite dish
    const dish = new THREE.Mesh(
      new THREE.SphereGeometry(0.9, 12, 8, 0, Math.PI),
      this.materials.whiteFacade
    );
    dish.position.set(-c.width * 0.2, bodyH + 2.2, 0);
    dish.rotation.x = -Math.PI / 4;
    group.add(dish);
  }

  private buildMidriseBlock(group: THREE.Group, c: BuildingConfig) {
    // Clean residential / commercial mid-rise with balcony rhythm
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(c.width, c.height, c.depth),
      this.materials.whiteFacade
    );
    body.position.y = c.height / 2;
    body.castShadow = true;
    body.receiveShadow = true;
    group.add(body);

    // Front window strip
    const winStrip = new THREE.Mesh(
      new THREE.BoxGeometry(c.width * 0.85, c.height * 0.75, 0.2),
      this.materials.windowGrid
    );
    winStrip.position.set(0, c.height / 2, c.depth / 2 + 0.05);
    group.add(winStrip);

    // Rooftop AC unit
    const ac = new THREE.Mesh(
      new THREE.BoxGeometry(1.2, 0.8, 1.2),
      this.materials.metalChiller
    );
    ac.position.set(0, c.height + 0.4, 0);
    group.add(ac);
  }
}
