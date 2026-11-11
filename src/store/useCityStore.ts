import { create } from 'zustand';
import { CityTelemetry, DataLayer, LandmarkData, TimeOfDay, WeatherType, EarthquakeState, AIChatMessage } from '../types/city';

export const CITY_LANDMARKS: LandmarkData[] = [
  {
    id: 'tokyo-tower',
    name: 'Tokyo Communications Tower',
    japaneseName: '東京通信タワー',
    category: 'landmark',
    description: 'Iconic 333-meter communications and observation tower featuring dual observation decks, broadcasting transmitters, and high-frequency IoT weather radars.',
    position: [-10, 0, -4],
    height: 38,
    stats: {
      occupancy: 84,
      powerUsageKw: 1240,
      greenEnergyPercent: 42,
      iotSensorsCount: 168,
      healthStatus: 'optimal',
      dailyVisitors: 28450,
      airQualityIndex: 38,
    },
  },
  {
    id: 'skytree',
    name: 'Metropolitan Sky Needle',
    japaneseName: 'メトロポリタン・スカイニードル',
    category: 'landmark',
    description: '634-meter digital broadcasting tower equipped with meteorological lidar sensors, seismic dampening core, and metropolitan 6G relay grid.',
    position: [24, 0, -18],
    height: 48,
    stats: {
      occupancy: 91,
      powerUsageKw: 2150,
      greenEnergyPercent: 68,
      iotSensorsCount: 320,
      healthStatus: 'optimal',
      dailyVisitors: 41200,
      airQualityIndex: 32,
    },
  },
  {
    id: 'tokyo-station',
    name: 'Central Heritage Station',
    japaneseName: '東京中央歴史駅舎',
    category: 'cultural',
    description: 'Historic red-brick transit terminal restored with geotagged smart ticketing, geothermal heating/cooling, and high-capacity multimodal train hub.',
    position: [-2, 0, 4],
    height: 12,
    stats: {
      occupancy: 96,
      powerUsageKw: 3820,
      greenEnergyPercent: 35,
      iotSensorsCount: 412,
      healthStatus: 'optimal',
      dailyVisitors: 495000,
      airQualityIndex: 45,
    },
  },
  {
    id: 'sensoji-temple',
    name: 'Asakusa Heritage Pagoda & Gate',
    japaneseName: '浅草伝統寺院・五重塔',
    category: 'cultural',
    description: 'Ancient 5-story cultural sanctuary preserving historical wood architecture with optical fire-detection sensors, soundscape dampeners, and solar roof tiles.',
    position: [-18, 0, 6],
    height: 16,
    stats: {
      occupancy: 78,
      powerUsageKw: 420,
      greenEnergyPercent: 88,
      iotSensorsCount: 84,
      healthStatus: 'optimal',
      dailyVisitors: 64200,
      airQualityIndex: 28,
    },
  },
  {
    id: 'national-stadium',
    name: 'National Circular Arena',
    japaneseName: '国立円形スタジアム',
    category: 'infrastructure',
    description: 'Zero-emission wooden-louver stadium featuring natural wind-funnel ventilation, rainwater harvesting tanks, and smart crowd flow monitoring.',
    position: [-4, 0, -12],
    height: 10,
    stats: {
      occupancy: 65,
      powerUsageKw: 1890,
      greenEnergyPercent: 74,
      iotSensorsCount: 230,
      healthStatus: 'optimal',
      dailyVisitors: 52000,
      airQualityIndex: 36,
    },
  },
  {
    id: 'waterfront-promenade',
    name: 'Bay Area Ferry Terminal & Ferris Wheel',
    japaneseName: '臨海ウォーターフロント・フェリー埠頭',
    category: 'infrastructure',
    description: 'Autonomous electric water taxi terminal with waterfront tidal surge monitors, kinetic energy boardwalk, and illuminated panoramic wheel.',
    position: [20, 0, 10],
    height: 18,
    stats: {
      occupancy: 82,
      powerUsageKw: 1120,
      greenEnergyPercent: 92,
      iotSensorsCount: 145,
      healthStatus: 'optimal',
      dailyVisitors: 38900,
      airQualityIndex: 24,
    },
  },
  {
    id: 'financial-tower',
    name: 'Central Smart Financial Tower',
    japaneseName: '中央スマート金融タワー',
    category: 'commercial',
    description: 'Triple-glazed curtain wall skyscraper with dynamic automated louvers, rooftop solar array, and AI building management system.',
    position: [-18, 0, -6],
    height: 28,
    stats: {
      occupancy: 89,
      powerUsageKw: 1650,
      greenEnergyPercent: 55,
      iotSensorsCount: 195,
      healthStatus: 'optimal',
      dailyVisitors: 18500,
      airQualityIndex: 40,
    },
  },
  {
    id: 'tech-hub',
    name: 'Metropolitan Tech Center',
    japaneseName: 'メトロポリタン技術センター',
    category: 'commercial',
    description: 'Smart campus with AI datacenter, heat-exchange water loop, and rooftop drone delivery landing pad.',
    position: [8, 0, -6],
    height: 22,
    stats: {
      occupancy: 94,
      powerUsageKw: 2400,
      greenEnergyPercent: 62,
      iotSensorsCount: 280,
      healthStatus: 'optimal',
      dailyVisitors: 14200,
      airQualityIndex: 35,
    },
  },
];

