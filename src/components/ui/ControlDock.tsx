import React, { useState } from 'react';
import {
  Layers,
  Camera,
  Activity,
  Sliders,
  ChevronDown,
  ChevronUp,
  Car,
  Zap,
  Wind,
  Coins,
  Share2,
  TreePine,
  PanelTop,
  CloudSun,
  Snowflake,
  Sun,
  Moon,
  CloudLightning,
  AlertTriangle,
  Play,
  Pause,
  Clock,
} from 'lucide-react';
import { useCityStore, CITY_LANDMARKS } from '../../store/useCityStore';
import { DataLayer, WeatherType } from '../../types/city';

const TornadoIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 4H3" />
    <path d="M18 8H6" />
    <path d="M19 12H9" />
    <path d="M16 16h-6" />
    <path d="M11 20H9" />
  </svg>
);

export const ControlDock: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<'views' | 'weather' | 'layers' | 'elements' | 'metrics'>('views');

  const {
    weather,
    setWeather,
    earthquake,
    triggerEarthquake,
    stopEarthquake,
    hourOfDay,
    setHourOfDay,
    autoTimeCycle,
    setAutoTimeCycle,
    activeLayer,
    setActiveLayer,
    showBillboards,
    setShowBillboards,
    showNetworkGrid,
    setShowNetworkGrid,
    showTraffic,
    setShowTraffic,
    showTrees,
    setShowTrees,
    cameraPreset,
    setCameraPreset,
    setActiveLandmark,
    telemetry,
  } = useCityStore();

  const handleSelectLandmark = (id: string) => {
    setCameraPreset(id);
    if (id === 'isometric') {
      setActiveLandmark(null);
    } else {
      const landmark = CITY_LANDMARKS.find((l) => l.id === id);
      if (landmark) setActiveLandmark(landmark);
    }
  };

  const weatherOptions: { id: WeatherType; label: string; icon: React.ReactNode; desc: string }[] = [
    { id: 'clear', label: 'Sunny', icon: <Sun className="w-4 h-4 text-amber-500" />, desc: 'Crisp pearl sunlight' },
    { id: 'snow', label: 'Snowfall', icon: <Snowflake className="w-4 h-4 text-sky-400" />, desc: 'Falling procedural snow' },
    { id: 'night-stars', label: 'Night Stars', icon: <Moon className="w-4 h-4 text-indigo-400" />, desc: '1,600 stars & neon' },
    { id: 'winds', label: 'High Winds', icon: <Wind className="w-4 h-4 text-teal-500" />, desc: 'Aerodynamic tower sway' },
    { id: 'storm', label: 'Storm & Rain', icon: <CloudLightning className="w-4 h-4 text-blue-500" />, desc: 'Precipitation & lightning' },
    { id: 'tornado', label: '3D Tornado', icon: <TornadoIcon className="w-4 h-4 text-amber-600" />, desc: '3D cyclone vortex' },
    { id: 'earthquake', label: 'Earthquake', icon: <AlertTriangle className="w-4 h-4 text-red-500" />, desc: 'Seismic resonance' },
  ];

  const layers: { id: DataLayer; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: 'All Telemetry', icon: <Layers className="w-4 h-4" /> },
    { id: 'traffic', label: 'Traffic Flow', icon: <Car className="w-4 h-4" /> },
    { id: 'energy', label: 'Energy Grid', icon: <Zap className="w-4 h-4" /> },
    { id: 'environment', label: 'Environment', icon: <Wind className="w-4 h-4" /> },
    { id: 'budget', label: 'City Budget', icon: <Coins className="w-4 h-4" /> },
    { id: 'network', label: '6G Network', icon: <Share2 className="w-4 h-4" /> },
  ];

  return (
    <div
      className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-20 w-[94vw] max-w-[940px] transition-transform duration-300 ease-out select-none ${
        isCollapsed ? 'translate-y-[calc(100%-36px)]' : 'translate-y-0'
      }`}
    >
      {/* Collapse / Expand Toggle Button */}
      <div className="flex justify-center mb-1">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex items-center gap-1.5 px-3 py-1 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-full text-xs font-semibold text-slate-700 shadow-sm hover:text-sky-600 hover:border-sky-300 transition-all cursor-pointer"
        >
          {isCollapsed ? (
            <>
              <ChevronUp className="w-3.5 h-3.5" />
              <span>Show Controls</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5" />
              <span>Hide Controls</span>
            </>
          )}
        </button>
      </div>

      {/* Main Glassmorphic Dock Container */}
      <div className="bg-white/92 backdrop-blur-xl border border-slate-200/90 rounded-2xl shadow-xl shadow-slate-300/40 p-3 sm:p-3.5">
        {/* Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-2.5 gap-2 overflow-x-auto">
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab('views')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'views'
                  ? 'bg-sky-50 text-sky-700 border border-sky-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Camera Views</span>
            </button>

            <button
              onClick={() => setActiveTab('weather')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'weather'
                  ? 'bg-sky-50 text-sky-700 border border-sky-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
              }`}
            >
              <CloudSun className="w-3.5 h-3.5" />
              <span>Weather & Time</span>
            </button>

            <button
              onClick={() => setActiveTab('layers')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'layers'
                  ? 'bg-sky-50 text-sky-700 border border-sky-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>IoT Layers</span>
            </button>

            <button
              onClick={() => setActiveTab('elements')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'elements'
                  ? 'bg-sky-50 text-sky-700 border border-sky-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Scene Elements</span>
            </button>

            <button
              onClick={() => setActiveTab('metrics')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'metrics'
                  ? 'bg-sky-50 text-sky-700 border border-sky-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Live KPIs</span>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-[11px] text-slate-500 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Telemetry Active: {telemetry.activeSensors.toLocaleString()} nodes</span>
          </div>
        </div>

        {/* Tab 1: Camera Views */}
        {activeTab === 'views' && (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-8 gap-2">
            <button
              onClick={() => handleSelectLandmark('isometric')}
              className={`flex flex-col items-center justify-center p-2 rounded-xl text-xs font-medium border transition-all ${
                cameraPreset === 'isometric'
                  ? 'bg-sky-600 text-white border-sky-600 shadow-sm'
                  : 'bg-slate-50/70 text-slate-700 border-slate-200/80 hover:bg-slate-100'
              }`}
            >
              <span className="font-semibold text-center leading-tight">Isometric</span>
              <span className="text-[10px] opacity-80">Full View</span>
            </button>

            {CITY_LANDMARKS.map((landmark) => (
              <button
                key={landmark.id}
                onClick={() => handleSelectLandmark(landmark.id)}
                className={`flex flex-col items-center justify-center p-2 rounded-xl text-xs font-medium border transition-all ${
                  cameraPreset === landmark.id
                    ? 'bg-sky-600 text-white border-sky-600 shadow-sm'
                    : 'bg-slate-50/70 text-slate-700 border-slate-200/80 hover:bg-slate-100'
                }`}
              >
                <span className="font-semibold text-center leading-tight truncate w-full">
                  {landmark.name.split(' ')[0]}
                </span>
                <span className="text-[10px] opacity-80 truncate w-full text-center">
                  {landmark.japaneseName.slice(0, 4)}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Tab: Weather & Atmospheric Simulation */}
        {activeTab === 'weather' && (
          <div className="space-y-3">
            {/* Weather Effects Selection Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-1.5 sm:gap-2">
              {weatherOptions.map((opt) => {
                const isSelected = weather === opt.id || (opt.id === 'earthquake' && earthquake.active);
                return (
                  <button
                    key={opt.id}
                    onClick={() => {
                      if (opt.id === 'earthquake') {
                        if (earthquake.active) stopEarthquake();
                        else triggerEarthquake(5);
                      } else {
                        setWeather(opt.id);
                      }
                    }}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl text-xs font-medium border transition-all ${
                      isSelected
                        ? 'bg-sky-600 text-white border-sky-600 shadow-sm'
                        : 'bg-slate-50/80 text-slate-700 border-slate-200/80 hover:bg-slate-100'
                    }`}
                  >
                    <div className="mb-1">{opt.icon}</div>
                    <span className="font-semibold text-center leading-tight">{opt.label}</span>
                    <span className="text-[9px] opacity-80 text-center truncate w-full">{opt.desc}</span>
                  </button>
                );
              })}
            </div>

            {/* Time of Day Slider & Auto-Cycle Controls */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-sky-600" />
                <span className="text-xs font-bold text-slate-800">24h Solar Time:</span>
                <span className="text-xs font-mono font-bold bg-white px-2 py-0.5 rounded border border-slate-200 text-sky-700">
                  {Math.floor(hourOfDay).toString().padStart(2, '0')}:
                  {Math.floor((hourOfDay % 1) * 60).toString().padStart(2, '0')}
                </span>
              </div>

              {/* Time Scrubber Slider */}
              <div className="flex-1 flex items-center gap-2 max-w-md">
                <span className="text-[10px] font-semibold text-slate-400">00:00</span>
                <input
                  type="range"
                  min="0"
                  max="24"
                  step="0.1"
                  value={hourOfDay}
                  onChange={(e) => setHourOfDay(parseFloat(e.target.value))}
                  className="flex-1 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
                />
                <span className="text-[10px] font-semibold text-slate-400">24:00</span>
              </div>

              {/* Auto Time Cycle Button */}
              <button
                onClick={() => setAutoTimeCycle(!autoTimeCycle)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  autoTimeCycle
                    ? 'bg-sky-600 text-white shadow-2xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {autoTimeCycle ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                <span>{autoTimeCycle ? 'Pause 24h Cycle' : 'Auto 24h Cycle'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: IoT Layers */}
        {activeTab === 'layers' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            {layers.map((layer) => {
              const isSelected = activeLayer === layer.id;
              return (
                <button
                  key={layer.id}
                  onClick={() => setActiveLayer(layer.id)}
                  className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-semibold border transition-all ${
                    isSelected
                      ? 'bg-sky-600 text-white border-sky-600 shadow-sm'
                      : 'bg-slate-50/70 text-slate-700 border-slate-200/80 hover:bg-slate-100'
                  }`}
                >
                  <span className={isSelected ? 'text-white' : 'text-sky-600'}>
                    {layer.icon}
                  </span>
                  <span>{layer.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Tab 3: Scene Elements Toggle */}
        {activeTab === 'elements' && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              onClick={() => setShowBillboards(!showBillboards)}
              className={`flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold border transition-all ${
                showBillboards
                  ? 'bg-sky-50 text-sky-800 border-sky-300'
                  : 'bg-slate-50/70 text-slate-500 border-slate-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <PanelTop className="w-4 h-4 text-sky-600" />
                <span>3D Billboards</span>
              </div>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${showBillboards ? 'bg-sky-200/80 text-sky-900' : 'bg-slate-200 text-slate-600'}`}>
                {showBillboards ? 'ON' : 'OFF'}
              </span>
            </button>

            <button
              onClick={() => setShowTraffic(!showTraffic)}
              className={`flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold border transition-all ${
                showTraffic
                  ? 'bg-sky-50 text-sky-800 border-sky-300'
                  : 'bg-slate-50/70 text-slate-500 border-slate-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <Car className="w-4 h-4 text-sky-600" />
                <span>Moving Vehicles</span>
              </div>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${showTraffic ? 'bg-sky-200/80 text-sky-900' : 'bg-slate-200 text-slate-600'}`}>
                {showTraffic ? 'ON' : 'OFF'}
              </span>
            </button>

            <button
              onClick={() => setShowTrees(!showTrees)}
              className={`flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold border transition-all ${
                showTrees
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-slate-50/70 text-slate-500 border-slate-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <TreePine className="w-4 h-4 text-emerald-600" />
                <span>City Greenery</span>
              </div>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${showTrees ? 'bg-emerald-200/80 text-emerald-900' : 'bg-slate-200 text-slate-600'}`}>
                {showTrees ? 'ON' : 'OFF'}
              </span>
            </button>

            <button
              onClick={() => setShowNetworkGrid(!showNetworkGrid)}
              className={`flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold border transition-all ${
                showNetworkGrid
                  ? 'bg-sky-50 text-sky-800 border-sky-300'
                  : 'bg-slate-50/70 text-slate-500 border-slate-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <Share2 className="w-4 h-4 text-sky-600" />
                <span>IoT Data Lines</span>
              </div>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${showNetworkGrid ? 'bg-sky-200/80 text-sky-900' : 'bg-slate-200 text-slate-600'}`}>
                {showNetworkGrid ? 'ON' : 'OFF'}
              </span>
            </button>
          </div>
        )}

        {/* Tab 4: Live KPIs Summary */}
        {activeTab === 'metrics' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/70">
              <span className="text-[10px] text-slate-500 font-semibold uppercase">Traffic Flow</span>
              <div className="text-base font-bold text-slate-900">{telemetry.trafficFlowPercent}%</div>
              <span className="text-[10px] text-sky-600 font-medium">Optimal flow</span>
            </div>

            <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/70">
              <span className="text-[10px] text-slate-500 font-semibold uppercase">Grid Load</span>
              <div className="text-base font-bold text-slate-900">{telemetry.energyConsumptionPercent}%</div>
              <span className="text-[10px] text-amber-600 font-medium">Solar 34% active</span>
            </div>

            <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/70">
              <span className="text-[10px] text-slate-500 font-semibold uppercase">Air Quality</span>
              <div className="text-base font-bold text-emerald-600">{telemetry.airQualityIndex} Good</div>
              <span className="text-[10px] text-slate-500 font-medium">PM2.5: 11.4 µg/m³</span>
            </div>

            <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/70">
              <span className="text-[10px] text-slate-500 font-semibold uppercase">Visitors Today</span>
              <div className="text-base font-bold text-slate-900">{(telemetry.visitorsToday / 10000).toFixed(1)}万人</div>
              <span className="text-[10px] text-emerald-600 font-medium">+{telemetry.visitorsGrowth}% vs yday</span>
            </div>

            <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/70">
              <span className="text-[10px] text-slate-500 font-semibold uppercase">City Budget</span>
              <div className="text-base font-bold text-slate-900">¥{(telemetry.budgetTotalYen / 1000000000000).toFixed(2)}兆</div>
              <span className="text-[10px] text-slate-500 font-medium">FY2026 Executed</span>
            </div>

            <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/70">
              <span className="text-[10px] text-slate-500 font-semibold uppercase">Latency & Temp</span>
              <div className="text-base font-bold text-slate-900">{telemetry.temperatureC}°C</div>
              <span className="text-[10px] text-sky-600 font-medium">{telemetry.networkLatencyMs}ms ping</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
