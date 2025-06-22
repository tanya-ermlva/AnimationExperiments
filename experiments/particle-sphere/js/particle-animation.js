class ParticleAnimation {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.particles = null;
        this.particleSystem = null;
        this.animationId = null;
        this.startTime = Date.now();
        this.gatherDuration = 60000; // 1 minute in milliseconds (will be updated by slider)
        this.sphereRadius = 2;
        this.particleCount = 3000;
        this.initialPositions = [];
        this.targetPositions = [];
        this.currentPositions = [];
        this.chaosFactors = []; // Store individual chaos factors for each particle
        this.chaosIntensity = 0.8; // Initial chaos intensity
        this.chaosDecayRate = 0.02; // How fast chaos decreases
        
        this.init();
        this.setupDurationControl();
        this.animate();
    }
    
    init() {
        // Create scene
        this.scene = new THREE.Scene();
        
        // Create camera with optimized settings for mobile
        this.camera = new THREE.PerspectiveCamera(
            75, 
            400 / 900, 
            0.1, 
            1000
        );
        this.camera.position.z = 8;
        
        // Create renderer with mobile optimizations
        this.renderer = new THREE.WebGLRenderer({
            canvas: document.getElementById('particle-canvas'),
            antialias: false, // Disable antialiasing for performance
            alpha: false,
            powerPreference: "high-performance"
        });
        this.renderer.setSize(400, 900);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio for mobile
        this.renderer.setClearColor(0x000000, 1);
        
        // Create particles
        this.createParticles();
        
        // Remove ambient light to eliminate glow
        // const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
        // this.scene.add(ambientLight);
    }
    
    setupDurationControl() {
        const durationSlider = document.getElementById('speed-slider');
        const durationValue = document.getElementById('speed-value');
        
        // Format time display helper function
        const formatTime = (seconds) => {
            if (seconds < 60) {
                return `${seconds}s`;
            } else {
                const minutes = Math.floor(seconds / 60);
                const remainingSeconds = seconds % 60;
                return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
            }
        };
        
        // Update duration when slider changes
        durationSlider.addEventListener('input', (e) => {
            const seconds = parseInt(e.target.value);
            this.gatherDuration = seconds * 1000; // Convert to milliseconds
            durationValue.textContent = formatTime(seconds);
        });
        
        // Initialize duration value display (60 seconds = 1 minute)
        durationValue.textContent = formatTime(60);
    }
    
    createParticles() {
        // Create geometry for particles
        const geometry = new THREE.BufferGeometry();
        
        // Initialize arrays for positions, colors, and sizes
        const positions = new Float32Array(this.particleCount * 3);
        const colors = new Float32Array(this.particleCount * 3);
        const sizes = new Float32Array(this.particleCount);
        
        // Generate random initial positions in a larger volume
        for (let i = 0; i < this.particleCount; i++) {
            const i3 = i * 3;
            
            // Random initial positions in a cube
            const x = (Math.random() - 0.5) * 8;
            const y = (Math.random() - 0.5) * 8;
            const z = (Math.random() - 0.5) * 8;
            
            positions[i3] = x;
            positions[i3 + 1] = y;
            positions[i3 + 2] = z;
            
            // Store initial positions
            this.initialPositions.push(new THREE.Vector3(x, y, z));
            
            // Generate Fibonacci sphere distribution for target positions
            // This creates a more uniform distribution than spirals
            const phi = Math.acos(1 - 2 * (i + 0.5) / this.particleCount); // Latitude
            const theta = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5); // Longitude using golden ratio
            
            const targetX = this.sphereRadius * Math.sin(phi) * Math.cos(theta);
            const targetY = this.sphereRadius * Math.cos(phi);
            const targetZ = this.sphereRadius * Math.sin(phi) * Math.sin(theta);
            
            this.targetPositions.push(new THREE.Vector3(targetX, targetY, targetZ));
            this.currentPositions.push(new THREE.Vector3(x, y, z));
            
            // Create unique chaos factors for each particle
            this.chaosFactors.push({
                offset: Math.random() * Math.PI * 2,
                speed: 0.5 + Math.random() * 1.5,
                amplitude: 0.3 + Math.random() * 0.7
            });
            
            // Set varying sizes in a small range
            sizes[i] = 2 + Math.random() * 1; // Sizes 
            
            // Initialize all particles as white FFFFFF (will transition to red then blue during animation)
            colors[i3] = 1.0;     // R - Start with white (FF = 255/255 = 1.0)
            colors[i3 + 1] = 1.0; // G - FF = 255/255 = 1.0
            colors[i3 + 2] = 1.0; // B - FF = 255/255 = 1.0
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        
        // Custom shaders for small circular particles with varying sizes
        const vertexShader = `
            attribute vec3 color;
            attribute float size;
            varying vec3 vColor;
            
            void main() {
                vColor = color;
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                gl_PointSize = size; // Use individual particle size
                gl_Position = projectionMatrix * mvPosition;
            }
        `;
        
        const fragmentShader = `
            varying vec3 vColor;
            
            void main() {
                // Create small circular particles
                vec2 center = gl_PointCoord - vec2(0.5);
                float dist = length(center);
                
                // Hard circular shape
                if (dist > 0.5) {
                    discard;
                }
                
                gl_FragColor = vec4(vColor, 1.0);
            }
        `;
        
        // Create material with custom shaders
        const material = new THREE.ShaderMaterial({
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            transparent: false,
            depthWrite: true
        });
        
        // Create particle system
        this.particleSystem = new THREE.Points(geometry, material);
        this.scene.add(this.particleSystem);
    }
    
    updateParticles() {
        const currentTime = Date.now();
        const elapsed = currentTime - this.startTime;
        const progress = Math.min(elapsed / this.gatherDuration, 1);
        
        // Smooth easing function
        const easedProgress = this.easeInOutCubic(progress);
        
        const positions = this.particleSystem.geometry.attributes.position.array;
        const colors = this.particleSystem.geometry.attributes.color.array;
        
        for (let i = 0; i < this.particleCount; i++) {
            const i3 = i * 3;
            const initial = this.initialPositions[i];
            const target = this.targetPositions[i];
            const chaos = this.chaosFactors[i];
            
            // Calculate chaotic movement that decreases over time
            const chaosIntensity = this.chaosIntensity * Math.max(0, 1 - easedProgress * 2); // Decrease chaos faster
            const time = elapsed * 0.001; // Convert to seconds
            
            // Create chaotic offset based on individual particle properties
            const chaosX = Math.sin(time * chaos.speed + chaos.offset) * 
                          Math.cos(time * chaos.speed * 0.7 + chaos.offset * 1.3) * 
                          chaos.amplitude * chaosIntensity;
            const chaosY = Math.cos(time * chaos.speed * 0.8 + chaos.offset * 0.7) * 
                          Math.sin(time * chaos.speed * 1.2 + chaos.offset * 2.1) * 
                          chaos.amplitude * chaosIntensity;
            const chaosZ = Math.sin(time * chaos.speed * 1.1 + chaos.offset * 1.7) * 
                          Math.cos(time * chaos.speed * 0.9 + chaos.offset * 0.9) * 
                          chaos.amplitude * chaosIntensity;
            
            // Interpolate between initial and target positions with chaotic movement
            const x = initial.x + (target.x - initial.x) * easedProgress + chaosX;
            const y = initial.y + (target.y - initial.y) * easedProgress + chaosY;
            const z = initial.z + (target.z - initial.z) * easedProgress + chaosZ;
            
            positions[i3] = x;
            positions[i3 + 1] = y;
            positions[i3 + 2] = z;
            
            // Update current positions
            this.currentPositions[i].set(x, y, z);
            
            // Interpolate colors from FFFFFF (white) -> red -> blue
            if (easedProgress <= 0.5) {
                // First half: FFFFFF (white) to red
                const firstHalfProgress = easedProgress * 2; // 0 to 1 in first half
                colors[i3] = 1.0;                                    // R: stays at 1.0
                colors[i3 + 1] = 1.0 - firstHalfProgress;            // G: 1.0 -> 0.0
                colors[i3 + 2] = 1.0 - firstHalfProgress;            // B: 1.0 -> 0.0
            } else {
                // Second half: red to blue
                const secondHalfProgress = (easedProgress - 0.5) * 2; // 0 to 1 in second half
                colors[i3] = 1.0 - secondHalfProgress;     // R: 1.0 -> 0.0
                colors[i3 + 1] = 0.0;                      // G: stays at 0.0
                colors[i3 + 2] = secondHalfProgress;       // B: 0.0 -> 1.0
            }
        }
        
        this.particleSystem.geometry.attributes.position.needsUpdate = true;
        this.particleSystem.geometry.attributes.color.needsUpdate = true;
        
        // Rotate the entire particle system from the beginning
        const rotationSpeed = 0.005;
        this.particleSystem.rotation.y += rotationSpeed;
        this.particleSystem.rotation.x += rotationSpeed * 0.3;
    }
    
    easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }
    
    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());
        
        this.updateParticles();
        this.renderer.render(this.scene, this.camera);
    }
    
    dispose() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        if (this.renderer) {
            this.renderer.dispose();
        }
        
        if (this.particleSystem && this.particleSystem.geometry) {
            this.particleSystem.geometry.dispose();
        }
        
        if (this.particleSystem && this.particleSystem.material) {
            this.particleSystem.material.dispose();
        }
    }
}

// Initialize animation when page loads
document.addEventListener('DOMContentLoaded', () => {
    const animation = new ParticleAnimation();
    
    // Handle page visibility changes for mobile optimization
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            // Pause animation when page is not visible
            if (animation.animationId) {
                cancelAnimationFrame(animation.animationId);
                animation.animationId = null;
            }
        } else {
            // Resume animation when page becomes visible
            if (!animation.animationId) {
                animation.animate();
            }
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
        // Only handle resize if needed for responsive design
        // For this fixed-size canvas, we don't need resize handling
    });
}); 