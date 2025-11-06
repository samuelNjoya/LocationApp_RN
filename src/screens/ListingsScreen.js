import React, { useState } from 'react';
import { View, FlatList, TextInput, StyleSheet, Text } from 'react-native';
import PropertyCard from '../components/PropertyCard';
import Feather from '@expo/vector-icons/Feather';
import { useProperties } from '../../contexts/PropertyContext';

export default function ListingsScreen({ navigation }) {

  const { properties } = useProperties(); // Utiliser le contexte pour obtenir les propriétés
  const [searchText, setSearchText] = useState('');

  // Assurer que properties est un tableau
  const filtered = Array.isArray(properties)
    ? properties.filter(p =>
      p.title.toLowerCase().includes(searchText.toLowerCase()) ||
      p.location.toLowerCase().includes(searchText.toLowerCase())
    )
    : [];


  return (
    <View style={styles.listingsContainer}>
      <View style={styles.searchInputContainer}>
        <Feather name="search" size={24} color="black" />
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher par titre ou lieu..."
          value={searchText}
          onChangeText={setSearchText}
          clearButtonMode="always"
        />
      </View>

      <FlatList
        showsVerticalScrollIndicator={false}
        data={filtered}
        keyExtractor={item => item.id}
        contentContainerStyle={filtered.length === 0 ? { flexGrow: 1, justifyContent: 'center', alignItems: 'center' } : { paddingBottom: 20 }}
        ListEmptyComponent={() => (
          <View style={styles.emptyList}>
            {/* Ce composant <Text> fonctionne désormais car il est importé */}
            <Text style={styles.emptyText}>Aucune annonce trouvée.</Text>
          </View>
        )}
        renderItem={({ item }) => (
          <PropertyCard
            property={item}
            onPress={() => navigation.navigate('Detail', { property: item })}

          />
        )}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  listingsContainer: {
    flex: 1,
    backgroundColor: '#e9f5f3',
    paddingHorizontal: 15,
    paddingTop: 10
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    elevation: 2,
    height: 44,
  },
  searchInput: {
    height: 42,
    flex: 1,
    //backgroundColor: 'white',
    borderRadius: 12,
    //paddingHorizontal: 15,
    fontSize: 16,
    //marginBottom: 15,
    //elevation: 2,
  },
  emptyList: {
    flex: 1,
    alignItems: 'center',
    marginTop: 80,
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
  },
});