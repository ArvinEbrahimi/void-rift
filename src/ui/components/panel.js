export function createPanel({ label = '', className = '', content = '' } = {}) {
  const panel = document.createElement('div');
  panel.className = `void-panel ${className}`.trim();

  if (label) {
    const labelEl = document.createElement('p');
    labelEl.className = 'void-panel__label';
    labelEl.textContent = label;
    panel.appendChild(labelEl);
  }

  const body = document.createElement('div');
  body.className = 'void-panel__body';
  if (typeof content === 'string') {
    body.innerHTML = content;
  } else if (content instanceof Node) {
    body.appendChild(content);
  }
  panel.appendChild(body);

  return panel;
}
