// Nutrition View Functions
let nutritionStartDate = new Date().toISOString().split('T')[0];
let nutritionEndDate = new Date().toISOString().split('T')[0];
let nutritionChartInstance = null;

// Initialize nutrition view when switched
function initNutritionView() {
    // Initialize date pickers with Flatpickr
    if (typeof flatpickr !== 'undefined') {
        const config = {
            theme: "dark",
            dateFormat: "Y-m-d",
            disableMobile: false, // forcing native on mobile if desired, but user asked for modern lib
            onChange: function (selectedDates, dateStr, instance) {
                // Optional: Auto-reload on change if desired, or just wait for Filter btn
            }
        };
        flatpickr("#nutritionStartDate", { ...config, defaultDate: nutritionStartDate });
        flatpickr("#nutritionEndDate", { ...config, defaultDate: nutritionEndDate });
        flatpickr("#mealDate", { ...config, defaultDate: new Date() });
    } else {
        // Fallback
        document.getElementById('nutritionStartDate').value = nutritionStartDate;
        document.getElementById('nutritionEndDate').value = nutritionEndDate;
        document.getElementById('mealDate').value = new Date().toISOString().split('T')[0];
    }

    loadDailySummary();
    loadMeals();
    loadNutritionChart();

    // Attach form submit handler
    const form = document.getElementById('addMealForm');
    if (form && !form.dataset.hasListener) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await saveMeal();
        });
        form.dataset.hasListener = 'true';
    }
}

// Date navigation functions
async function reloadNutritionData() {
    nutritionStartDate = document.getElementById('nutritionStartDate').value;
    nutritionEndDate = document.getElementById('nutritionEndDate').value;

    if (new Date(nutritionEndDate) < new Date(nutritionStartDate)) {
        alert(I18N.t('error_date_range') || 'End date cannot be before start date');
        return;
    }

    await loadDailySummary();
    await loadMeals();
    await loadNutritionChart();
}


async function loadNutritionChart() {
    const chartCanvas = document.getElementById('nutritionChart');
    const loadingEl = document.getElementById('chartLoading');
    const emptyEl = document.getElementById('chartEmpty');

    if (!chartCanvas) return;

    loadingEl.style.display = 'block';
    chartCanvas.style.opacity = '0.3';

    try {
        // Always request custom period logic from backend since we use date range
        const res = await fetchWithAuth(`/api/meals/analytics?period=custom&date=${nutritionStartDate}&startDate=${nutritionStartDate}&endDate=${nutritionEndDate}`);

        if (res.ok) {
            const response = await res.json();
            const data = response.data || [];

            // Backend returns 'custom' period which means date-based labels usually,
            // or 'day' if start==end. We use what backend tells us.
            const effectivePeriod = response.period || 'custom';
            renderNutritionChart(data, effectivePeriod);

            loadingEl.style.display = 'none';
            chartCanvas.style.opacity = '1';
            emptyEl.style.display = data.length === 0 ? 'block' : 'none';
        }
    } catch (error) {
        console.error('Error loading chart:', error);
        loadingEl.style.display = 'none';
        chartCanvas.style.opacity = '1';
    }
}

