import React from 'react';
import { ScrollView, Text, StyleSheet, SafeAreaView, Image, View } from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { COLORS } from '../../assets/Theme';



export default function HomeScreen() {



  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#e9f5f3' }}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Bannière */}
        <View style={styles.banner}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80' }}
            style={styles.bannerImage}
          />
          <Text style={styles.bannerTitle}>Bienvenue sur SMARTHOME</Text>
        </View>

        <Text style={styles.subtitle}>
          Trouvez ou publiez les meilleures annonces immobilières locales au Cameroun
        </Text>

        {/* Fonctionnalités */}
        <Text style={styles.sectionTitle}>Fonctionnalités</Text>
        <View style={styles.featuresContainer}>
          <View style={styles.featureCard}>
            <Ionicons name="search-outline" size={36} color={COLORS.primary} />
            <Text style={styles.featureText}>Recherche avancée</Text>
          </View>
          <View style={styles.featureCard}>
            <MaterialCommunityIcons name="camera-plus-outline" size={36} color={COLORS.primary} />
            <Text style={styles.featureText}>Publier annonces</Text>
          </View>
          <View style={styles.featureCard}>
            <FontAwesome5 name="user-edit" size={36} color={COLORS.primary} />
            <Text style={styles.featureText}>Gérer vos annonces</Text>
          </View>
          <View style={styles.featureCard}>
            <Ionicons name="chatbox-ellipses-outline" size={36} color={COLORS.primary} />
            <Text style={styles.featureText}>Communiquer</Text>
          </View>
        </View>

        {/* Highlights */}
        <Text style={styles.sectionTitle}>Pourquoi choisir SMARTHOME ?</Text>
        <View style={styles.highlightContainer}>
          <Text style={styles.highlight}>
            <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} /> Recherche pratique avec cartes et filtres avancés
          </Text>
          <Text style={styles.highlight}>
            <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} /> Publication facile d’annonces avec photos
          </Text>
          <Text style={styles.highlight}>
            <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} /> Gestion personnelle simplifiée
          </Text>
          <Text style={styles.highlight}>
            <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} /> Communication intégrée avec les autres utilisateurs
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  banner: {
    position: 'relative',
    marginBottom: 20,
  },
  bannerImage: {
    width: '100%',
    height: 200,
    borderRadius: 15,
  },
  bannerTitle: {
    position: 'absolute',
    bottom: 15,
    left: 20,
    fontSize: 26,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: '#000',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 25,
    color: '#555',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: COLORS.primary,
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  featureCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    marginBottom: 12,
    elevation: 3,
  },
  featureText: {
    marginTop: 10,
    fontWeight: '600',
    textAlign: 'center',
    color: '#264653',
  },
  highlightContainer: {
    marginTop: 10,
  },
  highlight: {
    fontSize: 16,
    marginBottom: 8,
    color: '#555',
  },
});