const initialTelemetry: CityTelemetry = {
  trafficFlowPercent: 76,
  trafficHourly: [32, 28, 45, 62, 85, 76, 72, 88, 68, 54, 42, 38],
  energyConsumptionPercent: 68,
  energyHourly: [42, 38, 48, 65, 82, 68, 70, 78, 64, 58, 49, 44],
  energyBreakdown: { solar: 34, grid: 48, storage: 18 },
  airQualityIndex: 42,
  airQualityStatus: 'Good',
  pm25: 11.4,
  co2Ppm: 412,
  visitorsToday: 1257890,
  visitorsGrowth: 8.2,
  budgetTotalYen: 3456789000000,
  budgetBreakdown: [
    { category: '教育・福祉 (Education & Welfare)', percent: 28, color: '#0ea5e9' },
    { category: '防災・安全 (Disaster & Safety)', percent: 25, color: '#f59e0b' },
    { category: '環境・基盤 (Environment & Infra)', percent: 25, color: '#10b981' },
    { category: '産業・その他 (Industry & Other)', percent: 22, color: '#6366f1' },
  ],
  activeSensors: 8420,
  networkLatencyMs: 4.2,
  temperatureC: 22.4,
  humidityPercent: 54,
};

interface CityState {
  timeOfDay: TimeOfDay;
  weather: WeatherType;
  earthquake: EarthquakeState;
  hourOfDay: number;
  autoTimeCycle: boolean;
  timeCycleSpeed: number;
  activeLayer: DataLayer;
  showBillboards: boolean;
  showNetworkGrid: boolean;
  showTraffic: boolean;
  showTrees: boolean;
  activeLandmark: LandmarkData | null;
  hoveredLandmark: LandmarkData | null;
  isTourActive: boolean;
  tourStep: number;
  cameraPreset: string;
  telemetry: CityTelemetry;
  cinematicMode: boolean;
  aiDrawerOpen: boolean;
  aiMessages: AIChatMessage[];
  aiThinking: boolean;

  // Actions
  setTimeOfDay: (time: TimeOfDay) => void;
  setWeather: (weather: WeatherType) => void;
  triggerEarthquake: (intensity?: number) => void;
  stopEarthquake: () => void;
  setHourOfDay: (hour: number) => void;
  setAutoTimeCycle: (auto: boolean) => void;
  setTimeCycleSpeed: (speed: number) => void;
  setActiveLayer: (layer: DataLayer) => void;
  setShowBillboards: (show: boolean) => void;
  setShowNetworkGrid: (show: boolean) => void;
  setShowTraffic: (show: boolean) => void;
  setShowTrees: (show: boolean) => void;
  setActiveLandmark: (landmark: LandmarkData | null) => void;
  setHoveredLandmark: (landmark: LandmarkData | null) => void;
  setCameraPreset: (preset: string) => void;
  setIsTourActive: (active: boolean) => void;
  setCinematicMode: (enabled: boolean) => void;
  advanceTourStep: () => void;
  tickTelemetry: () => void;
  setAiDrawerOpen: (open: boolean) => void;
  addAiMessage: (msg: { sender: 'user' | 'assistant'; text: string; actionExecuted?: string }) => void;
  sendAiPrompt: (prompt: string) => Promise<void>;
}

