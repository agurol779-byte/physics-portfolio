/**
 * Ali Kemal Gurol - Science Portal Control Engine
 * Global Database Sync & Admin Management
 */

// --- CONFIGURATION ---
const BIN_ID = '69e2503736566621a8c3e82c';
const MASTER_KEY = '$2a$10$KckvLL9WKnatkXlZ699Xe.g5zJRFDZ5HYns2ndYDqL6uONzlp69cy';
const ADMIN_PASS = "2903"; // Verification code for cloud updates

let articles = [];

// 1. DATA LOADER: Fetches articles from JSONBin cloud
async function loadData() {
    const grid = document.getElementById('articles-grid');
    try {
        const response = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
            headers: { 'X-Master-Key': MASTER_KEY }
        });
        const data = await response.json();
        
        // Ensure data is mapped correctly from JSONBin structure
        articles = data.record || [];
        render();
    } catch (e) {
        grid.innerHTML = `<div style="color:#ef4444; font-family:monospace;">// ERROR: Data stream interrupted. Check connection.</div>`;
    }
}

// 2. RENDER ENGINE: Builds the neon cards on the screen
function render() {
    const grid = document.getElementById('articles-grid');
    grid.innerHTML = articles.length === 0 ? "// NO_ARCHIVES_FOUND_IN_SECTOR" : "";
    
    articles.forEach((art, index) => {
        grid.insertAdjacentHTML('beforeend', `
            <div class="article-box">
                <div class="box-header">// LOG_TYPE: ${art.p || 'Science_Log'}</div>
                <h3>${art.t}</h3>
                <a href="${art.u}" target="_blank" style="color:var(--primary); text-decoration:none; font-weight:700;">ACCESS_LOG →</a>
                <button onclick="deleteArticle(${index})" class="delete-btn">ERASE_DATA</button>
            </div>
        `);
    });
}

// 3. ADD ARTICLE: Validates password and pushes to cloud
async function addArticle() {
    const userAuth = prompt("SYSTEM_AUTHORIZATION_REQUIRED:");
    if (userAuth !== ADMIN_PASS) {
        alert("ACCESS_DENIED: Unauthorized entity.");
        return;
    }

    const t = document.getElementById('post-title').value;
    const p = document.getElementById('post-platform').value;
    const u = document.getElementById('post-url').value;

    if(!t || !u) return alert("CRITICAL: Missing Metadata (Title/URL)");

    articles.push({ t, p, u });
    await syncToCloud();
    
    // Clear inputs
    document.getElementById('post-title').value = "";
    document.getElementById('post-platform').value = "";
    document.getElementById('post-url').value = "";
}

// 4. DELETE ARTICLE: Removes from local and cloud
async function deleteArticle(index) {
    const userAuth = prompt("CONFIRM_DATA_ERASURE:");
    if (userAuth !== ADMIN_PASS) return;
    
    articles.splice(index, 1);
    await syncToCloud();
}

// 5. CLOUD SYNC: Updates the master database (Crucial for global view)
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
            alert("BROADCAST_SUCCESS: Data synchronized globally.");
            render();
        } else {
            alert("SYNC_FAILED: Database rejected the signal.");
        }
    } catch (e) {
        alert("NETWORK_ERROR: Could not reach the cloud nodes.");
    }
}

// --- HIDDEN ADMIN ACCESS ---
// Press '1' on the keyboard to toggle the command center
window.addEventListener('keydown', (e) => {
    if (e.key === '1') {
        const panel = document.getElementById('admin-panel');
        // Toggle logic
        const isHidden = window.getComputedStyle(panel).display === 'none';
        panel.style.display = isHidden ? 'block' : 'none';
        
        if (isHidden) {
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
            console.log("Admin Console Online.");
        }
    }
});

// --- VISUAL FX: Particle Background ---
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let pts = [];

function init() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    pts = [];
    for(let i=0; i<40; i++) {
        pts.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            v: Math.random() * 0.4 + 0.1,
            symbol: ["E=mc²", "Ψ", "ΔxΔp", "c", "h", "λ"][Math.floor(Math.random()*6)]
        });
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(0, 210, 255, 0.15)";
    ctx.font = "11px monospace";
    pts.forEach(p => {
        ctx.fillText(p.symbol, p.x, p.y);
        p.y -= p.v;
        if(p.y < -10) p.y = canvas.height + 10;
    });
    requestAnimationFrame(animate);
}

// Initial Boot
window.onload = () => { init(); animate(); loadData(); };
window.onresize = init;

// Theme Switcher
document.getElementById('theme-btn').onclick = () => {
    const cur = document.documentElement.getAttribute('data-theme');
    document.documentElement.setAttribute('data-theme', cur === 'dark' ? 'light' : 'dark');
};
