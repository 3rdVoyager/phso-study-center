export function create(tag, attrs = {}, ...children) {
	const element = document.createElement(tag);

	for (const [key, value] of Object.entries(attrs)) {
		if (key === 'class') element.className = value;
		else if (key === 'dataset') Object.assign(element.dataset, value);
		else element.setAttribute(key, value);
	}

	children.forEach(child => {
		if (child == null) return;
		element.appendChild(typeof child === 'string' ? document.createTextNode(child) : child);
	});

	return element;
}

export function normalize(value) {
	return String(value || '').toLowerCase();
}

export function getField(item, ...names) {
	for (const name of names) {
		if (item[name] != null) return item[name];
	}
	return '';
}

function extractYears(value) {
	if (!value) return [];

	const years = new Set();
	const text = String(value);
	const rangeRegex = /\b(20\d{2})\s*[–-]\s*(20\d{2})\b/g;
	let match;

	while ((match = rangeRegex.exec(text)) !== null) {
		const start = Number.parseInt(match[1], 10);
		const end = Number.parseInt(match[2], 10);
		for (let year = start; year <= end; year += 1) years.add(year);
	}

	const yearRegex = /\b(20\d{2})\b/g;
	while ((match = yearRegex.exec(text)) !== null) years.add(Number.parseInt(match[1], 10));

	return [...years].sort((a, b) => a - b);
}

export function getItemSeasons(item) {
	const rawYear = getField(item, 'Year', 'year', 'Year(s)');
	return extractYears(rawYear).map(year => `${year}-${year + 1}`);
}
