import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, FontAwesome5, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import { ToastProvider } from 'react-native-toast-notifications';

// Importez vos composants/contextes
import { PropertyProvider } from './contexts/PropertyContext';
import { COLORS } from './assets/Theme';
import RootNavigator from './navigation/RootNavigator';
import { AuthProvider } from './contexts/AuthContext';

const Tab = createBottomTabNavigator();



export default function App() {
  return (
    // SafeAreaProvider est à la racine, c'est parfait
    // Auth provider dans le contexte d'authentification
    <SafeAreaProvider>
      <AuthProvider>
        <ToastProvider>
          <PropertyProvider>
            <NavigationContainer>
              {/* Nous appelons le composant qui utilise les hooks de safe area */}
              {/* <MainTabNavigator /> */}
              <RootNavigator />
            </NavigationContainer>
          </PropertyProvider>
        </ToastProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}