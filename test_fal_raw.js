async function testRaw() {
  const FAL_KEY = '53e6001f-bbd4-4e80-96e5-8ff0b07d353b:486d26b8f3caab0c361d4909726e4f7b';
  const url = 'https://queue.fal.run/fal-ai/flux/schnell';
  
  const body = {
    prompt: 'A magical golden compass with blue light, 3D Pixar claymorphism style, soft clay-like textures, game asset, clean background',
    image_size: 'square_hd',
    num_inference_steps: 4,
    num_images: 1,
    enable_safety_checker: true
  };

  console.log('Sending to fal.ai...');
  console.log('URL:', url);
  
  const r = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': 'Key ' + FAL_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  console.log('Status:', r.status);
  console.log('Headers:', Object.fromEntries(r.headers.entries()));
  
  const data = await r.json();
  console.log('\nFull response keys:', Object.keys(data));
  console.log('Response:');
  console.log(JSON.stringify(data, null, 2).substring(0, 2000));
}
testRaw().catch(e => console.error('Error:', e.message));
