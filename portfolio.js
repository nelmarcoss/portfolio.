// Navigation and project links work without JavaScript.
const year = document.querySelector('[data-year]');
if (year) year.textContent = String(new Date().getFullYear());
