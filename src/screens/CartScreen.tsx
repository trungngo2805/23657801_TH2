import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '@constants/theme';
import { ROOM_LABEL, VARIANT, BASE_SHIP_FEE, PRICE_MULTIPLIER } from '@constants/student';
import { useCartStore } from '@stores/cartStore';
import { useCampusLocation } from '@hooks/useCampusLocation';
import Watermark from '@components/Watermark';

export default function CartScreen() {
  const { items, totalAmount, changeQty, removeItem } = useCartStore();
  const { distanceKm } = useCampusLocation();

  // Tính phí ship dựa trên biến thể công thức A hoặc B
  let shipFee = 0;
  if (distanceKm) {
    shipFee = VARIANT.shipFormula === 'A' 
      ? BASE_SHIP_FEE + Math.round(distanceKm * 2000)
      : BASE_SHIP_FEE + Math.round(distanceKm * 1500) + 2000;
  }

  // Hàm định dạng giá tiền nhân với hệ số của sinh viên
  const formatPrice = (p: number) => Math.round(p * PRICE_MULTIPLIER).toLocaleString('vi-VN') + ' đ';

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Hiện watermark ở trên nếu VARIANT yêu cầu */}
      {VARIANT.watermarkAtTop && <Watermark />}
      
      <View style={styles.header}>
        <Text style={styles.headerTxt}>GIỎ HÀNG</Text>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <View style={styles.row}>
            {/* Thông tin tên và giá sản phẩm */}
            <View style={{ flex: 1 }}>
              <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
              <Text style={styles.price}>{formatPrice(item.price)}</Text>
            </View>

            {/* Cụm nút tăng giảm số lượng */}
            <View style={styles.qtyContainer}>
              <TouchableOpacity style={styles.qtyBtn} onPress={() => changeQty(item.id, -1)}>
                <Text style={styles.qtyTxt}>-</Text>
              </TouchableOpacity>
              
              <Text style={styles.qtyValue}>{item.quantity}</Text>
              
              <TouchableOpacity style={styles.qtyBtn} onPress={() => changeQty(item.id, 1)}>
                <Text style={styles.qtyTxt}>+</Text>
              </TouchableOpacity>
            </View>

            {/* Nút xoá hoàn toàn món khỏi giỏ */}
            <TouchableOpacity style={styles.delBtn} onPress={() => removeItem(item.id)}>
              <Text style={styles.delTxt}>🗑</Text>
            </TouchableOpacity>
          </View>
        )}
        ListFooterComponent={
          items.length > 0 ? (
            <View style={styles.billBox}>
              <Text style={styles.billTxt}>Giao đến {ROOM_LABEL}</Text>
              <Text style={styles.shipTxt}>
                Phí ship: {shipFee ? shipFee.toLocaleString('vi-VN') + ' đ (công thức ' + VARIANT.shipFormula + ')' : 'Đang tính...'}
              </Text>
              <Text style={styles.totalTxt}>Tổng hàng: {formatPrice(totalAmount())}</Text>
            </View>
          ) : (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyTxt}>Giỏ hàng đang trống.</Text>
              <Text style={styles.emptySubTxt}>Hãy quay lại Cửa hàng để thêm món nhé!</Text>
            </View>
          )
        }
      />

      {/* Hiện watermark ở dưới nếu VARIANT yêu cầu (với MSSV 23657801 thì sẽ hiện ở đây) */}
      {!VARIANT.watermarkAtTop && <Watermark />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  header: { backgroundColor: COLORS.primary, padding: 16, alignItems: 'center' },
  headerTxt: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  
  // Dòng sản phẩm
  row: { 
    flexDirection: 'row', 
    backgroundColor: COLORS.surface, 
    padding: 16, 
    borderRadius: 12, 
    marginBottom: 12, 
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 }
  },
  title: { fontSize: 15, fontWeight: '600', color: COLORS.text, marginBottom: 4 },
  price: { color: COLORS.primary, fontWeight: 'bold' },
  
  // Nút tăng giảm số lượng
  qtyContainer: { flexDirection: 'row', alignItems: 'center', marginLeft: 10 },
  qtyBtn: { 
    backgroundColor: '#E2E8F0', 
    width: 28, 
    height: 28, 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderRadius: 6 
  },
  qtyTxt: { fontWeight: 'bold', fontSize: 16, color: COLORS.text },
  qtyValue: { marginHorizontal: 12, fontWeight: 'bold', fontSize: 16, color: COLORS.text },
  
  // Nút xoá
  delBtn: { backgroundColor: COLORS.error, padding: 10, borderRadius: 8, marginLeft: 12 },
  delTxt: { color: '#FFF', fontSize: 14 },
  
  // Hoá đơn
  billBox: { borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.surface, borderRadius: 12, padding: 16, marginTop: 12 },
  billTxt: { fontSize: 15, fontWeight: 'bold', color: COLORS.text, marginBottom: 6 },
  shipTxt: { fontSize: 14, fontWeight: 'bold', color: COLORS.secondary, marginBottom: 16 },
  totalTxt: { fontSize: 18, fontWeight: '900', color: COLORS.primary, textAlign: 'center' },
  
  // Trạng thái trống
  emptyBox: { alignItems: 'center', marginTop: 40 },
  emptyTxt: { fontSize: 16, fontWeight: 'bold', color: COLORS.textLight, marginBottom: 8 },
  emptySubTxt: { fontSize: 14, color: COLORS.textLight },
});