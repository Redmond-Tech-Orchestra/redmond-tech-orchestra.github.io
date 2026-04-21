import { useEffect } from "react";

const SITE_NAME = "Redmond Tech Orchestra";
const ORIGIN = "https://www.redmondtechorchestra.org";

type PageMeta = {
  /** Page-specific title; org name is appended automatically. */
  title: string;
  /** Meta description for this page. Falls back to default if omitted. */
  description?: string;
  /** Path-only URL (e.g. "/concerts"). Used for canonical + og:url. Defaults to current pathname. */
  path?: string;
  /** Absolute URL to a representative image for OG/Twitter cards. */
  image?: string;
};

function setMeta(selector: string, attr: "content" | "href", value: string) {
  const el = document.head.querySelector<HTMLMetaElement | HTMLLinkElement>(selector);
  if (el) el.setAttribute(attr, value);
}

/**
 * Sets per-page document title, meta description, canonical URL,
 * Open Graph, and Twitter Card tags.
 *
 * Pass `title` as the page-specific part — the org name is appended.
 */
export function usePageMeta({ title, description, path, image }: PageMeta) {
  useEffect(() => {
    const fullTitle = `${title} · ${SITE_NAME}`;
    const url = ORIGIN + (path ?? window.location.pathname);

    const previous = {
      title: document.title,
    };

    document.title = fullTitle;
    if (description) {
      setMeta('meta[name="description"]', "content", description);
      setMeta('meta[name="twitter:description"]', "content", description);
      setMeta('meta[property="og:description"]', "content", description);
    }
    setMeta('link[rel="canonical"]', "href", url);
    setMeta('meta[property="og:title"]', "content", fullTitle);
    setMeta('meta[property="og:url"]', "content", url);
    setMeta('meta[name="twitter:title"]', "content", fullTitle);
    if (image) {
      setMeta('meta[property="og:image"]', "content", image);
      setMeta('meta[name="twitter:image"]', "content", image);
    }

    return () => {
      document.title = previous.title;
    };
  }, [title, description, path, image]);
}

/** Backwards-compatible: title-only update. */
export function usePageTitle(title: string) {
  usePageMeta({ title });
}
