const fs = require('fs');
const f = fs.readFileSync('C:/Users/DELL/EwolucJA/frontend/src/App.jsx', 'utf8');
// Find the Wyruszam button onClick
const idx = f.indexOf('prevLandRef.current = null');
if (idx > -1) {
  console.log(f.substring(idx - 80, idx + 300));
}
