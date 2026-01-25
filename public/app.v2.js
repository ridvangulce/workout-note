// API Configuration - v1.0.1 (Cache Buster Update)
const API_URL = '/api/auth';

const MUSCLE_GROUPS = [
    "Chest", "Back", "Shoulders", "Biceps", "Triceps", "Forearms",
    "Quads", "Hamstrings", "Glutes", "Calves", "Abs", "Traps", "Lats"
];

let currentEditingExerciseId = null;

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initial UI Checks
    updateAuthUI();
    if (window.location.pathname.endsWith('dashboard.html')) {
        updateDashboardUI();
    }

    // 2. Auth Forms
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    // Modal Triggers
    const triggerAddExercise = document.querySelector('[onclick="openModal(\'addExerciseModal\')"]');
    if (triggerAddExercise) {
        triggerAddExercise.onclick = null; // Clear inline
        triggerAddExercise.addEventListener('click', () => window.openModal('addExerciseModal'));
    }

    const triggerCreateRoutine = document.querySelector('[onclick="openModal(\'createRoutineModal\')"]');
    if (triggerCreateRoutine) {
        triggerCreateRoutine.onclick = null; // Clear inline
        triggerCreateRoutine.addEventListener('click', () => window.openModal('createRoutineModal'));
    }

    // 3. Navigation & Interaction
    document.querySelectorAll('.sidebar-menu a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const view = e.target.closest('a').dataset.view;
            if (view && window.switchView) window.switchView(view);
        });
    });

    // 4. Modal Forms
    const addExerciseForm = document.getElementById('addExerciseForm');
    if (addExerciseForm) {
        addExerciseForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('exerciseName').value;
            const target_muscle_group = document.getElementById('targetMuscle').value;
            const secondary_muscles = $('#secondaryMuscleSelect').val() ? $('#secondaryMuscleSelect').val().join(', ') : '';

            try {
                let url = '/api/exercises';
                let method = 'POST';

                if (currentEditingExerciseId) {
                    url = `/api/exercises/${currentEditingExerciseId}`;
                    method = 'PUT';
                }

                const res = await fetchWithAuth(url, {
                    method: method,
                    body: { name, target_muscle_group, secondary_muscles }
                });

                if (res.ok) {
                    window.closeModal('addExerciseModal');
                    currentEditingExerciseId = null;
                    updateDashboardUI(); // Refresh list
                    addExerciseForm.reset();
                } else {
                    alert(I18N.t('failed_save_exercise'));
                }
            } catch (err) { console.error(err); }
        });
    }

    // Populate Muscle Group UI
    const targetMuscleSelect = document.getElementById('targetMuscle');
    const secondaryMuscleSelect = document.getElementById('secondaryMuscleSelect');
    const exerciseTabFilter = document.getElementById('exerciseTabFilter');
    const routineExerciseFilter = document.getElementById('routineExerciseFilter');

    const muscleOptions = MUSCLE_GROUPS.map(m => `<option value="${m}">${I18N.t('muscle_' + m)}</option>`).join('');

    if (targetMuscleSelect) {
        targetMuscleSelect.innerHTML = `<option value="">${I18N.t('target_muscle_group')}</option>` + muscleOptions;
    }
    if (secondaryMuscleSelect) {
        secondaryMuscleSelect.innerHTML = muscleOptions;
    }
    if (exerciseTabFilter) {
        exerciseTabFilter.innerHTML = muscleOptions;
    }
    if (routineExerciseFilter) {
        routineExerciseFilter.innerHTML = muscleOptions;
    }

    // Initialize Select2
    if (typeof $ !== 'undefined' && $.fn.select2) {
        $('#exerciseTabFilter').select2({ placeholder: I18N.t('filter_muscles'), allowClear: true }).on('change', filterExerciseTab);
        $('#routineExerciseFilter').select2({ placeholder: I18N.t('muscle_group_filter'), allowClear: true }).on('change', filterRoutineExercises);
        $('#secondaryMuscleSelect').select2({ placeholder: I18N.t('secondary_muscles'), allowClear: true });
    }

    const createRoutineForm = document.getElementById('createRoutineForm');
    if (createRoutineForm) {
        createRoutineForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('routineName').value;
            const exercises = Array.from(document.querySelectorAll('input[name="exercises"]:checked')).map(cb => cb.value);

            try {
                let url = '/api/routines';
                let method = 'POST';

                if (currentEditingRoutineId) {
                    url = `/api/routines/${currentEditingRoutineId}`;
                    method = 'PUT';
                }

                const res = await fetchWithAuth(url, {
                    method: method,
                    body: { name, exercises }
                });

                if (res.ok) {
                    window.closeModal('createRoutineModal');
                    currentEditingRoutineId = null;
                    updateDashboardUI(); // Refresh list
                    createRoutineForm.reset();
                    window.switchView('workouts');
                } else {
                    alert('Failed to save routine');
                }
            } catch (err) { console.error(err); }
        });
    }

    setupNavLinks();
});

