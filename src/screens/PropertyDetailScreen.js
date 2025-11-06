import React from 'react';
import { ScrollView, Text, Image, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';
import { COLORS } from '../../assets/Theme';
import { Video } from 'expo-av';
import FavoriteIcon from '../components/FavoriteIcon.js';

const { width } = Dimensions.get('window');

export default function PropertyDetailScreen({ route }) { //1:image 2:video 3:image et video paq de video seule
  const { property } = route.params;

  return (
    <ScrollView style={styles.detailContainer} contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
      <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={true}>

        {/* {property.images.map((imgUri, index) => (
          <Image key={index} source={{ uri: imgUri }} style={styles.detailImage} />
        ))} */}

        {property.images.map((uri, index) => {
          const isVideo = uri.match(/\.(mp4|mov|avi|mkv|webm)$/i); // Vérifie si c'est une vidéo par extension

          if (isVideo) {
            return (
              <Video
                key={index}
                source={{ uri }}
                style={styles.detailVideo}
                useNativeControls
                resizeMode="contain"
                isLooping
              />
            );
          } else {
            return (
              <Image
                key={index}
                source={{ uri }}
                style={styles.detailImage}
              />
            );
          }
        })}

        {/* {property.images.map((uri) => {
          const isVideo = uri.match(/\.(mp4|mov|avi|mkv|webm)$/i);

          return isVideo ? (
            <Video
              key={uri}
              source={{ uri }}
              style={styles.detailVideo}
              useNativeControls
              resizeMode="contain"
              isLooping
            />
          ) : (
            <Image
              key={uri}
              source={{ uri }}
              style={styles.detailImage}
            />
          );
        })} */}

      </ScrollView>

      <View style={styles.detailInfo}>
        {/* Titre + favori */}
        <View style={styles.detailHeader}>
          <Text style={styles.detailTitle}>{property.title}</Text>
          <FavoriteIcon propertyId={property.id} style={{ marginLeft: 8 }} />
        </View>
        {/* <Text style={styles.detailTitle}>{property.title}</Text> */}
        <Text style={styles.detailPrice}>{property.price.toLocaleString()} FCFA</Text>
        <Text style={styles.detailLocation}><Ionicons name="location-outline" size={18} /> {property.location}</Text>
        <Text style={styles.detailDesc}>{property.description}</Text>
        <Text style={styles.detailFeatures}>Chambres : {property.bedrooms} | Salles de bain : {property.bathrooms}</Text>
        <Text style={styles.detailOwner}>Propriétaire : {property.owner}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  detailContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  detailImage: {
    width,
    height: 280,
  },
  detailVideo: {
    width: '100%', // ou une taille fixe, selon votre mise en page
    height: 200,   // ajustez selon besoin
    borderRadius: 12,
    marginBottom: 10,
  },
  detailInfo: {
    padding: 20,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingRight: 20
  },
  detailTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#264653',
  },
  detailPrice: {
    fontSize: 20,
    color: COLORS.greenColors,
    fontWeight: '700',
    marginBottom: 8,
  },
  detailLocation: {
    fontSize: 16,
    marginBottom: 15,
    color: 'gray',
  },
  detailDesc: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 15,
  },
  detailFeatures: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 7,
  },
  detailOwner: {
    fontSize: 15,
    fontStyle: 'italic',
    color: '#777',
  },
});
