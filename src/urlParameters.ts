// Url Parameter handling
const url = new URL(window.location.href.toLowerCase());
export const hideSite = url.searchParams.get("hidesite") != null;
export const darkTheme = url.searchParams.get("dark") != null;
export const lightTheme = url.searchParams.get("light") != null;
