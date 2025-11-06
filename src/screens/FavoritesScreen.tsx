// screens/FavoritesScreen.tsx
import React from "react";
import { View, FlatList, Text, StyleSheet } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useProperties } from "../../contexts/PropertyContext";
import PropertyCard from "../components/PropertyCard";
import { PropertyHome } from "../components/Data/defaultProperties";

// --- Typage de la navigation ---
type RootStackParamList = {
  Home: undefined;
  Detail: { property: PropertyHome };
  Favorites: undefined;
  EditProperty: { property: PropertyHome };
};

type FavoritesScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Favorites"
>;

// --- Typage des props du composant ---
interface FavoritesScreenProps {
  navigation: FavoritesScreenNavigationProp;
}

const FavoritesScreen: React.FC<FavoritesScreenProps> = ({ navigation }) => {
  const { properties, favorites } = useProperties();

  // --- On filtre les propriétés favorites ---
  const favoriteProperties = properties.filter((p: PropertyHome) =>
    favorites.includes(p.id)
  );

  return (
    <View style={styles.container}>
      {/* En-tête optionnel */}
      {/* <View style={styles.header}>
        <Text style={styles.headerText}>Mes favoris</Text>
      </View> */}

      {favoriteProperties.length === 0 ? (
        <Text style={styles.emptyText}>
          Aucun favori pour l’instant.
        </Text>
      ) : (
        <FlatList
          data={favoriteProperties}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <PropertyCard
              property={item}
              onPress={() => navigation.navigate("Detail", { property: item })}
            />
          )}
        />
      )}
    </View>
  );
};

export default FavoritesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e9f5f3",
    padding: 15,
  },
  header: {
    alignItems: "center",
    marginBottom: 10,
    marginTop: 20,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  emptyText: {
    textAlign: "center",
    color: "#888",
    marginTop: 40,
    fontSize: 18,
  },
});
