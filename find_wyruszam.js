const fs = require('fs');
const f = fs.readFileSync('C:/Users/DELL/EwolucJA/frontend/src/App.jsx', 'utf8');

// Find the onClick for "Wyruszam w przygode"
const idx = f.indexOf('ttsPlayer.unlock()');
if (idx > -1) {
  console.log('=== ttsPlayer.unlock context ===');
  console.log(f.substring(idx - 20, idx + 350));
}

// Find advance function
const idx2 = f.indexOf('const advance = useCallback');
if (idx2 > -1) {
  console.log('\n=== advance function ===');
  console.log(f.substring(idx2, idx2 + 200));
}
