async function debug() {
  const r = await fetch('http://localhost:3001/api/images/equipment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      itemName: 'Golden Compass',
      itemDescription: 'A magical golden compass with blue light'
    })
  });
  const data = await r.json();
  console.log('Full response:');
  console.log(JSON.stringify(data, null, 2));
}
debug().catch(e => console.error(e.message));
