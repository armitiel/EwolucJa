const fs = require('fs');
const f = fs.readFileSync('C:/Users/DELL/EwolucJA/frontend/src/components/LandTransition.jsx', 'utf8');
// Find onComplete calls
let pos = 0;
while (true) {
  pos = f.indexOf('onComplete', pos);
  if (pos === -1) break;
  const start = Math.max(0, pos - 40);
  const end = Math.min(f.length, pos + 80);
  console.log('---');
  console.log(f.substring(start, end));
  pos++;
}
