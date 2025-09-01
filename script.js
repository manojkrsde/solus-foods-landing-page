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
            throw error;
        }
    }

    storeEmailLocally(email) {
        const emails = JSON.parse(localStorage.getItem('solusSignupEmails') || '[]');
        emails.push({
            email: email,
            timestamp: new Date().toISOString(),
            source: 'solus-foods-landing'
        });
        localStorage.setItem('solusSignupEmails', JSON.stringify(emails));
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

// Product Image Interactions
class ProductShowcase {
    constructor() {
        this.productImages = document.querySelectorAll('.product-img');
        this.init();
    }

    init() {
        this.productImages.forEach((img, index) => {
            // Add staggered animation delays
            img.style.animationDelay = `${index * 0.2}s`;
            
            // Add hover interactions
            img.addEventListener('mouseenter', () => this.handleHover(img));
            img.addEventListener('mouseleave', () => this.handleLeave(img));
        });
    }

    handleHover(img) {
        this.productImages.forEach(otherImg => {
            if (otherImg !== img) {
                otherImg.style.opacity = '0.7';
                otherImg.style.transform = 'scale(0.95)';
            }
        });
    }

    handleLeave(img) {
        this.productImages.forEach(otherImg => {
            otherImg.style.opacity = '1';
            otherImg.style.transform = '';
        });
    }
}

// Performance Monitor
class PerformanceMonitor {
    constructor() {
        this.init();
    }

    init() {
        window.addEventListener('load', () => {
            if ('performance' in window) {
                const perfData = performance.timing;
                const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
                console.log(`Page loaded in: ${pageLoadTime}ms`);
            }
        });

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

// Accessibility Manager
class AccessibilityManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupKeyboardNavigation();
        this.setupFocusManagement();
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });
    }

    setupFocusManagement() {
        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const themeManager = new ThemeManager();
    const countdownTimer = new CountdownTimer();
    const emailSignup = new EmailSignup();
    const productShowcase = new ProductShowcase();
    const performanceMonitor = new PerformanceMonitor();
    const accessibilityManager = new AccessibilityManager();

    // Add loaded class to body when everything is ready
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
    });
});

// Google Sheets Integration Helper
/*
Instructions for setting up Google Sheets integration:

1. Create a new Google Sheet for email signups
2. Go to Extensions > Apps Script in your Google Sheet
3. Replace the default code with:

function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSheet();
  const data = e.parameter;
  
  // Add headers if this is the first row
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

4. Save the script and deploy as a web app
5. Set permissions to "Anyone" for the web app
6. Copy the web app URL and replace YOUR_SCRIPT_ID in the googleSheetsURL variable above
*/

// Error Handling
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
});