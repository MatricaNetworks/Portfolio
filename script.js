// Particle Network Background using Three.js
const initThreeJS = () => {
    const container = document.getElementById('canvas-container');
    if (!container) return;

    const scene = new THREE.Scene();
    
    // Cyberpunk fog
    scene.fog = new THREE.FogExp2(0x070714, 0.0015);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 180;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // optimize performance
    container.appendChild(renderer.domElement);

    // Particles setup
    const particleCount = 250;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = [];

    for (let i = 0; i < particleCount * 3; i += 3) {
        // Spread particles in a wider box
        positions[i] = (Math.random() - 0.5) * 600;     // x
        positions[i + 1] = (Math.random() - 0.5) * 600; // y
        positions[i + 2] = (Math.random() - 0.5) * 400; // z

        velocities.push({
            x: (Math.random() - 0.5) * 0.4,
            y: (Math.random() - 0.5) * 0.4,
            z: (Math.random() - 0.5) * 0.4
        });
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Custom circular particle texture (optional but looks better)
    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;
    const context = canvas.getContext('2d');
    context.beginPath();
    context.arc(8, 8, 8, 0, 2 * Math.PI, false);
    context.fillStyle = '#ffffff';
    context.fill();
    const texture = new THREE.CanvasTexture(canvas);

    const material = new THREE.PointsMaterial({
        color: 0x00ffff, // Cyan
        size: 3,
        map: texture,
        transparent: true,
        opacity: 0.8,
        alphaTest: 0.1,
        blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Lines for network effect
    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x9d00ff, // Purple
        transparent: true,
        opacity: 0.15,
        blending: THREE.AdditiveBlending
    });

    const linesMesh = new THREE.LineSegments(new THREE.BufferGeometry(), lineMaterial);
    scene.add(linesMesh);

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - windowHalfX);
        mouseY = (event.clientY - windowHalfY);
    });

    // Animation Loop
    const animate = () => {
        requestAnimationFrame(animate);

        // Smooth camera movement (parallax)
        targetX = mouseX * 0.08;
        targetY = mouseY * 0.08;
        camera.position.x += (targetX - camera.position.x) * 0.05;
        camera.position.y += (-targetY - camera.position.y) * 0.05;
        camera.lookAt(scene.position);

        const positions = particles.geometry.attributes.position.array;
        
        // Update particle positions
        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] += velocities[i].x;
            positions[i * 3 + 1] += velocities[i].y;
            positions[i * 3 + 2] += velocities[i].z;

            // Bounce off edges
            if (positions[i * 3] < -300 || positions[i * 3] > 300) velocities[i].x *= -1;
            if (positions[i * 3 + 1] < -300 || positions[i * 3 + 1] > 300) velocities[i].y *= -1;
            if (positions[i * 3 + 2] < -200 || positions[i * 3 + 2] > 200) velocities[i].z *= -1;
        }
        particles.geometry.attributes.position.needsUpdate = true;

        // Dynamic lines based on proximity
        const linePositions = [];
        for (let i = 0; i < particleCount; i++) {
            for (let j = i + 1; j < particleCount; j++) {
                const dx = positions[i * 3] - positions[j * 3];
                const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
                const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
                const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

                // If particles are close, draw a line between them
                if (dist < 60) {
                    linePositions.push(
                        positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2],
                        positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2]
                    );
                }
            }
        }
        linesMesh.geometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));

        // Slowly rotate scene
        scene.rotation.y += 0.0005;
        scene.rotation.x += 0.0002;

        renderer.render(scene, camera);
    };

    animate();

    // Handle Window Resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
};

// Intersection Observer for scroll animations
const initScrollAnimations = () => {
    const observerOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: stop observing once animated in
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animateElements = document.querySelectorAll('.glass-panel, .section-title, .timeline-item');
    animateElements.forEach(el => {
        el.classList.add('fade-in-element');
        observer.observe(el);
    });
};

// Smooth Scrolling for Navigation Links
const initSmoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
};

// Dynamic Navbar Background on Scroll
const initNavbarEffects = () => {
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(3, 3, 5, 0.9)';
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.5)';
        } else {
            navbar.style.background = 'rgba(3, 3, 5, 0.7)';
            navbar.style.boxShadow = 'none';
        }
    });
};

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initThreeJS();
    initScrollAnimations();
    initSmoothScroll();
    initNavbarEffects();
});