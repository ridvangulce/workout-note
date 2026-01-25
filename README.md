# WorkoutNote 🏋️‍♂️

**[English](#english) | [Türkçe](#türkçe)**

---

<a name="english"></a>
## 🇬🇧 English

### Description
**WorkoutNote** is a comprehensive SaaS platform designed for dedicated athletes to track, analyze, and optimize their fitness journey. Moving beyond a simple API, it provides a feature-rich interface for personal workout logging, exercise management with anatomical visualization, and progress analytics.

### Key Features
*   **Intuitive Workout Logging:** Effortlessly log your sets, reps, and weights with a human-centric interface.
*   **Interactive Body Map:** Visualize muscle engagement and filter exercises using an interactive anatomical SVG map.
*   **Progress Analytics:** Track your volume and sets over time with built-in charts and history.
*   **Multi-Language Support:** Full support for both English 🇬🇧 and Turkish 🇹🇷, including dynamic content.
*   **Smart Routines:** Create and manage personalized workout routines for efficient training sessions.
*   **Secure & Private:** Dedicated user profiles with secure JWT-based authentication.

### Technology Stack
*   **Frontend:** Vanilla JS, CSS3, Semantic HTML5
*   **Backend:** Node.js & Express
*   **Database:** PostgreSQL
*   **Authentication:** JWT (JSON Web Tokens) with Cookie support
*   **Visualization:** Chart.js, Interactive SVG Map

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
    PORT=3000
    DB_HOST=localhost
    DB_USER=your_user
    DB_PASSWORD=your_password
    DB_NAME=workout_db
    JWT_SECRET=your_secret_key
    ```

4.  **Run the application:**
    ```bash
    npm run dev
    ```

---

<a name="türkçe"></a>
## 🇹🇷 Türkçe

### Proje Tanımı
**WorkoutNote**, tutkulu sporcuların fitness yolculuklarını takip etmeleri, analiz etmeleri ve optimize etmeleri için tasarlanmış kapsamlı bir SaaS platformudur. Basit bir API'nin ötesine geçerek; kişisel antrenman kaydı, anatomik görselleştirmeli egzersiz yönetimi ve gelişim analizi için zengin özelliklere sahip bir arayüz sunar.

### Temel Özellikler
*   **Sezgisel Antrenman Kaydı:** Setlerinizi, tekrarlarınızı ve ağırlıklarınızı insan odaklı bir arayüzle zahmetsizce kaydedin.
*   **Etkileşimli Vücut Haritası:** Etkileşimli anatomik SVG haritası ile kas katılımını görselleştirin ve egzersizleri filtreleyin.
*   **Gelişim Analizi:** Dahili grafikler ve geçmişle hacim ve set sayınızı zaman içinde takip edin.
*   **Çoklu Dil Desteği:** Dinamik içerik dahil olmak üzere hem İngilizce 🇬🇧 hem de Türkçe 🇹🇷 için tam destek.
*   **Akıllı Rutinler:** Verimli antrenman seansları için kişiselleştirilmiş rutinler oluşturun ve yönetin.
*   **Güvenli ve Özel:** Güvenli JWT tabanlı kimlik doğrulama ile kişisel kullanıcı profilleri.

### Teknoloji Yığını
*   **Frontend:** Vanilla JS, CSS3, Semantik HTML5
*   **Backend:** Node.js & Express
*   **Database:** PostgreSQL
*   **Kimlik Doğrulama:** JWT (JSON Web Tokens), Çerez desteği ile
*   **Görselleştirme:** Chart.js, Etkileşimli SVG Haritası

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
    PORT=3000
    DB_HOST=localhost
    DB_USER=kullanici_adiniz
    DB_PASSWORD=sifreniz
    DB_NAME=workout_db
    JWT_SECRET=gizli_anahtariniz
    ```

4.  **Uygulamayı çalıştırın:**
    ```bash
    npm run dev
    ```
