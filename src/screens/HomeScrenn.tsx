import React from 'react';
import { ScrollView, Text, StyleSheet, SafeAreaView, Image, View } from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
// Importation du contexte de thème
import { useTheme } from '../../contexts/ThemeContext';
// Assurez-vous d'importer FONTS si vous l'utilisez pour les styles (non inclus dans le code fourni, mais bonne pratique)
// import { FONTS } from '../../assets/Theme'; 

export default function HomeScreen() {
  // 1. Utiliser le hook useTheme pour accéder aux variables globales
  const { colors, currentFontScale } = useTheme();

  // Fonction pour ajuster dynamiquement la taille de la police
  const adjustFontSize = (baseSize) => baseSize * currentFontScale;

  // Remplacement de tous les styles pour utiliser les couleurs et l'échelle de police du contexte
  return (
    // Utiliser colors.background pour le SafeAreaView
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Bannière */}
        <View style={styles.banner}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80' }}
            style={styles.bannerImage}
          />
          <Text style={[styles.bannerTitle, { fontSize: adjustFontSize(26) }]}>
            Bienvenue sur SMARTHOME
          </Text>
        </View>

        <Text style={[styles.subtitle, { color: colors.textSecondary, fontSize: adjustFontSize(16) }]}>
          Trouvez ou publiez les meilleures annonces immobilières locales au Cameroun
        </Text>

        {/* Fonctionnalités */}
        {/* Utiliser colors.textPrimary ou secondary pour les titres de section */}
        <Text style={[styles.sectionTitle, { color: colors.primary, fontSize: adjustFontSize(20) }]}>
          Fonctionnalités
        </Text>
        <View style={styles.featuresContainer}>
          {/* Les featureCard utilisent colors.surface pour le fond */}
          <View style={[styles.featureCard, { backgroundColor: colors.surface }]}>
            <Ionicons name="search-outline" size={adjustFontSize(36)} color={colors.accent} />
            <Text style={[styles.featureText, { color: colors.secondary, fontSize: adjustFontSize(14) }]}>Recherche avancée</Text>
          </View>
          <View style={[styles.featureCard, { backgroundColor: colors.surface }]}>
            <MaterialCommunityIcons name="camera-plus-outline" size={adjustFontSize(36)} color={colors.accent} />
            <Text style={[styles.featureText, { color: colors.secondary, fontSize: adjustFontSize(14) }]}>Publier annonces</Text>
          </View>
          <View style={[styles.featureCard, { backgroundColor: colors.surface }]}>
            <FontAwesome5 name="user-edit" size={adjustFontSize(36)} color={colors.accent} />
            <Text style={[styles.featureText, { color: colors.secondary, fontSize: adjustFontSize(14) }]}>Gérer vos annonces</Text>
          </View>
          <View style={[styles.featureCard, { backgroundColor: colors.surface }]}>
            <Ionicons name="chatbox-ellipses-outline" size={adjustFontSize(36)} color={colors.accent} />
            <Text style={[styles.featureText, { color: colors.secondary, fontSize: adjustFontSize(14) }]}>Communiquer</Text>
          </View>
        </View>

        {/* Highlights */}
        <Text style={[styles.sectionTitle, { color: colors.primary, fontSize: adjustFontSize(20) }]}>
          Pourquoi choisir SMARTHOME ?
        </Text>
        <View style={styles.highlightContainer}>
          <Text style={[styles.highlight, { color: colors.textPrimary, fontSize: adjustFontSize(16) }]}>
            <Ionicons name="checkmark-circle" size={adjustFontSize(20)} color={colors.primary} /> Recherche pratique avec cartes et filtres avancés
          </Text>
          <Text style={[styles.highlight, { color: colors.textPrimary, fontSize: adjustFontSize(16) }]}>
            <Ionicons name="checkmark-circle" size={adjustFontSize(20)} color={colors.primary} /> Publication facile d’annonces avec photos
          </Text>
          <Text style={[styles.highlight, { color: colors.textPrimary, fontSize: adjustFontSize(16) }]}>
            <Ionicons name="checkmark-circle" size={adjustFontSize(20)} color={colors.primary} /> Gestion personnelle simplifiée
          </Text>
          <Text style={[styles.highlight, { color: colors.textPrimary, fontSize: adjustFontSize(16) }]}>
            <Ionicons name="checkmark-circle" size={adjustFontSize(20)} color={colors.primary} /> Communication intégrée avec les autres utilisateurs
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Les styles restent en grande partie inchangés, mais nous ajoutons la propriété safeArea
// pour éviter d'appliquer le style de fond deux fois et simplifier la lisibilité.
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    // La couleur de fond sera définie dynamiquement dans le composant
  },
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
    // Reste blanc pour garantir la lisibilité sur l'image
    color: 'white',
    fontWeight: 'bold',
    textShadowColor: '#000',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  subtitle: {
    // Les couleurs et tailles sont définies dynamiquement dans le composant
    lineHeight: 24,
    marginBottom: 25,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 12,
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  featureCard: {
    width: '48%',
    // La couleur de fond est définie dynamiquement
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
    // La couleur est définie dynamiquement
  },
  highlightContainer: {
    marginTop: 10,
  },
  highlight: {
    marginBottom: 8,
    // Les couleurs et tailles sont définies dynamiquement
  },
});