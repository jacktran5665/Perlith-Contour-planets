// Animated starfield background for Perlin Planet Mapper
const canvas = document.getElementById('star-canvas');
const ctx = canvas.getContext('2d');

let stars = [];
const STAR_COUNT = 120;
const STAR_COLORS = ['#fff', '#b5e3ff', '#ffe3b5', '#e3b5ff'];

// Parallax variables
let parallax = { x: 0, y: 0 };
let targetParallax = { x: 0, y: 0 };
const PARALLAX_STRENGTH = 20;

// Shooting stars
let shootingStars = [];
function spawnShootingStar(x, y) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 8 + Math.random() * 4;
    shootingStars.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0,
        maxLife: 40 + Math.random() * 20
    });
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function randomStar() {
    return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.2 + 0.3,
        color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
        twinkle: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.02 + 0.005
    };
}

function createStars() {
    stars = [];
    for (let i = 0; i < STAR_COUNT; i++) {
        stars.push(randomStar());
    }
}

function drawStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Parallax offset
    for (let s of stars) {
        let px = s.x + parallax.x * (s.r / 2);
        let py = s.y + parallax.y * (s.r / 2);
        let alpha = 0.7 + 0.3 * Math.sin(s.twinkle);
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(px, py, s.r, 0, 2 * Math.PI);
        ctx.fillStyle = s.color;
        ctx.fill();
    }
    ctx.globalAlpha = 1.0;

    // Draw shooting stars
    for (let ss of shootingStars) {
        ctx.save();
        ctx.globalAlpha = 1 - ss.life / ss.maxLife;
        ctx.strokeStyle = '#fffbe6';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(ss.x, ss.y);
        ctx.lineTo(ss.x - ss.vx * 2, ss.y - ss.vy * 2);
        ctx.stroke();
        ctx.restore();
    }
}

function animateStars() {
    // Smooth parallax interpolation
    parallax.x += (targetParallax.x - parallax.x) * 0.08;
    parallax.y += (targetParallax.y - parallax.y) * 0.08;

    for (let s of stars) {
        s.twinkle += s.speed;
        if (s.twinkle > Math.PI * 2) s.twinkle -= Math.PI * 2;
    }

    // Animate shooting stars
    for (let ss of shootingStars) {
        ss.x += ss.vx;
        ss.y += ss.vy;
        ss.life++;
    }
    shootingStars = shootingStars.filter(ss => ss.life < ss.maxLife && ss.x >= 0 && ss.x <= canvas.width && ss.y >= 0 && ss.y <= canvas.height);

    drawStars();
    requestAnimationFrame(animateStars);
}


window.addEventListener('resize', () => {
    resizeCanvas();
    createStars();
});

// Parallax effect: mouse move
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    targetParallax.x = ((mx / canvas.width) - 0.5) * PARALLAX_STRENGTH;
    targetParallax.y = ((my / canvas.height) - 0.5) * PARALLAX_STRENGTH;
});

canvas.addEventListener('mouseleave', () => {
    targetParallax.x = 0;
    targetParallax.y = 0;
});

// Shooting star on click
canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    spawnShootingStar(mx, my);
});

resizeCanvas();
createStars();
animateStars();
