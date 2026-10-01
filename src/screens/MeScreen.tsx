import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '@constants/theme';
import { STUDENT, examStamp, VARIANT, BASE_SHIP_FEE } from '@constants/student';
import { useAuthStore } from '@stores/authStore';
import { useCampusLocation } from '@hooks/useCampusLocation';
import Watermark from '@components/Watermark';

export default function MeScreen() {
  const logout = useAuthStore((s) => s.logout);
  const { permission, distanceKm, requestLocation } = useCampusLocation();

  let shipFee = 0;
  if (distanceKm) {
    shipFee = VARIANT.shipFormula === 'A' 
      ? BASE_SHIP_FEE + Math.round(distanceKm * 2000)
      : BASE_SHIP_FEE + Math.round(distanceKm * 1500) + 2000;
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {VARIANT.watermarkAtTop && <Watermark />}
      <View style={styles.header}><Text style={styles.headerTxt}>TÔI · LOCATION</Text></View>
      <View style={styles.container}>
        <Text style={styles.name}>{STUDENT.hoTen}</Text>
        <Text style={styles.sub}>{STUDENT.mssv} · #{examStamp()}</Text>

        <View style={styles.locBox}>
          <Text style={{ color: permission === 'granted' ? COLORS.success : COLORS.error, fontWeight: 'bold', marginBottom: 8 }}>
            Quyền: {permission}
          </Text>
          <Text style={styles.locTxt}>≈ {distanceKm ? distanceKm.toFixed(2) : '...'} km tới cổng KTX</Text>
          <Text style={styles.locTxt}>Phí ship ước tính</Text>
          <Text style={styles.fee}>{shipFee ? shipFee.toLocaleString('vi-VN') + ' đ' : '...'}</Text>
        </View>

        <TouchableOpacity style={styles.btnPrimary} onPress={requestLocation}>
          <Text style={styles.btnTxt}>Lấy vị trí ước tính ship</Text>
        </TouchableOpacity>

        {permission === 'blocked' && (
          <TouchableOpacity style={styles.btnOutline} onPress={() => Linking.openSettings()}>
            <Text style={styles.btnOutlineTxt}>Mở Cài đặt (blocked)</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.btnLogout} onPress={logout}>
          <Text style={styles.btnTxt}>Đăng xuất</Text>
        </TouchableOpacity>
      </View>
      {!VARIANT.watermarkAtTop && <Watermark />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  header: { backgroundColor: COLORS.primary, padding: 16, alignItems: 'center' },
  headerTxt: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  container: { flex: 1, padding: 24, alignItems: 'center' },
  name: { fontSize: 20, fontWeight: 'bold', color: COLORS.text, marginBottom: 4 },
  sub: { fontSize: 13, color: COLORS.textLight, marginBottom: 24 },
  locBox: { backgroundColor: COLORS.surface, width: '100%', padding: 20, borderRadius: 16, elevation: 2, marginBottom: 24 },
  locTxt: { color: COLORS.textLight, marginBottom: 6 },
  fee: { fontSize: 22, fontWeight: 'bold', color: COLORS.secondary },
  btnPrimary: { width: '100%', backgroundColor: COLORS.primary, padding: 14, borderRadius: 12, alignItems: 'center', marginBottom: 12 },
  btnOutline: { width: '100%', borderColor: COLORS.primary, borderWidth: 1, padding: 14, borderRadius: 12, alignItems: 'center', marginBottom: 12 },
  btnOutlineTxt: { color: COLORS.primary, fontWeight: 'bold', fontSize: 16 },
  btnLogout: { width: '100%', backgroundColor: COLORS.error, padding: 14, borderRadius: 12, alignItems: 'center', marginTop: 'auto' },
  btnTxt: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
});