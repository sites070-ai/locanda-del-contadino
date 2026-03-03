/* ================================================================
   FILE: script-additions.js
   Locanda del Contadino – JS per i nuovi componenti
   Incolla in fondo al tuo script.js esistente
   ================================================================

   INDICE:
   1. Promo Banner – dismiss + sessionStorage
   2. Progress Bar di lettura
   3. Back to Top
   4. Filter Bar (pill tabs)
   5. Toast Notification (funzione riutilizzabile)
   6. Cookie Consent Banner
   7. Mobile CTA Bar – nascondi in fondo pagina
   ================================================================ */


/* ── 1. PROMO BANNER ── */
(function () {
    const banner = document.querySelector('.promo-banner');
    if (!banner) return;

    // Nascondi se già chiuso in questa sessione
    if (sessionStorage.getItem('promo-dismissed')) {
        banner.classList.add('hidden');
        document.body.classList.remove('has-promo-banner');
    }

    document.querySelector('.promo-banner-close')?.addEventListener('click', () => {
        banner.classList.add('hidden');
        document.body.classList.remove('has-promo-banner');
        sessionStorage.setItem('promo-dismissed', '1');
    });
})();


/* ── 2. PROGRESS BAR DI LETTURA ── */
(function () {
    const bar = document.querySelector('.reading-progress');
    if (!bar) return;

    window.addEventListener('scroll', () => {
        const doc  = document.documentElement;
        const scrolled = doc.scrollTop / (doc.scrollHeight - doc.clientHeight) * 100;
        bar.style.width = Math.min(scrolled, 100) + '%';
    }, { passive: true });
})();


/* ── 3. BACK TO TOP ── */
(function () {
    const btn = document.querySelector('.back-to-top');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        btn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
})();


/* ── 4. FILTER BAR (pill tabs) ──
   Uso HTML:
   <button class="filter-pill active" data-filter="all">Tutte</button>
   <button class="filter-pill" data-filter="classiche">Classiche</button>
   ...
   <div class="filter-section" data-category="classiche">...</div>
*/
(function () {
    const pills = document.querySelectorAll('.filter-pill');
    if (!pills.length) return;

    pills.forEach(pill => {
        pill.addEventListener('click', () => {
            // Aggiorna active
            pills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');

            const target = pill.dataset.filter;

            // Mostra/nascondi sezioni
            document.querySelectorAll('.filter-section').forEach(sec => {
                const match = target === 'all' || sec.dataset.category === target;
                sec.classList.toggle('hidden', !match);
            });
        });
    });
})();


/* ── 5. TOAST NOTIFICATION ──
   Uso: showToast('success', 'Inviato!', 'Messaggio ricevuto.');
   Tipi: success | error | warning | info
*/
function showToast(type, title, message, duration = 4000) {
    let container = document.querySelector('.toast-container');

    // Crea il container se non esiste
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <span class="toast-icon">${icons[type] || 'ℹ️'}</span>
        <div class="toast-body">
            <div class="toast-title">${title}</div>
            <p class="toast-message">${message}</p>
        </div>
        <button class="toast-close" aria-label="Chiudi">✕</button>
    `;

    container.appendChild(toast);

    // Trigger animazione entrata
    requestAnimationFrame(() => {
        requestAnimationFrame(() => toast.classList.add('show'));
    });

    const remove = () => {
        toast.classList.remove('show');
        toast.classList.add('hide');
        setTimeout(() => toast.remove(), 400);
    };

    // Auto-dismiss
    const timer = setTimeout(remove, duration);

    // Click su X
    toast.querySelector('.toast-close').addEventListener('click', () => {
        clearTimeout(timer);
        remove();
    });
}

// Esempio uso su form contatti:
// document.querySelector('#form-contatti')?.addEventListener('submit', (e) => {
//     e.preventDefault();
//     showToast('success', 'Messaggio inviato!', 'Ti risponderemo al più presto.');
// });


/* ── 6. COOKIE CONSENT BANNER ── */
(function () {
    const banner = document.querySelector('.cookie-banner');
    if (!banner) return;

    // Mostra solo se consenso non ancora dato
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
        // Piccolo delay per non bloccare il caricamento
        setTimeout(() => banner.classList.remove('hidden'), 800);
    } else {
        banner.classList.add('hidden');
    }

    const hideBanner = (value) => {
        localStorage.setItem('cookie-consent', value);
        banner.classList.add('hidden');
    };

    document.querySelector('.cookie-btn-accept')?.addEventListener('click', () => hideBanner('all'));
    document.querySelector('.cookie-btn-necessary')?.addEventListener('click', () => hideBanner('necessary'));

    // Tasto impostazioni: apre pagina privacy
    document.querySelector('.cookie-btn-settings')?.addEventListener('click', () => {
        window.location.href = 'privacy-cookie-info-legali.html';
    });
})();


/* ── 7. MOBILE CTA BAR ──
   Nasconde la barra quando si è in fondo alla pagina
   (es. sopra il footer, per non coprire i link legali)
*/
(function () {
    const bar = document.querySelector('.mobile-cta-bar');
    if (!bar) return;

    window.addEventListener('scroll', () => {
        const atBottom = (window.innerHeight + window.scrollY) >= document.body.offsetHeight - 120;
        bar.classList.toggle('hidden', atBottom);
    }, { passive: true });
})();
