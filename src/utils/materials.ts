import * as THREE from 'three';

// Procedural Canvas Texture Generators
export function createGridTexture(
  rows: number = 8,
  cols: number = 8,
  baseColor: string = '#203a5e',
  lineColor: string = '#7dd3fc',
  glowChance: number = 0.3
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, 256, 256);

  const cellW = 256 / cols;
  const cellH = 256 / rows;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const isLit = Math.random() < glowChance;
      ctx.fillStyle = isLit ? '#bae6fd' : '#38bdf8';
      ctx.globalAlpha = isLit ? 0.95 : 0.45;
      ctx.fillRect(c * cellW + 2, r * cellH + 2, cellW - 4, cellH - 4);
    }
  }

  ctx.globalAlpha = 1.0;
  ctx.strokeStyle = lineColor;
  ctx.lineWidth = 2;
  for (let r = 0; r <= rows; r++) {
    ctx.beginPath();
    ctx.moveTo(0, r * cellH);
    ctx.lineTo(256, r * cellH);
    ctx.stroke();
  }
  for (let c = 0; c <= cols; c++) {
    ctx.beginPath();
    ctx.moveTo(c * cellW, 0);
    ctx.lineTo(c * cellW, 256);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createBrickTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  // Red brick base
  ctx.fillStyle = '#992d24';
  ctx.fillRect(0, 0, 256, 256);

  // Horizontal stone bands & brick seams
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 3;
  for (let y = 32; y < 256; y += 64) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(256, y);
    ctx.stroke();
  }

  // Individual bricks
  ctx.strokeStyle = '#6e1d17';
  ctx.lineWidth = 1.5;
  for (let y = 0; y < 256; y += 16) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(256, y);
    ctx.stroke();

    const offset = (y / 16) % 2 === 0 ? 0 : 16;
    for (let x = offset; x < 256; x += 32) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, y + 16);
      ctx.stroke();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createRoadTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  // Smooth clean asphalt
  ctx.fillStyle = '#475569';
  ctx.fillRect(0, 0, 256, 256);

  // White lane dividers
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 4;
  ctx.setLineDash([20, 16]);
  ctx.beginPath();
  ctx.moveTo(128, 0);
  ctx.lineTo(128, 256);
  ctx.stroke();

  // White edge lines
  ctx.setLineDash([]);
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#cbd5e1';
  ctx.beginPath();
  ctx.moveTo(16, 0);
  ctx.lineTo(16, 256);
  ctx.moveTo(240, 0);
  ctx.lineTo(240, 256);
  ctx.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createWaterNormalTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#8080ff'; // flat normal vector
  ctx.fillRect(0, 0, 128, 128);

  for (let i = 0; i < 60; i++) {
    const x = Math.random() * 128;
    const y = Math.random() * 128;
    const r = Math.random() * 16 + 4;
    const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
    grad.addColorStop(0, '#9090ff');
    grad.addColorStop(0.5, '#7070ff');
    grad.addColorStop(1, '#8080ff');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

// Materials collection
export interface CityMaterials {
  whiteFacade: THREE.MeshStandardMaterial;
  pureWhite: THREE.MeshStandardMaterial;
  cyanGlass: THREE.MeshPhysicalMaterial;
  darkGlass: THREE.MeshPhysicalMaterial;
  windowGrid: THREE.MeshStandardMaterial;
  windowGridDark: THREE.MeshStandardMaterial;
  brickStation: THREE.MeshStandardMaterial;
  slateRoof: THREE.MeshStandardMaterial;
  tokyoTowerRed: THREE.MeshStandardMaterial;
  tokyoTowerWhite: THREE.MeshStandardMaterial;
  skytreeLattice: THREE.MeshStandardMaterial;
  skytreePod: THREE.MeshStandardMaterial;
  templeWood: THREE.MeshStandardMaterial;
  templeGold: THREE.MeshStandardMaterial;
  templeRoof: THREE.MeshStandardMaterial;
  stadiumWhite: THREE.MeshStandardMaterial;
  stadiumTurf: THREE.MeshStandardMaterial;
  stadiumWood: THREE.MeshStandardMaterial;
  roadAsphalt: THREE.MeshStandardMaterial;
  sidewalkConcrete: THREE.MeshStandardMaterial;
  sidewalkBorder: THREE.MeshStandardMaterial;
  waterSurface: THREE.MeshPhysicalMaterial;
  treeFoliageGreen: THREE.MeshStandardMaterial;
  treeFoliageMint: THREE.MeshStandardMaterial;
  treeTrunkWood: THREE.MeshStandardMaterial;
  metalChiller: THREE.MeshStandardMaterial;
  cyberCyanGlow: THREE.MeshBasicMaterial;
  cyberOrangeGlow: THREE.MeshBasicMaterial;
  pedestrianSkin: THREE.MeshStandardMaterial;
  pedestrianClothes: THREE.MeshStandardMaterial[];
  carPaints: THREE.MeshStandardMaterial[];
}

export function createCityMaterials(): CityMaterials {
  const windowTex = createGridTexture(10, 8, '#1e3a5f', '#38bdf8', 0.4);
  windowTex.repeat.set(1, 2);

  const windowTexDark = createGridTexture(8, 6, '#0f172a', '#0284c7', 0.25);
  windowTexDark.repeat.set(1, 1.5);

  const brickTex = createBrickTexture();
  brickTex.repeat.set(4, 2);

  const roadTex = createRoadTexture();
  roadTex.repeat.set(1, 4);

  const waterNormal = createWaterNormalTexture();
  waterNormal.repeat.set(6, 6);

  return {
    whiteFacade: new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.28,
      metalness: 0.1,
    }),
    pureWhite: new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.15,
      metalness: 0.05,
    }),
    cyanGlass: new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      roughness: 0.1,
      metalness: 0.2,
      transmission: 0.45,
      transparent: true,
      opacity: 0.88,
      ior: 1.52,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
    }),
    darkGlass: new THREE.MeshPhysicalMaterial({
      color: 0x0284c7,
      roughness: 0.12,
      metalness: 0.35,
      transmission: 0.25,
      transparent: true,
      opacity: 0.92,
    }),
    windowGrid: new THREE.MeshStandardMaterial({
      map: windowTex,
      roughness: 0.25,
      metalness: 0.2,
      color: 0xe0f2fe,
    }),
    windowGridDark: new THREE.MeshStandardMaterial({
      map: windowTexDark,
      roughness: 0.3,
      metalness: 0.3,
      color: 0xffffff,
    }),
    brickStation: new THREE.MeshStandardMaterial({
      map: brickTex,
      roughness: 0.7,
      metalness: 0.05,
    }),
    slateRoof: new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.45,
      metalness: 0.15,
    }),
    tokyoTowerRed: new THREE.MeshStandardMaterial({
      color: 0xef4444, // Vibrant Tokyo Tower orange-red
      roughness: 0.3,
      metalness: 0.45,
    }),
    tokyoTowerWhite: new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      roughness: 0.35,
      metalness: 0.2,
    }),
    skytreeLattice: new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      roughness: 0.25,
      metalness: 0.65,
    }),
    skytreePod: new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      roughness: 0.15,
      metalness: 0.5,
    }),
    templeWood: new THREE.MeshStandardMaterial({
      color: 0xb91c1c, // Vermilion temple gate/pillars
      roughness: 0.5,
      metalness: 0.05,
    }),
    templeGold: new THREE.MeshStandardMaterial({
      color: 0xfbbf24,
      roughness: 0.2,
      metalness: 0.85,
    }),
    templeRoof: new THREE.MeshStandardMaterial({
      color: 0x334155, // Traditional curved ceramic tile dark slate
      roughness: 0.4,
      metalness: 0.1,
    }),
    stadiumWhite: new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.3,
      metalness: 0.15,
    }),
    stadiumTurf: new THREE.MeshStandardMaterial({
      color: 0x15803d, // Lush sports turf
      roughness: 0.85,
      metalness: 0.0,
    }),
    stadiumWood: new THREE.MeshStandardMaterial({
      color: 0xb45309, // Kengo Kuma cedar louvers
      roughness: 0.6,
      metalness: 0.05,
    }),
    roadAsphalt: new THREE.MeshStandardMaterial({
      map: roadTex,
      roughness: 0.8,
      metalness: 0.05,
    }),
    sidewalkConcrete: new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      roughness: 0.6,
      metalness: 0.05,
    }),
    sidewalkBorder: new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      roughness: 0.5,
      metalness: 0.1,
    }),
    waterSurface: new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      roughness: 0.08,
      metalness: 0.1,
      transmission: 0.6,
      transparent: true,
      opacity: 0.85,
      normalMap: waterNormal,
      ior: 1.333,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
    }),
    treeFoliageGreen: new THREE.MeshStandardMaterial({
      color: 0x22c55e,
      roughness: 0.65,
      metalness: 0.0,
    }),
    treeFoliageMint: new THREE.MeshStandardMaterial({
      color: 0x4ade80,
      roughness: 0.6,
      metalness: 0.0,
    }),
    treeTrunkWood: new THREE.MeshStandardMaterial({
      color: 0x78350f,
      roughness: 0.85,
      metalness: 0.0,
    }),
    metalChiller: new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.35,
      metalness: 0.7,
    }),
    cyberCyanGlow: new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: false,
    }),
    cyberOrangeGlow: new THREE.MeshBasicMaterial({
      color: 0xf97316,
    }),
    pedestrianSkin: new THREE.MeshStandardMaterial({
      color: 0xfbcfe8,
      roughness: 0.6,
    }),
    pedestrianClothes: [
      new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.5 }),
      new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.5 }),
      new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.5 }),
      new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.5 }),
      new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.5 }),
    ],
    carPaints: [
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2, metalness: 0.5 }), // White sedan
      new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.2, metalness: 0.6 }), // Cyan sedan
      new THREE.MeshStandardMaterial({ color: 0xeab308, roughness: 0.25, metalness: 0.4 }), // Yellow taxi
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.15, metalness: 0.7 }), // Executive dark
      new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.25, metalness: 0.3 }), // Green eco-bus
    ],
  };
}
