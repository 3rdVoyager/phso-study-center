import { create } from './helpers.js';

export function createElements() {
	const root = document.getElementById('app');
	if (!root) throw new Error('Root element with id "app" not found.');

	const controls = create('div', { class: 'controls' });
	const searchInput = create('input', {
		type: 'search',
		placeholder: 'Search (any field)...',
		'aria-label': 'Search resources'
	});
	const scopeSelect = create('select', {
		id: 'scope-select',
		class: 'filter scope-select',
		'aria-label': 'Search scope'
	});
	[
		['collections', 'Tournament Collections'],
		['archives', 'Web Archives'],
		['both', 'Both']
	].forEach(([value, label]) => scopeSelect.appendChild(create('option', { value }, label)));

	const yearSelect = create('select', { class: 'filter', 'aria-label': 'Filter by year' });
	const divisionSelect = create('select', { class: 'filter', 'aria-label': 'Filter by division' });
	const viewToggleBtn = create('button', { type: 'button', class: 'view-toggle' }, 'Switch to list');
	const resultsContainer = create('div', { class: 'results grid' });

	controls.append(searchInput, scopeSelect, yearSelect, divisionSelect,
		create('span', { class: 'spacer' }), viewToggleBtn);
	root.append(controls, resultsContainer);

	return { root, controls, searchInput, scopeSelect, yearSelect, divisionSelect,
		viewToggleBtn, resultsContainer };
}

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
	const toggle = document.getElementById('sidebar-toggle');
	const sidebar = document.getElementById('sidebar');
	const overlay = document.getElementById('sidebar-overlay');
	const setSidebar = open => {
		const isOpen = typeof open === 'boolean' ? open : !sidebar?.classList.contains('open');
		sidebar?.classList.toggle('open', isOpen);
		sidebar?.setAttribute('aria-hidden', String(!isOpen));
		toggle?.setAttribute('aria-expanded', String(isOpen));
		overlay?.classList.toggle('visible', isOpen);
		overlay?.classList.toggle('hidden', !isOpen);
	};
	Object.entries(sections).forEach(([name, button]) => button?.addEventListener('click', () => {
		showTab(name);
		setSidebar(false);
	}));
	showTab('home');
	toggle?.addEventListener('click', () => setSidebar());
	overlay?.addEventListener('click', () => setSidebar(false));
	document.addEventListener('keydown', event => {
		if (event.key === 'Escape') setSidebar(false);
	});
}

