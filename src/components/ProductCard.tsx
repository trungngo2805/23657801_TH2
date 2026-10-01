import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { COLORS } from '@constants/theme';
import { PRICE_MULTIPLIER } from '@constants/student';
import { Product } from '@services/productApi';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

interface Props {
  product: Product;
  onPress: () => void;
  onAdd: () => void;
}

export default function ProductCard({ product, onPress, onAdd }: Props) {
  const displayPrice = Math.round(product.price * PRICE_MULTIPLIER).toLocaleString('vi-VN') + ' đ';
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.imageBox}>
        <Image source={{ uri: product.image }} style={styles.image} resizeMode="contain" />
      </View>
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>{product.title}</Text>
        <View style={styles.priceRow}>
          <Text style={styles.price}>{displayPrice}</Text>
          <TouchableOpacity style={styles.addBtn} onPress={onAdd}>
            <Text style={styles.addText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { width: CARD_WIDTH, backgroundColor: COLORS.surface, borderRadius: 16, padding: 10, margin: 6, elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4 },
  imageBox: { height: 110, backgroundColor: '#EFF6FF', borderRadius: 12, justifyContent: 'center', alignItems: 'center', padding: 8 },
  image: { width: '100%', height: '100%' },
  info: { marginTop: 8 },
  title: { fontSize: 13, fontWeight: '600', color: COLORS.text, height: 36 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  price: { fontSize: 13, fontWeight: 'bold', color: COLORS.primary },
  addBtn: { backgroundColor: COLORS.primary, width: 28, height: 28, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  addText: { color: '#FFF', fontSize: 18, fontWeight: 'bold', lineHeight: 20 },
});