import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ShopStack from '@navigation/ShopStack';
import CartScreen from '@screens/CartScreen';
import MeScreen from '@screens/MeScreen';
import { COLORS } from '@constants/theme';
import { VARIANT } from '@constants/student';
import { useCartStore } from '@stores/cartStore';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  const isShopFirst = VARIANT.tabOrder === 'shopFirst';
  const totalCount = useCartStore((s) => s.totalQuantity());

  return (
    <Tab.Navigator 
      screenOptions={{ 
        headerShown: false, 
        tabBarActiveTintColor: COLORS.primary, 
        tabBarInactiveTintColor: COLORS.textLight,
        // Thêm CSS để fix icon lỗi
        tabBarIconStyle: { paddingBottom: 4 }
      }}>
      {isShopFirst ? (
        <>
          <Tab.Screen 
            name="ShopTab" 
            component={ShopStack} 
            options={{ title: 'Cửa hàng', tabBarIcon: () => <Text style={{fontSize: 20}}>🏪</Text> }} 
          />
          <Tab.Screen 
            name="CartTab" 
            component={CartScreen} 
            options={{ title: 'Giỏ', tabBarBadge: totalCount > 0 ? totalCount : undefined, tabBarIcon: () => <Text style={{fontSize: 20}}>🛒</Text> }} 
          />
        </>
      ) : (
        <>
          <Tab.Screen 
            name="CartTab" 
            component={CartScreen} 
            options={{ title: 'Giỏ', tabBarBadge: totalCount > 0 ? totalCount : undefined, tabBarIcon: () => <Text style={{fontSize: 20}}>🛒</Text> }} 
          />
          <Tab.Screen 
            name="ShopTab" 
            component={ShopStack} 
            options={{ title: 'Cửa hàng', tabBarIcon: () => <Text style={{fontSize: 20}}>🏪</Text> }} 
          />
        </>
      )}
      <Tab.Screen 
        name="MeTab" 
        component={MeScreen} 
        options={{ title: 'Tôi', tabBarIcon: () => <Text style={{fontSize: 20}}>👤</Text> }} 
      />
    </Tab.Navigator>
  );
}