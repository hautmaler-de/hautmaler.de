const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#main-nav');

if (menuButton && navigation) {
  const closeNavigation = (returnFocus = false) => {
    navigation.classList.remove('is-open');
    menuButton.setAttribute('aria-expanded', 'false');
    if (returnFocus) menuButton.focus();
  };

  menuButton.addEventListener('click', () => {
    const open = navigation.classList.toggle('is-open');
    menuButton.setAttribute('aria-expanded', String(open));
  });

  navigation.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => closeNavigation());
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && navigation.classList.contains('is-open')) {
      closeNavigation(true);
    }
  });

  document.addEventListener('click', (event) => {
    if (
      navigation.classList.contains('is-open')
      && !navigation.contains(event.target)
      && !menuButton.contains(event.target)
    ) {
      closeNavigation();
    }
  });

  window.matchMedia('(min-width: 761px)').addEventListener('change', () => closeNavigation());
}

const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();

const mapEmbed = document.querySelector('[data-map-embed]');
if (mapEmbed) {
  mapEmbed.querySelector('.map-load-btn')?.addEventListener('click', () => {
    const iframe = document.createElement('iframe');
    iframe.src = 'https://www.google.com/maps?q=Ottostra%C3%9Fe+86a,+85521+Ottobrunn&output=embed';
    iframe.title = 'Anfahrt zu Die Hautmaler';
    iframe.loading = 'lazy';
    iframe.referrerPolicy = 'no-referrer';
    mapEmbed.replaceChildren(iframe);
    iframe.addEventListener('load', () => iframe.focus(), { once: true });
  });
}

const gate = document.querySelector('.preview-gate');
if (gate && document.documentElement.classList.contains('preview-locked')) {
  const form = gate.querySelector('form');
  const input = gate.querySelector('input');
  const error = gate.querySelector('.preview-gate-error');

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (input.value === '69') {
      try { localStorage.setItem('hm_preview_ok', '1'); } catch (e) { /* Storage nicht verfügbar */ }
      document.documentElement.classList.remove('preview-locked');
      gate.remove();
      document.querySelector('main')?.focus({ preventScroll: true });
    } else {
      error.hidden = false;
      input.setAttribute('aria-invalid', 'true');
      input.value = '';
      input.focus();
    }
  });

  input.addEventListener('input', () => {
    error.hidden = true;
    input.removeAttribute('aria-invalid');
  });

  input.focus();
} else {
  gate?.remove();
}
