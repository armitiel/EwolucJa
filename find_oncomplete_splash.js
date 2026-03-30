const fs = require('fs');
const f = fs.readFileSync('C:/Users/DELL/EwolucJA/frontend/src/App.jsx', 'utf8');
// Find where LandTransition onComplete is handled in App
const idx = f.indexOf('setShowTransition(false)');
if (idx > -1) {
  console.log(f.substring(idx - 60, idx + 200));
}
