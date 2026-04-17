// --- CONFIGURATION ---
const BIN_ID = '69e2503736566621a8c3e82c';
const MASTER_KEY = '$2a$10$KckvLL9WKnatkXlZ699Xe.g5zJRFDZ5HYns2ndYDqL6uONzlp69cy';
const ADMIN_PASSWORD = "fizik"; // İstediğin şifreyi buraya yaz (Arkadaşın bilmesin!)

let articles = [];

// 1. DATA ÇEKME (Her cihazda çalışması için)
async function loadData() {
    const grid = document.getElementById('articles-grid');
    try {
        const response = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
            headers: { 'X-Master-Key': MASTER_KEY }
        });
        const data = await response.json();
        
        // JSONBin bazen veriyi 'record' içinde bazen direkt gönderir
        articles = data.record ? data.record : data;
        render();
    } catch (e) {
        grid.innerHTML = `<div style="color:red">Connection Error: Data stream lost.</div>`;
    }
}

// 2. EKRANA BASMA
function render() {
    const grid = document.getElementById('articles-grid');
    grid.innerHTML = "";
    
    articles.forEach((art, index) => {
        grid.insertAdjacentHTML('beforeend', `
            <div class="article-box">
                <div class="box-header">// DATA_SOURCE: ${art.p || 'Science'}</div>
                <h3>${art.t}</h3>
                <a href="${art.u}" target="_blank" style="color:var(--primary); text-decoration:none; font-size:0.9rem">READ_LOG →</a>
                <button onclick="deleteArticle(${index})" class="delete-btn">ERASE DATA</button>
            </div>
        `);
    });
}

// 3. YAZI EKLEME (Şifreli ve Garantili)
async function addArticle() {
    const userPass = prompt("Enter Authorization Code to Push Data:");
    if (userPass !== ADMIN_PASSWORD) {
        alert("ACCESS DENIED: Unauthorized biological entity detected.");
        return;
    }

    const t = document.getElementById('post-title').value;
    const p = document.getElementById('post-platform').value;
    const u = document.getElementById('post-url').value;

    if(!t || !u) return alert("Title and URL are mandatory!");

    // Yeni veriyi listeye ekle
    const newEntry = { t, p, u };
    articles.push(newEntry);
    
    // Buluta gönder
    await syncToCloud();
    
    // Formu temizle
    document.getElementById('post-title').value = "";
    document.getElementById('post-platform').value = "";
    document.getElementById('post-url').value = "";
}

// 4. YAZI SİLME (Şifreli)
async function deleteArticle(index) {
    const userPass = prompt("Enter Authorization Code to Delete Data:");
    if (userPass !== ADMIN_PASSWORD) return alert("Delete operation aborted.");
    
    articles.splice(index, 1);
    await syncToCloud();
}

// 5. BULUTLA EŞİTLEME (PÜF NOKTASI BURASI)
async function syncToCloud() {
    try {
        const response = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': MASTER_KEY
            },
            body: JSON.stringify(articles)
        });

        if(response.ok) {
            alert("DATABASE UPDATED: Signal broadcasted to all devices!");
            render();
        } else {
            alert("SYNC FAILED: Check Master Key or JSONBin status.");
        }
    } catch (e) {
        alert("CRITICAL: Network interference. Try again.");
    }
}

// --- VISUALS ---
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let pts = [];
function init() {
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;
    pts = [];
    for(let i=0; i<30; i++) pts.push({x:Math.random()*canvas.width, y:Math.random()*canvas.height, v:Math.random()*0.5+0.1});
}
function animate() {
    ctx.clearRect(0,0,canvas.width, canvas.height);
    ctx.fillStyle = "rgba(0, 210, 255, 0.2)";
    pts.forEach(p => { ctx.fillText("E=mc²", p.x, p.y); p.y -= p.v; if(p.y < 0) p.y = canvas.height; });
    requestAnimationFrame(animate);
}
window.onload = () => { init(); animate(); loadData(); };
window.onresize = init;

// THEME
document.getElementById('theme-btn').onclick = () => {
    const cur = document.documentElement.getAttribute('data-theme');
    document.documentElement.setAttribute('data-theme', cur === 'dark' ? 'light' : 'dark');
};
