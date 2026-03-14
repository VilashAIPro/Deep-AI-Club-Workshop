// ===== Particle Background =====
(function initParticles() {
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    const PARTICLE_COUNT = 60;
    const CONNECTION_DISTANCE = 150;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function createParticle() {
        return {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4,
            radius: Math.random() * 1.5 + 0.5,
            opacity: Math.random() * 0.4 + 0.1,
        };
    }

    function init() {
        resize();
        particles = [];
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push(createParticle());
        }
    }

    function drawParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw connections
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < CONNECTION_DISTANCE) {
                    const alpha = (1 - dist / CONNECTION_DISTANCE) * 0.08;
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(245, 166, 35, ${alpha})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }

        // Draw particles
        particles.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(245, 166, 35, ${p.opacity})`;
            ctx.fill();
        });
    }

    function updateParticles() {
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        });
    }

    function animate() {
        updateParticles();
        drawParticles();
        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', () => {
        resize();
    });

    init();
    animate();
})();


// ===== Typewriter Effect =====
(function initTypewriter() {
    const lines = [
        { id: 'type-line-1', text: 'Intelligent' },
        { id: 'type-line-2', text: 'Systems' },
        { id: 'type-line-3', text: 'Workshop' }
    ];
    const cursor = document.getElementById('typewriter-cursor');

    if (!cursor) return;

    const CHAR_SPEED = 90;       // ms per character
    const LINE_PAUSE = 300;      // pause between lines
    const START_DELAY = 600;     // initial delay before typing starts

    let currentLine = 0;
    let currentChar = 0;

    function positionCursor(lineEl) {
        // Move cursor next to the current line's text
        const lineParent = lineEl.parentElement;
        const rect = lineEl.getBoundingClientRect();
        const titleRect = document.getElementById('hero-title').getBoundingClientRect();
        cursor.style.top = (lineParent.offsetTop) + 'px';
        cursor.style.left = (lineEl.offsetWidth) + 'px';
    }

    function typeChar() {
        if (currentLine >= lines.length) {
            // Typing complete — fade cursor and add shimmer
            setTimeout(() => {
                cursor.classList.add('hide');
                // Add shimmer to "Systems" line
                const accentLine = document.getElementById('type-line-2');
                if (accentLine) {
                    accentLine.parentElement.classList.add('shimmer-active');
                }
            }, 1000);
            return;
        }

        const lineData = lines[currentLine];
        const el = document.getElementById(lineData.id);

        if (currentChar <= lineData.text.length) {
            el.textContent = lineData.text.substring(0, currentChar);
            positionCursor(el);
            currentChar++;
            setTimeout(typeChar, CHAR_SPEED);
        } else {
            // Move to next line
            currentLine++;
            currentChar = 0;
            setTimeout(typeChar, LINE_PAUSE);
        }
    }

    // Start typing after a short delay
    setTimeout(typeChar, START_DELAY);
})();


// ===== Navbar Scroll Effect =====
(function initNavbar() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.getElementById('nav-links');
    const links = navLinks.querySelectorAll('a');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close menu on link click
    links.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Active link highlighting
    const sections = document.querySelectorAll('section[id]');

    function updateActiveLink() {
        const scrollPos = window.scrollY + 120;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
                links.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveLink);
    updateActiveLink();
})();


// ===== Scroll Animations =====
(function initAnimations() {
    const animatedElements = document.querySelectorAll('[data-animate]');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.getAttribute('data-delay') || 0;
                setTimeout(() => {
                    entry.target.classList.add('animate-in');
                }, parseInt(delay));
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(el => observer.observe(el));
})();


// ===== Counter Animation =====
(function initCounters() {
    const counters = document.querySelectorAll('[data-count]');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-count'));
                let current = 0;
                const increment = target / 40;
                const duration = 1500;
                const stepTime = duration / 40;

                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        entry.target.textContent = target;
                        clearInterval(timer);
                    } else {
                        entry.target.textContent = Math.floor(current);
                    }
                }, stepTime);

                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
})();


// ===== Countdown Timer =====
(function initCountdown() {
    // Workshop date: 17th March 2026, 12:00 PM IST
    const workshopDate = new Date('2026-03-17T12:00:00+05:30').getTime();

    const daysEl = document.getElementById('cd-days');
    const hoursEl = document.getElementById('cd-hours');
    const minutesEl = document.getElementById('cd-minutes');
    const secondsEl = document.getElementById('cd-seconds');

    if (!daysEl) return;

    function padZero(num) {
        return num < 10 ? '0' + num : num;
    }

    function updateCountdown() {
        const now = new Date().getTime();
        const diff = workshopDate - now;

        if (diff <= 0) {
            daysEl.textContent = '00';
            hoursEl.textContent = '00';
            minutesEl.textContent = '00';
            secondsEl.textContent = '00';
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        daysEl.textContent = padZero(days);
        hoursEl.textContent = padZero(hours);
        minutesEl.textContent = padZero(minutes);
        secondsEl.textContent = padZero(seconds);
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
})();


// ===== Smooth Scroll for Anchor Links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});


// ===== Parallax-like effect on hero glows =====
(function initParallax() {
    const glows = document.querySelectorAll('.hero-glow');

    window.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;

        glows.forEach((glow, i) => {
            const speed = (i + 1) * 8;
            glow.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
        });
    });
})();
