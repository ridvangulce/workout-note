const BODY_MAP = {
    init: function () {
        this.renderFront();
        this.renderBack();
        this.bindEvents();
    },

    bindEvents: function () {
        const toggleBtn = document.getElementById('toggleBodyMap');
        const container = document.getElementById('bodyMapContainer');
        const text = document.getElementById('toggleMapText');

        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                const isHidden = container.style.display === 'none';
                container.style.display = isHidden ? 'block' : 'none';
                text.textContent = I18N.t(isHidden ? 'hide_body_map' : 'show_body_map');
                toggleBtn.classList.toggle('btn-primary', isHidden);
                toggleBtn.classList.toggle('btn-outline', !isHidden);
            });
        }

        $('#exerciseTabFilter').on('change', () => {
            this.syncMapWithFilter();
        });
    },

    renderFront: function () {
        const container = document.getElementById('human-front-svg');
        if (!container) return;

        // Realistic proportions: 200x500 viewBox
        container.innerHTML = `
            <svg viewBox="0 0 200 500" width="240" height="600" class="muscle-svg">
                <defs>
                    <radialGradient id="muscleGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                        <stop offset="0%" style="stop-color:rgba(255,255,255,0.15)" />
                        <stop offset="100%" style="stop-color:rgba(0,0,0,0)" />
                    </radialGradient>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                        <feMerge>
                            <feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                </defs>

                <!-- MAIN SILHOUETTE (Subtle inner glow) -->
                <path d="M100 20 C85 20 70 35 70 55 C70 75 85 90 100 90 C115 90 130 75 130 55 C130 35 115 20 100 20 
                         M70 85 C55 95 45 110 40 130 C30 160 32 200 38 230 C42 270 55 300 65 315 L75 460 L100 475 L125 460 L135 315 
                         C145 300 158 270 162 230 C168 200 170 160 160 130 C155 110 145 95 130 85 Z" class="body-silhouette" />

                <!-- ANATOMICAL FRONT GROUPS -->
                
                <!-- SHOULDERS (Deltoids) -->
                <path d="M60 95 C50 100 42 115 40 145 L58 155 C60 135 68 115 80 105 Z" class="muscle-path" data-muscle="Shoulders" />
                <path d="M140 95 C150 100 158 115 160 145 L142 155 C140 135 132 115 120 105 Z" class="muscle-path" data-muscle="Shoulders" />

                <!-- CHEST (Upper/Lower Pectorals matched) -->
                <path d="M100 105 L80 105 C70 115 65 145 75 165 C85 175 100 175 100 175 C100 175 115 175 125 165 C135 145 130 115 120 105 Z" class="muscle-path" data-muscle="Chest" />

                <!-- BICEPS (Long head look) -->
                <path d="M40 145 C35 165 38 210 48 230 L60 220 C55 195 54 175 58 155 Z" class="muscle-path" data-muscle="Biceps" />
                <path d="M160 145 C165 165 162 210 152 230 L140 220 C145 195 146 175 142 155 Z" class="muscle-path" data-muscle="Biceps" />

                <!-- FOREARMS -->
                <path d="M48 230 C45 265 52 305 65 315 L75 305 C68 285 62 250 60 220 Z" class="muscle-path" data-muscle="Forearms" />
                <path d="M152 230 C155 265 148 305 135 315 L125 305 C132 285 138 250 140 220 Z" class="muscle-path" data-muscle="Forearms" />

                <!-- ABS (Rectus Abdominis) -->
                <path d="M80 175 C75 195 78 260 85 270 L115 270 C122 260 125 195 120 175 Z" class="muscle-path" data-muscle="Abs" />
                
                <!-- QUADS (Detailed Frontal Legs) -->
                <path d="M70 275 L95 275 C92 310 88 410 85 430 L65 420 C68 360 62 310 65 275 Z" class="muscle-path" data-muscle="Quads" />
                <path d="M105 275 L130 275 C132 310 138 360 135 420 L115 430 C112 410 108 310 105 275 Z" class="muscle-path" data-muscle="Quads" />

                <!-- CALVES (Anterior view) -->
                <path d="M75 435 L90 435 L88 485 L75 485 Z" class="muscle-path" data-muscle="Calves" />
                <path d="M110 435 L125 435 L125 485 L112 485 Z" class="muscle-path" data-muscle="Calves" />
            </svg>
        `;
        this.addMuscleClickListeners(container);
    },

    renderBack: function () {
        const container = document.getElementById('human-back-svg');
        if (!container) return;

        container.innerHTML = `
            <svg viewBox="0 0 200 500" width="240" height="600" class="muscle-svg">
                <!-- SILHOUETTE BACK -->
                <path d="M100 20 C85 20 70 35 70 55 C70 75 85 90 100 90 C115 90 130 75 130 55 C130 35 115 20 100 20 
                         M70 85 C55 95 45 110 40 130 C30 160 32 200 38 230 C42 270 55 300 65 315 L75 460 L100 475 L125 460 L135 315 
                         C145 300 158 270 162 230 C168 200 170 160 160 130 C155 110 145 95 130 85 Z" class="body-silhouette" />

                <!-- ANATOMICAL BACK GROUPS -->

                <!-- TRAPS (Upper Back) -->
                <path d="M100 90 L75 105 L85 135 L100 155 L115 135 L125 105 Z" class="muscle-path" data-muscle="Traps" />

                <!-- LATS (Inner Wings) -->
                <path d="M85 135 C75 160 65 210 100 245 C135 210 125 160 115 135 L100 155 Z" class="muscle-path" data-muscle="Lats" />

                <!-- BACK (Lower/Erectors) -->
                <path d="M88 230 L100 220 L112 230 L105 270 L95 270 Z" class="muscle-path" data-muscle="Back" />

                <!-- TRICEPS -->
                <path d="M38 145 C35 175 38 220 48 235 L58 225 C54 195 53 170 58 150 Z" class="muscle-path" data-muscle="Triceps" />
                <path d="M162 145 C165 175 162 220 152 235 L142 225 C146 195 147 170 142 150 Z" class="muscle-path" data-muscle="Triceps" />

                <!-- GLUTES -->
                <path d="M65 270 C60 290 65 330 85 335 L100 330 L115 335 C135 330 140 290 135 270 Z" class="muscle-path" data-muscle="Glutes" />

                <!-- HAMSTRINGS -->
                <path d="M68 335 L95 335 C92 370 88 435 85 450 L65 440 C68 400 68 360 68 335 Z" class="muscle-path" data-muscle="Hamstrings" />
                <path d="M105 335 L132 335 C132 360 132 400 135 440 L115 450 C112 435 108 370 105 335 Z" class="muscle-path" data-muscle="Hamstrings" />

                <!-- CALVES -->
                <path d="M75 455 L92 455 L88 495 L75 495 Z" class="muscle-path" data-muscle="Calves" />
                <path d="M108 455 L125 455 L125 495 L112 495 Z" class="muscle-path" data-muscle="Calves" />
            </svg>
        `;
        this.addMuscleClickListeners(container);
    },

    addMuscleClickListeners: function (container) {
        container.querySelectorAll('.muscle-path').forEach(path => {
            path.addEventListener('click', () => {
                const muscle = path.dataset.muscle;
                const filter = $('#exerciseTabFilter');
                const currentVal = filter.val() || [];

                if (currentVal.includes(muscle)) {
                    filter.val(currentVal.filter(m => m !== muscle)).trigger('change');
                } else {
                    filter.val([...currentVal, muscle]).trigger('change');
                }
            });
        });
    },

    syncMapWithFilter: function () {
        const selectedMuscles = $('#exerciseTabFilter').val() || [];
        document.querySelectorAll('.muscle-path').forEach(path => {
            const muscle = path.dataset.muscle;
            if (selectedMuscles.includes(muscle)) {
                path.classList.add('active');
            } else {
                path.classList.remove('active');
            }
        });
    }
};

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('human-front-svg')) {
        BODY_MAP.init();
    }
});
