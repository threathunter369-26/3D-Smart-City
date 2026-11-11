import * as THREE from 'three';
import { WeatherType, EarthquakeState } from '../../../types/city';

export class WeatherSystem {
  scene: THREE.Scene;
  weatherGroup: THREE.Group;

  // Particle systems
  starPoints: THREE.Points | null = null;
  snowPoints: THREE.Points | null = null;
  snowPositions!: Float32Array;
  rainLines: THREE.LineSegments | null = null;
  rainPositions!: Float32Array;
  windLines: THREE.LineSegments | null = null;
  windPositions!: Float32Array;

  // Tornado 3D meshes
  tornadoGroup: THREE.Group | null = null;
  tornadoFunnelPoints: THREE.Points | null = null;
  tornadoDebrisPoints: THREE.Points | null = null;
  tornadoPos = new THREE.Vector3(-4, 0, -8);
  tornadoPathAngle = 0;

  // Lightning state
  lightningLight: THREE.DirectionalLight | null = null;
  lightningTimer = 0;
  isFlashing = false;

  // Reusable vectors for zero GC
  private _tempVec3 = new THREE.Vector3();

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.weatherGroup = new THREE.Group();
    this.weatherGroup.name = 'City_WeatherSystem';
    this.scene.add(this.weatherGroup);

