import React from 'react';
import {
  ScrollView,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  View,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Video } from 'expo-av';
import FavoriteIcon from '../components/FavoriteIcon.js';
import { PropertyHome } from '../components/Data/defaultProperties';
import { COLORS } from '../../assets/Theme';
import { useAuth } from '../../contexts/AuthContext';
import { MotiView } from 'moti'; // Pour les animations fluides

type RootStackParamList = {
  Detail: { property: PropertyHome };
};

type DetailScreenProps = NativeStackScreenProps<RootStackParamList, 'Detail'>;

const { width } = Dimensions.get('window');

// ✅ Composant caractéristique animé
const FeatureIcon: React.FC<{ iconName: string; value: number; label: string }> = ({
  iconName,
  value,
  label,
}) => (
  <MotiView
    from={{ opacity: 0, translateY: 15 }}
    animate={{ opacity: 1, translateY: 0 }}
    transition={{ type: 'timing', duration: 600 }}
    style={styles.featureItem}
  >
    <FontAwesome5 name={iconName} size={22} color={COLORS.primary} />
    <Text style={styles.featureValue}>{value}</Text>
    <Text style={styles.featureLabel}>{label}</Text>
  </MotiView>
);

export default function PropertyDetailScreen({ route }: DetailScreenProps) {
  const { property } = route.params;
  const { user } = useAuth();

  const isCurrentUserOwner = user && property.ownerId === user.id;
  const displayedOwnerName = isCurrentUserOwner ? `${user.name} (Moi)` : property.owner;

  const isVideo = (uri: string): boolean => /\.(mp4|mov|avi|mkv|webm)$/i.test(uri);

  const handleContact = () => {
    const phone = '237690373513'; // exemple à personnaliser
    Linking.openURL(`https://wa.me/${phone}?text=Bonjour, je suis intéressé par votre bien "${property.title}"`);
  };

  return (
    <ScrollView
      style={styles.detailContainer}
      contentContainerStyle={{ paddingBottom: 60 }}
      showsVerticalScrollIndicator={false}
    >
      {/* 1️⃣ CARROUSEL IMAGES/VIDÉOS */}
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          width: width * property.images.length,
          height: 300,
        }}
      >
        {property.images.map((uri, index) => (
          <View key={index} style={styles.mediaWrapper}>
            {isVideo(uri) ? (
              <>
                <Video
                  source={{ uri }}
                  style={styles.detailVideo}
                  useNativeControls
                  resizeMode="cover"
                  isLooping
                />
                <View style={styles.videoBadge}>
                  <Ionicons name="videocam" size={16} color="white" />
                  <Text style={styles.videoBadgeText}>Vidéo</Text>
                </View>
              </>
            ) : (
              <Image source={{ uri }} style={styles.detailImage} resizeMode="cover" />
            )}
          </View>
        ))}
      </ScrollView>

      {/* 2️⃣ INFOS GÉNÉRALES */}
      <View style={styles.detailCard}>
        <View style={styles.detailHeader}>
          <Text style={styles.detailTitle}>{property.title}</Text>
          <FavoriteIcon propertyId={property.id} style={styles.favoriteIcon} />
        </View>

        <View style={styles.priceBadge}>
          <Text style={styles.detailPrice}>{property.price.toLocaleString()} FCFA</Text>
        </View>

        {/* 3️⃣ CARACTÉRISTIQUES */}
        <View style={styles.featuresContainer}>
          <FeatureIcon iconName="bed" value={property.bedrooms} label="Chambres" />
          <FeatureIcon iconName="bath" value={property.bathrooms} label="Salles de bain" />
        </View>

        <View style={styles.sectionDivider} />

        {/* 4️⃣ DESCRIPTION */}
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.detailDesc}>{property.description}</Text>

        <View style={styles.sectionDivider} />

        {/* 5️⃣LOCALISATION & VENDEUR */}
        <Text style={styles.sectionTitle}>Localisation & Vendeur</Text>
        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={20} color="#666" style={{ marginRight: 8 }} />
          <Text style={styles.detailLocation}>{property.location}</Text>
        </View>

        <View style={styles.ownerRow}>
          <Ionicons name="person-circle-outline" size={22} color="#666" style={{ marginRight: 8 }} />
          <Text style={styles.detailOwner}>Publié par : {displayedOwnerName}</Text>
        </View>

        {/* 6️⃣ BOUTON DE CONTACT */}
        {!isCurrentUserOwner && (
          <TouchableOpacity style={styles.contactButton} onPress={handleContact}>
            <Ionicons name="logo-whatsapp" size={22} color="white" />
            <Text style={styles.contactButtonText}>Contacter le vendeur</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  detailContainer: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  mediaWrapper: {
    width,
    height: 300,
    position: 'relative',
  },
  detailImage: {
    width: '100%',
    height: '100%',
  },
  detailVideo: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
  },
  videoBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.6)',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  videoBadgeText: {
    color: 'white',
    fontSize: 12,
    marginLeft: 4,
  },
  detailCard: {
    margin: 16,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 18,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#264653',
    flexShrink: 1,
  },
  favoriteIcon: {
    backgroundColor: '#f1f1f1',
    padding: 8,
    borderRadius: 50,
  },
  priceBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#2a9d8f',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
    marginTop: 10,
    marginBottom: 16,
  },
  detailPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#e9f5f3',
    borderRadius: 14,
    paddingVertical: 15,
    marginBottom: 20,
  },
  featureItem: {
    alignItems: 'center',
  },
  featureValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#264653',
    marginTop: 5,
  },
  featureLabel: {
    fontSize: 13,
    color: '#777',
  },
  sectionDivider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#264653',
    marginBottom: 8,
  },
  detailDesc: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
  },
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
  },
  detailOwner: {
    fontSize: 15,
    fontStyle: 'italic',
    color: '#777',
  },
  contactButton: {
    marginTop: 20,
    backgroundColor: '#25D366',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 10,
  },
  contactButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
