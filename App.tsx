import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, FontAwesome5, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import { ToastProvider } from 'react-native-toast-notifications';

// Importez vos composants/contextes
// NOTE: J'ai corrigé HomeScrenn en HomeScreen, si cela n'était pas une faute de frappe, veuillez le rétablir.
import HomeScreen from './src/screens/HomeScrenn';
import ListingsStack from './src/components/Data/ListingsStack';
import ProfileStack from './src/components/Data/ProfileStack';
import FavoritesStack from './src/components/Data/FavoritesStack';
import PublishScreen from './src/screens/PublishScreen';
import { PropertyProvider } from './contexts/PropertyContext';
import { COLORS } from './assets/Theme';
import RootNavigator from './navigation/RootNavigator';

const Tab = createBottomTabNavigator();



export default function App() {
  return (
    // SafeAreaProvider est à la racine, c'est parfait
    <SafeAreaProvider>
      <ToastProvider>
        <PropertyProvider>
          <NavigationContainer>
            {/* Nous appelons le composant qui utilise les hooks de safe area */}
            {/* <MainTabNavigator /> */}
             <RootNavigator />
          </NavigationContainer>
        </PropertyProvider>
      </ToastProvider>
    </SafeAreaProvider>
  );
}