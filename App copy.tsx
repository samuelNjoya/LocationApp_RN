import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, FontAwesome5, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';

import HomeScreen from './screens/HomeScrenn';
import ListingsScreen from './screens/ListingsScreen';
import PropertyDetailScreen from './screens/PropertyDetailScreen';
import ProfileScreen from './screens/ProfileScreen';
import PublishScreen from './screens/PublishScreen';
import ChatScreen from './screens/ChatScreen';
import { COLORS } from './assets/Theme';
import ListingsStack from './src/components/Data/ListingsStack';
import { PropertyProvider } from './contexts/PropertyContext';
import ProfileStack from './src/components/Data/ProfileStack';
import FavoritesScreen from './screens/FavoritesScreen';
import FavoritesStack from './src/components/Data/FavoritesStack';
import { ToastProvider } from 'react-native-toast-notifications';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
//import FavoritesScreen from './screnns/Favorie/FavoritesScreen';


const Tab = createBottomTabNavigator();
const insets = useSafeAreaInsets(); // Obtenez les marges sécurisées

export default function App() {

  return (
    //ProprietyProvider pour fournir les propriétés à tous les composants enfants
    // et permettre la gestion des annonces
    <SafeAreaProvider>
      <ToastProvider>
        <PropertyProvider>
          <NavigationContainer>
            <Tab.Navigator
              screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                  if (route.name === 'Accueil') {
                    return <Ionicons name="home" size={size} color={color} />;
                  } else if (route.name === 'Annonces') {
                    return <FontAwesome5 name="building" size={size} color={color} />;
                  } else if (route.name === 'Publier') {
                    return <MaterialCommunityIcons name="plus-box" size={size} color={color} />;
                  } else if (route.name === 'Profil') {
                    return <Ionicons name="person" size={size} color={color} />;
                    //} else if (route.name === 'Chat') {
                    //   return <MaterialIcons name="chat" size={size} color={color} />;
                  } else if (route.name === 'Favoris') {
                    return <AntDesign name="heart" size={size} color={color} />;
                  }
                },
                tabBarActiveTintColor: COLORS.greenColors,
                tabBarInactiveTintColor: 'gray',
                headerShown: false,
              //  tabBarHideOnKeyboard: true, // Option utile pour ne pas coller au clavier
                tabBarStyle: {
                   height: 60, 
                   paddingBottom: 6, 
                  // height: 60 + insets.bottom,
                  // paddingBottom: insets.bottom > 0 ? insets.bottom : 6, // Applique la marge de sécurité au padding
                  paddingTop: 6, backgroundColor: '#fff', borderTopWidth: 0.5, borderTopColor: '#ddd', elevation: 10
                },
                tabBarLabelStyle: { fontSize: 12, fontWeight: '600' },
              })}
            >
              <Tab.Screen name="Accueil" component={HomeScreen} options={{ title: "Accueil" }} />
              <Tab.Screen name="Annonces" component={ListingsStack} />
              <Tab.Screen name="Publier" component={PublishScreen} />
              <Tab.Screen name="Profil" component={ProfileStack} />
              {/* <Tab.Screen name="Chat" component={ChatScreen} /> */}
              <Tab.Screen name="Favoris" component={FavoritesStack} />
            </Tab.Navigator>
          </NavigationContainer>
        </PropertyProvider>
      </ToastProvider>
    </SafeAreaProvider>
  );
}
