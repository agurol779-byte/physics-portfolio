const BIN_ID = '69e2503736566621a8c3e82c';
const MASTER_KEY = '$2a$10$KckvLL9WKnatkXlZ699Xe.g5zJRFDZ5HYns2ndYDqL6uONzlp69cy';
const ADMIN_PASS = "physics123";

let articles = [];
let currentLang = 'en';

const translations = {
    en: { 
        about: "About Me", 
        logs: "My popular science articles", 
        desc: "I am a student who loves physics and is passionate about exploring the laws of the universe. I believe that science is the most powerful tool we have to understand the world around us.", 
        theme: "Light Mode" 
    },
    tr: { 
        about: "Hakkımda", 
        logs: "Popüler Bilim Makalelerim", 
        desc: "Fiziği seven ve evrenin yasalarını keşfetmeye tutkulu bir öğrenciyim. Bilimin, etrafımızdaki dünyayı anlamak için sahip olduğumuz en güçlü araç olduğuna inanıyorum.", 
        theme: "Gündüz Modu" 
    }
};

// --- ARKA PLAN (Sakin Süzülme) ---
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let formulas = [];

function initParticles() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    formulas = [];
    const list = ["E=mc²", "F=ma", "Ψ", "ΔxΔp≥ħ/2", "c=λf", "PV=nRT", "∇·E=ρ/ε₀", "ħ", "Gμν"];
    for(let i=0; i<35; i++) {
        formulas.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            text: list[Math.floor(Math.random()*list.length)],
            v: Math.random() * 0.2 + 0.1 // Çok yavaş hareket
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

// --- TEMA VE DİL ---
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
    document.getElementById('about-desc').innerText = translations[currentLang].desc;
};

// --- VERİTABANI İŞLEMLERİ ---
async function loadData() {
    try {
        const res = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
            headers: { 'X-Master-Key': MASTER_KEY }
        });
        const data = await res.json();
        articles = data.record || [];
        render();
    } catch (e) { console.error("Load failed"); }
}

function render() {
    const grid = document.getElementById('articles-grid');
    grid.innerHTML = "";
    articles.forEach((art, index) => {
        grid.insertAdjacentHTML('beforeend', `
            <div class="article-box">
                <div style="font-family:monospace; font-size:0.7rem; color:var(--primary); opacity:0.6; margin-bottom:10px;">// SOURCE: ${art.p || 'Physics'}</div>
                <h3 style="margin:0 0 15px 0;">${art.t}</h3>
                <a href="${art.u}" target="_blank" style="color:var(--primary); text-decoration:none; font-weight:bold; font-size:0.9rem;">READ_ARTICLE →</a>
                <button onclick="deleteArticle(${index})" style="display:block; background:none; border:none; color:#ef4444; cursor:pointer; font-size:0.6rem; margin-top:15px; opacity:0.4;">[ERASE]</button>
            </div>
        `);
    });
}

// --- GİZLİ PANEL VE DİĞERLERİ ---
window.addEventListener('keydown', (e) => {
    if (e.key === '1') {
        const panel = document.getElementById('admin-panel');
        panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
        if(panel.style.display === 'block') panel.scrollIntoView({ behavior: 'smooth' });
    }
});

window.onload = () => { initParticles(); animate(); loadData(); };
window.onresize = initParticles;
