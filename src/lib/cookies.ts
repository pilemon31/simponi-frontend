const DEFAULT_MAX_AGE = 60 * 60 * 24 * 7; // 7 days
const LARGE_STORAGE_KEYS = ['ACCESS_TOKEN', 'REFRESH_TOKEN'];
const MAX_COOKIE_SIZE = 3500;

export function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined;

  if (LARGE_STORAGE_KEYS.includes(name)) {
    const stored = localStorage.getItem(name);
    if (stored) return stored;
  }

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const cookieValue = parts.pop()?.split(';').shift();
    return cookieValue;
  }
  return undefined;
}

export function setCookie(
  name: string,
  value: string,
  maxAge: number = DEFAULT_MAX_AGE,
): void {
  if (typeof document === 'undefined') return;

  if (LARGE_STORAGE_KEYS.includes(name) || value.length > MAX_COOKIE_SIZE) {
    localStorage.setItem(name, value);
    console.log(`${name} stored in localStorage`);
    return;
  }

  // Store smaller values in cookies
  document.cookie = `${name}=${value}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

export function removeCookie(name: string): void {
  if (typeof document === 'undefined') return;

  // Remove form local storage
  localStorage.removeItem(name);

  // Remove from cookies
  document.cookie = `${name}=; path=/; max-age=0`;
}
