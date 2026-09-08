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

