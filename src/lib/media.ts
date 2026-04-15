import { API_BASE_URL } from "@/lib/env";

const BACKEND_ORIGIN_FALLBACK = "http://127.0.0.1:8000";

export function resolveImageUrl(imageUrl?: string | null): string | null {
  if (!imageUrl) {
    return null;
  }

  if (/^https?:\/\//i.test(imageUrl)) {
    return imageUrl;
  }

  const normalizedPath = imageUrl
    .replace(/\\/g, "/")
    .replace(/^\.\//, "")
    .replace(/^\/+/, "");

  const directApiTarget = import.meta.env.VITE_API_PROXY_TARGET as
    | string
    | undefined;
  const apiSource = directApiTarget || API_BASE_URL;

  const apiOrigin = apiSource.startsWith("/")
    ? BACKEND_ORIGIN_FALLBACK
    : apiSource.replace(/\/api\/?$/, "");

  return `${apiOrigin}/${normalizedPath}`;
}
