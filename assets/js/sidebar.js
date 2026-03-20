function getSidebar() {
  return document.getElementById('sidebar');
}

function getOverlay() {
  return document.getElementById('sidebar-overlay');
}

function setSidebarState(isOpen) {
  const sidebar = getSidebar();
  const overlay = getOverlay();

  if (!sidebar) return;

  sidebar.classList.toggle('active', isOpen);
  document.body.classList.toggle('sidebar-open', isOpen);

  if (overlay) {
    overlay.classList.toggle('active', isOpen);
  }
}

function openSidebar() {
  setSidebarState(true);
}

function closeSidebar() {
  setSidebarState(false);
}

function toggleSidebar() {
  const sidebar = getSidebar();
  if (!sidebar) return;

  setSidebarState(!sidebar.classList.contains('active'));
}

function toggleSection(button) {
  const section = button.closest('.sidebar-section');
  if (!section) return;

  section.classList.toggle('open');
  button.setAttribute(
    'aria-expanded',
    section.classList.contains('open') ? 'true' : 'false'
  );
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeSidebar();
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('theme');
  if (saved) {
    document.documentElement.setAttribute('data-theme', saved);
  }
});