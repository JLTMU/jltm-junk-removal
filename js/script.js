// JLTM Junk Removal - Main JavaScript

document.addEventListener('DOMContentLoaded', function() {
  // Mobile Menu Toggle
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const mobileNav = document.querySelector('.mobile-nav');

  if (mobileMenuBtn && mobileNav) {
    mobileMenuBtn.addEventListener('click', function() {
      mobileNav.classList.toggle('active');
      this.setAttribute('aria-expanded',
        this.getAttribute('aria-expanded') === 'true' ? 'false' : 'true'
      );
    });

    // Close menu when clicking a link
    mobileNav.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() {
        mobileNav.classList.remove('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Header scroll effect
  const header = document.querySelector('.header');
  let lastScroll = 0;

  window.addEventListener('scroll', function() {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
      header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.15)';
    } else {
      header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    }

    lastScroll = currentScroll;
  });

  // Quote Form Submission
  const quoteForm = document.getElementById('quote-form');

  if (quoteForm) {
    quoteForm.addEventListener('submit', function(e) {
      e.preventDefault();

      // Get form data
      const formData = new FormData(quoteForm);
      const data = Object.fromEntries(formData.entries());

      // Basic validation
      const required = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'message'];
      let valid = true;

      required.forEach(function(field) {
        const input = quoteForm.querySelector(`[name="${field}"]`);
        if (!data[field] || data[field].trim() === '') {
          input.style.borderColor = '#dc3545';
          valid = false;
        } else {
          input.style.borderColor = '';
        }
      });

      if (!valid) {
        alert('Please fill in all required fields.');
        return;
      }

      // Format message for email
      const subject = encodeURIComponent('Quote Request from ' + data.firstName + ' ' + data.lastName);
      const body = encodeURIComponent(
        'Name: ' + data.firstName + ' ' + data.lastName + '\n' +
        'Email: ' + data.email + '\n' +
        'Phone: ' + data.phone + '\n' +
        'Address: ' + data.address + (data.address2 ? ', ' + data.address2 : '') + ', ' + data.city + ', TX ' + data.zip + '\n' +
        'Estimated Capacity: ' + (data.capacity || 'Not specified') + '\n\n' +
        'Message:\n' + data.message
      );

      // Open email client
      window.location.href = 'mailto:info@jltmjunk.com?subject=' + subject + '&body=' + body;

      // Show success message
      alert('Thank you! Your email client will open with your quote request. If it doesn\'t open, please call us at 737-265-2600.');
    });
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const headerHeight = header.offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // Active nav link based on current page
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav a, .mobile-nav a').forEach(function(link) {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // Intersection Observer for animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  // Animate elements on scroll
  document.querySelectorAll('.feature-card, .service-card, .area-card, .step').forEach(function(el) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
  });

  // Phone number formatting
  const phoneInput = document.querySelector('input[name="phone"]');
  if (phoneInput) {
    phoneInput.addEventListener('input', function(e) {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length > 10) value = value.slice(0, 10);

      if (value.length >= 6) {
        value = '(' + value.slice(0,3) + ') ' + value.slice(3,6) + '-' + value.slice(6);
      } else if (value.length >= 3) {
        value = '(' + value.slice(0,3) + ') ' + value.slice(3);
      }

      e.target.value = value;
    });
  }
});
