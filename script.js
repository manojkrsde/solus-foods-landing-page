// Theme Management
class ThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('themeToggle');
        this.currentTheme = localStorage.getItem('solus-theme') || 'light';
        this.init();
    }

    init() {
        this.setTheme(this.currentTheme);
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.currentTheme = theme;
        localStorage.setItem('solus-theme', theme);
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
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
        
        // Google Sheets Web App URL
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
            this.showMessage('Please enter a valid email address', 'error');
            return;
        }

        this.setLoading(true);

        try {
            await this.submitToGoogleSheets(email);
            this.showMessage('🎉 You\'re on the waitlist! We\'ll notify you when we launch.', 'success');
            this.emailInput.value = '';
        } catch (error) {
            console.error('Submission error:', error);
            this.showMessage('Oops! Something went wrong. Please try again.', 'error');
        }

        this.setLoading(false);
    }

    async submitToGoogleSheets(email) {
        const formData = new FormData();
        formData.append('email', email);
        formData.append('timestamp', new Date().toISOString());
        formData.append('source', 'solus-foods-landing');

        try {
            const response = await fetch(this.googleSheetsURL, {
                method: 'POST',
                body: formData,
                mode: 'no-cors'
            });
            
            return Promise.resolve();
        } catch (error) {
            this.storeEmailLocally(email);
            return Promise.resolve();
        }
    }

    storeEmailLocally(email) {
        const emails = JSON.parse(localStorage.getItem('solusWaitlist') || '[]');
        emails.push({
            email: email,
            timestamp: new Date().toISOString(),
            source: 'solus-foods-landing'
        });
        localStorage.setItem('solusWaitlist', JSON.stringify(emails));
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

// Product Showcase Interactions
class ProductShowcase {
    constructor() {
        this.productItems = document.querySelectorAll('.product-item');
        this.init();
    }

    init() {
        this.productItems.forEach((item, index) => {
            item.addEventListener('mouseenter', () => this.handleHover(item, index));
            item.addEventListener('mouseleave', () => this.handleLeave());
        });
    }

    handleHover(activeItem, index) {
        this.productItems.forEach((item, i) => {
            if (i !== index) {
                item.style.opacity = '0.6';
                item.style.transform = 'scale(0.95)';
            } else {
                item.style.zIndex = '20';
            }
        });
    }

    handleLeave() {
        this.productItems.forEach((item, index) => {
            item.style.opacity = '1';
            item.style.transform = '';
            if (index === 0) {
                item.style.zIndex = '3';
            } else if (index === 1) {
                item.style.zIndex = '2';
            } else {
                item.style.zIndex = '1';
            }
        });
    }
}

// Loading Manager
class LoadingManager {
    constructor() {
        this.init();
    }

    init() {
        // Monitor images loading
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

        // Page load performance
        window.addEventListener('load', () => {
            document.body.classList.add('loaded');
            
            if ('performance' in window) {
                const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
                console.log(`Solus Foods loaded in: ${loadTime}ms`);
            }
        });
    }
}

// Accessibility Manager
class AccessibilityManager {
    constructor() {
        this.init();
    }

    init() {
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });

        // Skip to main content (for screen readers)
        this.addSkipLink();
    }

    addSkipLink() {
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'skip-link';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: var(--warm-orange);
            color: white;
            padding: 8px 16px;
            text-decoration: none;
            border-radius: 4px;
            z-index: 10000;
            transition: top 0.2s ease;
        `;
        
        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '6px';
        });
        
        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const themeManager = new ThemeManager();
    const countdownTimer = new CountdownTimer();
    const emailSignup = new EmailSignup();
    const productShowcase = new ProductShowcase();
    const loadingManager = new LoadingManager();
    const accessibilityManager = new AccessibilityManager();

    // Add smooth entrance animations
    setTimeout(() => {
        document.querySelector('.hero-section').style.opacity = '1';
        document.querySelector('.hero-section').style.transform = 'translateY(0)';
    }, 100);

    setTimeout(() => {
        document.querySelector('.product-showcase').style.opacity = '1';
        document.querySelector('.product-showcase').style.transform = 'translateY(0)';
    }, 300);
});

// Google Sheets Integration Setup Instructions
/*
To connect email signups to Google Sheets:

1. Create a new Google Sheet with columns: Timestamp, Email, Source
2. Go to Extensions > Apps Script
3. Paste this code:

function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSheet();
  const data = e.parameter;
  
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Timestamp', 'Email', 'Source']);
  }
  
  sheet.appendRow([
    new Date(data.timestamp),
    data.email,
    data.source
  ]);
  
  return ContentService
    .createTextOutput(JSON.stringify({result: 'success'}))
    .setMimeType(ContentService.MimeType.JSON);
}

4. Deploy as web app with "Anyone" access
5. Replace YOUR_SCRIPT_ID in the googleSheetsURL with your script ID
*/

// Error Handling
window.addEventListener('error', (event) => {
    console.error('Solus Foods Error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Solus Foods Promise Error:', event.reason);
});