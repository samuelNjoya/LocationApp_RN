import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, FontAwesome5, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
// Importez vos composants/contextes
import HomeScreen from '../src/screens/HomeScrenn';
import ListingsStack from '../src/components/Data/ListingsStack';
import ProfileStack from '../src/components/Data/ProfileStack';
import FavoritesStack from '../src/components/Data/FavoritesStack';
import PublishScreen from '../src/screens/PublishScreen';
import { COLORS } from '../assets/Theme';


const Tab = createBottomTabNavigator();

// --- NOUVEAU COMPOSANT : Gère la navigation et la zone de sécurité ---
export default function MainTabNavigator() {
  // 1. Utilisez le hook pour obtenir les marges du système (insets)
  const insets = useSafeAreaInsets();
  const baseHeight = 60; // Hauteur de base de votre tab bar

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Accueil') {
            iconName = 'home';
            return <Ionicons name={iconName as any} size={size} color={color} />;
          } else if (route.name === 'Annonces') {
            iconName = 'building';
            return <FontAwesome5 name={iconName} size={size} color={color} />;
          } else if (route.name === 'Publier') {
            iconName = 'plus-box';
            return <MaterialCommunityIcons name={iconName as any} size={size} color={color} />;
          } else if (route.name === 'Profil') {
            iconName = 'person';
            return <Ionicons name={iconName as any} size={size} color={color} />;
          } else if (route.name === 'Favoris') {
            iconName = 'heart';
            return <AntDesign name={iconName as any} size={size} color={color} />;
          }
        },
        tabBarActiveTintColor: COLORS.greenColors,
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
        tabBarLabelStyle: { fontSize: 12, fontWeight: '600' },
        
        // 2. CORRECTION CLÉ : Applique la marge de sécurité
        tabBarStyle: { 
          // Ajuste la hauteur en ajoutant la marge inférieure (insets.bottom)
          height: baseHeight + insets.bottom, 
          // Applique la marge inférieure au padding (mieux si > 0)
          paddingBottom: insets.bottom > 0 ? insets.bottom : 6, 
          paddingTop: 6, 
          backgroundColor: '#fff', 
          borderTopWidth: 0.5, 
          borderTopColor: '#ddd', 
          elevation: 10 
        },
        tabBarHideOnKeyboard: true, // Empêche la barre de se coller si le clavier est actif
      })}
    >
      <Tab.Screen name="Accueil" component={HomeScreen} options={{ title: "Accueil" }} />
      <Tab.Screen name="Annonces" component={ListingsStack} />
      <Tab.Screen name="Publier" component={PublishScreen} />
      <Tab.Screen name="Profil" component={ProfileStack} />
      <Tab.Screen name="Favoris" component={FavoritesStack} />
    </Tab.Navigator>
  );
}
// --- FIN NOUVEAU COMPOSANT ---