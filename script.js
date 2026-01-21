// ================================
// PORTFÓLIO PREMIUM - DAVI GONÇALVES
// JavaScript com Module Pattern
// ================================

// Módulo principal do portfólio
const Portfolio = (() => {
    // ===== ESTADO PRIVADO =====
    const state = {
        isMenuOpen: false,
        currentCertification: 0,
        scrollTicking: false,
        particleSystem: null,
        // Configurações
        config: {
            DEBOUNCE_DELAY: 300,
            THROTTLE_DELAY: 100,
            ANIMATION_DURATION: 2000,
            CAROUSEL_INTERVAL: 5000,
            PARTICLES_DESKTOP: 50,
            PARTICLES_MOBILE_LIMIT: 1024
        }
    };

    // ===== UTILITÁRIOS PRIVADOS =====
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

    const throttle = (func, limit) => {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    };

    // ===== NAVEGAÇÃO =====
    const initNavigation = () => {
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        const navSocial = document.querySelector('.nav-social');
        const navLinks = document.querySelectorAll('.nav-link');
        const navbar = document.querySelector('.navbar');

        if (navToggle) {
            navToggle.addEventListener('click', () => {
                state.isMenuOpen = !state.isMenuOpen;
                navToggle.classList.toggle('active');
                navMenu?.classList.toggle('active');
                navSocial?.classList.toggle('active');
                document.body.style.overflow = state.isMenuOpen ? 'hidden' : 'auto';
                navbar.style.background = state.isMenuOpen 
                    ? 'rgba(13, 17, 23, 0.98)' 
                    : 'rgba(13, 17, 23, 0.8)';
            });
        }

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (state.isMenuOpen) {
                    navToggle?.classList.remove('active');
                    navMenu?.classList.remove('active');
                    navSocial?.classList.remove('active');
                    document.body.style.overflow = 'auto';
                    state.isMenuOpen = false;
                }
            });
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 992 && state.isMenuOpen) {
                navToggle?.classList.remove('active');
                navMenu?.classList.remove('active');
                navSocial?.classList.remove('active');
                document.body.style.overflow = 'auto';
                state.isMenuOpen = false;
            }
        });
    };

    // ===== NAVEGAÇÃO ATIVA =====
    const initActiveNavigation = () => {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');

        const updateActiveNavigation = () => {
            const scrollY = window.pageYOffset;
            let current = '';

            sections.forEach(section => {
                const sectionTop = section.offsetTop - 100;
                const sectionHeight = section.clientHeight;
                if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        };

        window.addEventListener('scroll', throttle(updateActiveNavigation, state.config.THROTTLE_DELAY));
    };

    // ===== SMOOTH SCROLLING =====
    const initSmoothScrolling = () => {
        const links = document.querySelectorAll('a[href^="#"]');
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);

                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 80;
                    window.scrollTo({ top: offsetTop, behavior: 'smooth' });
                }
            });
        });
    };

    // ===== SCROLL ANIMATIONS =====
    const initScrollAnimations = () => {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');

                    // Adicionar efeito de glow para elementos especiais
                    if (entry.target.classList.contains('stat-item') ||
                        entry.target.classList.contains('portfolio-item') ||
                        entry.target.classList.contains('python-card')) {
                        setTimeout(() => {
                            entry.target.style.boxShadow = 'var(--shadow-glow)';
                        }, 300);
                    }

                    // Efeito de typewriter para títulos
                    if (entry.target.classList.contains('hero-title') ||
                        entry.target.classList.contains('section-title')) {
                        typewriterEffect(entry.target);
                    }
                }
            });
        }, observerOptions);

        const animateElements = document.querySelectorAll(`
            .hero-content, .about-text, .skills-section, .skill-item,
            .experience-item, .portfolio-item, .stat-item,
            .contact-info, .contact-form, .certification-item,
            .python-card, .python-stats
        `);

        animateElements.forEach((el, index) => {
            el.classList.add('animate-element');
            el.style.animationDelay = `${index * 0.1}s`;
            observer.observe(el);
        });
    };

    // Efeito typewriter para títulos
    const typewriterEffect = (element) => {
        const text = element.textContent;
        element.textContent = '';
        element.style.borderRight = '2px solid var(--primary-gold)';

        let i = 0;
        const typeInterval = setInterval(() => {
            element.textContent += text[i];
            i++;

            if (i >= text.length) {
                clearInterval(typeInterval);
                setTimeout(() => {
                    element.style.borderRight = 'none';
                }, 1000);
            }
        }, 50);
    };

    // ===== SKILL BARS =====
    const initSkillBars = () => {
        const skillBars = document.querySelectorAll('.skill-progress');

        const skillObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const progressBar = entry.target;
                    const width = progressBar.getAttribute('data-width');

                    setTimeout(() => {
                        progressBar.style.width = width;
                    }, 200);

                    skillObserver.unobserve(progressBar);
                }
            });
        }, { threshold: 0.5 });

        skillBars.forEach(bar => skillObserver.observe(bar));
    };

    // ===== CONTADOR ANIMADO =====
    const initCounterAnimation = () => {
        const counters = document.querySelectorAll('.stat-number');

        const animateCounter = (counter) => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = state.config.ANIMATION_DURATION;
            const start = 0;
            const increment = target / (duration / 16);
            let current = start;

            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };

            updateCounter();
        };

        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    if (!counter.classList.contains('animated')) {
                        counter.classList.add('animated');
                        animateCounter(counter);
                    }
                }
            });
        }, { threshold: 0.7 });

        counters.forEach(counter => counterObserver.observe(counter));
    };

    // ===== CERTIFICAÇÕES =====
    const initCertificationsSlider = () => {
        const prevBtn = document.getElementById('cert-prev');
        const nextBtn = document.getElementById('cert-next');
        const certificationItems = document.querySelectorAll('.certification-item');

        if (certificationItems.length === 0) return;

        const showCertification = (index) => {
            certificationItems.forEach((item, i) => {
                item.classList.toggle('active', i === index);
            });
        };

        const nextCertification = () => {
            state.currentCertification = (state.currentCertification + 1) % certificationItems.length;
            showCertification(state.currentCertification);
        };

        const prevCertification = () => {
            state.currentCertification = (state.currentCertification - 1 + certificationItems.length) % certificationItems.length;
            showCertification(state.currentCertification);
        };

        nextBtn?.addEventListener('click', nextCertification);
        prevBtn?.addEventListener('click', prevCertification);
        setInterval(nextCertification, state.config.CAROUSEL_INTERVAL);
        showCertification(0);
    };

    // ===== FORMULÁRIO DE CONTATO COM FORMSPREE =====
    const initContactForm = () => {
        const form = document.getElementById('contactForm');
        if (!form) return;

        // ===== DEFINIR FUNÇÕES DE VALIDAÇÃO PRIMEIRO =====
        const showFieldError = (field, message) => {
            field.style.borderBottomColor = '#FF6B6B';
            let errorDiv = field.parentNode.querySelector('.field-error');
            if (!errorDiv) {
                errorDiv = document.createElement('div');
                errorDiv.className = 'field-error';
                errorDiv.style.cssText = `
                    color: #FF6B6B;
                    font-size: 12px;
                    margin-top: 8px;
                    font-family: var(--font-secondary);
                `;
                field.parentNode.appendChild(errorDiv);
            }
            errorDiv.textContent = message;
        };

        const clearFieldError = (field) => {
            field.style.borderBottomColor = '';
            field.parentNode.querySelector('.field-error')?.remove();
        };

        const validateField = (e) => {
            const field = e.target;
            const value = field.value.trim();
            clearFieldError(field);

            let isValid = true;
            let errorMessage = '';

            if (!value) {
                isValid = false;
                errorMessage = 'Este campo é obrigatório.';
            } else {
                switch (field.type) {
                    case 'email':
                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        if (!emailRegex.test(value)) {
                            isValid = false;
                            errorMessage = 'Por favor, insira um e-mail válido.';
                        }
                        break;
                    case 'text':
                        if (field.name === 'nome' && value.length < 2) {
                            isValid = false;
                            errorMessage = 'Nome deve ter pelo menos 2 caracteres.';
                        }
                        break;
                    default:
                        if (field.tagName === 'TEXTAREA' && value.length < 10) {
                            isValid = false;
                            errorMessage = 'Mensagem deve ter pelo menos 10 caracteres.';
                        }
                }
            }

            if (!isValid) showFieldError(field, errorMessage);
            return isValid;
        };

        // ===== ADICIONAR EVENT LISTENERS =====
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', () => clearFieldError(input));
        });

        // ===== HANDLE FORM SUBMISSION =====
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const fields = form.querySelectorAll('input, textarea');
            let isFormValid = true;

            fields.forEach(field => {
                const fieldValid = validateField({ target: field });
                if (!fieldValid) isFormValid = false;
            });

            if (!isFormValid) {
                showNotification('Por favor, corrija os erros no formulário.', 'error');
                return;
            }

            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span>ENVIANDO...</span><i class="btn-icon">⏳</i>';
            submitBtn.disabled = true;

            try {
                // Obter dados do formulário
                const formData = new FormData(form);

                // Enviar para Formspree
                const response = await fetch('https://formspree.io/f/mreerjwb', {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    showNotification('✅ Mensagem enviada com sucesso! Em breve entrarei em contato.', 'success');
                    form.reset();
                    // Limpar erros dos campos
                    inputs.forEach(input => clearFieldError(input));
                } else {
                    showNotification('❌ Erro ao enviar. Tente novamente.', 'error');
                }
            } catch (error) {
                console.error('❌ Erro ao enviar:', error);
                showNotification('❌ Erro: ' + error.message, 'error');
            } finally {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });

        // ===== NOTIFICAÇÕES =====
        const showNotification = (message, type = 'info') => {
            const notification = document.createElement('div');
            notification.className = `notification ${type}`;
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#FF6B6B' : '#2196F3'};
                color: white;
                padding: 16px 24px;
                border-radius: 4px;
                z-index: 1000;
                font-family: var(--font-secondary);
                font-size: 14px;
                font-weight: 600;
                max-width: 400px;
                animation: slideInRight 0.3s ease, fadeOut 0.3s ease 4.7s forwards;
            `;
            notification.textContent = message;
            document.body.appendChild(notification);

            setTimeout(() => notification.remove(), 5000);
        };
    };

    // ===== EFEITOS VISUAIS =====
    const initVisualEffects = () => {
        const hero = document.querySelector('.hero');
        const heroPattern = document.querySelector('.hero-pattern');

        if (hero && heroPattern) {
            window.addEventListener('scroll', throttle(() => {
                const scrolled = window.pageYOffset;
                const rate = scrolled * -0.3;
                const opacity = 1 - (scrolled / hero.offsetHeight);

                if (scrolled < hero.offsetHeight) {
                    heroPattern.style.transform = `translateY(${rate}px) scale(${1 + scrolled * 0.0005})`;
                    heroPattern.style.opacity = Math.max(0.1, opacity);
                }
            }, 16));
        }

        initCustomCursor();
        initMagneticEffect();
        initFloatingElements();
    };

    // ===== CURSOR CUSTOMIZADO =====
    const initCustomCursor = () => {
        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        document.body.appendChild(cursor);

        const cursorFollower = document.createElement('div');
        cursorFollower.className = 'cursor-follower';
        document.body.appendChild(cursorFollower);

        let mouseX = 0, mouseY = 0, cursorX = 0, cursorY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        const animateCursor = () => {
            const delay = 0.1;
            cursorX += (mouseX - cursorX) * delay;
            cursorY += (mouseY - cursorY) * delay;

            cursor.style.left = mouseX + 'px';
            cursor.style.top = mouseY + 'px';
            cursorFollower.style.left = cursorX + 'px';
            cursorFollower.style.top = cursorY + 'px';

            requestAnimationFrame(animateCursor);
        };
        animateCursor();

        const interactiveElements = document.querySelectorAll('a, button, .portfolio-item, .skill-item');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('cursor-hover');
                cursorFollower.classList.add('cursor-hover');
            });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('cursor-hover');
                cursorFollower.classList.remove('cursor-hover');
            });
        });
    };

    // ===== EFEITO MAGNÉTICO =====
    const initMagneticEffect = () => {
        const buttons = document.querySelectorAll('.btn, .nav-social a, .portfolio-link');

        buttons.forEach(button => {
            button.addEventListener('mousemove', (e) => {
                const rect = button.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                const distance = Math.sqrt(x * x + y * y);
                const maxDistance = 100;

                if (distance < maxDistance) {
                    const force = (maxDistance - distance) / maxDistance;
                    const moveX = x * force * 0.3;
                    const moveY = y * force * 0.3;
                    button.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.05)`;
                }
            });

            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translate(0, 0) scale(1)';
            });
        });
    };

    // ===== ELEMENTOS FLUTUANTES =====
    const initFloatingElements = () => {
        const floatingElements = document.querySelectorAll('.skill-item, .stat-item');

        floatingElements.forEach((el, index) => {
            const delay = index * 0.5;
            const duration = 3 + Math.random() * 2;
            el.style.animation = `float ${duration}s ease-in-out ${delay}s infinite`;
        });
    };

    // ===== NAVBAR SCROLL EFFECT =====
    const initNavbarScrollEffect = () => {
        const navbar = document.getElementById('navbar');
        if (!navbar) return;

        window.addEventListener('scroll', throttle(() => {
            const scrollTop = window.pageYOffset;
            if (scrollTop > 50) {
                navbar.style.background = 'rgba(13, 17, 23, 0.95)';
                navbar.style.backdropFilter = 'blur(20px)';
            } else {
                navbar.style.background = 'rgba(13, 17, 23, 0.8)';
                navbar.style.backdropFilter = 'blur(20px)';
            }
        }, 100));
    };

    // ===== SISTEMA DE PARTÍCULAS =====
    const initParticleSystem = () => {
        // Otimização: Renderizar apenas em desktop
        if (window.innerWidth <= state.config.PARTICLES_MOBILE_LIMIT) {
            return; // Não renderizar em mobile
        }

        const canvas = document.createElement('canvas');
        canvas.className = 'particle-canvas';
        canvas.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            pointer-events: none; z-index: 1; opacity: 0.3;
        `;
        document.body.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        let particles = [];

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        const createParticle = () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            size: Math.random() * 2 + 1,
            opacity: Math.random() * 0.5 + 0.2,
            color: `rgba(255, 215, 0, ${Math.random() * 0.3 + 0.1})`
        });

        const initParticles = () => {
            particles = [];
            for (let i = 0; i < state.config.PARTICLES_DESKTOP; i++) {
                particles.push(createParticle());
            }
        };

        const updateParticles = () => {
            particles.forEach(particle => {
                particle.x += particle.vx;
                particle.y += particle.vy;
                if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
                if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
            });
        };

        const drawParticles = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(particle => {
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fillStyle = particle.color;
                ctx.fill();
            });
        };

        const animate = () => {
            updateParticles();
            drawParticles();
            requestAnimationFrame(animate);
        };

        resizeCanvas();
        initParticles();
        animate();

        window.addEventListener('resize', () => {
            resizeCanvas();
            initParticles();
        });
    };

    // ===== LOADING EFFECTS =====
    const initLoadingEffects = () => {
        const preloader = document.createElement('div');
        preloader.className = 'preloader';
        preloader.innerHTML = `
            <div class="preloader-content">
                <div class="logo-loader">DG</div>
                <div class="loading-bar">
                    <div class="loading-progress"></div>
                </div>
                <div class="loading-text">Carregando experiência premium...</div>
            </div>
        `;
        document.body.appendChild(preloader);

        let progress = 0;
        const progressBar = preloader.querySelector('.loading-progress');

        const loadingInterval = setInterval(() => {
            progress += Math.random() * 30;
            if (progress >= 100) {
                progress = 100;
                clearInterval(loadingInterval);
                setTimeout(() => {
                    preloader.style.opacity = '0';
                    setTimeout(() => preloader.remove(), 500);
                }, 500);
            }
            progressBar.style.width = progress + '%';
        }, 200);
    };

    // ===== API PÚBLICA =====
    return {
        init() {
            // Verificar preferência de movimento reduzido
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            if (prefersReducedMotion) {
                document.documentElement.style.setProperty('--transition', 'none');
                return;
            }

            // Inicializar tudo
            initNavigation();
            initActiveNavigation();
            initSmoothScrolling();
            initScrollAnimations();
            initSkillBars();
            initCounterAnimation();
            initCertificationsSlider();
            initContactForm();
            initVisualEffects();
            initNavbarScrollEffect();
            initParticleSystem();
            initLoadingEffects();

            // Fade in
            document.body.style.opacity = '0';
            setTimeout(() => {
                document.body.style.transition = 'opacity 0.5s ease';
                document.body.style.opacity = '1';
            }, 100);
        }
    };
})();

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', () => {
    // Aguardar um pouco para garantir que todos os scripts foram carregados
    setTimeout(() => {
        Portfolio.init();
    }, 300);
});
