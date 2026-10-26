import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { API_URL } from '@/constants/api';

export default function CreateCourseScreen() {
  const router = useRouter();
  const [courseCode, setCourseCode] = useState('');
  const [courseName, setCourseName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!courseCode || !courseName) {
      Alert.alert('Eksik Alan', 'Lütfen ders kodunu ve adını girin.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/courses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          course_code: courseCode, 
          course_name: courseName 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Ders eklenemedi.');
      }

      Alert.alert('Başarılı', 'Ders başarıyla eklendi!', [
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
          <Text style={styles.title}>Yeni Ders Ekle</Text>
          <Text style={styles.subtitle}>Yazılım Mühendisliği / Müfredat Paneli</Text>

          <Text style={styles.label}>Ders Kodu</Text>
          <TextInput
            style={styles.input}
            placeholder="Örn: BLM412"
            placeholderTextColor="#94a3b8"
            value={courseCode}
            onChangeText={setCourseCode}
            autoCapitalize="characters"
          />

          <Text style={styles.label}>Ders Adı</Text>
          <TextInput
            style={styles.input}
            placeholder="Örn: Paralel Programlama"
            placeholderTextColor="#94a3b8"
            value={courseName}
            onChangeText={setCourseName}
          />

          <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.buttonText}>Dersi Kaydet</Text>
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
  card: { backgroundColor: '#ffffff', padding: 24, borderRadius: 16, borderWidth: 1, borderColor: '#e2e8f0' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#0f172a', textAlign: 'center' },
  subtitle: { fontSize: 13, color: '#64748b', textAlign: 'center', marginBottom: 20, marginTop: 4 },
  label: { fontSize: 13, fontWeight: '600', color: '#334155', marginBottom: 6 },
  input: { backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0', padding: 12, borderRadius: 10, marginBottom: 16, fontSize: 14, color: '#1e293b' },
  button: { backgroundColor: '#2563eb', padding: 14, borderRadius: 10, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#ffffff', fontWeight: 'bold', fontSize: 15 },
  backButton: { backgroundColor: '#f1f5f9', padding: 14, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  backButtonText: { color: '#475569', fontWeight: 'bold', fontSize: 15 },
});