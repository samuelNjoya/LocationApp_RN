import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFonts, Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { ToastProvider } from 'react-native-toast-notifications';

// Importez vos composants/contextes
import { PropertyProvider } from './contexts/PropertyContext';
import { COLORS } from './assets/Theme';
import RootNavigator from './navigation/RootNavigator';
import { AuthProvider } from './contexts/AuthContext';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

const Tab = createBottomTabNavigator();



export default function App() {
   // Charge les polices Poppins
  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} /> 
        <Text style={styles.loadingText}>Chargement des polices...</Text>
      </View>
    );
  }

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

const styles = StyleSheet.create({
  loadingContainer: { flex: 1,justifyContent: 'center',alignItems: 'center', backgroundColor: COLORS.background} ,
  loadingText: { marginTop: 15, fontSize: 16, color: COLORS.secondary }
});