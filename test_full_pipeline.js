async function testPipeline() {
  const BASE = 'http://localhost:3001/api';
  
  console.log('=== TEST 1: Status serwisow ===');
  let r = await fetch(BASE + '/images/status');
  console.log('fal.ai:', await r.json());

  console.log('\n=== TEST 2: Generowanie ekwipunku (Zielona Peleryna) ===');
  const t1 = Date.now();
  r = await fetch(BASE + '/images/equipment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      itemName: 'Zielona Peleryna Empatii',
      itemDescription: 'A soft emerald green cape that shimmers with gentle light, worn by heroes who feel others emotions'
    })
  });
  const cape = await r.json();
  console.log('Status:', r.status, cape.ok ? 'OK' : 'FAIL');
  console.log('URL:', cape.url ? cape.url.substring(0, 100) + '...' : 'BRAK');
  console.log('Czas:', (Date.now() - t1) + 'ms');

  console.log('\n=== TEST 3: Generowanie awatara ===');
  const t2 = Date.now();
  r = await fetch(BASE + '/images/avatar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      playerName: 'Kasia',
      avatarConfig: { skinColor: 'light', hairStyle: 'long wavy', hairColor: 'red' }
    })
  });
  const avatar = await r.json();
  console.log('Status:', r.status, avatar.ok ? 'OK' : 'FAIL');
  console.log('URL:', avatar.url ? avatar.url.substring(0, 100) + '...' : 'BRAK');
  console.log('Czas:', (Date.now() - t2) + 'ms');

  console.log('\n=== TEST 4: Generowanie tla krainy (Las Decyzji) ===');
  const t3 = Date.now();
  r = await fetch(BASE + '/images/land', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ landName: 'las_decyzji' })
  });
  const land = await r.json();
  console.log('Status:', r.status, land.ok ? 'OK' : 'FAIL');
  console.log('URL:', land.url ? land.url.substring(0, 100) + '...' : 'BRAK');
  console.log('Czas:', (Date.now() - t3) + 'ms');

  console.log('\n=== TEST 5: Karta bohatera ===');
  const t4 = Date.now();
  r = await fetch(BASE + '/images/hero-card', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      playerName: 'Kasia',
      hybridTitle: 'Odkrywca Serc',
      equipment: ['green_cape', 'crystal_heart', 'wisdom_book']
    })
  });
  const hero = await r.json();
  console.log('Status:', r.status, hero.ok ? 'OK' : 'FAIL');
  console.log('URL:', hero.url ? hero.url.substring(0, 100) + '...' : 'BRAK');
  console.log('Czas:', (Date.now() - t4) + 'ms');

  console.log('\n=== PODSUMOWANIE ===');
  console.log('Peleryna:', cape.url ? 'OK' : 'FAIL');
  console.log('Awatar:', avatar.url ? 'OK' : 'FAIL');
  console.log('Tlo krainy:', land.url ? 'OK' : 'FAIL');
  console.log('Karta bohatera:', hero.url ? 'OK' : 'FAIL');
}

testPipeline().catch(e => console.error('BLAD:', e.message));
