/* ==========================================================================
   MASS ENERGY HOLDINGS - SIGN IN LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Autoplay video
    const video = document.getElementById('bgVideo');
    if (video) {
        video.muted = true;
        video.play().catch(() => {});
    }

    initMagneticCursor();
    initCardReveal();
});

/* --------------------------------------------------------------------------
   MAGNETIC GLOWING CURSOR DOT
   -------------------------------------------------------------------------- */
function initMagneticCursor() {
    const dot = document.getElementById('cursorDot');
    if (!dot) return;

    let mouseX = 0, mouseY = 0;
    let dotX = 0, dotY = 0;
    let animId;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        dot.classList.add('visible');
    });

    document.addEventListener('mouseleave', () => {
        dot.classList.remove('visible');
    });

    // Smooth lag follow
    function followCursor() {
        dotX += (mouseX - dotX) * 0.18;
        dotY += (mouseY - dotY) * 0.18;
        dot.style.left = dotX + 'px';
        dot.style.top  = dotY + 'px';
        animId = requestAnimationFrame(followCursor);
    }
    followCursor();

    // Expand on hoverable elements
    const hoverables = document.querySelectorAll('button, a, input, .login-card');
    hoverables.forEach(el => {
        el.addEventListener('mouseenter', () => dot.classList.add('expanded'));
        el.addEventListener('mouseleave', () => dot.classList.remove('expanded'));
    });
}

/* --------------------------------------------------------------------------
   CARD AUTO POPUP ON PAGE LOAD — Smooth Spring
   -------------------------------------------------------------------------- */
function initCardReveal() {
    const card = document.querySelector('.login-card');
    if (!card) return;

    // Step 1: After a short delay, fade/rise the card in smoothly
    setTimeout(() => {
        card.classList.add('card-visible');

        // Step 2: After the rise animation completes, add a subtle bounce
        setTimeout(() => {
            card.classList.add('card-bounced');

            // Step 3: Clean up bounce class so hover transitions still work
            setTimeout(() => {
                card.classList.remove('card-bounced');
            }, 750);

        }, 980); // wait for rise to finish

    }, 350); // initial delay before popup
}

/* ---------- Password Toggle ---------- */
function togglePassword() {
    const input = document.getElementById('password');
    const icon  = document.getElementById('eyeIcon');

    if (input.type === 'password') {
        input.type = 'text';
        icon.innerHTML = `
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
            <line x1="1" y1="1" x2="23" y2="23"></line>
        `;
    } else {
        input.type = 'password';
        icon.innerHTML = `
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
        `;
    }
}

/* ---------- Sign In Submit ---------- */
function handleLogin(event) {
    event.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const btn = document.getElementById('signinBtn');

    if (!username || !password) {
        shakeCard();
        return;
    }

    btn.classList.add('loading');
    btn.disabled = true;

    // Simulate auth — replace with real API call
    setTimeout(() => {
        btn.classList.remove('loading');
        btn.disabled = false;
        showSuccess(username);
    }, 1500);
}

/* ---------- Tech Success Overlay ---------- */
function showSuccess(username) {
    const overlay = document.getElementById('successOverlay');
    const titleEl = document.getElementById('successTitle');
    const subEl   = document.getElementById('successSub');

    if (!overlay) return;

    // Show overlay
    overlay.classList.add('active');

    // Set subtitle
    subEl.textContent = `Welcome, ${username}`;

    // Typewriter for title: "Login Successfully"
    typeWriter(titleEl, 'Login Successfully', 50, () => {
        titleEl.classList.add('done');
    });
}

/* Typewriter helper */
function typeWriter(el, text, speed, onDone) {
    el.textContent = '';
    let i = 0;
    const interval = setInterval(() => {
        el.textContent += text[i];
        i++;
        if (i >= text.length) {
            clearInterval(interval);
            if (onDone) onDone();
        }
    }, speed);
}

/* Shake on empty fields */
function shakeCard() {
    const card = document.querySelector('.login-card');
    card.style.animation = 'none';
    card.offsetHeight; // reflow
    card.style.animation = 'shake 0.4s cubic-bezier(.36,.07,.19,.97)';
    setTimeout(() => { card.style.animation = ''; }, 450);
}

/* Close success panel */
function closeSuccess() {
    const overlay = document.getElementById('successOverlay');
    if (!overlay) return;
    overlay.classList.remove('active');
}
