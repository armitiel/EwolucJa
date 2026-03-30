const { execSync } = require('child_process');
try {
  const result = execSync('netstat -ano | findstr :3001 | findstr LISTENING', { encoding: 'utf8' });
  const lines = result.trim().split('\n');
  for (const line of lines) {
    const pid = line.trim().split(/\s+/).pop();
    if (pid && pid !== '0') {
      console.log('Killing PID:', pid);
      try { execSync('taskkill /F /PID ' + pid); } catch(e) {}
    }
  }
} catch(e) {
  console.log('Port 3001 is free');
}
