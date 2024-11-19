// Initialize Three.js Scene
const initThreeScene = () => {
    const canvas = document.querySelector('#space-bg');
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const scene = new THREE.Scene();

    // Create stars
    const createStars = () => {
        const starGeometry = new THREE.BufferGeometry();
        const starMaterial = new THREE.PointsMaterial({
            color: 0xFFFFFF,
            size: 0.1,
            transparent: true,
            opacity: 0.8,
        });

        const starVertices = [];
        for (let i = 0; i < 15000; i++) {
            const x = (Math.random() - 0.5) * 2000;
            const y = (Math.random() - 0.5) * 2000;
            const z = -Math.random() * 3000;
            starVertices.push(x, y, z);
        }

        starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
        return new THREE.Points(starGeometry, starMaterial);
    };

    const stars = createStars();
    scene.add(stars);

    // Create nebula effect
    const createNebula = () => {
        const geometry = new THREE.BufferGeometry();
        const material = new THREE.PointsMaterial({
            color: 0x4facfe,
            size: 0.2,
            transparent: true,
            opacity: 0.4,
        });

        const particles = [];
        for (let i = 0; i < 5000; i++) {
            const x = (Math.random() - 0.5) * 1000;
            const y = (Math.random() - 0.5) * 1000;
            const z = -Math.random() * 2000;
            particles.push(x, y, z);
        }

        geometry.setAttribute('position', new THREE.Float32BufferAttribute(particles, 3));
        return new THREE.Points(geometry, material);
    };

    const nebula = createNebula();
    scene.add(nebula);

    camera.position.z = 5;

    // Animation loop
    const animate = () => {
        requestAnimationFrame(animate);
        stars.rotation.y += 0.0002;
        stars.rotation.x += 0.0001;
        nebula.rotation.y += 0.0001;
        renderer.render(scene, camera);
    };

    // Handle window resize
    const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    animate();
};

// Navigation functionality
const initNavigation = () => {
    const nav = document.querySelector('.nav');
    const menuBtn = document.querySelector('.menu-btn');
    const navLinks = document.querySelector('.nav-links');

    // Mobile menu toggle
    menuBtn?.addEventListener('click', () => {
        menuBtn.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            menuBtn.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // Smooth scroll to sections
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.offsetTop;
                const offsetPosition = elementPosition - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
};

// Intersection Observer for scroll animations
const initScrollAnimations = () => {
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements
    document.querySelectorAll('.product-card, .about-card, .team-member, .contact-card').forEach(el => {
        el.classList.add('animate-hidden');
        observer.observe(el);
    });
};

// Particle effect for hover interactions
const initParticleEffects = () => {
    const createParticle = (x, y) => {
        const particle = document.createElement('div');
        particle.className = 'particle';
        document.body.appendChild(particle);

        const size = Math.random() * 3 + 2;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;

        const destinationX = x + (Math.random() - 0.5) * 100;
        const destinationY = y + (Math.random() - 0.5) * 100;

        const animation = particle.animate([
            {
                transform: `translate(${x}px, ${y}px)`,
                opacity: 1
            },
            {
                transform: `translate(${destinationX}px, ${destinationY}px)`,
                opacity: 0
            }
        ], {
            duration: 1000,
            easing: 'cubic-bezier(0, .9, .57, 1)',
        });

        animation.onfinish = () => particle.remove();
    };

    // Add particle effect to interactive elements
    document.querySelectorAll('.cta-button, .product-card, .team-member').forEach(el => {
        el.addEventListener('mouseenter', (e) => {
            const rect = el.getBoundingClientRect();
            for (let i = 0; i < 10; i++) {
                createParticle(rect.left + rect.width / 2, rect.top + rect.height / 2);
            }
        });
    });
};

// Performance optimization
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        initThreeScene();
    } catch (e) {
        console.error('Error initializing Three.js scene:', e);
    }

    initNavigation();
    initScrollAnimations();
    initParticleEffects();

    // Add necessary styles for animations
    const style = document.createElement('style');
    style.textContent = `
        .animate-hidden {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }
        .animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        .particle {
            position: fixed;
            background: linear-gradient(45deg, #00f2fe, #4facfe);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
        }
    `;
    document.head.appendChild(style);
});

