import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { COLORS } from "../../assets/Theme";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "react-native-toast-notifications";

export default function LoginScreen({ navigation }: any) {
  const { login } = useAuth();
  const Toast = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      Toast.show("Veuillez remplir tous les champs", { type: "warning" });
      return;
    }

    const success = await login(email, password);
    if (success) {
      Toast.show("Connexion réussie 👋", { type: "success" });
      navigation.replace("Home");
    } else {
      Toast.show("Identifiants incorrects", { type: "danger" });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connexion</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.btn} onPress={handleLogin}>
        <Text style={styles.btnText}>Se connecter</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={styles.link}>Pas encore de compte ? S’inscrire</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e9f5f3",
    justifyContent: "center",
    alignItems: "center",
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
