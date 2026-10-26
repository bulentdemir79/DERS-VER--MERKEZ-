import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, Alert, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { API_URL } from '@/constants/api';

interface DocumentDetail {
  id: number;
  title: string;
  file_type: string;
  file_path: string;
  created_at?: string;
  course?: {
    course_code: string;
    course_name: string;
  };
}

export default function DocumentDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [doc, setDoc] = useState<DocumentDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/documents/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Doküman detayları alınamadı.');
        return res.json();
      })
      .then((data) => setDoc(data))
      .catch((err) => Alert.alert('Hata', err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleOpenLink = (url: string) => {
    Linking.openURL(url).catch(() => Alert.alert('Hata', 'Dosya açılamadı.'));
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (!doc) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Doküman bulunamadı.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.card}>
        <Text style={styles.badge}>{doc.file_type}</Text>
        <Text style={styles.title}>{doc.title}</Text>
        
        {doc.course && (
          <Text style={styles.courseText}>
            {doc.course.course_code} - {doc.course.course_name}
          </Text>
        )}

        <Text style={styles.dateText}>Yüklenme Tarihi: {doc.created_at?.slice(0, 10)}</Text>

        <TouchableOpacity 
          style={styles.downloadButton} 
          onPress={() => handleOpenLink(`${API_URL}/uploads/${doc.file_path}`)}
        >
          <Text style={styles.downloadButtonText}>Dosyayı Aç / İndir</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Geri Dön</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', padding: 20, justifyContent: 'center' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: { backgroundColor: '#ffffff', padding: 24, borderRadius: 16, borderWidth: 1, borderColor: '#e2e8f0' },
  badge: { alignSelf: 'flex-start', backgroundColor: '#eff6ff', color: '#2563eb', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, fontWeight: 'bold', fontSize: 12, marginBottom: 12 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#1e293b', marginBottom: 8 },
  courseText: { fontSize: 14, color: '#475569', marginBottom: 4 },
  dateText: { fontSize: 12, color: '#94a3b8', marginBottom: 24 },
  downloadButton: { backgroundColor: '#2563eb', padding: 14, borderRadius: 10, alignItems: 'center', marginBottom: 12 },
  downloadButtonText: { color: '#ffffff', fontWeight: 'bold', fontSize: 15 },
  backButton: { backgroundColor: '#f1f5f9', padding: 14, borderRadius: 10, alignItems: 'center' },
  backButtonText: { color: '#475569', fontWeight: 'bold', fontSize: 15 },
  errorText: { color: '#dc2626', fontSize: 16, fontWeight: 'bold' },
});