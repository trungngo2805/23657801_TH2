import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, StyleSheet, ActivityIndicator, TouchableOpacity, Vibration } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';
import { FlashList } from '@shopify/flash-list';
import { ShopStackParamList } from '@navigation/ShopStack';
import { COLORS } from '@constants/theme';
import { STUDENT, ROOM_LABEL, DEBOUNCE_MS, STALE_TIME_MS, VARIANT } from '@constants/student';
import { fetchProducts, Product } from '@services/productApi';
import { useDebouncedValue } from '@hooks/useDebouncedValue';
import { useCartStore } from '@stores/cartStore';
import ProductCard from '@components/ProductCard';
import Watermark from '@components/Watermark';

export default function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<ShopStackParamList>>();
  const addItem = useCartStore((state) => state.addItem);
  const [keyword, setKeyword] = useState('');
  
  // Hook xử lý trễ (debounce) cho ô tìm kiếm
  const debouncedKeyword = useDebouncedValue(keyword, DEBOUNCE_MS);

  // Lấy dữ liệu qua React Query
  const { data, isLoading, isError, refetch, isRefetching } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    staleTime: STALE_TIME_MS,
  });

  // Lọc sản phẩm theo keyword
  const filteredData = useMemo(() => {
    if (!data) return [];
    if (!debouncedKeyword.trim()) return data;
    return data.filter((item) =>
      item.title.toLowerCase().includes(debouncedKeyword.toLowerCase()),
    );
  }, [data, debouncedKeyword]);

  const handleAdd = (item: Product) => {
    addItem({ id: item.id, title: item.title, price: item.price, image: item.image });
    
    // Rung (Haptic) phản hồi theo đúng biến thể của đề thi
    if (VARIANT.hapticOnAdd === 'selection') {
      Vibration.vibrate(20);
    } else {
      Vibration.vibrate(50);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {VARIANT.watermarkAtTop && <Watermark />}

      <View style={styles.header}>
        <Text style={styles.brandTitle}>KTXGO</Text>
        <Text style={styles.roomLabel}>Giao tận {ROOM_LABEL}</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder={`Tìm món (debounce) — ${STUDENT.mssv}`}
          placeholderTextColor={COLORS.textLight}
          value={keyword}
          onChangeText={setKeyword}
        />
      </View>

      <View style={styles.listContainer}>
        {/* Trạng thái Đang tải */}
        {isLoading && (
          <View style={styles.centerBox}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.statusText}>Đang tải món...</Text>
          </View>
        )}

        {/* Trạng thái Lỗi mạng */}
        {isError && (
          <View style={styles.centerBox}>
            <Text style={styles.errorMssv}>{STUDENT.mssv}</Text>
            <Text style={styles.errorText}>Không tải được dữ liệu món.</Text>
            <TouchableOpacity style={styles.retryBtn} onPress={() => refetch()}>
              <Text style={styles.retryText}>Thử lại</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Trạng thái Thành công -> Hiện FlashList */}
        {!isLoading && !isError && (
          <FlashList
            data={filteredData}
            keyExtractor={(item) => `${STUDENT.mssv}-${item.id}`}
            numColumns={2}
            refreshing={isRefetching}
            onRefresh={refetch}
            renderItem={({ item }) => (
              <ProductCard
                product={item}
                onPress={() => navigation.navigate('Detail', { id: String(item.id) })}
                onAdd={() => handleAdd(item)}
              />
            )}
            contentContainerStyle={styles.listPadding}
          />
        )}
      </View>

      {!VARIANT.watermarkAtTop && <Watermark />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  header: { backgroundColor: COLORS.primary, paddingHorizontal: 16, paddingVertical: 12 },
  brandTitle: { fontSize: 22, fontWeight: '900', color: '#FFF' },
  roomLabel: { fontSize: 13, color: '#BFDBFE', marginTop: 2 },
  searchContainer: { paddingHorizontal: 12, paddingVertical: 8, backgroundColor: COLORS.background },
  searchInput: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 13,
    color: COLORS.text,
  },
  listContainer: { flex: 1 },
  listPadding: { paddingHorizontal: 6, paddingBottom: 16 },
  centerBox: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  statusText: { marginTop: 12, fontSize: 14, color: COLORS.textLight },
  errorMssv: { fontSize: 16, fontWeight: 'bold', color: COLORS.error, marginBottom: 4 },
  errorText: { fontSize: 14, color: COLORS.text, marginBottom: 16 },
  retryBtn: { backgroundColor: COLORS.error, paddingHorizontal: 32, paddingVertical: 10, borderRadius: 10 },
  retryText: { color: '#FFF', fontWeight: 'bold' },
});