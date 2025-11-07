import React, { useState } from "react";
import 'react-native-get-random-values';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
// J'ai ajouté Ionicons pour les icônes "oeil"
import { Ionicons } from '@expo/vector-icons'; 
import { COLORS } from "../../assets/Theme";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "react-native-toast-notifications";
import { v4 as uuidv4 } from "uuid"; // Cet import est correct


export default function RegisterScreen({ navigation }: any) {
  const { register } = useAuth();
  const toast = useToast();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });

  // États pour gérer la visibilité du mot de passe
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  
  // État pour le chargement
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (key: string, value: string) => setForm({ ...form, [key]: value });

  const handleRegister = async () => {
    // Validation (votre code était déjà très bon)
    if (!form.name || !form.email || !form.password || !form.confirm) {
      toast.show("Veuillez remplir tous les champs", { type: "warning" });
      return;
    }
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      toast.show("Adresse e-mail invalide", { type: "danger" });
      return;
    }
    if (form.password.length < 6) {
      toast.show("Le mot de passe doit contenir au moins 6 caractères", { type: "danger" });
      return;
    }
    if (form.password !== form.confirm) {
      toast.show("Les mots de passe ne correspondent pas", { type: "danger" });
      return;
    }

    setIsLoading(true); // Active le chargement

    try {
      const success = await register({
        id: uuidv4(), // Génère un ID unique (string)
        name: form.name,
        email: form.email,
        password: form.password,
      });

      if (success) {
        toast.show("Inscription réussie 🎉", { type: "success" });
        navigation.navigate("Login");
      } else {
        toast.show("Cet email est déjà utilisé", { type: "danger" });
      }
    } catch (error) {
      console.error("Erreur lors de l'inscription:", error);
      toast.show("Une erreur est survenue. Veuillez réessayer.", { type: "danger" });
    } finally {
      setIsLoading(false); // Désactive le chargement
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Créer un compte</Text>

      <TextInput
        style={styles.input}
        placeholder="Nom complet"
        value={form.name}
        onChangeText={(text) => handleChange("name", text)}
        editable={!isLoading} // Non modifiable pendant le chargement
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={form.email}
        onChangeText={(text) => handleChange("email", text)}
        editable={!isLoading}
      />
      
      {/* Champ Mot de passe avec icône */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.inputField}
          placeholder="Mot de passe"
          secureTextEntry={!isPasswordVisible} // Utilise l'état
          value={form.password}
          onChangeText={(text) => handleChange("password", text)}
          editable={!isLoading}
        />
        <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)} style={styles.icon}>
          <Ionicons name={isPasswordVisible ? "eye-off" : "eye"} size={24} color="gray" />
        </TouchableOpacity>
      </View>

      {/* Champ Confirmer Mot de passe avec icône */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.inputField}
          placeholder="Confirmer le mot de passe"
          secureTextEntry={!isConfirmVisible} // Utilise l'état
          value={form.confirm}
          onChangeText={(text) => handleChange("confirm", text)}
          editable={!isLoading}
        />
        <TouchableOpacity onPress={() => setIsConfirmVisible(!isConfirmVisible)} style={styles.icon}>
          <Ionicons name={isConfirmVisible ? "eye-off" : "eye"} size={24} color="gray" />
        </TouchableOpacity>
      </View>


      <TouchableOpacity style={[styles.btn, isLoading && styles.btnDisabled]} onPress={handleRegister} disabled={isLoading}>
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.btnText}>S’inscrire</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Login")} disabled={isLoading}>
        <Text style={styles.link}>Déjà un compte ? Se connecter</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// J'ai mis à jour les styles pour inclure les conteneurs de mot de passe
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e9f5f3",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 25,
    color: COLORS.primary,
  },
  // Style pour les inputs simples (nom, email)
  input: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    marginBottom: 15,
    elevation: 2,
    fontSize: 16,
  },
  // Conteneur pour le champ de texte + icône
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: "100%",
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 15,
    elevation: 2,
    paddingRight: 12, // Espace pour l'icône
  },
  // Champ de texte à l'intérieur du conteneur
  inputField: {
    flex: 1,
    padding: 12,
    fontSize: 16,
  },
  icon: {
    padding: 4,
  },
  btn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  btnDisabled: {
    backgroundColor: COLORS.primary + '80', // Ajoute de la transparence
  },
  btnText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  link: {
    marginTop: 15,
    color: COLORS.secondary,
    textDecorationLine: "underline",
  },
});