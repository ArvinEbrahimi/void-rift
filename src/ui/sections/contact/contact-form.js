export function initContactForm(form) {
  const status = form.parentElement?.querySelector('[data-form-status]');
  const fields = ['name', 'email', 'message'];

  function showStatus(msg, isError = false) {
    if (!status) return;
    status.textContent = msg;
    status.classList.toggle('contact-form__status--error', isError);
    status.hidden = false;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(form));
    const name = (data.name || '').trim();
    const email = (data.email || '').trim();
    const message = (data.message || '').trim();

    if (!name || name.length < 2) {
      showStatus('Please enter your name.', true);
      form.querySelector('[name="name"]')?.focus();
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showStatus('Please enter a valid email address.', true);
      form.querySelector('[name="email"]')?.focus();
      return;
    }

    if (message.length < 10) {
      showStatus('Message should be at least 10 characters.', true);
      form.querySelector('[name="message"]')?.focus();
      return;
    }

    const subject = encodeURIComponent(`Portfolio contact from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
    window.location.href = `mailto:ebrahimiarvin.official@gmail.com?subject=${subject}&body=${body}`;
    showStatus('Opening your email client…');
    form.reset();
  });

  fields.forEach((name) => {
    const input = form.querySelector(`[name="${name}"]`);
    input?.addEventListener('input', () => {
      if (status && !status.hidden) status.hidden = true;
    });
  });
}
