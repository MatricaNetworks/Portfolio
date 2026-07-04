// Particle Network Background using Three.js
const initThreeJS = () => {
    const container = document.getElementById('canvas-container');
    if (!container) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050510, 0.0015);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 3000);
    // Base camera position will be updated by scroll
    camera.position.set(0, 50, 350);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: "high-performance" });
    renderer.setSize(window.innerWidth, window.innerHeight);
    const isMobile = window.innerWidth < 768;
    renderer.setPixelRatio(isMobile ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ReinhardToneMapping;
    container.appendChild(renderer.domElement);

    // --- Post-Processing (Neon Bloom) ---
    const renderScene = new THREE.RenderPass(scene, camera);
    const bloomPass = new THREE.UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight), 
        1.5, 0.4, 0.85
    );
    bloomPass.threshold = 0.1;
    bloomPass.strength = isMobile ? 1.2 : 1.8; // Lower intensity on mobile
    bloomPass.radius = 0.5;

    const composer = new THREE.EffectComposer(renderer);
    composer.addPass(renderScene);
    if (!isMobile) {
        // Only add expensive bloom pass on desktop to preserve mobile scroll 60fps
        composer.addPass(bloomPass);
    }

    // --- 1. The Central AI Core (AI Theme) ---
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    const coreGeom = new THREE.IcosahedronGeometry(22, 2);
    const coreMat = new THREE.MeshBasicMaterial({
        color: 0x9d00ff, // Purple AI energy
        wireframe: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });
    const aiCore = new THREE.Mesh(coreGeom, coreMat);
    coreGroup.add(aiCore);

    const shellGeom = new THREE.IcosahedronGeometry(30, 1);
    const shellMat = new THREE.MeshBasicMaterial({
        color: 0x00ffff, 
        wireframe: true,
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending
    });
    const aiShell = new THREE.Mesh(shellGeom, shellMat);
    coreGroup.add(aiShell);

    // --- 2. Robotic Gyroscopic Rings (Robotics Theme) ---
    const rings = [];
    for(let i = 0; i < 6; i++) {
        const color = (i % 2 === 0) ? 0x00ffff : 0x7777aa; 
        const ringGeom = new THREE.TorusGeometry(55 + (i * 18), 1.5, 8, 60);
        const ringMat = new THREE.MeshBasicMaterial({
            color: color,
            wireframe: true,
            transparent: true,
            opacity: 0.35 + (i * 0.05)
        });
        const ring = new THREE.Mesh(ringGeom, ringMat);
        
        ring.rotation.x = Math.random() * Math.PI;
        ring.rotation.y = Math.random() * Math.PI;
        
        coreGroup.add(ring);
        rings.push({
            mesh: ring,
            speedX: (Math.random() - 0.5) * 0.02,
            speedY: (Math.random() - 0.5) * 0.02,
            speedZ: (Math.random() - 0.5) * 0.02
        });
    }

    // --- 3. Hacker Matrix Rain (Cybersecurity/Hacker Theme) ---
    const rainCount = 1500;
    const rainGeo = new THREE.BufferGeometry();
    const rainPositions = new Float32Array(rainCount * 3);
    for(let i = 0; i < rainCount * 3; i += 3) {
        rainPositions[i] = (Math.random() - 0.5) * 2000;     // x
        rainPositions[i + 1] = (Math.random() - 0.5) * 2000; // y
        rainPositions[i + 2] = (Math.random() - 0.5) * 2000; // z
    }
    rainGeo.setAttribute('position', new THREE.BufferAttribute(rainPositions, 3));
    
    const rainCanvas = document.createElement('canvas');
    rainCanvas.width = 16;
    rainCanvas.height = 32;
    const rc = rainCanvas.getContext('2d');
    rc.fillStyle = '#00ff44'; // Hacker Green
    rc.font = '16px monospace';
    rc.fillText('1', 0, 16);
    rc.fillText('0', 0, 32);
    const rainTexture = new THREE.CanvasTexture(rainCanvas);

    const rainMat = new THREE.PointsMaterial({
        color: 0x00ff44,
        size: 8,
        map: rainTexture,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });
    const matrixRain = new THREE.Points(rainGeo, rainMat);
    scene.add(matrixRain);

    // --- 4. Neural Data Particles (Cyberspace) ---
    const particleCount = 350;
    const pGeometry = new THREE.BufferGeometry();
    const pPositions = new Float32Array(particleCount * 3);
    const pOrbit = [];

    for (let i = 0; i < particleCount * 3; i += 3) {
        const radius = 80 + Math.random() * 800;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);
        
        pPositions[i] = radius * Math.sin(phi) * Math.cos(theta);
        pPositions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
        pPositions[i + 2] = radius * Math.cos(phi);

        pOrbit.push({
            radius: radius,
            theta: theta,
            phi: phi,
            speed: (Math.random() * 0.015) + 0.005,
            direction: Math.random() > 0.5 ? 1 : -1
        });
    }
    pGeometry.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));

    const pCanvas = document.createElement('canvas');
    pCanvas.width = 16;
    pCanvas.height = 16;
    const pc = pCanvas.getContext('2d');
    pc.beginPath();
    pc.arc(8, 8, 8, 0, 2 * Math.PI, false);
    pc.fillStyle = '#ffffff';
    pc.fill();
    const pTexture = new THREE.CanvasTexture(pCanvas);

    const pMaterial = new THREE.PointsMaterial({
        color: 0x00ffff,
        size: 3,
        map: pTexture,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });
    const particles = new THREE.Points(pGeometry, pMaterial);
    scene.add(particles);

    const lineMat = new THREE.LineBasicMaterial({
        color: 0x9d00ff,
        transparent: true,
        opacity: 0.25,
        blending: THREE.AdditiveBlending
    });
    const linesMesh = new THREE.LineSegments(new THREE.BufferGeometry(), lineMat);
    scene.add(linesMesh);

    // --- 5. Cyberspace Floor Grid ---
    const gridGeom = new THREE.PlaneGeometry(4000, 4000, 80, 80);
    const gridPositions = gridGeom.attributes.position.array;
    for (let i = 0; i < gridPositions.length; i += 3) {
        gridPositions[i + 2] = (Math.random() - 0.5) * 40; 
    }
    const gridMat = new THREE.LineBasicMaterial({
        color: 0x0066ff,
        transparent: true,
        opacity: 0.2,
        blending: THREE.AdditiveBlending
    });
    const gridFloor = new THREE.LineSegments(new THREE.WireframeGeometry(gridGeom), gridMat);
    gridFloor.rotation.x = -Math.PI / 2;
    gridFloor.position.y = -200;
    scene.add(gridFloor);

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - windowHalfX);
        mouseY = (event.clientY - windowHalfY);
    });

    // Scroll Tracking for 3D Effect
    let scrollY = window.scrollY;
    document.addEventListener('scroll', () => {
        scrollY = window.scrollY;
    });

    // Animation Loop
    let time = 0;
    const animate = () => {
        requestAnimationFrame(animate);
        time += 0.01;

        // --- Scrolling 3D Camera Effect ---
        // Dive into the cyberspace as you scroll down
        const targetScrollZ = 350 - (scrollY * 0.4); 
        // Barrel roll camera slightly on scroll
        const targetScrollRotZ = scrollY * -0.0002; 

        // Apply mouse parallax on top of scroll position
        const targetX = mouseX * 0.2;
        const targetY = mouseY * 0.2;
        
        camera.position.x += (targetX - camera.position.x) * 0.05;
        camera.position.y += (-targetY + 50 - camera.position.y) * 0.05;
        camera.position.z += (targetScrollZ - camera.position.z) * 0.05;
        
        camera.rotation.z += (targetScrollRotZ - camera.rotation.z) * 0.05;
        
        // Ensure camera looks generally forward towards the core, modified by mouse
        camera.lookAt(new THREE.Vector3(mouseX * 0.1, -mouseY * 0.1, -100));

        // --- Animate Hacker Matrix Rain ---
        const rainPosArray = matrixRain.geometry.attributes.position.array;
        for(let i = 0; i < rainCount; i++) {
            rainPosArray[i * 3 + 1] -= 6; // fall speed
            if(rainPosArray[i * 3 + 1] < -1000) {
                rainPosArray[i * 3 + 1] = 1000; // reset at top
            }
        }
        matrixRain.geometry.attributes.position.needsUpdate = true;

        // --- Core Pulsating & Rotation (AI Breathing Effect) ---
        const scale = 1 + Math.sin(time * 2) * 0.08;
        aiCore.scale.set(scale, scale, scale);
        aiCore.rotation.y += 0.02;
        aiCore.rotation.x += 0.01;
        
        aiShell.scale.set(1 + Math.cos(time * 1.5) * 0.04, 1 + Math.cos(time * 1.5) * 0.04, 1 + Math.cos(time * 1.5) * 0.04);
        aiShell.rotation.y -= 0.015;
        aiShell.rotation.z += 0.01;

        // --- Robotic Rings Gyroscopic Motion ---
        rings.forEach((r, idx) => {
            r.mesh.rotation.x += r.speedX;
            r.mesh.rotation.y += r.speedY;
            r.mesh.rotation.z += r.speedZ;
            // React to scroll by spinning faster when diving deeper
            r.mesh.rotation.z += (scrollY * 0.00005 * (idx % 2 === 0 ? 1 : -1));
        });
        
        coreGroup.position.y = Math.sin(time) * 10;
        // Move core forward as you scroll deep so it passes by
        coreGroup.position.z = scrollY * 0.1;

        // --- Orbiting Neural Particles (Data feeding into AI) ---
        const posArray = particles.geometry.attributes.position.array;
        for (let i = 0; i < particleCount; i++) {
            const orb = pOrbit[i];
            orb.theta += orb.speed * orb.direction;
            
            // Constantly pulling data into the core
            orb.radius -= 0.8;
            if (orb.radius < 50) {
                orb.radius = 200 + Math.random() * 600; 
            }

            posArray[i * 3] = orb.radius * Math.sin(orb.phi) * Math.cos(orb.theta) + coreGroup.position.x;
            posArray[i * 3 + 1] = orb.radius * Math.sin(orb.phi) * Math.sin(orb.theta) + coreGroup.position.y;
            posArray[i * 3 + 2] = orb.radius * Math.cos(orb.phi) + coreGroup.position.z;
        }
        particles.geometry.attributes.position.needsUpdate = true;

        // --- Neural Connections ---
        const linePositions = [];
        // Skip intense O(N^2) CPU calculations on mobile to maintain 60fps scrolling
        if (!isMobile) {
            for (let i = 0; i < particleCount; i++) {
                for (let j = i + 1; j < particleCount; j++) {
                    const dx = posArray[i * 3] - posArray[j * 3];
                    const dy = posArray[i * 3 + 1] - posArray[j * 3 + 1];
                    const dz = posArray[i * 3 + 2] - posArray[j * 3 + 2];
                    const distSq = dx*dx + dy*dy + dz*dz;

                    if (distSq < 15000) { 
                        linePositions.push(
                            posArray[i * 3], posArray[i * 3 + 1], posArray[i * 3 + 2],
                            posArray[j * 3], posArray[j * 3 + 1], posArray[j * 3 + 2]
                        );
                    }
                }
            }
        }
        linesMesh.geometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));

        // --- Grid Scrolling ---
        gridFloor.position.z = (time * 40) % 80;

        // Render with Bloom on desktop, fast raw render on mobile
        if (isMobile) {
            renderer.render(scene, camera);
        } else {
            composer.render();
        }
    };

    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        composer.setSize(window.innerWidth, window.innerHeight);
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

