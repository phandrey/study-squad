(() => {
  const STORAGE_KEY = 'study_theme';
  const root = document.documentElement;

  const readTheme = () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === 'light' || saved === 'dark' ? saved : 'dark';
  };

  const applyTheme = (theme) => {
    root.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
    const toggle = document.querySelector('.theme-toggle');
    if (!toggle) return;
    const isLight = theme === 'light';
    toggle.classList.toggle('is-light', isLight);
    toggle.setAttribute('aria-pressed', String(isLight));
  };

  const ensureTheme = () => {
    if (!root.getAttribute('data-theme')) {
      root.setAttribute('data-theme', readTheme());
    }
  };

  const buildToggle = () => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'theme-toggle';
    btn.setAttribute('aria-label', 'Переключить тему');
    btn.setAttribute('title', 'Переключить тему');
    btn.innerHTML = [
      '<span class="theme-toggle-track">',
      '<span class="theme-toggle-label theme-toggle-label-dark">NIGHT</span>',
      '<span class="theme-toggle-label theme-toggle-label-light">DAY</span>',
      '<span class="theme-toggle-thumb" aria-hidden="true"></span>',
      '</span>'
    ].join('');

    btn.addEventListener('click', () => {
      const current = root.getAttribute('data-theme') || 'dark';
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });

    return btn;
  };

  const placeToggle = (toggle) => {
    const isAuth = /(?:^|\/)(?:index|callback)\.html$/.test(location.pathname) || location.pathname === '/' || location.pathname === '';
    const mobileHeader = document.querySelector('.mobile-header');
    const pageHeader = document.querySelector('.page-header');

    toggle.classList.remove('theme-toggle--floating', 'theme-toggle--inline');
    document.body.classList.remove('theme-toggle-shift');

    if (isAuth) {
      document.body.appendChild(toggle);
      toggle.classList.add('theme-toggle--floating');
      return;
    }

    const mobileShown = !!mobileHeader && window.getComputedStyle(mobileHeader).display !== 'none';

    if (mobileShown) {
      document.body.appendChild(toggle);
      toggle.classList.add('theme-toggle--floating');
      document.body.classList.add('theme-toggle-shift');
      return;
    }

    if (pageHeader) {
      let slot = pageHeader.querySelector('.theme-toggle-slot');
      if (!slot) {
        slot = document.createElement('div');
        slot.className = 'theme-toggle-slot';
        pageHeader.appendChild(slot);
      }
      slot.appendChild(toggle);
      toggle.classList.add('theme-toggle--inline');
      return;
    }

    const main = document.querySelector('.main');
    if (main) {
      let slot = main.querySelector('.theme-toggle-slot--row');
      if (!slot) {
        slot = document.createElement('div');
        slot.className = 'theme-toggle-slot theme-toggle-slot--row';
        main.prepend(slot);
      }
      slot.appendChild(toggle);
      toggle.classList.add('theme-toggle--inline');
      return;
    }

    document.body.appendChild(toggle);
    toggle.classList.add('theme-toggle--floating');
  };

  const init = () => {
    ensureTheme();

    let toggle = document.querySelector('.theme-toggle');
    if (!toggle) {
      toggle = buildToggle();
    }

    placeToggle(toggle);
    applyTheme(readTheme());

    window.addEventListener('resize', () => {
      placeToggle(toggle);
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
