const header = `
  <header class="site-header" role="banner">
    <div class="container nav-inner">
      <a class="site-title-link" href="/">PHSO Resource Vault</a>
      <nav aria-label="Main navigation">
        <a href="/" aria-current="page">Home</a>
      </nav>
    </div>
  </header>
`;

const footer = `
  <footer class="site-footer" role="contentinfo">
    <div class="container">
      <strong>Pilgrimage Homeschool Resource Vault</strong>
      <p>
        A student-run directory for Pilgrimage Homeschool Science Olympiad
        resources.
      </p>
      <a
        class="contact-btn"
        href="https://forms.gle/ts5h2raLVN2qbEpWA"
        target="_blank"
        rel="noopener noreferrer"
      >Contact / Report an Issue</a>
    </div>
  </footer>
`;

document.body.insertAdjacentHTML('afterbegin', header);
document.body.insertAdjacentHTML('beforeend', footer);
