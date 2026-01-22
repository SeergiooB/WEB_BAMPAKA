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

playButton.addEventListener("click", () => {
    playButton.innerText = "LOADING...";
    playButton.style.transform = "scale(1.3)";
    
    setTimeout(() => {
        alert("Aquí arrancaría el juego 🚀");
        playButton.innerText = "PLAY";
        playButton.style.transform = "scale(1)";
    }, 1500);
});
