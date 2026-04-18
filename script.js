const BIN_ID = '69e2503736566621a8c3e82c';
const MASTER_KEY = '$2a$10$KckvLL9WKnatkXlZ699Xe.g5zJRFDZ5HYns2ndYDqL6uONzlp69cy';
const ADMIN_PASS = "physics123";

let articles = [];
let currentLang = 'en';

const translations = {
    en: { about: "About Me", logs: "My popular science articles", contact: "Contact & Professional Network", theme: "Light Mode" },
    tr: { about: "Hakkımda", logs: "Popüler Bilim Makalelerim", contact: "İletişim ve Profesyonel Ağ", theme: "Gündüz Modu" }
};

// --- ARKA PLAN MOTORU ---
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let formulas = [];

function initParticles() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    formulas = [];
    const list = ["E=mc²", "F=ma", "Ψ", "ΔxΔp≥ħ/2", "c=λf", "PV=nRT", "∇·E=ρ/ε₀", "ħ"];
    for(let i=0; i<35; i++) {
        formulas.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            text: list[Math.floor(Math.random()*list.length)],
            v: Math.random() * 0.2 + 0.1
        });
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const color = getComputedStyle(document.documentElement).getPropertyValue('--formula-color');
    ctx.fillStyle = color;
    ctx.font = "13px monospace";
    formulas.forEach(f => {
        ctx.fillText(f.text, f.x, f.y);
        f.y -= f.v;
        if(f.y < -20) f.y = canvas.height + 20;
    });
    requestAnimationFrame(animate);
}

// --- KONTROLLER ---
document.getElementById('theme-btn').onclick = function() {
    const html = document.documentElement;
    const isDark = html.getAttribute('data-theme') === 'dark';
    html.setAttribute('data-theme', isDark ? 'light' : 'dark');
    this.innerText = isDark ? "Dark Mode" : "Light Mode";
};

document.getElementById('lang-btn').onclick = function() {
    currentLang = currentLang === 'en' ? 'tr' : 'en';
    this.innerText = currentLang === 'en' ? 'TR' : 'EN';
    document.getElementById('about-title').innerText = translations[currentLang].about;
    document.getElementById('logs-title').innerText = translations[currentLang].logs;
    document.querySelector('.footer-title').innerText = translations[currentLang].contact;
};

// --- DATABASE ---
async function loadData() {
    try {
        const res = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
            headers: { 'X-Master-Key': MASTER_KEY }
        });
        const data = await res.json();
        articles = data.record || [];
        render();
    } catch (e) { console.error("API Error"); }
}

function render() {
    const grid = document.getElementById('articles-grid');
    grid.innerHTML = "";
    articles.forEach((art, index) => {
        grid.insertAdjacentHTML('beforeend', `
            <div class="article-box">
                <div style="font-family:monospace; font-size:0.7rem; color:var(--primary); opacity:0.6; margin-bottom:10px;">// ${art.p || 'Physics'}</div>
                <h3 style="margin:0 0 15px 0;">${art.t}</h3>
                <a href="${art.u}" target="_blank" style="color:var(--primary); text-decoration:none; font-weight:bold;">READ_ARTICLE →</a>
                <button onclick="deleteArticle(${index})" style="background:none; border:none; color:#ef4444; cursor:pointer; font-size:0.6rem; display:block; margin-top:15px; opacity:0.3;">[ERASE]</button>
            </div>
        `);
    });
}

// GİZLİ PANEL
window.addEventListener('keydown', (e) => {
    if (e.key === '1') {
        const panel = document.getElementById('admin-panel');
        panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    }
});

window.onload = () => { initParticles(); animate(); loadData(); };
window.onresize = initParticles;
