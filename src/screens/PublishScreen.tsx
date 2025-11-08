import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Formik } from "formik";
import * as Yup from "yup";
import { Video } from "expo-av";
import { AntDesign, Ionicons, MaterialCommunityIcons, FontAwesome } from "@expo/vector-icons";
import { useProperties } from "../../contexts/PropertyContext";
import { useAuth } from "../../contexts/AuthContext";
import Spinner from "../components/Spinner";
import { useToast } from "react-native-toast-notifications";

// --- Validation du formulaire ---
const validationSchema = Yup.object().shape({
  title: Yup.string().required("Le titre est obligatoire"),
  price: Yup.number().typeError("Le prix doit être un nombre").positive("Doit être positif").required(),
  description: Yup.string().required("La description est obligatoire"),
  location: Yup.string().required("La localisation est obligatoire"),
  bedrooms: Yup.number().typeError("Nombre invalide").min(0).required(),
  bathrooms: Yup.number().typeError("Nombre invalide").min(0).required(),
  images: Yup.array().min(1, "Au moins une image est requise"),
});

export default function PublishScreen() {
  const { addProperty } = useProperties();
  const { user } = useAuth();
  const Toast = useToast();

  const [imageUris, setImageUris] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // --- Choix d'images ---
  const pickImages = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission refusée", "Autorisez l’accès à la galerie pour continuer.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: true,
      quality: 0.7,
      mediaTypes: ImagePicker.MediaTypeOptions.All,
    });

    if (!result.canceled) {
      const uris = result.assets?.map((a) => a.uri) || [];
      setImageUris((prev) => [...prev, ...uris]);
    }
  };

  const removeImage = (uri: string) => setImageUris((prev) => prev.filter((img) => img !== uri));

  const isVideo = (uri: string) => /\.(mp4|mov|avi|mkv|webm)$/i.test(uri);

  return (
    <Formik
      initialValues={{
        title: "",
        price: "",
        description: "",
        location: "",
        bedrooms: "",
        bathrooms: "",
        images: [],
      }}
      validationSchema={validationSchema}
      onSubmit={(values, { resetForm }) => {
        if (!user?.id) {
          Alert.alert("Erreur", "Vous devez être connecté pour publier.");
          return;
        }

        const newProperty = {
          id: Date.now(),
          title: values.title,
          price: parseInt(values.price),
          description: values.description,
          location: values.location,
          bedrooms: parseInt(values.bedrooms),
          bathrooms: parseInt(values.bathrooms),
          images: imageUris,
          owner: user.name || "Inconnu",
          ownerId: user.id,
        };

        setIsLoading(true);
        setTimeout(() => {
          addProperty(newProperty);
          setIsLoading(false);
          Toast.show("Annonce publiée avec succès !", {
            type: "success",
            placement: "top",
            animationType: "slide-in",
            successIcon: <Ionicons name="checkmark-circle" size={24} color="white" />,
          });
          resetForm();
          setImageUris([]);
        }, 1500);
      }}
    >
      {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1, backgroundColor: "#f4f9f8" }}
        >
          <ScrollView contentContainerStyle={styles.container}>

            {/* HEADER */}
            <View style={styles.header}>
              <Ionicons name="home-outline" size={30} color="#2a9d8f" />
              <Text style={styles.headerTitle}>Publier une Annonce</Text>
            </View>

            {/* CHAMPS DE SAISIE */}
            <View style={styles.card}>
              <InputField
                icon={<Ionicons name="pricetag-outline" size={20} color="#2a9d8f" />}
                placeholder="Titre de l'annonce"
                value={values.title}
                onChangeText={handleChange("title")}
                onBlur={handleBlur("title")}
              />
              {touched.title && errors.title && <Text style={styles.errorText}>{errors.title}</Text>}

              <InputField
                icon={<FontAwesome name="money" size={20} color="#2a9d8f" />}
                placeholder="Prix (FCFA)"
                keyboardType="numeric"
                value={values.price}
                onChangeText={handleChange("price")}
                onBlur={handleBlur("price")}
              />
              {touched.price && errors.price && <Text style={styles.errorText}>{errors.price}</Text>}

              <InputField
                icon={<Ionicons name="location-outline" size={20} color="#2a9d8f" />}
                placeholder="Localisation"
                value={values.location}
                onChangeText={handleChange("location")}
                onBlur={handleBlur("location")}
              />
              {touched.location && errors.location && <Text style={styles.errorText}>{errors.location}</Text>}

              <InputField
                icon={<Ionicons name="bed-outline" size={20} color="#2a9d8f" />}
                placeholder="Nombre de chambres"
                keyboardType="numeric"
                value={values.bedrooms}
                onChangeText={handleChange("bedrooms")}
                onBlur={handleBlur("bedrooms")}
              />
              {touched.bedrooms && errors.bedrooms && <Text style={styles.errorText}>{errors.bedrooms}</Text>}

              <InputField
                icon={<MaterialCommunityIcons name="shower" size={20} color="#2a9d8f" />}
                placeholder="Nombre de salles de bain"
                keyboardType="numeric"
                value={values.bathrooms}
                onChangeText={handleChange("bathrooms")}
                onBlur={handleBlur("bathrooms")}
              />
              {touched.bathrooms && errors.bathrooms && <Text style={styles.errorText}>{errors.bathrooms}</Text>}

              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Description du bien..."
                multiline
                numberOfLines={4}
                value={values.description}
                onChangeText={handleChange("description")}
                onBlur={handleBlur("description")}
              />
              {touched.description && errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
            </View>

            {/* IMAGE PICKER */}
            <View style={styles.imageSection}>
              <View style={styles.imageHeader}>
                <Ionicons name="images-outline" size={22} color="#2a9d8f" />
                <Text style={styles.imageHeaderText}>Photos / Vidéos</Text>
              </View>

              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imagePreviewContainer}>
                {imageUris.map((uri) => (
                  <View key={uri} style={styles.imageWrapper}>
                    {isVideo(uri) ? (
                      <Video source={{ uri }} style={styles.media} useNativeControls resizeMode="cover" />
                    ) : (
                      <Image source={{ uri }} style={styles.media} />
                    )}
                    <TouchableOpacity style={styles.removeButton} onPress={() => removeImage(uri)}>
                      <AntDesign name="closecircle" size={22} color="#fff" />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>

              <TouchableOpacity style={styles.addButton} onPress={pickImages}>
                <Ionicons name="add-circle" size={40} color="#2a9d8f" />
                <Text style={styles.addText}>Ajouter une image</Text>
              </TouchableOpacity>
            </View>

            {/* BOUTON DE PUBLICATION */}
            <TouchableOpacity
              style={styles.submitButton}
              onPress={() => {
                if (imageUris.length === 0) {
                  Alert.alert("Erreur", "Veuillez ajouter au moins une image.");
                  return;
                }
                values.images = imageUris as any;
                handleSubmit();
              }}
            >
              <Ionicons name="megaphone-outline" size={22} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.submitButtonText}>Publier l’annonce</Text>
            </TouchableOpacity>

            <Spinner visible={isLoading} />
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </Formik>
  );
}

