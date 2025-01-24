import * as THREE from 'https://cdn.skypack.dev/three@0.136.0';

export class WormholeEngine {
  constructor(scene) {
    this.scene = scene;
    this.vortex = null;
    this.isActive = false;
    this.originalCameraPos = new THREE.Vector3();
    this.init();
  }

  init() {
    this.createVortexParticles();
    this.originalCameraPos.copy(this.scene.camera.position);
  }

  createVortexParticles() {
    const geometry = new THREE.BufferGeometry();
    const posArray = new Float32Array(10000 * 3);
    
    for(let i = 0; i < posArray.length; i += 3) {
      const spiral = Math.random() * Math.PI * 2;
      const radius = Math.random() * 5;
      posArray[i] = Math.cos(spiral) * radius;
      posArray[i+1] = (Math.random() - 0.5) * 10;
      posArray[i+2] = Math.sin(spiral) * radius;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    const material = new THREE.PointsMaterial({
      size: 0.2,
      color: 0xFFFFFF,
      blending: THREE.AdditiveBlending,
      transparent: true,
      opacity: 0
    });

    this.vortex = new THREE.Points(geometry, material);
    this.scene.add(this.vortex);
  }

  generateNewVortex() {
    if(this.isActive) return;
    this.isActive = true;
    
    // Camera effect
    gsap.to(this.scene.camera.position, {
      z: 0.1,
      duration: 2,
      ease: "power2.inOut"
    });

    // Vortex activation
    gsap.timeline()
      .to(this.vortex.material, {
        opacity: 0.7,
        duration: 1,
        ease: "power2.out"
      })
      .to(this.vortex.rotation, {
        y: Math.PI * 2,
        duration: 5,
        repeat: -1,
        ease: "none"
      }, "-=0.5")
      .to(this.vortex.material, {
        opacity: 0,
        duration: 2,
        ease: "power2.in",
        onComplete: () => {
          this.isActive = false;
          this.scene.camera.position.copy(this.originalCameraPos);
        }
      }, "+=2");
  }
}