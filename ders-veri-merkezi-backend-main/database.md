# Veritabanı Şeması Taslağı

### 1. Users (Kullanıcılar)
- id (PK)
- name
- email
- password_hash
- role (ADMIN, ACADEMICIAN, STUDENT)
- created_at

### 2. Courses (Dersler)
- id (PK)
- course_code (Örn: YBS305)
- course_name
- academician_id (FK -> Users)

### 3. Documents (Dokümanlar)
- id (PK)
- title
- file_url
- file_type (PDF, DOCX, ZIP)
- course_id (FK -> Courses)
- uploaded_by (FK -> Users)

### 4. AccessLogs (Erişim Logları)
- id (PK)
- document_id (FK -> Documents)
- source (WEB, MOBILE, WHATSAPP_BOT)
- downloaded_at
-