// ANIMACIÓN DE ENTRADA AL HACER SCROLL
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("show");
        }
    });
}, {
    threshold: 0.2
});

document.querySelectorAll(".hidden").forEach(section => {
    observer.observe(section);
});

// BOTÓN PLAY (ejemplo)
const playButton = document.querySelector(".play-button");

const loadingOverlay = document.getElementById('loadingOverlay');
const loadingBar = document.getElementById('loadingBar');
const loadingText = document.getElementById('loadingText');

function showLoadingAndRedirect() {
    // show overlay
    loadingOverlay.classList.add('show');
    loadingOverlay.setAttribute('aria-hidden', 'false');
    playButton.disabled = true;
    playButton.style.transform = 'scale(1.05)';

    // simulate progressive loading
    let progress = 0;
    const step = 8; // % per tick
    const tick = 120; // ms
    const interval = setInterval(() => {
        progress += step;
        if (progress > 100) progress = 100;
        loadingBar.style.width = progress + '%';
        loadingText.textContent = `Cargando ${progress}%`;
        if (progress >= 100) {
            clearInterval(interval);
            // short pause to show 100%
            setTimeout(() => {
                window.location.href = 'config.html';
            }, 400);
        }
    }, tick);
}

playButton.addEventListener('click', () => {
    showLoadingAndRedirect();
});
