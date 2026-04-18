const BIN_ID = '69e2503736566621a8c3e82c';
const MASTER_KEY = '$2a$10$KckvLL9WKnatkXlZ699Xe.g5zJRFDZ5HYns2ndYDqL6uONzlp69cy';
const ADMIN_PASS = "physics123";

let articles = [];
let currentLang = 'en';

const scientificQuotes = {
    en: [
        { q: "The most beautiful thing we can experience is the mysterious.", a: "Albert Einstein" },
        { q: "Look up at the stars and not down at your feet.", a: "Stephen Hawking" },
        { q: "Somewhere, something incredible is waiting to be known.", a: "Carl Sagan" },
        { q: "Nothing in life is to be feared, it is only to be understood.", a: "Marie Curie" }
    ],
    tr: [
        { q: "Deneyimleyebileceğimiz en güzel şey gizemli olandır.", a: "Albert Einstein" },
        { q: "Ayaklarınıza değil, yıldızlara bakın.", a: "Stephen Hawking" },
        { q: "Bir yerlerde, inanılmaz bir şey bilinmeyi bekliyor.", a: "Carl Sagan" },
        { q: "Hayatta hiçbir şeyden korkulmamalıdır, sadece anlaşılmalıdır.", a: "Marie Curie" }
    ]
};

const translations = {
    en: { 
        about: "About Me", 
        logs: "My popular science articles", 
        contact: "Contact & Professional Network", 
        theme: "Light Mode",
        desc: "I am a student who loves physics and is passionate about exploring the laws of the universe. I believe that science is the most powerful tool we have to understand the world around us."
    },
    tr: { 
        about: "Hakkımda", 
        logs: "Popüler Bilim Makalelerim", 
        contact: "İletişim ve Profesyonel Ağ", 
        theme: "Gündüz Modu",
        desc: "Fiziği seven ve evrenin yasalarını keşfetmeye tutkulu bir öğrenciyim. Bilimin, etrafımızdaki dünyayı anlamak için sahip olduğumuz en güçlü araç olduğuna inanıyorum."
    }
};

// --- DİL VE SÖZ FONKSİYONU ---
function updateLanguage() {
    const t = translations[currentLang];
    document.getElementById('about-title').innerText = t.about;
    document.getElementById('logs-title').innerText = t.logs;
    document.getElementById('footer-title').innerText = t.contact;
    document.getElementById('about-desc').innerText = t.desc;
    document.getElementById('lang-btn').innerText = currentLang === 'en' ? 'TR' : 'EN';
    setRandomQuote();
}

function setRandomQuote() {
    const quotes = scientificQuotes[currentLang];
    const random = quotes[Math.floor(Math.random() * quotes.length)];
    document.getElementById('daily-quote').innerText = `"${random.q}"`;
    document.getElementById('quote-author').innerText = `— ${random.a}`;
}

// --- TEMA VE NAVİGASYON ---
document.getElementById('theme-btn').onclick = function() {
    const html = document.documentElement;
    const isDark = html.getAttribute('data-theme') === 'dark';
    html.setAttribute('data-theme', isDark ? 'light' : 'dark');
    this.innerText = isDark ? "Dark Mode" : "Light Mode";
};

document.getElementById('lang-btn').onclick = function() {
    currentLang = currentLang === 'en' ? 'tr' : 'en';
    updateLanguage();
};

// --- ARKA PLAN SİSTEMİ ---
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
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--formula-color');
    ctx.font = "13px monospace";
    formulas.forEach(f => {
        ctx.fillText(f.text, f.x, f.y);
        f.y -= f.v;
        if(f.y < -20) f.y = canvas.height + 20;
    });
    requestAnimationFrame(animate);
}

// --- VERİ ÇEKME VE PANEL ---
async function loadData() {
    try {
        const res = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
            headers: { 'X-Master-Key': MASTER_KEY }
        });
        const data = await res.json();
        articles = data.record || [];
        render();
    } catch (e) { console.error("Error"); }
}

function render() {
    const grid = document.getElementById('articles-grid');
    grid.innerHTML = "";
    articles.forEach((art, index) => {
        grid.insertAdjacentHTML('beforeend', `
            <div class="article-box">
                <div style="font-family:monospace; font-size:0.7rem; color:var(--primary); opacity:0.6; margin-bottom:10px;">// SOURCE: ${art.p}</div>
                <h3 style="margin:0 0 15px 0;">${art.t}</h3>
                <a href="${art.u}" target="_blank" style="color:var(--primary); text-decoration:none; font-weight:bold;">READ_ARTICLE →</a>
                <button onclick="deleteArticle(${index})" style="background:none; border:none; color:#ef4444; cursor:pointer; font-size:0.6rem; display:block; margin-top:15px; opacity:0.3;">[ERASE]</button>
            </div>
        `);
    });
}

// Admin İşlemleri
async function addArticle() {
    const check = prompt("Admin Key:");
    if (check !== ADMIN_PASS) return;
    const t = document.getElementById('post-title').value;
    const p = document.getElementById('post-platform').value;
    const u = document.getElementById('post-url').value;
    if(t && u) {
        articles.push({ t, p, u });
        await sync();
    }
}

async function deleteArticle(idx) {
    const check = prompt("Admin Key:");
    if (check !== ADMIN_PASS) return;
    articles.splice(idx, 1);
    await sync();
}

async function sync() {
    await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'X-Master-Key': MASTER_KEY },
        body: JSON.stringify(articles)
    });
    render();
}

window.addEventListener('keydown', (e) => {
    if (e.key === '1') {
        const panel = document.getElementById('admin-panel');
        panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    }
});

window.onload = () => { initParticles(); animate(); loadData(); updateLanguage(); };
window.onresize = initParticles;