function renderNutritionChart(data, period) {
    const ctx = document.getElementById('nutritionChart');
    if (!ctx) return;

    if (nutritionChartInstance) {
        nutritionChartInstance.destroy();
    }

    if (!data || data.length === 0) {
        document.getElementById('chartEmpty').style.display = 'block';
        return;
    }

    document.getElementById('chartEmpty').style.display = 'none';

    const labels = data.map(item => {
        // If period is 'day', we show meal types. 
        // For 'week', 'month', or 'custom' (range), we show dates.
        if (period === 'day') {
            const typeTranslations = {
                'breakfast': I18N.t('meal_breakfast'),
                'lunch': I18N.t('meal_lunch'),
                'dinner': I18N.t('meal_dinner'),
                'snack': I18N.t('meal_snack')
            };
            return typeTranslations[item.label] || item.label;
        } else {
            // For custom/week/month, the item likely has 'date' property from backend
            // or 'label' if it was legacy. The backend now returns 'date' for week/month/custom.
            // Let's handle both.
            const dateStr = item.date || item.label;
            return new Date(dateStr).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
        }
    });

    nutritionChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: I18N.t('calories'),
                    data: data.map(d => d.calories),
                    borderColor: 'rgb(239, 68, 68)',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    tension: 0.4
                },
                {
                    label: I18N.t('protein') + ' (g)',
                    data: data.map(d => d.protein),
                    borderColor: 'rgb(59, 130, 246)',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.4
                },
                {
                    label: I18N.t('carbs') + ' (g)',
                    data: data.map(d => d.carbs),
                    borderColor: 'rgb(251, 191, 36)',
                    backgroundColor: 'rgba(251, 191, 36, 0.1)',
                    tension: 0.4
                },
                {
                    label: I18N.t('fat') + ' (g)',
                    data: data.map(d => d.fat),
                    borderColor: 'rgb(168, 85, 247)',
                    backgroundColor: 'rgba(168, 85, 247, 0.1)',
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    labels: { color: '#fff' }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(255,255,255,0.1)' },
                    ticks: { color: '#a0a0b0' }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: '#a0a0b0' }
                }
            }
        }
    });
}

async function analyzeMeal() {
    const description = document.getElementById('mealDescription').value.trim();
    if (!description) {
        alert(I18N.t('meal_description_required'));
        return;
    }

    const analyzeBtn = event.target;
    analyzeBtn.disabled = true;
    analyzeBtn.innerHTML = '⏳ ' + I18N.t('analyzing');

    try {
        const language = I18N.currentLang || 'en';
        const res = await fetchWithAuth(`/api/integrations/analyze-meal?description=${encodeURIComponent(description)}&language=${language}`);

        if (res.ok) {
            const data = await res.json();

            document.getElementById('calories').value = data.calories;
            document.getElementById('protein').value = data.protein;
            document.getElementById('carbs').value = data.carbs;
            document.getElementById('fat').value = data.fat;
            document.getElementById('portionNote').textContent = data.portionNote || '';

            document.getElementById('analysisResults').style.display = 'block';
        } else {
            alert('AI analysis failed. Please try again.');
        }
    } catch (error) {
        console.error('Analysis error:', error);
        alert('Error analyzing meal');
    } finally {
        analyzeBtn.disabled = false;
        analyzeBtn.innerHTML = '🤖 ' + I18N.t('analyze_with_ai');
    }
}

async function saveMeal() {
    const mealType = document.getElementById('mealType').value;
    const description = document.getElementById('mealDescription').value.trim();
    const calories = parseInt(document.getElementById('calories').value) || null;
    const protein = parseFloat(document.getElementById('protein').value) || null;
    const carbs = parseFloat(document.getElementById('carbs').value) || null;
    const fat = parseFloat(document.getElementById('fat').value) || null;

    if (!description) {
        alert(I18N.t('meal_description_required'));
        return;
    }

    const mealDate = document.getElementById('mealDate').value || new Date().toISOString().split('T')[0];

    if (!description) {
        alert(I18N.t('meal_description_required'));
        return;
    }

    try {
        const res = await fetchWithAuth('/api/meals', {
            method: 'POST',
            body: {
                mealDate,
                mealType,
                description,
                calories,
                protein,
                carbs,
                fat,
                isAiEstimated: true
            }
        });

        if (res.ok) {
            document.getElementById('addMealForm').reset();
            document.getElementById('analysisResults').style.display = 'none';
            await loadDailySummary();
            await loadMeals();
            await loadNutritionChart(); // Refresh chart
        } else {
            alert('Failed to save meal');
        }
    } catch (error) {
        console.error('Save error:', error);
        alert('Error saving meal');
    }
}

