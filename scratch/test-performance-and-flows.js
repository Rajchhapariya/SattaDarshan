const fs = require('fs');

const baseUrl = 'http://localhost:3000';

const routesToTest = [
  { name: 'Homepage', path: '/', expectedStatus: 200 },
  { name: 'Global Search API', path: '/api/search?q=modi', expectedStatus: 200 },
  { name: 'Politicians Directory', path: '/politicians', expectedStatus: 200 },
  { name: 'Politician Detail (Narendra Modi)', path: '/politicians/narendra-modi', expectedStatus: 200 },
  { name: 'Parties Directory', path: '/parties', expectedStatus: 200 },
  { name: 'Party Detail (BJP)', path: '/parties/bjp', expectedStatus: 200 },
  { name: 'States Directory', path: '/states', expectedStatus: 200 },
  { name: 'State Detail (West Bengal)', path: '/states/west-bengal', expectedStatus: 200 },
  { name: '18th Lok Sabha', path: '/parliament/lok-sabha', expectedStatus: 200 },
  { name: 'Rajya Sabha', path: '/parliament/rajya-sabha', expectedStatus: 200 },
  { name: 'Parliament Seats API', path: '/api/parliament/seats?chamber=Lok+Sabha', expectedStatus: 200 },
  { name: 'Contact Page', path: '/contact', expectedStatus: 200 },
  { name: 'Corrections Page', path: '/corrections', expectedStatus: 200 },
  { name: 'Robots.txt', path: '/robots.txt', expectedStatus: 200 },
  { name: 'Sitemap.xml', path: '/sitemap.xml', expectedStatus: 200 },
  { name: 'Civic 404 Page', path: '/non-existent-civic-route', expectedStatus: 404 },
];

async function runPerformanceAndFlowTests() {
  console.log('=== ROUTE AVAILABILITY & RESPONSE TIME AUDIT ===\n');
  const results = [];

  for (const route of routesToTest) {
    const start = performance.now();
    try {
      const res = await fetch(`${baseUrl}${route.path}`);
      const duration = Math.round(performance.now() - start);
      const pass = res.status === route.expectedStatus;
      const contentType = res.headers.get('content-type') || '';
      console.log(`[${pass ? 'PASS' : 'FAIL'}] ${route.name.padEnd(35)} -> HTTP ${res.status} (${duration}ms) [${contentType.split(';')[0]}]`);
      results.push({ name: route.name, path: route.path, status: res.status, duration, pass });
    } catch (err) {
      console.error(`[ERROR] ${route.name} failed: ${err.message}`);
      results.push({ name: route.name, path: route.path, status: 'ERR', duration: 0, pass: false });
    }
  }

  const allPassed = results.every(r => r.pass);
  console.log(`\nAll Routes Passed: ${allPassed}`);
  console.log(`Average Response Time: ${Math.round(results.reduce((a, b) => a + b.duration, 0) / results.length)}ms`);
}

runPerformanceAndFlowTests();
