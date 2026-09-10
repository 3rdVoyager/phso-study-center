const header = `
  <header class="site-header">
    <a class="site-title" href="/">
      <img class="brand-logo" src="/assets/favicon/web-app-manifest-512x512.png"/>
      <span>PHSO Study Center</span>
    </a>
    <nav>
      <a class="button nav-link" href="/">Home</a>
      <a class="button nav-link" href="/study-center/">Study Center</a>
      <a class="button nav-link" href="/about">About</a>
      <a class="button nav-link" href="/admin">Admin</a>
    </nav>
  </header>
`;

const footer = `
  <footer class="site-footer">
    <div class="footer-brand">
      <img class="brand-logo" src="/assets/favicon/web-app-manifest-512x512.png" alt="" />
      <strong>PHSO Study Center</strong>
    </div>
    <p>
      An internal directory for Science Olympiad study materials and resources.
    </p>
    <a href="/about#contact">Contact / Report an Issue</a>
  </footer>
`;

document.body.insertAdjacentHTML('afterbegin', header);
document.body.insertAdjacentHTML('beforeend', footer);
