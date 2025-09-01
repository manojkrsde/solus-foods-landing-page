// Main Application Entry Point
class SolusFoodsApp {
    constructor() {
        this.modules = {};
        this.isInitialized = false;
        this.init();
    }

    async init() {
        try {
            await this.waitForDOM();
            this.initializeModules();
            this.setupGlobalEventListeners();
            this.handlePageLoad();
            this.isInitialized = true;
        } catch (error) {
            console.error('App initialization error:', error);
        }
    }

    waitForDOM() {
        return new Promise((resolve) => {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', resolve);
            } else {
                resolve();
            }
        });
    }

    initializeModules() {
        try {
            // Initialize theme manager first
            this.modules.theme = new ThemeManager();
            
            // Initialize other modules
            this.modules.countdown = new CountdownTimer();
            this.modules.email = new EmailSignup();
            this.modules.animations = new AnimationManager();
            
            console.log('All modules initialized successfully');
        } catch (error) {
            console.error('Module initialization error:', error);
        }
    }

    setupGlobalEventListeners() {
        // Custom event listeners
        document.addEventListener('themeChanged', (e) => {
            this.handleThemeChange(e.detail.theme);
        });

        document.addEventListener('countdownComplete', () => {
            this.handleCountdownComplete();
        });

        document.addEventListener('emailSignupSuccess', () => {
            this.handleEmailSignupSuccess();
        });

        // Performance monitoring
        window.addEventListener('load', () => {
            this.measurePerformance();
        });

        // Error handling
        window.addEventListener('error', (event) => {
            this.handleGlobalError(event);
        });

        window.addEventListener('unhandledrejection', (event) => {
            this.handleUnhandledRejection(event);
        });

        // Visibility change handling
        document.addEventListener('visibilitychange', () => {
            this.handleVisibilityChange();
        });
    }

    handlePageLoad() {
        // Page entrance animations
        setTimeout(() => {
            document.body.classList.add('loaded');
            this.startEntryAnimations();
        }, 100);

        // Initialize image loading
        this.initializeImageLoading();
        
        // Set up accessibility features
        this.setupAccessibility();
    }

    startEntryAnimations() {
        const heroContent = document.querySelector('.hero-content');
        const productShowcase = document.querySelector('.product-showcase');
        
        if (heroContent) {
            heroContent.style.opacity = '1';
            heroContent.style.animation = 'fadeInLeft 0.8s ease forwards';
        }
        
        if (productShowcase) {
            setTimeout(() => {
                productShowcase.style.opacity = '1';
                productShowcase.style.animation = 'fadeInRight 0.8s ease forwards';
            }, 200);
        }
    }

    initializeImageLoading() {
        const images = document.querySelectorAll('img');
        let loadedCount = 0;
        const totalImages = images.length;

        images.forEach(img => {
            if (img.complete) {
                img.classList.add('loaded');
                loadedCount++;
            } else {
                img.addEventListener('load', () => {
                    img.classList.add('loaded');
                    loadedCount++;
                    this.updateLoadingProgress(loadedCount, totalImages);
                });
                
                img.addEventListener('error', () => {
                    img.classList.add('error');
                    console.warn('Failed to load image:', img.src);
                    loadedCount++;
                    this.updateLoadingProgress(loadedCount, totalImages);
                });
            }
        });

        if (loadedCount === totalImages) {
            this.onAllImagesLoaded();
        }
    }

    updateLoadingProgress(loaded, total) {
        const progress = (loaded / total) * 100;
        
        if (progress === 100) {
            this.onAllImagesLoaded();
        }
    }

    onAllImagesLoaded() {
        document.body.classList.add('images-loaded');
        
        // Start product float animations
        const products = document.querySelectorAll('.product-float');
        products.forEach((product, index) => {
            setTimeout(() => {
                product.style.animation = `float ${4 + index}s ease-in-out infinite`;
                product.style.animationDelay = `${index * 1.5}s`;
            }, 500);
        });
    }

    setupAccessibility() {
        // Keyboard navigation support
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });

        // Skip link for screen readers
        this.addSkipLink();
        
        // ARIA live region for dynamic content
        this.setupAriaLiveRegion();
    }

    addSkipLink() {
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'skip-link sr-only';
        skipLink.addEventListener('focus', () => {
            skipLink.classList.remove('sr-only');
        });
        skipLink.addEventListener('blur', () => {
            skipLink.classList.add('sr-only');
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);
    }

    setupAriaLiveRegion() {
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        liveRegion.id = 'live-region';
        document.body.appendChild(liveRegion);
    }

    announceToScreenReader(message) {
        const liveRegion = document.getElementById('live-region');
        if (liveRegion) {
            liveRegion.textContent = message;
            setTimeout(() => {
                liveRegion.textContent = '';
            }, 1000);
        }
    }

    // Event Handlers
    handleThemeChange(theme) {
        this.announceToScreenReader(`Switched to ${theme} mode`);
        
        // Update any theme-dependent animations
        if (theme === 'dark') {
            document.body.classList.add('dark-theme-active');
        } else {
            document.body.classList.remove('dark-theme-active');
        }
    }

    handleCountdownComplete() {
        this.announceToScreenReader('Launch countdown completed!');
        
        // You could show a celebration animation here
        const countdownSection = document.querySelector('.countdown-section');
        if (countdownSection) {
            countdownSection.style.background = 'var(--gradient-success)';
            countdownSection.style.color = 'white';
        }
    }

    handleEmailSignupSuccess() {
        this.announceToScreenReader('Successfully joined the waitlist');
        
        // Track in analytics if available
        if (typeof gtag !== 'undefined') {
            gtag('event', 'conversion', {
                send_to: 'AW-CONVERSION_ID/CONVERSION_LABEL'
            });
        }
    }

    handleVisibilityChange() {
        if (document.hidden) {
            // Pause non-essential animations when page is hidden
            if (this.modules.animations) {
                this.modules.animations.pauseAnimations();
            }
        } else {
            // Resume animations when page becomes visible
            if (this.modules.animations) {
                this.modules.animations.resumeAnimations();
            }
        }
    }

    measurePerformance() {
        if ('performance' in window) {
            const perfData = performance.timing;
            const loadTime = perfData.loadEventEnd - perfData.navigationStart;
            
            console.log(`Solus Foods loaded in: ${loadTime}ms`);
            
            // Track performance in analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', 'timing_complete', {
                    name: 'load',
                    value: loadTime
                });
            }
        }
    }

    handleGlobalError(event) {
        console.error('Global error:', event.error);
        
        // In production, you might want to send this to an error tracking service
        if (typeof gtag !== 'undefined') {
            gtag('event', 'exception', {
                description: event.error.message,
                fatal: false
            });
        }
    }

    handleUnhandledRejection(event) {
        console.error('Unhandled promise rejection:', event.reason);
        
        // In production, you might want to send this to an error tracking service
        if (typeof gtag !== 'undefined') {
            gtag('event', 'exception', {
                description: event.reason,
                fatal: false
            });
        }
    }

    // Public API
    getModule(name) {
        return this.modules[name];
    }

    isAppReady() {
        return this.isInitialized;
    }

    destroy() {
        // Clean up all modules
        Object.values(this.modules).forEach(module => {
            if (module.destroy && typeof module.destroy === 'function') {
                module.destroy();
            }
        });
        
        this.modules = {};
        this.isInitialized = false;
    }
}

// Initialize the application
let app;

document.addEventListener('DOMContentLoaded', () => {
    app = new SolusFoodsApp();
});

// Make app globally available for debugging
window.SolusFoodsApp = app;

// Service Worker Registration (for future PWA features)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment when you have a service worker
        // navigator.serviceWorker.register('/sw.js')
        //     .then(registration => console.log('SW registered'))
        //     .catch(error => console.log('SW registration failed'));
    });
}