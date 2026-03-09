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

      // Get submit button and disable it
      const submitBtn = quoteForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.textContent;
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;

      // Submit to API
      fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      .then(function(response) {
        return response.json();
      })
      .then(function(result) {
        if (result.success) {
          quoteForm.innerHTML = '<div style="text-align: center; padding: 2rem;"><h3 style="color: var(--green);">Thank You!</h3><p>Your quote request has been sent. We\'ll get back to you within 24 hours, usually much sooner.</p><p style="margin-top: 1rem;"><strong>Need faster service?</strong><br>Call us at <a href="tel:7372652600">737-265-2600</a></p></div>';
        } else {
          throw new Error(result.error || 'Failed to send');
        }
      })
      .catch(function(error) {
        console.error('Error:', error);
        submitBtn.textContent = originalBtnText;
        submitBtn.disabled = false;
        alert('Sorry, there was an error sending your request. Please call us at 737-265-2600.');
      });
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
