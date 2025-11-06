import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Image, Button, Platform, KeyboardAvoidingView } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import * as ImagePicker from 'expo-image-picker';
import { useProperties } from '../../contexts/PropertyContext';
import { useToast } from 'react-native-toast-notifications';
import Spinner from '../components/Spinner';
import { AntDesign, Ionicons } from '@expo/vector-icons';



export default function EditPropertyScreen({ route, navigation }) {
  const { modifyProperty } = useProperties();
  const { property } = route.params;
  const Toast = useToast();
  // Gestion locale des images, on initialise avec les images existantes
  const [imageUris, setImageUris] = useState(property.images || []);
  const [isLoading, setIsLoading] = useState(false);


  // Fonction pour choisir des images
  const pickImages = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission refusée', "L'accès à la galerie est nécessaire pour choisir des photos.");
      return;
    }
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        allowsMultipleSelection: true,
        quality: 0.7,
        mediaTypes: ['images', 'videos'],
      });
      if (!result.canceled) {
        // const uris = result.selected ? result.selected.map(img => img.uri) : [result.uri];
        const uris = result.assets ? result.assets.map(asset => asset.uri) : [];
        setImageUris((prev) => [...prev, ...uris]);
      }
    } catch (error) {
      Alert.alert('Erreur', "Impossible de sélectionner des images.");
    }
  };

  // Supprimer une image
  const removeImage = (uri) => {
    setImageUris((prev) => prev.filter(imgUri => imgUri !== uri));
  };

  const handleSubmit = (values) => {
    if (imageUris.length === 0) {
      Alert.alert('Erreur', 'Veuillez sélectionner au moins une image.');
      return;
    }
    // Intégrer les images modifiées dans la propriété
    // modifyProperty({ ...property, ...values, price: parseInt(values.price), bedrooms: parseInt(values.bedrooms), bathrooms: parseInt(values.bathrooms), images: imageUris });
    // Alert.alert('Annonce modifiée avec succès');
    // navigation.goBack();

    setIsLoading(true);
    setTimeout(() => {
      modifyProperty({ ...property, ...values, price: parseInt(values.price), bedrooms: parseInt(values.bedrooms), bathrooms: parseInt(values.bathrooms), images: imageUris });
      setIsLoading(false);
      Toast.show("Annonce modifiée avec succès !", {
        type: 'success',
        placement: "top",
        duration: 2000,
        offset: 90,
        animationType: "zoom-in", // "slide-in" | "zoom-in" | "fade-in"
         dangerIcon: <AntDesign name="closecircle" size={24} color="white" />,
          successIcon:<Ionicons name="checkmark-circle-sharp" size={24} color="white" />
      });
      navigation.goBack();
    }, 1500);
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1, backgroundColor: '#e9f5f3' }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Formik
          initialValues={{
            title: property.title,
            price: property.price.toString(),
            description: property.description,
            location: property.location,
            bedrooms: property.bedrooms.toString(),
            bathrooms: property.bathrooms.toString(),
            images: imageUris,
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize={true} // permet de recalculer initialValues quand imageUris change
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
            <View>
              <TextInput
                style={styles.input}
                onChangeText={handleChange('title')}
                onBlur={handleBlur('title')}
                value={values.title}
                placeholder="Titre"
              />
              {touched.title && errors.title && <Text style={styles.error}>{errors.title}</Text>}

              <TextInput
                style={styles.input}
                onChangeText={handleChange('price')}
                onBlur={handleBlur('price')}
                value={values.price}
                placeholder="Prix"
                keyboardType="numeric"
              />
              {touched.price && errors.price && <Text style={styles.error}>{errors.price}</Text>}

              <TextInput
                style={[styles.input, { height: 80 }]}
                onChangeText={handleChange('description')}
                onBlur={handleBlur('description')}
                value={values.description}
                placeholder="Description"
                multiline
              />
              {touched.description && errors.description && <Text style={styles.error}>{errors.description}</Text>}

              <TextInput
                style={styles.input}
                onChangeText={handleChange('location')}
                onBlur={handleBlur('location')}
                value={values.location}
                placeholder="Localisation"
              />
              {touched.location && errors.location && <Text style={styles.error}>{errors.location}</Text>}

              <TextInput
                style={styles.input}
                onChangeText={handleChange('bedrooms')}
                onBlur={handleBlur('bedrooms')}
                value={values.bedrooms}
                placeholder="Nombre de chambres"
                keyboardType="numeric"
              />
              {touched.bedrooms && errors.bedrooms && <Text style={styles.error}>{errors.bedrooms}</Text>}

              <TextInput
                style={styles.input}
                onChangeText={handleChange('bathrooms')}
                onBlur={handleBlur('bathrooms')}
                value={values.bathrooms}
                placeholder="Nombre de salles de bain"
                keyboardType="numeric"
              />
              {touched.bathrooms && errors.bathrooms && <Text style={styles.error}>{errors.bathrooms}</Text>}

              {/* Choix des images */}
              <View style={styles.imagePickerContainer}>
                <Button title="Modifier les photos" onPress={pickImages} />
                {touched.images && errors.images && <Text style={styles.error}>{errors.images}</Text>}

                <ScrollView horizontal showsHorizontalScrollIndicator={true} style={styles.imagePreviewContainer}>
                  {imageUris.map((uri) => (
                    <View key={uri} style={styles.imageWrapper}>
                      <Image source={{ uri }} style={styles.imagePreview} />
                      <TouchableOpacity style={styles.removeButton} onPress={() => removeImage(uri)}>
                        <Text style={styles.removeButtonText}>X</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </ScrollView>
              </View>

              <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Modifier l'annonce</Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>
        <Spinner visible={isLoading} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    fontSize: 16,
  },
  error: {
    color: 'red',
    marginBottom: 6,
  },
  button: {
    marginTop: 20,
    backgroundColor: '#2a9d8f',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  imagePickerContainer: {
    marginTop: 10,
    marginBottom: 20,
  },
  imagePreviewContainer: {
    marginTop: 10,
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
});
