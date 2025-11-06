import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { Component } from 'react'
import { Text, View } from 'react-native'
import ListingsScreen from '../../screens/ListingsScreen';
import PropertyDetailScreen from '../../screens/PropertyDetailScreen';
import EditPropertyScreen from '../EditPropertyScreen';

export default function ListingsStack({ properties }) {// A remplacer ListingsScreen dans App.js

    const Stack = createNativeStackNavigator();
    return (
        <Stack.Navigator 
        //  screenOptions={{ headerShown: false }}
        >
            <Stack.Screen name="Annonces"   
              children={props => <ListingsScreen {...props} properties={properties} />}
              // Le paramètre children te permet de passer des props personnalisées
            />
            <Stack.Screen name="Detail" component={PropertyDetailScreen} options={{ title: 'Detail de \'Annonces' }}  />
            <Stack.Screen name="EditProperty" component={EditPropertyScreen}  />

        </Stack.Navigator>
    );  
}
