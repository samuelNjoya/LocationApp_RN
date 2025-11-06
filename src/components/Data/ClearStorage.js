import React from 'react';
import { View, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ClearStorageButton() {
  const clearStorage = () => {
    Alert.alert(
      'Confirmation',
      'Voulez-vous vraiment vider le stockage local ?',
      [
        {
          text: 'Annuler', style: 'cancel',
        },
        {
          text: 'Oui',
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              Alert.alert('Succès', 'Le stockage local a bien été vidé.');
              console.log('AsyncStorage vidé avec succès');
            } catch (error) {
              Alert.alert('Erreur', 'Impossible de vider le stockage.');
              console.error('Erreur à vider AsyncStorage:', error);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={{ margin: 20 }}>
      <Button title="Vider le stockage local" onPress={clearStorage} />
    </View>
  );
}