async function loadDailySummary() {
    try {
        const res = await fetchWithAuth(`/api/meals/summary?startDate=${nutritionStartDate}&endDate=${nutritionEndDate}`);
        if (res.ok) {
            const data = await res.json();

            const totalCals = Math.round(data.summary.total_calories || 0);
            const totalProtein = Math.round(data.summary.total_protein || 0);
            const totalCarbs = Math.round(data.summary.total_carbs || 0);
            const totalFat = Math.round(data.summary.total_fat || 0);

            // Update basic text
            document.getElementById('totalCalories').textContent = totalCals;
            document.getElementById('totalProtein').textContent = totalProtein;
            document.getElementById('totalCarbs').textContent = totalCarbs;
            document.getElementById('totalFat').textContent = totalFat;

            if (data.goals) {
                const targetCals = data.goals.daily_calorie_target || 2000;
                const targetProtein = data.goals.daily_protein_target || 150;
                const targetCarbs = data.goals.daily_carbs_target || 200;
                const targetFat = data.goals.daily_fat_target || 60;

                // Set Targets
                document.getElementById('targetCalories').textContent = targetCals;
                document.getElementById('targetProtein').textContent = targetProtein;
                document.getElementById('targetCarbs').textContent = targetCarbs;
                document.getElementById('targetFat').textContent = targetFat;

                // Calculate Remaining
                const calLeft = targetCals - totalCals;
                const proteinLeft = targetProtein - totalProtein;
                const carbsLeft = targetCarbs - totalCarbs;
                const fatLeft = targetFat - totalFat;

                document.getElementById('caloriesRemaining').textContent = Math.abs(calLeft);
                document.getElementById('caloriesStatus').textContent = calLeft >= 0 ? I18N.t('remaining') : I18N.t('over');
                document.getElementById('caloriesStatus').style.color = calLeft >= 0 ? 'var(--text-muted)' : '#ef4444';

                document.getElementById('proteinLeft').textContent = Math.abs(proteinLeft);
                document.getElementById('proteinStatus').textContent = proteinLeft >= 0 ? I18N.t('remaining') : I18N.t('over');

                document.getElementById('carbsLeft').textContent = Math.abs(carbsLeft);
                document.getElementById('carbsStatus').textContent = carbsLeft >= 0 ? I18N.t('remaining') : I18N.t('over');

                document.getElementById('fatLeft').textContent = Math.abs(fatLeft);
                document.getElementById('fatStatus').textContent = fatLeft >= 0 ? I18N.t('remaining') : I18N.t('over');

                // Update Progress Bars
                updateProgressBar('caloriesProgress', totalCals, targetCals, '#00f260');
                updateProgressBar('proteinProgress', totalProtein, targetProtein, '#3b82f6');
                updateProgressBar('carbsProgress', totalCarbs, targetCarbs, '#f59e0b');
                updateProgressBar('fatProgress', totalFat, targetFat, '#a855f7');

            } else {
                // Trigger onboarding if no goals
                const onboardingModal = document.getElementById('onboardingModal');
                if (onboardingModal) onboardingModal.style.display = 'block';
            }
        }
    } catch (error) {
        console.error('Load summary error:', error);
    }
}

function updateProgressBar(elementId, current, target, baseColor) {
    const el = document.getElementById(elementId);
    if (!el) return;

    let percentage = (current / target) * 100;
    // Cap visual width at 100% (or let it stay full)
    const visualWidth = Math.min(percentage, 100);

    el.style.width = `${visualWidth}%`;

    // Color Logic:
    // If > 110% -> Red (Warning)
    // If > 100% -> Orange/Red transition? 
    // For now: Red if > target (over limit), Base color if under.
    // Actually for macros like Protein, going over is sometimes good. 
    // But for calories, usually bad. 
    // Let's stick to simple: Turn Red if > 105%?

    if (percentage > 100) {
        el.style.backgroundColor = '#ef4444'; // Red warning
    } else {
        el.style.backgroundColor = baseColor;
    }
}

