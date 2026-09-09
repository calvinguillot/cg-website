const STORAGE_KEY = 'theme';

function getInitialDark(): boolean {
	if (typeof document === 'undefined') return true;
	return document.documentElement.classList.contains('dark');
}

let isDark = $state(getInitialDark());

export function getIsDark(): boolean {
	return isDark;
}

export function setTheme(dark: boolean) {
	isDark = dark;
	if (typeof document === 'undefined') return;
	document.documentElement.classList.toggle('dark', dark);
	try {
		localStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light');
	} catch {
		// Ignore storage errors (private mode, etc.)
	}
}

export function toggleTheme() {
	setTheme(!isDark);
}
