import { createEl } from './dom.js';

export class Modal {
  isOpen = false;

  constructor() {
    this.box = createEl('div', {
      className: 'modal',
      attrs: { role: 'dialog', 'aria-modal': 'true' },
    });
    this.overlay = createEl('div', {
      className: 'overlay',
      children: [this.box],
    });

    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) this.close();
    });

    this.overlay.addEventListener('transitionend', (e) => {
      if (e.target === this.overlay && !this.isOpen) {
        this.box.replaceChildren();
      }
    });

    document.body.append(this.overlay);
  }

  onKeyDown = (e) => {
    if (e.key === 'Escape') this.close();
  };

  open(contentNodes) {
    this.box.replaceChildren(...contentNodes);
    if (this.isOpen) return;
    this.isOpen = true;
    this.overlay.classList.add('is-open');
    document.body.classList.add('no-scroll');
    document.addEventListener('keydown', this.onKeyDown);
  }

  close() {
    if (!this.isOpen) return;
    this.isOpen = false;
    this.overlay.classList.remove('is-open');
    document.body.classList.remove('no-scroll');
    document.removeEventListener('keydown', this.onKeyDown);
  }
}
