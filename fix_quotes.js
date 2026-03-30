const fs = require('fs');
const path = 'C:/Users/DELL/EwolucJA/frontend/src/App.jsx';
let f = fs.readFileSync(path, 'utf8');
// Replace Polish opening quote „ (U+201E) with '
f = f.replace(/\u201E/g, "'");
// Replace Polish closing quote " (U+201D) with '
f = f.replace(/\u201D/g, "'");
// Replace left double quote " (U+201C) with '
f = f.replace(/\u201C/g, "'");
fs.writeFileSync(path, f, 'utf8');
console.log('Done - all Polish quotes replaced');
