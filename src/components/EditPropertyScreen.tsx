import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Image,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { Formik } from "formik";
import * as ImagePicker from "expo-image-picker";
import { useProperties } from "../../contexts/PropertyContext";
import { useToast } from "react-native-toast-notifications";
import Spinner from "./Spinner";
import { AntDesign, Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
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
  bedrooms: string;
  bathrooms: string;
  images: string[];
}

const EditPropertyScreen: React.FC<EditPropertyScreenProps> = ({ route, navigation }) => {
  const { modifyProperty } = useProperties();
  const { property } = route.params;
  const Toast = useToast();

  const [imageUris, setImageUris] = useState<string[]>(property.images || []);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // --- Sélection d’images ---
  const pickImages = async () => {
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

  const removeImage = (uri: string) => {
    setImageUris((prev) => prev.filter((imgUri) => imgUri !== uri));
  };

  const handleSubmit = (values: FormValues) => {
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
        animationType: "zoom-in",
        successIcon: <Ionicons name="checkmark-circle-sharp" size={24} color="white" />,
      });
      navigation.goBack();
    }, 1500);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: "#f3f7f5" }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerCard}>
          <FontAwesome5 name="edit" size={26} color="#fff" />
          <Text style={styles.headerTitle}>Modifier l'annonce</Text>
          <Text style={styles.headerSubtitle}>
            Apportez les modifications souhaitées puis validez ci-dessous
          </Text>
        </View>

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
            <View style={styles.formContainer}>
              {/* --- Champ Titre --- */}
              <View style={styles.inputGroup}>
                <Ionicons name="home-outline" size={22} color="#2a9d8f" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Titre de l'annonce"
                  value={values.title}
                  onChangeText={handleChange("title")}
                  onBlur={handleBlur("title")}
                />
              </View>
              {touched.title && errors.title && <Text style={styles.error}>{errors.title}</Text>}

              {/* --- Champ Prix --- */}
              <View style={styles.inputGroup}>
                <MaterialIcons name="attach-money" size={22} color="#2a9d8f" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Prix (FCFA)"
                  keyboardType="numeric"
                  value={values.price}
                  onChangeText={handleChange("price")}
                  onBlur={handleBlur("price")}
                />
              </View>
              {touched.price && errors.price && <Text style={styles.error}>{errors.price}</Text>}

              {/* --- Champ Description --- */}
              <View style={styles.inputGroup}>
                <Ionicons name="document-text-outline" size={22} color="#2a9d8f" style={styles.icon} />
                <TextInput
                  style={[styles.input, { height: 90 }]}
                  placeholder="Description de l'annonce"
                  multiline
                  value={values.description}
                  onChangeText={handleChange("description")}
                  onBlur={handleBlur("description")}
                />
              </View>
              {touched.description && errors.description && <Text style={styles.error}>{errors.description}</Text>}

              {/* --- Champ Localisation --- */}
              <View style={styles.inputGroup}>
                <Ionicons name="location-outline" size={22} color="#2a9d8f" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Localisation"
                  value={values.location}
                  onChangeText={handleChange("location")}
                  onBlur={handleBlur("location")}
                />
              </View>
              {touched.location && errors.location && <Text style={styles.error}>{errors.location}</Text>}

              {/* --- Chambres --- */}
              <View style={styles.inputGroup}>
                <FontAwesome5 name="bed" size={20} color="#2a9d8f" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Nombre de chambres"
                  keyboardType="numeric"
                  value={values.bedrooms}
                  onChangeText={handleChange("bedrooms")}
                  onBlur={handleBlur("bedrooms")}
                />
              </View>
              {touched.bedrooms && errors.bedrooms && <Text style={styles.error}>{errors.bedrooms}</Text>}

              {/* --- Salles de bain --- */}
              <View style={styles.inputGroup}>
                <FontAwesome5 name="bath" size={20} color="#2a9d8f" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Nombre de salles de bain"
                  keyboardType="numeric"
                  value={values.bathrooms}
                  onChangeText={handleChange("bathrooms")}
                  onBlur={handleBlur("bathrooms")}
                />
              </View>
              {touched.bathrooms && errors.bathrooms && <Text style={styles.error}>{errors.bathrooms}</Text>}

              {/* --- Gestion d’images --- */}
              <View style={styles.imagePickerCard}>
                <TouchableOpacity style={styles.pickButton} onPress={pickImages}>
                  <AntDesign name="picture" size={22} color="#fff" />
                  <Text style={styles.pickButtonText}>Modifier les images</Text>
                </TouchableOpacity>

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

              {/* --- Bouton de soumission --- */}
              <TouchableOpacity style={styles.submitButton} onPress={() => handleSubmit()}>
                <Ionicons name="save-outline" size={22} color="white" />
                <Text style={styles.submitButtonText}>Sauvegarder les modifications</Text>
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
    padding: 18,
    paddingBottom: 50,
  },
  headerCard: {
    backgroundColor: "#2a9d8f",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    marginBottom: 20,
    elevation: 5,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
    marginTop: 10,
  },
  headerSubtitle: {
    color: "#e0f2f1",
    textAlign: "center",
    marginTop: 6,
  },
  formContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 15,
    elevation: 4,
  },
  inputGroup: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    paddingHorizontal: 10,
    marginBottom: 12,
    elevation: 2,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
  },
  error: {
    color: "#e63946",
    marginBottom: 6,
    marginLeft: 10,
  },
  imagePickerCard: {
    marginTop: 10,
    backgroundColor: "#eef9f7",
    borderRadius: 12,
    padding: 10,
  },
  pickButton: {
    backgroundColor: "#2a9d8f",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
  },
  pickButtonText: {
    color: "white",
    fontWeight: "bold",
    marginLeft: 8,
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
    fontSize: 14,
  },
  submitButton: {
    backgroundColor: "#2a9d8f",
    height: 55,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    flexDirection: "row",
    gap: 8,
    elevation: 6,
  },
  submitButtonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 18,
  },
});
