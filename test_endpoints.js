async function test() {
  // 1. Health check
  let r = await fetch('http://localhost:3001/api/health');
  console.log('Health:', r.status, await r.json());

  // 2. Image service status
  r = await fetch('http://localhost:3001/api/images/status');
  console.log('Images status:', r.status, await r.json());

  // 3. Test fal.ai avatar generation
  console.log('\nGenerating avatar with fal.ai...');
  r = await fetch('http://localhost:3001/api/images/avatar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      playerName: 'TestHero',
      avatarConfig: { skinColor: 'light', hairStyle: 'short', hairColor: 'brown' }
    })
  });
  const avatar = await r.json();
  console.log('Avatar result:', r.status, avatar.ok ? 'OK' : 'FAIL');
  if (avatar.url) console.log('Image URL:', avatar.url.substring(0, 80) + '...');
  if (avatar.elapsed_ms) console.log('Generated in:', avatar.elapsed_ms + 'ms');
  if (avatar.error) console.log('Error:', avatar.error);
}
test().catch(e => console.error('Test failed:', e.message));
