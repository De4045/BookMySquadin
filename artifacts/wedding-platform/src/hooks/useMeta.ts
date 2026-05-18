import { useEffect } from "react";

interface MetaOptions {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: "website" | "article";
  keywords?: string;
}

const SITE_NAME = "Book My Squad";
const DEFAULT_DESC =
  "India's premium wedding & event planning marketplace. Discover top-tier vendors, stunning venues, and trusted professionals for your perfect wedding.";
const DEFAULT_IMG =
  "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&q=85";

function upsertMeta(attr: "name" | "property", key: string, content: string) {
  const sel = `meta[${attr}="${key}"]`;
  let el = document.querySelector<HTMLMetaElement>(sel);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

export function useMeta({
  title,
  description,
  image,
  url,
  type = "website",
  keywords,
}: MetaOptions = {}) {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
    const desc = description || DEFAULT_DESC;
    const img = image || DEFAULT_IMG;
    const canonical = url || window.location.href;

    document.title = fullTitle;

    upsertMeta("name", "description", desc);
    if (keywords) upsertMeta("name", "keywords", keywords);

    upsertMeta("property", "og:title", fullTitle);
    upsertMeta("property", "og:description", desc);
    upsertMeta("property", "og:image", img);
    upsertMeta("property", "og:url", canonical);
    upsertMeta("property", "og:type", type);
    upsertMeta("property", "og:site_name", SITE_NAME);

    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", fullTitle);
    upsertMeta("name", "twitter:description", desc);
    upsertMeta("name", "twitter:image", img);
  }, [title, description, image, url, type, keywords]);
}
