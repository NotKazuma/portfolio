/**
 * main.js — Cybersecurity Console Diagnostics & Dashboard Logs
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ================================================================
     1. SIMULATED DASHBOARD METRICS
     ================================================================ */
  const statBlocked = document.getElementById('stat-blocked');
  const statTemp    = document.getElementById('stat-temp');
  const statThreat  = document.getElementById('stat-threat');
  const loadNetBar  = document.getElementById('load-net');
  const loadCpuBar  = document.getElementById('load-cpu');

  let blockedCount = 341892;

  const updateDashboardMetrics = () => {
    // Increment attacks blocked count
    blockedCount += Math.floor(Math.random() * 4) + 1;
    if (statBlocked) statBlocked.textContent = blockedCount.toLocaleString();

    // Randomize temperature
    const temp = Math.floor(Math.random() * 8) + 36;
    if (statTemp) statTemp.textContent = `${temp}°C`;

    // Randomize loads
    const netLoad = Math.floor(Math.random() * 40) + 30; // 30% - 70%
    const cpuLoad = Math.floor(Math.random() * 45) + 15; // 15% - 60%

    if (loadNetBar) loadNetBar.style.width = `${netLoad}%`;
    if (loadCpuBar) loadCpuBar.style.width = `${cpuLoad}%`;

    // Adjust threat level indicator
    if (statThreat) {
      if (cpuLoad > 55 || netLoad > 65) {
        statThreat.textContent = 'ELEVATED';
        statThreat.className = 'stat-value text-glowing-red';
      } else {
        statThreat.textContent = 'LOW';
        statThreat.className = 'stat-value text-glowing-green';
      }
    }
  };

  // Run stats fluctuation every 2.5 seconds
  setInterval(updateDashboardMetrics, 2500);

  /* ================================================================
     2. LIVE THREAT FEED LOGGER
     ================================================================ */
  const threatLogBody = document.getElementById('threatLogBody');

  const ipRanges = ['103.45.12.8', '192.168.4.11', '85.203.44.18', '200.104.5.90', '42.102.8.204', '185.220.101.4'];
  const logAlerts = [
    { type: 'warning', tag: 'WARN', msg: 'Blocked unauthorized SSH handshake sequence on Port 22 from ' },
    { type: 'warning', tag: 'WARN', msg: 'SQL injection sequence filtered in login payload from ' },
    { type: 'success', tag: 'OK', msg: 'Port sweep request packet blocks confirmed from ' },
    { type: 'info', tag: 'INFO', msg: 'Core database integrity check: 100% matched replication node.' },
    { type: 'warning', tag: 'WARN', msg: 'Suspicious cookie injection packet discarded from ' },
    { type: 'info', tag: 'INFO', msg: 'Automatic firewall rules updated. Syn flood filtering optimized.' }
  ];

  const addLiveThreatRow = () => {
    if (!threatLogBody) return;

    // Pick a random alert
    const alertIndex = Math.floor(Math.random() * logAlerts.length);
    const alert = logAlerts[alertIndex];
    
    // Pick a random IP if warning/success
    let msg = alert.msg;
    if (alert.type === 'warning' || alert.msg.endsWith('from ')) {
      const ip = ipRanges[Math.floor(Math.random() * ipRanges.length)];
      msg += ip;
    }

    const now = new Date();
    const timeStr = `[${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}]`;

    const logRow = document.createElement('div');
    logRow.className = `log-row ${alert.type}`;
    logRow.innerHTML = `<span class="time">${timeStr}</span> <span class="tag">[${alert.tag}]</span> ${msg}`;

    threatLogBody.appendChild(logRow);

    // Limit maximum log list size
    while (threatLogBody.children.length > 20) {
      threatLogBody.removeChild(threatLogBody.firstChild);
    }

    // Auto-scroll to bottom of log
    threatLogBody.scrollTop = threatLogBody.scrollHeight;
  };

  // Log feed interval runs every 3.5 seconds
  setInterval(addLiveThreatRow, 3500);

  /* ================================================================
     3. INTERACTIVE COMMAND TERMINAL
     ================================================================ */
  const terminalConsole = document.getElementById('terminalConsole');
  const terminalOutput  = document.getElementById('terminalOutput');
  const terminalInput   = document.getElementById('terminalInput');
  const terminalForm    = document.getElementById('terminalForm');

  if (terminalConsole && terminalInput) {
    // Keep focus in input when terminal box clicked
    terminalConsole.addEventListener('click', () => {
      terminalInput.focus();
    });
  }

  if (terminalForm && terminalInput && terminalOutput) {
    terminalForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const inputVal = terminalInput.value.trim();
      terminalInput.value = ''; // Clear prompt input

      if (inputVal === '') return;

      // Print prompt history
      appendLine(`<span class="terminal-prompt">guest@cybershield:~$</span> ${escapeHtml(inputVal)}`);

      // Parse Command
      const tokens = inputVal.toLowerCase().split(' ');
      const cmd = tokens[0];

      switch (cmd) {
        case 'help':
          appendLine('System diagnostics commands available:');
          appendLine('  <span class="cmd-text">status</span>   - Check current SOC firewall & database metrics.');
          appendLine('  <span class="cmd-text">scan</span>     - Initiate active vulnerability network sweep.');
          appendLine('  <span class="cmd-text">logs</span>     - Retrieve recent intrusion logs.');
          appendLine('  <span class="cmd-text">sysinfo</span>  - Retrieve console spec infrastructure.');
          appendLine('  <span class="cmd-text">clear</span>    - Clear the command log output.');
          break;

        case 'status':
          appendLine('FIREWALL_STATUS: <span class="text-glowing-green">ONLINE</span>');
          appendLine(`CORE_TEMP: ${statTemp ? statTemp.textContent : '41°C'}`);
          appendLine(`TOTAL_BLOCKED: ${statBlocked ? statBlocked.textContent : '341,892'} packets`);
          appendLine(`THREAT_LEVEL: ${statThreat ? statThreat.textContent : 'LOW'}`);
          break;

        case 'logs':
          appendLine('Last 3 intrusion diagnostics warnings:');
          appendLine('<span class="text-glowing-red">[WARN] Port 22 SSH handshake flood blocked from 185.220.101.4</span>');
          appendLine('<span class="text-glowing-red">[WARN] SQL injection character filtering match on admin form input</span>');
          appendLine('<span class="text-glowing-green">[OK] Syn cookie packet verification active. Network load stable.</span>');
          break;

        case 'sysinfo':
          appendLine('CONSOLE HOST SPECIFICATION:');
          appendLine('  OS: CyberShield SOC kernel release 14.82-x86_64');
          appendLine('  CPU: Quantum-Core HyperAlloc v8 (16 virtual cores)');
          appendLine('  RAM: 128GB ECC Buffered Memory node');
          appendLine('  SECURE TUNNELS: Active SSL/TLS v1.3 mapped');
          appendLine(`  HOST_BROWSER: ${navigator.userAgent.split(' ')[0]}`);
          break;

        case 'clear':
          terminalOutput.innerHTML = '';
          break;

        case 'scan':
          // Run simulated scanning timeline
          terminalInput.disabled = true; // Lock input
          appendLine('Initializing active network scan sweeps...');
          
          setTimeout(() => {
            appendLine('Connecting to Firewall interfaces...');
          }, 600);

          setTimeout(() => {
            appendLine('Running database injection checks...');
          }, 1400);

          setTimeout(() => {
            appendLine('Vulnerability analysis results:');
            appendLine('  - Open ports: 0 found.');
            appendLine('  - Compromised hashes: 0.');
            appendLine('  - Integrity rating: 100% matched.');
            appendLine('<span class="text-glowing-green">SUCCESS: SYSTEM IS SECURE AND THREAT LEVELS STABLE.</span>');
            terminalInput.disabled = false; // Unlock
            terminalInput.focus();
            scrollToBottom();
          }, 2400);
          break;

        default:
          appendLine(`Command unrecognized: '${escapeHtml(cmd)}'. Type <span class="cmd-text">help</span> to view lists.`);
      }

      scrollToBottom();
    });
  }

  function appendLine(htmlText) {
    if (!terminalOutput) return;
    const div = document.createElement('div');
    div.innerHTML = htmlText;
    terminalOutput.appendChild(div);
  }

  function scrollToBottom() {
    if (terminalOutput) {
      terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }
  }

  function escapeHtml(text) {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  /* ================================================================
     4. AUDIT FORM VALIDATION
     ================================================================ */
  const auditForm = document.getElementById('auditForm');
  const auditSuccessModal = document.getElementById('auditSuccessModal');
  const closeAuditModalBtn = document.getElementById('closeAuditModal');
  const dismissAuditModalBtn = document.getElementById('dismissAuditModal');

  if (auditForm) {
    auditForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('audit-name');
      const orgInput  = document.getElementById('audit-org');
      const emailInput = document.getElementById('audit-email');
      const scopeSelect = document.getElementById('audit-service');
      const msgInput = document.getElementById('audit-message');

      let isValid = true;

      if (!nameInput.value.trim()) {
        showError(nameInput, 'Full Name required');
        isValid = false;
      } else {
        removeError(nameInput);
      }

      if (!orgInput.value.trim()) {
        showError(orgInput, 'Organization required');
        isValid = false;
      } else {
        removeError(orgInput);
      }

      if (!emailInput.value.trim() || !validateEmail(emailInput.value.trim())) {
        showError(emailInput, 'Valid security contact email required');
        isValid = false;
      } else {
        removeError(emailInput);
      }

      if (!scopeSelect.value) {
        showError(scopeSelect, 'Please select scope');
        isValid = false;
      } else {
        removeError(scopeSelect);
      }

      if (!msgInput.value.trim()) {
        showError(msgInput, 'Please enter inquiry details');
        isValid = false;
      } else {
        removeError(msgInput);
      }

      if (!isValid) return;

      // Successful Transmission
      auditForm.reset();
      
      if (auditSuccessModal) {
        auditSuccessModal.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    });
  }

  const closeModal = () => {
    if (auditSuccessModal) {
      auditSuccessModal.classList.remove('open');
      document.body.style.overflow = '';
    }
  };

  closeAuditModalBtn?.addEventListener('click', closeModal);
  dismissAuditModalBtn?.addEventListener('click', closeModal);

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  function showError(inputElement, msg) {
    inputElement.style.borderColor = '#FF0055';
    inputElement.style.boxShadow = '0 0 10px rgba(255, 0, 85, 0.3)';
    if (!inputElement.value) {
      inputElement.placeholder = msg;
    }
  }

  function removeError(inputElement) {
    inputElement.style.borderColor = '';
    inputElement.style.boxShadow = '';
  }

  /* ================================================================
     5. SCROLL REVEAL ANIMATIONS
     ================================================================ */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(el => {
    revealObserver.observe(el);
  });

});
