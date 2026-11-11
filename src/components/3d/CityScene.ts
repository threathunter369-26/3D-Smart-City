import * as THREE from 'three';
import { createCityMaterials, CityMaterials } from '../../utils/materials';
import { LandmarksBuilder } from './procedural/Landmarks';
import { BuildingConfig, SkyscrapersBuilder } from './procedural/Skyscrapers';
import { InfrastructureBuilder } from './procedural/Infrastructure';
import { FoliageBuilder } from './procedural/Foliage';
import { VehiclesBuilder } from './procedural/Vehicles';
import { PedestriansBuilder } from './procedural/Pedestrians';
import { DataBillboardsBuilder } from './procedural/DataBillboards';
import { NetworkGridBuilder } from './procedural/NetworkGrid';
import { WeatherSystem } from './procedural/WeatherSystem';
import { CityTelemetry, LandmarkData, WeatherType, EarthquakeState } from '../../types/city';
import { CITY_LANDMARKS } from '../../store/useCityStore';

export class CityScene {
  scene: THREE.Scene;
  materials: CityMaterials;

  landmarksBuilder: LandmarksBuilder;
  skyscrapersBuilder: SkyscrapersBuilder;
  infrastructureBuilder: InfrastructureBuilder;
  foliageBuilder: FoliageBuilder;
  vehiclesBuilder: VehiclesBuilder;
  pedestriansBuilder: PedestriansBuilder;
  billboardsBuilder: DataBillboardsBuilder;
  networkGridBuilder: NetworkGridBuilder;
  weatherSystem!: WeatherSystem;

  // Groups
  infrastructureGroup!: THREE.Group;
  landmarksGroup!: THREE.Group;
  skyscrapersGroup!: THREE.Group;
  foliageGroup!: THREE.Group;
  vehiclesGroup!: THREE.Group;
  pedestriansGroup!: THREE.Group;
  billboardsGroup!: THREE.Group;
  networkGridGroup!: THREE.Group;

  // Animated elements
  ferrisWheel: THREE.Group | null = null;
  updateVehicles!: (delta: number) => void;
  updateBillboards!: (time: number, telemetry: CityTelemetry) => void;
  updateNetwork!: (delta: number) => void;

  // Raycasting targets
  interactiveObjects: THREE.Object3D[] = [];

  constructor() {
    this.scene = new THREE.Scene();
    this.materials = createCityMaterials();

    this.landmarksBuilder = new LandmarksBuilder(this.materials);
    this.skyscrapersBuilder = new SkyscrapersBuilder(this.materials);
    this.infrastructureBuilder = new InfrastructureBuilder(this.materials);
    this.foliageBuilder = new FoliageBuilder(this.materials);
    this.vehiclesBuilder = new VehiclesBuilder(this.materials);
    this.pedestriansBuilder = new PedestriansBuilder(this.materials);
    this.billboardsBuilder = new DataBillboardsBuilder(this.materials);
    this.networkGridBuilder = new NetworkGridBuilder(this.materials);
  }

