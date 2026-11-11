import * as THREE from 'three';
import { CityMaterials } from '../../../utils/materials';
import { CityTelemetry } from '../../../types/city';

export class DataBillboardsBuilder {
  materials: CityMaterials;
  floatingPanels: { mesh: THREE.Group; baseY: number; phase: number }[] = [];
  locationPins: { mesh: THREE.Group; baseY: number; phase: number }[] = [];

  constructor(materials: CityMaterials) {
    this.materials = materials;
  }

  buildAllBillboards(telemetry: CityTelemetry): {
    group: THREE.Group;
    update: (time: number, telemetry: CityTelemetry) => void;
  } {
    const group = new THREE.Group();
    group.name = 'City_DataBillboards';
    this.floatingPanels = [];
    this.locationPins = [];

    // 1. Floating Panel: TRAFFIC FLOW
    const trafficPanel = this.createTrafficBillboard(telemetry);
    trafficPanel.position.set(-6, 22, -14);
    group.add(trafficPanel);
    this.floatingPanels.push({ mesh: trafficPanel, baseY: 22, phase: 0 });

    // 2. Floating Panel: ENERGY CONSUMPTION
    const energyPanel = this.createEnergyBillboard(telemetry);
    energyPanel.position.set(10, 24, -12);
    group.add(energyPanel);
    this.floatingPanels.push({ mesh: energyPanel, baseY: 24, phase: 1.2 });

    // 3. Floating Panel: AIR QUALITY
    const airPanel = this.createAirQualityBillboard(telemetry);
    airPanel.position.set(24, 20, -6);
    group.add(airPanel);
    this.floatingPanels.push({ mesh: airPanel, baseY: 20, phase: 2.4 });

    // 4. Floating Panel: VISITORS TODAY
    const visitorsPanel = this.createVisitorsBillboard(telemetry);
    visitorsPanel.position.set(-20, 10, 16);
    group.add(visitorsPanel);
    this.floatingPanels.push({ mesh: visitorsPanel, baseY: 10, phase: 3.6 });

    // 5. Floating Panel: CITY BUDGET
    const budgetPanel = this.createBudgetBillboard(telemetry);
    budgetPanel.position.set(24, 8, 20);
    group.add(budgetPanel);
    this.floatingPanels.push({ mesh: budgetPanel, baseY: 8, phase: 4.8 });

    // 6. Ground 3D Data Pedestals (in Tokyo Station / Central Plaza)
    const groundPedestals = this.createGroundDataPedestals();
    group.add(groundPedestals);

    // 7. Plaza Interactive Presentation Screen (with presenter figures)
    const presentationScreen = this.createPresentationScreen();
    presentationScreen.position.set(12, 0, 9);
    group.add(presentationScreen);

    // 8. 3D Floating Location Pin Beacons
    const pinCoords: [number, number, number, string][] = [
      [-10, 39, -4, 'Tokyo Tower'],
      [24, 50, -18, 'Skytree'],
      [-2, 14, 4, 'Tokyo Station'],
      [-18, 18, 6, 'Senso-ji'],
      [-20, 18, 14, 'West District'],
    ];

    pinCoords.forEach(([px, py, pz, label]) => {
      const pin = this.createLocationPin(label);
      pin.position.set(px, py, pz);
      group.add(pin);
      this.locationPins.push({ mesh: pin, baseY: py, phase: Math.random() * Math.PI * 2 });
    });

    // Update function
    const update = (time: number) => {
      // Gentle floating hover motion for billboard panels
      this.floatingPanels.forEach((p) => {
        p.mesh.position.y = p.baseY + Math.sin(time * 1.5 + p.phase) * 0.45;
      });

      // Gentle floating bobbing for location pins
      this.locationPins.forEach((p) => {
        p.mesh.position.y = p.baseY + Math.sin(time * 2.0 + p.phase) * 0.35;
        p.mesh.rotation.y = time * 0.5 + p.phase;
      });
    };

    return { group, update };
  }

