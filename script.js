const BIN_ID = '69e2503736566621a8c3e82c';
const MASTER_KEY = '$2a$10$KckvLL9WKnatkXlZ699Xe.g5zJRFDZ5HYns2ndYDqL6uONzlp69cy';
const ADMIN_PASS = "physics123";

let articles = [];
let currentLang = 'en';

const scientificQuotes = {
    en: [{ q: "The most beautiful thing we can experience is the mysterious.", a: "Albert Einstein" }, { q: "Look up at the stars and not down at your feet.", a: "Stephen Hawking" }],
    tr: [{ q: "Deneyimleyebileceğimiz en güzel şey gizemli olandır.", a: "Albert Einstein" }, { q: "Ayaklarınıza değil, yıldızlara bakın.", a: "Stephen Hawking" }]
};

const translations = {
    en: { about: "About Me", logs: "My popular science articles", school: "Bilkent Erzurum Laboratory School (BELS)", status: "Student & Physics Researcher", follow: "FOLLOW +", desc: "I am a student who loves physics and is passionate about exploring the laws of the universe." },
    tr: { about: "Hakkımda", logs: "Popüler Bilim Makalelerim", school: "Bilkent Erzurum Laboratuvar Lisesi (BELS)", status: "Öğrenci & Fizik Araştırmacısı", follow: "TAKİP ET +", desc: "Fiziği seven ve evrenin yasalarını keşfetmeye tutkulu bir öğrenciyim." }
};

let selectedQuoteIndex = 0;

// --- ANİMASYON ---
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let formulas = [];

function initParticles() {
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;
    formulas = [];
    const list = ["E=mc²", "F=ma", "Ψ", "ΔxΔp≥ħ/2", "c=λf"];
    for(let i=0; i<50; i++) {
        formulas.push({ x: Math.random()*canvas.width, y: Math.random()*canvas.height, text: list[Math.floor(Math.random()*list.length)], vx: (Math.random()-0.5)*1, vy: (Math.random()-0.5)*1, fontSize: 18 });
    }
}

function animate() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--primary');
    formulas.forEach(f => {
        ctx.font = `${f.fontSize}px 'JetBrains Mono'`; ctx.fillText(f.text, f.x, f.y);
        f.x += f.vx; f.y += f.vy;
        if(f.x<0 || f.x>canvas.width) f.vx*=-1; if(f.y<0 || f.y>canvas.height) f.vy*=-1;
    });
    requestAnimationFrame(animate);
}

// --- SİSTEM ---
function updateLanguage() {
    const t = translations[currentLang];
    document.getElementById('about-title').innerText = t.about;
    document.getElementById('logs-title').innerText = t.logs;
    document.getElementById('about-desc').innerText = t.desc;
    document.getElementById('edu-school').innerText = t.school;
    document.getElementById('edu-status').innerText = t.status;
    document.getElementById('follow-btn').innerText = t.follow;
    document.getElementById('lang-btn').innerText = currentLang === 'en' ? 'TR' : 'EN';
    const q = scientificQuotes[currentLang][selectedQuoteIndex];
    document.getElementById('daily-quote').innerText = `"${q.q}"`;
    document.getElementById('quote-author').innerText = `— ${q.a}`;
}

document.getElementById('theme-btn').onclick = () => {
    const html = document.documentElement;
    const isDark = html.getAttribute('data-theme') === 'dark';
    html.setAttribute('data-theme', isDark ? 'light' : 'dark');
    document.getElementById('theme-btn').innerText = isDark ? "Dark Mode" : "Light Mode";
};

document.getElementById('lang-btn').onclick = () => { currentLang = currentLang === 'en' ? 'tr' : 'en'; updateLanguage(); };

async function loadData() {
    const res = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, { headers: { 'X-Master-Key': MASTER_KEY } });
    const data = await res.json(); articles = data.record || []; render();
}

function render() {
    const grid = document.getElementById('articles-grid'); grid.innerHTML = "";
    articles.forEach((art, i) => {
        grid.insertAdjacentHTML('beforeend', `<div class="article-box"><h3>${art.t}</h3><a href="${art.u}" target="_blank" style="color:var(--primary)">READ →</a><button onclick="deleteArticle(${i})" style="display:block;margin-top:10px;color:red;background:none;border:none;cursor:pointer">ERASE</button></div>`);
    });
}

async function addArticle() {
    if(prompt("Pass:") !== ADMIN_PASS) return;
    articles.push({ t: document.getElementById('post-title').value, u: document.getElementById('post-url').value });
    await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', 'X-Master-Key': MASTER_KEY }, body: JSON.stringify(articles) });
    render();
}

window.addEventListener('keydown', (e) => { if(e.key === '1') { const p = document.getElementById('admin-panel'); p.style.display = p.style.display==='none'?'block':'none'; } });
window.onload = () => { initParticles(); animate(); loadData(); updateLanguage(); };
