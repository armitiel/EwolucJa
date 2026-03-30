const fs = require('fs');
const f = fs.readFileSync('C:/Users/DELL/EwolucJA/frontend/src/App.jsx', 'utf8');
const lines = f.split('\n');
console.log('Total lines:', lines.length);
console.log('Last 6 lines:');
lines.slice(-6).forEach((l, i) => {
  console.log((lines.length - 6 + i + 1) + ' | ' + l);
});
// Check bracket balance
let braces = 0, parens = 0;
for (const ch of f) {
  if (ch === '{') braces++;
  if (ch === '}') braces--;
  if (ch === '(') parens++;
  if (ch === ')') parens--;
}
console.log('Brace balance:', braces, '(should be 0)');
console.log('Paren balance:', parens, '(should be 0)');
