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

// Pestañas para separar Sonidos / Gráficos
(function(){
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    if (!tabBtns || tabBtns.length === 0) return;
    const STORAGE_KEY = 'config-active-tab';

    function activateTab(name, persist = true) {
        tabBtns.forEach(btn => {
            const is = btn.dataset.tab === name;
            btn.classList.toggle('active', is);
            btn.setAttribute('aria-selected', is ? 'true' : 'false');
            btn.tabIndex = is ? 0 : -1;
        });
        tabContents.forEach(tc => {
            const show = tc.id === 'tab-' + name;
            tc.classList.toggle('active', show);
            if (show) tc.removeAttribute('hidden'); else tc.setAttribute('hidden', '');
        });
        if (persist) localStorage.setItem(STORAGE_KEY, name);
    }

    tabBtns.forEach(btn => {
        btn.addEventListener('click', ()=> activateTab(btn.dataset.tab));
        btn.addEventListener('keydown', (e)=>{
            if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                const list = Array.from(tabBtns);
                let idx = list.indexOf(btn);
                if (e.key === 'ArrowRight') idx = (idx + 1) % list.length; else idx = (idx - 1 + list.length) % list.length;
                list[idx].focus();
                activateTab(list[idx].dataset.tab);
            }
        });
    });

    const saved = localStorage.getItem(STORAGE_KEY);
    activateTab(saved || 'sonidos', false);
})();

// Controles: reasignación de teclas
(function(){
    const DEFAULTS = {
        acelerar: 'W',
        frenar: 'S',
        girar_izq: 'A',
        girar_der: 'D',
        nitro: 'Space',
        bocina: 'H'
    };
    const STORAGE = 'controls-mapping';
    function load(){
        try { return JSON.parse(localStorage.getItem(STORAGE)) || {} } catch(e){ return {} }
    }
    function save(obj){ localStorage.setItem(STORAGE, JSON.stringify(obj)); }

    let mapping = Object.assign({}, DEFAULTS, load());

    function updateButton(action){
        const btn = document.querySelector('.key-btn[data-action="'+action+'"]');
        if (!btn) return;
        btn.textContent = mapping[action] || '—';
    }

    document.querySelectorAll('.control-item').forEach(item => {
        const action = item.dataset.action;
        const btn = item.querySelector('.key-btn');
        updateButton(action);

        btn.addEventListener('click', ()=>{
            if (btn.classList.contains('waiting')) return;
            btn.classList.add('waiting');
            const prev = btn.textContent;
            btn.textContent = 'Pulsa una tecla... (Esc para cancelar)';

            function onKey(e){
                e.preventDefault();
                if (e.key === 'Escape') {
                    btn.textContent = prev;
                    btn.classList.remove('waiting');
                    document.removeEventListener('keydown', onKey);
                    return;
                }
                let key = e.key === ' ' ? 'Space' : e.key;
                mapping[action] = key;
                save(mapping);
                updateButton(action);
                btn.classList.remove('waiting');
                document.removeEventListener('keydown', onKey);
            }
            document.addEventListener('keydown', onKey);
        });
    });

    const resetBtn = document.getElementById('reset-controls');
    if (resetBtn) {
        resetBtn.addEventListener('click', ()=>{
            mapping = Object.assign({}, DEFAULTS);
            save(mapping);
            Object.keys(mapping).forEach(updateButton);
        });
    }
})();
