// --- CONFIG & STATE ---
const BIN_ID = '69e2503736566621a8c3e82c';
const MASTER_KEY = '$2a$10$KckvLL9WKnatkXlZ699Xe.g5zJRFDZ5HYns2ndYDqL6uONzlp69cy';
const ADMIN_PASS = "physics123";

let currentLang = 'en';
const translations = {
    en: { about: "About Me", logs: "Latest Scientific Logs", desc: "I am a student who loves physics...", theme: "Light Mode" },
    tr: { about: "Hakkımda", logs: "Son Bilimsel Kayıtlar", desc: "Fiziği seven ve evrenin yasalarını keşfetmeye tutkulu bir öğrenciyim...", theme: "Gündüz Modu" }
};

// --- THEME TOGGLE ---
document.getElementById('theme-btn').onclick = function() {
    const html = document.documentElement;
    const isDark = html.getAttribute('data-theme') === 'dark';
    const newTheme = isDark ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
    this.innerText = isDark ? "Dark Mode" : "Light Mode";
};

// --- LANG TOGGLE ---
document.getElementById('lang-btn').onclick = function() {
    currentLang = currentLang === 'en' ? 'tr' : 'en';
    this.innerText = currentLang === 'en' ? 'TR' : 'EN';
    document.getElementById('about-title').innerText = translations[currentLang].about;
    document.getElementById('logs-title').innerText = translations[currentLang].logs;
    document.getElementById('about-desc').innerText = translations[currentLang].desc;
};

// --- GİZLİ PANEL (1 TUŞU) ---
window.addEventListener('keydown', (e) => {
    if (e.key === '1') {
        const panel = document.getElementById('admin-panel');
        panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
        if(panel.style.display === 'block') panel.scrollIntoView({ behavior: 'smooth' });
    }
});

// --- REST OF THE CODE (loadData, render, sync, particles) ---
// (Önceki mesajdaki loadData ve sync fonksiyonlarını buraya ekle kral, onlar değişmedi)
