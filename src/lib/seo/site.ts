export const SITE_URL = 'https://calvinguillot.com';
export const SITE_NAME = 'Calvin Guillot';
export const SITE_LOCALE = 'en_US';

export const DEFAULT_OG_IMAGE = `${SITE_URL}/pp.webp`;

/**
 * Build a canonical URL from a path. Always uses the canonical host
 * and never produces a trailing slash (except the bare site URL for home).
 */
export function buildCanonical(path = '/'): string {
	if (!path || path === '/' || path === '') {
		return SITE_URL;
	}
	const normalized = path.startsWith('/') ? path : `/${path}`;
	const trimmed =
		normalized.length > 1 && normalized.endsWith('/') ? normalized.slice(0, -1) : normalized;
	return `${SITE_URL}${trimmed}`;
}

/**
 * Absolute URL for an OpenGraph image under `static/`.
 */
export function projectOgImage(image: string | null | undefined): string {
	if (!image) return DEFAULT_OG_IMAGE;
	const normalized = image.startsWith('/') ? image : `/${image}`;
	return `${SITE_URL}${normalized}`;
}

/**
 * Build page meta tags for a static page with sensible defaults.
 */
export function staticPageMetaTags({
	title,
	description,
	path,
	image
}: {
	title: string;
	description: string;
	path: string;
	image?: string | null;
}) {
	const canonical = buildCanonical(path);
	const ogImage = projectOgImage(image);
	return {
		title,
		description,
		canonical,
		openGraph: {
			type: 'website' as const,
			url: canonical,
			title: `${title} | ${SITE_NAME}`,
			description,
		}
	};
}
