import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
  Image, // Ajouté pour afficher la photo de profil
} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useToast } from "react-native-toast-notifications";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { COLORS } from "../../assets/Theme";
import { useProperties } from "../../contexts/PropertyContext";
// Import du hook useAuth réel
import { useAuth } from "../../contexts/AuthContext";
import { PropertyHome } from "../components/Data/defaultProperties";
import Spinner from "../components/Spinner";
import ProfileFormModal from "../components/ProfileFormModal";


// --- Typage de la navigation principale ---
type RootStackParamList = {
  Home: undefined;
  Detail: { property: PropertyHome };
  Favorites: undefined;
  EditProperty: { property: PropertyHome };
  Profile: undefined;
  Login: undefined;
};

type ProfileScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Profile"
>;

// --- Props du composant ---
interface ProfileScreenProps {
  navigation: ProfileScreenNavigationProp;
}

// --- Composant d'une annonce dans la liste (Reste le même) ---
const MyPropertyCard: React.FC<{ item: PropertyHome, onEdit: () => void, onDelete: (id: number) => void }> = ({ item, onEdit, onDelete }) => {
  return (
    <View style={propertyStyles.card}>
      {/* Colonne de gauche: Infos principales */}
      <View style={propertyStyles.infoContainer}>
        <Text style={propertyStyles.title}>{item.title}</Text>
        <View style={propertyStyles.detailRow}>
          <Feather name="map-pin" size={14} color="#666" style={{ marginRight: 5 }} />
          <Text style={propertyStyles.location}>{item.location}</Text> {/* Affiche la ville, plus pertinent */}
        </View>
        <Text style={propertyStyles.price}>{item.price} FCFA</Text>
      </View>

      {/* Colonne de droite: Actions */}
      <View style={propertyStyles.actionsContainer}>
        {/* Bouton Modifier */}
        <TouchableOpacity
          style={propertyStyles.actionButton}
          onPress={onEdit}
        >
          <AntDesign name="edit" size={20} color={COLORS.primary} />
        </TouchableOpacity>

        {/* Bouton Supprimer */}
        <TouchableOpacity
          style={[propertyStyles.actionButton, propertyStyles.deleteButton]}
          onPress={() => onDelete(item.id)}
        >
          <FontAwesome name="trash-o" size={20} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};


const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  // Hook d'authentification réel
  const { user, logout } = useAuth();

  // Propriétés du contexte
  const { properties, deleteProperty } = useProperties();

  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false); // État pour la modal
  const Toast = useToast();

  // Utilise l'ID de l'utilisateur réel pour filtrer les annonces
  // const mine = Array.isArray(properties) && user ? properties.filter(
  //   // NOTE: Supposons que vos annonces ont un champ 'ownerId' qui correspond à 'user.id'
  //   (p: PropertyHome) => p.ownerId === user.id
  // ) : [];

  // Ligne dans votre ProfileScreen.tsx qui doit être modifiée :
  const mine = Array.isArray(properties) && user && user.id ? properties.filter(
    (p: PropertyHome) => p.ownerId && p.ownerId.toString() === user.id.toString()
  ) : [];

  // --- Confirmation et suppression (Logique inchangée) ---
  const handleDelete = (id: number) => {
    Alert.alert(
      "Confirmation de suppression",
      "Êtes-vous sûr de vouloir supprimer cette annonce de façon définitive ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Oui, Supprimer",
          style: "destructive",
          onPress: () => {
            setIsLoading(true);
            setTimeout(() => {
              deleteProperty(id);
              setIsLoading(false);
              Toast.show("Annonce supprimée avec succès", {
                type: "danger",
                placement: "top",
                duration: 2000,
                animationType: "zoom-in",
                dangerIcon: <AntDesign name="close-circle" size={24} color="white" />,
              });
            }, 1000);
          },
        },
      ]
    );
  };

  // --- Fonction de déconnexion (Logique inchangée) ---
  const handleLogout = () => {
    Alert.alert(
      "Déconnexion",
      "Voulez-vous vraiment vous déconnecter ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Oui",
          onPress: async () => {
            await logout();
            // Redirige vers l'écran de connexion après déconnexion
            navigation.replace('Login');
          },
        },
      ]
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.profileContainer} showsVerticalScrollIndicator={false}>
        {/* ----------------------------------- */}
        {/* SECTION 1: INFORMATIONS UTILISATEUR ET DÉCONNEXION */}
        {/* ----------------------------------- */}
        <View style={styles.profileCard}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Mon Profil</Text>
            {/* Bouton de Déconnexion */}
            <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
              <Feather name="log-out" size={20} color="#fff" />
              <Text style={styles.logoutText}>Déconnexion</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.userInfo}>
            <Image
              source={{ uri: user?.photoUrl || 'https://placehold.co/100x100/A2D2FF/ffffff?text=U' }}
              style={styles.profileImage}
            />
            <Text style={styles.userName}>{user?.name || "Invité"}</Text>
            <Text style={styles.userEmail}>{user?.email || "Email non spécifié"}</Text>
          </View>

          {/* Lignes de Détails */}
          <View style={styles.detailsGroup}>
            <View style={styles.detailRow}>
              <Feather name="phone" size={18} color="#666" style={styles.detailIcon} />
              <Text style={styles.detailText}>{user?.phone || "Non renseigné"}</Text>
            </View>

            <View style={styles.detailRow}>
              <Feather name="map" size={18} color="#666" style={styles.detailIcon} />
              <Text style={styles.detailText}>Ville: {user?.city || "Non renseignée"}</Text>
            </View>

            <View style={styles.detailRow}>
              <Feather name="home" size={18} color="#666" style={styles.detailIcon} />
              <Text style={styles.detailText}>Adresse: {user?.address || "Non renseignée"}</Text>
            </View>
          </View>

          {/* Bouton Modifier */}
          <TouchableOpacity style={styles.editButton} onPress={() => setIsModalVisible(true)}>
            <AntDesign name="setting" size={18} color="#fff" />
            <Text style={styles.editText}>Modifier mes Informations</Text>
          </TouchableOpacity>
        </View>


        {/* ----------------------------------- */}
        {/* SECTION 2: MES ANNONCES */}
        {/* ----------------------------------- */}
        <View style={styles.listingsSection}>
          <Text style={styles.sectionTitle}>Mes Annonces ({mine.length})</Text>

          {mine.length === 0 ? (
            <View style={styles.emptyList}>
              <Ionicons name="document-text-outline" size={50} color="#ccc" />
              <Text style={styles.noItems}>
                Vous n'avez aucune annonce publiée.
              </Text>
            </View>
          ) : (
            <FlatList
              data={mine}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <MyPropertyCard
                  item={item}
                  onEdit={() => navigation.navigate("EditProperty", { property: item })}
                  onDelete={handleDelete}
                />
              )}
              ListFooterComponent={<View style={{ height: 10 }} />}
            />
          )}
        </View>

        <Spinner visible={isLoading} />
      </ScrollView>

      {/* Modal de modification */}
      <ProfileFormModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      />
    </View>
  );
};

