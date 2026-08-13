try {
  const localTechnicalCheck = ['127.0.0.1', 'localhost'].includes(location.hostname)
    && new URLSearchParams(location.search).has('technical-preview');
  if (localStorage.getItem('hm_preview_ok') === '1' || localTechnicalCheck) {
    document.documentElement.classList.remove('preview-locked');
  }
} catch {
  // Without storage, the presentation preview remains locked.
}
