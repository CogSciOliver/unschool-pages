function getSidebar() {
  return document.getElementById('sidebar');
}

function getOverlay() {
  return document.getElementById('sidebar-overlay');
}

function getTopbarMenu() {
  return document.getElementById('topbar-menu');
}

function setSidebarState(isOpen) {
  const sidebar = getSidebar();
  const overlay = getOverlay();

  if (sidebar) {
    sidebar.classList.toggle('active', isOpen);
    sidebar.classList.toggle('is-open', isOpen);
  }

  if (overlay) {
    overlay.classList.toggle('active', isOpen);
  }

  document.body.classList.toggle('sidebar-open', isOpen);
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

  const isOpen =
    sidebar.classList.contains('active') ||
    sidebar.classList.contains('is-open');

  setSidebarState(!isOpen);
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

function openTopbarMenu() {
  const menu = getTopbarMenu();
  if (!menu) return;
  menu.hidden = false;
}

function closeTopbarMenu() {
  const menu = getTopbarMenu();
  if (!menu) return;
  menu.hidden = true;
}

function toggleTopbarMenu() {
  const menu = getTopbarMenu();
  if (!menu) return;
  menu.hidden = !menu.hidden;
}

function toggleTheme() {
  const current =
    document.documentElement.getAttribute('data-theme') || 'light';
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
}

document.addEventListener('click', (event) => {
  const clickedSidebarButton = event.target.closest('[data-sidebar-toggle]');
  const clickedMenuButton = event.target.closest('[data-topbar-menu-toggle]');
  const clickedInsideSidebar = event.target.closest('#sidebar');
  const clickedInsideMenu = event.target.closest('#topbar-menu');
  const clickedOverlay = event.target.closest('#sidebar-overlay');

  if (clickedOverlay) {
    closeSidebar();
    return;
  }

  if (clickedMenuButton) {
    return;
  }

  if (clickedSidebarButton) {
    return;
  }

  const menu = getTopbarMenu();
  if (menu && !menu.hidden && !clickedInsideMenu) {
    closeTopbarMenu();
  }

  if (window.innerWidth <= 1023) {
    const sidebar = getSidebar();
    if (
      sidebar &&
      (sidebar.classList.contains('active') ||
        sidebar.classList.contains('is-open')) &&
      !clickedInsideSidebar
    ) {
      closeSidebar();
    }
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeSidebar();
    closeTopbarMenu();
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('theme');
  if (saved) {
    document.documentElement.setAttribute('data-theme', saved);
  }

  closeTopbarMenu();
});

window.addEventListener('resize', () => {
  if (window.innerWidth >= 1024) {
    closeTopbarMenu();
  }
});

window.openSidebar = openSidebar;
window.closeSidebar = closeSidebar;
window.toggleSidebar = toggleSidebar;
window.toggleSection = toggleSection;
window.toggleTopbarMenu = toggleTopbarMenu;
window.toggleTheme = toggleTheme;