import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize GoogleGenAI client (server-side only)
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// AI City Dispatcher Endpoint
app.post('/api/gemini/command', async (req, res) => {
  const { prompt, currentContext } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Missing prompt' });
  }

  // If Gemini API is available, query gemini-3.8-flash with structured tool dispatch
  if (ai) {
    try {
      const systemInstruction = `You are the Tokyo Metropolitan Smart City 3D Digital Twin Dispatcher AI.
You have control over a real-time interactive 3D WebGL isometric simulation of Tokyo.
Users can ask you to tour areas, inspect landmarks, trigger weather conditions (snow, sunny, night, winds, storm, tornado, earthquake), change time of day (day, twilight, night, dawn), or inspect IoT data layers.

Available Camera Presets:
- "isometric" (city overview)
- "tokyo-tower" (Tokyo Communications Tower)
- "skytree" (Metropolitan Sky Needle)
- "tokyo-station" (Central Heritage Station)
- "sensoji-temple" (Asakusa Heritage Pagoda & Gate)
- "national-stadium" (National Circular Arena)
- "waterfront-promenade" (Bay Area Ferry Terminal & Ferris Wheel)
- "financial-tower" (Central Smart Financial Tower)
- "tech-hub" (Metropolitan Tech Center)

Available Weather Effects:
- "clear" (Sunny, bright daylight)
- "snow" (Gentle snowfall with frost)
- "night-stars" (Clear starry night with illuminated skyscrapers)
- "winds" (High winds with building & tree sway)
- "storm" (Heavy rain and dynamic thunder lightning flashes)
- "tornado" (Swirling 3D cyclone vortex with vortex oscillations)
- "earthquake" (Tectonic seismic tremor, physical building sway with tuned mass damping)

Available Time of Day:
- "day", "twilight", "night"

Available Data Layers:
- "all", "traffic", "energy", "environment", "budget", "network"

You MUST output a valid JSON object matching this schema:
{
  "speech": "Brief authoritative dispatch narration explaining what is happening and relevant IoT telemetry (1-2 sentences)",
  "cameraPreset": "preset name or null",
  "weather": "weather name or null",
  "earthquakeIntensity": number between 1 and 7 (only if earthquake),
  "timeOfDay": "day" | "twilight" | "night" | null,
  "dataLayer": "layer name or null",
  "landmarkId": "landmark id or null",
  "startTour": boolean
}
Return ONLY raw JSON, with no markdown code fences.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `User command: "${prompt}"\nCurrent Context: ${JSON.stringify(currentContext || {})}`,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
        },
      });

      const text = response.text || '{}';
      const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);
      return res.json(parsed);
    } catch (err: any) {
      console.error('Gemini error, falling back to heuristic dispatcher:', err);
    }
  }

  // Fallback heuristic dispatcher (works even without API key configured)
  const lower = prompt.toLowerCase();
  let cameraPreset: string | null = null;
  let weather: string | null = null;
  let timeOfDay: string | null = null;
  let landmarkId: string | null = null;
  let dataLayer: string | null = null;
  let earthquakeIntensity: number | null = null;
  let startTour = false;
  let speech = 'Dispatching command to 3D city engine.';

  if (lower.includes('tour') || lower.includes('guide') || lower.includes('fly through')) {
    startTour = true;
    cameraPreset = 'isometric';
    speech = 'Initiating autonomous multi-sector smart city guided tour.';
  } else if (lower.includes('tower') || lower.includes('tokyo tower')) {
    cameraPreset = 'tokyo-tower';
    landmarkId = 'tokyo-tower';
    speech = 'Navigating camera to Tokyo Communications Tower (333m lattice hub).';
  } else if (lower.includes('skytree') || lower.includes('needle')) {
    cameraPreset = 'skytree';
    landmarkId = 'skytree';
    speech = 'Focusing on the 634m Metropolitan Sky Needle telemetry sensors.';
  } else if (lower.includes('station') || lower.includes('marunouchi')) {
    cameraPreset = 'tokyo-station';
    landmarkId = 'tokyo-station';
    speech = 'Centering on Central Heritage Station red-brick terminal.';
  } else if (lower.includes('temple') || lower.includes('pagoda') || lower.includes('asakusa') || lower.includes('sensoji')) {
    cameraPreset = 'sensoji-temple';
    landmarkId = 'sensoji-temple';
    speech = 'Navigating to Asakusa Heritage 5-Story Pagoda and sanctuary.';
  } else if (lower.includes('stadium') || lower.includes('arena') || lower.includes('olympic')) {
    cameraPreset = 'national-stadium';
    landmarkId = 'national-stadium';
    speech = 'Switching viewpoint to National Circular Arena and concourse.';
  } else if (lower.includes('waterfront') || lower.includes('ferris') || lower.includes('wheel') || lower.includes('ferry') || lower.includes('bay')) {
    cameraPreset = 'waterfront-promenade';
    landmarkId = 'waterfront-promenade';
    speech = 'Viewing Bay Area Waterfront Terminal and illuminated Ferris wheel.';
  } else if (lower.includes('overview') || lower.includes('city') || lower.includes('isometric') || lower.includes('reset')) {
    cameraPreset = 'isometric';
    speech = 'Resetting camera to metropolitan isometric perspective.';
  }

  // Weather detection
  if (lower.includes('earthquake') || lower.includes('quake') || lower.includes('shake') || lower.includes('tremor') || lower.includes('seismic')) {
    weather = 'earthquake';
    earthquakeIntensity = lower.includes('major') || lower.includes('big') || lower.includes('strong') ? 6 : 5;
    speech += ` Activating seismic emergency simulation (Shindo ${earthquakeIntensity}). Tuned mass dampers engaged.`;
  } else if (lower.includes('tornado') || lower.includes('cyclone') || lower.includes('twister') || lower.includes('vortex')) {
    weather = 'tornado';
    speech += ' Generating high-velocity 3D cyclone vortex near urban center.';
  } else if (lower.includes('storm') || lower.includes('rain') || lower.includes('thunder') || lower.includes('lightning') || lower.includes('typhoon')) {
    weather = 'storm';
    speech += ' Initiating severe precipitation storm with atmospheric lightning flashes.';
  } else if (lower.includes('snow') || lower.includes('winter') || lower.includes('blizzard') || lower.includes('frost')) {
    weather = 'snow';
    speech += ' Activating winter snowfall simulation with surface frost accumulation.';
  } else if (lower.includes('wind') || lower.includes('gust') || lower.includes('breeze')) {
    weather = 'winds';
    speech += ' Simulating 45m/s wind gusts; observing skyscraper aerodynamic sway.';
  } else if (lower.includes('sunny') || lower.includes('clear') || lower.includes('sun') || lower.includes('day')) {
    weather = 'clear';
    timeOfDay = 'day';
    speech += ' Setting skies to clear, bright sunny conditions.';
  } else if (lower.includes('night') || lower.includes('star') || lower.includes('stars') || lower.includes('dark')) {
    weather = 'night-stars';
    timeOfDay = 'night';
    speech += ' Transitioning to clear starry midnight with illuminated architecture.';
  }

  if (lower.includes('traffic')) dataLayer = 'traffic';
  if (lower.includes('energy') || lower.includes('power')) dataLayer = 'energy';
  if (lower.includes('air') || lower.includes('environment')) dataLayer = 'environment';
  if (lower.includes('budget') || lower.includes('finance')) dataLayer = 'budget';
  if (lower.includes('network') || lower.includes('iot') || lower.includes('6g')) dataLayer = 'network';

  return res.json({
    speech,
    cameraPreset,
    weather,
    earthquakeIntensity,
    timeOfDay,
    dataLayer,
    landmarkId,
    startTour,
  });
});

async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      try {
        let template = fs.readFileSync(path.resolve('.', 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    app.use(express.static('dist'));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve('.', 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Tokyo Smart City Digital Twin server running on port ${PORT}`);
  });
}

startServer();
