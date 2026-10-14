/**
 * ALEX TRAVIS LANDING PAGE — MAIN.JS
 * Vanilla JavaScript (No Frameworks, No Libraries)
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Pages Dropdown Toggle
  const dropdownBtn = document.getElementById('pages-dropdown-btn');
  const dropdownParent = dropdownBtn ? dropdownBtn.closest('.header__dropdown') : null;

  if (dropdownBtn && dropdownParent) {
    dropdownBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = dropdownParent.classList.toggle('header__dropdown--open');
      dropdownBtn.setAttribute('aria-expanded', String(isOpen));
    });

    document.addEventListener('click', (e) => {
      if (!dropdownParent.contains(e.target)) {
        dropdownParent.classList.remove('header__dropdown--open');
        dropdownBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // 2. Mobile Menu Toggle
  const hamburger = document.getElementById('mobile-menu-toggle');
  const nav = document.querySelector('.header__nav');

  if (hamburger && nav) {
    hamburger.addEventListener('click', () => {
      nav.classList.toggle('header__nav--mobile-open');
    });

    // Close mobile menu when clicking a link
    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        nav.classList.remove('header__nav--mobile-open');
      });
    });
  }

  // 3. Projects Category Tabs
  const projectTabs = document.querySelectorAll('.projects__tab');
  projectTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      projectTabs.forEach((t) => t.classList.remove('projects__tab--active'));
      tab.classList.add('projects__tab--active');
    });
  });

  // 4. Testimonials Tabs
  const testimonialTabs = document.querySelectorAll('.testimonials__tab');
  testimonialTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      testimonialTabs.forEach((t) => t.classList.remove('testimonials__tab--active'));
      tab.classList.add('testimonials__tab--active');
    });
  });

  // 5. FAQ Accordion: Optional exclusive open
  const faqItems = document.querySelectorAll('.faq__item');
  faqItems.forEach((item) => {
    item.addEventListener('toggle', () => {
      if (item.open) {
        faqItems.forEach((other) => {
          if (other !== item && other.open) {
            other.removeAttribute('open');
          }
        });
      }
    });
  });

  // 6. Cart Badge click feedback
  const cartBtn = document.querySelector('.header__cart-btn');
  if (cartBtn) {
    cartBtn.addEventListener('click', () => {
      const badge = cartBtn.querySelector('.header__cart-badge');
      if (badge) {
        const current = parseInt(badge.textContent || '0', 10);
        badge.textContent = String(current + 1);
      }
    });
  }
});
