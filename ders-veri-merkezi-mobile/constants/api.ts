import { Platform } from 'react-native';

// TELEFONDA test ederken buraya bilgisayarın Wi-Fi adresini yaz
// (terminalde ipconfig → "Wireless LAN adapter Wi-Fi" → IPv4 Address).
// Tarayıcıda (web) test ederken bu adres kullanılmaz.
const BILGISAYAR_ADRESI = '10.208.47.75';

export const API_URL =
  Platform.OS === 'web' ? 'http://localhost:4000' : `http://${BILGISAYAR_ADRESI}:4000`;