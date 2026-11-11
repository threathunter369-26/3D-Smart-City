export type TimeOfDay = 'day' | 'twilight' | 'night';

export type DataLayer = 'all' | 'traffic' | 'energy' | 'environment' | 'budget' | 'network';

export type WeatherType =
  | 'clear'
  | 'snow'
  | 'night-stars'
  | 'winds'
  | 'storm'
  | 'tornado'
  | 'earthquake';

export interface EarthquakeState {
  active: boolean;
  intensity: number; // 1 to 7 Shindo scale
  magnitude: number;
  duration: number;
  elapsed: number;
}

export interface AIChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  actionExecuted?: string;
  timestamp: string;
}

export interface LandmarkData {
  id: string;
  name: string;
  japaneseName: string;
  category: 'landmark' | 'infrastructure' | 'cultural' | 'commercial';
  description: string;
  position: [number, number, number];
  height: number;
  stats: {
    occupancy?: number;
    powerUsageKw?: number;
    greenEnergyPercent?: number;
    iotSensorsCount?: number;
    healthStatus: 'optimal' | 'warning' | 'maintenance';
    dailyVisitors?: number;
    airQualityIndex?: number;
  };
}

export interface CityTelemetry {
  trafficFlowPercent: number;
  trafficHourly: number[];
  energyConsumptionPercent: number;
  energyHourly: number[];
  energyBreakdown: { solar: number; grid: number; storage: number };
  airQualityIndex: number;
  airQualityStatus: 'Good' | 'Moderate' | 'Unhealthy';
  pm25: number;
  co2Ppm: number;
  visitorsToday: number;
  visitorsGrowth: number;
  budgetTotalYen: number;
  budgetBreakdown: { category: string; percent: number; color: string }[];
  activeSensors: number;
  networkLatencyMs: number;
  temperatureC: number;
  humidityPercent: number;
}
