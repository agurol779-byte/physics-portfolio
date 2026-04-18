const BIN_ID = '69e2503736566621a8c3e82c';
const MASTER_KEY = '$2a$10$KckvLL9WKnatkXlZ699Xe.g5zJRFDZ5HYns2ndYDqL6uONzlp69cy';
const ADMIN_PASS = "physics123";

let articles = [];
let currentLang = 'en';

const translations = {
    en: { about: "About Me", logs: "Articles", school: "Bilkent Erzurum Laboratory School (BELS)", status: "Student & Researcher", follow: "FOLLOW +", desc: "Physics enthusiast exploring the universe." },
    tr: { about: "Hakkımda", logs: "Makalelerim", school: "Bilkent Erzurum Laboratuvar Lisesi (BELS)", status: "Öğrenci & Araştırmacı", follow: "TAKİP ET +", desc: "Evreni keşfetmeye tutkulu bir fizik meraklısı." }
};

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
}

document.getElementById('theme-btn').onclick = () => {
    const html = document.documentElement;
    const isDark = html.getAttribute('data-theme') === 'dark';
    html.setAttribute('data-theme', isDark ? 'light' : 'dark');
    document.getElementById('theme-btn').innerText = isDark ? "Dark Mode" : "Light Mode";
};

document.getElementById('lang-btn').onclick = () => { currentLang = currentLang === 'en' ? 'tr' : 'en'; updateLanguage(); };

// --- VERİ ---
async function loadData() {
    try {
        const res = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, { headers: { 'X-Master-Key': MASTER_KEY } });
        const data = await res.json();
        articles = Array.isArray(data.record) ? data.record : [];
        render();
    } catch (e) { console.error("Load failed"); }
}

function render() {
    const grid = document.getElementById('articles-grid');
    grid.innerHTML = "";
    articles.forEach((art, i) => {
        grid.insertAdjacentHTML('beforeend', `
            <div class="article-box">
                <h3>${art.t}</h3>
                <a href="${art.u}" target="_blank" style="color:var(--primary); text-decoration:none; font-weight:bold;">READ →</a>
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
    if(prompt("Admin Key:") !== ADMIN_PASS) return;
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

window.addEventListener('keydown', (e) => { if(e.key === '1') { const p = document.getElementById('admin-panel'); p.style.display = p.style.display==='none'?'block':'none'; } });
window.onload = () => { loadData(); updateLanguage(); };
