const fs = require('fs');
const f = fs.readFileSync('C:/Users/DELL/EwolucJA/frontend/src/App.jsx', 'utf8');
const idx = f.indexOf('Powiadomienie o nowym przedmiocie');
if (idx > -1) console.log(f.substring(idx - 10, idx + 350));
