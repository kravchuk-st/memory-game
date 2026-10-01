import { createEl } from './dom.js';
import { Card } from './card.js'

const IMAGES = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  src: `./assets/img/animal/${i}.svg`,
  alt: `Тварина ${i + 1}`,
}));
const TOTAL_PAIRS = IMAGES.length;
const MISMATCH_DELAY = 1000;

const createButton = (text, onClick) => {
  const btn = createEl('button', { className: 'btn btn-reset', text });
  btn.addEventListener('click', onClick);
  return btn;
};

const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

class Game {
  cards = [];
  firstCard = null;
  locked = false;
  finished = false;
  timerId = null;
  moves = 0;
  pairs = 0;

  constructor() {
    this.root = document.body;
    this.render();
		this.newGame();
  }

  render () {
    this.movesEl = createEl('b', { text: '0' });
    this.pairsEl = createEl('b', { text: '0' });
    this.board = createEl('div', { className: 'cards' });

    const header = createEl('header', {
      className: 'header',
      children: [
        createEl('div', {
          className: 'wrapper',
          children: [
            createButton('Новая игра'),
            createButton('Таблица лидеров'),
          ],
        }),
      ],
    });

    const stats = createEl('div', {
      className: 'stats',
      children: [
        createEl('p', { children: ['Ходи: ', this.movesEl] }),
        createEl('p', { children: ['Пари: ', this.pairsEl, ` з ${TOTAL_PAIRS}`] }),
      ],
    });

    const section = createEl('section', {
			className: 'wrapper',
			children: [stats, this.board],
		});

		this.root.append(header, createEl('main', { children: [section] }));
  };

	newGame() {
    clearTimeout(this.timerId);
    this.timerId = null;

    this.firstCard = null;
    this.locked = false;
    this.finished = false;
    this.moves = 0;
    this.pairs = 0;

    const deck = shuffle([...IMAGES, ...IMAGES]);
    this.cards = deck.map((image) => new Card(image, (card) => this.handleCardClick(card)));
    this.board.replaceChildren(...this.cards.map((c) => c.element));
  }

  handleCardClick(card) {
    if (this.locked || this.finished || card.isOpen || card.isMatched) return;

    card.open();
    if (!this.firstCard) {
      this.firstCard = card;
      return;
    }

    const first = this.firstCard;
    this.firstCard = null;
    this.moves++;

    if (first.pairId === card.pairId) {
      first.markMatched();
      card.markMatched();
      this.pairs++;
      this.updateStats();
      if (this.pairs === TOTAL_PAIRS) this.finish();
      return;
    }

    this.updateStats();
    this.locked = true;
    this.timerId = setTimeout(() => {
      first.close();
      card.close();
      this.locked = false;
      this.timerId = null;
    }, MISMATCH_DELAY);
  }
};

new Game();
