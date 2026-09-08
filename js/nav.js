export function initNavigation() {
	const root = document.getElementById('app');
	const sections = {
		test: document.getElementById('tab-test'),
		resources: document.getElementById('tab-resources'),
		home: document.getElementById('tab-home')
	};
	const content = {
		resources: document.getElementById('resources'),
		home: document.getElementById('home')
	};
	const showTab = tab => {
		root.classList.toggle('hidden', tab !== 'test');
		content.resources?.classList.toggle('hidden', tab !== 'resources');
		content.home?.classList.toggle('hidden', tab !== 'home');
		Object.entries(sections).forEach(([name, button]) => button?.setAttribute('aria-selected', String(name === tab)));
	};
	Object.entries(sections).forEach(([name, button]) => button?.addEventListener('click', () => {
		showTab(name);
	}));
	showTab('home');
}
