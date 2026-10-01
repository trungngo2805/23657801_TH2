import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { STUDENT, examStamp, VARIANT } from '@constants/student';
import { COLORS } from '@constants/theme';

export default function Watermark() {
  return (
    <View style={[styles.container, VARIANT.watermarkAtTop ? styles.top : styles.bottom]}>
      <Text style={styles.text}>TH2 · {STUDENT.mssv} · {STUDENT.hoTen} · #{examStamp()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#DBEAFE', paddingVertical: 4, alignItems: 'center', width: '100%' },
  top: { borderBottomWidth: 1, borderColor: COLORS.border },
  bottom: { borderTopWidth: 1, borderColor: COLORS.border },
  text: { fontSize: 12, fontWeight: '700', color: COLORS.text },
});