    this.initStars();
    this.initSnow();
    this.initRain();
    this.initWind();
    this.initTornado();
    this.initLightning();
  }

  // --- 1. STARFIELD ---
  private initStars() {
    const starCount = 1600;
    const starGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    const sizes = new Float32Array(starCount);

    for (let i = 0; i < starCount; i++) {
      // Hemisphere dome over city
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 0.8 + 0.2); // Upper dome
      const radius = 120 + Math.random() * 30;

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.cos(phi);
      positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
      sizes[i] = Math.random() * 2.5 + 1.0;
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starGeo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const starMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 1.8,
      transparent: true,
      opacity: 0.9,
      sizeAttenuation: true,
    });

    this.starPoints = new THREE.Points(starGeo, starMat);
    this.starPoints.visible = false;
    this.weatherGroup.add(this.starPoints);
  }

  // --- 2. PROCEDURAL SNOW ---
  private initSnow() {
    const snowCount = 2800;
    const snowGeo = new THREE.BufferGeometry();
    this.snowPositions = new Float32Array(snowCount * 3);

    for (let i = 0; i < snowCount; i++) {
      this.snowPositions[i * 3] = (Math.random() - 0.5) * 80;
      this.snowPositions[i * 3 + 1] = Math.random() * 50;
      this.snowPositions[i * 3 + 2] = (Math.random() - 0.5) * 80;
    }

    snowGeo.setAttribute('position', new THREE.BufferAttribute(this.snowPositions, 3));

    const snowMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.9,
      transparent: true,
      opacity: 0.85,
    });

    this.snowPoints = new THREE.Points(snowGeo, snowMat);
    this.snowPoints.visible = false;
    this.weatherGroup.add(this.snowPoints);
  }

  // --- 3. PROCEDURAL RAIN & STORM ---
  private initRain() {
    const rainCount = 3200;
    const rainGeo = new THREE.BufferGeometry();
    this.rainPositions = new Float32Array(rainCount * 6); // 2 vertices per line streak

    for (let i = 0; i < rainCount; i++) {
      const x = (Math.random() - 0.5) * 80;
      const y = Math.random() * 55;
      const z = (Math.random() - 0.5) * 80;
      const streakLen = 1.6 + Math.random() * 1.2;

      this.rainPositions[i * 6] = x;
      this.rainPositions[i * 6 + 1] = y;
      this.rainPositions[i * 6 + 2] = z;

      this.rainPositions[i * 6 + 3] = x + 0.3; // Slight wind slant
      this.rainPositions[i * 6 + 4] = y - streakLen;
      this.rainPositions[i * 6 + 5] = z + 0.3;
    }

    rainGeo.setAttribute('position', new THREE.BufferAttribute(this.rainPositions, 3));

    const rainMat = new THREE.LineBasicMaterial({
      color: 0x93c5fd,
      transparent: true,
      opacity: 0.65,
    });

    this.rainLines = new THREE.LineSegments(rainGeo, rainMat);
    this.rainLines.visible = false;
    this.weatherGroup.add(this.rainLines);
  }

  // --- 4. PROCEDURAL WIND STREAKS ---
  private initWind() {
    const windCount = 120;
    const windGeo = new THREE.BufferGeometry();
    this.windPositions = new Float32Array(windCount * 6);

    for (let i = 0; i < windCount; i++) {
      const x = (Math.random() - 0.5) * 70;
      const y = 1.0 + Math.random() * 25;
      const z = (Math.random() - 0.5) * 70;
      const len = 4.0 + Math.random() * 6.0;

      this.windPositions[i * 6] = x;
      this.windPositions[i * 6 + 1] = y;
      this.windPositions[i * 6 + 2] = z;

      this.windPositions[i * 6 + 3] = x + len;
      this.windPositions[i * 6 + 4] = y;
      this.windPositions[i * 6 + 5] = z;
    }

    windGeo.setAttribute('position', new THREE.BufferAttribute(this.windPositions, 3));

    const windMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.7,
      linewidth: 2,
    });

    this.windLines = new THREE.LineSegments(windGeo, windMat);
    this.windLines.visible = false;
    this.weatherGroup.add(this.windLines);
  }

  // --- 5. 3D TORNADO CYCLONE VORTEX ---
  private initTornado() {
    this.tornadoGroup = new THREE.Group();
    this.tornadoGroup.name = 'City_Tornado';

    // Funnel particles spiraling upwards
    const particleCount = 2000;
    const funnelGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const t = i / particleCount;
      const height = t * 45; // Height up to 45m
      const radius = 0.8 + Math.pow(t, 1.4) * 12; // Expands as it rises
      const angle = t * Math.PI * 40;

      positions[i * 3] = Math.cos(angle) * radius + (Math.random() - 0.5) * 0.8;
      positions[i * 3 + 1] = height;
      positions[i * 3 + 2] = Math.sin(angle) * radius + (Math.random() - 0.5) * 0.8;

      // Dark swirling gray-blue to dusty white colors
      const shade = 0.4 + Math.random() * 0.5;
      colors[i * 3] = shade * 0.85;
      colors[i * 3 + 1] = shade * 0.9;
      colors[i * 3 + 2] = shade;
    }

    funnelGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    funnelGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const funnelMat = new THREE.PointsMaterial({
      size: 1.6,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
    });

    this.tornadoFunnelPoints = new THREE.Points(funnelGeo, funnelMat);
    this.tornadoGroup.add(this.tornadoFunnelPoints);

    // Debris cloud at the base
    const debrisCount = 400;
    const debrisGeo = new THREE.BufferGeometry();
    const dPositions = new Float32Array(debrisCount * 3);

    for (let i = 0; i < debrisCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = Math.random() * 6.0;
      dPositions[i * 3] = Math.cos(angle) * r;
      dPositions[i * 3 + 1] = Math.random() * 4.0;
      dPositions[i * 3 + 2] = Math.sin(angle) * r;
    }

    debrisGeo.setAttribute('position', new THREE.BufferAttribute(dPositions, 3));
    const debrisMat = new THREE.PointsMaterial({
      color: 0x475569,
      size: 1.2,
      transparent: true,
      opacity: 0.9,
    });

    this.tornadoDebrisPoints = new THREE.Points(debrisGeo, debrisMat);
    this.tornadoGroup.add(this.tornadoDebrisPoints);

    this.tornadoGroup.position.copy(this.tornadoPos);
    this.tornadoGroup.visible = false;
    this.weatherGroup.add(this.tornadoGroup);
  }

  // --- 6. PROCEDURAL LIGHTNING ---
  private initLightning() {
    this.lightningLight = new THREE.DirectionalLight(0xe0f2fe, 0);
    this.lightningLight.position.set(0, 80, 0);
    this.scene.add(this.lightningLight);
  }

  // --- UPDATE ANIMATION LOOP ---
  update(
    delta: number,
    elapsed: number,
    weather: WeatherType,
    earthquake: EarthquakeState,
    landmarksGroup: THREE.Group,
    skyscrapersGroup: THREE.Group,
    foliageGroup: THREE.Group
  ) {
    // 1. STARFIELD VISIBILITY & TWINKLE
    const isNight = weather === 'night-stars';
    if (this.starPoints) {
      this.starPoints.visible = isNight;
      if (isNight) {
        this.starPoints.rotation.y = elapsed * 0.005;
      }
    }

    // 2. SNOW SIMULATION
    const isSnow = weather === 'snow';
    if (this.snowPoints) {
      this.snowPoints.visible = isSnow;
      if (isSnow) {
        const count = this.snowPositions.length / 3;
        for (let i = 0; i < count; i++) {
          this.snowPositions[i * 3 + 1] -= delta * 7.5; // Fall down
          this.snowPositions[i * 3] += Math.sin(elapsed * 2.0 + i) * delta * 2.0; // Drifting
          if (this.snowPositions[i * 3 + 1] < 0) {
            this.snowPositions[i * 3 + 1] = 50;
          }
        }
        this.snowPoints.geometry.attributes.position.needsUpdate = true;
      }
    }

    // 3. RAIN & LIGHTNING SIMULATION
    const isStorm = weather === 'storm';
    if (this.rainLines) {
      this.rainLines.visible = isStorm;
      if (isStorm) {
        const lineCount = this.rainPositions.length / 6;
        for (let i = 0; i < lineCount; i++) {
          const fall = delta * 42.0;
          this.rainPositions[i * 6 + 1] -= fall;
          this.rainPositions[i * 6 + 4] -= fall;
          if (this.rainPositions[i * 6 + 4] < 0) {
            const newY = 55 + Math.random() * 5;
            this.rainPositions[i * 6 + 1] = newY;
            this.rainPositions[i * 6 + 4] = newY - 2.0;
          }
        }
        this.rainLines.geometry.attributes.position.needsUpdate = true;

        // Lightning Flash interval
        this.lightningTimer += delta;
        if (this.lightningTimer > 4.5 && Math.random() < 0.05) {
          this.lightningTimer = 0;
          this.triggerLightningFlash();
        }
      }
    }

    // 4. WIND STREAKS SIMULATION
    const isWinds = weather === 'winds' || weather === 'storm' || weather === 'tornado';
    if (this.windLines) {
      this.windLines.visible = isWinds;
      if (isWinds) {
        const count = this.windPositions.length / 6;
        for (let i = 0; i < count; i++) {
          const speed = (weather === 'tornado' ? 55 : 32) * delta;
          this.windPositions[i * 6] += speed;
          this.windPositions[i * 6 + 3] += speed;
          if (this.windPositions[i * 6] > 40) {
            this.windPositions[i * 6] = -40;
            this.windPositions[i * 6 + 3] = -40 + 6.0;
          }
        }
        this.windLines.geometry.attributes.position.needsUpdate = true;
      }
    }

    // 5. TORNADO CYCLONE VORTEX SIMULATION
    const isTornado = weather === 'tornado';
    if (this.tornadoGroup) {
      this.tornadoGroup.visible = isTornado;
      if (isTornado) {
        // Rotate funnel fast
        if (this.tornadoFunnelPoints) {
          this.tornadoFunnelPoints.rotation.y += delta * 12.0;
        }
        if (this.tornadoDebrisPoints) {
          this.tornadoDebrisPoints.rotation.y += delta * 15.0;
        }

        // Travel path in ellipse between stadium and center
        this.tornadoPathAngle += delta * 0.35;
        this.tornadoPos.x = Math.sin(this.tornadoPathAngle) * 16 - 2;
        this.tornadoPos.z = Math.cos(this.tornadoPathAngle) * 14 - 4;
        this.tornadoGroup.position.copy(this.tornadoPos);
      }
    }

    // 6. PHYSICAL BUILDING & ENVIRONMENT DYNAMIC MOTION
    this.applyBuildingMotion(delta, elapsed, weather, earthquake, landmarksGroup, skyscrapersGroup, foliageGroup);
  }

  private triggerLightningFlash() {
    if (!this.lightningLight) return;
    this.lightningLight.intensity = 4.8;
    setTimeout(() => {
      if (this.lightningLight) this.lightningLight.intensity = 1.2;
    }, 60);
    setTimeout(() => {
      if (this.lightningLight) this.lightningLight.intensity = 3.6;
    }, 120);
    setTimeout(() => {
      if (this.lightningLight) this.lightningLight.intensity = 0;
    }, 220);
  }

  // --- PHYSICAL DEFORMATION & MOVEMENT ENGINE ---
  private applyBuildingMotion(
    _delta: number,
    elapsed: number,
    weather: WeatherType,
    earthquake: EarthquakeState,
    landmarksGroup: THREE.Group,
    skyscrapersGroup: THREE.Group,
    foliageGroup: THREE.Group
  ) {
    const isWinds = weather === 'winds';
    const isStorm = weather === 'storm';
    const isTornado = weather === 'tornado';
    const isEarthquake = earthquake.active;

    // A. Tree Foliage Sway
    if (foliageGroup) {
      let treeSway = 0;
      if (isEarthquake) {
        treeSway = Math.sin(elapsed * 28.0) * 0.08 * (earthquake.intensity / 5);
      } else if (isTornado) {
        treeSway = Math.sin(elapsed * 14.0) * 0.16;
      } else if (isStorm || isWinds) {
        treeSway = Math.sin(elapsed * 8.0) * 0.12;
      } else {
        treeSway = Math.sin(elapsed * 2.0) * 0.02; // Gentle resting breeze
      }

      foliageGroup.children.forEach((tree, idx) => {
        tree.rotation.z = treeSway * (0.8 + (idx % 5) * 0.1);
      });
    }

    // B. Landmark Structural Movement (Tokyo Tower, Skytree, Tokyo Station, Stadium)
    if (landmarksGroup) {
      landmarksGroup.children.forEach((landmark) => {
        const id = landmark.userData?.landmarkId;
        const height = landmark.userData?.height || 25;
        const flexFactor = height / 30; // Taller structures sway more

        if (isEarthquake) {
          // Harmonic seismic wave oscillation (P + S waves)
          const seismicFreq = 18.0;
          const amp = 0.025 * earthquake.intensity * flexFactor;
          landmark.rotation.z = Math.sin(elapsed * seismicFreq) * amp;
          landmark.rotation.x = Math.cos(elapsed * seismicFreq * 0.8) * amp * 0.8;
          // Vertical micro-ground tremor
          landmark.position.y = Math.abs(Math.sin(elapsed * 32.0)) * 0.06 * (earthquake.intensity / 5);
        } else if (isTornado && this.tornadoGroup) {
          // Lean towards / away from vortex based on proximity
          this._tempVec3.set(landmark.position.x, 0, landmark.position.z);
          const dist = this._tempVec3.distanceTo(this.tornadoPos);
          if (dist < 26) {
            const pullIntensity = (1 - dist / 26) * 0.05 * flexFactor;
            landmark.rotation.z = Math.sin(elapsed * 12.0) * pullIntensity;
            landmark.rotation.x = Math.cos(elapsed * 12.0) * pullIntensity;
          } else {
            landmark.rotation.set(0, 0, 0);
            landmark.position.y = 0;
          }
        } else if (isWinds || isStorm) {
          // Aerodynamic skyscraper sway with tuned mass damping
          const windSway = Math.sin(elapsed * 3.2) * 0.018 * flexFactor;
          landmark.rotation.z = windSway;
          landmark.rotation.x = Math.cos(elapsed * 2.6) * windSway * 0.4;
          landmark.position.y = 0;
        } else {
          // Normal state
          landmark.rotation.set(0, 0, 0);
          landmark.position.y = 0;
        }
      });
    }

    // C. Commercial Skyscrapers Structural Movement
    if (skyscrapersGroup) {
      skyscrapersGroup.children.forEach((building) => {
        const height = building.userData?.height || 18;
        const flexFactor = height / 22;

        if (isEarthquake) {
          const seismicFreq = 20.0;
          const amp = 0.02 * earthquake.intensity * flexFactor;
          building.rotation.z = Math.sin(elapsed * seismicFreq + building.position.x) * amp;
          building.rotation.x = Math.cos(elapsed * seismicFreq * 0.7 + building.position.z) * amp * 0.7;
          building.position.y = Math.abs(Math.sin(elapsed * 30.0 + building.position.x)) * 0.05 * (earthquake.intensity / 5);
        } else if (isTornado && this.tornadoGroup) {
          this._tempVec3.set(building.position.x, 0, building.position.z);
          const dist = this._tempVec3.distanceTo(this.tornadoPos);
          if (dist < 24) {
            const pullIntensity = (1 - dist / 24) * 0.04 * flexFactor;
            building.rotation.z = Math.sin(elapsed * 14.0) * pullIntensity;
            building.rotation.x = Math.cos(elapsed * 14.0) * pullIntensity;
          } else {
            building.rotation.set(0, 0, 0);
            building.position.y = 0;
          }
        } else if (isWinds || isStorm) {
          const windSway = Math.sin(elapsed * 3.5 + building.position.x * 0.1) * 0.015 * flexFactor;
          building.rotation.z = windSway;
          building.rotation.x = 0;
          building.position.y = 0;
        } else {
          building.rotation.set(0, 0, 0);
          building.position.y = 0;
        }
      });
    }
  }
}
