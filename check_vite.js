const { execSync } = require('child_process');
try {
  const result = execSync('netstat -ano | findstr :5173 | findstr LISTENING', { encoding: 'utf8' });
  console.log('Vite running:', result.trim());
} catch(e) {
  console.log('Vite NOT running on 5173');
}
