import { create, getOpenLinksSetting } from './helpers.js';

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
	const metadataToggleBtn = create('button', {
		type: 'button',
		class: 'control-btn metadata-btn',
		'aria-expanded': 'false'
	}, 'Metadata');
	const resultsContainer = create('div', { class: 'results grid' });

	controls.append(searchInput, scopeSelect, yearSelect, divisionSelect,
		create('span', { class: 'spacer' }), viewToggleBtn, metadataToggleBtn);
	root.append(controls, resultsContainer);

	return { root, controls, searchInput, scopeSelect, yearSelect, divisionSelect,
		viewToggleBtn, metadataToggleBtn, resultsContainer };
}

export function initMetadataPanel(state, elements, render) {
	const panel = create('div', {
		class: 'settings-panel metadata-panel',
		'aria-hidden': 'true',
		id: 'metadata-panel'
	});
	const options = ['year', 'division', 'level', 'source'].map(type => {
		const label = type[0].toUpperCase() + type.slice(1);
		const id = `meta-${type}`;
		const checkbox = create('input', { type: 'checkbox', id });
		checkbox.checked = state.enabledMetadata.has(type);
		const wrapper = create('label', { class: 'meta-option', for: id, 'data-type': type },
			checkbox, ` ${label}`);
		wrapper.classList.toggle('meta-checked', checkbox.checked);
		panel.appendChild(wrapper);
		return { checkbox, wrapper, type };
	});
	const allButton = create('button', { type: 'button', class: 'control-btn quick primary' }, 'All');
	const noneButton = create('button', { type: 'button', class: 'control-btn quick' }, 'None');
	panel.prepend(create('div', { class: 'quick-actions' }, allButton, noneButton));
	document.body.appendChild(panel);

	const update = () => {
		state.enabledMetadata = new Set(options.filter(option => option.checkbox.checked).map(option => option.type));
		options.forEach(option => option.wrapper.classList.toggle('meta-checked', option.checkbox.checked));
		try {
			localStorage.setItem('scioly_enabled_metadata', JSON.stringify([...state.enabledMetadata]));
		} catch {}
		render();
	};
	options.forEach(option => option.checkbox.addEventListener('change', update));
	allButton.addEventListener('click', () => {
		options.forEach(option => { option.checkbox.checked = true; });
		update();
	});
	noneButton.addEventListener('click', () => {
		options.forEach(option => { option.checkbox.checked = false; });
		update();
	});

	elements.metadataToggleBtn.addEventListener('click', () => {
		const open = elements.metadataToggleBtn.getAttribute('aria-expanded') === 'true';
		elements.metadataToggleBtn.setAttribute('aria-expanded', String(!open));
		panel.setAttribute('aria-hidden', String(open));
		if (!open) {
			const rect = elements.metadataToggleBtn.getBoundingClientRect();
			requestAnimationFrame(() => {
				const width = panel.offsetWidth;
				const left = Math.min(rect.left + window.scrollX,
					window.scrollX + window.innerWidth - width - 12);
				panel.style.left = `${Math.max(window.scrollX + 12, left)}px`;
				panel.style.top = `${rect.bottom + window.scrollY + 8}px`;
			});
		}
	});

	return panel;
}

export function initSettings(elements, render) {
	const settingsButton = create('button', {
		type: 'button',
		class: 'control-btn settings-btn',
		'aria-expanded': 'false',
		'aria-controls': 'settings-panel'
	}, 'Settings');
	const settingsPanel = create('div', {
		id: 'settings-panel',
		class: 'settings-panel',
		'aria-hidden': 'true'
	});
	const header = document.querySelector('.site-header');
	(header || elements.controls).append(settingsButton, settingsPanel);

	const openLinksButton = create('button', { type: 'button', id: 'open-links-toggle', 'aria-pressed': 'true', class: 'toggle-btn' });
	const resetButton = create('button', { type: 'button', id: 'reset-saved-session', class: 'control-btn danger' }, 'Reset saved session');
	settingsPanel.appendChild(create('div', { class: 'setting-row' }, openLinksButton, resetButton));

	const updateOpenLinksLabel = value => {
		openLinksButton.setAttribute('aria-pressed', String(value));
		openLinksButton.textContent = value ? 'Open links in new tab' : 'Open links in this tab';
	};
	updateOpenLinksLabel(getOpenLinksSetting());
	openLinksButton.addEventListener('click', () => {
		const next = openLinksButton.getAttribute('aria-pressed') !== 'true';
		updateOpenLinksLabel(next);
		try { localStorage.setItem('scioly_open_new_tab', String(next)); } catch {}
		render();
	});
	resetButton.addEventListener('click', () => {
		if (!confirm('Reset saved session? This will clear saved settings and presets for this site.')) return;
		['scioly_enabled_metadata', 'scioly_grid_size', 'scioly_sort',
			'scioly_open_new_tab', 'scioly_restore_filters', 'scioly_filter_presets']
			.forEach(key => localStorage.removeItem(key));
		location.reload();
	});

	settingsButton.addEventListener('click', () => {
		const open = settingsButton.getAttribute('aria-expanded') === 'true';
		settingsButton.setAttribute('aria-expanded', String(!open));
		settingsPanel.setAttribute('aria-hidden', String(open));
	});
	document.addEventListener('click', event => {
		if (!settingsPanel.contains(event.target) && !settingsButton.contains(event.target)) {
			settingsButton.setAttribute('aria-expanded', 'false');
			settingsPanel.setAttribute('aria-hidden', 'true');
		}
	});

	return { settingsButton, settingsPanel };
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

