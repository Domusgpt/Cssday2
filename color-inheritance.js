export class ColorHarmonyEngine {
  constructor(particles) {
    this.particles = particles;
    this.palettes = [
      { 
        primary: '#00f7ff', 
        accent: '#ff00ff',
        gradients: [
          'radial-gradient(circle at 10% 20%, rgba(0, 247, 255, 0.15) 0%, transparent 60%)',
          'linear-gradient(45deg, transparent 0%, rgba(255, 0, 255, 0.1) 50%, transparent 100%)'
        ]
      },
      {
        primary: '#00d1d1',
        accent: '#d600d6',
        gradients: [
          'repeating-conic-gradient(from 45deg, rgba(0, 209, 209, 0.1) 0deg 10deg, transparent 10deg 20deg)',
          'radial-gradient(circle at 90% 80%, rgba(214, 0, 214, 0.12) 0%, transparent 70%)'
        ]
      }
    ];
    this.currentPalette = 0;
  }

  cyclePalette() {
    this.currentPalette = (this.currentPalette + 1) % this.palettes.length;
    this.applyPalette();
  }

  applyPalette() {
    const palette = this.palettes[this.currentPalette];
    
    // Update CSS
    document.documentElement.style.setProperty('--primary', palette.primary);
    document.documentElement.style.setProperty('--accent', palette.accent);
    
    // Update Three.js
    this.particles.material.color.set(palette.primary);
    this.particles.material.needsUpdate = true;
    
    // Update parallax gradients
    document.querySelectorAll('.parallax-layer').forEach((layer, index) => {
      layer.style.backgroundImage = palette.gradients[index % palette.gradients.length];
    });
  }

  update(velocity) {
    const hueShift = velocity * 0.01 % 360;
    this.particles.material.color.offsetHSL(hueShift/360, 0, 0);
  }
}