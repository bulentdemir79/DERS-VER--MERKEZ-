import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { API_URL } from '@/constants/api';

interface Course {
  id: number;
  code: string;
  name: string;
  instructor: string;
  docCount: number;
}

interface DocumentItem {
  id: number;
  title: string;
  type: string;
  course: string;
  date: string;
}

interface SunucuDersi {
  id: number;
  course_code: string;
  course_name: string;
  academician?: { name: string } | null;
  documents?: unknown[];
}

interface SunucuDokuman {
  id: number;
  title: string;
  file_type: string;
  created_at?: string;
  course?: { course_code: string; course_name: string } | null;
}

async function getir<T>(yol: string): Promise<T> {
  const kontrol = new AbortController();
  const zamanAsimi = setTimeout(() => kontrol.abort(), 8000);
  try {
    const res = await fetch(`${API_URL}${yol}`, { signal: kontrol.signal });
    if (!res.ok) throw new Error('Sunucu hata döndürdü.');
    return (await res.json()) as T;
  } finally {
    clearTimeout(zamanAsimi);
  }
}

export default function HomeScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'dersler' | 'dokumanlar' | 'duyurular'>('dersler');
  const [courses, setCourses] = useState<Course[]>([]);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [dersler, dokumanlar] = await Promise.all([
        getir<SunucuDersi[]>('/courses'),
        getir<SunucuDokuman[]>('/documents'),
      ]);

      setCourses(
        dersler.map((c) => ({
          id: c.id,
          code: c.course_code,
          name: c.course_name,
          instructor: c.academician?.name ?? 'Akademisyen belirtilmemiş',
          docCount: c.documents?.length ?? 0,
        }))
      );

      setDocuments(
        dokumanlar
          .map((d) => ({
            id: d.id,
            title: d.title,
            type: d.file_type,
            course: d.course ? `${d.course.course_code} - ${d.course.course_name}` : '—',
            date: d.created_at ? d.created_at.slice(0, 10) : '',
          }))
          .reverse()
      );
    } catch (err) {
      console.log('API Veri Çekme Hatası:', err);
      setError('Sunucuya ulaşılamadı. Backend açık mı ve adres doğru mu?');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Üst Başlık */}
      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          <View>
            <Text style={styles.headerTitle}>Ders Veri Merkezi</Text>
            <Text style={styles.headerSubtitle}>Mobil Portal (Canlı API)</Text>
          </View>
          <TouchableOpacity style={styles.loginButton} onPress={() => router.push('/login')}>
            <Text style={styles.loginButtonText}>Giriş Yap</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Yükleniyor / Hata / İçerik */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={styles.loadingText}>Veritabanından veriler yükleniyor...</Text>
        </View>
      ) : error ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Text style={styles.errorHint}>Denenen adres: {API_URL}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchData}>
            <Text style={styles.retryText}>Tekrar Dene</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView style={styles.content}>
          {activeTab === 'dersler' && (
            <View>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionTitle}>Dersler ({courses.length})</Text>
                <TouchableOpacity style={styles.addButton} onPress={() => router.push('/course/create')}>
                  <Text style={styles.addButtonText}>+ Yeni Ders</Text>
                </TouchableOpacity>
              </View>

              {courses.length === 0 && <Text style={styles.emptyText}>Henüz tanımlı bir ders yok.</Text>}
              {courses.map((course) => (
                <View key={course.id} style={styles.card}>
                  <View style={styles.cardHeader}>
                    <View style={styles.codeBadge}>
                      <Text style={styles.codeBadgeText}>{course.code}</Text>
                    </View>
                    <View style={styles.countBadge}>
                      <Text style={styles.countBadgeText}>{course.docCount} Doküman</Text>
                    </View>
                  </View>
                  <Text style={styles.cardTitle}>{course.name}</Text>
                  <Text style={styles.cardSubtitle}>{course.instructor}</Text>
                </View>
              ))}
            </View>
          )}

          {activeTab === 'dokumanlar' && (
            <View>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionTitle}>Dokümanlar ({documents.length})</Text>
                <TouchableOpacity style={styles.addButton} onPress={() => router.push('/document/create')}>
                  <Text style={styles.addButtonText}>+ Yeni Doküman</Text>
                </TouchableOpacity>
              </View>

              {documents.length === 0 && <Text style={styles.emptyText}>Henüz yüklenmiş doküman yok.</Text>}
              {documents.map((doc) => (
                <TouchableOpacity 
                  key={doc.id} 
                  style={styles.docCard}
                  onPress={() => router.push(`/document/${doc.id}` as any)}
                >
                  <View style={styles.docInfo}>
                    <Text style={styles.docTitle}>{doc.title}</Text>
                    <Text style={styles.docMeta}>
                      {doc.course}
                      {doc.date ? ` • ${doc.date}` : ''}
                    </Text>
                  </View>
                  <View style={styles.versionBadge}>
                    <Text style={styles.versionText}>{doc.type}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {activeTab === 'duyurular' && (
            <View>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionTitle}>Duyurular</Text>
                <TouchableOpacity style={styles.addButton} onPress={() => router.push('/announcement/create')}>
                  <Text style={styles.addButtonText}>+ Yeni Duyuru</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.card}>
                <Text style={styles.cardTitle}>Sistem Duyuruları</Text>
                <Text style={styles.cardSubtitle}>Genel Duyuru Akışı</Text>
                <Text style={[styles.docMeta, { marginTop: 8 }]}>
                  Akademisyenlerin ve temsilcilerin yayınladığı tüm duyurular burada listelenir.
                </Text>
              </View>
            </View>
          )}
        </ScrollView>
      )}

      {/* Alt Menü */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'dersler' && styles.activeTab]}
          onPress={() => setActiveTab('dersler')}
        >
          <Text style={[styles.tabText, activeTab === 'dersler' && styles.activeTabText]}>Dersler</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'dokumanlar' && styles.activeTab]}
          onPress={() => setActiveTab('dokumanlar')}
        >
          <Text style={[styles.tabText, activeTab === 'dokumanlar' && styles.activeTabText]}>Dokümanlar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'duyurular' && styles.activeTab]}
          onPress={() => setActiveTab('duyurular')}
        >
          <Text style={[styles.tabText, activeTab === 'duyurular' && styles.activeTabText]}>Duyurular</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { padding: 16, backgroundColor: '#ffffff', borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  headerTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#0f172a' },
  headerSubtitle: { fontSize: 12, color: '#64748b', marginTop: 2 },
  loginButton: { backgroundColor: '#1e1b4b', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  loginButtonText: { color: '#ffffff', fontSize: 12, fontWeight: 'bold' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  loadingText: { marginTop: 12, color: '#64748b', fontSize: 14 },
  errorText: { color: '#dc2626', fontSize: 15, fontWeight: '600', textAlign: 'center' },
  errorHint: { color: '#94a3b8', fontSize: 12, marginTop: 8, textAlign: 'center' },
  retryButton: { marginTop: 16, backgroundColor: '#2563eb', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10 },
  retryText: { color: '#ffffff', fontWeight: 'bold', fontSize: 14 },
  emptyText: { color: '#94a3b8', fontSize: 14, textAlign: 'center', marginTop: 24 },
  content: { flex: 1, padding: 16 },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#334155' },
  addButton: { backgroundColor: '#10b981', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  addButtonText: { color: '#ffffff', fontSize: 12, fontWeight: 'bold' },
  card: { backgroundColor: '#ffffff', padding: 16, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: '#e2e8f0' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  codeBadge: { backgroundColor: '#eff6ff', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  codeBadgeText: { color: '#2563eb', fontWeight: 'bold', fontSize: 12 },
  countBadge: { backgroundColor: '#f1f5f9', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  countBadgeText: { color: '#475569', fontWeight: 'bold', fontSize: 11 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#1e293b' },
  cardSubtitle: { fontSize: 13, color: '#64748b', marginTop: 4 },
  docCard: { backgroundColor: '#ffffff', padding: 16, borderRadius: 12, marginBottom: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: '#e2e8f0' },
  docInfo: { flex: 1, marginRight: 8 },
  docTitle: { fontSize: 14, fontWeight: '600', color: '#1e293b' },
  docMeta: { fontSize: 12, color: '#94a3b8', marginTop: 4 },
  versionBadge: { backgroundColor: '#f1f5f9', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  versionText: { fontSize: 12, fontWeight: 'bold', color: '#475569' },
  tabBar: { flexDirection: 'row', backgroundColor: '#ffffff', borderTopWidth: 1, borderTopColor: '#e2e8f0', paddingVertical: 8, paddingHorizontal: 16 },
  tabItem: { flex: 1, alignItems: 'center', paddingVertical: 8, borderRadius: 8 },
  activeTab: { backgroundColor: '#eff6ff' },
  tabText: { fontSize: 13, color: '#64748b', fontWeight: '500' },
  activeTabText: { color: '#2563eb', fontWeight: 'bold' },
});