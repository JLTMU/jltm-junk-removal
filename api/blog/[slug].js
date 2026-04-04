// Vercel Serverless Function: Render blog post from Admin Hub
// Route: /api/blog/[slug]

export default async function handler(req, res) {
  const { slug } = req.query;

  if (!slug) {
    return res.status(400).json({ error: 'Slug required' });
  }

  try {
    // Fetch post from Admin Hub
    const apiUrl = `https://admin.jltmunlimited.com/api/blog/public/jltm-junk/${slug}`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
      // Post not found - return 404 page
      return res.status(404).send(generate404Page(slug));
    }

    const post = await response.json();

    // Generate and return full HTML page
    const html = generatePostPage(post);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
    return res.status(200).send(html);

  } catch (error) {
    console.error('Error fetching post:', error);
    return res.status(500).send(generateErrorPage());
  }
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function generatePostPage(post) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-VJSSY9Q6Q5"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-VJSSY9Q6Q5');
  </script>

  <!-- Microsoft Clarity -->
  <script type="text/javascript">
    (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "w4yiwm3v07");
  </script>

  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${escapeHtml(post.excerpt)}">
  <title>${escapeHtml(post.title)} | JLTM Junk Removal</title>

  <meta property="og:title" content="${escapeHtml(post.title)}">
  <meta property="og:description" content="${escapeHtml(post.excerpt)}">
  <meta property="og:url" content="https://jltmjunk.com/blog/${post.slug}">
  <meta property="og:type" content="article">

  <link rel="icon" type="image/jpeg" href="/images/Final.Logo.jpg">
  <link rel="canonical" href="https://jltmjunk.com/blog/${post.slug}">
  <link rel="stylesheet" href="/css/styles.css">

  <style>
    .blog-post { max-width: 800px; margin: 0 auto; }
    .blog-post-header { margin-bottom: 2rem; }
    .blog-post-meta { color: var(--gray-dark); margin-bottom: 1rem; }
    .blog-post-content { line-height: 1.8; }
    .blog-post-content h2 { margin-top: 2rem; margin-bottom: 1rem; color: var(--black); }
    .blog-post-content h3 { margin-top: 1.5rem; margin-bottom: 0.75rem; color: var(--black); }
    .blog-post-content p { margin-bottom: 1.25rem; }
    .blog-post-content ul, .blog-post-content ol { margin-bottom: 1.25rem; padding-left: 1.5rem; }
    .blog-post-content li { margin-bottom: 0.5rem; }
    .blog-post-content blockquote { border-left: 4px solid var(--green); padding-left: 1rem; margin: 1.5rem 0; font-style: italic; color: var(--gray-dark); }
    .blog-post-content a { color: var(--green); }
    .blog-post-content figure { margin: 2rem 0; }
    .blog-post-content img { max-width: 100%; height: auto; border-radius: 8px; }
    .blog-post-content figcaption { font-size: 0.875rem; color: var(--gray-dark); margin-top: 0.5rem; text-align: center; }
    .back-to-blog { display: inline-block; margin-bottom: 1.5rem; color: var(--green); font-weight: 600; }
    .back-to-blog:hover { text-decoration: underline; }
  </style>