  init(telemetry: CityTelemetry): void {
    // 1. Infrastructure
    this.infrastructureGroup = this.infrastructureBuilder.buildGroundAndRoads();
    this.scene.add(this.infrastructureGroup);

    // 2. Landmarks
    this.landmarksGroup = new THREE.Group();
    this.landmarksGroup.name = 'City_Landmarks';

    // Tokyo Tower
    const tokyoTower = this.landmarksBuilder.createTokyoTower(-10, -4);
    this.landmarksGroup.add(tokyoTower);

    // Tokyo Skytree
    const skytree = this.landmarksBuilder.createSkytree(24, -18);
    this.landmarksGroup.add(skytree);

    // Tokyo Station
    const tokyoStation = this.landmarksBuilder.createTokyoStation(-2, 4);
    this.landmarksGroup.add(tokyoStation);

    // Senso-ji Temple & Pagoda
    const temple = this.landmarksBuilder.createTempleComplex(-18, 6);
    this.landmarksGroup.add(temple);

    // National Stadium
    const stadium = this.landmarksBuilder.createNationalStadium(-4, -12);
    this.landmarksGroup.add(stadium);

    // Waterfront & Ferris Wheel
    const waterfront = this.landmarksBuilder.createWaterfrontAndWheel(20, 10);
    this.landmarksGroup.add(waterfront);
    this.ferrisWheel = waterfront.getObjectByName('Animated_FerrisWheel') as THREE.Group;

    this.scene.add(this.landmarksGroup);

    // 3. Commercial Skyscrapers & Mid-Rises
    this.skyscrapersGroup = new THREE.Group();
    this.skyscrapersGroup.name = 'City_Skyscrapers';

    const buildingConfigs: BuildingConfig[] = [
      // Central Smart Financial Tower
      {
        x: -18,
        z: -6,
        width: 6,
        depth: 6,
        height: 28,
        style: 'blue-glass-tower',
        name: 'Central Smart Financial Tower',
        landmarkId: 'financial-tower',
      },
      // Metropolitan Tech Center
      {
        x: 8,
        z: -6,
        width: 6.5,
        depth: 6.5,
        height: 22,
        style: 'tech-hub',
        name: 'Metropolitan Tech Center',
        landmarkId: 'tech-hub',
      },
      // High-rise Stepped Tower behind station
      {
        x: -2,
        z: -6,
        width: 5.5,
        depth: 5,
        height: 20,
        style: 'stepped-highrise',
        name: 'Marunouchi Central High-Rise',
      },
      // West Commercial Office Tower
      {
        x: -24,
        z: 0,
        width: 5,
        depth: 6,
        height: 18,
        style: 'commercial-office',
        name: 'West Gateway Plaza',
      },
      // Waterfront Commercial Block
      {
        x: 10,
        z: 14,
        width: 5.5,
        depth: 5.5,
        height: 15,
        style: 'commercial-office',
        name: 'Harbor View Center',
      },
      // North-East High-rise
      {
        x: 15,
        z: -12,
        width: 5,
        depth: 5,
        height: 19,
        style: 'blue-glass-tower',
        name: 'Sumida Cyber Tower',
      },
      // Stadium East Office
      {
        x: 4,
        z: -15,
        width: 4.5,
        depth: 4.5,
        height: 14,
        style: 'midrise-block',
        name: 'Olympic Park Commercial Annex',
      },
      // South residential blocks
      {
        x: -10,
        z: 14,
        width: 5,
        depth: 4.5,
        height: 11,
        style: 'midrise-block',
        name: 'South Urban Residences',
      },
    ];

    buildingConfigs.forEach((c) => {
      const bMesh = this.skyscrapersBuilder.createBuilding(c);
      this.skyscrapersGroup.add(bMesh);
    });

    this.scene.add(this.skyscrapersGroup);

    // 4. Foliage & Greenery
    this.foliageGroup = this.foliageBuilder.buildFoliage();
    this.scene.add(this.foliageGroup);

    // 5. Vehicles & Traffic
    const { group: vGroup, update: vUpdate } = this.vehiclesBuilder.buildVehicles();
    this.vehiclesGroup = vGroup;
    this.updateVehicles = vUpdate;
    this.scene.add(this.vehiclesGroup);

    // 6. Pedestrians
    this.pedestriansGroup = this.pedestriansBuilder.buildPedestrians();
    this.scene.add(this.pedestriansGroup);

    // 7. Floating Data Billboards & Pedestals
    const { group: bGroup, update: bUpdate } = this.billboardsBuilder.buildAllBillboards(telemetry);
    this.billboardsGroup = bGroup;
    this.updateBillboards = bUpdate;
    this.scene.add(this.billboardsGroup);

    // 8. Cyber IoT Network Grid
    const { group: nGroup, update: nUpdate } = this.networkGridBuilder.buildNetwork();
    this.networkGridGroup = nGroup;
    this.updateNetwork = nUpdate;
    this.scene.add(this.networkGridGroup);

    // 9. Procedural Weather, Stars, Tornado & Dynamic Physics System
    this.weatherSystem = new WeatherSystem(this.scene);

    // Collect interactive objects for raycasting
    this.interactiveObjects = [];
    this.landmarksGroup.children.forEach((child) => this.interactiveObjects.push(child));
    this.skyscrapersGroup.children.forEach((child) => this.interactiveObjects.push(child));
  }

  update(
    delta: number,
    elapsed: number,
    telemetry: CityTelemetry,
    weather: WeatherType,
    earthquake: EarthquakeState
  ): void {
    // 1. Rotate Ferris Wheel
    if (this.ferrisWheel) {
      this.ferrisWheel.rotation.z -= delta * 0.15;
    }

    // 2. Update vehicles
    if (this.updateVehicles) {
      this.updateVehicles(delta);
    }

    // 3. Update billboards floating motion
    if (this.updateBillboards) {
      this.updateBillboards(elapsed, telemetry);
    }

    // 4. Update cyber network pulses
    if (this.updateNetwork) {
      this.updateNetwork(delta);
    }

    // 5. Update Weather, Storms, Tornado & Physical Building Motion
    if (this.weatherSystem) {
      this.weatherSystem.update(
        delta,
        elapsed,
        weather,
        earthquake,
        this.landmarksGroup,
        this.skyscrapersGroup,
        this.foliageGroup
      );
    }
  }

  // Find landmark or building data from raycasted mesh
  getIntersectedEntity(mesh: THREE.Object3D): LandmarkData | null {
    let current: THREE.Object3D | null = mesh;
    while (current && current !== this.scene) {
      if (current.userData && current.userData.landmarkId) {
        const found = CITY_LANDMARKS.find((l) => l.id === current!.userData.landmarkId);
        if (found) return found;
      }
      if (current.userData && current.userData.isBuilding) {
        // Return synthetic landmark data for general building
        return {
          id: `building-${current.name}`,
          name: current.userData.name || 'Metropolitan Commercial Complex',
          japaneseName: '都心型高層オフィスビル',
          category: 'commercial',
          description: `High-efficiency commercial building (${current.userData.height}m height) with IoT HVAC automation, dynamic smart glass, and energy telemetry.`,
          position: [current.position.x, current.position.y, current.position.z],
          height: current.userData.height || 18,
          stats: {
            occupancy: 86,
            powerUsageKw: 1100,
            greenEnergyPercent: 48,
            iotSensorsCount: 92,
            healthStatus: 'optimal',
            dailyVisitors: 8400,
            airQualityIndex: 38,
          },
        };
      }
      current = current.parent;
    }
    return null;
  }
}
