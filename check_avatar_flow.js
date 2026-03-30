const fs = require('fs');
const f = fs.readFileSync('C:/Users/DELL/EwolucJA/frontend/src/App.jsx', 'utf8');

// Find avatar_builder handling
const idx = f.indexOf('type === "avatar_builder"');
if (idx > -1) {
  console.log('=== Avatar builder render ===');
  console.log(f.substring(idx - 30, idx + 300));
}

// Find onComplete callback
const idx2 = f.indexOf('setAvatarConfig');
if (idx2 > -1) {
  console.log('\n=== setAvatarConfig usage ===');
  console.log(f.substring(idx2 - 50, idx2 + 200));
}

// Check if AvatarAI is used near avatar creation
const idx3 = f.indexOf('AvatarAI');
console.log('\n=== All AvatarAI usages ===');
let pos = 0;
while (true) {
  pos = f.indexOf('AvatarAI', pos);
  if (pos === -1) break;
  const lineStart = f.lastIndexOf('\n', pos) + 1;
  const lineEnd = f.indexOf('\n', pos);
  console.log('Line:', f.substring(lineStart, lineEnd).trim());
  pos++;
}
