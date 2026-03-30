async function testSync() {
  const FAL_KEY = '53e6001f-bbd4-4e80-96e5-8ff0b07d353b:486d26b8f3caab0c361d4909726e4f7b';
  
  // Test 1: Synchroniczny endpoint (fal.run zamiast queue.fal.run)
  console.log('=== Test synchroniczny (fal.run) ===');
  const url = 'https://fal.run/fal-ai/flux/schnell';
  const body = {
    prompt: 'A golden compass, 3D Pixar style, clean background',
    image_size: 'square_hd',
    num_inference_steps: 4,
    num_images: 1
  };

  const t = Date.now();
  const r = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': 'Key ' + FAL_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  console.log('Status:', r.status);
  const data = await r.json();
  console.log('Czas:', (Date.now() - t) + 'ms');
  console.log('Keys:', Object.keys(data));
  
  if (data.images) {
    console.log('Images count:', data.images.length);
    console.log('Image URL:', data.images[0]?.url?.substring(0, 120));
    console.log('Image size:', data.images[0]?.width, 'x', data.images[0]?.height);
  } else {
    console.log('Full response:', JSON.stringify(data, null, 2).substring(0, 500));
  }
}
testSync().catch(e => console.error('Error:', e.message));
