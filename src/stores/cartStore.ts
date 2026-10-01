import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STUDENT } from '@constants/student';

export interface CartItem {
  id: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (product: { id: number; title: string; price: number; image: string }) => void;
  removeItem: (id: number) => void;
  changeQty: (id: number, delta: number) => void;
  totalQuantity: () => number;
  totalAmount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) => set((state) => {
        const exist = state.items.find((i) => i.id === product.id);
        if (exist) {
          return { items: state.items.map((i) => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i) };
        }
        return { items: [...state.items, { ...product, quantity: 1 }] };
      }),
      removeItem: (id) => set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
      changeQty: (id, delta) => set((state) => ({
        items: state.items.map((i) => i.id === id ? { ...i, quantity: i.quantity + delta } : i).filter((i) => i.quantity > 0)
      })),
      totalQuantity: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
      totalAmount: () => get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    }),
    {
      name: `ktxgo-cart-${STUDENT.mssv}`,
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);