// --- Composant champ de saisie avec icône ---
const InputField = ({ icon, ...props }: any) => (
  <View style={styles.inputContainer}>
    {icon}
    <TextInput style={styles.input} {...props} />
  </View>
);

const styles = StyleSheet.create({
  container: { padding: 20 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  headerTitle: { fontSize: 22, fontWeight: "700", marginLeft: 10, color: "#264653" },
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 15,
    elevation: 3,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f6f6f6",
    borderRadius: 12,
    paddingHorizontal: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  input: { flex: 1, padding: 10, fontSize: 15 },
  textArea: { minHeight: 80, textAlignVertical: "top" },
  errorText: { color: "#e63946", fontSize: 13, marginBottom: 8 },
  imageSection: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 15,
    marginBottom: 25,
    elevation: 3,
  },
  imageHeader: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  imageHeaderText: { marginLeft: 8, fontWeight: "600", color: "#264653" },
  imagePreviewContainer: { flexDirection: "row" },
  imageWrapper: { position: "relative", marginRight: 10 },
  media: { width: 100, height: 100, borderRadius: 12 },
  removeButton: { position: "absolute", top: 5, right: 5, backgroundColor: "#e63946", borderRadius: 50, padding: 2 },
  addButton: { flexDirection: "row", alignItems: "center", marginTop: 15 },
  addText: { color: "#2a9d8f", fontWeight: "600", marginLeft: 8 },
  submitButton: {
    flexDirection: "row",
    backgroundColor: "#2a9d8f",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    height: 55,
    elevation: 4,
    shadowColor: "#000",
  },
  submitButtonText: { color: "white", fontWeight: "700", fontSize: 18 },
});
