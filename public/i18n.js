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

    renderLanguageSwitcher: function () {
        const navLinks = document.querySelector('.nav-links') || document.querySelector('.navbar');
        if (!navLinks) return;

        // Check if switcher already exists
        if (document.getElementById('langSwitcher')) return;

        const switcher = document.createElement('div');
        switcher.id = 'langSwitcher';
        switcher.className = 'lang-switcher';
        switcher.innerHTML = `
            <button onclick="I18N.setLanguage('en')" class="${this.currentLang === 'en' ? 'active' : ''}">EN</button>
            <span>|</span>
            <button onclick="I18N.setLanguage('tr')" class="${this.currentLang === 'tr' ? 'active' : ''}">TR</button>
        `;

        navLinks.appendChild(switcher);
    }
};

// Start i18n when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // translations.js must be loaded before this
    if (typeof TRANSLATIONS !== 'undefined') {
        I18N.init();
    }
});