// --- Auth Handling ---

async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const btn = e.target.querySelector('button');

    setLoading(btn, true);

    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();

        if (response.ok) {
            const token = data.accessToken || data.token;
            if (token) {
                localStorage.setItem('workout_token', token);
                if (data.user) {
                    localStorage.setItem('workout_user', JSON.stringify(data.user));
                }
            }
            showMessage('success', I18N.t('login_success'));
            setTimeout(() => { window.location.href = '/dashboard.html'; }, 1000);
        } else {
            showMessage('error', data.error === 'Invalid credentials' ? I18N.t('invalid_credentials') : (data.error || data.message || I18N.t('error_generic')));
        }
    } catch (error) {
        console.error(error);
        showMessage('error', I18N.t('error_generic'));
    } finally {
        setLoading(btn, false);
    }
}

async function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const btn = e.target.querySelector('button');

    setLoading(btn, true);

    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });
        const data = await response.json();

        if (response.ok) {
            showMessage('success', I18N.t('register_success'));
            setTimeout(() => { window.location.href = '/login.html'; }, 1500);
        } else {
            showMessage('error', data.error || data.message || I18N.t('error_generic'));
        }
    } catch (error) {
        console.error(error);
        showMessage('error', I18N.t('error_generic'));
    } finally {
        setLoading(btn, false);
    }
}

function handleLogout(e) {
    if (e) e.preventDefault();
    localStorage.removeItem('workout_token');
    localStorage.removeItem('workout_user');
    window.location.href = '/login.html';
}

// --- UI Helpers ---

function updateAuthUI() {
    const token = localStorage.getItem('workout_token');
    const navLinks = document.querySelector('.nav-links');

    if (navLinks) {
        navLinks.innerHTML = '';
        if (token) {
            const user = JSON.parse(localStorage.getItem('workout_user') || '{}');
            navLinks.innerHTML = `
                <a href="/dashboard.html" data-i18n="nav_overview">${I18N.t('nav_overview')}</a>
                <span class="user-greeting" style="color:var(--text-muted); font-size: 0.9rem;">${I18N.t('welcome_back').split(',')[0]} ${user.name || 'User'}</span>
                <a href="#" id="logoutBtn" class="btn btn-outline" style="padding: 0.5rem 1rem; font-size: 0.9rem;" data-i18n="nav_logout">${I18N.t('nav_logout')}</a>
            `;
            setTimeout(() => {
                const logoutBtn = document.getElementById('logoutBtn');
                if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);
            }, 0);
        } else {
            navLinks.innerHTML = `
                <a href="/#features" data-i18n="nav_features">${I18N.t('nav_features')}</a>
                <a href="/#docs" data-i18n="nav_docs">${I18N.t('nav_docs')}</a>
                <a href="/login.html" class="btn btn-secondary" data-i18n="nav_login">${I18N.t('nav_login')}</a>
                <a href="/register.html" class="btn btn-primary" data-i18n="nav_get_started">${I18N.t('nav_get_started')}</a>
            `;
        }
        // Force re-render switcher since we replace navLinks.innerHTML
        if (typeof I18N !== 'undefined') I18N.renderLanguageSwitcher(true);
    }
}

