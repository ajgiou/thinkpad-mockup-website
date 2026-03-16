(function () {
  'use strict';

  // ── Sticky nav scroll effect ─────────────────────
  // Uses IntersectionObserver instead of scroll events
  // for better performance. Adds a subtle bottom border
  // to the header once the hero scrolls out of view.

  var header = document.querySelector('.site-header');
  var hero = document.querySelector('.hero-section');

  var scrollObserver = new IntersectionObserver(function (entries) {
    header.classList.toggle('scrolled', !entries[0].isIntersecting);
  });

  scrollObserver.observe(hero);

  // ── Mobile hamburger menu ────────────────────────

  var toggle = document.querySelector('.nav-toggle');
  var menu = document.getElementById('nav-menu');
  var menuLinks = menu.querySelectorAll('a');

  function openMenu() {
    toggle.setAttribute('aria-expanded', 'true');
    menu.classList.add('is-open');
    menuLinks[0].focus();
  }

  function closeMenu() {
    toggle.setAttribute('aria-expanded', 'false');
    menu.classList.remove('is-open');
    toggle.focus();
  }

  toggle.addEventListener('click', function () {
    var isOpen = toggle.getAttribute('aria-expanded') === 'true';
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Close menu on Escape key
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && menu.classList.contains('is-open')) {
      closeMenu();
    }
  });

  // Focus trap: keep Tab cycling through toggle + menu links
  // while the mobile menu is open
  document.addEventListener('keydown', function (event) {
    if (!menu.classList.contains('is-open') || event.key !== 'Tab') return;

    var focusable = [toggle];
    menuLinks.forEach(function (link) { focusable.push(link); });

    var first = focusable[0];
    var last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  // Close menu when a nav link is clicked (smooth scroll on mobile)
  menuLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      if (menu.classList.contains('is-open')) {
        toggle.setAttribute('aria-expanded', 'false');
        menu.classList.remove('is-open');
      }
    });
  });

  // ── Contact form validation ──────────────────────

  var form = document.getElementById('contact-form');
  var successMessage = document.getElementById('form-success');

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    var isValid = true;

    // Clear previous errors
    form.querySelectorAll('.field-error').forEach(function (el) {
      el.textContent = '';
    });
    form.querySelectorAll('.field-invalid').forEach(function (el) {
      el.classList.remove('field-invalid');
    });

    var nameField = document.getElementById('name');
    var emailField = document.getElementById('email');
    var messageField = document.getElementById('message');

    // Validate name
    if (!nameField.value.trim()) {
      showError(nameField, 'name-error', 'Please enter your name.');
      isValid = false;
    }

    // Validate email
    if (!emailField.value.trim()) {
      showError(emailField, 'email-error', 'Please enter your email address.');
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value.trim())) {
      showError(emailField, 'email-error', 'Please enter a valid email address.');
      isValid = false;
    }

    // Validate message
    if (!messageField.value.trim()) {
      showError(messageField, 'message-error', 'Please enter a message.');
      isValid = false;
    }

    if (isValid) {
      form.setAttribute('hidden', '');
      successMessage.removeAttribute('hidden');
      successMessage.focus();
    }
  });

  function showError(field, errorId, message) {
    field.classList.add('field-invalid');
    document.getElementById(errorId).textContent = message;
  }

  // Clear individual field errors as the user types
  form.querySelectorAll('input, textarea').forEach(function (field) {
    field.addEventListener('input', function () {
      field.classList.remove('field-invalid');
      var errorId = field.getAttribute('aria-describedby');
      if (errorId) {
        document.getElementById(errorId).textContent = '';
      }
    });
  });

})();