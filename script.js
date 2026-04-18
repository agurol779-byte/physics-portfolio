const BIN_ID = '69e2503736566621a8c3e82c';
const MASTER_KEY = '$2a$10$KckvLL9WKnatkXlZ699Xe.g5zJRFDZ5HYns2ndYDqL6uONzlp69cy';
const ADMIN_PASS = "2903";

let articles = [];
let currentLang = 'en';
let currentQuoteIndex = 0; // Hangi sözde olduğumuzu takip etmek için sabit

// GERÇEK FİZİKÇİ SÖZLERİ
const physicsQuotes = {
    en: [
        { q: "Imagination is more important than knowledge.", a: "Albert Einstein" },
        { q: "Nothing happens until something moves.", a: "Albert Einstein" },
        { q: "Equations are just the shorthand of magic.", a: "Richard Feynman" },
        { q: "Look up at the stars and not down at your feet.", a: "Stephen Hawking" },
        { q: "The first principle is that you must not fool yourself.", a: "Richard Feynman" }
    ],
    tr: [
        { q: "Hayal gücü bilgiden daha önemlidir.", a: "Albert Einstein" },
        { q: "Bir şey hareket edene kadar hiçbir şey olmaz.", a: "Albert Einstein" },
        { q: "Denklemler, büyünün el yazısıdır.", a: "Richard Feynman" },
        { q: "Ayaklarınıza değil, yıldızlara bakın.", a: "Stephen Hawking" },
        { q: "İlk kural, kendinizi kandırmamanızdır.", a: "Richard Feynman" }
    ]
};

// SÖZÜ EKRANA BASAN ANA FONKSİYON
function displayQuote() {
    const quoteEl = document.getElementById('daily-quote');
    const authorEl = document.getElementById('quote-author');
    
    // O anki dilden ve o anki index'ten sözü çek
    const activeQuote = physicsQuotes[currentLang][currentQuoteIndex];
    
    if (quoteEl && authorEl) {
        quoteEl.innerText = `"${activeQuote.q}"`;
        authorEl.innerText = `— ${activeQuote.a}`;
    }
}

// RASTGELE SÖZ SEÇME
function pickNewQuote() {
    currentQuoteIndex = Math.floor(Math.random() * physicsQuotes.en.length);
    displayQuote();
}

// --- DİL VE ÇEVİRİ ---
const translations = {
    en: { about: "About Me", logs: "My popular science articles", school: "Bilkent Erzurum Laboratory School (BELS)", status: "Student & Physics Researcher", follow: "FOLLOW +", desc: "I am a student who loves physics and is passionate about exploring the laws of the universe." },
    tr: { about: "Hakkımda", logs: "Popüler Bilim Makalelerim", school: "Bilkent Erzurum Laboratuvar Lisesi (BELS)", status: "Öğrenci & Fizik Araştırmacısı", follow: "TAKİP ET +", desc: "Fiziği seven ve evrenin yasalarını keşfetmeye tutkulu bir öğrenciyim." }
};

function updateLanguage() {
    const t = translations[currentLang];
    document.getElementById('about-title').innerText = t.about;
    document.getElementById('logs-title').innerText = t.logs;
    document.getElementById('about-desc').innerText = t.desc;
    document.getElementById('edu-school').innerText = t.school;
    document.getElementById('edu-status').innerText = t.status;
    document.getElementById('follow-btn').innerText = t.follow;
    document.getElementById('lang-btn').innerText = currentLang === 'en' ? 'TR' : 'EN';
    
    // CRITICAL: DİL DEĞİŞİNCE SÖZÜ TEKRAR BAS
    displayQuote();
}

document.getElementById('lang-btn').onclick = () => {
    currentLang = (currentLang === 'en') ? 'tr' : 'en';
    updateLanguage();
};

// --- DİĞER FONKSİYONLAR (TEMA, VERİ, RENDER) ---
document.getElementById('theme-btn').onclick = () => {
    const html = document.documentElement;
    const isDark = html.getAttribute('data-theme') === 'dark';
    html.setAttribute('data-theme', isDark ? 'light' : 'dark');
    document.getElementById('theme-btn').innerText = isDark ? "Light Mode" : "Dark Mode";
};

async function loadData() {
    try {
        const res = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, { headers: { 'X-Master-Key': MASTER_KEY } });
        const data = await res.json();
        articles = data.record || [];
        render();
    } catch(e) { console.error("Load Error"); }
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
        await sync();
    }
}

async function deleteArticle(idx) {
    if(prompt("Admin Key:") !== ADMIN_PASS) return;
    articles.splice(idx, 1);
    await sync();
}

async function sync() {
    await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json', 'X-Master-Key': MASTER_KEY },
        body: JSON.stringify(articles)
    });
    render();
}

window.addEventListener('keydown', (e) => { if(e.key === '1') { const p = document.getElementById('admin-panel'); p.style.display = p.style.display==='none'?'block':'none'; } });

// BAŞLATMA
window.onload = () => {
    loadData();
    pickNewQuote(); // Önce rastgele bir söz seç ve bas
    updateLanguage(); // Sonra dili (ve sözün dilini) ayarla
    setInterval(pickNewQuote, 20 * 60 * 1000); // 20 dakikada bir yeni söz
};
