const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#main-nav');

if (menuButton && navigation) {
  menuButton.addEventListener('click', () => {
    const open = navigation.classList.toggle('is-open');
    menuButton.setAttribute('aria-expanded', String(open));
  });

  navigation.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navigation.classList.remove('is-open');
      menuButton.setAttribute('aria-expanded', 'false');
    });
  });
}

const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();

const contactForm = document.querySelector('#contact-form');
const contactFormStatus = document.querySelector('#contact-form-status');

const formStatusText = {
  sending: 'Wird gesendet …',
  success: 'Danke! Nachricht ist raus, wir melden uns.',
  error: 'Hat nicht geklappt. Bitte direkt per Mail oder WhatsApp schreiben.',
};

function setFormStatus(state) {
  if (!contactFormStatus) return;
  contactFormStatus.textContent = formStatusText[state];
  contactFormStatus.dataset.state = state;
}

if (contactForm) {
  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (contactForm.querySelector('.contact-form-honeypot')?.checked) return;

    const submitButton = contactForm.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    setFormStatus('sending');

    try {
      const response = await fetch(contactForm.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(contactForm))),
      });
      const result = await response.json();
      if (response.ok && result.success) {
        setFormStatus('success');
        contactForm.reset();
      } else {
        setFormStatus('error');
      }
    } catch (err) {
      setFormStatus('error');
    } finally {
      submitButton.disabled = false;
    }
  });
}

const mapEmbed = document.querySelector('[data-map-embed]');
if (mapEmbed) {
  mapEmbed.querySelector('.map-load-btn')?.addEventListener('click', () => {
    const iframe = document.createElement('iframe');
    iframe.src = 'https://www.google.com/maps?q=Ottostra%C3%9Fe+86a,+85521+Ottobrunn&output=embed';
    iframe.title = 'Anfahrt zu Die Hautmaler';
    iframe.loading = 'lazy';
    iframe.referrerPolicy = 'no-referrer-when-downgrade';
    mapEmbed.innerHTML = '';
    mapEmbed.appendChild(iframe);
  });
}

if (document.documentElement.classList.contains('preview-locked')) {
  const gate = document.createElement('div');
  gate.className = 'preview-gate';
  gate.innerHTML = [
    '<form class="preview-gate-card">',
    '<p class="eyebrow"><span class="eyebrow-dot"></span> Vorschau</p>',
    '<h2>Noch nicht live.</h2>',
    '<p>Diese Seite ist ein Entwurf. PIN eingeben.</p>',
    '<input class="preview-gate-input" type="password" maxlength="8" autocomplete="off" placeholder="PIN" aria-label="PIN">',
    '<button type="submit" class="button button-primary">Weiter</button>',
    '<p class="preview-gate-error" hidden>Falsche PIN.</p>',
    '</form>'
  ].join('');
  document.body.appendChild(gate);

  const form = gate.querySelector('form');
  const input = gate.querySelector('input');
  const error = gate.querySelector('.preview-gate-error');

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (input.value === '69') {
      try { localStorage.setItem('hm_preview_ok', '1'); } catch (e) { /* Storage nicht verfügbar */ }
      document.documentElement.classList.remove('preview-locked');
      gate.remove();
    } else {
      error.hidden = false;
      input.value = '';
      input.focus();
    }
  });

  input.focus();
}
