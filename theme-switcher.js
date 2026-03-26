(() => {
  const STORAGE_KEY = 'study_theme';
  const LIGHT_THEME = 'light';
  const DARK_THEME = 'dark';
  const LIGHT_THEME_LINK_ID = 'study-light-theme-css';
  const LIGHT_THEME_CSS_PATH = 'theme-3-1.css';

  const root = document.documentElement;

  const readTheme = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved === LIGHT_THEME || saved === DARK_THEME ? saved : DARK_THEME;
    } catch (error) {
      return DARK_THEME;
    }
  };

  const ensureLightStylesheet = (enabled) => {
    let link = document.getElementById(LIGHT_THEME_LINK_ID);

    if (enabled) {
      if (!link) {
        link = document.createElement('link');
        link.id = LIGHT_THEME_LINK_ID;
        link.rel = 'stylesheet';
        link.href = LIGHT_THEME_CSS_PATH;
        document.head.appendChild(link);
      }
      return;
    }

    if (link) {
      link.remove();
    }
  };

  const syncToggleState = (theme) => {
    const isLight = theme === LIGHT_THEME;
    document.querySelectorAll('[data-theme-toggle]').forEach((toggle) => {
      toggle.classList.toggle('is-light', isLight);
      toggle.setAttribute('aria-pressed', String(isLight));
      const label = toggle.querySelector('[data-theme-toggle-label]');
      if (label) {
        label.textContent = isLight ? 'Светлая тема' : 'Тёмная тема';
      }
      const icon = toggle.querySelector('.theme-toggle-icon');
      if (icon) {
        icon.textContent = isLight ? '☀️' : '🌙';
      }
    });
  };

  const applyTheme = (theme) => {
    root.setAttribute('data-theme', theme);
    ensureLightStylesheet(theme === LIGHT_THEME);
    syncToggleState(theme);

    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (error) {
      // ignore storage write errors
    }
  };

  const createToggle = () => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'theme-toggle-btn';
    button.setAttribute('data-theme-toggle', 'true');
    button.setAttribute('aria-label', 'Переключить тему');

    button.innerHTML = [
      '<span class="theme-toggle-icon" aria-hidden="true">🌙</span>',
      '<span data-theme-toggle-label>Тёмная тема</span>'
    ].join('');

    button.addEventListener('click', () => {
      const current = root.getAttribute('data-theme') === LIGHT_THEME ? LIGHT_THEME : DARK_THEME;
      applyTheme(current === LIGHT_THEME ? DARK_THEME : LIGHT_THEME);
    });

    return button;
  };

  const ensureSidebarToggles = () => {
    document.querySelectorAll('.sidebar-bottom').forEach((sidebarBottom) => {
      if (sidebarBottom.querySelector('[data-theme-toggle]')) {
        return;
      }

      const toggle = createToggle();
      const logoutBtn = sidebarBottom.querySelector('.logout-btn');

      if (logoutBtn) {
        sidebarBottom.insertBefore(toggle, logoutBtn);
      } else {
        sidebarBottom.appendChild(toggle);
      }
    });
  };

  const init = () => {
    ensureSidebarToggles();
    applyTheme(readTheme());
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
