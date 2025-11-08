import React from 'react';
import { ScrollView, Text, Image, StyleSheet, Dimensions, View } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { COLORS } from '../../assets/Theme';
import { Video } from 'expo-av';
import FavoriteIcon from '../components/FavoriteIcon.js';
import { PropertyHome } from '../components/Data/defaultProperties';
import { useAuth } from '../../contexts/AuthContext';





type RootStackParamList = {
  Detail: { property: PropertyHome };
  // Assurez-vous d'ajouter cet écran à votre navigateur stack
};

type DetailScreenProps = NativeStackScreenProps<RootStackParamList, 'Detail'>;
// --- FIN Typage ---

const { width } = Dimensions.get('window');

// --- Composant des caractéristiques (Chambres/Salles de bain) pour une meilleure visibilité ---
const FeatureIcon: React.FC<{ iconName: string, value: number, label: string }> = ({ iconName, value, label }) => (
  <View style={styles.featureItem}>
    <FontAwesome5 name={iconName} size={20} color={COLORS.primary} />
    <Text style={styles.featureValue}>{value}</Text>
    <Text style={styles.featureLabel}>{label}</Text>
  </View>
);
// --- FIN Composant des caractéristiques ---

export default function PropertyDetailScreen({ route }: DetailScreenProps) {
  const { property } = route.params;

const { user } = useAuth(); //recuper l'utilisateur connecteur
//LOGIQUE POUR DÉTERMINER QUI EST LE PROPRIÉTAIRE AFFICHÉ
const isCurrentUserOwner = user && property.ownerId === user.id;
const displayedOwnerName = isCurrentUserOwner ? `${user.name} (Moi)` : property.owner;

  const isVideo = (uri: string): boolean => {
    return /\.(mp4|mov|avi|mkv|webm)$/i.test(uri);
  };

  return (
    <ScrollView
      style={styles.detailContainer}
      contentContainerStyle={{ paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >

      {/* ------------------------- */}
      {/* 1. CARROUSEL IMAGES & VIDÉOS */}
      {/* ------------------------- */}
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ width: width * property.images.length, height: 280 }} // Fixe la hauteur
      >
        {property.images.map((uri, index) => (
          <View key={index} style={styles.mediaWrapper}>
            {isVideo(uri) ? (
              <Video
                source={{ uri }}
                style={styles.detailVideo}
                useNativeControls
                resizeMode="cover" // Utilisation de 'cover' pour remplir l'espace
                isLooping
              />
            ) : (
              <Image
                source={{ uri }}
                style={styles.detailImage}
                resizeMode="cover" // Utilisation de 'cover'
              />
            )}
          </View>
        ))}
      </ScrollView>

      <View style={styles.detailInfo}>
        {/* ------------------------- */}
        {/* 2. TITRE, PRIX ET FAVORIS */}
        {/* ------------------------- */}
        <View style={styles.detailHeader}>
          <Text style={styles.detailTitle}>{property.title}</Text>
          <FavoriteIcon propertyId={property.id} style={styles.favoriteIcon} />
        </View>

        <Text style={styles.detailPrice}>
          {property.price.toLocaleString()} FCFA
        </Text>

        {/* ------------------------- */}
        {/* 3. CARACTÉRISTIQUES (Features) */}
        {/* ------------------------- */}
        <View style={styles.featuresContainer}>
          <FeatureIcon
            iconName="bed"
            value={property.bedrooms}
            label="Chambres"
          />
          <FeatureIcon
            iconName="bath"
            value={property.bathrooms}
            label="Salles de bain"
          />
        </View>

        <View style={styles.sectionDivider} />

        {/* ------------------------- */}
        {/* 4. DESCRIPTION */}
        {/* ------------------------- */}
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.detailDesc}>{property.description}</Text>

        <View style={styles.sectionDivider} />

        {/* ------------------------- */}
        {/* 5. LOCALISATION ET CONTACT */}
        {/* ------------------------- */}
        <Text style={styles.sectionTitle}>Localisation & Vendeur</Text>
        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={20} color="#666" style={{ marginRight: 8 }} />
          <Text style={styles.detailLocation}>{property.location}</Text>
        </View>

        <View style={styles.ownerRow}>
          <Ionicons name="person-circle-outline" size={20} color="#666" style={{ marginRight: 8 }} />
          {/* <Text style={styles.detailOwner}>Publié par: {property.ownerId}</Text> */}
          <Text style={styles.detailOwner}>Publié par: {displayedOwnerName}</Text>
        </View>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  detailContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  // MEDIA
  mediaWrapper: {
    width: width,
    height: 280,
  },
  detailImage: {
    width: '100%',
    height: '100%',
  },
  detailVideo: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000', // Fond noir pour les vidéos
  },

  // INFOS GÉNÉRALES
  detailInfo: {
    padding: 20,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#264653',
    flexShrink: 1,
  },
  favoriteIcon: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
  },
  detailPrice: {
    fontSize: 22,
    color: COLORS.greenColors,
    fontWeight: '800',
    marginBottom: 20,
  },

  // CARACTÉRISTIQUES (Features)
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#e9f5f3',
    borderRadius: 12,
    paddingVertical: 15,
    marginBottom: 20,
  },
  featureItem: {
    alignItems: 'center',
    marginHorizontal: 15,
  },
  featureValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 5,
    color: '#264653',
  },
  featureLabel: {
    fontSize: 14,
    color: '#777',
    marginTop: 2,
  },

  // SECTIONS ET TEXTE
  sectionDivider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#264653',
    marginBottom: 10,
  },
  detailDesc: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
  },

  // LOCALISATION & PROPRIÉTAIRE
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  detailLocation: {
    fontSize: 16,
    color: '#444',
  },
  ownerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  detailOwner: {
    fontSize: 15,
    fontStyle: 'italic',
    color: '#777',
  },
});