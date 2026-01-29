// Manejo de selección de coche (secciones por coche) + inicialización AOS y Flickity
const carSections = document.querySelectorAll('.car-section');
const confirmBtn = document.getElementById('confirmBtn');
const backBtn = document.getElementById('backToConfig');
const STORAGE_KEY = 'selectedCar';

function updateConfirmState() {
    const selected = document.querySelector('.car-section.selected');
    if (confirmBtn) confirmBtn.disabled = !selected;
}

function selectSection(section) {
    // remove previous selection & description highlight
    carSections.forEach(s => {
        s.classList.remove('selected');
        const sd = s.querySelector('.car-desc');
        if (sd) sd.classList.remove('desc-highlight');
    });

    // mark this section
    section.classList.add('selected');
    const desc = section.querySelector('.car-desc');
    if (desc) desc.classList.add('desc-highlight');

    // sync nav cells highlight
    const navCellsLocal = document.querySelectorAll('.car-nav .nav-cell');
    const idx = Array.from(carSections).indexOf(section);
    navCellsLocal.forEach((c, i) => c.classList.toggle('is-selected', i === idx));

    // persist selection
    const file = section.getAttribute('data-file');
    try { localStorage.setItem(STORAGE_KEY, file); } catch(e) { /* noop */ }
    updateConfirmState();
}

// click handlers: clicking en la sección o en el botón
carSections.forEach(section => {
    section.addEventListener('click', () => selectSection(section));
    const btn = section.querySelector('.select-btn');
    if (btn) {
        btn.addEventListener('click', (ev) => { ev.stopPropagation(); selectSection(section); });
    }
});

// restore previous selection if any
(function restore() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const el = document.querySelector(`.car-section[data-file="${saved}"]`);
            if (el) selectSection(el);
        }
    } catch(e) { /* noop */ }
    updateConfirmState();
})();

if (confirmBtn) {
    confirmBtn.addEventListener('click', () => {
        // after choosing a car, go to the character selection page
        window.location.href = 'elige_personaje.html';
    });
}

if (backBtn) {
    backBtn.addEventListener('click', () => { window.location.href = 'config.html'; });
}

// keyboard accessibility: make sections focusable and selectable with Enter/Space
carSections.forEach(section => {
    section.setAttribute('tabindex', '0');
    section.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectSection(section); }
    });
});

// Set AOS attributes based on section index so animations match the alternating layout
carSections.forEach((section, idx) => {
    const img = section.querySelector('.car-img');
    const desc = section.querySelector('.car-desc');
    if (!img || !desc) return;
    if (idx % 2 === 0) {
        img.setAttribute('data-aos', 'fade-right');
        desc.setAttribute('data-aos', 'fade-left');
    } else {
        img.setAttribute('data-aos', 'fade-left');
        desc.setAttribute('data-aos', 'fade-right');
    }
});

// Initialize AOS (scroll animations)
if (typeof AOS !== 'undefined') {
    AOS.init({ duration: 900, easing: 'ease-in-out', once: true, offset: 120 });
    // ensure AOS picks up attributes we set dynamically
    AOS.refresh();
}

// Initialize Flickity for the top nav and connect it to sections
const navElem = document.querySelector('.car-nav');
let flkty = null;
if (navElem && typeof Flickity !== 'undefined') {
    flkty = new Flickity(navElem, {
        cellSelector: '.nav-cell',
        contain: true,
        pageDots: false,
        prevNextButtons: false,
        freeScroll: true,
        wrapAround: false
    });

    // when a nav cell is clicked, scroll to the corresponding section
    const navCells = navElem.querySelectorAll('.nav-cell');
    navCells.forEach((cell, idx) => {
        cell.addEventListener('click', () => {
            const target = carSections[idx];
            if (target) {
                // select the section (this also syncs nav highlight and desc highlight)
                selectSection(target);
                // scroll smoothly to the section
                target.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    });
}

// Sync nav with the section currently in view using IntersectionObserver
const navCells = navElem ? navElem.querySelectorAll('.nav-cell') : [];
if (carSections.length > 0 && typeof IntersectionObserver !== 'undefined') {
    // IntersectionObserver remains but DOES NOT change selection or illumination on scroll.
    // Selection/illumination is only triggered by user actions (click section or click nav cell).
    const sectionObserver = new IntersectionObserver((entries) => {
        // intentionally empty: do not toggle .is-selected or .selected on scroll
        // keeping observer in case future non-visual behaviour is needed
        entries.forEach(entry => {
            // no-op
        });
    }, { threshold: 0.55 });

    carSections.forEach(s => sectionObserver.observe(s));
}
