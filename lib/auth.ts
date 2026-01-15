const AUTH_KEY = "maya_is_logged_in";

export function isLoggedIn(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(AUTH_KEY) === "true";
}

export function login(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(AUTH_KEY, "true");
  // Dispatch custom event to notify other components
  window.dispatchEvent(new Event("authchange"));
}

export function logout(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_KEY);
  // Dispatch custom event to notify other components
  window.dispatchEvent(new Event("authchange"));
}

