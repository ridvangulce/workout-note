// Nutrition View Functions
let nutritionCurrentDate = new Date().toISOString().split('T')[0];
let nutritionChartPeriod = 'day';
let nutritionChartInstance = null;

// Initialize nutrition view when switched
function initNutritionView() {
    // Initialize date picker
    document.getElementById('nutritionDateSelector').value = nutritionCurrentDate;

    loadDailySummary();
    loadMeals();
    initNutritionChart();

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
function changeNutritionDate(days) {
    const date = new Date(nutritionCurrentDate);
    date.setDate(date.getDate() + days);
    nutritionCurrentDate = date.toISOString().split('T')[0];
    document.getElementById('nutritionDateSelector').value = nutritionCurrentDate;
    reloadNutritionData();
}

function onNutritionDateChange() {
    nutritionCurrentDate = document.getElementById('nutritionDateSelector').value;
    reloadNutritionData();
}

function goToNutritionToday() {
    nutritionCurrentDate = new Date().toISOString().split('T')[0];
    document.getElementById('nutritionDateSelector').value = nutritionCurrentDate;
    reloadNutritionData();
}

async function reloadNutritionData() {
    await loadDailySummary();
    await loadMeals();
    if (nutritionChartPeriod === 'day') {
        await loadNutritionChart();
    }
}

// Chart functions
function initNutritionChart() {
    loadNutritionChart();
}

function switchNutritionPeriod(period) {
    nutritionChartPeriod = period;
    document.querySelectorAll('.period-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.period === period);
    });
    loadNutritionChart();
}

async function loadNutritionChart() {
    const chartCanvas = document.getElementById('nutritionChart');
    const loadingEl = document.getElementById('chartLoading');
    const emptyEl = document.getElementById('chartEmpty');

    if (!chartCanvas) return;

    loadingEl.style.display = 'block';
    chartCanvas.style.opacity = '0.3';

    try {
        const res = await fetchWithAuth(`/api/meals/analytics?period=${nutritionChartPeriod}&date=${nutritionCurrentDate}`);
        if (res.ok) {
            const response = await res.json();
            const data = response.data || []; // Extract data array from response object
            renderNutritionChart(data, nutritionChartPeriod);
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
        if (period === 'day') {
            const typeTranslations = {
                'breakfast': I18N.t('meal_breakfast'),
                'lunch': I18N.t('meal_lunch'),
                'dinner': I18N.t('meal_dinner'),
                'snack': I18N.t('meal_snack')
            };
            return typeTranslations[item.label] || item.label;
        } else {
            return new Date(item.label).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
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

    try {
        const res = await fetchWithAuth('/api/meals', {
            method: 'POST',
            body: {
                mealDate: nutritionCurrentDate,
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
        const res = await fetchWithAuth(`/api/meals/summary?date=${nutritionCurrentDate}`);
        if (res.ok) {
            const data = await res.json();

            document.getElementById('totalCalories').textContent = Math.round(data.summary.total_calories || 0);
            document.getElementById('totalProtein').textContent = parseFloat(data.summary.total_protein || 0).toFixed(1);
            document.getElementById('totalCarbs').textContent = parseFloat(data.summary.total_carbs || 0).toFixed(1);
            document.getElementById('totalFat').textContent = parseFloat(data.summary.total_fat || 0).toFixed(1);

            if (data.goals) {
                document.getElementById('targetCalories').textContent = data.goals.daily_calorie_target || '--';
                document.getElementById('targetProtein').textContent = data.goals.daily_protein_target || '--';
                document.getElementById('targetCarbs').textContent = data.goals.daily_carbs_target || '--';
                document.getElementById('targetFat').textContent = data.goals.daily_fat_target || '--';
            }
        }
    } catch (error) {
        console.error('Load summary error:', error);
    }
}

async function loadMeals() {
    try {
        const res = await fetchWithAuth(`/api/meals?startDate=${nutritionCurrentDate}&endDate=${nutritionCurrentDate}`);
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
                        <strong style="text-transform: capitalize;">${meal.meal_type}</strong>
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
