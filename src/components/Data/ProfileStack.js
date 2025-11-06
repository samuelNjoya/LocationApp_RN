import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProfileScreen from "../../screens/ProfileScreen";
import EditPropertyScreen from "../EditPropertyScreen";


const Stack = createNativeStackNavigator();

export default function ProfileStack() { // A remplacer profilScreen dans App.js
  return (
    <Stack.Navigator
    //  screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: "Mes anonces publiées" }} />
      <Stack.Screen name="EditProperty" component={EditPropertyScreen} options={{ title: "Modifier l'annonce" }} />
    </Stack.Navigator>
  );
}
