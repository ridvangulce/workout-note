const I18N = {
    currentLang: localStorage.getItem('workout_lang') || 'en',

    init: function () {
        this.updateUI();
        this.renderLanguageSwitcher();
    },

    setLanguage: function (lang) {
        this.currentLang = lang;
        localStorage.setItem('workout_lang', lang);
        this.updateUI();
        this.updateSwitcherState();

        // Trigger specific re-renders if on dashboard
        if (typeof updateDashboardUI === 'function') {
            updateDashboardUI();
        }

        // Custom events for components like body-map
        window.dispatchEvent(new CustomEvent('langChanged', { detail: lang }));
    },

    t: function (key) {
        return TRANSLATIONS[this.currentLang][key] || key;
    },

    updateUI: function () {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = this.t(key);
            } else {
                el.innerHTML = this.t(key);
            }
        });

        // Update document title if specific key exists
        const pageTitle = document.querySelector('title');
        if (pageTitle && pageTitle.dataset.i18n) {
            pageTitle.innerText = this.t(pageTitle.dataset.i18n);
        }
    },

    renderLanguageSwitcher: function (force = false) {
        const navLinks = document.querySelector('.nav-links') || document.querySelector('.navbar');
        if (!navLinks) return;

        // Check if switcher already exists
        const existing = document.getElementById('langSwitcher');
        if (existing) {
            if (!force) {
                this.updateSwitcherState();
                return;
            }
            existing.remove(); // Remove and re-append if forced
        }

        const switcher = document.createElement('div');
        switcher.id = 'langSwitcher';
        switcher.className = 'lang-switcher';
        switcher.innerHTML = `
            <button onclick="I18N.setLanguage('en')" class="lang-btn ${this.currentLang === 'en' ? 'active' : ''}" id="btn-en">EN</button>
            <span class="lang-divider">|</span>
            <button onclick="I18N.setLanguage('tr')" class="lang-btn ${this.currentLang === 'tr' ? 'active' : ''}" id="btn-tr">TR</button>
        `;

        navLinks.appendChild(switcher);
    },

    updateSwitcherState: function () {
        const btnEn = document.getElementById('btn-en');
        const btnTr = document.getElementById('btn-tr');
        if (btnEn && btnTr) {
            btnEn.classList.toggle('active', this.currentLang === 'en');
            btnTr.classList.toggle('active', this.currentLang === 'tr');
        }
    }
};

window.I18N = I18N;

// Start i18n when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // translations.js must be loaded before this
    if (typeof TRANSLATIONS !== 'undefined') {
        I18N.init();
    }
});
