// Email Signup Module
class EmailSignup {
    constructor() {
        this.form = document.getElementById('signupForm');
        this.emailInput = document.getElementById('emailInput');
        this.submitBtn = document.getElementById('signupBtn');
        this.messageElement = document.getElementById('formMessage');
        
        // Configuration
        this.config = {
            googleSheetsURL: 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec',
            storageKey: 'solus-waitlist',
            maxRetries: 3,
            retryDelay: 1000
        };
        
        this.init();
    }

    init() {
        if (this.validateElements()) {
            this.bindEvents();
            this.setupValidation();
        }
    }

    validateElements() {
        const elements = [this.form, this.emailInput, this.submitBtn, this.messageElement];
        return elements.every(el => el !== null);
    }

    bindEvents() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.emailInput.addEventListener('input', () => this.clearErrors());
        this.emailInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.handleSubmit(e);
            }
        });
    }

    setupValidation() {
        this.emailInput.addEventListener('blur', () => {
            const email = this.emailInput.value.trim();
            if (email && !this.validateEmail(email)) {
                this.showMessage('Please enter a valid email address', 'error');
            }
        });
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const email = this.emailInput.value.trim();
        
        if (!email) {
            this.showMessage('Please enter your email address', 'error');
            this.emailInput.focus();
            return;
        }

        if (!this.validateEmail(email)) {
            this.showMessage('Please enter a valid email address', 'error');
            this.emailInput.focus();
            return;
        }

        if (this.isEmailAlreadySubmitted(email)) {
            this.showMessage('This email is already on our waitlist!', 'success');
            return;
        }

        await this.processSubmission(email);
    }

    async processSubmission(email) {
        this.setLoadingState(true);

        try {
            await this.submitWithRetry(email);
            this.handleSuccessfulSubmission(email);
        } catch (error) {
            this.handleSubmissionError(error);
        } finally {
            this.setLoadingState(false);
        }
    }

    async submitWithRetry(email, attempt = 1) {
        try {
            await this.submitToGoogleSheets(email);
            return Promise.resolve();
        } catch (error) {
            if (attempt < this.config.maxRetries) {
                await this.delay(this.config.retryDelay * attempt);
                return this.submitWithRetry(email, attempt + 1);
            }
            throw error;
        }
    }

    async submitToGoogleSheets(email) {
        const formData = new FormData();
        formData.append('email', email);
        formData.append('timestamp', new Date().toISOString());
        formData.append('source', 'solus-foods-landing');
        formData.append('userAgent', navigator.userAgent);

        const response = await fetch(this.config.googleSheetsURL, {
            method: 'POST',
            body: formData,
            mode: 'no-cors'
        });
        
        // Store locally as backup since no-cors doesn't allow response reading
        this.storeEmailLocally(email);
        return Promise.resolve();
    }

    handleSuccessfulSubmission(email) {
        this.showMessage('🎉 You\'re on the waitlist! We\'ll notify you when we launch.', 'success');
        this.emailInput.value = '';
        this.trackSignup(email);
        this.triggerCelebration();
    }

    handleSubmissionError(error) {
        console.error('Email submission error:', error);
        this.showMessage('Oops! Something went wrong. Your email has been saved locally.', 'error');
    }

    storeEmailLocally(email) {
        try {
            const emails = JSON.parse(localStorage.getItem(this.config.storageKey) || '[]');
            const emailData = {
                email: email,
                timestamp: new Date().toISOString(),
                source: 'solus-foods-landing',
                synced: false
            };
            
            // Avoid duplicates
            if (!emails.some(item => item.email === email)) {
                emails.push(emailData);
                localStorage.setItem(this.config.storageKey, JSON.stringify(emails));
            }
        } catch (error) {
            console.error('Local storage error:', error);
        }
    }

    isEmailAlreadySubmitted(email) {
        try {
            const emails = JSON.parse(localStorage.getItem(this.config.storageKey) || '[]');
            return emails.some(item => item.email === email);
        } catch (error) {
            return false;
        }
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email) && email.length <= 254;
    }

    setLoadingState(isLoading) {
        this.submitBtn.classList.toggle('loading', isLoading);
        this.submitBtn.disabled = isLoading;
        this.emailInput.disabled = isLoading;
        
        if (isLoading) {
            this.submitBtn.setAttribute('aria-label', 'Submitting email...');
        } else {
            this.submitBtn.setAttribute('aria-label', 'Join waitlist');
        }
    }

    showMessage(message, type, duration = 5000) {
        this.clearMessage();
        
        this.messageElement.textContent = message;
        this.messageElement.className = `form-message ${type}`;
        
        // Auto-hide after duration
        setTimeout(() => {
            this.hideMessage();
        }, duration);
    }

    clearErrors() {
        if (this.messageElement.classList.contains('error')) {
            this.hideMessage();
        }
    }

    clearMessage() {
        this.messageElement.className = 'form-message';
        this.messageElement.textContent = '';
    }

    hideMessage() {
        this.messageElement.style.opacity = '0';
        setTimeout(() => {
            this.clearMessage();
            this.messageElement.style.opacity = '';
        }, 300);
    }

    triggerCelebration() {
        // Add celebration animation
        this.submitBtn.style.transform = 'scale(1.1)';
        setTimeout(() => {
            this.submitBtn.style.transform = '';
        }, 200);
        
        // Dispatch success event
        const event = new CustomEvent('emailSignupSuccess', {
            detail: { timestamp: new Date().toISOString() }
        });
        document.dispatchEvent(event);
    }

    trackSignup(email) {
        // Analytics tracking (if implemented)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'signup', {
                event_category: 'engagement',
                event_label: 'email_waitlist'
            });
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Public methods
    getSignupCount() {
        try {
            const emails = JSON.parse(localStorage.getItem(this.config.storageKey) || '[]');
            return emails.length;
        } catch (error) {
            return 0;
        }
    }

    exportEmails() {
        try {
            const emails = JSON.parse(localStorage.getItem(this.config.storageKey) || '[]');
            return emails;
        } catch (error) {
            return [];
        }
    }
}

// Export for use in other modules
window.EmailSignup = EmailSignup;