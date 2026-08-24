import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRouter from './routes/api.js';
import { isLiveAIReady } from './config/gemini.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 5000;

// Security & Parsing Middlewares
app.use(cors());
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Serve Stitch Designs as Static Assets
const designsPath = path.join(__dirname, '../../frontend/stitch-designs');
app.use('/designs', express.static(designsPath));

// Request Logger
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${req.method}] ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// Interactive Browser Portal
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Chef.ai UI & API Portal</title>
      <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700;800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          background-color: #131313;
          color: #e5e2e1;
          font-family: 'Inter', sans-serif;
          padding: 40px 20px;
          min-height: 100vh;
        }
        .container {
          max-width: 1100px;
          margin: 0 auto;
        }
        header {
          text-align: center;
          margin-bottom: 40px;
        }
        h1 {
          font-family: 'Montserrat', sans-serif;
          font-size: 38px;
          color: #ffbf00;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
        }
        p.subtitle {
          color: #d4c5ab;
          font-size: 16px;
        }
        .badge {
          display: inline-block;
          background: rgba(255, 191, 0, 0.15);
          color: #ffbf00;
          border: 1px solid rgba(255, 191, 0, 0.3);
          padding: 4px 12px;
          border-radius: 9999px;
          font-size: 13px;
          font-weight: 600;
          margin-top: 12px;
        }
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 24px;
          margin-bottom: 40px;
        }
        .card {
          background: #1e1e1e;
          border: 1px solid rgba(200, 200, 176, 0.1);
          border-radius: 20px;
          overflow: hidden;
          transition: transform 0.2s, border-color 0.2s, box-shadow 0.2s;
          display: flex;
          flex-direction: column;
        }
        .card:hover {
          transform: translateY(-4px);
          border-color: #ffbf00;
          box-shadow: 0 12px 30px rgba(0,0,0,0.5);
        }
        .card-img {
          width: 100%;
          height: 220px;
          object-fit: cover;
          background: #181c25;
          border-bottom: 1px solid rgba(200, 200, 176, 0.1);
        }
        .card-body {
          padding: 18px;
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .card-title {
          font-family: 'Montserrat', sans-serif;
          font-size: 17px;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 8px;
        }
        .card-desc {
          font-size: 13px;
          color: #a3a3a3;
          margin-bottom: 16px;
          line-height: 1.4;
        }
        .btn {
          display: block;
          text-align: center;
          background: #ffbf00;
          color: #121212;
          font-weight: 700;
          font-size: 14px;
          padding: 10px 16px;
          border-radius: 12px;
          text-decoration: none;
          transition: background 0.2s;
        }
        .btn:hover {
          background: #ffe2ab;
        }
        .api-box {
          background: #1a1a1a;
          border: 1px solid rgba(255, 191, 0, 0.2);
          border-radius: 16px;
          padding: 24px;
          margin-top: 20px;
        }
        .api-box h3 {
          font-family: 'Montserrat', sans-serif;
          color: #ffbf00;
          margin-bottom: 12px;
        }
        .api-links {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }
        .api-btn {
          background: #2a2a2a;
          color: #e5e2e1;
          border: 1px solid rgba(200, 200, 176, 0.2);
          padding: 8px 14px;
          border-radius: 8px;
          text-decoration: none;
          font-size: 13px;
          font-weight: 500;
        }
        .api-btn:hover {
          background: #333333;
          border-color: #ffbf00;
          color: #ffbf00;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <header>
          <h1>👨‍🍳 Chef.ai Production UI</h1>
          <p class="subtitle">Google Stitch UI System & Dual-Mode Culinary Intelligence Backend</p>
          <div class="badge">● Backend Mode: ${isLiveAIReady ? 'LIVE GEMINI AI' : 'MOCK CULINARY ENGINE'}</div>
        </header>

        <div class="grid">
          <div class="card">
            <img class="card-img" src="/designs/previews/01_dashboard_ingredient_hub.png" alt="Screen 1">
            <div class="card-body">
              <div>
                <div class="card-title">Screen 1: Dashboard & Hub</div>
                <div class="card-desc">Visual pantry scanner, drag-and-drop photo zone, ingredient autocomplete tags, and dietary carousel.</div>
              </div>
              <a class="btn" href="/designs/01_dashboard_ingredient_hub.html" target="_blank">Open Screen 1 →</a>
            </div>
          </div>

          <div class="card">
            <img class="card-img" src="/designs/previews/02_recipe_discovery_feed.png" alt="Screen 2">
            <div class="card-body">
              <div>
                <div class="card-title">Screen 2: Recipe Feed</div>
                <div class="card-desc">Discovery feed with match % rings, missing ingredient alerts, calorie badges, and cuisine tags.</div>
              </div>
              <a class="btn" href="/designs/02_recipe_discovery_feed.html" target="_blank">Open Screen 2 →</a>
            </div>
          </div>

          <div class="card">
            <img class="card-img" src="/designs/previews/03_recipe_detail_cookalong.png" alt="Screen 3">
            <div class="card-body">
              <div>
                <div class="card-title">Screen 3: Recipe Detail</div>
                <div class="card-desc">Cook-along interactive view, checklist with missing swaps, step timer pill, and macro split.</div>
              </div>
              <a class="btn" href="/designs/03_recipe_detail_cookalong.html" target="_blank">Open Screen 3 →</a>
            </div>
          </div>

          <div class="card">
            <img class="card-img" src="/designs/previews/04_pantry_substitutions_drawer.png" alt="Screen 4">
            <div class="card-body">
              <div>
                <div class="card-title">Screen 4: Pantry Drawer</div>
                <div class="card-desc">Expiry indicators, inventory breakdown, and 1-click smart AI substitution cards.</div>
              </div>
              <a class="btn" href="/designs/04_pantry_substitutions_drawer.html" target="_blank">Open Screen 4 →</a>
            </div>
          </div>
        </div>

        <div class="api-box">
          <h3>⚡ Backend Endpoints & External Links</h3>
          <div class="api-links">
            <a class="api-btn" href="/api/health" target="_blank">📡 GET /api/health</a>
            <a class="api-btn" href="https://stitch.withgoogle.com/projects/3238284907772011213" target="_blank">🎨 Open in Google Stitch (Project 3238284907772011213)</a>
          </div>
        </div>
      </div>
    </body>
    </html>
  `);
});

// Mount API Routes
app.use('/api', apiRouter);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Route not found: ${req.method} ${req.originalUrl}`
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('💥 [Server Error]:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});

// Start Server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`\n👨‍🍳 Chef.ai Server running at http://localhost:${PORT}`);
    console.log(`📡 API Health: http://localhost:${PORT}/api/health`);
    console.log(`🔒 Mode: ${isLiveAIReady ? 'LIVE GEMINI AI' : 'MOCK / OFFLINE CULINARY ENGINE'}\n`);
  });
}

export default app;
