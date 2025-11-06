import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Button, Alert, Text, ScrollView, Image, TouchableOpacity, Platform, KeyboardAvoidingView, } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useProperties } from '../../contexts/PropertyContext';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Video } from 'expo-av';
import Spinner from '../components/Spinner';
import { useToast } from 'react-native-toast-notifications';
import { AntDesign, Ionicons } from '@expo/vector-icons';


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

export default function PublishScreen() {
  const { addProperty } = useProperties();
  const Toast = useToast();
  const [imageUris, setImageUris] = useState([]);
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
        mediaTypes: ['images', 'videos'], // pour ne sélectionner que les images  mediaTypes: ['images', 'videos'] pour les vidéos,
      });

      if (!result.canceled) {
        // Si sélection multiple, concatène sinon ajoute un seul
        // const uris = result.selected ? result.selected.map(img => img.uri) : [result.uri];
        const uris = result.assets ? result.assets.map(asset => asset.uri) : [];

        //console.log('Images sélectionnées:', uris);
        setImageUris((prev) => [...prev, ...uris]);
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de sélectionner des images.');
      console.error('Erreur de sélection d\'images:', error);
    }
  };

  // Supprimer une image choisie
  const removeImage = (uri) => {
    setImageUris((prev) => prev.filter(imgUri => imgUri !== uri));
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
        images: [],
      }}
      validationSchema={validationSchema}
      onSubmit={(values, { resetForm }) => {
        // Remplacer images par la liste des URIs sélectionnées
        const newProperty = {
          id: Date.now().toString(),
          title: values.title,
          price: parseInt(values.price),
          description: values.description,
          location: values.location,
          bedrooms: parseInt(values.bedrooms),
          bathrooms: parseInt(values.bathrooms),
          images: imageUris,
          owner: 'Vous',
        };

        // addProperty(newProperty);
        // Alert.alert('Succès', 'Annonce publiée avec succès!');
        // resetForm();
        // setImageUris([]);


        setIsLoading(true);
        setTimeout(() => {
          addProperty(newProperty);
          setIsLoading(false);
          Toast.show("Annonce publiée !", {
            type: 'success',
            placement: "top",
            duration: 2000,
            offset: 90,
            animationType: "zoom-in", // "slide-in" | "zoom-in" | "fade-in"
            dangerIcon: <AntDesign name="closecircle" size={24} color="white" />,
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
              <Button title="Choisir des photos" onPress={pickImages} />
              {errors.images && <Text style={styles.errorText}>{errors.images}</Text>}

              {/* Aperçu des images sélectionnées  */}

              {/* <ScrollView horizontal showsHorizontalScrollIndicator={true} style={styles.imagePreviewContainer}>
                {imageUris.map((uri) => (
                  <View key={uri} style={styles.imageWrapper}>
                    <Image source={{ uri:uri }} style={styles.imagePreview} /> 
                    <TouchableOpacity style={styles.removeButton} onPress={() => removeImage(uri)}>
                      <Text style={styles.removeButtonText}>X</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView> */}

              <ScrollView horizontal showsHorizontalScrollIndicator={true} style={styles.imagePreviewContainer}>
                {imageUris.map((uri) => {
                  const isVideo = uri.match(/\.(mp4|mov|avi|mkv|webm)$/i); // Vérifie l'extension video
                  console.log('URI de l\'image ou vidéo:', uri, 'Est-ce une vidéo ?', isVideo);
                  return (
                    <View key={uri} style={styles.imageWrapper}>
                      {isVideo ? (
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
                Alert.alert('Erreur', 'Veuillez sélectionner au moins une image.');
                return;
              }
              // Met à jour la value images dans Formik pour la validation
              values.images = imageUris;
              handleSubmit();
            }}>
              <Text style={styles.submitButtonText}>Publier</Text>
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
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
    marginBottom: 12,
    fontSize: 16,
    elevation: 2,
  },
  errorText: {
    color: '#e63946',
    marginBottom: 8,
  },
  imagePickerContainer: {
    marginTop: 10,
    marginBottom: 20,
  },
  imagePreviewContainer: {
    marginTop: 10,
  },
  videoPreview: {
    width: 100,
    height: 100,
    borderRadius: 12,
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
  },
  removeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#2a9d8f',
    height: 50,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 18,
  },
});
