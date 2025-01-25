import * as THREE from 'https://cdn.skypack.dev/three@0.136.0';

export class QuantumParticles {
  constructor() {
    this.canvas = document.getElementById('quantum-particle-canvas');
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      powerPreference: "high-performance",
      antialias: window.devicePixelRatio < 2,
      alpha: true
    });
    
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, 
      window.innerWidth/window.innerHeight, 0.1, 1000);
    this.camera.position.z = 5;
    
    this.particleGeometry = this.createGeometry();
    this.particleMaterial = this.createMaterial();
    this.particles = new THREE.Points(this.particleGeometry, this.particleMaterial);
    this.scene.add(this.particles);
    
    this.originalPositions = new Float32Array(
      this.particleGeometry.attributes.position.array
    );

    // Resize handler setup
    window.addEventListener('resize', () => this.handleResize());
    this.handleResize();
  }

  handleResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  createGeometry() {
    const count = window.matchMedia("(max-width: 768px)").matches ? 7500 : 15000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for(let i = 0; i < positions.length; i += 3) {
      positions[i] = (Math.random() - 0.5) * 10;
      positions[i+1] = (Math.random() - 0.5) * 10;
      positions[i+2] = (Math.random() - 0.5) * 10;
      
      colors[i] = 0.0;   // R
      colors[i+1] = 0.97; // G
      colors[i+2] = 1.0;  // B
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return geometry;
  }

  createMaterial() {
    return new THREE.PointsMaterial({
      size: 0.15,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      transparent: true,
      opacity: 0.9,
      depthTest: false
    });
  }

  animate(velocity = 0) {
    const positions = this.particleGeometry.attributes.position.array;
    const noiseFactor = Math.min(velocity * 0.0003, 1.5);
    
    for(let i = 0; i < positions.length; i += 3) {
      positions[i] += (Math.random() - 0.5) * noiseFactor;
      positions[i+1] += (Math.random() - 0.5) * noiseFactor;
      positions[i+2] += (Math.random() - 0.5) * noiseFactor;
    }
    
    this.particleGeometry.attributes.position.needsUpdate = true;
    this.particles.rotation.x += velocity * 0.0001;
    this.particles.rotation.y += velocity * 0.00015;
    
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(() => this.animate(velocity));
  }

  resetParticles() {
    this.particleGeometry.setAttribute('position',
      new THREE.BufferAttribute(this.originalPositions, 3));
    this.particleGeometry.attributes.position.needsUpdate = true;
  }
}