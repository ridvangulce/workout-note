const TRANSLATIONS = {
    en: {
        // Nav & General
        "nav_features": "Features",
        "nav_docs": "Docs",
        "nav_login": "Login",
        "nav_get_started": "Get Started",
        "nav_logout": "Logout",
        "nav_overview": "Overview",
        "nav_workouts": "My Workouts",
        "nav_exercises": "Exercises",
        "nav_history": "History",

        // Hero Section
        "hero_title": "Unleash Your <br><span class='gradient-text'>Fitness Potential</span>",
        "hero_subtitle": "The most powerful and flexible API to build your next fitness application or track your personal progress. Secure, fast, and easy to use.",
        "start_building": "Start Building Now",
        "view_docs": "View Documentation",
        "stat_exercises": "Exercises",
        "stat_uptime": "Uptime",
        "stat_response": "Response",

        // Features
        "why_choose": "Why Choose <span class='highlight'>WorkoutAPI</span>?",
        "feature_auth_title": "Secure Authentication",
        "feature_auth_desc": "Industry-standard JWT authentication keeps your user data safe and secure.",
        "feature_fast_title": "Lightning Fast",
        "feature_fast_desc": "Built on Node.js and Express for maximum performance and low latency.",
        "feature_track_title": "Detailed Tracking",
        "feature_track_desc": "Log every set, rep, and weight. Visualize progress over time.",

        // Dashboard Overview
        "total_workouts": "Total Workouts",
        "recent_activity": "Recent Activity",
        "no_recent": "No recent workouts found. Start your journey today!",
        "new_workout": "New Workout",

        // Dashboard Exercises
        "exercises_title": "Exercises",
        "add_exercise": "Add Exercise",
        "filter_muscles": "Filter by Muscle Groups",
        "show_body_map": "Show Body Map",
        "hide_body_map": "Hide Body Map",
        "body_front": "FRONT",
        "body_back": "BACK",
        "body_tip": "Tip: Click on muscles to filter the list",
        "loading_exercises": "Loading exercises...",
        "no_exercises_found": "No exercises found. Add your first one!",

        // Dashboard History
        "history_title": "History & Analytics",
        "past_workouts": "Past Workouts",
        "loading_history": "Loading history...",

        // Modals
        "create_new_routine": "Create New Routine",
        "routine_name": "Routine Name",
        "select_exercises": "Select Exercises",
        "search_by_name": "Search by name...",
        "muscle_group_filter": "Muscle Group Filter",
        "save_routine": "Save Routine",
        "add_new_exercise": "Add New Exercise",
        "edit_exercise": "Edit Exercise",
        "exercise_name": "Exercise Name",
        "target_muscle_group": "Target Muscle Group",
        "secondary_muscles": "Secondary Muscles",
        "update_exercise": "Update Exercise",

        // Muscle Groups
        "muscle_Chest": "Chest",
        "muscle_Back": "Back",
        "muscle_Shoulders": "Shoulders",
        "muscle_Biceps": "Biceps",
        "muscle_Triceps": "Triceps",
        "muscle_Forearms": "Forearms",
        "muscle_Quads": "Quads",
        "muscle_Hamstrings": "Hamstrings",
        "muscle_Glutes": "Glutes",
        "muscle_Calves": "Calves",
        "muscle_Abs": "Abs",
        "muscle_Traps": "Traps",
        "muscle_Lats": "Lats",

        // Auth
        "login_title": "Welcome Back",
        "login_desc": "Enter your credentials to access your fitness dashboard",
        "register_title": "Create Account",
        "register_desc": "Start your fitness journey today",
        "email_label": "Email Address",
        "password_label": "Password",
        "name_label": "Full Name",
        "dont_have_account": "Don't have an account?",
        "already_have_account": "Already have an account?"
    },
    tr: {
        // Nav & General
        "nav_features": "Özellikler",
        "nav_docs": "Dokümanlar",
        "nav_login": "Giriş Yap",
        "nav_get_started": "Başla",
        "nav_logout": "Çıkış Yap",
        "nav_overview": "Genel Bakış",
        "nav_workouts": "Antrenmanlarım",
        "nav_exercises": "Egzersizler",
        "nav_history": "Geçmiş",

        // Hero Section
        "hero_title": "Potansiyelini <br><span class='gradient-text'>Harekete Geçir</span>",
        "hero_subtitle": "Bir sonraki fitness uygulamanızı oluşturmak veya kişisel ilerlemenizi takip etmek için en güçlü ve esnek API. Güvenli, hızlı ve kullanımı kolay.",
        "start_building": "Oluşturmaya Başla",
        "view_docs": "Dokümantasyonu Gör",
        "stat_exercises": "Egzersiz",
        "stat_uptime": "Uptime",
        "stat_response": "Yanıt",

        // Features
        "why_choose": "Neden <span class='highlight'>WorkoutAPI</span>?",
        "feature_auth_title": "Güvenli Kimlik Doğrulama",
        "feature_auth_desc": "Endüstri standardı JWT kimlik doğrulaması, kullanıcı verilerinizi güvenli tutar.",
        "feature_fast_title": "Işık Hızında",
        "feature_fast_desc": "Maksimum performans ve düşük gecikme süresi için Node.js ve Express ile oluşturulmuştur.",
        "feature_track_title": "Detaylı Takip",
        "feature_track_desc": "Her seti, tekrarı ve ağırlığı kaydedin. İlerlemenizi zamanla görselleştirin.",

        // Dashboard Overview
        "total_workouts": "Toplam Antrenman",
        "recent_activity": "Son Aktiviteler",
        "no_recent": "Son aktivite bulunamadı. Bugün yolculuğuna başla!",
        "new_workout": "Yeni Antrenman",

        // Dashboard Exercises
        "exercises_title": "Egzersizler",
        "add_exercise": "Egzersiz Ekle",
        "filter_muscles": "Kas Grubuna Göre Filtrele",
        "show_body_map": "Vücut Haritasını Göster",
        "hide_body_map": "Vücut Haritasını Gizle",
        "body_front": "ÖN",
        "body_back": "ARKA",
        "body_tip": "İpucu: Filtrelemek için kaslara tıklayın",
        "loading_exercises": "Egzersizler yükleniyor...",
        "no_exercises_found": "Egzersiz bulunamadı. İlkini ekleyin!",

        // Dashboard History
        "history_title": "Geçmiş & Analiz",
        "past_workouts": "Geçmiş Antrenmanlar",
        "loading_history": "Geçmiş yükleniyor...",

        // Modals
        "create_new_routine": "Yeni Rutin Oluştur",
        "routine_name": "Rutin Adı",
        "select_exercises": "Egzersiz Seç",
        "search_by_name": "İsimle ara...",
        "muscle_group_filter": "Kas Grubu Filtresi",
        "save_routine": "Rutini Kaydet",
        "add_new_exercise": "Yeni Egzersiz Ekle",
        "edit_exercise": "Egzersizi Düzenle",
        "exercise_name": "Egzersiz Adı",
        "target_muscle_group": "Ana Hedef Bölge",
        "secondary_muscles": "Yan Bölgeler",
        "update_exercise": "Egzersizi Güncelle",

        // Muscle Groups
        "muscle_Chest": "Göğüs",
        "muscle_Back": "Sırt",
        "muscle_Shoulders": "Omuz",
        "muscle_Biceps": "Biceps",
        "muscle_Triceps": "Triceps",
        "muscle_Forearms": "Ön Kol",
        "muscle_Quads": "Ön Bacak",
        "muscle_Hamstrings": "Arka Bacak",
        "muscle_Glutes": "Kalça",
        "muscle_Calves": "Kalf",
        "muscle_Abs": "Karın",
        "muscle_Traps": "Trapez",
        "muscle_Lats": "Kanat",

        // Auth
        "login_title": "Tekrar Hoş Geldiniz",
        "login_desc": "Dashboard'a erişmek için bilgilerinizi girin",
        "register_title": "Hesap Oluştur",
        "register_desc": "Fitness yolculuğuna bugün başla",
        "email_label": "Email Adresi",
        "password_label": "Parola",
        "name_label": "Ad Soyad",
        "dont_have_account": "Hesabınız yok mu?",
        "already_have_account": "Zaten hesabınız var mı?"
    }
};
