# Workout API

**[English](#english) | [Türkçe](#türkçe)**

---

<a name="english"></a>
## 🇬🇧 English

### Description
**Workout API** is a RESTful API designed to manage workout routines, exercises, and sets. It provides a backend solution for fitness applications, enabling users to create workouts, log exercises, and track their progress.

### Features
*   **Authentication & Authorization:** Secure user registration and login using JWT (JSON Web Tokens). Global error handling and logging.
*   **Workouts Management:** Create, read, update, and delete workout sessions.
*   **Exercise Tracking:** Add exercises to workouts and manage their details.
*   **Set Logging:** Log specific sets (reps, weight) for each exercise.
*   **Health Check:** Endpoint to verify API status.

### Technology Stack
*   **Runtime:** [Node.js](https://nodejs.org/)
*   **Framework:** [Express](https://expressjs.com/)
*   **Database:** [PostgreSQL](https://www.postgresql.org/)
*   **Database Driver:** [pg](https://node-postgres.com/)
*   **Authentication:** `jsonwebtoken`, `bcrypt`, `cookie-parser`
*   **Utilities:** `dotenv` for configuration, `nodemon` for development.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd workout-api
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configuration:**
    Create a `.env` file in the root directory and add the necessary environment variables (e.g., PORT, DATABASE_URL, JWT_SECRET).

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

### API Endpoints Overview
*   **Auth:** `/auth` (Login, Register)
*   **Workouts:** `/api/workouts`
*   **Exercises:** `/api/exercises`
*   **Sets:** `/api/sets`
*   **Health:** `/health`

---

<a name="türkçe"></a>
## 🇹🇷 Türkçe

### Proje Tanımı
**Workout API**, antrenman programlarını, egzersizleri ve setleri yönetmek için tasarlanmış bir RESTful API'dir. Fitness uygulamaları için bir arka uç çözümü sunarak kullanıcıların antrenman oluşturmasına, egzersizleri kaydetmesine ve ilerlemelerini takip etmesine olanak tanır.

### Özellikler
*   **Kimlik Doğrulama ve Yetkilendirme:** JWT (JSON Web Token) kullanarak güvenli kullanıcı kaydı ve girişi.
*   **Antrenman Yönetimi:** Antrenman oturumlarını oluşturma, görüntüleme, güncelleme ve silme.
*   **Egzersiz Takibi:** Antrenmanlara egzersiz ekleme ve detaylarını yönetme.
*   **Set Kaydı:** Her egzersiz için özel setleri (tekrar, ağırlık) kaydetme.
*   **Sağlık Kontrolü:** API durumunu kontrol etmek için endpoint.

### Teknoloji Yığını
*   **Çalışma Zamanı:** [Node.js](https://nodejs.org/)
*   **Framework:** [Express](https://expressjs.com/)
*   **Veritabanı:** [PostgreSQL](https://www.postgresql.org/)
*   **Veritabanı Sürücüsü:** [pg](https://node-postgres.com/)
*   **Kimlik Doğrulama:** `jsonwebtoken`, `bcrypt`, `cookie-parser`
*   **Araçlar:** Yapılandırma için `dotenv`, geliştirme için `nodemon`.

### Kurulum

1.  **Depoyu klonlayın:**
    ```bash
    git clone <depo-url>
    cd workout-api
    ```

2.  **Bağımlılıkları yükleyin:**
    ```bash
    npm install
    ```

3.  **Yapılandırma:**
    Kök dizinde bir `.env` dosyası oluşturun ve gerekli ortam değişkenlerini ekleyin (örn. PORT, DATABASE_URL, JWT_SECRET).

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

### API Uç Noktaları (Endpoints)
*   **Yetkilendirme:** `/auth` (Giriş, Kayıt)
*   **Antrenmanlar:** `/api/workouts`
*   **Egzersizler:** `/api/exercises`
*   **Setler:** `/api/sets`
*   **Sağlık:** `/health`
