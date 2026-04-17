const BIN_ID = '69e2503736566621a8c3e82c';
const MASTER_KEY = '$2a$10$KckvLL9WKnatkXlZ699Xe.g5zJRFDZ5HYns2ndYDqL6uONzlp69cy';
const API_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

let articles = [];

// 1. Fetch Articles
async function loadData() {
    try {
        const response = await fetch(`${API_URL}/latest`, {
            headers: { 'X-Master-Key': MASTER_KEY }
        });
        const data = await response.json();
        articles = data.record || [];
        render();
    } catch (e) { console.error("Data Stream Interrupted"); }
}

// 2. Render to Screen
function render() {
    const grid = document.getElementById('articles-grid');
    grid.innerHTML = articles.length === 0 ? "No records found." : "";
    
    articles.forEach((art, index) => {
        grid.insertAdjacentHTML('beforeend', `
            <div class="article-box">
                <div class="box-header">// SOURCE: ${art.p}</div>
                <h3>${art.t}</h3>
                <a href="${art.u}" target="_blank" style="color:var(--primary); font-size:0.9rem; text-decoration:none">Read Article →</a>
                <button onclick="deleteArticle(${index})" class="delete-btn">REMOVE DATA</button>
            </div>
        `);
    });
}

// 3. Add Article
async function addArticle() {
    const t = document.getElementById('post-title').value;
    const p = document.getElementById('post-platform').value;
    const u = document.getElementById('post-url').value;

    if(!t || !u) return alert("System requires Title and URL.");

    articles.push({ t, p, u });
    await sync();
    document.querySelectorAll('.admin-form input').forEach(i => i.value = "");
}

// 4. Delete Article
async function deleteArticle(index) {
    if(!confirm("Confirm permanent data deletion?")) return;
    articles.splice(index, 1);
    await sync();
}

// 5. Sync to JSONBin
async function sync() {
    try {
        await fetch(API_URL, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': MASTER_KEY
            },
            body: JSON.stringify(articles)
        });
        render();
    } catch (e) { alert("Sync Failed!"); }
}

// --- Visual Background ---
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let pts = [];
const formulas = ["E=mc²", "Ψ", "ΔxΔp≥h/4π", "F=ma", "c=λf"];

function initCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    pts = [];
    for(let i=0; i<40; i++) pts.push({
        x: Math.random()*canvas.width, y: Math.random()*canvas.height,
        v: Math.random()*0.5+0.1, f: formulas[Math.floor(Math.random()*formulas.length)]
    });
}

function animate() {
    ctx.clearRect(0,0,canvas.width, canvas.height);
    ctx.fillStyle = "rgba(0, 210, 255, 0.2)";
    ctx.font = "12px monospace";
    pts.forEach(p => {
        ctx.fillText(p.f, p.x, p.y);
        p.y -= p.v;
        if(p.y < -20) p.y = canvas.height + 20;
    });
    requestAnimationFrame(animate);
}

const dot = document.getElementById('cursor-dot');
window.addEventListener('mousemove', (e) => {
    dot.style.left = e.clientX + 'px';
    dot.style.top = e.clientY + 'px';
});

window.onload = () => { initCanvas(); animate(); loadData(); };
window.onresize = initCanvas;
document.getElementById('theme-btn').onclick = () => {
    const cur = document.documentElement.getAttribute('data-theme');
    document.documentElement.setAttribute('data-theme', cur === 'dark' ? 'light' : 'dark');
};