</head>
<body>

  <!-- Header -->
  <header class="header">
    <div class="container">
      <div class="header-inner">
        <a href="/index.html" class="logo">
          <img src="/images/Final.Logo.jpg" alt="JLTM Junk Removal Logo">
        </a>

        <nav class="nav">
          <ul>
            <li><a href="/index.html">Home</a></li>
            <li><a href="/services.html">Services</a></li>
            <li><a href="/pricing.html">Pricing</a></li>
            <li><a href="/service-areas.html">Service Areas</a></li>
            <li><a href="/about.html">About</a></li>
            <li><a href="/blog/">Blog</a></li>
            <li><a href="/contact.html">Contact</a></li>
          </ul>
        </nav>

        <a href="tel:7372652600" class="header-phone">
          <svg viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
          737-265-2600
        </a>
        <a href="/contact.html" class="btn btn-primary header-cta">Get a Quote</a>

        <button class="mobile-menu-btn" aria-label="Menu" aria-expanded="false">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      <nav class="mobile-nav">
        <ul>
          <li><a href="/index.html">Home</a></li>
          <li><a href="/services.html">Services</a></li>
          <li><a href="/pricing.html">Pricing</a></li>
          <li><a href="/service-areas.html">Service Areas</a></li>
          <li><a href="/about.html">About</a></li>
          <li><a href="/blog/">Blog</a></li>
          <li><a href="/contact.html">Contact</a></li>
          <li><a href="tel:7372652600" class="mobile-phone-cta">
            <svg viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
            Call Now: 737-265-2600
          </a></li>
        </ul>
      </nav>
    </div>
  </header>

  <!-- Blog Post -->
  <section class="section">
    <div class="container">
      <article class="blog-post">
        <a href="/blog/" class="back-to-blog">← Back to Blog</a>

        <header class="blog-post-header">
          <h1>${escapeHtml(post.title)}</h1>
          <div class="blog-post-meta">${formatDate(post.publishedDate)}</div>
        </header>

        <div class="blog-post-content">
          ${post.content}
        </div>
      </article>
    </div>
  </section>

  <!-- CTA Section -->
  <section class="cta-section">
    <div class="container">
      <h2>Ready to Clear the Clutter?</h2>
      <p>Get a free quote today — most jobs completed same-week.</p>
      <a href="/contact.html" class="btn">Get Your Free Quote</a>
    </div>
  </section>

  <!-- Footer -->
  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-about">
          <div class="footer-logo">
            <img src="/images/Final.Logo.jpg" alt="JLTM Junk Removal">
          </div>
          <p class="footer-tagline">Trusted. Efficient. Local.<br>Based in Leander, serving Williamson County.</p>
          <div class="social-links">
            <a href="https://www.facebook.com/profile.php?id=61585031226084" target="_blank" rel="noopener" aria-label="Facebook">
              <svg viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
          </div>
        </div>

        <div>
          <h4>Service Areas</h4>
          <ul>
            <li><a href="/junk-removal-leander.html">Leander</a></li>
            <li><a href="/junk-removal-cedar-park.html">Cedar Park</a></li>
            <li><a href="/junk-removal-georgetown.html">Georgetown</a></li>
            <li><a href="/junk-removal-liberty-hill.html">Liberty Hill</a></li>
            <li><a href="/junk-removal-round-rock.html">Round Rock</a></li>
          </ul>
        </div>

        <div>
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/services.html">Services</a></li>
            <li><a href="/pricing.html">Pricing</a></li>
            <li><a href="/about.html">About Us</a></li>
            <li><a href="/contact.html">Contact</a></li>
          </ul>
        </div>

        <div>
          <h4>Contact</h4>
          <ul>
            <li><a href="tel:7372652600">737-265-2600</a></li>
            <li><a href="mailto:info@jltmjunk.com">info@jltmjunk.com</a></li>
            <li>Mon-Sat: 7am-6pm</li>
            <li>Sun: By appointment</li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <p>&copy; 2026 JLTM Junk Removal. All rights reserved. | Website by <a href="https://jltmweb.com" target="_blank" rel="noopener noreferrer">JLTM Web Services</a></p>
      </div>
    </div>
  </footer>

  <!-- Floating CTA -->
  <div class="floating-cta">
    <div class="phone-display">
      <a href="tel:7372652600">737-265-2600</a>
    </div>
    <a href="tel:7372652600" class="btn btn-primary mobile-cta">
      <svg viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
      Call Now
    </a>
    <a href="/contact.html" class="btn mobile-quote-cta">Get Quote</a>
    <a href="/contact.html" class="btn btn-primary desktop-cta">Get Quote</a>
  </div>

  <script src="/js/script.js"></script>
</body>
</html>`;
}

function generate404Page(slug) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Post Not Found | JLTM Junk Removal</title>
  <link rel="stylesheet" href="/css/styles.css">
</head>
<body>
  <div style="text-align: center; padding: 4rem 2rem;">
    <h1>Post Not Found</h1>
    <p>The blog post "${escapeHtml(slug)}" could not be found.</p>
    <a href="/blog/" style="color: var(--green);">← Back to Blog</a>
  </div>
</body>
</html>`;
}

function generateErrorPage() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Error | JLTM Junk Removal</title>
</head>
<body>
  <div style="text-align: center; padding: 4rem 2rem;">
    <h1>Something went wrong</h1>
    <p>We couldn't load this blog post. Please try again later.</p>
    <a href="/blog/">← Back to Blog</a>
  </div>
</body>
</html>`;
}

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
