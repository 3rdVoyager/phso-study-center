const links = [
	{ href: '/', label: 'Home', path: '/' },
	{ href: '/resource-vault/', label: 'Resource Vault', path: '/resource-vault/' },
	{ href: '/about', label: 'About', path: '/about' }
];

const currentPath = location.pathname.endsWith('/')
	? location.pathname
	: `${location.pathname}/`;
const navigation = links.map(link => {
	const current = currentPath === link.path;
	return `<a href="${link.href}"${current ? ' aria-current="page"' : ''}>${link.label}</a>`;
}).join('');

const header = `
  <header class="site-header">
    <a class="site-title" href="/">
      <img class="brand-logo" src="/assets/favicon/web-app-manifest-512x512.png" alt="" />
      <span>PHSO Resource Vault</span>
    </a>
    <nav aria-label="Main navigation">${navigation}</nav>
  </header>
`;

const footer = `
  <footer class="site-footer">
    <div class="footer-brand">
      <img class="brand-logo" src="/assets/favicon/web-app-manifest-512x512.png" alt="" />
      <strong>Pilgrimage Homeschool Resource Vault</strong>
    </div>
    <p>
      An internal directory for Science Olympiad study materials and resources.
    </p>
    <a href="/about#contact">Contact / Report an Issue</a>
  </footer>
`;

document.body.insertAdjacentHTML('afterbegin', header);
document.body.insertAdjacentHTML('beforeend', footer);
