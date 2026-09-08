import { readMetadataSetting } from './helpers.js';
import { createRenderer } from './render.js';
import { state } from './state.js';
import {
	applyTheme,
	createElements,
	initMetadataPanel,
	initNavigation,
	initSettings
} from './ui.js';

const elements = createElements();
state.enabledMetadata = readMetadataSetting();
const renderer = createRenderer(state, elements);

elements.searchInput.addEventListener('input', event => {
	state.query = event.target.value.trim();
	renderer.render();
});
elements.scopeSelect.addEventListener('change', event => {
	state.searchScope = event.target.value;
	renderer.render();
});
[elements.yearSelect, elements.divisionSelect].forEach(select => {
	select.addEventListener('change', renderer.render);
});
elements.viewToggleBtn.addEventListener('click', () => {
	state.viewMode = state.viewMode === 'grid' ? 'list' : 'grid';
	elements.resultsContainer.classList.toggle('grid', state.viewMode === 'grid');
	elements.resultsContainer.classList.toggle('list', state.viewMode === 'list');
	elements.viewToggleBtn.textContent = state.viewMode === 'grid' ? 'Switch to list' : 'Switch to grid';
});

initMetadataPanel(state, elements, renderer.render);
initSettings(elements, renderer.render, applyTheme);
initNavigation();
renderer.render();

window.SciolyResourceVault = {
	getData: () => state.resources,
	getCollections: () => state.collections,
	getArchives: () => state.archives,
	setView: view => {
		state.viewMode = view;
		elements.resultsContainer.classList.toggle('grid', view === 'grid');
		elements.resultsContainer.classList.toggle('list', view === 'list');
	}
};
