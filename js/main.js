/* ============================================
   EIFFEL TOWER TRAVEL - Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // --- Preloader ---
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('hidden');
        }, 800);
    });
    // Fallback: hide preloader after 3s even if load event doesn't fire
    setTimeout(() => {
        preloader.classList.add('hidden');
    }, 3000);

    // --- Navbar scroll behavior ---
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    function handleNavScroll() {
        const currentScroll = window.scrollY;

        if (currentScroll > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    }

    window.addEventListener('scroll', handleNavScroll, { passive: true });

    // --- Mobile Menu Toggle ---
    const navToggle = document.getElementById('navToggle');
    const mobileMenu = document.getElementById('mobileMenu');

    if (navToggle && mobileMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu on link click
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // --- Smooth scroll for anchor links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 80; // navbar height
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Scroll Reveal Animations ---
    function setupScrollReveal() {
        const revealElements = document.querySelectorAll(
            '.section-header, .ticket-card, .time-card, .viewpoint-card, ' +
            '.gallery-item, .dining-cat, .neighborhood-card, .itinerary-card, ' +
            '.route-card, .stat-item, .strip-item, .cta-content, .faq-item, ' +
            '.decision-card, .strategy-card, .info-card'
        );

        revealElements.forEach(el => {
            el.classList.add('reveal');
        });

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach((el, index) => {
            // Stagger siblings of the same parent
            const siblings = el.parentElement.querySelectorAll('.reveal');
            const siblingIndex = Array.from(siblings).indexOf(el);
            if (siblingIndex > 0 && siblingIndex < 5) {
                el.classList.add(`reveal-delay-${siblingIndex}`);
            }
            observer.observe(el);
        });
    }

    setupScrollReveal();

    // --- Animated Counter for Stats ---
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number[data-target]');

        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.getAttribute('data-target'));
                    const duration = 2000;
                    const startTime = performance.now();

                    function updateCounter(currentTime) {
                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / duration, 1);

                        // Easing function (ease-out)
                        const eased = 1 - Math.pow(1 - progress, 3);
                        const current = Math.floor(eased * target);

                        counter.textContent = current.toLocaleString();

                        if (progress < 1) {
                            requestAnimationFrame(updateCounter);
                        } else {
                            counter.textContent = target.toLocaleString();
                        }
                    }

                    requestAnimationFrame(updateCounter);
                    counterObserver.unobserve(counter);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => counterObserver.observe(counter));
    }

    animateCounters();

    // --- Parallax effect for background images ---
    function setupParallax() {
        const parallaxElements = document.querySelectorAll('.parallax-bg, .cta-bg');

        // Skip parallax on mobile for performance
        if (window.innerWidth < 1024) return;

        function updateParallax() {
            parallaxElements.forEach(el => {
                const section = el.parentElement;
                const rect = section.getBoundingClientRect();
                const windowHeight = window.innerHeight;

                if (rect.top < windowHeight && rect.bottom > 0) {
                    const scrollPercent = (windowHeight - rect.top) / (windowHeight + rect.height);
                    const translateY = (scrollPercent - 0.5) * 80;
                    el.style.transform = `translateY(${translateY}px)`;
                }
            });
        }

        window.addEventListener('scroll', updateParallax, { passive: true });
        updateParallax();
    }

    setupParallax();

    // --- Image lazy loading with fade-in ---
    function setupImageFadeIn() {
        const images = document.querySelectorAll('img[loading="lazy"]');

        images.forEach(img => {
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.6s ease';

            if (img.complete) {
                img.style.opacity = '1';
            } else {
                img.addEventListener('load', () => {
                    img.style.opacity = '1';
                });
            }
        });
    }

    setupImageFadeIn();

    // --- Video fallback ---
    const heroVideo = document.getElementById('heroVideo');
    if (heroVideo) {
        heroVideo.addEventListener('error', () => {
            heroVideo.style.display = 'none';
            const fallback = document.querySelector('.hero-image-fallback');
            if (fallback) {
                fallback.style.zIndex = '0';
            }
        });

        // Pause video when not visible for performance
        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    heroVideo.play().catch(() => {});
                } else {
                    heroVideo.pause();
                }
            });
        });
        videoObserver.observe(heroVideo);
    }

    // --- Active nav link highlighting ---
    function setupActiveNavLinks() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-links a');

        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navLinks.forEach(link => {
                        link.style.color = '';
                        if (link.getAttribute('href') === `#${id}`) {
                            link.style.color = '#C5A47E';
                        }
                    });
                }
            });
        }, {
            rootMargin: '-40% 0px -60% 0px'
        });

        sections.forEach(section => sectionObserver.observe(section));
    }

    setupActiveNavLinks();

    // --- Image strip horizontal scroll on mobile ---
    const imageStrip = document.querySelector('.image-strip');
    if (imageStrip && window.innerWidth < 768) {
        imageStrip.style.overflowX = 'auto';
        imageStrip.style.scrollSnapType = 'x mandatory';
        imageStrip.style.WebkitOverflowScrolling = 'touch';
        imageStrip.querySelectorAll('.strip-item').forEach(item => {
            item.style.scrollSnapAlign = 'start';
        });
    }

});
