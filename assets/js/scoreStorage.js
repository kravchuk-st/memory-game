const KEY = 'memory-game-scores';
const LIMIT = 10;

export class ScoreStorage {
  getAll = () => {
    try {
      const data = JSON.parse(localStorage.getItem(KEY));
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  };

  add = (moves) => {
    const scores = this.getAll();
    scores.push({ moves, timestamp: Date.now() });
    scores.sort((a, b) => a.moves - b.moves || a.timestamp - b.timestamp);
    try {
      localStorage.setItem(KEY, JSON.stringify(scores.slice(0, LIMIT)));
    } catch (e) {
      console.error('Error saving score to localStorage:', e.message);
    }
  };

  static formatDate = (timestamp) => {
    const d = new Date(timestamp);
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    return `${dd}.${mm}.${d.getFullYear()}`;
  };
}
