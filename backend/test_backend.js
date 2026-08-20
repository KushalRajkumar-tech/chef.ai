/**
 * Automated Verification Script for Chef.ai Backend
 */
import http from 'http';
import app from './src/server.js';

const PORT = 5001; // use separate port for test run
let server;

function makeRequest(path, method = 'GET', body = null) {
  return new Promise((resolve, reject) => {
    const postData = body ? JSON.stringify(body) : null;
    const options = {
      hostname: '127.0.0.1',
      port: PORT,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(postData ? { 'Content-Length': Buffer.byteLength(postData) } : {})
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });

    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Starting Chef.ai Backend Verification Tests...\n');
  server = app.listen(PORT);

  let passed = 0;
  let total = 0;

  async function test(name, fn) {
    total++;
    try {
      await fn();
      console.log(`✅ [PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`❌ [FAIL] ${name}:`, err.message);
    }
  }

  // 1. Health Check
  await test('GET /api/health returns status ok and mode', async () => {
    const res = await makeRequest('/api/health');
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
    if (res.data.status !== 'ok') throw new Error(`Expected status 'ok', got ${res.data.status}`);
    if (!res.data.mode) throw new Error('Missing mode in health response');
    console.log(`   Mode reported: ${res.data.mode}`);
  });

  // 2. Pantry Scan (without image -> returns inventory)
  await test('POST /api/pantry/scan returns inventory list', async () => {
    const res = await makeRequest('/api/pantry/scan', 'POST', {});
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
    if (!res.data.data.items || res.data.data.items.length === 0) throw new Error('No pantry items returned');
    console.log(`   Detected ${res.data.data.items.length} pantry items (${res.data.data.expiringSoonCount} expiring soon)`);
  });

  // 3. Recipe Generation (with custom ingredients and filter)
  await test('POST /api/recipes/generate returns recipe cards with match score', async () => {
    const res = await makeRequest('/api/recipes/generate', 'POST', {
      ingredients: ['Eggs', 'Tomatoes', 'Garlic', 'Olive Oil', 'Parmesan'],
      filter: 'Quick (<20m)',
      sortBy: 'Best Match'
    });
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
    if (!res.data.data.recipes || res.data.data.recipes.length === 0) throw new Error('No recipes generated');
    const firstRecipe = res.data.data.recipes[0];
    console.log(`   Top Recipe: "${firstRecipe.title}" (${firstRecipe.pantryMatchPercentage}% match, ${firstRecipe.totalTimeMinutes}m)`);
    if (!firstRecipe.macros || !firstRecipe.instructions) throw new Error('Missing recipe macros or instructions');
  });

  // 4. Ingredient Substitution (Heavy Cream)
  await test('POST /api/recipes/substitute returns swap ratios for missing ingredient', async () => {
    const res = await makeRequest('/api/recipes/substitute', 'POST', {
      ingredient: 'Heavy Cream',
      recipeContext: 'Creamy Garlic Pasta'
    });
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
    if (!res.data.data.alternatives || res.data.data.alternatives.length === 0) throw new Error('No alternatives returned');
    console.log(`   Found ${res.data.data.alternatives.length} alternatives for "${res.data.data.target}"`);
    console.log(`   Primary swap: ${res.data.data.alternatives[0].name} (${res.data.data.alternatives[0].ratio})`);
  });

  // 5. 404 Route Handling
  await test('GET /api/nonexistent returns 404', async () => {
    const res = await makeRequest('/api/nonexistent');
    if (res.status !== 404) throw new Error(`Expected 404, got ${res.status}`);
  });

  server.close();
  console.log(`\n🏁 Test Results: ${passed}/${total} passed.\n`);

  if (passed !== total) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Fatal test error:', err);
  if (server) server.close();
  process.exit(1);
});
