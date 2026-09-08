import { create, getField, getItemSeasons, normalize } from './helpers.js';

export function createRenderer(state, elements) {
	let bubbleResizeTimer;

	function adjustBubbleMinWidth() {
		clearTimeout(bubbleResizeTimer);
		bubbleResizeTimer = setTimeout(() => {
			const maxByType = {};
			elements.resultsContainer.querySelectorAll('.meta-bubble').forEach(bubble => {
				const type = bubble.dataset.type || 'default';
				maxByType[type] = Math.max(maxByType[type] || 0, bubble.scrollWidth);
			});

			['year', 'division', 'level', 'default'].forEach(type => {
				elements.resultsContainer.style.removeProperty(`--meta-bubble-min-${type}`);
			});
			Object.entries(maxByType).forEach(([type, width]) => {
				elements.resultsContainer.style.setProperty(`--meta-bubble-min-${type}`, `${Math.ceil(width)}px`);
			});
		}, 60);
	}

	function matches(item, query) {
		if (!query) return true;
		const fields = [
			getField(item, 'Tournament Full Name', 'tournament', 'event_name'),
			...(state.searchScope === 'collections' || state.searchScope === 'both'
				? [getField(item, 'event_name', 'Event')]
				: []),
			getField(item, 'Year', 'year', 'Year(s)'),
			getField(item, 'Division', 'division')
		];
		return fields.map(normalize).join(' ').includes(query);
	}

	function render() {
		const query = normalize(state.query);
		const yearFilter = elements.yearSelect.value;
		const divisionFilter = elements.divisionSelect.value;
		const matched = state.resources.filter(item => {
			const division = String(getField(item, 'Division', 'division') || '');
			return (!yearFilter || getItemSeasons(item).includes(yearFilter))
				&& (!divisionFilter || division === divisionFilter)
				&& matches(item, query);
		});

		elements.resultsContainer.replaceChildren();
		if (!matched.length) {
			elements.resultsContainer.appendChild(create('div', { class: 'empty' }, 'No results'));
			return;
		}

		matched.forEach(item => elements.resultsContainer.appendChild(createCard(item)));
		adjustBubbleMinWidth();
	}

	function createCard(item) {
		const source = item.__source === 'archive' ? 'archive' : 'collection';
		const card = create('div', { class: `card card--${source}` });
		const titleText = getField(item, 'Organization', 'organization')
			|| getField(item, 'Tournament Full Name', 'tournament', 'event_name', 'Abbr.', 'abbreviation')
			|| '(no title)';
		const titleAttributes = {
			class: 'title',
			href: getField(item, 'Link', 'link_url') || '#',
			target: '_blank',
			rel: 'noopener noreferrer'
		};
		card.appendChild(create('a', titleAttributes, titleText));

		const meta = create('div', { class: 'meta' });
		const values = {
			year: getField(item, 'Year', 'year', 'Year(s)'),
			division: getField(item, 'Division', 'division'),
			level: getField(item, 'Level', 'level')
		};
		Object.entries(values).forEach(([type, value]) => {
			if (String(value).trim()) {
				meta.appendChild(create('span', { class: 'meta-bubble', 'data-type': type }, String(value)));
			}
		});
		if (meta.children.length) card.appendChild(meta);
		return card;
	}

	window.addEventListener('resize', adjustBubbleMinWidth);
	return { render, adjustBubbleMinWidth };
}
