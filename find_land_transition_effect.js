const fs = require('fs');
const f = fs.readFileSync('C:/Users/DELL/EwolucJA/frontend/src/components/LandTransition.jsx', 'utf8');
const idx = f.indexOf('useEffect(() => {');
if (idx > -1) {
  console.log(f.substring(idx, idx + 500));
}
