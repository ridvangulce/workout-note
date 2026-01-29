# WorkoutNote 🏋️‍♂️

**[English](#english) | [Türkçe](#türkçe)**

---

<a name="english"></a>
## 🇬🇧 English

### Description
**WorkoutNote** is a comprehensive SaaS platform designed for dedicated athletes to track, analyze, and optimize their fitness journey. Moving beyond a simple API, it provides a feature-rich interface for personal workout logging, exercise management with anatomical visualization, and progress analytics.

### Key Features
*   **Intuitive Workout Logging:** Effortlessly log your sets, reps, and weights with a human-centric interface.
*   **AI-Powered Nutrition Tracking:** Analyze your meals with Google Gemini AI. Just describe your meal (e.g., "2 eggs and toast"), and get instant, accurate nutritional breakdowns (calories, protein, carbs, fat).
*   **Smart Meal Analysis:** Includes a consistency engine (Zero-Temperature AI) to ensure identical inputs always yield consistent results using standard nutritional databases.
*   **Advanced Analytics:**
    *   **Workout:** Track volume and sets over time.
    *   **Nutrition:** Visualize daily, weekly, and custom date range intake with interactive charts.
*   **Interactive Body Map:** Visualize muscle engagement and filter exercises using an interactive anatomical SVG map.
*   **Mobile-First Design:** Fully responsive UI with specific enhancements for mobile users (hamburger menu, stacked layouts, slide-out dashboards).
*   **Multi-Language Support:** Full support for both English 🇬🇧 and Turkish 🇹🇷, including dynamic content and validation messages.
*   **Smart Routines:** Create and manage personalized workout routines.
*   **Secure & Private:** Dedicated user profiles with secure JWT-based authentication.
*   **AI Personal Trainer:** 🧠 Analyze your past workout logs with Gemini 2.0 Flash. Get personalized feedback, RPE analysis, and actionable advice to optimize your training.
*   **YouTube Integration:** 🎥 Add video demonstrations to exercises. Preview videos directly within the app for better form guidance.
*   **Settings & Health Profile:**
    *   **Automatic Calculation:** Profile-based (height, weight, age) BMR and TDEE calculation (Mifflin-St Jeor).
    *   **Goal Setting:** Personalized daily calorie and macro goals.
    *   **Real-time Tracking:** Dynamic progress bars and daily summary.

### Technology Stack
*   **Frontend:** Vanilla JS, CSS3 (Custom Properties), Semantic HTML5
*   **Backend:** Node.js & Express
*   **AI Integration:** Google Gemini API (Flash 2.0 Model)
*   **Database:** PostgreSQL (with Supabase support)
*   **Authentication:** JWT (JSON Web Tokens) with Cookie support
*   **Visualization:** Chart.js, Interactive SVG Map
*   **UI Components:** Flatpickr (Date Ranges), Custom Modals

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/ridvangulce/workout-note.git
    cd workout-note
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configuration:**
    Create a `.env` file in the root directory:
    ```env
    PORT=8080
    DATABASE_URL=postgresql://user:password@host:port/database
    JWT_SECRET=your_secret_key
    GEMINI_API_KEY=your_google_gemini_api_key

    # Email Configuration (Required for Password Reset)
    EMAIL_USER=your-email@gmail.com
    EMAIL_PASSWORD=your-app-password  # Gmail App Password (16 chars)
    EMAIL_FROM=noreply@workoutnote.com
    FRONTEND_URL=http://localhost:8080

    NODE_ENV=production  # Optional, auto-detects SSL for remote databases
    ```

4.  **Run the application:**
    ```bash
    npm run dev
    ```

### Security Features
*   **JWT Authentication** - Secure token-based authentication
*   **Rate Limiting** - Protects endpoints from abuse:
    *   Login: 5 attempts per 15 minutes
    *   Registration: 3 attempts per hour
    *   Password changes: 3 attempts per hour
*   **Input Validation** - Comprehensive validation rules:
    *   Email format validation (RFC 5322)
    *   Strong password requirements (min 8 chars, uppercase, lowercase, number, special char)
    *   Input sanitization to prevent XSS attacks
*   **SQL Injection Protection** - Parameterized queries throughout
*   **SSL/TLS Support** - Automatic SSL configuration for production databases
*   **Forgot Password Security:**
    *   256-bit crypto-random tokens
    *   1-hour token expiration
    *   One-time use tokens (prevent replay attacks)
    *   No user enumeration (consistent response times)

### Testing

Comprehensive test suite with Jest and Supertest covering authentication and validation.

**Run Tests:**
```bash
npm test                 # Run all tests
npm run test:watch       # Watch mode
npm run test:coverage    # Coverage report
```

**Test Results:**
```
✅ 12/12 tests passing (100%)
⚡ 1.4s execution time
📊 42% code coverage
```

**Coverage:**
- Authentication endpoints: 87%
- Validation middleware: 100%
- Rate limiting: 100%
- Overall: 42% (target: 70% - work in progress)

**Test Suites:**
- Integration Tests: Auth registration, login, validation
- Unit Tests: Middleware validation, error formatting

---

<a name="türkçe"></a>
## 🇹🇷 Türkçe

### Proje Tanımı
**WorkoutNote**, tutkulu sporcuların fitness yolculuklarını takip etmeleri, analiz etmeleri ve optimize etmeleri için tasarlanmış kapsamlı bir SaaS platformudur. Basit bir API'nin ötesine geçerek; kişisel antrenman kaydı, anatomik görselleştirmeli egzersiz yönetimi ve gelişim analizi için zengin özelliklere sahip bir arayüz sunar.

### Temel Özellikler
*   **Sezgisel Antrenman Kaydı:** Setlerinizi, tekrarlarınızı ve ağırlıklarınızı insan odaklı bir arayüzle zahmetsizce kaydedin.
*   **Yapay Zeka Destekli Beslenme Takibi:** Öğünlerinizi Google Gemini AI ile analiz edin. Sadece yemeğinizi tanımlayın (örn: "2 yumurta ve tost"), anında ve doğru besin değerlerini (kalori, protein, karbonhidrat, yağ) alın.
*   **Akıllı Öğün Analizi:** Standart besin veritabanlarını kullanarak aynı girdilerin her zaman tutarlı sonuçlar vermesini sağlayan bir tutarlılık motoru (Sıfır Hata Payı AI) içerir.
*   **Gelişmiş Analizler:**
    *   **Antrenman:** Hacim ve set sayınızı zaman içinde takip edin.
    *   **Beslenme:** Etkileşimli grafiklerle günlük, haftalık ve özel tarih aralığındaki alımınızı görselleştirin.
*   **Etkileşimli Vücut Haritası:** Etkileşimli anatomik SVG haritası ile kas katılımını görselleştirin ve egzersizleri filtreleyin.
*   **Mobil Öncelikli Tasarım:** Mobil kullanıcılar için özel iyileştirmeler (hamburger menü, dikey yerleşimler, kayan paneller) içeren tam duyarlı arayüz.
*   **Çoklu Dil Desteği:** Dinamik içerik ve doğrulama mesajları dahil olmak üzere hem İngilizce 🇬🇧 hem de Türkçe 🇹🇷 için tam destek.
*   **Akıllı Rutinler:** Kişiselleştirilmiş antrenman rutinleri oluşturun ve yönetin.
*   **Güvenli ve Özel:** Güvenli JWT tabanlı kimlik doğrulama ile kişisel kullanıcı profilleri.
*   **AI Kişisel Antrenör:** 🧠 Geçmiş antrenman loglarınızı Gemini 2.0 Flash ile analiz edin. Antrenmanınızı optimize etmek için kişiselleştirilmiş geri bildirimler, RPE analizi ve uygulanabilir tavsiyeler alın.
*   **YouTube Entegrasyonu:** 🎥 Egzersizlere video gösterimleri ekleyin. Daha iyi form rehberliği için videoları doğrudan uygulama içinde önizleyin.
*   **Sağlık Profili ve Beslenme Entegrasyonu:**
    *   **Otomatik Hesaplama:** Profil bazlı (boy, kilo, yaş) BMR ve TDEE hesaplaması (Mifflin-St Jeor).
    *   **Hedef Belirleme:** Kişiselleştirilmiş günlük kalori ve makro hedefleri.
    *   **Gerçek Zamanlı Takip:** Dinamik ilerleme çubukları ve günlük özet.

### Teknoloji Yığını
*   **Frontend:** Vanilla JS, CSS3 (Custom Properties), Semantik HTML5
*   **Backend:** Node.js & Express
*   **Yapay Zeka Entegrasyonu:** Google Gemini API (Flash 2.0 Model)
*   **Database:** PostgreSQL (Supabase desteği ile)
*   **Kimlik Doğrulama:** JWT (JSON Web Tokens), Çerez desteği ile
*   **Görselleştirme:** Chart.js, Etkileşimli SVG Haritası
*   **Arayüz Bileşenleri:** Flatpickr (Tarih Aralıkları), Özel Modallar

### Kurulum

1.  **Depoyu klonlayın:**
    ```bash
    git clone https://github.com/ridvangulce/workout-note.git
    cd workout-note
    ```

2.  **Bağımlılıkları yükleyin:**
    ```bash
    npm install
    ```

3.  **Yapılandırma:**
    Kök dizinde bir `.env` dosyası oluşturun:
    ```env
    PORT=8080
    DATABASE_URL=postgresql://kullanici:sifre@host:port/veritabani
    JWT_SECRET=gizli_anahtariniz
    GEMINI_API_KEY=google_gemini_api_anahtariniz

    # E-posta Yapılandırması (Şifre Sıfırlama için Gerekli)
    EMAIL_USER=eposta@gmail.com
    EMAIL_PASSWORD=uygulama-sifresi  # Gmail Uygulama Şifresi (16 karakter)
    EMAIL_FROM=noreply@workoutnote.com
    FRONTEND_URL=http://localhost:8080

    NODE_ENV=production  # Opsiyonel, uzak veritabanları için SSL'i otomatik algılar
    ```

4.  **Uygulamayı çalıştırın:**
    ```bash
    npm run dev
    ```

### Güvenlik Özellikleri
*   **JWT Kimlik Doğrulama** - Güvenli token tabanlı doğrulama
*   **Hız Sınırlama** - Uç noktaları kötüye kullanıma karşı korur:
    *   Giriş: 15 dakikada 5 deneme
    *   Kayıt: Saatte 3 deneme
    *   Şifre değişiklikleri: Saatte 3 deneme
*   **Girdi Doğrulama** - Kapsamlı doğrulama kuralları:
    *   E-posta format doğrulama (RFC 5322)
    *   Güçlü şifre gereksinimleri (min 8 karakter, büyük/küçük harf, sayı, özel karakter)
    *   XSS saldırılarını önlemek için girdi temizleme
*   **SQL Enjeksiyon Koruması** - Parametreli sorgular
*   **SSL/TLS Desteği** - Production veritabanları için otomatik SSL yapılandırması
*   **Şifre Sıfırlama Güvenliği:**
    *   256-bit kripto-rastgele tokenlar
    *   1 saatlik token süresi
    *   Tek kullanımlık tokenlar (tekrar saldırılarını önler)
    *   Kullanıcı sıralama koruması (tutarlı yanıt süreleri)

### Testler

Jest ve Supertest ile kimlik doğrulama ve validasyon testlerini kapsayan kapsamlı test paketi.

**Testleri Çalıştırma:**
```bash
npm test                 # Tüm testleri çalıştır
npm run test:watch       # İzleme modu
npm run test:coverage    # Kapsam raporu
```

**Test Sonuçları:**
```
✅ 12/12 test geçiyor (100%)
⚡ 1.4s çalışma süresi
📊 %42 kod kapsama
```

**Kapsam:**
- Kimlik doğrulama uç noktaları: %87
- Doğrulama middleware: %100
- Hız sınırlama: %100
- Genel: %42 (hedef: %70 - devam ediyor)

**Test Paketleri:**
- Entegrasyon Testleri: Kayıt, giriş, doğrulama
- Birim Testleri: Middleware doğrulama, hata biçimlendirme
