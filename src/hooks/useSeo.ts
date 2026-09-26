import { useEffect } from 'react';

interface SeoOptions {
  title: string;
  description: string;
  path: string; // e.g. '/' or '/card'
}

const SITE_URL = 'https://premiermobiletexas.com';

function setMetaTag(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

/**
 * Sets document.title, meta description, canonical link, and OG tags for the
 * current route on the client. Each route (/, /card) gets its own unique,
 * correctly-sized title and description instead of sharing the single
 * index.html <title> for every page.
 */
export function useSeo({ title, description, path }: SeoOptions) {
  useEffect(() => {
    document.title = title;

    setMetaTag('name', 'description', description);
    setMetaTag('property', 'og:title', title);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:url', `${SITE_URL}${path}`);

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', `${SITE_URL}${path}`);
  }, [title, description, path]);
}
