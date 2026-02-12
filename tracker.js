class DodgersWinTracker {
  constructor() {
    this.wins = this.loadWins();
    this.webhookUrl = localStorage.getItem('discordWebhookUrl') || '';
    this.init();
  }

  init() {
    this.updateDisplay();
    this.attachEventListeners();
    this.loadWebhookUI();
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
    this.sendDiscordNotification(win);
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

  // Discord webhook methods

  loadWebhookUI() {
    const input = document.getElementById('webhookUrl');
    if (this.webhookUrl) {
      input.value = this.webhookUrl;
      this.setWebhookStatus('Webhook saved — notifications enabled.', 'saved');
    }
  }

  saveWebhook() {
    const input = document.getElementById('webhookUrl');
    const url = input.value.trim();

    if (!url) {
      this.webhookUrl = '';
      localStorage.removeItem('discordWebhookUrl');
      this.setWebhookStatus('Webhook removed — notifications disabled.', 'saved');
      return;
    }

    if (!url.startsWith('https://discord.com/api/webhooks/')) {
      this.setWebhookStatus('Invalid URL. Must be a Discord webhook URL.', 'error');
      return;
    }

    this.webhookUrl = url;
    localStorage.setItem('discordWebhookUrl', url);
    this.setWebhookStatus('Saved! Sending test notification...', 'saved');
    this.sendTestNotification();
  }

  setWebhookStatus(message, type) {
    const status = document.getElementById('webhookStatus');
    status.textContent = message;
    status.className = 'webhook-status ' + type;
  }

  async sendTestNotification() {
    try {
      await fetch(this.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          embeds: [{
            title: '⚾ Dodgers Win Tracker Connected!',
            description: 'You will now receive notifications when a home game win is recorded.',
            color: 0x005A9C
          }]
        })
      });
      this.setWebhookStatus('Test notification sent! Check your Discord.', 'success');
    } catch {
      this.setWebhookStatus('Failed to send. Check the webhook URL.', 'error');
    }
  }

  async sendDiscordNotification(win) {
    if (!this.webhookUrl) return;

    try {
      await fetch(this.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          embeds: [{
            title: '⚾ Dodgers Home Win!',
            description: `**Win #${this.wins.length}** recorded on ${win.date}`,
            color: 0x005A9C,
            footer: { text: 'Dodgers Home Game Win Tracker' }
          }]
        })
      });
    } catch {
      // Silently fail — don't disrupt the app for a notification error
    }
  }

  attachEventListeners() {
    document.getElementById('addWinBtn').addEventListener('click', () => this.addWin());
    document.getElementById('resetBtn').addEventListener('click', () => this.resetWins());
    document.getElementById('saveWebhookBtn').addEventListener('click', () => this.saveWebhook());
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new DodgersWinTracker();
});
