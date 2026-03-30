const fs = require('fs');
const f = fs.readFileSync('C:/Users/DELL/EwolucJA/frontend/src/App.jsx', 'utf8');
const idx = f.indexOf('Witaj w magicznym');
if (idx > -1) {
  const start = f.lastIndexOf('<', idx);
  const end = f.indexOf('/>', idx) + 2;
  console.log(f.substring(start, end));
}