async function updateDashboardUI() {
    console.log("Dashboard UI v1.0.4 is running");
    const user = JSON.parse(localStorage.getItem('workout_user') || '{}');
    const userNameEl = document.getElementById('userName');
    const userInitialsEl = document.getElementById('userInitials');

    if (userNameEl) userNameEl.textContent = user.name || 'User';
    if (userInitialsEl) userInitialsEl.textContent = (user.name || 'U').charAt(0).toUpperCase();

    const nameDisplay = document.getElementById('userNameDisplay');
    if (nameDisplay) {
        nameDisplay.textContent = user.name || (user.email ? user.email.split('@')[0] : 'User');
    }

    const token = localStorage.getItem('workout_token');
    if (!token) return;

    // 1. Fetch Exercises
    try {
        const res = await fetchWithAuth('/api/exercises');
        if (res.ok) {
            const exercises = await res.json();
            const list = document.getElementById('exercisesList');
            const selectContainer = document.getElementById('exerciseSelectContainer');

            if (list) {
                if (exercises.length === 0) list.innerHTML = `<div class="empty-state">${I18N.t('no_exercises_found')}</div>`;
                else list.innerHTML = exercises.map(ex => `<div class="exercise-item"><span>${ex.name}</span></div>`).join('');
            }
            if (exercises.length === 0) selectContainer.innerHTML = `<div class="empty-state">${I18N.t('loading_exercises')}</div>`;
            else selectContainer.innerHTML = exercises.map(ex => `
                    <label class="exercise-checkbox-item" data-name="${ex.name.toLowerCase()}" data-target="${(ex.target_muscle_group || '').toLowerCase()}" data-secondary="${(ex.secondary_muscles || '').toLowerCase()}">
                        <input type="checkbox" value="${ex.id}" name="exercises">
                        ${ex.name}
                    </label>
                `).join('');

            // Render Draggable List
            if (list) {
                if (exercises.length === 0) list.innerHTML = `<div class="empty-state">${I18N.t('no_exercises_found')}</div>`;
                else {
                    list.innerHTML = exercises.map(ex => `
                            <div class="exercise-item" draggable="true" data-id="${ex.id}" data-target="${(ex.target_muscle_group || '').toLowerCase()}" data-secondary="${(ex.secondary_muscles || '').toLowerCase()}">
                                <div class="exercise-content">
                                    <span class="drag-handle">☰</span>
                                    <div style="display:flex; flex-direction:column;">
                                        <span class="exercise-name" style="font-weight:600;">${ex.name}</span>
                                        ${ex.target_muscle_group ? `<span style="font-size:0.75rem; color:var(--text-muted);">${I18N.t('muscle_' + ex.target_muscle_group)}${ex.secondary_muscles ? ' · ' + ex.secondary_muscles.split(', ').map(m => I18N.t('muscle_' + m)).join(', ') : ''}</span>` : ''}
                                    </div>
                                </div>
                                <div class="exercise-actions">
                                    <button class="btn-icon" onclick="editExercise('${ex.id}', '${ex.name}', '${ex.target_muscle_group || ''}', '${ex.secondary_muscles || ''}')">✏️</button>
                                    <button class="btn-icon" onclick="deleteExercise('${ex.id}')">🗑️</button>
                                </div>
                            </div>
                        `).join('');
                    setupDragAndDrop();
                }
            }
        }
    } catch (e) { console.error(e); }

    // 2. Fetch Routines
    try {
        const res = await fetchWithAuth('/api/routines');
        if (res.ok) {
            const routines = await res.json();
            const list = document.getElementById('routinesList');

            if (list) {
                if (routines.length === 0) list.innerHTML = '<div class="empty-state">No routines found.</div>';
                else list.innerHTML = routines.map(r => `
                    <div class="routine-card" data-id="${r.id}">
                        <div class="routine-header" style="display:flex; justify-content:space-between;">
                            <div class="routine-title">${r.name}</div>
                            <div class="routine-actions">
                                <button class="btn-icon" onclick="openEditRoutineModal('${r.id}')">✏️</button>
                                <button class="btn-icon" onclick="deleteRoutine('${r.id}')">🗑️</button>
                            </div>
                        </div>
                        <div class="routine-exercises">
                            ${r.exercises && r.exercises.length > 0
                        ? r.exercises.length + ' Exercises: ' + r.exercises.map(e => e.name).slice(0, 3).join(', ')
                        : 'No exercises'}
                        </div>
                        <button class="btn btn-outline btn-sm" onclick="startWorkout('${r.id}')" style="width:100%; margin-top:0.5rem;">Start Workout</button>
                    </div>
                `).join('');
            }
        }
    } catch (e) { console.error(e); }

    // 3. Fetch History & Render Chart
    try {
        const res = await fetchWithAuth('/api/workouts');
        if (res.ok) {
            const workouts = await res.json();
            const list = document.getElementById('historyList');

            // Update Summary Stats
            const totalWorkoutsEl = document.getElementById('totalWorkouts');
            if (totalWorkoutsEl) totalWorkoutsEl.textContent = workouts.length;

            // Render List
            const historyHtml = workouts.map(w => `
                <div class="routine-card">
                    <div class="routine-header" style="display:flex; justify-content:space-between;">
                        <div class="routine-title">${new Date(w.workout_date).toLocaleDateString()}</div>
                        <div class="routine-actions">
                            <button class="btn-icon" onclick="editHistoryWorkout('${w.id}')">✏️</button>
                            <button class="btn-icon" onclick="deleteHistoryWorkout('${w.id}')">🗑️</button>
                        </div>
                    </div>
                    <div class="routine-exercises" style="font-weight: 500; color: var(--text-color);">
                        ${w.note || I18N.t('no_notes')}
                    </div>
                    <div class="routine-exercises">
                        ${I18N.t('total_sets_label')} ${w.total_sets || 0}
                    </div>
                </div>
            `).join('');

            if (list) {
                if (workouts.length === 0) list.innerHTML = `<div class="empty-state">${I18N.t('no_recent')}</div>`;
                else list.innerHTML = historyHtml;
            }

            const recentActivityContainer = document.querySelector('.recent-activity');
            if (recentActivityContainer) {
                if (workouts.length === 0) {
                    recentActivityContainer.innerHTML = `<h3 data-i18n="recent_activity_title">${I18N.t('recent_activity_title')}</h3><div class="empty-state"><p data-i18n="no_recent">${I18N.t('no_recent')}</p></div>`;
                } else {
                    // Show last 3
                    const recentHtml = workouts.slice(0, 3).map(w => `
                        <div class="routine-card" style="margin-bottom: 1rem;">
                            <div class="routine-header" style="display:flex; justify-content:space-between;">
                                <div class="routine-title">${new Date(w.workout_date).toLocaleDateString()}</div>
                                <span style="font-size: 0.8rem; color: var(--text-muted);">${w.total_sets || 0} ${I18N.t('sets_unit')}</span>
                            </div>
                            <div class="routine-exercises" style="margin-top: 0.5rem; font-size: 0.9rem;">
                                ${w.note || I18N.t('no_notes')}
                            </div>
                        </div>
                    `).join('');
                    recentActivityContainer.innerHTML = `<h3 data-i18n="recent_activity_title">${I18N.t('recent_activity_title')}</h3>` + recentHtml +
                        `<button data-i18n="view_all_history" class="btn btn-outline btn-sm" style="width:100%; margin-top:0.5rem;" onclick="switchView('history')">${I18N.t('view_all_history')}</button>`;
                }
            }

            // Render Chart
            if (window.renderChart) window.renderChart(workouts);
        }
    } catch (e) { console.error(e); }
}

