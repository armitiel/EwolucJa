const { execSync } = require('child_process');
const msg = `Add AI image generation (fal.ai), land transitions and agent system integration

- Add falService.js: fal.ai integration for Pixar/claymorphism image generation
- Add /api/images endpoints: avatar, land backgrounds, hero cards, equipment
- Add LandTransition component: animated splash screens between game lands
- Add AvatarAI component: progressive enhancement SVG -> AI generated images  
- Add animations.css: fadeSlideUp, bounceIn, float, shimmer effects
- Extend GameOrchestrator: generateAvatarImage, finalizeGameWithImage pipelines
- Extend agentAPI: fal.ai image generation methods for frontend
- Update App.jsx: dynamic backgrounds, land transitions, themed card styling
- Fix Polish quote encoding issues in JS strings

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>`;

try {
  process.chdir('C:/Users/DELL/EwolucJA');
  const result = execSync('git commit -m "' + msg.replace(/"/g, '\\"') + '"', { encoding: 'utf8' });
  console.log(result);
} catch(e) {
  console.log('stdout:', e.stdout);
  console.log('stderr:', e.stderr);
}
