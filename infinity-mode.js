/* ==========================================================================
   INFINITY MODE - JAVASCRIPT LOGIC CONTROLLER
   Fungsi: Mengatur state ON/OFF, event click, Unlimited Void portal transition,
           text attribute swapping, particle engine color update.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // State Variables
    let isGojoActive = false;
    let isTransitioning = false;

    // DOM Elements
    const toggleBtn = document.getElementById('zero-g-toggle');
    const voidPortal = document.getElementById('void-portal');
    const voidFlashText = document.getElementById('void-flash-text');

    if (!toggleBtn) {
        console.warn('Infinity Mode Toggle Button (#zero-g-toggle) not found on page.');
        return;
    }

    // Load Configuration optionally
    let config = {
        activeClass: 'infinity-active',
        animation: { portalDuration: 1200, switchMidpoint: 550 }
    };

    fetch('infinity-config.json')
        .then(res => res.json())
        .then(data => { config = { ...config, ...data }; })
        .catch(() => console.log('Using default inline infinity mode config.'));

    // Swap Text Content based on data-normal & data-gojo attributes
    function updateModeText(active) {
        const textElements = document.querySelectorAll('[data-normal][data-gojo]');
        textElements.forEach(el => {
            const normalText = el.getAttribute('data-normal');
            const gojoText = el.getAttribute('data-gojo');

            if (el.id === 'brand-logo-text') {
                el.innerHTML = active 
                    ? 'AUFA<span class="highlight"> SATORU</span>' 
                    : 'AUFA<span class="highlight">.IND</span>';
            } else if (el.id === 'hero-name-display') {
                el.textContent = active ? gojoText : normalText;
            } else {
                el.textContent = active ? gojoText : normalText;
            }
        });
    }

    // Toggle Handler Logic
    function toggleInfinityMode() {
        if (isTransitioning) return;
        isTransitioning = true;

        const targetState = !isGojoActive;
        const portalDuration = config.animation.portalDuration || 1200;
        const switchMidpoint = config.animation.switchMidpoint || 550;
        const activeClass = config.activeClass || 'infinity-active';

        // Phase 1: Activate Unlimited Void Portal Screen Overlay
        if (voidPortal) {
            if (voidFlashText) {
                voidFlashText.textContent = targetState 
                    ? 'DOMAIN EXPANSION: UNLIMITED VOID' 
                    : 'RELEASING DOMAIN: NORMAL MODE';
            }
            voidPortal.classList.add('active');
        }

        // Phase 2: At midpoint of transition, apply class toggle & update state
        setTimeout(() => {
            isGojoActive = targetState;

            // Toggle main body class
            document.body.classList.toggle(activeClass, isGojoActive);

            // Update particle engine state if registered
            if (typeof window.toggleCanvasZeroG === 'function') {
                window.toggleCanvasZeroG(isGojoActive);
            }

            // Swap UI text (e.g. Aufa Satoru)
            updateModeText(isGojoActive);

            // Update Toggle Button label & icon
            const btnText = toggleBtn.querySelector('.btn-text');
            const btnIcon = toggleBtn.querySelector('.btn-mode-icon');

            if (btnText) {
                btnText.textContent = isGojoActive ? 'Exit Infinity Mode' : 'Infinity Mode';
            }
            if (btnIcon) {
                btnIcon.className = isGojoActive 
                    ? 'fa-solid fa-eye-slash btn-mode-icon' 
                    : 'fa-solid fa-eye btn-mode-icon';
            }

            toggleBtn.classList.toggle('active-gojo-btn', isGojoActive);
            toggleBtn.setAttribute('title', isGojoActive ? 'Matikan Gojo Satoru Mode' : 'Aktifkan Gojo Satoru Mode');
        }, switchMidpoint);

        // Phase 3: Hide Unlimited Void Portal Overlay
        setTimeout(() => {
            if (voidPortal) {
                voidPortal.classList.remove('active');
            }
            isTransitioning = false;
        }, portalDuration);
    }

    // Attach Click Event Listener
    toggleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        toggleInfinityMode();
    });

    console.log('Infinity Mode Controller (infinity-mode.js) initialized successfully.');
});