// --- Global Functions ---

window.switchView = function (viewName) {
    document.querySelectorAll('.view-section').forEach(el => el.style.display = 'none');
    document.getElementById(`${viewName}-view`).style.display = 'block';

    document.querySelectorAll('.sidebar-menu a').forEach(el => {
        if (el.dataset.view === viewName) el.parentElement.classList.add('active');
        else el.parentElement.classList.remove('active');
    });
}

window.openModal = function (modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        // Reset Logic for Create Routine
        if (modalId === 'createRoutineModal' && !currentEditingRoutineId) {
            document.getElementById('createRoutineForm').reset();
            document.getElementById('createRoutineModalTitle').textContent = I18N.t('create_new_routine');
            document.getElementById('createRoutineSubmitBtn').textContent = I18N.t('save_routine');
            currentEditingRoutineId = null;
        }
        // Reset Logic for Add/Edit Exercise
        if (modalId === 'addExerciseModal' && !currentEditingExerciseId) {
            document.getElementById('addExerciseForm').reset();
            document.getElementById('addExerciseModalTitle').textContent = I18N.t('add_new_exercise');
            document.getElementById('addExerciseSubmitBtn').textContent = I18N.t('add_exercise');
            currentEditingExerciseId = null;
            if ($.fn.select2) {
                $('#secondaryMuscleSelect').val(null).trigger('change');
            }
        }
        modal.style.display = 'block';
    }
}