  // Helper to create a glassmorphism billboard mesh with procedural canvas
  private createGlassBillboard(
    canvas: HTMLCanvasElement,
    width: number,
    height: number
  ): THREE.Group {
    const cardGroup = new THREE.Group();

    // 1. White frame border
    const frameGeo = new THREE.BoxGeometry(width + 0.3, height + 0.3, 0.25);
    const frameMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.15,
      metalness: 0.1,
    });
    const frame = new THREE.Mesh(frameGeo, frameMat);
    cardGroup.add(frame);

    // 2. Glass face
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 4;

    const faceMat = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      opacity: 0.96,
    });

    const faceGeo = new THREE.PlaneGeometry(width, height);
    const face = new THREE.Mesh(faceGeo, faceMat);
    face.position.z = 0.13;
    cardGroup.add(face);

    // Back face (so it renders cleanly from both sides)
    const backFace = new THREE.Mesh(faceGeo, faceMat);
    backFace.position.z = -0.13;
    backFace.rotation.y = Math.PI;
    cardGroup.add(backFace);

    // Card rotation to face isometric angle
    cardGroup.rotation.y = -Math.PI / 4;

    return cardGroup;
  }

  // --- 1. TRAFFIC FLOW BILLBOARD ---
  private createTrafficBillboard(t: CityTelemetry): THREE.Group {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 340;
    const ctx = canvas.getContext('2d')!;

    // Background: semi-transparent crisp white glass
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.roundRect(0, 0, 512, 340, 24);
    ctx.fill();

    // Blue title
    ctx.fillStyle = '#0284c7';
    ctx.font = 'bold 24px -apple-system, sans-serif';
    ctx.fillText('TRAFFIC FLOW', 32, 48);

    // Big 76% number
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 64px -apple-system, sans-serif';
    ctx.fillText(`${t.trafficFlowPercent}%`, 32, 118);

    // WiFi icon
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(440, 60, 22, -Math.PI * 0.75, -Math.PI * 0.25);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(440, 60, 14, -Math.PI * 0.75, -Math.PI * 0.25);
    ctx.stroke();
    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    ctx.arc(440, 56, 4, 0, Math.PI * 2);
    ctx.fill();

    // Bar Chart
    const barValues = [35, 45, 65, 82, 92, 76, 70, 88, 62, 52];
    const chartX = 32;
    const chartY = 270;
    const barWidth = 32;
    const barGap = 14;

    barValues.forEach((val, idx) => {
      const barH = (val / 100) * 120;
      const bx = chartX + idx * (barWidth + barGap);

      // Gradient cyan bar
      const grad = ctx.createLinearGradient(0, chartY - barH, 0, chartY);
      grad.addColorStop(0, '#38bdf8');
      grad.addColorStop(1, '#0284c7');
      ctx.fillStyle = grad;
      ctx.roundRect(bx, chartY - barH, barWidth, barH, 6);
      ctx.fill();
    });

    // Time labels: 0時, 6時, 12時, 18時, 24時
    ctx.fillStyle = '#64748b';
    ctx.font = '16px -apple-system, sans-serif';
    ctx.fillText('0時', 36, 305);
    ctx.fillText('6時', 130, 305);
    ctx.fillText('12時', 225, 305);
    ctx.fillText('18時', 320, 305);
    ctx.fillText('24時', 415, 305);

    return this.createGlassBillboard(canvas, 9, 6);
  }

  // --- 2. ENERGY CONSUMPTION BILLBOARD ---
  private createEnergyBillboard(t: CityTelemetry): THREE.Group {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 300;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.roundRect(0, 0, 512, 300, 24);
    ctx.fill();

    ctx.fillStyle = '#0284c7';
    ctx.font = 'bold 22px -apple-system, sans-serif';
    ctx.fillText('ENERGY CONSUMPTION', 32, 46);

    // Circular Progress Arc
    const cx = 100;
    const cy = 160;
    const r = 58;

    // Track
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();

    // Progress
    const percent = t.energyConsumptionPercent;
    const angle = (percent / 100) * Math.PI * 2;
    ctx.strokeStyle = '#0284c7';
    ctx.beginPath();
    ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + angle);
    ctx.stroke();

    // Center %
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 34px -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${percent}%`, cx, cy + 12);
    ctx.textAlign = 'left';

    // Animated sine sparkline curve
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(210, 160);
    ctx.bezierCurveTo(260, 110, 290, 210, 340, 140);
    ctx.bezierCurveTo(390, 80, 420, 180, 470, 150);
    ctx.stroke();

    ctx.fillStyle = '#64748b';
    ctx.font = '16px -apple-system, sans-serif';
    ctx.fillText('Grid Peak: 4.8 GW | Solar: 34%', 210, 230);

    return this.createGlassBillboard(canvas, 8.5, 5);
  }

  // --- 3. AIR QUALITY BILLBOARD ---
  private createAirQualityBillboard(t: CityTelemetry): THREE.Group {
    const canvas = document.createElement('canvas');
    canvas.width = 460;
    canvas.height = 280;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.roundRect(0, 0, 460, 280, 24);
    ctx.fill();

    ctx.fillStyle = '#0284c7';
    ctx.font = 'bold 22px -apple-system, sans-serif';
    ctx.fillText('AIR QUALITY', 32, 46);

    // Number + Good
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 58px -apple-system, sans-serif';
    ctx.fillText(`${t.airQualityIndex}`, 32, 115);

    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 22px -apple-system, sans-serif';
    ctx.fillText('Good', 120, 105);

    // Smooth wave curve
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(32, 210);
    ctx.bezierCurveTo(120, 160, 180, 240, 260, 180);
    ctx.bezierCurveTo(340, 130, 380, 220, 420, 170);
    ctx.stroke();

    ctx.fillStyle = '#64748b';
    ctx.font = '16px -apple-system, sans-serif';
    ctx.fillText('PM2.5: 11.4 µg/m³  CO2: 412 ppm', 32, 250);

    return this.createGlassBillboard(canvas, 7.5, 4.6);
  }

  // --- 4. VISITORS TODAY BILLBOARD ---
  private createVisitorsBillboard(t: CityTelemetry): THREE.Group {
    const canvas = document.createElement('canvas');
    canvas.width = 480;
    canvas.height = 300;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.roundRect(0, 0, 480, 300, 24);
    ctx.fill();

    ctx.fillStyle = '#0284c7';
    ctx.font = 'bold 22px -apple-system, sans-serif';
    ctx.fillText('VISITORS TODAY', 32, 46);

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 44px -apple-system, sans-serif';
    ctx.fillText(`${t.visitorsToday.toLocaleString()}人`, 32, 106);

    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 20px -apple-system, sans-serif';
    ctx.fillText(`+${t.visitorsGrowth}% (前日比)`, 32, 142);

    // Mini bar chart
    const bars = [25, 40, 55, 70, 85, 95];
    bars.forEach((val, i) => {
      ctx.fillStyle = '#38bdf8';
      const bh = (val / 100) * 80;
      ctx.roundRect(32 + i * 45, 240 - bh, 30, bh, 4);
      ctx.fill();
    });

    return this.createGlassBillboard(canvas, 7.8, 4.8);
  }

  // --- 5. CITY BUDGET BILLBOARD ---
  private createBudgetBillboard(t: CityTelemetry): THREE.Group {
    const canvas = document.createElement('canvas');
    canvas.width = 520;
    canvas.height = 360;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.roundRect(0, 0, 520, 360, 24);
    ctx.fill();

    ctx.fillStyle = '#0284c7';
    ctx.font = 'bold 22px -apple-system, sans-serif';
    ctx.fillText('CITY BUDGET', 32, 46);

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 36px -apple-system, sans-serif';
    ctx.fillText(`¥${(t.budgetTotalYen / 1000000000000).toFixed(2)}兆`, 32, 94);

    // Donut Chart
    const cx = 110;
    const cy = 230;
    const rOut = 75;
    const rIn = 45;

    let startA = -Math.PI / 2;
    t.budgetBreakdown.forEach((item) => {
      const sliceA = (item.percent / 100) * Math.PI * 2;
      ctx.fillStyle = item.color;
      ctx.beginPath();
      ctx.arc(cx, cy, rOut, startA, startA + sliceA);
      ctx.arc(cx, cy, rIn, startA + sliceA, startA, true);
      ctx.closePath();
      ctx.fill();
      startA += sliceA;
    });

    // Legend
    t.budgetBreakdown.forEach((item, idx) => {
      const ly = 160 + idx * 38;
      ctx.fillStyle = item.color;
      ctx.fillRect(230, ly, 16, 16);

      ctx.fillStyle = '#1e293b';
      ctx.font = '16px -apple-system, sans-serif';
      ctx.fillText(`${item.category} ${item.percent}%`, 256, ly + 14);
    });

    return this.createGlassBillboard(canvas, 8.5, 5.8);
  }

  // --- 6. GROUND 3D DATA PEDESTALS ---
  private createGroundDataPedestals(): THREE.Group {
    const group = new THREE.Group();
    group.name = 'Ground_Data_Pedestals';

    // A. 3D Bar Chart Pedestal in Plaza (left)
    const barPedestal = new THREE.Group();
    barPedestal.position.set(-6, 0.2, 10);

    // Rounded white base slab
    const baseMesh1 = new THREE.Mesh(
      new THREE.BoxGeometry(4.8, 0.4, 4.8),
      this.materials.pureWhite
    );
    baseMesh1.receiveShadow = true;
    barPedestal.add(baseMesh1);

    // 4 Extruded 3D Blue Bars of stepped heights
    const barHeights = [1.2, 2.4, 3.6, 4.8];
    barHeights.forEach((bh, i) => {
      const barMesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.7, bh, 0.7),
        this.materials.cyanGlass
      );
      barMesh.position.set(-1.4 + i * 0.95, 0.2 + bh / 2, 0);
      barMesh.castShadow = true;
      barPedestal.add(barMesh);
    });

    group.add(barPedestal);

    // B. 3D Donut Chart Pedestal in Plaza (right)
    const donutPedestal = new THREE.Group();
    donutPedestal.position.set(0, 0.2, 10);

    const baseMesh2 = new THREE.Mesh(
      new THREE.BoxGeometry(4.8, 0.4, 4.8),
      this.materials.pureWhite
    );
    baseMesh2.receiveShadow = true;
    donutPedestal.add(baseMesh2);

    // Extruded 3D Pie / Donut slices
    const donutSlice1 = new THREE.Mesh(
      new THREE.CylinderGeometry(1.5, 1.5, 0.8, 24, 1, false, 0, Math.PI * 1.4),
      this.materials.cyanGlass
    );
    donutSlice1.position.y = 0.6;
    donutSlice1.castShadow = true;
    donutPedestal.add(donutSlice1);

    // Separated slice
    const donutSlice2 = new THREE.Mesh(
      new THREE.CylinderGeometry(1.5, 1.5, 0.8, 24, 1, false, Math.PI * 1.45, Math.PI * 0.5),
      this.materials.windowGridDark
    );
    donutSlice2.position.set(0.35, 0.6, 0.35);
    donutSlice2.castShadow = true;
    donutPedestal.add(donutSlice2);

    // Center cylinder hole (inner cutout effect)
    const centerCut = new THREE.Mesh(
      new THREE.CylinderGeometry(0.65, 0.65, 0.9, 16),
      this.materials.pureWhite
    );
    centerCut.position.y = 0.61;
    donutPedestal.add(centerCut);

    group.add(donutPedestal);

    return group;
  }

  // --- 7. PLAZA PRESENTATION SCREEN ---
  private createPresentationScreen(): THREE.Group {
    const group = new THREE.Group();
    group.name = 'Plaza_Presentation_Display';

    // Pedestal stand
    const stand = new THREE.Mesh(
      new THREE.BoxGeometry(0.8, 1.4, 0.6),
      this.materials.pureWhite
    );
    stand.position.y = 0.7;
    group.add(stand);

    // Large monitor canvas
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 320;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 512, 320);

    // Screen title
    ctx.fillStyle = '#0284c7';
    ctx.font = 'bold 22px -apple-system, sans-serif';
    ctx.fillText('METROPOLITAN DIGITAL TWIN TELEMETRY', 24, 38);

    // Mini graphs on screen
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(100, 140, 50, 0, Math.PI * 1.5);
    ctx.stroke();

    // Bars
    [20, 50, 75, 45, 90].forEach((h, i) => {
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(220 + i * 35, 200 - h, 24, h);
    });

    // Donut
    ctx.strokeStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(430, 140, 45, 0, Math.PI * 1.8);
    ctx.stroke();

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;

    // Monitor frame
    const monitorFrame = new THREE.Mesh(
      new THREE.BoxGeometry(7.2, 4.4, 0.3),
      this.materials.whiteFacade
    );
    monitorFrame.position.y = 3.6;
    monitorFrame.rotation.y = -Math.PI / 4;
    monitorFrame.castShadow = true;
    group.add(monitorFrame);

    // Screen face
    const screenFace = new THREE.Mesh(
      new THREE.PlaneGeometry(6.8, 4.0),
      new THREE.MeshBasicMaterial({ map: tex })
    );
    screenFace.position.set(0, 3.6, 0.16);
    screenFace.rotation.y = -Math.PI / 4;
    group.add(screenFace);

    return group;
  }

  // --- 8. 3D FLOATING LOCATION PIN ---
  private createLocationPin(_label: string): THREE.Group {
    const pin = new THREE.Group();

    // Blue teardrop map pin body
    const headGeo = new THREE.SphereGeometry(1.1, 16, 16);
    const headMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      roughness: 0.2,
      metalness: 0.3,
    });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.y = 1.4;
    pin.add(head);

    // White center circle
    const centerGeo = new THREE.CylinderGeometry(0.45, 0.45, 0.2, 16);
    const centerMesh = new THREE.Mesh(centerGeo, this.materials.pureWhite);
    centerMesh.rotation.x = Math.PI / 2;
    centerMesh.position.set(0, 1.4, 1.05);
    pin.add(centerMesh);

    // Inverted cone tip
    const coneGeo = new THREE.ConeGeometry(0.9, 1.6, 16);
    const cone = new THREE.Mesh(coneGeo, headMat);
    cone.position.y = 0.8;
    cone.rotation.x = Math.PI;
    pin.add(cone);

    // Glowing base ring on ground / anchor
    const ringGeo = new THREE.RingGeometry(0.8, 1.1, 24);
    const ring = new THREE.Mesh(ringGeo, this.materials.cyberCyanGlow);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.05;
    pin.add(ring);

    return pin;
  }
}
