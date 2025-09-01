// Theme Management
class ThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('themeToggle');
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        this.setTheme(this.currentTheme);
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.currentTheme = theme;
        localStorage.setItem('theme', theme);
        
        // Update theme toggle icon
        const lightIcon = this.themeToggle.querySelector('.light-icon');
        const darkIcon = this.themeToggle.querySelector('.dark-icon');
        
        if (theme === 'dark') {
            lightIcon.style.display = 'none';
            darkIcon.style.display = 'block';
        } else {
            lightIcon.style.display = 'block';
            darkIcon.style.display = 'none';
        }
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }
}

// Navigation Management
class NavigationManager {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.hamburger = document.getElementById('hamburger');
        this.navMenu = document.getElementById('navMenu');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.init();
    }

    init() {
        this.hamburger.addEventListener('click', () => this.toggleMobileMenu());
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMobileMenu());
        });
        
        // Handle scroll for navbar background
        window.addEventListener('scroll', () => this.handleScroll());
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.navbar.contains(e.target)) {
                this.closeMobileMenu();
            }
        });
    }

    toggleMobileMenu() {
        this.navMenu.classList.toggle('active');
        this.hamburger.classList.toggle('active');
    }

    closeMobileMenu() {
        this.navMenu.classList.remove('active');
        this.hamburger.classList.remove('active');
    }

    handleScroll() {
        if (window.scrollY > 100) {
            this.navbar.style.background = 'var(--glass-bg)';
            this.navbar.style.backdropFilter = 'blur(20px)';
        } else {
            this.navbar.style.background = 'var(--glass-bg)';
            this.navbar.style.backdropFilter = 'blur(15px)';
        }
    }
}

// Hero Image Slider
class HeroSlider {
    constructor() {
        this.slides = document.querySelectorAll('.hero-slide');
        this.currentSlide = 0;
        this.slideInterval = null;
        this.init();
    }

    init() {
        if (this.slides.length > 1) {
            this.startSlideshow();
        }
    }

    startSlideshow() {
        this.slideInterval = setInterval(() => {
            this.nextSlide();
        }, 5000); // Change slide every 5 seconds
    }

    nextSlide() {
        this.slides[this.currentSlide].classList.remove('active');
        this.currentSlide = (this.currentSlide + 1) % this.slides.length;
        this.slides[this.currentSlide].classList.add('active');
    }

    stopSlideshow() {
        if (this.slideInterval) {
            clearInterval(this.slideInterval);
        }
    }
}

// Countdown Timer
class CountdownTimer {
    constructor() {
        this.targetDate = new Date('2025-12-31T23:59:59').getTime();
        this.daysElement = document.getElementById('days');
        this.hoursElement = document.getElementById('hours');
        this.minutesElement = document.getElementById('minutes');
        this.secondsElement = document.getElementById('seconds');
        this.init();
    }

    init() {
        this.updateCountdown();
        setInterval(() => this.updateCountdown(), 1000);
    }

    updateCountdown() {
        const now = new Date().getTime();
        const timeLeft = this.targetDate - now;

        if (timeLeft > 0) {
            const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

            this.daysElement.textContent = this.padZero(days);
            this.hoursElement.textContent = this.padZero(hours);
            this.minutesElement.textContent = this.padZero(minutes);
            this.secondsElement.textContent = this.padZero(seconds);
        } else {
            // Countdown finished
            this.daysElement.textContent = '00';
            this.hoursElement.textContent = '00';
            this.minutesElement.textContent = '00';
            this.secondsElement.textContent = '00';
        }
    }

    padZero(number) {
        return number.toString().padStart(2, '0');
    }
}

// Email Signup Form
class EmailSignup {
    constructor() {
        this.form = document.getElementById('signupForm');
        this.emailInput = document.getElementById('emailInput');
        this.submitBtn = document.getElementById('signupBtn');
        this.messageElement = document.getElementById('formMessage');
        
        // Google Sheets Web App URL - Replace with your actual URL
        this.googleSheetsURL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';
        
        this.init();
    }

    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const email = this.emailInput.value.trim();
        
        if (!this.validateEmail(email)) {
            this.showMessage('Please enter a valid email address.', 'error');
            return;
        }

        this.setLoading(true);

        try {
            await this.submitToGoogleSheets(email);
            this.showMessage('Thank you! We\'ll notify you when we launch.', 'success');
            this.emailInput.value = '';
        } catch (error) {
            console.error('Submission error:', error);
            this.showMessage('Something went wrong. Please try again later.', 'error');
        }

