// Animations and Interactions Module
class AnimationManager {
    constructor() {
        this.observers = [];
        this.init();
    }

    init() {
        this.setupScrollAnimations();
        this.setupHoverEffects();
        this.setupParallaxEffects();
        this.setupPerformanceOptimizations();
    }

    setupScrollAnimations() {
        // Intersection Observer for scroll-triggered animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '50px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.triggerEntryAnimation(entry.target);
                }
            });
        }, observerOptions);

        // Observe elements with animation attributes
        document.querySelectorAll('[data-animate]').forEach(el => {
            observer.observe(el);
        });

        this.observers.push(observer);
    }

    triggerEntryAnimation(element) {
        const animationType = element.getAttribute('data-animate');
        const delay = element.getAttribute('data-delay') || 0;
        
        setTimeout(() => {
            element.classList.add('animate-in');
            
            switch (animationType) {
                case 'fade-up':
                    element.style.animation = 'fadeInUp 0.6s ease forwards';
                    break;
                case 'fade-left':
                    element.style.animation = 'fadeInLeft 0.6s ease forwards';
                    break;
                case 'fade-right':
                    element.style.animation = 'fadeInRight 0.6s ease forwards';
                    break;
                default:
                    element.style.animation = 'fadeInUp 0.6s ease forwards';
            }
        }, delay);
    }

    setupHoverEffects() {
        // Product showcase interactions
        const productFloats = document.querySelectorAll('.product-float');
        
        productFloats.forEach((product, index) => {
            product.addEventListener('mouseenter', () => {
                this.handleProductHover(product, productFloats);
            });
            
            product.addEventListener('mouseleave', () => {
                this.handleProductLeave(productFloats);
            });
        });

        // Social card hover effects
        const socialCards = document.querySelectorAll('.social-card');
        socialCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                this.addRippleEffect(card);
            });
        });
    }

    handleProductHover(activeProduct, allProducts) {
        allProducts.forEach(product => {
            if (product !== activeProduct) {
                product.style.opacity = '0.6';
                product.style.filter = 'blur(2px)';
            } else {
                product.style.zIndex = '20';
                product.style.filter = 'brightness(1.1)';
            }
        });
    }

    handleProductLeave(allProducts) {
        allProducts.forEach((product, index) => {
            product.style.opacity = '1';
            product.style.filter = '';
            product.style.zIndex = 3 - index; // Reset z-index
        });
    }

    addRippleEffect(element) {
        const ripple = document.createElement('div');
        ripple.className = 'ripple-effect';
        ripple.style.cssText = `
            position: absolute;
            background: radial-gradient(circle, rgba(255, 107, 71, 0.3) 0%, transparent 70%);
            border-radius: 50%;
            width: 100px;
            height: 100px;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%) scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
            z-index: 1;
        `;
        
        element.style.position = 'relative';
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    setupParallaxEffects() {
        let ticking = false;
        
        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.updateParallax();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
    }

    updateParallax() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        // Parallax on decorative elements
        const decorations = document.querySelectorAll('.decoration-circle');
        decorations.forEach((decoration, index) => {
            const speed = 0.3 + (index * 0.1);
            decoration.style.transform = `translateY(${scrolled * speed}px)`;
        });
        
        // Parallax on product showcase
        const productShowcase = document.querySelector('.product-showcase');
        if (productShowcase) {
            productShowcase.style.transform = `translateY(${rate * 0.2}px)`;
        }
    }

    setupPerformanceOptimizations() {
        // Lazy load animations
        this.setupIntersectionObserver();
        
        // Debounce resize events
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.handleResize();
            }, 250);
        });
    }

    setupIntersectionObserver() {
        const lazyAnimationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    this.startElementAnimations(entry.target);
                } else {
                    entry.target.classList.remove('in-view');
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: '100px 0px'
        });

        // Observe animated elements
        document.querySelectorAll('.countdown-section, .social-section, .store-section').forEach(el => {
            lazyAnimationObserver.observe(el);
        });

        this.observers.push(lazyAnimationObserver);
    }

    startElementAnimations(element) {
        if (element.classList.contains('countdown-section')) {
            this.animateCountdownBoxes();
        } else if (element.classList.contains('social-section')) {
            this.animateSocialCards();
        } else if (element.classList.contains('store-section')) {
            this.animateStoreCards();
        }
    }

    animateCountdownBoxes() {
        const boxes = document.querySelectorAll('.time-box');
        boxes.forEach((box, index) => {
            setTimeout(() => {
                box.style.animation = 'fadeInUp 0.5s ease forwards';
            }, index * 100);
        });
    }

    animateSocialCards() {
        const cards = document.querySelectorAll('.social-card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.style.animation = 'fadeInUp 0.6s ease forwards';
            }, index * 150);
        });
    }

    animateStoreCards() {
        const cards = document.querySelectorAll('.store-card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.style.animation = 'fadeInUp 0.5s ease forwards';
            }, index * 200);
        });
    }

    handleResize() {
        // Recalculate positions for absolute positioned elements
        const productShowcase = document.querySelector('.product-showcase');
        if (productShowcase) {
            // Trigger reflow for responsive adjustments
            productShowcase.style.height = 'auto';
            const newHeight = productShowcase.offsetHeight;
            productShowcase.style.height = `${Math.max(newHeight, 350)}px`;
        }
    }

    // Public methods
    pauseAnimations() {
        document.body.style.animationPlayState = 'paused';
    }

    resumeAnimations() {
        document.body.style.animationPlayState = 'running';
    }

    destroy() {
        this.observers.forEach(observer => observer.disconnect());
        this.observers = [];
    }
}

// Ripple animation keyframes
const rippleCSS = `
@keyframes ripple {
  0% {
    transform: translate(-50%, -50%) scale(0);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) scale(2);
    opacity: 0;
  }
}
`;

// Inject ripple CSS
const style = document.createElement('style');
style.textContent = rippleCSS;
document.head.appendChild(style);

// Export for use in other modules
window.AnimationManager = AnimationManager;