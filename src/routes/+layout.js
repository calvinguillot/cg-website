import { defineBaseMetaTags } from 'svelte-meta-tags';
import { DEFAULT_OG_IMAGE, SITE_LOCALE, SITE_NAME, SITE_URL } from '$lib/seo/site';

export const prerender = true;

export function load() {
	const baseMetaTags = defineBaseMetaTags({
		titleTemplate: `%s | ${SITE_NAME}`,
		title: 'Portfolio',
		description:
			'Art portfolio of Calvin Guillot — new media artist and creative technologist based in Helsinki.',
		canonical: SITE_URL,
		openGraph: {
			type: 'website',
			siteName: SITE_NAME,
			locale: SITE_LOCALE,
			url: SITE_URL,
			images: [
				{
					url: DEFAULT_OG_IMAGE,
					width: 1200,
					height: 630,
					alt: SITE_NAME
				}
			]
		},
		twitter: {
			cardType: 'summary_large_image'
		}
	});

	return { ...baseMetaTags };
}