// Skills Tab Switching
const initSkillsTabs = () => {
    const tabs = document.querySelectorAll('.skill-tab');
    const panes = document.querySelectorAll('.skill-pane');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.dataset.tab;

            tabs.forEach(t => t.classList.remove('active'));
            panes.forEach(p => p.classList.remove('active'));

            tab.classList.add('active');
            const pane = document.getElementById('tab-' + target);
            if (pane) {
                pane.classList.add('active');
                // Re-trigger chip animations
                pane.querySelectorAll('.chip').forEach(chip => {
                    chip.style.animation = 'none';
                    chip.offsetHeight; // reflow
                    chip.style.animation = '';
                });
            }
        });
    });
};

// Custom Cursor Logic
const initCustomCursor = () => {
    // Disable custom cursor overhead on mobile/touch devices to prevent scroll lag
    if (window.innerWidth < 768 || 'ontouchstart' in window || navigator.maxTouchPoints > 0) {
        document.body.style.cursor = 'auto'; // Restore default behavior
        return;
    }

    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.innerHTML = `
        <div class="cursor-dot"></div>
        <div class="cursor-ring"></div>
        <div class="cursor-crosshair"></div>
    `;
    document.body.appendChild(cursor);

    const updateCursor = (x, y) => {
        cursor.style.transform = `translate(${x}px, ${y}px)`;
    };

    window.addEventListener('mousemove', (e) => {
        updateCursor(e.clientX, e.clientY);
    });

    window.addEventListener('touchmove', (e) => {
        if(e.touches.length > 0) {
            updateCursor(e.touches[0].clientX, e.touches[0].clientY);
        }
    }, {passive: true});

    const addClick = () => cursor.classList.add('clicking');
    const removeClick = () => cursor.classList.remove('clicking');

    window.addEventListener('mousedown', addClick);
    window.addEventListener('mouseup', removeClick);
    window.addEventListener('touchstart', (e) => {
        if(e.touches.length > 0) updateCursor(e.touches[0].clientX, e.touches[0].clientY);
        addClick();
    }, {passive: true});
    window.addEventListener('touchend', removeClick);
};

