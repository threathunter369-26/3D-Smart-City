import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import gsap from 'gsap';
import { CityScene } from './CityScene';
import { useCityStore } from '../../store/useCityStore';

export const CityCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const citySceneRef = useRef<CityScene | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const dirLightRef = useRef<THREE.DirectionalLight | null>(null);
  const hemiLightRef = useRef<THREE.HemisphereLight | null>(null);

  const {
    timeOfDay,
    weather,
    earthquake,
    hourOfDay,
    activeLayer,
    showBillboards,
    showNetworkGrid,
    showTraffic,
    showTrees,
    cameraPreset,
    isTourActive,
    cinematicMode,
    setActiveLandmark,
    setHoveredLandmark,
    advanceTourStep,
  } = useCityStore();

  // Initialize Three.js scene once
  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth || window.innerWidth;
    const height = containerRef.current.clientHeight || window.innerHeight;

    // 1. Software WebGL Guard (from Three.js skill)
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // 2. Renderer setup
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: false,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 3. City Scene instance
    const cityScene = new CityScene();
    citySceneRef.current = cityScene;
    const scene = cityScene.scene;

    // Background & Fog (Pearl white / ice-blue)
    const bgColor = new THREE.Color(0xeaf2fa);
    scene.background = bgColor;
    scene.fog = new THREE.Fog(0xeaf2fa, 70, 150);

    // 4. RoomEnvironment PBR Reflection
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 5. Orthographic Isometric Camera
    const aspect = width / height;
    const frustumSize = 46;
    const camera = new THREE.OrthographicCamera(
      (-frustumSize * aspect) / 2,
      (frustumSize * aspect) / 2,
      frustumSize / 2,
      -frustumSize / 2,
      -100,
      500
    );

    // Standard Isometric angle matching reference image
    camera.position.set(45, 38, 45);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // 6. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.06;
    controls.maxPolarAngle = Math.PI / 2 - 0.05; // Prevent flipping below ground
    controls.minPolarAngle = 0.2;
    controls.minZoom = 0.4;
    controls.maxZoom = 2.8;
    controls.target.set(0, 0, 0);
    controlsRef.current = controls;

    // 7. Balanced Lighting Rig
    // Warm Key Light
    const dirLight = new THREE.DirectionalLight(0xfff5eb, 2.2);
    dirLight.position.set(45, 65, 35);
    dirLight.castShadow = !isSoftwareGl;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 10;
    dirLight.shadow.camera.far = 160;
    const d = 42;
    dirLight.shadow.camera.left = -d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = -d;
    dirLight.shadow.bias = -0.0005;
    dirLight.shadow.normalBias = 0.02;
    scene.add(dirLight);
    dirLightRef.current = dirLight;

    // Cool Hemisphere Fill Light
    const hemiLight = new THREE.HemisphereLight(0xe0f2fe, 0x94a3b8, 1.4);
    hemiLight.position.set(0, 50, 0);
    scene.add(hemiLight);
    hemiLightRef.current = hemiLight;

    // Initialize City Geometry
    cityScene.init(useCityStore.getState().telemetry);

    // Pre-warm shaders
    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // 8. Raycasting for Object Selection & Hover
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onPointerDown = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(cityScene.interactiveObjects, true);

      if (intersects.length > 0) {
        const entity = cityScene.getIntersectedEntity(intersects[0].object);
        if (entity) {
          setActiveLandmark(entity);
        }
      }
    };

    const onPointerMove = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(cityScene.interactiveObjects, true);

      if (intersects.length > 0) {
        const entity = cityScene.getIntersectedEntity(intersects[0].object);
        setHoveredLandmark(entity);
        renderer.domElement.style.cursor = 'pointer';
      } else {
        setHoveredLandmark(null);
        renderer.domElement.style.cursor = 'default';
      }
    };

    renderer.domElement.addEventListener('click', onPointerDown);
    renderer.domElement.addEventListener('pointermove', onPointerMove);

    // 9. Resize handler
    const onResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      const a = w / h;

      camera.left = (-frustumSize * a) / 2;
      camera.right = (frustumSize * a) / 2;
      camera.top = frustumSize / 2;
      camera.bottom = -frustumSize / 2;
      camera.updateProjectionMatrix();

      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    // 10. Main Animation Loop
    let animationFrameId = 0;
    const clock = new THREE.Clock();

    const renderLoop = () => {
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Read current state
      const state = useCityStore.getState();

      // Update city animations and weather physics
      cityScene.update(delta, elapsed, state.telemetry, state.weather, state.earthquake);

      // Camera earthquake seismic tremor
      if (state.earthquake.active) {
        const quakeFactor = state.earthquake.intensity / 6;
        camera.position.x += (Math.random() - 0.5) * 0.18 * quakeFactor;
        camera.position.y += (Math.random() - 0.5) * 0.18 * quakeFactor;
      }

      controls.update();
      renderer.render(scene, camera);

      animationFrameId = requestAnimationFrame(renderLoop);
    };

    animationFrameId = requestAnimationFrame(renderLoop);

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', onResize);
      renderer.domElement.removeEventListener('click', onPointerDown);
      renderer.domElement.removeEventListener('pointermove', onPointerMove);
      renderer.dispose();
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, [setActiveLandmark, setHoveredLandmark]);

  // Handle Dynamic Weather & Time of Day Lighting Transitions
  useEffect(() => {
    if (!citySceneRef.current || !dirLightRef.current || !hemiLightRef.current || !rendererRef.current) return;

    const scene = citySceneRef.current.scene;
    const dirLight = dirLightRef.current;
    const hemiLight = hemiLightRef.current;
    const renderer = rendererRef.current;

    // Calculate dynamic sun angle based on hourOfDay (0-24)
    const hour = hourOfDay;
    const sunAngle = ((hour - 6) / 24) * Math.PI * 2;
    const sunElevation = Math.sin(sunAngle);
    const sunRadius = 65;

    dirLight.position.set(
      Math.cos(sunAngle) * sunRadius,
      Math.max(14, sunElevation * 75),
      Math.sin(sunAngle) * (sunRadius * 0.7)
    );

    // Weather-specific lighting overrides
    if (weather === 'storm') {
      // Dark gloomy storm sky with thunder atmosphere
      gsap.to(scene.background, { r: 0.16, g: 0.20, b: 0.28, duration: 1.0 });
      if (scene.fog) gsap.to(scene.fog.color, { r: 0.16, g: 0.20, b: 0.28, duration: 1.0 });
      gsap.to(dirLight, { intensity: 0.7, duration: 1.0 });
      gsap.to(dirLight.color, { r: 0.7, g: 0.8, b: 1.0, duration: 1.0 });
      gsap.to(hemiLight, { intensity: 0.5, duration: 1.0 });
      gsap.to(renderer, { toneMappingExposure: 1.0, duration: 1.0 });
    } else if (weather === 'snow') {
      // Crisp icy frost atmosphere
      gsap.to(scene.background, { r: 0.94, g: 0.96, b: 1.0, duration: 1.0 });
      if (scene.fog) gsap.to(scene.fog.color, { r: 0.94, g: 0.96, b: 1.0, duration: 1.0 });
      gsap.to(dirLight, { intensity: 1.9, duration: 1.0 });
      gsap.to(dirLight.color, { r: 0.95, g: 0.98, b: 1.0, duration: 1.0 });
      gsap.to(hemiLight, { intensity: 1.3, duration: 1.0 });
      gsap.to(renderer, { toneMappingExposure: 1.25, duration: 1.0 });
    } else if (weather === 'tornado') {
      // Dark ominous cyclone sky
      gsap.to(scene.background, { r: 0.22, g: 0.25, b: 0.30, duration: 1.0 });
      if (scene.fog) gsap.to(scene.fog.color, { r: 0.22, g: 0.25, b: 0.30, duration: 1.0 });
      gsap.to(dirLight, { intensity: 1.0, duration: 1.0 });
      gsap.to(dirLight.color, { r: 0.85, g: 0.88, b: 0.92, duration: 1.0 });
      gsap.to(hemiLight, { intensity: 0.7, duration: 1.0 });
      gsap.to(renderer, { toneMappingExposure: 1.1, duration: 1.0 });
    } else if (timeOfDay === 'night' || weather === 'night-stars') {
      // Deep midnight indigo sky with sparkling stars
      gsap.to(scene.background, { r: 0.04, g: 0.07, b: 0.14, duration: 1.2 });
      if (scene.fog) gsap.to(scene.fog.color, { r: 0.04, g: 0.07, b: 0.14, duration: 1.2 });
      gsap.to(dirLight, { intensity: 0.55, duration: 1.2 });
      gsap.to(dirLight.color, { r: 0.35, g: 0.65, b: 0.95, duration: 1.2 });
      gsap.to(hemiLight, { intensity: 0.45, duration: 1.2 });
      gsap.to(renderer, { toneMappingExposure: 1.4, duration: 1.2 });
    } else if (timeOfDay === 'twilight') {
      // Golden Hour / Sunset
      gsap.to(scene.background, { r: 0.20, g: 0.26, b: 0.42, duration: 1.2 });
      if (scene.fog) gsap.to(scene.fog.color, { r: 0.20, g: 0.26, b: 0.42, duration: 1.2 });
      gsap.to(dirLight, { intensity: 1.5, duration: 1.2 });
      gsap.to(dirLight.color, { r: 1.0, g: 0.62, b: 0.35, duration: 1.2 });
      gsap.to(hemiLight, { intensity: 0.95, duration: 1.2 });
      gsap.to(renderer, { toneMappingExposure: 1.22, duration: 1.2 });
    } else {
      // Bright Sunny Day (Reference Pearl-White)
      gsap.to(scene.background, { r: 0.92, g: 0.95, b: 0.98, duration: 1.2 });
      if (scene.fog) gsap.to(scene.fog.color, { r: 0.92, g: 0.95, b: 0.98, duration: 1.2 });
      gsap.to(dirLight, { intensity: 2.2, duration: 1.2 });
      gsap.to(dirLight.color, { r: 1.0, g: 0.96, b: 0.92, duration: 1.2 });
      gsap.to(hemiLight, { intensity: 1.4, duration: 1.2 });
      gsap.to(renderer, { toneMappingExposure: 1.15, duration: 1.2 });
    }
  }, [timeOfDay, weather, hourOfDay]);

  // Handle Layer Visibility Toggles
  useEffect(() => {
    if (!citySceneRef.current) return;
    const cs = citySceneRef.current;

    // Billboards visibility
    if (cs.billboardsGroup) {
      cs.billboardsGroup.visible = showBillboards && (activeLayer === 'all' || activeLayer === 'traffic' || activeLayer === 'energy' || activeLayer === 'environment' || activeLayer === 'budget');
    }

    // Network grid visibility
    if (cs.networkGridGroup) {
      cs.networkGridGroup.visible = showNetworkGrid && (activeLayer === 'all' || activeLayer === 'network');
    }

    // Vehicles visibility
    if (cs.vehiclesGroup) {
      cs.vehiclesGroup.visible = showTraffic && (activeLayer === 'all' || activeLayer === 'traffic');
    }

    // Trees visibility
    if (cs.foliageGroup) {
      cs.foliageGroup.visible = showTrees && (activeLayer === 'all' || activeLayer === 'environment');
    }
  }, [activeLayer, showBillboards, showNetworkGrid, showTraffic, showTrees]);

  // Handle Camera Presets & Transitions via GSAP
  useEffect(() => {
    if (!cameraRef.current || !controlsRef.current) return;
    const camera = cameraRef.current;
    const controls = controlsRef.current;

    interface CameraTarget {
      pos: [number, number, number];
      target: [number, number, number];
      zoom: number;
    }

    const presets: Record<string, CameraTarget> = {
      isometric: { pos: [45, 38, 45], target: [0, 0, 0], zoom: 1.0 },
      'tokyo-tower': { pos: [12, 28, 22], target: [-10, 14, -4], zoom: 1.55 },
      skytree: { pos: [46, 36, 10], target: [24, 20, -18], zoom: 1.35 },
      'tokyo-station': { pos: [22, 20, 26], target: [-2, 3, 4], zoom: 1.7 },
      'sensoji-temple': { pos: [5, 20, 28], target: [-18, 5, 6], zoom: 1.6 },
      'national-stadium': { pos: [18, 24, 8], target: [-4, 4, -12], zoom: 1.6 },
      'waterfront-promenade': { pos: [38, 22, 30], target: [20, 6, 10], zoom: 1.5 },
      'financial-tower': { pos: [4, 26, 16], target: [-18, 12, -6], zoom: 1.6 },
      'tech-hub': { pos: [30, 24, 15], target: [8, 10, -6], zoom: 1.65 },
    };

    const targetPreset = presets[cameraPreset] || presets.isometric;

    gsap.killTweensOf(camera.position);
    gsap.killTweensOf(controls.target);
    gsap.killTweensOf(camera);

    gsap.to(camera.position, {
      x: targetPreset.pos[0],
      y: targetPreset.pos[1],
      z: targetPreset.pos[2],
      duration: 1.5,
      ease: 'power2.inOut',
    });

    gsap.to(controls.target, {
      x: targetPreset.target[0],
      y: targetPreset.target[1],
      z: targetPreset.target[2],
      duration: 1.5,
      ease: 'power2.inOut',
    });

    gsap.to(camera, {
      zoom: targetPreset.zoom,
      duration: 1.5,
      ease: 'power2.inOut',
      onUpdate: () => {
        camera.updateProjectionMatrix();
      },
    });
  }, [cameraPreset]);

  // Handle Tour Mode auto advance
  useEffect(() => {
    if (!isTourActive) return;

    const timer = setInterval(() => {
      advanceTourStep();
    }, 7000);

    return () => clearInterval(timer);
  }, [isTourActive, advanceTourStep]);

  return (
    <div className="relative w-full h-full overflow-hidden select-none">
      {/* 3D WebGL Canvas Container */}
      <div ref={containerRef} className="absolute inset-0 w-full h-full" />

      {/* Cinematic Vignette Overlay */}
      {cinematicMode && (
        <div className="pointer-events-none absolute inset-0 ring-inset ring-[40px] ring-black/40 transition-all duration-700" />
      )}
    </div>
  );
};
