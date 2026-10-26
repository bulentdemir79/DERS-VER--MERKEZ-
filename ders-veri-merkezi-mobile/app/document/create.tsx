import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { API_URL } from '@/constants/api';

export default function CreateDocumentScreen() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [fileType, setFileType] = useState('');
  const [courseId, setCourseId] = useState('');
  const [filePath, setFilePath] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title || !fileType || !courseId || !filePath) {
      Alert.alert('Eksik Alan', 'Lütfen tüm alanları eksiksiz doldurun.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/documents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          file_type: fileType,
          course_id: Number(courseId),
          file_path: filePath,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Doküman eklenemedi.');
      }

      Alert.alert('Başarılı', 'Doküman başarıyla yüklendi!', [
        { text: 'Tamam', onPress: () => router.back() }
      ]);
    } catch (err: any) {
      Alert.alert('Hata', err.message || 'Sunucuya bağlanılamadı.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.card}>
          <Text style={styles.title}>Yeni Doküman Ekle</Text>
          <Text style={styles.subtitle}>Mobilden Veri Merkezi Paneli</Text>

          <Text style={styles.label}>Doküman Başlığı</Text>
          <TextInput
            style={styles.input}
            placeholder="Örn: 1. Hafta Ders Notları"
            placeholderTextColor="#94a3b8"
            value={title}
            onChangeText={setTitle}
          />

          <Text style={styles.label}>Dosya Türü (Uzantı)</Text>
          <TextInput
            style={styles.input}
            placeholder="Örn: PDF, DOCX, ZIP"
            placeholderTextColor="#94a3b8"
            value={fileType}
            onChangeText={setFileType}
            autoCapitalize="characters"
          />

          <Text style={styles.label}>Ders ID</Text>
          <TextInput
            style={styles.input}
            placeholder="Örn: 1"
            placeholderTextColor="#94a3b8"
            value={courseId}
            onChangeText={setCourseId}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Dosya Yolu / Adı</Text>
          <TextInput
            style={styles.input}
            placeholder="Örn: ders-notu-1.pdf"
            placeholderTextColor="#94a3b8"
            value={filePath}
            onChangeText={setFilePath}
            autoCapitalize="none"
          />

          <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.buttonText}>Dokümanı Kaydet</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>İptal / Geri Dön</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  scrollContainer: { padding: 20, justifyContent: 'center', flexGrow: 1 },
  card: { backgroundColor: '#ffffff', padding: 24, borderRadius: 16, borderWidth: 1, borderColor: '#e2e8f0', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 3 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#0f172a', textAlign: 'center' },
  subtitle: { fontSize: 13, color: '#64748b', textAlign: 'center', marginBottom: 20, marginTop: 4 },
  label: { fontSize: 13, fontWeight: '600', color: '#334155', marginBottom: 6 },
  input: { backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0', padding: 12, borderRadius: 10, marginBottom: 16, fontSize: 14, color: '#1e293b' },
  button: { backgroundColor: '#2563eb', padding: 14, borderRadius: 10, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#ffffff', fontWeight: 'bold', fontSize: 15 },
  backButton: { backgroundColor: '#f1f5f9', padding: 14, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  backButtonText: { color: '#475569', fontWeight: 'bold', fontSize: 15 },
});