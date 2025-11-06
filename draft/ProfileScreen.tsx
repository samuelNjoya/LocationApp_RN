import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useProperties } from '../../contexts/PropertyContext';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { COLORS } from '../../assets/Theme';
import AntDesign from '@expo/vector-icons/AntDesign';
import ClearStorageButton from '../components/Data/ClearStorage'; import MyScreen from '../components/Data/TestSkeleton';
import Spinner from '../components/Spinner';
import { useToast } from 'react-native-toast-notifications';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen({ navigation }) {

  const { properties, deleteProperty } = useProperties(); // Utiliser le contexte pour obtenir et supprimer les propriétés
  // Filtrer annonces de l’utilisateur actuel (ici "Vous")
  const mine = properties.filter((p) => p.owner === 'Vous');
  const [isLoading, setIsLoading] = useState(false);

  const Toast = useToast();

  const handleDelete = (id) => {
    setIsLoading(true);
    setTimeout(() => {
      deleteProperty(id);
      setIsLoading(false);
      Toast.show("Annonce supprimée avec succès", {
        type: 'danger',
        placement: "top",
        duration: 2000,
       // offset: 90,
        animationType: "zoom-in",
        dangerIcon: <AntDesign name="close-circle" size={24} color="white" />,
        successIcon: <Ionicons name="checkmark-circle-sharp" size={24} color="white" />
      });
    }, 1500);
  };

  return (
    <View style={styles.profileContainer}>
      <Text style={styles.profileTitle}>Mes Annonces</Text>
      {mine.length === 0 ? (
        <Text style={styles.noItems}>Vous n'avez aucune annonce publiée.</Text>
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={mine}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.myProperty}>
              <Text style={styles.myPropertyTitle}>{item.title}</Text>
              <Text style={styles.myPropertyTitle}>{item.price}</Text>
              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => {
                  Alert.alert('Supprimer', 'Voulez-vous supprimer cette annonce ?', [
                    { text: 'Annuler', style: 'cancel' },
                    { text: 'Oui', style: 'destructive', onPress: () => handleDelete(item.id) },

                  ]);
                }}>
                <Text style={{ color: 'white' }}><FontAwesome name="trash-o" size={24} color="#e63946" /></Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate('EditProperty', { property: item })}
                style={styles.deleteBtn}
              >
                <Text style={{ color: 'blue' }}><AntDesign name="edit" size={24} color="blue" /></Text>
              </TouchableOpacity>
            </View>
          )}
        />

      )}
      {/* Boutton pour vider la cache */}
      <View>
        <ClearStorageButton />
      </View>
      <Spinner visible={isLoading} />
    </View>
  );
}

const styles = StyleSheet.create({
  profileContainer: {
    flex: 1,
    backgroundColor: '#e9f5f3',
    padding: 20,
  },
  profileTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#264653',
  },
  noItems: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
    marginTop: 40,
  },
  myProperty: {
    backgroundColor: 'white',
    borderRadius: 15,
    marginBottom: 12,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 3,
  },
  myPropertyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#264653',
    flex: 1,
    marginRight: 12,
  },
  deleteBtn: {
    backgroundColor: COLORS.greenWhite,
    borderRadius: 12,
    paddingVertical: 7,
    paddingHorizontal: 7,
    marginLeft: 8,
    elevation: 2,
  },
});
