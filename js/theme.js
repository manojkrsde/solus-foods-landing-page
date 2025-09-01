// Theme Management Module
class ThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('themeToggle');
        this.currentTheme = this.getStoredTheme() || this.getPreferredTheme();
        this.init();
    }

    init() {
        this.setTheme(this.currentTheme);
        this.bindEvents();
        this.setupSystemThemeListener();
    }

    getStoredTheme() {
        return localStorage.getItem('solus-theme');
    }

    getPreferredTheme() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.currentTheme = theme;
        localStorage.setItem('solus-theme', theme);
        this.updateThemeIcon();
        this.dispatchThemeChange();
    }

    updateThemeIcon() {
        const lightIcon = this.themeToggle.querySelector('.light-icon');
        const darkIcon = this.themeToggle.querySelector('.dark-icon');
        
        if (this.currentTheme === 'dark') {
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

    bindEvents() {
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
        
        // Keyboard support
        this.themeToggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.toggleTheme();
            }
        });
    }

    setupSystemThemeListener() {
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addEventListener('change', (e) => {
                if (!this.getStoredTheme()) {
                    this.setTheme(e.matches ? 'dark' : 'light');
                }
            });
        }
    }

    dispatchThemeChange() {
        const event = new CustomEvent('themeChanged', {
            detail: { theme: this.currentTheme }
        });
        document.dispatchEvent(event);
    }

    getCurrentTheme() {
        return this.currentTheme;
    }
}

// Export for use in other modules
window.ThemeManager = ThemeManager;