// Interactive Terminal Logic
const initInteractiveTerminal = () => {
    const input = document.getElementById('interactive-terminal-input');
    const output = document.getElementById('interactive-terminal-output');
    if (!input || !output) return;

    const commands = {
        help: "Available commands:\n  whoami      - Print current user\n  ls          - List directory contents\n  cd <dir>    - Navigate to section (e.g. cd skills)\n  clear       - Clear terminal output\n  sudo        - Execute a command as superuser\n  contact     - Display contact info",
        whoami: "suyog_l",
        ls: "about  experience  skills  achievements  education",
        contact: "Email: suyogln26@gmail.com\nWebsite: https://www.matricanetworks.com",
        sudo: "suyog_l is not in the sudoers file. This incident will be reported."
    };

    const processCommand = (cmd) => {
        const parts = cmd.trim().toLowerCase().split(' ');
        const baseCmd = parts[0];

        if (baseCmd === 'clear') {
            output.innerHTML = '';
            return;
        }

        let response = '';
        if (baseCmd === 'cd') {
            if (parts.length > 1) {
                const target = parts[1];
                const section = document.getElementById(target);
                if (section) {
                    response = `Navigating to /${target}...`;
                    setTimeout(() => {
                        window.scrollTo({
                            top: section.offsetTop - 80,
                            behavior: 'smooth'
                        });
                    }, 500);
                } else {
                    response = `bash: cd: ${target}: No such file or directory`;
                }
            } else {
                response = 'bash: cd: missing operand';
            }
        } else if (commands[baseCmd]) {
            response = commands[baseCmd];
        } else if (baseCmd !== '') {
            response = `bash: ${baseCmd}: command not found`;
        }

        if (baseCmd !== 'clear' && cmd.trim() !== '') {
            output.innerHTML += `<div style="color: #00ff44;">root@psychyverse:~# ${cmd}</div>`;
            if (response) {
                output.innerHTML += `<div>${response}</div>`;
            }
        }
        
        // Auto scroll to bottom
        output.scrollTop = output.scrollHeight;
    };

    const terminalWindow = document.querySelector('.terminal-window');
    if (terminalWindow) {
        terminalWindow.addEventListener('click', () => {
            input.focus();
        });
    }

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.keyCode === 13) {
            e.preventDefault();
            const cmd = input.value;
            input.value = '';
            processCommand(cmd);
        }
    });
};

