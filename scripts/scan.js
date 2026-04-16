const fs = require('fs');
const html = fs.readFileSync('sansad_test.html', 'utf8');
const urls = html.match(/https?:\/\/[^\s"'<]+/g) || [];
console.log(urls.filter(u => u.includes('api') || u.includes('.json')));
