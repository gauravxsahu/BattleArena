import { ACCESS_TOKEN_KEY } from "./constants";

/**
 * Only the short-lived access token lives in memory-backed storage on the
 * client. The refresh token is an HTTP-only cookie the frontend never
 * touches. sessionStorage (not localStorage) is used so a closed tab
 * doesn't leave a long-lived token sitting around indefinitely; refresh
 * flow re-establishes the session from the cookie anyway.
 */

export function getAccessToken() {
  try {
    return sessionStorage.getItem(ACCESS_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setAccessToken(token) {
  try {
    if (token) sessionStorage.setItem(ACCESS_TOKEN_KEY, token);
    else sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  } catch {
    // sessionStorage may be unavailable (private browsing); fail silently.
  }
}

export function clearAccessToken() {
  setAccessToken(null);
}