window.closeModal = function (modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        if (modalId === 'createRoutineModal') {
            currentEditingRoutineId = null;
        }
        if (modalId === 'addExerciseModal') {
            currentEditingExerciseId = null;
        }
        modal.style.display = 'none';
    }
}

window.startWorkout = function (routineId) {
    window.location.href = `/workout-log.html?routine=${routineId}`;
}

let workoutChartInstance = null;

window.renderChart = function (workouts) {
    const ctx = document.getElementById('workoutChart');
    if (!ctx) return;

    // Sort by date ascending for chart
    const data = [...workouts].reverse().slice(-10); // Last 10

    const labels = data.map(w => new Date(w.workout_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }));
    const setsData = data.map(w => parseInt(w.total_sets));

    if (workoutChartInstance) {
        workoutChartInstance.destroy();
    }

    if (typeof Chart === 'undefined') return;

    workoutChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: I18N.t('total_sets_chart'),
                data: setsData,
                backgroundColor: 'rgba(0, 242, 96, 0.5)',
                borderColor: '#00f260',
                borderWidth: 1,
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
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
            },
            plugins: {
                legend: { labels: { color: '#fff' } }
            }
        }
    });
}

window.deleteHistoryWorkout = async function (id) {
    if (!confirm(I18N.t('delete_confirm_workout'))) return;
    try {
        const res = await fetchWithAuth(`/api/workouts/${id}`, { method: 'DELETE' });
        if (res.ok) updateDashboardUI();
    } catch (e) { console.error(e); }
}

window.editHistoryWorkout = function (id) {
    window.location.href = `/workout-log.html?workoutId=${id}`;
}

// --- Utils ---

