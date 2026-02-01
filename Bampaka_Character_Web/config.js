document.getElementById('backButton').addEventListener('click', function() {
    window.location.href = 'index.html';
});
// No preview shown on config page per user's request

// Selectores de Gráficos (múltiples, ciclo con flechas)
(function() {
    const options = [
        { key: 'low', label: 'Baja' },
        { key: 'medium', label: 'Medio' },
        { key: 'high', label: 'Alta' },
        { key: 'ultra', label: 'Ultra' }
    ];

    const items = document.querySelectorAll('.graphics-item');
    if (!items || items.length === 0) return;

    items.forEach(function(item) {
        const sel = item.querySelector('.option-selector');
        const left = sel.querySelector('.opt-btn.left');
        const right = sel.querySelector('.opt-btn.right');
        const valueEl = sel.querySelector('.opt-value');
        const hidden = item.querySelector('input[type="hidden"]');
        if (!left || !right || !valueEl || !hidden) return;

        const storageKey = hidden.id + '-setting';
        let currentIndex = 1; // default 'Medio'

        const saved = localStorage.getItem(storageKey);
        if (saved) {
            const idx = options.findIndex(o => o.key === saved);
            if (idx >= 0) currentIndex = idx;
        } else {
            const hv = hidden.value;
            const idx = options.findIndex(o => o.key === hv);
            if (idx >= 0) currentIndex = idx;
        }

        function update() {
            const opt = options[currentIndex];
            valueEl.textContent = opt.label;
            hidden.value = opt.key;
            localStorage.setItem(storageKey, opt.key);
            valueEl.animate([{ transform: 'scale(0.98)' }, { transform: 'scale(1)' }], { duration: 140, easing: 'ease-out' });
        }

        left.addEventListener('click', function() {
            currentIndex = (currentIndex - 1 + options.length) % options.length;
            update();
        });
        right.addEventListener('click', function() {
            currentIndex = (currentIndex + 1) % options.length;
            update();
        });

        // soporte por teclado
        valueEl.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowLeft') left.click();
            if (e.key === 'ArrowRight') right.click();
        });

        // inicializa cada selector
        update();
    });
})();
