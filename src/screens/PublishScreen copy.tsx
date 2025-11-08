import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Button, Alert, Text, ScrollView, Image, TouchableOpacity, Platform, KeyboardAvoidingView, } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Video } from 'expo-av';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

// Contextes et composants
import { useProperties } from '../../contexts/PropertyContext';
import { useAuth } from '../../contexts/AuthContext'; // <--- IMPORT AJOUTÉ
import Spinner from '../components/Spinner';
import { useToast } from 'react-native-toast-notifications';

// Icônes
import { AntDesign, Ionicons } from '@expo/vector-icons';


// Définition du typage de navigation (ajustez selon votre structure réelle)
type RootStackParamList = {
  Publish: undefined;
  // Ajoutez d'autres écrans si nécessaire
};

type PublishScreenProps = NativeStackScreenProps<RootStackParamList, 'Publish'>;

// Schéma de validation avec Yup pour les champs du formulaire
const validationSchema = Yup.object().shape({
  title: Yup.string().required('Le titre est obligatoire'),
  price: Yup.number().typeError('Le prix doit être un nombre').positive('Le prix doit être positif').required('Le prix est obligatoire'),
  description: Yup.string().required('La description est obligatoire'),
  location: Yup.string().required('La localisation est obligatoire'),
  bedrooms: Yup.number().typeError('Le nombre de chambres doit être un nombre').min(0, 'Doit être positif').required('Nombre de chambres requis'),
  bathrooms: Yup.number().typeError('Le nombre de salles de bain doit être un nombre').min(0, 'Doit être positif').required('Nombre de salles de bain requis'),
  images: Yup.array().min(1, 'Au moins une image est requise'),
});

