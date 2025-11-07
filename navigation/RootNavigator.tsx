import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../contexts/AuthContext';
import MainTabNavigator from './MainTabNavigator';
import AuthStack from './AuthStack';
import { ActivityIndicator, View } from 'react-native';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { user, isLoading } = useAuth();

  //   if (isLoading) {
  //   return (
  //     <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
  //       <ActivityIndicator size="large" color="#007bff" />
  //     </View>
  //   );
  // }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <Stack.Screen name="MainTabs" component={MainTabNavigator} />
      ) : (
        <Stack.Screen name="Auth" component={AuthStack} />
      )}
    </Stack.Navigator>
  );
}
