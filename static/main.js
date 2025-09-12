const img = document.getElementById('planet-img');

// Startup zoom-in animation
window.addEventListener('DOMContentLoaded', () => {
    img.classList.add('planet-zoom-in');
    setTimeout(() => {
        img.classList.remove('planet-zoom-in');
    }, 1200);
});


const btn = document.getElementById('generate-btn');
let canGenerate = true;
btn.addEventListener('click', function() {
    if (!canGenerate) return;
    canGenerate = false;
    btn.disabled = true;
    // Animate planet
    img.classList.add('planet-zoom-in');
    setTimeout(() => {
        img.classList.remove('planet-zoom-in');
    }, 1200);
    // Animate button
    btn.classList.remove('btn-zoom-in');
    // Force reflow to restart animation
    void btn.offsetWidth;
    btn.classList.add('btn-zoom-in');
    setTimeout(() => {
        btn.classList.remove('btn-zoom-in');
    }, 700);
    // Change planet image
    img.src = '/random-planet?' + Date.now();
    // Cooldown
    setTimeout(() => {
        canGenerate = true;
        btn.disabled = false;
    }, 2000);
});

img.addEventListener('load', function() {
    // No animation to reset
});
