// Theme Management
class ThemeManager {
  constructor() {
    this.themeToggle = document.getElementById("themeToggle");
    this.currentTheme = localStorage.getItem("solus-theme") || "dark";
    this.init();
  }

  init() {
    this.setTheme(this.currentTheme);
    this.themeToggle.addEventListener("click", () => this.toggleTheme());
  }

  setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    this.currentTheme = theme;
    localStorage.setItem("solus-theme", theme);
  }

  toggleTheme() {
    const newTheme = this.currentTheme === "light" ? "dark" : "light";
    this.setTheme(newTheme);
  }
}

// Countdown Timer
class CountdownTimer {
  constructor() {
    this.targetDate = new Date("2025-09-31T23:59:59").getTime();
    this.elements = {
      days: document.getElementById("days"),
      hours: document.getElementById("hours"),
      minutes: document.getElementById("minutes"),
      seconds: document.getElementById("seconds"),
    };
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
      const hours = Math.floor(
        (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

      this.elements.days.textContent = this.padZero(days);
      this.elements.hours.textContent = this.padZero(hours);
      this.elements.minutes.textContent = this.padZero(minutes);
      this.elements.seconds.textContent = this.padZero(seconds);
    } else {
      Object.values(this.elements).forEach((el) => (el.textContent = "00"));
    }
  }

  padZero(number) {
    return number.toString().padStart(2, "0");
  }
}

// Email Signup
class EmailSignup {
  constructor() {
    this.form = document.getElementById("signupForm");
    this.emailInput = document.getElementById("emailInput");
    this.submitBtn = document.getElementById("signupBtn");
    this.messageElement = document.getElementById("formMessage");
    this.googleSheetsURL =
      "https://script.google.com/macros/s/AKfycbzfC39kXJKIjXeY_MP-SsZBHyjlxONhsDXGT8GaAeCgHfgdR3M9vGS29sJKaxKdB66C/exec";
    https: this.init();
  }

  init() {
    this.form.addEventListener("submit", (e) => this.handleSubmit(e));
  }

  async handleSubmit(e) {
    e.preventDefault();

    const email = this.emailInput.value.trim();

    if (!this.validateEmail(email)) {
      this.showMessage("Please enter a valid email address", "error");
      return;
    }

    this.setLoading(true);

    try {
      console.log("Called: ");
      await this.submitToGoogleSheets(email);
      this.showMessage(
        "🎉 You're on the waitlist! We'll notify you when we launch.",
        "success"
      );
      this.emailInput.value = "";
    } catch (error) {
      this.showMessage("Something went wrong. Please try again.", "error");
    }

    this.setLoading(false);
  }

  async submitToGoogleSheets(email) {
    const formData = new FormData();
    formData.append("email", email);
    formData.append("timestamp", new Date().toISOString());

    try {
      await fetch(this.googleSheetsURL, {
        method: "POST",
        body: formData,
        mode: "no-cors",
      });
    } catch (error) {
      this.storeEmailLocally(email);
    }
  }

  storeEmailLocally(email) {
    const emails = JSON.parse(localStorage.getItem("solusWaitlist") || "[]");
    emails.push({
      email: email,
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem("solusWaitlist", JSON.stringify(emails));
  }

  validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  setLoading(isLoading) {
    this.submitBtn.classList.toggle("loading", isLoading);
    this.submitBtn.disabled = isLoading;
    this.emailInput.disabled = isLoading;
  }

  showMessage(message, type) {
    this.messageElement.textContent = message;
    this.messageElement.className = `form-message ${type}`;

    setTimeout(() => {
      this.messageElement.style.opacity = "0";
      setTimeout(() => {
        this.messageElement.className = "form-message";
        this.messageElement.textContent = "";
        this.messageElement.style.opacity = "";
      }, 300);
    }, 4000);
  }
}

// Animations and Interactions
class AnimationManager {
  constructor() {
    this.init();
  }

  init() {
    this.setupProductHover();
    this.setupImageLoading();
  }

  setupProductHover() {
    const products = document.querySelectorAll(".product-float");

    products.forEach((product, index) => {
      product.addEventListener("mouseenter", () => {
        products.forEach((p, i) => {
          if (i !== index) {
            p.style.opacity = "0.6";
            p.style.filter = "blur(2px)";
          }
        });
      });

      product.addEventListener("mouseleave", () => {
        products.forEach((p) => {
          p.style.opacity = "1";
          p.style.filter = "";
        });
      });
    });
  }

  setupImageLoading() {
    const images = document.querySelectorAll("img");
    images.forEach((img) => {
      if (img.complete) {
        img.classList.add("loaded");
      } else {
        img.addEventListener("load", () => img.classList.add("loaded"));
      }
    });
  }
}

// Main App
document.addEventListener("DOMContentLoaded", () => {
  const themeManager = new ThemeManager();
  const countdownTimer = new CountdownTimer();
  const emailSignup = new EmailSignup();
  const animationManager = new AnimationManager();

  // Page load animations
  setTimeout(() => {
    document.querySelector(".hero-content").style.animation =
      "fadeInLeft 0.6s ease forwards";
    document.querySelector(".product-showcase").style.animation =
      "fadeInRight 0.6s ease forwards";
  }, 100);
});
