/**
 * Main JavaScript - Vanilla ES6+
 * Tanpa framework, tanpa dependencies
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Website loaded successfully!');
  
  // Initialize all components
  initNavigation();
  initFormValidation();
  initScrollEffects();
  initAnimations();
  initCurrentYear();
  initDarkMode();
});

// ===== NAVIGATION =====
function initNavigation() {
  const header = document.querySelector('.site-header');
  const nav = document.querySelector('.nav');
  const navToggle = document.createElement('button');
  
  // Create mobile toggle button
  navToggle.className = 'nav-toggle';
  navToggle.innerHTML = '<span class="hamburger"></span><span class="sr-only">Menu</span>';
  navToggle.setAttribute('aria-label', 'Toggle navigation menu');
  navToggle.setAttribute('aria-expanded', 'false');
  navToggle.setAttribute('aria-controls', 'nav');
  
  // Insert toggle button before nav
  if (nav && nav.parentNode) {
    nav.parentNode.insertBefore(navToggle, nav);
    
    // Toggle mobile menu
    navToggle.addEventListener('click', () => {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
      navToggle.classList.toggle('active');
      nav.classList.toggle('active');
      document.body.style.overflow = isExpanded ? '' : 'hidden';
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target) && !navToggle.contains(e.target) && nav.classList.contains('active')) {
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.classList.remove('active');
        nav.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('active')) {
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.classList.remove('active');
        nav.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }
  
  // Highlight current page in navigation
  highlightCurrentPage();
}

function highlightCurrentPage() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav a');
  
  navLinks.forEach(link => {
    const linkPath = new URL(link.href).pathname;
    
    // Remove existing aria-current
    link.removeAttribute('aria-current');
    
    // Set aria-current for current page
    if (currentPath === linkPath || (currentPath === '/' && linkPath === '/')) {
      link.setAttribute('aria-current', 'page');
    }
  });
}

// ===== FORM VALIDATION =====
function initFormValidation() {
  const contactForm = document.querySelector('.contact form');
  
  if (!contactForm) return;
  
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form elements
    const name = this.querySelector('input[name="name"]');
    const email = this.querySelector('input[name="email"]');
    const message = this.querySelector('textarea[name="message"]');
    const submitBtn = this.querySelector('button[type="submit"]');
    
    // Simple validation
    let isValid = true;
    
    // Validate name
    if (!name.value.trim() || name.value.length < 2) {
      showError(name, 'Nama harus minimal 2 karakter');
      isValid = false;
    } else {
      clearError(name);
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value)) {
      showError(email, 'Email tidak valid');
      isValid = false;
    } else {
      clearError(email);
    }
    
    // Validate message
    if (!message.value.trim() || message.value.length < 10) {
      showError(message, 'Pesan harus minimal 10 karakter');
      isValid = false;
    } else {
      clearError(message);
    }
    
    // If valid, simulate form submission
    if (isValid) {
      // Disable button and show loading state
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Mengirim...';
      submitBtn.style.opacity = '0.7';
      
      // Simulate API call (replace with actual fetch)
      setTimeout(() => {
        // Show success message
        showFormMessage(this, 'success', 'Pesan berhasil dikirim! Terima kasih.');
        
        // Reset form
        this.reset();
        
        // Reset button
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        submitBtn.style.opacity = '1';
      }, 1500);
    }
  });
  
  // Real-time validation
  const inputs = contactForm.querySelectorAll('input, textarea');
  inputs.forEach(input => {
    input.addEventListener('blur', function() {
      if (this.value.trim()) {
        validateField(this);
      }
    });
  });
}

function validateField(field) {
  if (field.type === 'email') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(field.value)) {
      showError(field, 'Email tidak valid');
      return false;
    }
  }
  
  if (field.name === 'name' && field.value.length < 2) {
    showError(field, 'Nama harus minimal 2 karakter');
    return false;
  }
  
  if (field.name === 'message' && field.value.length < 10) {
    showError(field, 'Pesan harus minimal 10 karakter');
    return false;
  }
  
  clearError(field);
  return true;
}

function showError(field, message) {
  clearError(field);
  
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-message';
  errorDiv.textContent = message;
  errorDiv.style.color = 'var(--color-error)';
  errorDiv.style.fontSize = '0.875rem';
  errorDiv.style.marginTop = '0.25rem';
  
  field.parentNode.appendChild(errorDiv);
  field.style.borderColor = 'var(--color-error)';
}

function clearError(field) {
  const existingError = field.parentNode.querySelector('.error-message');
  if (existingError) {
    existingError.remove();
  }
  field.style.borderColor = '';
}

function showFormMessage(form, type, message) {
  // Remove existing messages
  const existingMsg = form.querySelector('.form-message');
  if (existingMsg) existingMsg.remove();
  
  const msgDiv = document.createElement('div');
  msgDiv.className = `form-message ${type}`;
  msgDiv.textContent = message;
  msgDiv.style.padding = '1rem';
  msgDiv.style.marginTop = '1rem';
  msgDiv.style.borderRadius = '0.5rem';
  msgDiv.style.textAlign = 'center';
  msgDiv.style.fontWeight = '600';
  
  if (type === 'success') {
    msgDiv.style.backgroundColor = 'rgba(16, 185, 129, 0.1)';
    msgDiv.style.color = 'var(--color-success)';
    msgDiv.style.border = '1px solid var(--color-success)';
  } else {
    msgDiv.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
    msgDiv.style.color = 'var(--color-error)';
    msgDiv.style.border = '1px solid var(--color-error)';
  }
  
  form.appendChild(msgDiv);
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    if (msgDiv.parentNode) {
      msgDiv.remove();
    }
  }, 5000);
}

// ===== SCROLL EFFECTS =====
function initScrollEffects() {
  const header = document.querySelector('.site-header');
  const backToTop = document.createElement('button');
  
  // Create back to top button
  backToTop.className = 'back-to-top';
  backToTop.innerHTML = '↑';
  backToTop.setAttribute('aria-label', 'Kembali ke atas');
  document.body.appendChild(backToTop);
  
  // Header scroll effect
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Add/remove scrolled class to header
    if (currentScroll > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    // Show/hide back to top button
    if (currentScroll > 300) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
    
    lastScroll = currentScroll;
  });
  
  // Back to top functionality
  backToTop.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    
    // Move focus to main content for accessibility
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.focus();
    }
  });
  
  // Keyboard navigation for back to top
  backToTop.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      backToTop.click();
    }
  });
}

// ===== ANIMATIONS =====
function initAnimations() {
  // Add intersection observer for scroll animations
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animated');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
      }
    );
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.feature, article');
    animateElements.forEach(el => {
      observer.observe(el);
    });
  }
  
  // Add CSS for animations
  const style = document.createElement('style');
  style.textContent = `
    .feature, article {
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .feature.animated, article.animated {
      opacity: 1;
      transform: translateY(0);
    }
    
    .feature:nth-child(1) { transition-delay: 0.1s; }
    .feature:nth-child(2) { transition-delay: 0.2s; }
    .feature:nth-child(3) { transition-delay: 0.3s; }
    article:nth-child(1) { transition-delay: 0.1s; }
    article:nth-child(2) { transition-delay: 0.2s; }
  `;
  document.head.appendChild(style);
}

// ===== CURRENT YEAR =====
function initCurrentYear() {
  const yearElements = document.querySelectorAll('footer p');
  const currentYear = new Date().getFullYear();
  
  yearElements.forEach(element => {
    element.textContent = element.textContent.replace('2025', currentYear);
  });
}

// ===== DARK MODE =====
function initDarkMode() {
  // Check for saved theme preference or system preference
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // Apply theme
  if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
  
  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      if (e.matches) {
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.removeAttribute('data-theme');
      }
    }
  });
  
  // Add theme toggle button (optional - uncomment to enable)
  // addThemeToggle();
}

function addThemeToggle() {
  const header = document.querySelector('.site-header .container');
  const themeToggle = document.createElement('button');
  
  themeToggle.className = 'theme-toggle';
  themeToggle.innerHTML = '🌓';
  themeToggle.setAttribute('aria-label', 'Toggle dark mode');
  
  // Insert at the end of header container
  if (header) {
    header.appendChild(themeToggle);
    
    themeToggle.addEventListener('click', () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      
      if (isDark) {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
        themeToggle.innerHTML = '🌙';
        themeToggle.setAttribute('aria-label', 'Switch to dark mode');
      } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        themeToggle.innerHTML = '☀️';
        themeToggle.setAttribute('aria-label', 'Switch to light mode');
      }
    });
  }
}

// ===== PERFORMANCE OPTIMIZATION =====
function initPerformance() {
  // Lazy load images
  if ('IntersectionObserver' in window) {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          img.classList.add('loaded');
          imageObserver.unobserve(img);
        }
      });
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
  }
  
  // Preload critical resources
  const preloadLinks = [
    { href: '/css/styles.css', as: 'style' },
    { href: '/js/main.js', as: 'script' }
  ];
  
  preloadLinks.forEach(link => {
    const preload = document.createElement('link');
    preload.rel = 'preload';
    preload.href = link.href;
    preload.as = link.as;
    document.head.appendChild(preload);
  });
}

// Initialize performance optimizations
initPerformance();

// ===== ERROR HANDLING =====
window.addEventListener('error', (e) => {
  console.error('JavaScript Error:', e.error);
  
  // You could send this to analytics service
  // sendToAnalytics(e.error);
});

// ===== PUBLIC API (optional - for debugging) =====
window.app = {
  highlightCurrentPage,
  validateField,
  showFormMessage,
  initDarkMode
};