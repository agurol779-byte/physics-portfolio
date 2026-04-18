const BIN_ID = '69e2503736566621a8c3e82c';
const MASTER_KEY = '$2a$10$KckvLL9WKnatkXlZ699Xe.g5zJRFDZ5HYns2ndYDqL6uONzlp69cy';
const ADMIN_PASS = "physics123";

let articles = [];
let currentLang = 'en';

// --- ARKA PLAN (FORMÜL SİSTEMİ) ---
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let formulas = [];

function initParticles() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    formulas = [];
    // Fizik Formülleri Listesi
    const list = ["E=mc²", "F=ma", "Ψ", "∇×B=μ₀J", "ΔxΔp≥ħ/2", "PV=nRT", "S=klnW", "Gμν=8πGTμν", "c²", "λ=h/p", "ħ", "∮B·dA=0"];
    
    // 100 tane formül oluştur (Sayıyı artırdım)
    for(let i=0; i<100; i++) {
        formulas.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            text: list[Math.floor(Math.random()*list.length)],
            vx: (Math.random() - 0.5) * 0.8,
            vy: (Math.random() - 0.5) * 0.8,
            fontSize: Math.floor(Math.random() * 12 + 16)
        });
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim();
    ctx.fillStyle = primaryColor;
    ctx.globalAlpha = 0.5;

    formulas.forEach(f => {
        ctx.font = `bold ${f.fontSize}px 'JetBrains Mono'`;
        ctx.fillText(f.text, f.x, f.y);
        f.x += f.vx; f.y += f.vy;
        
        if (f.x < -50) f.x = canvas.width + 50;
        if (f.x > canvas.width + 50) f.x = -50;
        if (f.y < -50) f.y = canvas.height + 50;
        if (f.y > canvas.height + 50) f.y = -50;
    });
    requestAnimationFrame(animate);
}

// --- VERİ VE SİSTEM ---
async function loadData() {
    const res = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, { headers: { 'X-Master-Key': MASTER_KEY } });
    const data = await res.json();
    articles = Array.isArray(data.record) ? data.record : [];
    render();
}

function render() {
    const grid = document.getElementById('articles-grid');
    grid.innerHTML = "";
    articles.forEach((art, i) => {
        grid.insertAdjacentHTML('beforeend', `
            <div class="article-box">
                <h3>${art.t}</h3>
                <a href="${art.u}" target="_blank" style="color:var(--primary); font-weight:bold;">READ ARTICLE →</a>
                <button onclick="deleteArticle(${i})" class="delete-btn">ERASE</button>
            </div>
        `);
    });
}

async function addArticle() {
    if(prompt("Admin Key:") !== ADMIN_PASS) return;
    const t = document.getElementById('post-title').value;
    const u = document.getElementById('post-url').value;
    if(t && u) {
        articles.push({ t, u });
        await sync();
        document.getElementById('post-title').value = "";
        document.getElementById('post-url').value = "";
    }
}

async function deleteArticle(index) {
    if(prompt("Pass to Delete:") !== ADMIN_PASS) return;
    articles.splice(index, 1);
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

// Klavye Kısayolu
window.addEventListener('keydown', (e) => {
    if(e.key === '1') {
        const p = document.getElementById('admin-panel');
        p.style.display = p.style.display === 'none' ? 'block' : 'none';
    }
});

document.getElementById('theme-btn').onclick = () => {
    const html = document.documentElement;
    const isDark = html.getAttribute('data-theme') === 'dark';
    html.setAttribute('data-theme', isDark ? 'light' : 'dark');
    document.getElementById('theme-btn').innerText = isDark ? "Dark Mode" : "Light Mode";
};

window.onload = () => { initParticles(); animate(); loadData(); };
window.onresize = initParticles;
