// screens/FavoritesScreen.js
import React from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import { useProperties } from '../../contexts/PropertyContext';
import PropertyCard from '../components/PropertyCard';

export default function FavoritesScreen({ navigation }) {
  const { properties, favorites } = useProperties();
  const favoriteProperties = properties.filter(p => favorites.includes(p.id));

  return (
    <View style={styles.container}>
     {/* <View style={{ alignItems: 'center', marginBottom: 10, marginTop: 20 }}>
            <Text style={{ fontSize:18, fontWeight:"bold"}}>Mes favoris </Text> 
    </View>  */}
      {favoriteProperties.length === 0 ? (
        <Text style={{ textAlign: 'center', color: '#888', marginTop: 40, fontSize: 18 }}>Aucun favori pour l’instant.</Text>
      ) : (
       
        <FlatList
          data={favoriteProperties}
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <PropertyCard
              property={item}
              onPress={() => navigation.navigate('Detail', { property: item })}
            />
          )}
        />
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#e9f5f3', padding: 15 }
});
