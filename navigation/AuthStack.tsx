import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../src/screens/Auth/LoginScreen';
import RegisterScreen from '../src/screens/Auth/RegisterScreen';
import HomeScreen from '../src/screens/HomeScrenn'; 

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined; // NOTE: Ce chemin devrait mener vers MainTabs si l'utilisateur est connecté
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
  );
}