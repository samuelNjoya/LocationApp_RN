import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from "react-native";
import { COLORS } from "../../assets/Theme";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "react-native-toast-notifications";
import { v4 as uuidv4 } from "uuid";

export default function RegisterScreen({ navigation }: any) {
  const { register } = useAuth();
  const Toast = useToast();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });

  const handleChange = (key: string, value: string) => setForm({ ...form, [key]: value });

  const handleRegister = async () => {
    if (!form.name || !form.email || !form.password || !form.confirm) {
      Toast.show("Veuillez remplir tous les champs", { type: "warning" });
      return;
    }
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      Toast.show("Adresse e-mail invalide", { type: "danger" });
      return;
    }
    if (form.password.length < 6) {
      Toast.show("Le mot de passe doit contenir au moins 6 caractères", { type: "danger" });
      return;
    }
    if (form.password !== form.confirm) {
      Toast.show("Les mots de passe ne correspondent pas", { type: "danger" });
      return;
    }

    const success = await register({
      id: uuidv4(),
      name: form.name,
      email: form.email,
      password: form.password,
    });

    if (success) {
      Toast.show("Inscription réussie 🎉", { type: "success" });
      navigation.navigate("Login");
    } else {
      Toast.show("Cet email est déjà utilisé", { type: "danger" });
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
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={form.email}
        onChangeText={(text) => handleChange("email", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        secureTextEntry
        value={form.password}
        onChangeText={(text) => handleChange("password", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirmer le mot de passe"
        secureTextEntry
        value={form.confirm}
        onChangeText={(text) => handleChange("confirm", text)}
      />

      <TouchableOpacity style={styles.btn} onPress={handleRegister}>
        <Text style={styles.btnText}>S’inscrire</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.link}>Déjà un compte ? Se connecter</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

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
  input: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    marginBottom: 15,
    elevation: 2,
  },
  btn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
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
