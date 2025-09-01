# Solus Foods - Coming Soon Website

## Overview

Solus Foods is a premium healthy snacks and dry fruits brand featuring a modern "coming soon" landing page. The website showcases the brand's focus on quality organic treats and makhana fox nuts with an elegant, responsive design. Built as a static website with vanilla HTML, CSS, and JavaScript, it emphasizes visual appeal and user engagement while preparing visitors for the upcoming product launch.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Static Website**: Pure HTML5, CSS3, and vanilla JavaScript without frameworks
- **Component-Based Classes**: JavaScript uses ES6 classes for modular functionality (ThemeManager, NavigationManager)
- **Responsive Design**: Mobile-first approach with CSS Grid and Flexbox layouts
- **Progressive Enhancement**: Core functionality works without JavaScript, enhanced features layer on top

### Design System
- **CSS Custom Properties**: Comprehensive theming system using CSS variables for consistent styling
- **Dual Theme Support**: Light and dark mode with automatic persistence via localStorage
- **Typography Hierarchy**: Google Fonts integration (Inter for body text, Playfair Display for headings)
- **Glass Morphism Effects**: Modern UI trend with backdrop-filter and rgba backgrounds

### User Experience Features
- **Theme Persistence**: User's theme preference saved across browser sessions
- **Smooth Scrolling**: CSS scroll-behavior for seamless navigation
- **Mobile Navigation**: Hamburger menu for responsive mobile experience
- **Accessibility**: ARIA labels and semantic HTML structure

### Performance Optimizations
- **Font Loading**: Preconnect links for faster Google Fonts loading
- **Icon Library**: Font Awesome CDN for scalable vector icons
- **Local Storage**: Client-side theme preference storage
- **CSS-Only Animations**: Hardware-accelerated transitions and transforms

## External Dependencies

### CDN Services
- **Google Fonts API**: Typography (Inter and Playfair Display font families)
- **Font Awesome CDN**: Icon library (version 6.4.0) for UI elements and social icons

### Browser APIs
- **Local Storage API**: Theme preference persistence across sessions
- **CSS Custom Properties**: Native CSS variable support for theming system

### Font Resources
- **Inter Font Family**: Modern sans-serif for body text and UI elements
- **Playfair Display**: Elegant serif font for headings and brand elements