export default ProfileScreen;

// --- Styles pour la Carte d'Annonce ---
const propertyStyles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  infoContainer: {
    flex: 1,
    marginRight: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#264653',
    marginBottom: 4,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  location: {
    fontSize: 13,
    color: '#888',
  },
  price: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.greenColors,
    marginTop: 5,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    borderRadius: 8,
    padding: 8,
    marginLeft: 8,
    backgroundColor: '#f5f5f5',
  },
  deleteButton: {
    backgroundColor: '#ffe0e0',
  }
});

// --- Styles généraux du profil ---
const styles = StyleSheet.create({
  profileContainer: {
    flex: 1,
    backgroundColor: "#f7f7f7",
    padding: 20,
  },

  // SECTION 1: Profil
  profileCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#264653",
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e63946',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  logoutText: {
    color: 'white',
    marginLeft: 5,
    fontWeight: '600',
    fontSize: 14,
  },
  userInfo: {
    alignItems: 'center',
    paddingVertical: 10,
    marginBottom: 15,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
    borderWidth: 3,
    borderColor: COLORS.greenColors,
  },
  userName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#264653',
  },
  userEmail: {
    fontSize: 14,
    color: '#888',
    marginTop: 2,
  },
  detailsGroup: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  detailIcon: {
    width: 30,
    textAlign: 'center',
  },
  detailText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
  editButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    padding: 12,
    marginTop: 20,
  },
  editText: {
    color: 'white',
    marginLeft: 10,
    fontWeight: '700',
    fontSize: 16,
  },

  // SECTION 2: Annonces
  listingsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#264653",
  },
  emptyList: {
    padding: 30,
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#eee',
  },
  noItems: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 10,
  },
});