// Typewriter Effect for Hero Section
const initTypewriterEffect = () => {
    const roles = ["Hacking", "sysadmin", "developer", "Networking", "security", "database", "devops", "Cloud"];
    const el = document.getElementById('animated-roles');
    if (!el) return;

    let roleIndex = 0;
    let isDeleting = false;
    let text = roles[roleIndex];
    el.innerText = text;

    const type = () => {
        const currentRole = roles[roleIndex];
        
        if (isDeleting) {
            text = currentRole.substring(0, text.length - 1);
        } else {
            text = currentRole.substring(0, text.length + 1);
        }
        
        el.innerText = text;
        let typingSpeed = isDeleting ? 40 : 80;

        if (!isDeleting && text === currentRole) {
            typingSpeed = 1500; // Pause before starting to delete
            isDeleting = true;
        } else if (isDeleting && text === '') {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typingSpeed = 300; // Pause before typing next word
        }

        setTimeout(type, typingSpeed);
    };

    setTimeout(() => {
        isDeleting = true;
        type();
    }, 1500);
};

// Initialize everything when DOM is ready
const initAll = () => {
    try { initThreeJS(); } catch(e) { console.warn('Three.js init failed:', e); }
    try { initScrollAnimations(); } catch(e) { console.warn('Scroll animations failed:', e); }
    try { initSmoothScroll(); } catch(e) { console.warn('Smooth scroll failed:', e); }
    try { initNavbarEffects(); } catch(e) { console.warn('Navbar effects failed:', e); }
    try { initSkillsTabs(); } catch(e) { console.warn('Skills tabs failed:', e); }
    try { initCustomCursor(); } catch(e) { console.warn('Custom cursor failed:', e); }
    try { initInteractiveTerminal(); } catch(e) { console.warn('Interactive terminal failed:', e); }
    try { initTypewriterEffect(); } catch(e) { console.warn('Typewriter effect failed:', e); }
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
} else {
    initAll();
}