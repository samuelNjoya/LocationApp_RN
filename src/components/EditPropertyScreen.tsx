import React, { useState } from "react";
import {View,Text,TextInput,TouchableOpacity,StyleSheet,Alert,ScrollView,Image,Button,Platform,KeyboardAvoidingView,} from "react-native";
import { Formik } from "formik";
import * as ImagePicker from "expo-image-picker";
import { useProperties } from "../../contexts/PropertyContext";
import { useToast } from "react-native-toast-notifications";
import Spinner from "./Spinner";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { propretyHomeValidation } from "../../utils/propertyHomeValidation";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { PropertyHome } from "./Data/defaultProperties";

type RootStackParamList = {
  EditProperty: { property: PropertyHome };
};

type EditPropertyScreenProps = NativeStackScreenProps<RootStackParamList, "EditProperty">;

interface FormValues {
  title: string;
  price: string;  // car onChangeValue dans les textInput travail avec des string on pourra donc convertir avant d'afficher
  description: string;
  location: string;
  bedrooms: string; //idem
  bathrooms: string; //idem
  images: string[];
}

const EditPropertyScreen: React.FC<EditPropertyScreenProps> = ({ route, navigation }) => {
  const { modifyProperty } = useProperties();
  const { property } = route.params;
  const Toast = useToast();

  const [imageUris, setImageUris] = useState<string[]>(property.images || []);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // --- Choisir des images ---
  const pickImages = async (): Promise<void> => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission refusée", "L'accès à la galerie est nécessaire pour choisir des photos.");
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsMultipleSelection: true,
        quality: 0.7,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
      });

      if (!result.canceled && result.assets) {
        const uris = result.assets.map((asset) => asset.uri);
        setImageUris((prev) => [...prev, ...uris]);
      }
    } catch (error) {
      Alert.alert("Erreur", "Impossible de sélectionner des images.");
    }
  };

  const removeImage = (uri: string): void => {
    setImageUris((prev) => prev.filter((imgUri) => imgUri !== uri));
  };

  const handleSubmit = (values: FormValues): void => {
    if (imageUris.length === 0) {
      Alert.alert("Erreur", "Veuillez sélectionner au moins une image.");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      modifyProperty({
        ...property,
        ...values,
        price: parseInt(values.price),
        bedrooms: parseInt(values.bedrooms),
        bathrooms: parseInt(values.bathrooms),
        images: imageUris,
      });
      setIsLoading(false);
      Toast.show("Annonce modifiée avec succès !", {
        type: "success",
        placement: "top",
        duration: 2000,
       // offset: 90,
        animationType: "zoom-in",
        successIcon: <Ionicons name="checkmark-circle-sharp" size={24} color="white" />,
        dangerIcon: <AntDesign name="close-circle" size={24} color="white" />,
      });
      navigation.goBack();
    }, 1500);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: "#e9f5f3" }}
    >
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
          validationSchema={propretyHomeValidation}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <View>
              <TextInput
                style={styles.input}
                placeholder="Titre"
                value={values.title}
                onChangeText={handleChange("title")}
                onBlur={handleBlur("title")}
              />
              {touched.title && errors.title && <Text style={styles.error}>{errors.title}</Text>}

              <TextInput
                style={styles.input}
                placeholder="Prix"
                keyboardType="numeric"
                value={values.price}
                onChangeText={handleChange("price")}
                onBlur={handleBlur("price")}
              />
              {touched.price && errors.price && <Text style={styles.error}>{errors.price}</Text>}

              <TextInput
                style={[styles.input, { height: 80 }]}
                placeholder="Description"
                multiline
                value={values.description}
                onChangeText={handleChange("description")}
                onBlur={handleBlur("description")}
              />
              {touched.description && errors.description && <Text style={styles.error}>{errors.description}</Text>}

              <TextInput
                style={styles.input}
                placeholder="Localisation"
                value={values.location}
                onChangeText={handleChange("location")}
                onBlur={handleBlur("location")}
              />
              {touched.location && errors.location && <Text style={styles.error}>{errors.location}</Text>}

              <TextInput
                style={styles.input}
                placeholder="Nombre de chambres"
                keyboardType="numeric"
                value={values.bedrooms}
                onChangeText={handleChange("bedrooms")}
                onBlur={handleBlur("bedrooms")}
              />
              {touched.bedrooms && errors.bedrooms && <Text style={styles.error}>{errors.bedrooms}</Text>}

              <TextInput
                style={styles.input}
                placeholder="Nombre de salles de bain"
                keyboardType="numeric"
                value={values.bathrooms}
                onChangeText={handleChange("bathrooms")}
                onBlur={handleBlur("bathrooms")}
              />
              {touched.bathrooms && errors.bathrooms && <Text style={styles.error}>{errors.bathrooms}</Text>}

              <View style={styles.imagePickerContainer}>
                <Button title="Modifier les photos" onPress={pickImages} />
                {touched.images && errors.images && <Text style={styles.error}>{errors.images}</Text>}
                <ScrollView horizontal showsHorizontalScrollIndicator style={styles.imagePreviewContainer}>
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

              <TouchableOpacity style={styles.button} onPress={() => handleSubmit()}>
                <Text style={styles.buttonText}>Modifier l'annonce</Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>
        <Spinner visible={isLoading} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default EditPropertyScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    backgroundColor: "white",
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    fontSize: 16,
  },
  error: {
    color: "red",
    marginBottom: 6,
  },
  button: {
    marginTop: 20,
    backgroundColor: "#2a9d8f",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
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
    position: "relative",
    marginRight: 10,
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 12,
  },
  removeButton: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "#e63946",
    borderRadius: 14,
    width: 26,
    height: 26,
    justifyContent: "center",
    alignItems: "center",
  },
  removeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});
