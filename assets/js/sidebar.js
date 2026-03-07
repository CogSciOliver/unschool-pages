
const toggle = document.querySelector('[data-sidebar-toggle]');
const sidebar = document.querySelector('[data-sidebar]');
const overlay = document.querySelector('[data-sidebar-overlay]');
const body = document.body;

function openSidebar() {
  sidebar?.classList.add('is-open');
  overlay?.removeAttribute('hidden');
  toggle?.setAttribute('aria-expanded', 'true');
  body.classList.add('sidebar-open');
}

function closeSidebar() {
  sidebar?.classList.remove('is-open');
  overlay?.setAttribute('hidden', '');
  toggle?.setAttribute('aria-expanded', 'false');
  body.classList.remove('sidebar-open');
}

toggle?.addEventListener('click', () => {
  if (sidebar?.classList.contains('is-open')) closeSidebar();
  else openSidebar();
});

overlay?.addEventListener('click', closeSidebar);

for (const group of document.querySelectorAll('[data-sidebar-group]')) {
  const button = group.querySelector('.sidebar-group__toggle');
  const panel = group.querySelector('.sidebar-group__panel');
  button?.addEventListener('click', () => {
    const expanded = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', expanded ? 'false' : 'true');
    panel?.classList.toggle('is-open');
  });
}
