// DATABASE SETUP
const BIN_ID = '69e2503736566621a8c3e82c';
const MASTER_KEY = '$2a$10$KckvLL9WKnatkXlZ699Xe.g5zJRFDZ5HYns2ndYDqL6uONzlp69cy';
const ADMIN_PASS = "2903"; 

let articles = [];

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
                <div class="box-header">// SOURCE: ${art.p || 'Science'}</div>
                <h3>${art.t}</h3>
                <a href="${art.u}" target="_blank" style="color:var(--primary); text-decoration:none; font-weight:bold;">READ_LOG →</a>
                <button onclick="deleteArticle(${index})" class="delete-btn">ERASE</button>
            </div>
        `);
    });
}

async function addArticle() {
    const check = prompt("Auth Required:");
    if (check !== ADMIN_PASS) return alert("Denied!");
    const t = document.getElementById('post-title').value;
    const p = document.getElementById('post-platform').value;
    const u = document.getElementById('post-url').value;
    if(!t || !u) return alert("Fill all!");
    articles.push({ t, p, u });
    await sync();
}

async function deleteArticle(index) {
    const check = prompt("Auth Required:");
    if (check !== ADMIN_PASS) return;
    articles.splice(index, 1);
    await sync();
}

async function sync() {
    const res = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'X-Master-Key': MASTER_KEY },
        body: JSON.stringify(articles)
    });
    if(res.ok) { alert("Sync OK!"); render(); }
}

// TOGGLE ADMIN PANEL WITH '1'
window.addEventListener('keydown', (e) => {
    if (e.key === '1') {
        const panel = document.getElementById('admin-panel');
        const isHidden = window.getComputedStyle(panel).display === 'none';
        panel.style.display = isHidden ? 'block' : 'none';
        if(isHidden) panel.scrollIntoView({ behavior: 'smooth' });
    }
});

// BACKGROUND PARTICLES
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let pts = [];
function init() {
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;
    pts = [];
    for(let i=0; i<30; i++) pts.push({x: Math.random()*canvas.width, y: Math.random()*canvas.height, v: Math.random()*0.5+0.1, s: ["E=mc²", "Ψ", "h", "c"][Math.floor(Math.random()*4)]});
}
function animate() {
    ctx.clearRect(0,0,canvas.width, canvas.height);
    ctx.fillStyle = "rgba(0, 210, 255, 0.1)";
    pts.forEach(p => { ctx.fillText(p.s, p.x, p.y); p.y -= p.v; if(p.y < 0) p.y = canvas.height; });
    requestAnimationFrame(animate);
}
window.onload = () => { init(); animate(); loadData(); };
