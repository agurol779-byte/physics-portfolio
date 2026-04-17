// --- CONFIGURATION ---
const BIN_ID = '69e2503736566621a8c3e82c';
const MASTER_KEY = '$2a$10$KckvLL9WKnatkXlZ699Xe.g5zJRFDZ5HYns2ndYDqL6uONzlp69cy';
const ADMIN_PASS = "physics123"; // Verification key for updates

let articles = [];
let currentLang = 'en';
const translations = {
    en: { about: "About Me", logs: "Latest Scientific Logs", desc: "I am a student who loves physics and is passionate about exploring the laws of the universe. I believe that science is the most powerful tool we have to understand the world around us.", theme: "Light Mode", sync: "Sync OK!", deny: "Denied!", metalost: "Metadata incomplete!", broadcast: "BROADCAST SUCCESS: Database updated." },
    tr: { about: "Hakkımda", logs: "Son Bilimsel Kayıtlar", desc: "Fiziği seven ve evrenin yasalarını keşfetmeye tutkulu bir öğrenciyim. Bilimin, etrafımızdaki dünyayı anlamak için sahip olduğumuz en güçlü araç olduğuna inanıyorum.", theme: "Gündüz Modu", sync: "Senkronize Edildi!", deny: "Erişim Reddedildi!", metalost: "Eksik Bilgi Girdiniz!", broadcast: "YAYIN BAŞARILI: Veritabanı güncellendi." }
};

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
        document.getElementById('articles-grid').innerHTML = "<div style='color:#ef4444;'>ERROR: Connection failed.</div>";
    }
}

// 2. Render to Interface
function render() {
    const grid = document.getElementById('articles-grid');
    grid.innerHTML = articles.length === 0 ? "// NO ARCHIVES FOUND IN SECTOR" : "";
    
    articles.forEach((art, index) => {
        grid.insertAdjacentHTML('beforeend', `
            <div class="article-box">
                <div class="box-header">// LOG_SOURCE: ${art.p || 'Science_Log'}</div>
                <h3>${art.t}</h3>
                <a href="${art.u}" target="_blank" style="color:var(--primary); text-decoration:none; font-weight:700;">ACCESS_LOG →</a>
                <button onclick="deleteArticle(${index})" class="delete-btn">ERASE</button>
            </div>
        `);
    });
}

// 3. Add Article (with password)
async function addArticle() {
    const check = prompt("System Access Key:");
    if (check !== ADMIN_PASS) return alert(translations[currentLang].deny);

    const t = document.getElementById('post-title').value;
    const p = document.getElementById('post-platform').value;
    const u = document.getElementById('post-url').value;

    if(!t || !u) return alert(translations[currentLang].metalost);

    articles.push({ t, p, u });
    await sync();
    
    document.getElementById('post-title').value = "";
    document.getElementById('post-platform').value = "";
    document.getElementById('post-url').value = "";
}

// 4. Delete Article
async function deleteArticle(index) {
    const check = prompt("Confirm Deletion Key:");
    if (check !== ADMIN_PASS) return alert(translations[currentLang].deny);
    
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
            alert(translations[currentLang].broadcast);
            render();
        }
    } catch (e) { alert("Sync Interrupted."); }
}

// --- HIDDEN ADMIN PANEL (Toggle with '1') ---
window.addEventListener('keydown', (e) => {
    if (e.key === '1') {
        const panel = document.getElementById('admin-panel');
        const isHidden = window.getComputedStyle(panel).display === 'none';
        panel.style.display = isHidden ? 'block' : 'none';
        if(isHidden) panel.scrollIntoView({ behavior: 'smooth' });
    }
});

// --- THEME & LANG TOGGLES ---
document.getElementById('theme-btn').onclick = function() {
    const html = document.documentElement;
    const isDark = html.getAttribute('data-theme') === 'dark';
    const newTheme = isDark ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
    this.innerText = translations[currentLang][isDark ? 'theme' : 'theme'];
    
    // Tema değişince yüzen formüllerin rengini de güncelle
    updateFormulaColors();
};

document.getElementById('lang-btn').onclick = function() {
    currentLang = currentLang === 'en' ? 'tr' : 'en';
    this.innerText = currentLang === 'en' ? 'TR' : 'EN';
    
    // Tema butonunun yazısını da güncelle
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    document.getElementById('theme-btn').innerText = translations[currentLang][isDark ? 'theme' : 'theme'];
    
    document.getElementById('about-title').innerText = translations[currentLang].about;
    document.getElementById('logs-title').innerText = translations[currentLang].logs;
    document.getElementById('about-desc').innerText = translations[currentLang].desc;
};


// --- ARKA PLAN FİZİK FORMÜLLERİ MOTORU ---
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let pts = [];
let formulaColor = '';

// Koyu/Açık temaya göre formül rengini al
function updateFormulaColors() {
    formulaColor = getComputedStyle(document.documentElement).getPropertyValue('--formula-color').trim();
}

// Pencere boyutu değişirse canvas'ı yeniden ayarla
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init(); // Partikülleri yeniden oluştur
}

function init() {
    updateFormulaColors();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pts = [];
    
    // Daha az ama daha kaliteli formül (Performans için 25-30 adet yeterli)
    const formulaCount = 30; 
    
    for(let i=0; i<formulaCount; i++) {
        pts.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            v: Math.random() * 0.3 + 0.1, // Hız
            // Fizik formülleri listesi (Unicode sembolleriyle)
            formula: [
                "E=mc²", "F=ma", "Ψ", "ΔxΔp≥ħ/2", "c=λf", "PV=nRT", "G=6.67x10⁻¹¹",
                "h=6.626x10⁻³⁴", "∇·E=ρ/ε₀", "∇×B=μ₀J", "E=hf", "F=GmM/r²",
                "μ₀", "ε₀", "ħ", "σT⁴", "Rᵤᵥ-1/2Rgᵤᵥ=8πGTᵤᵥ/c⁴"
            ][Math.floor(Math.random()*17)],
            size: Math.random() * 4 + 11 // Font boyutu 11-15px arası
        });
    }
}

function animate() {
    // Canvas'ı her karede temizleme, yerine hafif bir iz bırakma (daha iyi etki için)
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim();
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Formüllerin rengini ve stilini ayarla
    ctx.fillStyle = formulaColor;
    ctx.font = "monospace";
    ctx.textAlign = "center";
    
    pts.forEach(p => {
        // Font boyutunu ayarla
        ctx.font = `${p.size}px monospace`;
        // Formülü çiz
        ctx.fillText(p.formula, p.x, p.y);
        
        // Formülü yavaşça yukarı doğru hareket ettir
        p.y -= p.v;
        
        // Eğer formül ekranın üstünden çıkarsa, en alttan yeniden başlat
        if(p.y < -10) {
            p.y = canvas.height + 10;
            p.x = Math.random() * canvas.width; // Rastgele yatay pozisyon
        }
    });
    
    requestAnimationFrame(animate);
}

// Event Listeners
window.onload = () => {
    resizeCanvas();
    animate();
    loadData();
};
window.onresize = resizeCanvas;
