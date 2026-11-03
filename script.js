// Particle Network Background using Three.js (Optimized for Mobile, Tablet & Desktop)
const initThreeJS = () => {
    const container = document.getElementById('canvas-container');
    if (!container || typeof THREE === 'undefined') return;

    // Detect touch / tablet / mobile devices
    const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    const isMobileOrTablet = isTouch || window.innerWidth <= 1024;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050510, 0.0015);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 3000);
    camera.position.set(0, 50, 350);

    const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: !isMobileOrTablet,
        powerPreference: isMobileOrTablet ? "low-power" : "high-performance",
        precision: isMobileOrTablet ? "mediump" : "highp",
        stencil: false,
        depth: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Keep pixelRatio at 1.0 on mobile/tablet to eliminate 4K framebuffer overdraw and ensure smooth 60-120fps
    const maxPixelRatio = isMobileOrTablet ? 1.0 : Math.min(window.devicePixelRatio || 1, 1.5);
    renderer.setPixelRatio(maxPixelRatio);
    renderer.toneMapping = THREE.ReinhardToneMapping;
    container.appendChild(renderer.domElement);

    // Post-Processing (Neon Bloom) - Only active on desktop GPUs to guarantee mobile & tablet scroll smoothness
    let composer = null;
    if (!isMobileOrTablet && typeof THREE.EffectComposer !== 'undefined' && typeof THREE.UnrealBloomPass !== 'undefined') {
        try {
            const renderScene = new THREE.RenderPass(scene, camera);
            const bloomPass = new THREE.UnrealBloomPass(
                new THREE.Vector2(window.innerWidth, window.innerHeight), 
                1.6, 0.4, 0.85
            );
            bloomPass.threshold = 0.1;
            bloomPass.radius = 0.5;

            composer = new THREE.EffectComposer(renderer);
            composer.addPass(renderScene);
            composer.addPass(bloomPass);
        } catch (e) {
            console.warn('EffectComposer fallback to standard renderer:', e);
            composer = null;
        }
    }

    // --- 1. The Central AI Core (AI Theme) ---
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    const coreGeom = new THREE.IcosahedronGeometry(22, isMobileOrTablet ? 1 : 2);
    const coreMat = new THREE.MeshBasicMaterial({
        color: 0x9d00ff,
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
    const ringCount = isMobileOrTablet ? 3 : 6;
    for(let i = 0; i < ringCount; i++) {
        const color = (i % 2 === 0) ? 0x00ffff : 0x7777aa; 
        const tubularSegments = isMobileOrTablet ? 32 : 54;
        const ringGeom = new THREE.TorusGeometry(55 + (i * 20), 1.5, 6, tubularSegments);
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
            speedX: (Math.random() - 0.5) * 0.015,
            speedY: (Math.random() - 0.5) * 0.015,
            speedZ: (Math.random() - 0.5) * 0.015
        });
    }

    // --- 3. Hacker Matrix Rain (Cybersecurity/Hacker Theme) ---
    const rainCount = isMobileOrTablet ? 350 : 1200;
    const rainGeo = new THREE.BufferGeometry();
    const rainPositions = new Float32Array(rainCount * 3);
    for(let i = 0; i < rainCount * 3; i += 3) {
        rainPositions[i] = (Math.random() - 0.5) * 2000;
        rainPositions[i + 1] = (Math.random() - 0.5) * 2000;
        rainPositions[i + 2] = (Math.random() - 0.5) * 2000;
    }
    rainGeo.setAttribute('position', new THREE.BufferAttribute(rainPositions, 3));
    
    const rainCanvas = document.createElement('canvas');
    rainCanvas.width = 16;
    rainCanvas.height = 32;
    const rc = rainCanvas.getContext('2d');
    rc.fillStyle = '#00ff44';
    rc.font = '16px monospace';
    rc.fillText('1', 0, 16);
    rc.fillText('0', 0, 32);
    const rainTexture = new THREE.CanvasTexture(rainCanvas);

    const rainMat = new THREE.PointsMaterial({
        color: 0x00ff44,
        size: isMobileOrTablet ? 7 : 8,
        map: rainTexture,
        transparent: true,
        opacity: 0.65,
        blending: THREE.AdditiveBlending
    });
    const matrixRain = new THREE.Points(rainGeo, rainMat);
    scene.add(matrixRain);

    // --- 4. Neural Data Particles (Cyberspace) ---
    const particleCount = isMobileOrTablet ? 120 : 320;
    const pGeometry = new THREE.BufferGeometry();
    const pPositions = new Float32Array(particleCount * 3);
    const pOrbit = [];

    for (let i = 0; i < particleCount * 3; i += 3) {
        const radius = 80 + Math.random() * 700;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);
        
        pPositions[i] = radius * Math.sin(phi) * Math.cos(theta);
        pPositions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
        pPositions[i + 2] = radius * Math.cos(phi);

        pOrbit.push({
            radius: radius,
            theta: theta,
            phi: phi,
            speed: (Math.random() * 0.012) + 0.004,
            direction: Math.random() > 0.5 ? 1 : -1
        });
    }
    pGeometry.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));

    const pCanvas = document.createElement('canvas');
    pCanvas.width = 16;
    pCanvas.height = 16;
    const pc = pCanvas.getContext('2d');
    pc.beginPath();
    pc.arc(8, 8, 7, 0, 2 * Math.PI, false);
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

    // Neural connections line segments (only on desktop to preserve 60-120fps on touch devices)
    let linesMesh = null;
    if (!isMobileOrTablet) {
        const lineMat = new THREE.LineBasicMaterial({
            color: 0x9d00ff,
            transparent: true,
            opacity: 0.25,
            blending: THREE.AdditiveBlending
        });
        linesMesh = new THREE.LineSegments(new THREE.BufferGeometry(), lineMat);
        scene.add(linesMesh);
    }

    // --- 5. Cyberspace Floor Grid ---
    const gridSegs = isMobileOrTablet ? 24 : 60;
    const gridGeom = new THREE.PlaneGeometry(4000, 4000, gridSegs, gridSegs);
    const gridPositions = gridGeom.attributes.position.array;
    for (let i = 0; i < gridPositions.length; i += 3) {
        gridPositions[i + 2] = (Math.random() - 0.5) * 35; 
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

    // Mouse & Touch Parallax Interaction
    let mouseX = 0;
    let mouseY = 0;
    let windowHalfX = window.innerWidth / 2;
    let windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - windowHalfX);
        mouseY = (event.clientY - windowHalfY);
    }, { passive: true });

    window.addEventListener('touchmove', (event) => {
        if (event.touches.length > 0) {
            mouseX = (event.touches[0].clientX - windowHalfX) * 0.35;
            mouseY = (event.touches[0].clientY - windowHalfY) * 0.35;
        }
    }, { passive: true });

    window.addEventListener('touchend', () => {
        mouseX *= 0.5;
        mouseY *= 0.5;
    }, { passive: true });

    // Scroll Tracking with passive listener
    let scrollY = window.scrollY || window.pageYOffset || 0;
    window.addEventListener('scroll', () => {
        scrollY = window.scrollY || window.pageYOffset || 0;
    }, { passive: true });

    // Page Visibility handling (pause loop when tab/screen is inactive to save battery and reduce heat)
    let isPageActive = !document.hidden;
    document.addEventListener('visibilitychange', () => {
        isPageActive = !document.hidden;
        if (isPageActive) {
            requestAnimationFrame(animate);
        }
    });

    // Animation Loop
    let time = 0;
    const animate = () => {
        if (!isPageActive) return;
        requestAnimationFrame(animate);
        time += 0.01;

        // --- Scrolling 3D Camera Effect ---
        const targetScrollZ = Math.max(-1200, 350 - (scrollY * 0.35)); 
        const targetScrollRotZ = Math.max(-0.15, Math.min(0.15, scrollY * -0.00012)); 

        const targetX = mouseX * 0.15;
        const targetY = mouseY * 0.15;
        
        camera.position.x += (targetX - camera.position.x) * 0.05;
        camera.position.y += (-targetY + 50 - camera.position.y) * 0.05;
        camera.position.z += (targetScrollZ - camera.position.z) * 0.05;
        camera.rotation.z += (targetScrollRotZ - camera.rotation.z) * 0.05;
        
        camera.lookAt(new THREE.Vector3(mouseX * 0.06, -mouseY * 0.06, -100));

        // --- Animate Hacker Matrix Rain ---
        const rainPosArray = matrixRain.geometry.attributes.position.array;
        for(let i = 0; i < rainCount; i++) {
            rainPosArray[i * 3 + 1] -= 6;
            if(rainPosArray[i * 3 + 1] < -1000) {
                rainPosArray[i * 3 + 1] = 1000;
            }
        }
        matrixRain.geometry.attributes.position.needsUpdate = true;

        // --- Core Pulsating & Rotation ---
        const scale = 1 + Math.sin(time * 2) * 0.07;
        aiCore.scale.set(scale, scale, scale);
        aiCore.rotation.y += 0.018;
        aiCore.rotation.x += 0.009;
        
        const shellScale = 1 + Math.cos(time * 1.5) * 0.04;
        aiShell.scale.set(shellScale, shellScale, shellScale);
        aiShell.rotation.y -= 0.012;
        aiShell.rotation.z += 0.008;

        // --- Robotic Rings Gyroscopic Motion ---
        rings.forEach((r, idx) => {
            r.mesh.rotation.x += r.speedX;
            r.mesh.rotation.y += r.speedY;
            r.mesh.rotation.z += r.speedZ + (scrollY * 0.00004 * (idx % 2 === 0 ? 1 : -1));
        });
        
        coreGroup.position.y = Math.sin(time) * 8;
        coreGroup.position.z = Math.min(600, scrollY * 0.1);

        // --- Orbiting Neural Particles ---
        const posArray = particles.geometry.attributes.position.array;
        for (let i = 0; i < particleCount; i++) {
            const orb = pOrbit[i];
            orb.theta += orb.speed * orb.direction;
            orb.radius -= 0.7;
            if (orb.radius < 50) {
                orb.radius = 200 + Math.random() * 550; 
            }

            posArray[i * 3] = orb.radius * Math.sin(orb.phi) * Math.cos(orb.theta) + coreGroup.position.x;
            posArray[i * 3 + 1] = orb.radius * Math.sin(orb.phi) * Math.sin(orb.theta) + coreGroup.position.y;
            posArray[i * 3 + 2] = orb.radius * Math.cos(orb.phi) + coreGroup.position.z;
        }
        particles.geometry.attributes.position.needsUpdate = true;

        // --- Neural Connections (Desktop only) ---
        if (linesMesh && !isMobileOrTablet) {
            const linePositions = [];
            for (let i = 0; i < particleCount; i++) {
                for (let j = i + 1; j < particleCount; j++) {
                    const dx = posArray[i * 3] - posArray[j * 3];
                    const dy = posArray[i * 3 + 1] - posArray[j * 3 + 1];
                    const dz = posArray[i * 3 + 2] - posArray[j * 3 + 2];
                    const distSq = dx * dx + dy * dy + dz * dz;

                    if (distSq < 15000) { 
                        linePositions.push(
                            posArray[i * 3], posArray[i * 3 + 1], posArray[i * 3 + 2],
                            posArray[j * 3], posArray[j * 3 + 1], posArray[j * 3 + 2]
                        );
                    }
                }
            }
            linesMesh.geometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
        }

        // --- Grid Scrolling ---
        gridFloor.position.z = (time * 35) % 80;

        // Render pass
        if (composer) {
            composer.render();
        } else {
            renderer.render(scene, camera);
        }
    };

    animate();

    // Debounced and URL-bar-shift-safe Resize Handler
    let lastWidth = window.innerWidth;
    let resizeTimer = null;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            const newWidth = window.innerWidth;
            // Only reallocate WebGL buffers if width actually changed (rotations/resizes)
            // This prevents mobile URL-bar collapses during scrolling from stuttering the render
            if (Math.abs(newWidth - lastWidth) > 30) {
                lastWidth = newWidth;
                windowHalfX = window.innerWidth / 2;
                windowHalfY = window.innerHeight / 2;
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
                if (composer) {
                    composer.setSize(window.innerWidth, window.innerHeight);
                }
            }
        }, 120);
    }, { passive: true });
};

