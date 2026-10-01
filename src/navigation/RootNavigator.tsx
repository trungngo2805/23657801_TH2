import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthStack from '@navigation/AuthStack';
import MainTabs from '@navigation/MainTabs';
import { useAuthStore } from '@stores/authStore';

export default function RootNavigator() {
  const token = useAuthStore((state) => state.token);
  return <NavigationContainer>{token == null ? <AuthStack /> : <MainTabs />}</NavigationContainer>;
}