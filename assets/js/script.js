import { createEl } from './dom.js';
import { Card } from './card.js';
import { Modal } from './modal.js';
import { ScoreStorage } from './scoreStorage.js';

const IMAGES = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  src: `./assets/img/animal/${i}.svg`,
  alt: `animal`,
}));
const TOTAL_PAIRS = IMAGES.length;
const MISMATCH_DELAY = 1000;

const createButton = (text, onClick) => {
  const btn = createEl('button', {
    className: 'btn btn-reset',
    text,
  });
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
  storage = new ScoreStorage();
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

  render() {
    this.movesEl = createEl('b', { text: '0' });
    this.pairsEl = createEl('b', { text: '0' });
    this.board = createEl('div', { className: 'cards' });

    const header = createEl('header', {
      className: 'header',
      children: [
        createEl('div', {
          className: 'wrapper',
          children: [
            createButton('Новая игра', () => this.newGame()),
            createButton('Таблица лидеров', () => this.showLeaderboard()),
          ],
        }),
      ],
    });

    const stats = createEl('div', {
      className: 'stats',
      children: [
        createEl('p', { children: ['Ходы: ', this.movesEl] }),
        createEl('p', { children: ['Пары: ', this.pairsEl, ` из ${TOTAL_PAIRS}`] }),
      ],
    });

    const section = createEl('section', {
      className: 'wrapper',
      children: [stats, this.board],
    });

    this.root.append(header, createEl('main', { children: [section] }));

    this.modal = new Modal();
  }

  newGame() {
    clearTimeout(this.timerId);
    this.timerId = null;
    this.modal.close();

    this.firstCard = null;
    this.locked = false;
    this.finished = false;
    this.moves = 0;
    this.pairs = 0;
    this.updateStats();

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

  updateStats() {
    this.movesEl.textContent = String(this.moves);
    this.pairsEl.textContent = String(this.pairs);
  }

  finish() {
    this.finished = true;
    this.storage.add(this.moves);
    this.showWin();
  };

  showLeaderboard() {
    const scores = this.storage.getAll().slice(0, 10);

    const content = scores.length === 0
      ? createEl('p', {className: 'modal__subtitle', text: 'Пока нет результатов' })
      : createEl('table', {
        className: 'modal__table',
        children: [
          createEl('thead', {
            children: [
              createEl('tr', {
                children: ['Место', 'Ходы', 'Дата'].map((t) => createEl('th', { text: t })),
              }),
            ],
          }),
          createEl('tbody', {
            children: scores.map((s, i) =>
              createEl('tr', {
                children: [
                  createEl('td', { text: String(i + 1) }),
                  createEl('td', { text: String(s.moves) }),
                  createEl('td', { text: ScoreStorage.formatDate(s.timestamp) }),
                ],
              })),
          }),
        ],
      });

    this.modal.open([
      createEl('h2', {className: 'modal__title', text: 'Таблица лидеров' }),
      content,
      createButton('Закрыть', () => this.modal.close()),
    ]);
  };

  showWin() {
    this.modal.open([
      createEl('h2', {className: 'modal__title', text: 'Победа!' }),
      createEl('p', {className: 'modal__subtitle', text: `Количество ходов: ${this.moves}` }),
      createEl('div', {
        className: 'modal__actions',
        children: [
          createButton('Новая игра', () => this.newGame()),
          createButton('Закрыть', () => this.modal.close()),
        ],
      }),
    ]);
  };
}

new Game();
