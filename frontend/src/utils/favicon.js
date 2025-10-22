// Utility to update favicon based on theme
export function updateFavicon(theme) {
  const favicon = document.getElementById('favicon');
  if (favicon) {
    favicon.href = theme === 'dark' ? '/favicon-dark.svg' : '/favicon-light.svg';
  }
}