export default function PublishScreen({ navigation }: PublishScreenProps) {
  const { addProperty } = useProperties();
  const { user } = useAuth(); // <--- UTILISATION DU CONTEXTE AUTH
  const Toast = useToast();
  const [imageUris, setImageUris] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Demande les permissions et ouvre la galerie pour sélectionner plusieurs images
  const pickImages = async () => {
    // Demander la permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission refusée', 'L\'accès à la galerie est nécessaire pour choisir des photos.');
      return;
    }

    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        allowsMultipleSelection: true,
        quality: 0.7,
        mediaTypes: ImagePicker.MediaTypeOptions.All, // Permet images et vidéos
      });

      if (!result.canceled) {
        const uris = result.assets ? result.assets.map(asset => asset.uri) : [];
        setImageUris((prev) => [...prev, ...uris]);

        // Mettre à jour Formik manuellement (bien que Formik soit mis à jour dans onSubmit)
        // C'est juste pour s'assurer que Yup voie la liste dans la validation live
        // Pas nécessaire ici mais bonne pratique si la validation est en temps réel
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de sélectionner des images.');
      console.error('Erreur de sélection d\'images:', error);
    }
  };

  // Supprimer une image choisie
  const removeImage = (uri: string) => {
    setImageUris((prev) => prev.filter(imgUri => imgUri !== uri));
  };

  const isVideo = (uri: string): boolean => {
    return /\.(mp4|mov|avi|mkv|webm)$/i.test(uri); // Vérifie l'extension video
  };


  return (
    <Formik
      initialValues={{
        title: '',
        price: '',
        description: '',
        location: '',
        bedrooms: '',
        bathrooms: '',
        images: [], // Ceci est utilisé uniquement pour la validation Yup
      }}
      validationSchema={validationSchema}
      onSubmit={(values, { resetForm }) => {

        if (!user?.id) {
          Alert.alert('Erreur', 'Vous devez être connecté pour publier une annonce.');
          return;
        }

        // --- CRITIQUE : AJOUT DU ownerId DE L'UTILISATEUR ---
        const newProperty = {
          id: Date.now(),
          title: values.title,
         
         price: parseInt(values.price),
          description: values.description,
          location: values.location,
      
          bedrooms: parseInt(values.bedrooms),
          bathrooms: parseInt(values.bathrooms),
          images: imageUris,
          owner: user.name || 'Inconnu', // Affichage
          ownerId: user.id, // <--- SOLUTION : AJOUT DU ownerId POUR LE FILTRAGE !
        };

        setIsLoading(true);
        setTimeout(() => {
          addProperty(newProperty);
          setIsLoading(false);
          Toast.show("Annonce publiée !", {
            type: 'success',
            placement: "top",
            duration: 2000,
         //   offset: 90,
            animationType: "zoom-in",
            successIcon: <Ionicons name="checkmark-circle-sharp" size={24} color="white" />
          });
          resetForm();
          setImageUris([]);
        }, 1500);


      }}
    >
      {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1, backgroundColor: '#e9f5f3' }}
        >
          <ScrollView contentContainerStyle={styles.container}>
            {/* Champs texte */}
            <TextInput
              style={styles.input}
              placeholder="Titre"
              onChangeText={handleChange('title')}
              onBlur={handleBlur('title')}
              value={values.title}
            />
            {touched.title && errors.title && <Text style={styles.errorText}>{errors.title}</Text>}

            <TextInput
              style={styles.input}
              placeholder="Prix (FCFA)"
              keyboardType="numeric"
              onChangeText={handleChange('price')}
              onBlur={handleBlur('price')}
              value={values.price}
            />
            {touched.price && errors.price && <Text style={styles.errorText}>{errors.price}</Text>}

            <TextInput
              style={[styles.input, { height: 80 }]}
              placeholder="Description"
              multiline
              onChangeText={handleChange('description')}
              onBlur={handleBlur('description')}
              value={values.description}
            />
            {touched.description && errors.description && <Text style={styles.errorText}>{errors.description}</Text>}

            <TextInput
              style={styles.input}
              placeholder="Localisation"
              onChangeText={handleChange('location')}
              onBlur={handleBlur('location')}
              value={values.location}
            />
            {touched.location && errors.location && <Text style={styles.errorText}>{errors.location}</Text>}

            <TextInput
              style={styles.input}
              placeholder="Nombre de chambres"
              keyboardType="numeric"
              onChangeText={handleChange('bedrooms')}
              onBlur={handleBlur('bedrooms')}
              value={values.bedrooms}
            />
            {touched.bedrooms && errors.bedrooms && <Text style={styles.errorText}>{errors.bedrooms}</Text>}

            <TextInput
              style={styles.input}
              placeholder="Nombre de salles de bain"
              keyboardType="numeric"
              onChangeText={handleChange('bathrooms')}
              onBlur={handleBlur('bathrooms')}
              value={values.bathrooms}
            />
            {touched.bathrooms && errors.bathrooms && <Text style={styles.errorText}>{errors.bathrooms}</Text>}

            {/* Sélecteur d’images */}
            <View style={styles.imagePickerContainer}>
              <Button color="#2a9d8f" title={`Choisir des photos/vidéos (${imageUris.length})`} onPress={pickImages} />
              {imageUris.length === 0 && <Text style={styles.errorText}>Au moins une image ou vidéo est requise.</Text>}

              {/* Aperçu des images sélectionnées  */}
              <ScrollView horizontal showsHorizontalScrollIndicator={true} style={styles.imagePreviewContainer}>
                {imageUris.map((uri) => {
                  return (
                    <View key={uri} style={styles.imageWrapper}>
                      {isVideo(uri) ? (
                        <Video
                          source={{ uri }}
                          style={styles.videoPreview}
                          useNativeControls
                          resizeMode="cover"
                          isLooping
                        />
                      ) : (
                        <Image source={{ uri }} style={styles.imagePreview} />
                      )}
                      <TouchableOpacity style={styles.removeButton} onPress={() => removeImage(uri)}>
                        <Text style={styles.removeButtonText}>X</Text>
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </ScrollView>

            </View>

            {/* Bouton soumettre */}
            <TouchableOpacity style={styles.submitButton} onPress={() => {
              // Valide aussi la présence d'au moins une image avant soumission
              if (imageUris.length === 0) {
                Alert.alert('Erreur', 'Veuillez sélectionner au moins une image ou vidéo.');
                return;
              }
              // Met à jour la value images dans Formik pour la validation
              values.images = imageUris as any; // Type assertion pour la validation
              handleSubmit();
            }}>
              <Text style={styles.submitButtonText}>Publier l'Annonce</Text>
            </TouchableOpacity>
            <Spinner visible={isLoading} />
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </Formik>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 50, // pour laisser de l'espace en bas
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
    marginBottom: 12,
    fontSize: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  errorText: {
    color: '#e63946',
    marginBottom: 8,
    fontWeight: '500',
  },
  imagePickerContainer: {
    marginTop: 10,
    marginBottom: 20,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  imagePreviewContainer: {
    marginTop: 10,
    maxHeight: 120,
  },
  videoPreview: {
    width: 100,
    height: 100,
    borderRadius: 12,
    backgroundColor: '#000',
  },
  imageWrapper: {
    position: 'relative',
    marginRight: 10,
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 12,
  },
  removeButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#e63946',
    borderRadius: 14,
    width: 26,
    height: 26,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  removeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  submitButton: {
    backgroundColor: '#2a9d8f',
    height: 55,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 18,
  },
});