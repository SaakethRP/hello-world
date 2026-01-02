class DodgersWinTracker {
  constructor() {
    this.wins = this.loadWins();
    this.init();
  }

  init() {
    this.updateDisplay();
    this.attachEventListeners();
  }

  loadWins() {
    const stored = localStorage.getItem('dodgersHomeWins');
    return stored ? JSON.parse(stored) : [];
  }

  saveWins() {
    localStorage.setItem('dodgersHomeWins', JSON.stringify(this.wins));
  }

  addWin() {
    const win = {
      id: Date.now(),
      date: new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      timestamp: new Date().toISOString()
    };

    this.wins.unshift(win);
    this.saveWins();
    this.updateDisplay();
    this.animateCounter();
  }

  resetWins() {
    if (this.wins.length === 0) {
      return;
    }

    if (confirm('Are you sure you want to reset the win counter? This will delete all recorded wins.')) {
      this.wins = [];
      this.saveWins();
      this.updateDisplay();
    }
  }

  updateDisplay() {
    const counterElement = document.getElementById('winCounter');
    const winsListElement = document.getElementById('winsList');

    counterElement.textContent = this.wins.length;

    if (this.wins.length === 0) {
      winsListElement.innerHTML = '<li class="empty-state">No wins recorded yet. Click "Add Home Game Win" to start tracking!</li>';
    } else {
      winsListElement.innerHTML = this.wins.map((win, index) => `
        <li>
          <span class="win-number">Win #${this.wins.length - index}</span>
          <span class="win-date">${win.date}</span>
        </li>
      `).join('');
    }
  }

  animateCounter() {
    const counterElement = document.getElementById('winCounter');
    counterElement.style.transform = 'scale(1.2)';
    counterElement.style.color = '#FFD700';

    setTimeout(() => {
      counterElement.style.transform = 'scale(1)';
      counterElement.style.color = '#005A9C';
    }, 300);
  }

  attachEventListeners() {
    document.getElementById('addWinBtn').addEventListener('click', () => this.addWin());
    document.getElementById('resetBtn').addEventListener('click', () => this.resetWins());
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new DodgersWinTracker();
});
