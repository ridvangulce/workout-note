
// AI Trainer Frontend Logic

document.addEventListener('DOMContentLoaded', () => {
    // Add event listener for the AI Trainer navigation link if it exists
    const aiTrainerLink = document.querySelector('a[data-view="ai-trainer"]');
    if (aiTrainerLink) {
        aiTrainerLink.addEventListener('click', (e) => {
            e.preventDefault();
            switchView('ai-trainer');
        });
    }
});

async function evaluateWorkout() {
    const workoutLog = document.getElementById('workoutLogInput').value;
    const resultsContainer = document.getElementById('aiTrainerResults');
    const resultContent = document.getElementById('aiTrainerResultContent');
    const loadingIndicator = document.getElementById('aiTrainerLoading');
    const analyzeBtn = document.getElementById('analyzeWorkoutBtn');

    const currentLang = I18N.currentLang || 'en';

    if (!workoutLog || workoutLog.trim().length === 0) {
        alert(TRANSLATIONS[currentLang]?.enter_workout_log || 'Please enter a workout log');
        return;
    }

    // UI Loading State
    analyzeBtn.disabled = true;
    loadingIndicator.style.display = 'block';
    resultsContainer.style.display = 'none';

    try {
        const token = localStorage.getItem('workout_token');
        const response = await fetch('/api/integrations/evaluate-workout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                workoutLog: workoutLog,
                language: currentLang
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to evaluate workout');
        }

        // Render Markdown-like response
        // Simple markdown rendering for specific headers and bold text
        let formattedText = data.analysis
            .replace(/^# (.*$)/gim, '<h3 class="ai-header-1">$1</h3>')
            .replace(/^## (.*$)/gim, '<h4 class="ai-header-2">$1</h4>')
            .replace(/^### (.*$)/gim, '<h5 class="ai-header-3">$1</h5>')
            .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
            .replace(/^\* (.*$)/gim, '<li>$1</li>')
            .replace(/^> (.*$)/gim, '<blockquote class="ai-quote">$1</blockquote>')
            .replace(/\n/gim, '<br>');

        resultContent.innerHTML = formattedText;
        resultsContainer.style.display = 'block';

        // Scroll to results
        resultsContainer.scrollIntoView({ behavior: 'smooth' });

    } catch (error) {
        console.error('AI Trainer Error:', error);
        alert(TRANSLATIONS[currentLang]?.ai_error || 'An error occurred while analyzing the workout.');
    } finally {
        analyzeBtn.disabled = false;
        loadingIndicator.style.display = 'none';
    }
}

// AI Trainer History Logic

function switchAiTab(tab) {
    const newSection = document.getElementById('aiNewAnalysisSection');
    const historySection = document.getElementById('aiHistorySection');
    const btnNew = document.getElementById('aiTabNew');
    const btnHistory = document.getElementById('aiTabHistory');

    if (tab === 'new') {
        newSection.style.display = 'block';
        historySection.style.display = 'none';
        btnNew.classList.add('active');
        btnHistory.classList.remove('active');
        document.getElementById('aiTrainerResults').style.display = 'none';
    } else {
        newSection.style.display = 'none';
        historySection.style.display = 'block';
        btnNew.classList.remove('active');
        btnHistory.classList.add('active');
        document.getElementById('aiTrainerResults').style.display = 'none';
        fetchAiHistory();
    }
}

async function fetchAiHistory() {
    const listContainer = document.getElementById('aiHistoryList');
    listContainer.innerHTML = '<div class="empty-state">Loading...</div>';

    try {
        const token = localStorage.getItem('workout_token');
        const response = await fetch('/api/integrations/ai-trainer/history', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const history = await response.json();

        if (!history || history.length === 0) {
            listContainer.innerHTML = '<div class="empty-state">No past analyses found.</div>';
            return;
        }

        listContainer.innerHTML = history.map(item => `
            <div class="card" onclick="viewHistoryItem(${item.id})" style="cursor: pointer; background: var(--card-bg); border: 1px solid var(--glass-border); border-radius: 12px; padding: 1rem; margin-bottom: 0.5rem; transition: transform 0.2s;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                    <span style="font-size: 0.85rem; color: var(--primary-color);">
                        ${new Date(item.created_at).toLocaleDateString()} ${new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span style="font-size: 1.2rem;">👉</span>
                </div>
                <div style="font-size: 0.9rem; color: var(--text-muted); display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; font-family: monospace;">
                    ${item.workout_log.substring(0, 100).replace(/\n/g, ' ')}...
                </div>
            </div>
        `).join('');

        // Cache history for viewing details
        window.aiHistoryCache = history;

    } catch (error) {
        console.error('Error fetching history:', error);
        listContainer.innerHTML = '<div class="empty-state" style="color: #ff4d4d;">Failed to load history</div>';
    }
}

window.viewHistoryItem = function (id) {
    const item = window.aiHistoryCache.find(i => i.id === id);
    if (!item) return;

    const resultsContainer = document.getElementById('aiTrainerResults');
    const resultContent = document.getElementById('aiTrainerResultContent');

    // Render
    let formattedText = item.analysis
        .replace(/^# (.*$)/gim, '<h3 class="ai-header-1">$1</h3>')
        .replace(/^## (.*$)/gim, '<h4 class="ai-header-2">$1</h4>')
        .replace(/^### (.*$)/gim, '<h5 class="ai-header-3">$1</h5>')
        .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
        .replace(/^\* (.*$)/gim, '<li>$1</li>')
        .replace(/^> (.*$)/gim, '<blockquote class="ai-quote">$1</blockquote>')
        .replace(/\n/gim, '<br>');

    resultContent.innerHTML = formattedText;
    resultsContainer.style.display = 'block';
    resultsContainer.scrollIntoView({ behavior: 'smooth' });
}