// Intersection Observer for scroll animations (Unobserves once visible to save CPU on mobile)
const initScrollAnimations = () => {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -30px 0px"
    };

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Stop observing once element has animated in
                obs.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animateElements = document.querySelectorAll('.glass-panel, .section-title, .timeline-item');
    animateElements.forEach(el => {
        el.classList.add('fade-in-element');
        observer.observe(el);
    });
};

// Smooth Scrolling for Navigation Links with Navbar Offset Compensation
const initSmoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (!targetId || targetId === '#' || targetId.length < 2) return;
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                const navHeight = 75; // Account for fixed status ticker + navbar
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - navHeight;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Auto close mobile drawer if open
                const navLinks = document.querySelector('.nav-links');
                const navToggle = document.getElementById('nav-toggle');
                if (navLinks && navLinks.classList.contains('nav-open')) {
                    navLinks.classList.remove('nav-open');
                    if (navToggle) navToggle.classList.remove('active');
                }
            }
        });
    });
};

// Mobile Navigation Toggle Logic
const initMobileNav = () => {
    const toggle = document.getElementById('nav-toggle');
    const links = document.querySelector('.nav-links');
    if (!toggle || !links) return;

    toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = links.classList.toggle('nav-open');
        toggle.classList.toggle('active', isOpen);
    });

    // Close when tapping outside the mobile menu
    document.addEventListener('click', (e) => {
        if (!links.contains(e.target) && !toggle.contains(e.target) && links.classList.contains('nav-open')) {
            links.classList.remove('nav-open');
            toggle.classList.remove('active');
        }
    }, { passive: true });
};

