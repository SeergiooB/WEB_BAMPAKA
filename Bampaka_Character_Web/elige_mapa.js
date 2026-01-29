// Map selection page logic
const mapGrid = document.getElementById('mapGrid');
const confirmMapBtn = document.getElementById('confirmMapBtn');
const backToChars = document.getElementById('backToChars');
const mapThumb = document.getElementById('mapThumb');
const mapNameEl = document.getElementById('mapName');
const mapDescEl = document.getElementById('mapDesc');
const mapDetails = document.getElementById('mapDetails');
const MAP_KEY = 'selectedMap';

function updateConfirmState() {
    const sel = document.querySelector('.map-card.is-selected');
    if (confirmMapBtn) confirmMapBtn.disabled = !sel;
}

function showMapDetails(card) {
    if (!card) return;
    const id = card.dataset.id || '';
    const name = card.querySelector('.map-label')?.textContent || 'Mapa';
    const desc = `Descripción del ${name}. Pistas estrechas, curvas cerradas y atajos secretos.`;
    if (mapThumb) {
        const img = card.querySelector('img');
        mapThumb.src = img ? img.src : '';
        mapThumb.alt = name;
    }
    if (mapNameEl) mapNameEl.textContent = name;
    if (mapDescEl) mapDescEl.textContent = desc;
    if (mapDetails) mapDetails.classList.remove('hidden');
}

function selectMap(card) {
    const cards = document.querySelectorAll('.map-card');
    cards.forEach(c => c.classList.remove('is-selected'));
    card.classList.add('is-selected');
    // visual burst
    burstEffect(card);
    try { localStorage.setItem(MAP_KEY, card.dataset.id || ''); } catch(e) {}
    updateConfirmState();
    showMapDetails(card);
}

function burstEffect(card) {
    const s = card.querySelector('.sparkles');
    if (!s) return;
    s.classList.remove('playing');
    // trigger reflow
    void s.offsetWidth;
    s.classList.add('playing');
}

if (mapGrid) {
    const cards = Array.from(mapGrid.querySelectorAll('.map-card'));
    cards.forEach(card => {
        card.setAttribute('tabindex', '0');
        card.addEventListener('click', () => selectMap(card));
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectMap(card); }
        });
    });

    // restore previous selection if any
    try {
        const saved = localStorage.getItem(MAP_KEY);
        if (saved) {
            const el = mapGrid.querySelector(`.map-card[data-id="${saved}"]`);
            if (el) { selectMap(el); }
        }
    } catch(e) {}
}

if (confirmMapBtn) {
    confirmMapBtn.addEventListener('click', () => {
        // show modal warning instead of navigating directly
        const modal = document.getElementById('startWarningModal');
        if (modal) modal.classList.remove('hidden');
    });
}
if (backToChars) {
    backToChars.addEventListener('click', () => { window.location.href = 'elige_personaje.html'; });
}

// modal handlers
const modal = document.getElementById('startWarningModal');
const modalStart = document.getElementById('modalStart');
const modalCancel = document.getElementById('modalCancel');
if (modalStart) {
    modalStart.addEventListener('click', () => {
        // Here we'd actually start the game; for now navigate to index and close modal
        window.location.href = 'index.html';
    });
}
if (modalCancel) {
    modalCancel.addEventListener('click', () => {
        if (modal) modal.classList.add('hidden');
    });
}

// small accessibility: focus trap visual when tabbing into grid
if (mapGrid) mapGrid.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
        e.preventDefault(); const next = document.activeElement.nextElementSibling; if (next) next.focus();
    }
    if (e.key === 'ArrowLeft') {
        e.preventDefault(); const prev = document.activeElement.previousElementSibling; if (prev) prev.focus();
    }
});
