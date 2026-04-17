// --- DATABASE CONFIG ---
const BIN_ID = '69e2503736566621a8c3e82c';
const MASTER_KEY = '$2a$10$KckvLL9WKnatkXlZ699Xe.g5zJRFDZ5HYns2ndYDqL6uONzlp69cy';
const ADMIN_PASS = "physics123"; // PANELİ AÇINCA EKLEME YAPMAK İÇİN ŞİFREN

let articles = [];

// 1. Fetch Global Data
async function loadData() {
    try {
        const res = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
            headers: { 'X-Master-Key': MASTER_KEY }
        });
        const data = await res.json();
        articles = data.record || [];
        render();
    } catch (e) {
        document.getElementById('articles-grid').innerHTML = "Signal Lost. Database unreachable.";
    }
}

// 2. Render to Interface
function render() {
    const grid = document.getElementById('articles-grid');
    grid.innerHTML = articles.length === 0 ? "No archives found in this sector." : "";
    
    articles.forEach((art, index) => {
        grid.insertAdjacentHTML('beforeend', `
            <div class="article-box">
                <div class="box-header">// LOG_ID: ${art.p || 'Global'}</div>
                <h3>${art.t}</h3>
                <a href="${art.u}" target="_blank" style="color:var(--primary); text-decoration:none; font-weight:500;">ACCESS_LOG →</a>
                <button onclick="deleteArticle(${index})" class="delete-btn">ERASE_DATA</button>
            </div>
        `);
    });
}

// 3. Add Article (Cloud Sync)
async function addArticle() {
    const check = prompt("System Access Key:");
    if (check !== ADMIN_PASS) return alert("UNAUTHORIZED BIOLOGICAL ENTITY!");

    const t = document.getElementById('post-title').value;
    const p = document.getElementById('post-platform').value;
    const u = document.getElementById('post-url').value;

    if(!t || !u) return alert("Metadata incomplete!");

    articles.push({ t, p, u });
    await sync();
    
    document.getElementById('post-title').value = "";
    document.getElementById('post-platform').value = "";
    document.getElementById('post-url').value = "";
}

// 4. Delete Article
async function deleteArticle(index) {
    const check = prompt("Confirm Deletion Key:");
    if (check !== ADMIN_PASS) return alert("Deletion aborted.");
    
    articles.splice(index, 1);
    await sync();
}

// 5. Cloud Sync Engine
async function sync() {
    try {
        const res = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': MASTER_KEY
            },
            body: JSON.stringify(articles)
        });
        if(res.ok) {
            alert("BROADCAST SUCCESSFUL: Data synchronized across all nodes.");
            render();
        }
    } catch (e) { alert("Sync Interrupted."); }
}

// --- GİZLİ PANEL KONTROLÜ ---
// Klavyeden 'L' (Login) tuşuna bastığında admin paneli açılır/kapanır
window.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'l') {
        const panel = document.getElementById('admin-panel');
        const isHidden = window.getComputedStyle(panel).display === 'none';
        panel.style.display = isHidden ? 'block' : 'none';
        if(isHidden) window.scrollTo(0, document.body.scrollHeight);
    }
});

// --- VISUAL ENGINE ---
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let pts = [];
function init() {
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;
    pts = [];
    for(let i=0; i<40; i++) pts.push({
        x: Math.random()*canvas.width, 
        y: Math.random()*canvas.height, 
        v: Math.random()*0.4+0.1,
        f: ["E=mc²", "F=ma", "Ψ", "h", "c", "λ"][Math.floor(Math.random()*6)]
    });
}
function animate() {
    ctx.clearRect(0,0,canvas.width, canvas.height);
    ctx.fillStyle = "rgba(0, 210, 255, 0.2)";
    ctx.font = "10px monospace";
    pts.forEach(p => {
        ctx.fillText(p.f, p.x, p.y);
        p.y -= p.v;
        if(p.y < 0) p.y = canvas.height;
    });
    requestAnimationFrame(animate);
}

window.onload = () => { init(); animate(); loadData(); };
window.onresize = init;
document.getElementById('theme-btn').onclick = () => {
    const cur = document.documentElement.getAttribute('data-theme');
    document.documentElement.setAttribute('data-theme', cur === 'dark' ? 'light' : 'dark');
};