// Dynamic Navbar Background on Scroll (Using class toggle to eliminate style thrashing)
const initNavbarEffects = () => {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    let isScrolled = false;
    const updateNavbar = () => {
        const shouldBeScrolled = (window.scrollY || window.pageYOffset || 0) > 40;
        if (shouldBeScrolled !== isScrolled) {
            isScrolled = shouldBeScrolled;
            navbar.classList.toggle('scrolled', isScrolled);
        }
    };

    window.addEventListener('scroll', updateNavbar, { passive: true });
    updateNavbar();
};

// Skills Tab Switching (Batched single reflow to avoid micro-stutter on mobile)
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
                // Batch reflow: reset animations and trigger one single layout reflow on container
                const chips = pane.querySelectorAll('.chip');
                chips.forEach(chip => { chip.style.animation = 'none'; });
                void pane.offsetHeight; // Single container reflow
                chips.forEach(chip => { chip.style.animation = ''; });
            }
        });
    });
};

// Custom Cursor Logic (Disabled on touch & tablet devices to eliminate scroll lag & overhead)
const initCustomCursor = () => {
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || window.innerWidth <= 1024;
    if (isTouchDevice) {
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

    let rafId = null;
    let targetX = 0;
    let targetY = 0;

    const renderCursor = () => {
        cursor.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`;
        rafId = null;
    };

    window.addEventListener('mousemove', (e) => {
        targetX = e.clientX;
        targetY = e.clientY;
        if (!rafId) {
            rafId = requestAnimationFrame(renderCursor);
        }
    }, { passive: true });

    const addClick = () => cursor.classList.add('clicking');
    const removeClick = () => cursor.classList.remove('clicking');

    window.addEventListener('mousedown', addClick, { passive: true });
    window.addEventListener('mouseup', removeClick, { passive: true });
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
                        const navHeight = 75;
                        const elementPosition = section.getBoundingClientRect().top;
                        const offsetPosition = elementPosition + window.pageYOffset - navHeight;
                        window.scrollTo({
                            top: offsetPosition,
                            behavior: 'smooth'
                        });
                    }, 400);
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
    const roles = ["Hacking", "Sysadmin", "Development", "Networking", "Security", "Database", "DevSecOps", "Cloud", "Digital Forensics", "Reverse Engineering", "Blockchain"];
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
            typingSpeed = 1500;
            isDeleting = true;
        } else if (isDeleting && text === '') {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typingSpeed = 300;
        }

        setTimeout(type, typingSpeed);
    };

    setTimeout(() => {
        isDeleting = true;
        type();
    }, 1500);
};

// ==================== ANIME.JS COMPUTER WORLD KINETIC MATRIX ====================
const initAnimeCyberMatrix = () => {
    const gridContainer = document.getElementById('cyber-matrix-nodes');
    const viewport = document.getElementById('cyber-matrix-viewport');
    const core = document.getElementById('cyber-core-visualizer');
    const coreGlyph = document.getElementById('core-glyph');
    const coordEl = document.getElementById('matrix-coord');
    const modeEl = document.getElementById('matrix-active-mode');
    const modeBtns = document.querySelectorAll('.matrix-ctrl-btn');

    if (!gridContainer || !viewport) return;

    // Responsive grid dimensions
    const winWidth = window.innerWidth;
    let cols = winWidth > 1024 ? 24 : (winWidth > 600 ? 16 : 12);
    let rows = winWidth > 1024 ? 10 : (winWidth > 600 ? 8 : 6);
    let totalNodes = cols * rows;

    if (coordEl) {
        coordEl.textContent = `GRID: [${cols}x${rows}] · STAGGER: ELASTIC`;
    }

    gridContainer.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    gridContainer.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
    gridContainer.innerHTML = '';

    const glyphs = ['+', '▪', '01', 'x', '::', 'λ', 'Ψ', '•', '0x', '10', '§'];
    const nodes = [];

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const index = r * cols + c;
            const node = document.createElement('div');
            node.className = 'cyber-node';
            const glyph = glyphs[(c * 3 + r * 7) % glyphs.length];
            node.textContent = glyph;
            node.dataset.index = index;
            node.dataset.col = c;
            node.dataset.row = r;
            node.dataset.defaultGlyph = glyph;
            gridContainer.appendChild(node);
            nodes.push(node);
        }
    }

    let activeMode = 'ripple';

    // Safe Anime.js runner with fallback
    const runAnimation = (params) => {
        if (typeof anime !== 'undefined') {
            return anime(params);
        } else {
            const targets = Array.isArray(params.targets) ? params.targets : Array.from(document.querySelectorAll(params.targets));
            const duration = params.duration || 600;
            targets.forEach((el, i) => {
                const delay = typeof params.delay === 'function' ? params.delay(el, i, targets.length) : (params.delay || 0);
                setTimeout(() => {
                    el.style.transition = `transform ${duration * 0.5}ms cubic-bezier(0.175, 0.885, 0.32, 1.275), color 0.3s ease`;
                    el.style.transform = 'scale(1.5) rotate(45deg)';
                    el.style.color = '#00ff44';
                    setTimeout(() => {
                        el.style.transform = 'scale(1) rotate(0deg)';
                        el.style.color = '';
                    }, duration * 0.5);
                }, delay);
            });
        }
    };

    // Staggered Entrance Wave (Anime.js Elastic Stagger)
    const playEntranceWave = () => {
        if (typeof anime !== 'undefined') {
            anime({
                targets: '.cyber-node',
                scale: [
                    { value: 0, duration: 0 },
                    { value: 1.5, easing: 'easeOutElastic(1, .5)', duration: 600 },
                    { value: 1, duration: 400 }
                ],
                rotate: [
                    { value: -90, duration: 0 },
                    { value: 0, easing: 'easeOutElastic(1, .5)', duration: 600 }
                ],
                opacity: [
                    { value: 0, duration: 0 },
                    { value: 0.65, duration: 600 }
                ],
                delay: anime.stagger(14, {
                    grid: [cols, rows],
                    from: 'center'
                })
            });
        }
    };

    // Mode 1: Elastic Concentric Ripple
    const triggerRipple = (fromIndex = Math.floor(totalNodes / 2)) => {
        if (typeof anime !== 'undefined') {
            anime({
                targets: '.cyber-node',
                scale: [
                    { value: 0.25, duration: 150, easing: 'easeOutSine' },
                    { value: 1.7, duration: 450, easing: 'easeOutElastic(1, .6)' },
                    { value: 1, duration: 300, easing: 'easeOutSine' }
                ],
                rotate: [
                    { value: 0, duration: 0 },
                    { value: 90, duration: 450, easing: 'easeOutElastic(1, .6)' },
                    { value: 0, duration: 300 }
                ],
                opacity: [
                    { value: 0.2, duration: 100 },
                    { value: 1, duration: 300 },
                    { value: 0.65, duration: 400 }
                ],
                color: [
                    { value: '#00ffff', duration: 120 },
                    { value: '#00ff44', duration: 300 },
                    { value: 'rgba(0, 255, 255, 0.45)', duration: 400 }
                ],
                delay: anime.stagger(18, {
                    grid: [cols, rows],
                    from: fromIndex
                })
            });
        } else {
            runAnimation({ targets: '.cyber-node' });
        }
    };

    // Mode 2: Cyber Vortex (Inward Rotational Spiral)
    const triggerVortex = () => {
        if (typeof anime !== 'undefined') {
            anime({
                targets: '.cyber-node',
                rotate: [
                    { value: 0, duration: 0 },
                    { value: 360, duration: 800, easing: 'easeInOutExpo' }
                ],
                scale: [
                    { value: 1, duration: 0 },
                    { value: 0.2, duration: 350, easing: 'easeInOutQuad' },
                    { value: 1.6, duration: 400, easing: 'easeOutElastic(1, .5)' },
                    { value: 1, duration: 300 }
                ],
                color: [
                    { value: '#9d00ff', duration: 300 },
                    { value: '#00ffff', duration: 500 },
                    { value: 'rgba(0, 255, 255, 0.45)', duration: 300 }
                ],
                delay: anime.stagger(16, {
                    grid: [cols, rows],
                    from: 'center'
                })
            });
        }
    };

    // Mode 3: Neural Pulse (Scanning Diagonal Wave)
    const triggerPulse = () => {
        if (typeof anime !== 'undefined') {
            anime({
                targets: '.cyber-node',
                translateY: [
                    { value: -12, duration: 250, easing: 'easeOutQuad' },
                    { value: 0, duration: 400, easing: 'easeOutElastic(1, .6)' }
                ],
                scale: [
                    { value: 1.5, duration: 250, easing: 'easeOutQuad' },
                    { value: 1, duration: 400 }
                ],
                color: [
                    { value: '#00ff44', duration: 200 },
                    { value: 'rgba(0, 255, 255, 0.45)', duration: 400 }
                ],
                delay: anime.stagger(22, {
                    grid: [cols, rows],
                    from: 'first',
                    axis: 'x'
                })
            });
        }
    };

    // Mode 4: Matrix Cypher Decryption
    const triggerCyph = () => {
        const hexChars = ['0', '1', 'F', 'X', 'Ψ', '7', 'A', '9', 'C', 'Ω'];
        let ticks = 0;
        const interval = setInterval(() => {
            nodes.forEach(node => {
                if (Math.random() > 0.6) {
                    node.textContent = hexChars[Math.floor(Math.random() * hexChars.length)];
                    node.style.color = '#00ff44';
                    node.style.textShadow = '0 0 8px #00ff44';
                }
            });
            ticks++;
            if (ticks > 12) {
                clearInterval(interval);
                nodes.forEach(node => {
                    node.textContent = node.dataset.defaultGlyph;
                    node.style.color = '';
                    node.style.textShadow = '';
                });
            }
        }, 60);

        triggerDecryptionEffect();
    };

    // Center Holographic Core Overload Surge
    if (core) {
        core.addEventListener('click', (e) => {
            e.stopPropagation();
            core.classList.add('overloaded');
            if (coreGlyph) coreGlyph.textContent = 'BURST';

            if (typeof anime !== 'undefined') {
                anime({
                    targets: core,
                    scale: [
                        { value: 1, duration: 0 },
                        { value: 1.5, duration: 300, easing: 'easeOutElastic(1, .4)' },
                        { value: 0.95, duration: 200 },
                        { value: 1, duration: 300, easing: 'easeOutElastic(1, .5)' }
                    ]
                });
                triggerRipple(Math.floor(totalNodes / 2));
            } else {
                triggerRipple();
            }

            setTimeout(() => {
                core.classList.remove('overloaded');
                if (coreGlyph) coreGlyph.textContent = '0xΨ';
            }, 1200);
        });
    }

    // Viewport Click / Tap Handler
    viewport.addEventListener('pointerdown', (e) => {
        if (e.target.closest('.cyber-core-visualizer') || e.target.closest('.matrix-hud-controls')) return;

        const rect = viewport.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const col = Math.min(cols - 1, Math.max(0, Math.floor((x / rect.width) * cols)));
        const row = Math.min(rows - 1, Math.max(0, Math.floor((y / rect.height) * rows)));
        const targetIndex = row * cols + col;

        if (activeMode === 'ripple') {
            triggerRipple(targetIndex);
        } else if (activeMode === 'vortex') {
            triggerVortex();
        } else if (activeMode === 'pulse') {
            triggerPulse();
        } else if (activeMode === 'decrypt') {
            triggerCyph();
        }
    }, { passive: true });

    // Mode selector buttons
    modeBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            modeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeMode = btn.dataset.mode;
            if (modeEl) modeEl.textContent = activeMode.toUpperCase();

            if (activeMode === 'ripple') triggerRipple();
            else if (activeMode === 'vortex') triggerVortex();
            else if (activeMode === 'pulse') triggerPulse();
            else if (activeMode === 'decrypt') triggerCyph();
        });
    });

    // Start with entrance wave
    setTimeout(playEntranceWave, 300);

    // Ambient Cyber Wave every 8s when idle
    let lastInteraction = Date.now();
    viewport.addEventListener('pointermove', () => { lastInteraction = Date.now(); }, { passive: true });

    setInterval(() => {
        if (!document.hidden && Date.now() - lastInteraction > 6000) {
            triggerPulse();
        }
    }, 8000);
};

// ==================== HACKER CYPHER TEXT DECRYPTION ====================
const triggerDecryptionEffect = () => {
    const nameEl = document.getElementById('hero-glitch-name');
    if (!nameEl) return;

    const originalText = "Suyog L";
    const cypherChars = "01!@#$%^&*()_+-=<>?~§ΨΩλ░▒▓█";
    let iteration = 0;
    const maxIterations = originalText.length * 5;

    clearInterval(nameEl._cypherInterval);
    nameEl._cypherInterval = setInterval(() => {
        nameEl.innerText = originalText.split("").map((char, index) => {
            if (index < iteration / 5) {
                return originalText[index];
            }
            return cypherChars[Math.floor(Math.random() * cypherChars.length)];
        }).join("");

        iteration++;
        if (iteration >= maxIterations) {
            clearInterval(nameEl._cypherInterval);
            nameEl.innerText = originalText;
        }
    }, 35);
};

const initDecryptionText = () => {
    const nameEl = document.getElementById('hero-glitch-name');
    if (!nameEl) return;

    nameEl.addEventListener('click', triggerDecryptionEffect);
    nameEl.addEventListener('mouseenter', () => {
        if (window.innerWidth > 768) triggerDecryptionEffect();
    });

    // Run initial decryption after load
    setTimeout(triggerDecryptionEffect, 1200);
};

// Initialize everything safely when DOM is ready
const initAll = () => {
    try { initThreeJS(); } catch(e) { console.warn('Three.js init failed:', e); }
    try { initAnimeCyberMatrix(); } catch(e) { console.warn('Anime Cyber Matrix failed:', e); }
    try { initDecryptionText(); } catch(e) { console.warn('Decryption text failed:', e); }
    try { initScrollAnimations(); } catch(e) { console.warn('Scroll animations failed:', e); }
    try { initSmoothScroll(); } catch(e) { console.warn('Smooth scroll failed:', e); }
    try { initMobileNav(); } catch(e) { console.warn('Mobile nav failed:', e); }
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