export const useCityStore = create<CityState>((set, get) => ({
  timeOfDay: 'day',
  weather: 'clear',
  earthquake: {
    active: false,
    intensity: 5,
    magnitude: 6.8,
    duration: 14,
    elapsed: 0,
  },
  hourOfDay: 13.5, // 1:30 PM
  autoTimeCycle: false,
  timeCycleSpeed: 0.4,
  activeLayer: 'all',
  showBillboards: true,
  showNetworkGrid: true,
  showTraffic: true,
  showTrees: true,
  activeLandmark: null,
  hoveredLandmark: null,
  isTourActive: false,
  tourStep: 0,
  cameraPreset: 'isometric',
  telemetry: initialTelemetry,
  cinematicMode: false,
  aiDrawerOpen: false,
  aiMessages: [
    {
      id: 'init-1',
      sender: 'assistant',
      text: 'Tokyo Smart City AI Dispatcher online. Ask me to tour landmarks, simulate extreme weather (snow, winds, storm, tornado, earthquake), or inspect municipal telemetry.',
      timestamp: '12:00:00',
    },
  ],
  aiThinking: false,

  setTimeOfDay: (timeOfDay) => set({ timeOfDay }),
  setWeather: (weather) => {
    if (weather === 'earthquake') {
      get().triggerEarthquake(5);
    } else {
      if (get().earthquake.active) {
        get().stopEarthquake();
      }
      set({ weather });
    }
  },
  triggerEarthquake: (intensity = 5) => {
    set({
      weather: 'earthquake',
      earthquake: {
        active: true,
        intensity: Math.min(7, Math.max(1, intensity)),
        magnitude: +(5.5 + intensity * 0.35).toFixed(1),
        duration: 15,
        elapsed: 0,
      },
    });
  },
  stopEarthquake: () => {
    set({
      weather: 'clear',
      earthquake: {
        active: false,
        intensity: 5,
        magnitude: 6.8,
        duration: 14,
        elapsed: 0,
      },
    });
  },
  setHourOfDay: (hourOfDay) => {
    const wrapped = (hourOfDay + 24) % 24;
    let timeOfDay: TimeOfDay = 'day';
    if (wrapped >= 19 || wrapped < 5) timeOfDay = 'night';
    else if (wrapped >= 16.5 || (wrapped >= 5 && wrapped < 7.5)) timeOfDay = 'twilight';

    set({ hourOfDay: wrapped, timeOfDay });
  },
  setAutoTimeCycle: (autoTimeCycle) => set({ autoTimeCycle }),
  setTimeCycleSpeed: (timeCycleSpeed) => set({ timeCycleSpeed }),
  setActiveLayer: (activeLayer) => set({ activeLayer }),
  setShowBillboards: (showBillboards) => set({ showBillboards }),
  setShowNetworkGrid: (showNetworkGrid) => set({ showNetworkGrid }),
  setShowTraffic: (showTraffic) => set({ showTraffic }),
  setShowTrees: (showTrees) => set({ showTrees }),
  setActiveLandmark: (activeLandmark) => set({ activeLandmark }),
  setHoveredLandmark: (hoveredLandmark) => set({ hoveredLandmark }),
  setCameraPreset: (cameraPreset) => set({ cameraPreset }),
  setIsTourActive: (isTourActive) => set({ isTourActive }),
  setCinematicMode: (cinematicMode) => set({ cinematicMode }),
  advanceTourStep: () =>
    set((state) => {
      const nextStep = (state.tourStep + 1) % CITY_LANDMARKS.length;
      return {
        tourStep: nextStep,
        activeLandmark: CITY_LANDMARKS[nextStep],
        cameraPreset: CITY_LANDMARKS[nextStep].id,
      };
    }),
  tickTelemetry: () =>
    set((state) => {
      const jitter = (val: number, spread: number, min: number, max: number) => {
        const delta = (Math.random() - 0.5) * spread;
        return Math.min(max, Math.max(min, Math.round(val + delta)));
      };
      const t = state.telemetry;
      const nextTraffic = jitter(t.trafficFlowPercent, 1.8, 60, 92);
      const nextEnergy = jitter(t.energyConsumptionPercent, 1.5, 55, 88);
      const nextAqi = jitter(t.airQualityIndex, 1.2, 25, 60);
      const nextVisitors = t.visitorsToday + Math.floor(Math.random() * 24);

      // Advance auto time cycle if enabled
      let nextHour = state.hourOfDay;
      let nextTimeOfDay = state.timeOfDay;
      if (state.autoTimeCycle) {
        nextHour = (state.hourOfDay + state.timeCycleSpeed * 0.1) % 24;
        if (nextHour >= 19 || nextHour < 5) nextTimeOfDay = 'night';
        else if (nextHour >= 16.5 || (nextHour >= 5 && nextHour < 7.5)) nextTimeOfDay = 'twilight';
        else nextTimeOfDay = 'day';
      }

      return {
        hourOfDay: nextHour,
        timeOfDay: nextTimeOfDay,
        telemetry: {
          ...t,
          trafficFlowPercent: nextTraffic,
          energyConsumptionPercent: nextEnergy,
          airQualityIndex: nextAqi,
          visitorsToday: nextVisitors,
          temperatureC: +(t.temperatureC + (Math.random() - 0.49) * 0.05).toFixed(1),
          networkLatencyMs: +(t.networkLatencyMs + (Math.random() - 0.5) * 0.1).toFixed(1),
        },
      };
    }),
  setAiDrawerOpen: (aiDrawerOpen) => set({ aiDrawerOpen }),
  addAiMessage: (msg) =>
    set((state) => ({
      aiMessages: [
        ...state.aiMessages,
        {
          ...msg,
          id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          timestamp: new Date().toLocaleTimeString(),
        },
      ],
    })),
  sendAiPrompt: async (prompt: string) => {
    const { addAiMessage, setCameraPreset, setWeather, triggerEarthquake, setTimeOfDay, setActiveLayer, setActiveLandmark, setIsTourActive } = get();
    addAiMessage({ sender: 'user', text: prompt });
    set({ aiThinking: true });

    try {
      const res = await fetch('/api/gemini/command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          currentContext: {
            currentPreset: get().cameraPreset,
            currentWeather: get().weather,
            currentTimeOfDay: get().timeOfDay,
            activeLandmark: get().activeLandmark?.name,
          },
        }),
      });

      if (!res.ok) throw new Error('API request failed');
      const data = await res.json();

      let actionsDesc = '';

      if (data.cameraPreset) {
        setCameraPreset(data.cameraPreset);
        actionsDesc += `Camera -> ${data.cameraPreset}. `;
      }
      if (data.landmarkId) {
        const lm = CITY_LANDMARKS.find((l) => l.id === data.landmarkId);
        if (lm) setActiveLandmark(lm);
      }
      if (data.weather) {
        if (data.weather === 'earthquake') {
          triggerEarthquake(data.earthquakeIntensity || 5);
          actionsDesc += `Triggered Earthquake (Shindo ${data.earthquakeIntensity || 5}). `;
        } else {
          setWeather(data.weather);
          actionsDesc += `Weather -> ${data.weather}. `;
        }
      }
      if (data.timeOfDay) {
        setTimeOfDay(data.timeOfDay);
        actionsDesc += `Time -> ${data.timeOfDay}. `;
      }
      if (data.dataLayer) {
        setActiveLayer(data.dataLayer);
        actionsDesc += `Layer -> ${data.dataLayer}. `;
      }
      if (data.startTour) {
        setIsTourActive(true);
        actionsDesc += `Guided Tour started. `;
      }

      addAiMessage({
        sender: 'assistant',
        text: data.speech || 'Command acknowledged and executed.',
        actionExecuted: actionsDesc.trim() || undefined,
      });
    } catch (err) {
      console.error('AI command error:', err);
      addAiMessage({
        sender: 'assistant',
        text: 'Autonomous dispatch executed local fallback routine for your instruction.',
      });
    } finally {
      set({ aiThinking: false });
    }
  },
}));

