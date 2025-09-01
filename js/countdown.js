// Countdown Timer Module
class CountdownTimer {
    constructor(targetDate = '2025-12-31T23:59:59') {
        this.targetDate = new Date(targetDate).getTime();
        this.elements = {
            days: document.getElementById('days'),
            hours: document.getElementById('hours'),
            minutes: document.getElementById('minutes'),
            seconds: document.getElementById('seconds')
        };
        this.interval = null;
        this.isComplete = false;
        this.init();
    }

    init() {
        if (this.validateElements()) {
            this.startCountdown();
            this.handleVisibilityChange();
        }
    }

    validateElements() {
        return Object.values(this.elements).every(el => el !== null);
    }

    startCountdown() {
        this.updateDisplay();
        this.interval = setInterval(() => {
            this.updateDisplay();
        }, 1000);
    }

    updateDisplay() {
        const now = new Date().getTime();
        const timeLeft = this.targetDate - now;

        if (timeLeft > 0) {
            const timeUnits = this.calculateTimeUnits(timeLeft);
            this.updateElements(timeUnits);
            this.animateNumbers();
        } else {
            this.handleCountdownComplete();
        }
    }

    calculateTimeUnits(timeLeft) {
        return {
            days: Math.floor(timeLeft / (1000 * 60 * 60 * 24)),
            hours: Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((timeLeft % (1000 * 60)) / 1000)
        };
    }

    updateElements(timeUnits) {
        Object.keys(this.elements).forEach(unit => {
            const element = this.elements[unit];
            const newValue = this.padZero(timeUnits[unit]);
            
            if (element.textContent !== newValue) {
                element.textContent = newValue;
                this.addUpdateAnimation(element);
            }
        });
    }

    addUpdateAnimation(element) {
        element.style.transform = 'scale(1.1)';
        element.style.color = 'var(--brand-secondary)';
        
        setTimeout(() => {
            element.style.transform = 'scale(1)';
            element.style.color = '';
        }, 200);
    }

    animateNumbers() {
        // Add subtle pulse animation to seconds
        const secondsElement = this.elements.seconds;
        if (secondsElement) {
            secondsElement.parentElement.style.animation = 'pulse 1s ease-in-out';
            setTimeout(() => {
                secondsElement.parentElement.style.animation = '';
            }, 1000);
        }
    }

    handleCountdownComplete() {
        if (!this.isComplete) {
            this.isComplete = true;
            this.stopCountdown();
            this.showCompletionMessage();
            this.dispatchCompleteEvent();
        }
    }

    showCompletionMessage() {
        Object.values(this.elements).forEach(element => {
            element.textContent = '00';
        });
        
        // You can add celebration animation here
        console.log('Countdown completed! 🎉');
    }

    dispatchCompleteEvent() {
        const event = new CustomEvent('countdownComplete', {
            detail: { timestamp: new Date().toISOString() }
        });
        document.dispatchEvent(event);
    }

    stopCountdown() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }

    handleVisibilityChange() {
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.stopCountdown();
            } else if (!this.isComplete) {
                this.startCountdown();
            }
        });
    }

    padZero(number) {
        return number.toString().padStart(2, '0');
    }

    // Public methods
    updateTargetDate(newDate) {
        this.targetDate = new Date(newDate).getTime();
        this.isComplete = false;
        if (!this.interval) {
            this.startCountdown();
        }
    }

    destroy() {
        this.stopCountdown();
        document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    }
}

// Export for use in other modules
window.CountdownTimer = CountdownTimer;