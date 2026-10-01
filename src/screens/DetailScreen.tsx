import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator, Vibration, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { ShopStackParamList } from '@navigation/ShopStack';
import { COLORS } from '@constants/theme';
import { PRICE_MULTIPLIER, VARIANT } from '@constants/student';
import { fetchProductById } from '@services/productApi';
import { useCartStore } from '@stores/cartStore';

type DetailRouteProp = RouteProp<ShopStackParamList, 'Detail'>;

export default function DetailScreen() {
  const route = useRoute<DetailRouteProp>();
  const { id } = route.params;
  const addItem = useCartStore((s) => s.addItem);

  const { data, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProductById(id),
  });

  const handleAdd = () => {
    if (data) {
      addItem({ id: data.id, title: data.title, price: data.price, image: data.image });
      
      // Rung (Haptic) phản hồi theo đúng biến thể của đề thi
      if (VARIANT.hapticOnAdd === 'selection') {
        Vibration.vibrate(20);
      } else {
        Vibration.vibrate(50);
      }

      // Đã sửa thành Alert.alert chuẩn của React Native
      Alert.alert('Thành công', 'Đã thêm vào giỏ');
    }
  };

  // Màn hình loading chờ API
  if (isLoading || !data) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  const displayPrice = Math.round(data.price * PRICE_MULTIPLIER).toLocaleString('vi-VN') + ' đ';

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <View style={styles.container}>
        <View style={styles.imgBox}>
          <Image source={{ uri: data.image }} style={{ width: '100%', height: '100%' }} resizeMode="contain" />
        </View>
        <Text style={styles.title}>{data.title}</Text>
        <Text style={styles.price}>{displayPrice}</Text>
        <Text style={styles.desc}>Giao nội khu · nhận tận phòng</Text>
        <Text style={styles.desc} numberOfLines={3}>{data.description}</Text>
        <Text style={styles.idNote}>Giữ nguyên id từ route.params: {id}</Text>

        <TouchableOpacity style={styles.btn} onPress={handleAdd}>
          <Text style={styles.btnText}>Thêm vào giỏ · Haptic</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { flex: 1, padding: 16 },
  imgBox: { 
    width: '100%', 
    height: 250, 
    backgroundColor: '#FFF', 
    borderRadius: 16, 
    padding: 20, 
    elevation: 2, 
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 }
  },
  title: { fontSize: 20, fontWeight: 'bold', color: COLORS.text, textAlign: 'center' },
  price: { fontSize: 24, fontWeight: 'bold', color: COLORS.primary, textAlign: 'center', marginVertical: 8 },
  desc: { fontSize: 13, color: COLORS.textLight, textAlign: 'center', marginBottom: 12 },
  idNote: { fontSize: 12, color: COLORS.textLight, textAlign: 'center', marginTop: 16 },
  btn: { backgroundColor: COLORS.primary, padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 'auto' },
  btnText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
});