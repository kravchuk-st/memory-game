import { createEl } from './dom.js';

export class Card {
  constructor(image, onClick) {
    this.pairId = image.id;
    this.isOpen = false;
    this.isMatched = false;

    const front = createEl('div', { className: 'view front-view' });
    const back = createEl('div', {
      className: 'view back-view',
      children: [createEl('img', { className: 'icon', attrs: { src: image.src, alt: image.alt } })],
    });
    this.element = createEl('button', {
      className: 'card',
      attrs: { type: 'button', 'aria-label': 'Закрита картка' },
      children: [front, back],
    });
    this.element.addEventListener('click', () => onClick(this));
  }

  open() {
    this.isOpen = true;
    this.element.classList.add('flip');
    this.element.setAttribute('aria-label', 'Відкрита картка');
  }

  close() {
    this.isOpen = false;
    this.element.classList.remove('flip');
    this.element.setAttribute('aria-label', 'Закрита картка');
  }

  markMatched() {
    this.isMatched = true;
    this.element.classList.add('is-matched');
  }
}