// Handle Onboarding Form
document.addEventListener('DOMContentLoaded', () => {
    const onboardingForm = document.getElementById('onboardingForm');
    if (onboardingForm) {
        onboardingForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = onboardingForm.querySelector('button[type="submit"]');
            const originalText = btn.innerText;
            btn.disabled = true;
            btn.innerText = 'Calculating...';

            const profileData = {
                gender: document.getElementById('profileGender').value,
                height: parseInt(document.getElementById('profileHeight').value),
                weight: parseFloat(document.getElementById('profileWeight').value),
                age: parseInt(document.getElementById('profileAge').value),
                targetWeight: parseFloat(document.getElementById('profileTargetWeight').value),
                activityLevel: document.getElementById('profileActivity').value,
                goalType: document.getElementById('profileGoal').value
            };

            try {
                const res = await fetchWithAuth('/api/meals/profile', {
                    method: 'POST',
                    body: profileData
                });

                if (res.ok) {
                    const data = await res.json();
                    document.getElementById('onboardingModal').style.display = 'none';
                    alert(I18N.t('goals_calculated_success') || 'Goals calculated successfully!');
                    // Refresh data
                    loadDailySummary();
                } else {
                    alert('Failed to save profile.');
                }
            } catch (err) {
                console.error(err);
                alert('Error processing request.');
            } finally {
                btn.disabled = false;
                btn.innerText = originalText;
            }
        });
    }
});

async function loadMeals() {
    try {
        const res = await fetchWithAuth(`/api/meals?startDate=${nutritionStartDate}&endDate=${nutritionEndDate}`);
        if (res.ok) {
            const { meals } = await res.json();
            renderMeals(meals);
        }
    } catch (error) {
        console.error('Load meals error:', error);
    }
}

function renderMeals(meals) {
    const container = document.getElementById('mealsContainer');

    if (!meals || meals.length === 0) {
        container.innerHTML = '<p class="text-muted" data-i18n="no_meals_today">No meals logged today</p>';
        return;
    }

    const mealIcons = {
        breakfast: '🌅',
        lunch: '🍴',
        dinner: '🌙',
        snack: '🍎'
    };

    container.innerHTML = meals.map(meal => `
        <div class="routine-card" style="margin-bottom: 1rem;">
            <div style="display: flex; justify-content: space-between; align-items: start;">
                <div style="flex: 1;">
                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                        <span style="font-size: 1.5rem;">${mealIcons[meal.meal_type] || '🍽️'}</span>
                        <div style="display: flex; flex-direction: column;">
                             <strong style="text-transform: capitalize;">${meal.meal_type}</strong>
                             <span style="font-size: 0.75rem; color: var(--text-muted);">${new Date(meal.meal_date).toLocaleDateString()}</span>
                        </div>
                    </div>
                    <p style="color: var(--text-muted); margin-bottom: 0.5rem;">${meal.description}</p>
                    <div style="display: flex; gap: 1rem; font-size: 0.875rem; color: var(--text-muted);">
                        ${meal.calories ? `<span>🔥 ${meal.calories} kcal</span>` : ''}
                        ${meal.protein ? `<span>🥩 ${meal.protein}g protein</span>` : ''}
                        ${meal.carbs ? `<span>🍞 ${meal.carbs}g carbs</span>` : ''}
                        ${meal.fat ? `<span>🧈 ${meal.fat}g fat</span>` : ''}
                    </div>
                </div>
                <button onclick="deleteMeal(${meal.id})" class="btn btn-sm" style="background: rgba(220,38,38,0.2); color: #ef4444;">
                    🗑️
                </button>
            </div>
        </div>
    `).join('');
}

async function deleteMeal(id) {
    if (!confirm(I18N.t('confirm_delete_meal'))) return;

    try {
        const res = await fetchWithAuth(`/api/meals/${id}`, { method: 'DELETE' });
        if (res.ok) {
            await loadDailySummary();
            await loadMeals();
            await loadNutritionChart(); // Refresh chart
        }
    } catch (error) {
        console.error('Delete error:', error);
    }
}