// Handle loading state
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Timeline Animation
const initTimelineAnimation = () => {
    const timeline = document.querySelector('.timeline');
    const timelineItems = document.querySelectorAll('.timeline-item');

    // Initialize timeline items
    timelineItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
    });

    // Intersection Observer for timeline items
    const timelineObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);

                // Add glow effect to timeline dot
                const dot = entry.target.querySelector('.timeline-content::after');
                if (dot) {
                    dot.style.boxShadow = '0 0 15px rgba(0, 242, 254, 0.8)';
                }
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    });

    // Observe each timeline item
    timelineItems.forEach(item => {
        timelineObserver.observe(item);
    });

    // Parallax effect for timeline
    let lastScrollTop = 0;

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const timelineRect = timeline.getBoundingClientRect();

        // Only animate if timeline is in view
        if (timelineRect.top < window.innerHeight && timelineRect.bottom > 0) {
            const direction = scrollTop > lastScrollTop ? 1 : -1;
            const speed = 0.2;

            timelineItems.forEach((item, index) => {
                const offset = (index % 2 === 0 ? 1 : -1) * direction * speed;
                item.style.transform = `translateX(${offset}px)`;
            });
        }

        lastScrollTop = scrollTop;
    }, { passive: true });

    // Add hover interaction
    timelineItems.forEach(item => {
        const content = item.querySelector('.timeline-content');

        content.addEventListener('mouseenter', () => {
            // Create particle effect
            createTimelineParticles(content);
        });
    });
};

// Create particle effect for timeline items
const createTimelineParticles = (element) => {
    const rect = element.getBoundingClientRect();
    const particleCount = 10;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'timeline-particle';
        document.body.appendChild(particle);

        const size = Math.random() * 4 + 2;
        const initialX = rect.left + rect.width / 2;
        const initialY = rect.top + rect.height / 2;
        const angle = (Math.random() * 360) * (Math.PI / 180);
        const velocity = Math.random() * 2 + 1;
        const velocityX = Math.cos(angle) * velocity;
        const velocityY = Math.sin(angle) * velocity;

        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${initialX}px`;
        particle.style.top = `${initialY}px`;
        particle.style.background = `linear-gradient(45deg, #00f2fe, #4facfe)`;
        particle.style.position = 'fixed';
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '1000';

        // Animate particle
        const animation = particle.animate([
            {
                transform: 'scale(1) translate(0, 0)',
                opacity: 1
            },
            {
                transform: `scale(0) translate(${velocityX * 100}px, ${velocityY * 100}px)`,
                opacity: 0
            }
        ], {
            duration: Math.random() * 1000 + 500,
            easing: 'cubic-bezier(0, .9, .57, 1)'
        });

        animation.onfinish = () => particle.remove();
    }
};

// Add timeline-specific styles
const addTimelineStyles = () => {
    const style = document.createElement('style');
    style.textContent = `
        .timeline-particle {
            position: fixed;
            pointer-events: none;
            z-index: 1000;
            animation: timelineParticleFade 1s ease-out forwards;
        }
        
        @keyframes timelineParticleFade {
            0% {
                opacity: 1;
                transform: scale(1);
            }
            100% {
                opacity: 0;
                transform: scale(0);
            }
        }
    `;
    document.head.appendChild(style);
};

// Initialize timeline features
document.addEventListener('DOMContentLoaded', () => {
    initTimelineAnimation();
    addTimelineStyles();
});

