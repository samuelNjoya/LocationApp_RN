// screens/ProfileScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Ionicons } from "@expo/vector-icons";
import { useToast } from "react-native-toast-notifications";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { COLORS } from "../../assets/Theme";
import { useProperties } from "../../contexts/PropertyContext";
import ClearStorageButton from "../components/Data/ClearStorage";
import Spinner from "../components/Spinner";
import { PropertyHome } from "../components/Data/defaultProperties";

// --- Typage de la navigation principale ---
type RootStackParamList = {
  Home: undefined;
  Detail: { property: PropertyHome };
  Favorites: undefined;
  EditProperty: { property: PropertyHome };
  Profile: undefined;
};

type ProfileScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Profile"
>;

// --- Props du composant ---
interface ProfileScreenProps {
  navigation: ProfileScreenNavigationProp;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const { properties, deleteProperty } = useProperties();
  const [isLoading, setIsLoading] = useState(false);
  const Toast = useToast();

  // --- Filtrer les annonces appartenant à "Vous" ---
  const mine = properties.filter(
    (p: PropertyHome) => p.owner === "Vous"
  );

  // --- Suppression avec confirmation ---
  const handleDelete = (id: number) => {
    setIsLoading(true);
    setTimeout(() => {
      deleteProperty(id);
      setIsLoading(false);
      Toast.show("Annonce supprimée avec succès", {
        type: "danger",
        placement: "top",
        duration: 2000,
        animationType: "zoom-in",
        dangerIcon: (
          <AntDesign name="close-circle" size={24} color="white" />
        ),
        successIcon: (
          <Ionicons name="checkmark-circle-sharp" size={24} color="white" />
        ),
      });
    }, 1500);
  };

  return (
    <View style={styles.profileContainer}>
      <Text style={styles.profileTitle}>Mes Annonces</Text>

      {mine.length === 0 ? (
        <Text style={styles.noItems}>
          Vous n'avez aucune annonce publiée.
        </Text>
      ) : (
        <FlatList
          data={mine}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.myProperty}>
              <Text style={styles.myPropertyTitle}>{item.title}</Text>
              <Text style={styles.myPropertyTitle}>{item.price} FCFA</Text>

              {/* Bouton Supprimer */}
              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() =>
                  Alert.alert(
                    "Supprimer",
                    "Voulez-vous supprimer cette annonce ?",
                    [
                      { text: "Annuler", style: "cancel" },
                      {
                        text: "Oui",
                        style: "destructive",
                        onPress: () => handleDelete(item.id),
                      },
                    ]
                  )
                }
              >
                <FontAwesome name="trash-o" size={24} color="#e63946" />
              </TouchableOpacity>

              {/* Bouton Modifier */}
              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() =>
                  navigation.navigate("EditProperty", { property: item })
                }
              >
                <AntDesign name="edit" size={24} color="blue" />
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      {/* Bouton de nettoyage du cache */}
      <ClearStorageButton />

      <Spinner visible={isLoading} />
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  profileContainer: {
    flex: 1,
    backgroundColor: "#e9f5f3",
    padding: 20,
  },
  profileTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#264653",
  },
  noItems: {
    fontSize: 16,
    color: "#777",
    textAlign: "center",
    marginTop: 40,
  },
  myProperty: {
    backgroundColor: "white",
    borderRadius: 15,
    marginBottom: 12,
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 3,
  },
  myPropertyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#264653",
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
