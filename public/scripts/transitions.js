import { gsap } from 'https://cdn.skypack.dev/gsap';
import { ScrollTrigger } from 'https://cdn.skypack.dev/gsap/ScrollTrigger';
import { QuantumParticles } from './public/scripts/particles.js';
import { ColorHarmonyEngine } from './puclic/scripts/color-inheritance.js';
import { WormholeEngine } from './public/scripts/wormholes.js';

export class TransitionEngine {
  constructor() {
    this.particleSystem = new QuantumParticles();
    this.colorEngine = new ColorHarmonyEngine(this.particleSystem.particles);
    this.wormhole = new WormholeEngine(this.particleSystem.scene);
    this.scrollVelocity = 0;
    this.lastScrollY = window.scrollY;
    this.lastUpdate = Date.now();
    this.rafPending = false;
  }

  init() {
    this.initGSAP();
    this.initScrollTracking();
    this.createParallaxLayers();
    this.handleTripleTap();
    this.handleMobileTouch();
    return this;
  }

  initGSAP() {
    gsap.registerPlugin(ScrollTrigger);
    
    // Logo hologram effect
    gsap.to("#neuro-logo", {
      scrollTrigger: {
        scrub: 0.5,
        start: "top center",
        end: "bottom center"
      },
      opacity: 0.8,
      y: "-=20vh",
      filter: "hue-rotate(180deg)",
      transformOrigin: "50% 50%"
    });

    // Nav button emergence
    gsap.from(".nav-btn", {
      scrollTrigger: {
        trigger: "body",
        start: "top 80%",
        end: "top 30%",
        scrub: 0.5
      },
      opacity: 0,
      y: 50,
      stagger: 0.1,
      ease: "power4.out"
    });
  }

  initScrollTracking() {
    const updateScroll = () => {
      const currentY = window.scrollY;
      const deltaTime = Date.now() - this.lastUpdate;
      this.scrollVelocity = Math.abs(currentY - this.lastScrollY) / deltaTime * 1000;
      this.lastScrollY = currentY;
      this.lastUpdate = Date.now();
      
      if(!this.rafPending) {
        this.rafPending = true;
        requestAnimationFrame(() => {
          this.particleSystem.animate(this.scrollVelocity);
          this.colorEngine.update(this.scrollVelocity);
          this.rafPending = false;
        });
      }
    };
    
    window.addEventListener('scroll', updateScroll);
  }

  createParallaxLayers() {
    const layerContainer = document.createElement('div');
    layerContainer.className = 'parallax-engine';
    
    // Generate 5 unique parallax layers
    const layerConfigs = [
      { id: 1, gradientPos: '10% 20%', blur: 0.5 },
      { id: 2, gradientPos: '90% 80%', blur: 1.0 },
      { id: 3, gradientPos: '50% 30%', blur: 1.5 },
      { id: 4, gradientPos: '30% 50%', blur: 2.0 },
      { id: 5, gradientPos: '70% 50%', blur: 2.5 }
    ];

    layerConfigs.forEach(config => {
      const layer = document.createElement('div');
      layer.className = `parallax-layer`;
      layer.style.cssText = `
        background-image: radial-gradient(circle at ${config.gradientPos}, 
          rgba(var(--primary-rgb), 0.1), 
          transparent 70%);
        filter: blur(${config.blur}px);
      `;
      layerContainer.appendChild(layer);
    });

    document.body.prepend(layerContainer);

    // Animate layers with staggered delays
    gsap.utils.toArray('.parallax-layer').forEach((layer, index) => {
      gsap.to(layer, {
        scrollTrigger: {
          scrub: 0.5,
          start: "top bottom",
          end: "bottom top"
        },
        y: `-=${index * 40}vh`,
        rotation: index % 2 === 0 ? 0.5 : -0.5,
        ease: "power1.inOut",
        delay: index * 0.1
      });
    });
  }

  handleTripleTap() {
    let tapHistory = [];
    
    const processTap = (e) => {
      const now = performance.now();
      tapHistory = tapHistory.filter(t => now - t < 500);
      tapHistory.push(now);
      
      if(tapHistory.length >= 3) {
        this.colorEngine.cyclePalette();
        this.wormhole.generateNewVortex();
        tapHistory = [];
        this.particleSystem.resetParticles();
      }
    };

    document.addEventListener('touchstart', processTap);
    document.addEventListener('click', processTap);
  }

  handleMobileTouch() {
    let lastTouchY = 0;
    
    document.addEventListener('touchmove', (e) => {
      const deltaY = e.touches[0].clientY - lastTouchY;
      lastTouchY = e.touches[0].clientY;
      this.particleSystem.particles.rotation.z += deltaY * 0.001;
    }, { passive: true });
  }
}
