import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '@constants/theme';
import { STUDENT, examStamp, VARIANT } from '@constants/student';
import { useAuthStore } from '@stores/authStore';

export default function LoginScreen() {
  const [inputValue, setInputValue] = useState('');
  const login = useAuthStore((state) => state.login);

  return (
    <View style={styles.container}>
      <Text style={styles.watermark}>TH2 · {STUDENT.mssv} · {STUDENT.hoTen} · #{examStamp()}</Text>
      <Text style={styles.brandTitle}>KTXGO</Text>
      <Text style={styles.subtitle}>Giao đồ tận phòng ký túc xá</Text>

      <View style={styles.inputCard}>
        <Text style={styles.inputLabel}>{VARIANT.authField === 'phone' ? 'Số điện thoại' : 'Email'}</Text>
        <TextInput
          style={styles.input}
          placeholder={VARIANT.authField === 'phone' ? 'Nhập số điện thoại sinh viên' : 'email@iuh.edu.vn'}
          placeholderTextColor={COLORS.textLight}
          value={inputValue}
          onChangeText={setInputValue}
          keyboardType={VARIANT.authField === 'phone' ? 'phone-pad' : 'email-address'}
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={() => login(`ktxgo-${STUDENT.mssv}-${examStamp()}`)}>
        <Text style={styles.buttonText}>Vào cửa hàng</Text>
      </TouchableOpacity>
      <Text style={styles.footerNote}>Auth Stack · chưa có token</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center', padding: 24 },
  watermark: { position: 'absolute', top: 50, fontSize: 12, fontWeight: 'bold', color: COLORS.text },
  brandTitle: { fontSize: 40, fontWeight: '900', color: COLORS.primary, marginBottom: 8 },
  subtitle: { fontSize: 15, color: COLORS.textLight, marginBottom: 32 },
  inputCard: { width: '100%', backgroundColor: COLORS.surface, padding: 16, borderRadius: 16, borderWidth: 1, borderColor: COLORS.border, marginBottom: 20 },
  inputLabel: { fontSize: 12, color: COLORS.primary, marginBottom: 6, fontWeight: 'bold' },
  input: { fontSize: 16, color: COLORS.text, paddingVertical: 4 },
  button: { width: '100%', backgroundColor: COLORS.primary, paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginBottom: 16 },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  footerNote: { fontSize: 13, color: COLORS.textLight },
});