// Partners Section Functionality
const initPartnersSection = () => {
    const partnersContainer = document.querySelector('.partners-container');
    const partnerCards = document.querySelectorAll('.partner-card');
    const dots = document.querySelectorAll('.partners-dots .dot');
    let currentSlide = 0;
    let touchStartX = 0;
    let touchEndX = 0;

    // Initialize intersection observer for animation on scroll
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe each partner card
    partnerCards.forEach(card => {
        observer.observe(card);
    });

    // Particle effect for partner cards
    const createParticles = (e, element) => {
        const rect = element.getBoundingClientRect();
        const particles = 10;

        for (let i = 0; i < particles; i++) {
            const particle = document.createElement('div');
            particle.className = 'partner-particle';

            const size = Math.random() * 4 + 2;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;

            const destinationX = (Math.random() - 0.5) * 100;
            const destinationY = (Math.random() - 0.5) * 100;
            const rotation = Math.random() * 520;
            const delay = Math.random() * 200;

            particle.style.left = e.clientX - rect.left + 'px';
            particle.style.top = e.clientY - rect.top + 'px';
            particle.style.transform = `translate(${destinationX}px, ${destinationY}px) rotate(${rotation}deg)`;
            particle.style.animationDelay = `${delay}ms`;

            element.appendChild(particle);
            setTimeout(() => particle.remove(), 1000 + delay);
        }
    };

    // Add hover effect and particle creation
    partnerCards.forEach(card => {
        card.addEventListener('mouseenter', (e) => {
            createParticles(e, card);
        });

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;

            card.querySelector('.partner-card-inner').style.transform =
                `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            card.querySelector('.partner-card-inner').style.transform = '';
        });
    });

    // Mobile touch functionality
    const handleTouchStart = (e) => {
        touchStartX = e.touches[0].clientX;
    };

    const handleTouchMove = (e) => {
        touchEndX = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
        const touchDiff = touchStartX - touchEndX;
        if (Math.abs(touchDiff) > 50) {
            if (touchDiff > 0) {
                // Swipe left
                showSlide(currentSlide + 1);
            } else {
                // Swipe right
                showSlide(currentSlide - 1);
            }
        }
    };

    // Slide functionality for mobile
    const showSlide = (index) => {
        const totalSlides = partnerCards.length;
        if (index >= totalSlides) {
            currentSlide = 0;
        } else if (index < 0) {
            currentSlide = totalSlides - 1;
        } else {
            currentSlide = index;
        }

        // Update cards visibility
        partnerCards.forEach((card, i) => {
            if (i === currentSlide) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });

        // Update dots
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentSlide);
        });
    };

    // Add touch events for mobile
    if (window.innerWidth <= 768) {
        partnersContainer.addEventListener('touchstart', handleTouchStart);
        partnersContainer.addEventListener('touchmove', handleTouchMove);
        partnersContainer.addEventListener('touchend', handleTouchEnd);

        // Initialize mobile view
        showSlide(0);

        // Add dot click handlers
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => showSlide(index));
        });
    }

    // Lazy loading of partner logos
    const lazyLoadImages = () => {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('loading');
                    observer.unobserve(img);
                }
            });
        });

        document.querySelectorAll('.partner-logo img').forEach(img => {
            img.classList.add('loading');
            imageObserver.observe(img);
        });
    };

    // Handle window resize
    const handleResize = () => {
        if (window.innerWidth <= 768) {
            if (!partnersContainer.hasAttribute('data-mobile')) {
                partnersContainer.setAttribute('data-mobile', 'true');
                showSlide(0);
            }
        } else {
            partnersContainer.removeAttribute('data-mobile');
            partnerCards.forEach(card => {
                card.style.display = 'block';
            });
        }
    };

    // Initialize
    window.addEventListener('resize', handleResize);
    handleResize();
    lazyLoadImages();

    // Add keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (window.innerWidth <= 768) {
            if (e.key === 'ArrowLeft') {
                showSlide(currentSlide - 1);
            } else if (e.key === 'ArrowRight') {
                showSlide(currentSlide + 1);
            }
        }
    });

    // Add accessibility features
    partnerCards.forEach(card => {
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', '合作伙伴信息');

        card.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                card.querySelector('.partner-card-inner').style.transform =
                    card.querySelector('.partner-card-inner').style.transform ? '' : 'rotateY(180deg)';
            }
        });
    });
};

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', initPartnersSection);