async function fetchWithAuth(url, options = {}) {
    const token = localStorage.getItem('workout_token');
    const headers = {
        ...options.headers,
        'Authorization': `Bearer ${token}`
    };
    if (options.body && typeof options.body !== 'string' && !(options.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
        options.body = JSON.stringify(options.body);
    }
    const response = await fetch(url, { ...options, headers });
    if (response.status === 401) {
        localStorage.removeItem('workout_token');
        window.location.href = '/login.html';
    }
    return response;
}

function setLoading(btn, isLoading) {
    if (isLoading) {
        btn.dataset.originalText = btn.textContent;
        btn.textContent = I18N.t('processing');
        btn.disabled = true;
    } else {
        btn.textContent = btn.dataset.originalText;
        btn.disabled = false;
    }
}

function showMessage(type, text) {
    const msgEl = document.getElementById('formMessage');
    if (msgEl) {
        msgEl.textContent = text;
        msgEl.className = `form-message ${type}`;
    }
}

window.editExercise = async function (id, name, target, secondary) {
    currentEditingExerciseId = id;

    // Populate Modal
    document.getElementById('exerciseName').value = name;
    document.getElementById('targetMuscle').value = target || "";

    document.getElementById('addExerciseModalTitle').textContent = I18N.t('edit_exercise');
    document.getElementById('addExerciseSubmitBtn').textContent = I18N.t('update_exercise');

    // Set secondary muscles using Select2
    const secondaryArray = secondary ? secondary.split(',').map(s => s.trim()) : [];
    if ($.fn.select2) {
        $('#secondaryMuscleSelect').val(secondaryArray).trigger('change');
    }

    window.openModal('addExerciseModal');
}

window.deleteExercise = async function (id) {
    if (confirm(I18N.t('delete_confirm_exercise'))) {
        try {
            const res = await fetchWithAuth(`/api/exercises/${id}`, {
                method: 'DELETE'
            });
            if (res.ok || res.status === 204) updateDashboardUI();
            else alert(I18N.t('failed_delete_exercise'));
        } catch (e) { console.error(e); }
    }
}

function setupDragAndDrop() {
    const list = document.getElementById('exercisesList');
    if (!list) return;

    let draggedItem = null;

    list.querySelectorAll('.exercise-item').forEach(item => {
        item.addEventListener('dragstart', function (e) {
            draggedItem = item;
            setTimeout(() => item.style.display = 'none', 0);
        });

        item.addEventListener('dragend', function () {
            setTimeout(() => {
                draggedItem.style.display = 'flex';
                draggedItem = null;
                saveExerciseOrder();
            }, 0);
        });

        item.addEventListener('dragover', function (e) {
            e.preventDefault();
            const afterElement = getDragAfterElement(list, e.clientY);
            if (afterElement == null) {
                list.appendChild(draggedItem);
            } else {
                list.insertBefore(draggedItem, afterElement);
            }
        });
    });
}

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.exercise-item:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

async function saveExerciseOrder() {
    const orderedIds = [...document.querySelectorAll('#exercisesList .exercise-item')].map(el => el.dataset.id);
    try {
        await fetchWithAuth('/api/exercises/reorder', {
            method: 'POST',
            body: { orderedIds }
        });
    } catch (e) { console.error(e); }
}

// Search/Filter Logic
function filterExerciseTab() {
    const selectedMuscles = $('#exerciseTabFilter').val() || [];
    const items = document.querySelectorAll('#exercisesList .exercise-item');
    items.forEach(item => {
        if (selectedMuscles.length === 0) {
            item.style.display = 'flex';
            return;
        }
        const target = (item.dataset.target || '').toLowerCase();
        const secondary = (item.dataset.secondary || '').split(',').map(s => s.trim().toLowerCase());

        const matchesMuscle = selectedMuscles.every(m => {
            const lowerM = m.toLowerCase();
            return target === lowerM || secondary.includes(lowerM);
        });

        item.style.display = matchesMuscle ? 'flex' : 'none';
    });
}

const exerciseSearch = document.getElementById('exerciseSearch');
const routineExerciseFilter = document.getElementById('routineExerciseFilter');

function filterRoutineExercises() {
    const term = exerciseSearch.value.toLowerCase();
    const selectedMuscles = $('#routineExerciseFilter').val() || [];
    const items = document.querySelectorAll('#exerciseSelectContainer .exercise-checkbox-item');

    items.forEach(item => {
        const name = item.dataset.name || '';
        const target = (item.dataset.target || '').toLowerCase();
        const secondary = (item.dataset.secondary || '').split(',').map(s => s.trim().toLowerCase());

        const matchesName = name.includes(term);
        let matchesMuscle = true;

        if (selectedMuscles.length > 0) {
            matchesMuscle = selectedMuscles.every(m => {
                const lowerM = m.toLowerCase();
                return target === lowerM || secondary.includes(lowerM);
            });
        }

        if (matchesName && matchesMuscle) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

if (exerciseSearch) {
    exerciseSearch.addEventListener('input', filterRoutineExercises);
}

// Routine CRUD
window.deleteRoutine = async function (id) {
    if (!confirm(I18N.t('delete_confirm_routine'))) return;
    try {
        const res = await fetchWithAuth(`/api/routines/${id}`, { method: 'DELETE' });
        if (res.ok || res.status === 204) {
            updateDashboardUI();
        } else {
            alert(I18N.t('failed_delete_routine'));
        }
    } catch (e) { console.error(e); }
}

let currentEditingRoutineId = null;

window.openEditRoutineModal = async function (id) {
    currentEditingRoutineId = id;
    try {
        const res = await fetchWithAuth(`/api/routines/${id}`);
        if (res.ok) {
            const routine = await res.json();

            // Populate Modal
            document.getElementById('routineName').value = routine.name;
            document.getElementById('createRoutineModalTitle').textContent = I18N.t('edit_exercise').split(':')[0]; // Refactor later
            document.getElementById('createRoutineSubmitBtn').textContent = I18N.t('update_exercise').split(' ')[0]; // Refactor later

            // Checks
            const exerciseIds = routine.exercises ? routine.exercises.map(e => String(e.id)) : [];
            document.querySelectorAll('input[name="exercises"]').forEach(cb => {
                cb.checked = exerciseIds.includes(cb.value);
            });

            window.openModal('createRoutineModal');
        }
    } catch (e) { console.error(e); }
}

function setupNavLinks() { }
