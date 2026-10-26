# Ders Veri Merkezi ve Doküman Yönetim Sistemi - API Dokümantasyonu

**Geliştirici & Sistem Mimarı:** Burak
**Sorumluluk Alanı:** Backend, Veritabanı Mimarisi ve API Servisleri

---

## 1. Kimlik Doğrulama (Auth) Servisleri

### Kullanıcı Kaydı (`POST /register`)
* **Açıklama:** Sisteme yeni kullanıcı kaydeder. Şifreler `bcryptjs` ile hash'lenir.
* **Body:**
  ```json
  {
    "name": "Mesut TOĞAÇAR",
    "email": "mesut.togacar@example.com",
    "password": "123",
    "role": "ACADEMICIAN"
  }