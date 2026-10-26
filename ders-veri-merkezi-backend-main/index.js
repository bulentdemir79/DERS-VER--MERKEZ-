const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const prisma = new PrismaClient();

const JWT_SECRET = "gizli-anahtar-123";

app.use(cors());
app.use(express.json());

// Token Doğrulama Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: "Erişim reddedildi, token bulunamadı" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Geçersiz veya süresi dolmuş token" });
    }
    req.user = user;
    next();
  });
};

// Test Rotası
app.get('/', (req, res) => {
  res.json({ message: 'Ders Veri Merkezi Backend Çalışıyor!' });
});

// Tüm kullanıcıları getiren rota
app.get('/users', async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

// Kullanıcı Kayıt Rotası
app.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password_hash: hashedPassword,
        role: role || "STUDENT"
      },
    });

    res.json({ message: "Kullanıcı başarıyla oluşturuldu", userId: newUser.id });
  } catch (error) {
    console.error("HATA DETAYI:", error);
    res.status(400).json({ 
      error: "Kullanıcı oluşturulurken bir hata oluştu", 
      details: error.message 
    });
  }
});

// Kullanıcı Giriş Rotası
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(404).json({ error: "Kullanıcı bulunamadı" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Hatalı şifre" });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ 
      message: "Giriş başarılı", 
      token: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      } 
    });
  } catch (error) {
    res.status(500).json({ error: "Giriş yapılırken bir sunucu hatası oluştu" });
  }
});

// Korumalı Profil Rotası
app.get('/profile', authenticateToken, async (req, res) => {
  res.json({
    message: "Gizli profil alanına erişim sağlandı!",
    user: req.user
  });
});

// ==========================================
// DERS YÖNETİMİ ROTALARI (COURSES)
// ==========================================

// 1. Tüm Dersleri Listeleme
app.get('/courses', async (req, res) => {
  try {
    const courses = await prisma.course.findMany({
      include: { academician: true, documents: true }
    });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: "Dersler getirilirken hata oluştu", details: error.message });
  }
});

// 2. Yeni Ders Ekleme
app.post('/courses', authenticateToken, async (req, res) => {
  const { code, name } = req.body;

  try {
    const newCourse = await prisma.course.create({
      data: {
        course_code: code,
        course_name: name,
        academician: {
          connect: { id: req.user.userId }
        }
      }
    });

    res.json({ message: "Ders başarıyla oluşturuldu", course: newCourse });
  } catch (error) {
    console.error("DERS EKLEME HATASI:", error);
    res.status(400).json({ error: "Ders eklenirken bir hata oluştu", details: error.message });
  }
});

// 3. Ders Silme (YENİ)
app.delete('/courses/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.course.delete({
      where: { id: parseInt(id) }
    });
    res.json({ message: "Ders başarıyla silindi" });
  } catch (error) {
    res.status(400).json({ error: "Ders silinirken hata oluştu", details: error.message });
  }
});

// ==========================================
// DOKÜMAN YÖNETİMİ ROTALARI (DOCUMENTS)
// ==========================================

// 1. Tüm Dokümanları Listeleme
app.get('/documents', async (req, res) => {
  try {
    const documents = await prisma.document.findMany({
      include: { course: true, uploader: true }
    });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: "Dokümanlar getirilirken hata oluştu", details: error.message });
  }
});

// 2. Bir Derse Yeni Doküman Ekleme
app.post('/documents', authenticateToken, async (req, res) => {
  const { title, file_url, file_type, course_id } = req.body;

  try {
    const newDocument = await prisma.document.create({
      data: {
        title,
        file_url,
        file_type: file_type || "PDF",
        course: { connect: { id: parseInt(course_id) } },
        uploader: { connect: { id: req.user.userId } }
      }
    });

    res.json({ message: "Doküman başarıyla eklendi", document: newDocument });
  } catch (error) {
    console.error("DOKÜMAN EKLEME HATASI:", error);
    res.status(400).json({ error: "Doküman eklenirken bir hata oluştu", details: error.message });
  }
});

// 3. Doküman Silme (YENİ)
app.delete('/documents/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.document.delete({
      where: { id: parseInt(id) }
    });
    res.json({ message: "Doküman başarıyla silindi" });
  } catch (error) {
    res.status(400).json({ error: "Doküman silinirken hata oluştu", details: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda başarıyla başlatıldı.`);
});