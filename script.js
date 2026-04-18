const BIN_ID = '69e2503736566621a8c3e82c';
const MASTER_KEY = '$2a$10$KckvLL9WKnatkXlZ699Xe.g5zJRFDZ5HYns2ndYDqL6uONzlp69cy';
const ADMIN_PASS = "physics123";

let articles = [];
let currentLang = 'en';

const translations = {
    en: { about: "About Me", logs: "My popular science articles", school: "Bilkent Erzurum Laboratory School (BELS)", status: "Student & Physics Researcher", follow: "FOLLOW +", desc: "I am a student who loves physics and is passionate about exploring the laws of the universe." },
    tr: { about: "Hakkımda", logs: "Popüler Bilim Makalelerim", school: "Bilkent Erzurum Laboratuvar Lisesi (BELS)", status: "Öğrenci & Fizik Araştırmacısı", follow: "TAKİP ET +", desc: "Fiziği seven ve evrenin yasalarını keşfetmeye tutkulu bir öğrenciyim." }
};

// --- ARKA PLAN ANİMASYONU ---
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particles = [];

function initParticles() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    particles = [];
    for(let i=0; i<70; i++) {
        particles.push({
            x: Math.random()*canvas.width, y: Math.random()*canvas.height,
            vx: (Math.random()-0.5)*1, vy: (Math.random()-0.5)*1, size: Math.random()*2
        });
    }
}

function animate() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim();
    particles.forEach(p => {
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI*2); ctx.fill();
        p.x += p.vx; p.y += p.vy;
        if(p.x<0 || p.x>canvas.width) p.vx*=-1; if(p.y<0 || p.y>canvas.height) p.vy*=-1;
    });
    requestAnimationFrame(animate);
}

// --- SİSTEM FONKSİYONLARI ---
function updateLanguage() {
    const t = translations[currentLang];
    document.getElementById('about-title').innerText = t.about;
    document.getElementById('logs-title').innerText = t.logs;
    document.getElementById('about-desc').innerText = t.desc;
    document.getElementById('edu-school').innerText = t.school;
    document.getElementById('edu-status').innerText = t.status;
    document.getElementById('follow-btn').innerText = t.follow;
    document.getElementById('lang-btn').innerText = currentLang === 'en' ? 'TR' : 'EN';
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
    const data = await res.json();
    articles = data.record || [];
    render();
}

function render() {
    const grid = document.getElementById('articles-grid');
    grid.innerHTML = "";
    articles.forEach((art, i) => {
        grid.insertAdjacentHTML('beforeend', `
            <div class="article-box">
                <h3>${art.t}</h3>
                <a href="${art.u}" target="_blank" style="color:var(--primary); font-weight:bold; text-decoration:none;">READ →</a>
                <button onclick="deleteArticle(${i})" style="display:block;margin-top:10px;color:red;background:none;border:none;cursor:pointer;font-size:0.7rem;">[DELETE]</button>
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
        await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
            method: 'PUT', headers: { 'Content-Type': 'application/json', 'X-Master-Key': MASTER_KEY },
            body: JSON.stringify(articles)
        });
        render();
    }
}

async function deleteArticle(idx) {
    if(prompt("Admin Key:") !== ADMIN_PASS) return;
    articles.splice(idx, 1);
    await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json', 'X-Master-Key': MASTER_KEY },
        body: JSON.stringify(articles)
    });
    render();
}

window.addEventListener('keydown', (e) => { if(e.key === '1') { const p = document.getElementById('admin-panel'); p.style.display = p.style.display==='none'?'block':'none'; } });
window.onload = () => { initParticles(); animate(); loadData(); updateLanguage(); };
