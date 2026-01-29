// Simple custom carousel (no Flickity) that shows 4 characters at once
const carouselEl = document.querySelector('.char-carousel');
const track = document.querySelector('.char-track');
const prevBtn = document.querySelector('.carousel-btn.prev');
const nextBtn = document.querySelector('.carousel-btn.next');
const confirmCharBtn = document.getElementById('confirmCharBtn');
const backToCars = document.getElementById('backToCars');
const CHAR_KEY = 'selectedCharacter';

function updateCharConfirmState() {
    const sel = document.querySelector('.carousel-cell.is-selected');
    if (confirmCharBtn) confirmCharBtn.disabled = !sel;
}

function selectCharacter(cell, scrollIntoView = true) {
    const cells = document.querySelectorAll('.carousel-cell');
    cells.forEach(c => c.classList.remove('is-selected'));
    cell.classList.add('is-selected');
    const file = cell.getAttribute('data-file');
    try { localStorage.setItem(CHAR_KEY, file); } catch(e) { /* noop */ }
    updateCharConfirmState();
    if (scrollIntoView && cell && typeof cell.scrollIntoView === 'function') {
        // use scrollIntoView to center the cell in the track
        cell.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
}

function showCharacterDetails(cell) {
    const details = document.getElementById('charDetails');
    const nameEl = document.getElementById('charName');
    const descEl = document.getElementById('charDesc');
    const statsEl = document.getElementById('charStats');
    const thumbEl = document.getElementById('charThumb');
    if (!details || !nameEl || !descEl || !statsEl) return;

    const name = cell.getAttribute('data-name') || cell.querySelector('.char-info h3')?.textContent || 'Personaje';
    const desc = cell.getAttribute('data-desc') || '';
    const statsAttr = cell.getAttribute('data-stats') || '';

    nameEl.textContent = name;
    descEl.textContent = desc;
    statsEl.innerHTML = '';
    if (thumbEl) {
        const file = cell.getAttribute('data-file');
        if (file) { thumbEl.src = file; thumbEl.alt = name; }
    }
    if (statsAttr) {
        const parts = statsAttr.split(';').map(s => s.trim()).filter(Boolean);
        parts.forEach(p => {
            const [labelRaw, valRaw] = p.split(':').map(s => s.trim());
            const label = labelRaw || '';
            let value = valRaw || '';
            const m = value.match(/(\d+)(?:\/\d+)?/);
            let num = 0;
            if (m) num = parseInt(m[1], 10);
            const percent = Math.max(0, Math.min(100, Math.round((num / 10) * 100)));

            const row = document.createElement('div');
            row.className = 'stat-row';
            const lbl = document.createElement('div'); lbl.className = 'stat-label'; lbl.textContent = label;
            const barWrap = document.createElement('div'); barWrap.className = 'stat-bar';
            const fill = document.createElement('div'); fill.className = 'stat-fill';
            barWrap.appendChild(fill);
            const val = document.createElement('div'); val.className = 'stat-value'; val.textContent = `${num}/10`;
            row.appendChild(lbl);
            row.appendChild(barWrap);
            row.appendChild(val);
            statsEl.appendChild(row);

            setTimeout(() => { fill.style.width = percent + '%'; }, 40);
        });
    }
    details.classList.remove('hidden');
}

// wire up cells
if (track) {
    const cells = track.querySelectorAll('.carousel-cell');
    cells.forEach((cell, idx) => {
        cell.setAttribute('tabindex', '0');
        cell.addEventListener('click', () => { selectCharacter(cell); showCharacterDetails(cell); });
        cell.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectCharacter(cell); showCharacterDetails(cell); }
        });
    });

    // prev/next buttons scroll by one cell width
    function scrollByCell(amount) {
        const firstCell = track.querySelector('.carousel-cell');
        if (!firstCell) return;
        const cellWidth = firstCell.getBoundingClientRect().width + 12; // include gap
        track.scrollBy({ left: cellWidth * amount, behavior: 'smooth' });
    }
    if (prevBtn) prevBtn.addEventListener('click', () => scrollByCell(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => scrollByCell(1));

    // restore previous selection
    try {
        const saved = localStorage.getItem(CHAR_KEY);
        if (saved) {
            const el = track.querySelector(`.carousel-cell[data-file="${saved}"]`);
            if (el) { selectCharacter(el, true); showCharacterDetails(el); }
        }
    } catch(e) { /* noop */ }
}

// update active slide based on scroll position (debounced)
if (track) {
    let scrollTimer = null;
    track.addEventListener('scroll', () => {
        if (scrollTimer) clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => {
            // determine cell whose center is closest to track center
            const cells = Array.from(track.querySelectorAll('.carousel-cell'));
            const trackRect = track.getBoundingClientRect();
            const trackCenter = (trackRect.left + trackRect.right) / 2;
            let best = null;
            let bestDist = Infinity;
            cells.forEach(c => {
                const r = c.getBoundingClientRect();
                const cCenter = (r.left + r.right) / 2;
                const dist = Math.abs(cCenter - trackCenter);
                if (dist < bestDist) { bestDist = dist; best = c; }
            });
            if (best) {
                // if not already selected, select and show details
                if (!best.classList.contains('is-selected')) {
                    selectCharacter(best, false);
                    showCharacterDetails(best);
                }
            }
        }, 120);
    });
}

if (confirmCharBtn) {
    confirmCharBtn.addEventListener('click', () => { window.location.href = 'config.html'; });
}

if (backToCars) {
    backToCars.addEventListener('click', () => { window.location.href = 'elige_coche.html'; });
}