        this.setLoading(false);
    }

    async submitToGoogleSheets(email) {
        const formData = new FormData();
        formData.append('email', email);
        formData.append('timestamp', new Date().toISOString());
        formData.append('source', 'coming-soon-page');

        // Try to submit to Google Sheets
        try {
            const response = await fetch(this.googleSheetsURL, {
                method: 'POST',
                body: formData,
                mode: 'no-cors' // Required for Google Sheets
            });
            
            // Since we're using no-cors, we can't check the response
            // We'll assume it succeeded if no error was thrown
            return Promise.resolve();
        } catch (error) {
            // Fallback: Store in localStorage as backup
            this.storeEmailLocally(email);
            throw error;
        }
    }

    storeEmailLocally(email) {
        const emails = JSON.parse(localStorage.getItem('signupEmails') || '[]');
        emails.push({
            email: email,
            timestamp: new Date().toISOString(),
            source: 'coming-soon-page'
        });
        localStorage.setItem('signupEmails', JSON.stringify(emails));
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    setLoading(isLoading) {
        this.submitBtn.classList.toggle('loading', isLoading);
        this.submitBtn.disabled = isLoading;
        this.emailInput.disabled = isLoading;
    }

    showMessage(message, type) {
        this.messageElement.textContent = message;
        this.messageElement.className = `form-message ${type}`;
        
        // Hide message after 5 seconds
        setTimeout(() => {
            this.messageElement.style.opacity = '0';
            setTimeout(() => {
                this.messageElement.className = 'form-message';
                this.messageElement.textContent = '';
                this.messageElement.style.opacity = '';
            }, 300);
        }, 5000);
    }
}

// Animation Observer (Simple AOS-like functionality)
class AnimationObserver {
    constructor() {
        this.elements = document.querySelectorAll('[data-aos]');
        this.init();
    }

    init() {
        if ('IntersectionObserver' in window) {
            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('aos-animate');
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '50px 0px -50px 0px'
            });

            this.elements.forEach(element => {
                this.observer.observe(element);
            });
        } else {
            // Fallback for older browsers
            this.elements.forEach(element => {
                element.classList.add('aos-animate');
            });
        }
    }
}

// Smooth Scrolling
class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        // Handle navigation link clicks
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute('href'));
                if (target) {
                    const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// Performance Monitoring
class PerformanceMonitor {
    constructor() {
        this.init();
    }

    init() {
        // Monitor page load performance
        window.addEventListener('load', () => {
            if ('performance' in window) {
                const perfData = performance.timing;
                const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
                console.log(`Page load time: ${pageLoadTime}ms`);
            }
        });

        // Monitor images loading
        this.monitorImages();
    }

    monitorImages() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            if (img.complete) {
                img.classList.add('loaded');
            } else {
                img.addEventListener('load', () => {
                    img.classList.add('loaded');
                });
                img.addEventListener('error', () => {
                    img.classList.add('error');
                    console.warn('Failed to load image:', img.src);
                });
            }
        });
    }
}

// Accessibility Enhancements
class AccessibilityManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupKeyboardNavigation();
        this.setupFocusManagement();
        this.setupAriaLabels();
    }

    setupKeyboardNavigation() {
        // Handle Escape key to close mobile menu
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const navMenu = document.getElementById('navMenu');
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                }
            }
        });
    }

    setupFocusManagement() {
        // Ensure focus is visible
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
    }

    setupAriaLabels() {
        // Add aria-labels where needed
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle && !themeToggle.getAttribute('aria-label')) {
            themeToggle.setAttribute('aria-label', 'Toggle dark/light mode');
        }
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all managers
    const themeManager = new ThemeManager();
    const navigationManager = new NavigationManager();
    const heroSlider = new HeroSlider();
    const countdownTimer = new CountdownTimer();
    const emailSignup = new EmailSignup();
    const animationObserver = new AnimationObserver();
    const smoothScroll = new SmoothScroll();
    const performanceMonitor = new PerformanceMonitor();
    const accessibilityManager = new AccessibilityManager();

    // Add loading complete class to body
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
    });

    // Handle resize events
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Trigger any resize-dependent functionality
            console.log('Window resized');
        }, 250);
    });
});

// Google Sheets Integration Helper
// Instructions for setting up Google Sheets integration:
/*
1. Create a new Google Sheet
2. Go to Extensions > Apps Script
3. Replace the default code with:

function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSheet();
  const data = e.parameter;
  
  sheet.appendRow([
    new Date(),
    data.email,
    data.source
  ]);
  
  return ContentService
    .createTextOutput(JSON.stringify({result: 'success'}))
    .setMimeType(ContentService.MimeType.JSON);
}

4. Save and deploy as web app
5. Copy the web app URL and replace YOUR_SCRIPT_ID in the googleSheetsURL variable above
6. Set permissions to "Anyone" for the web app
*/

// Service Worker Registration (for future PWA features)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment when you have a service worker file
        // navigator.serviceWorker.register('/sw.js')
        //     .then(registration => console.log('SW registered'))
        //     .catch(registrationError => console.log('SW registration failed'));
    });
}

// Error Handling
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    // In production, you might want to send this to an error tracking service
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    // In production, you might want to send this to an error tracking service
});
