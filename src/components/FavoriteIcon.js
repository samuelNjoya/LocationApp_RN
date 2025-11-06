// components/FavoriteIcon.js
import React from 'react';
import { TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useProperties } from '../../contexts/PropertyContext';
import { useToast } from 'react-native-toast-notifications';
import AntDesign from '@expo/vector-icons/AntDesign';


export default function FavoriteIcon({ propertyId, style }) {
  const { favorites, toggleFavorite } = useProperties();
  const isFavorite = favorites.includes(propertyId);
  const toast = useToast();

  const handlePress = () => {
    toggleFavorite(propertyId);
    // Alert.alert(
    //   isFavorite ? "Retiré des favoris" : "Ajouté aux favoris",
    //   isFavorite ? "Cette annonce n'est plus dans vos favoris." : "Annonce ajoutée aux favoris."
    // );

    toast.show(isFavorite ? "Retiré des favoris" : "Ajouté aux favoris", {
      type: isFavorite ? "danger" : "success", 
      placement: "top",
      duration: 2500,
      offset: 90,
      animationType: "slide-in", // "slide-in" | "zoom-in" | "fade-in"
      //animationDuration: 400,
      dangerIcon: <AntDesign name="closecircle" size={24} color="white" />,
      successIcon:<Ionicons name="checkmark-circle-sharp" size={24} color="white" />
    });
   
  };

  return (
    <TouchableOpacity onPress={handlePress} style={style}>
      <Ionicons
        name={isFavorite ? "heart" : "heart-outline"}
        size={28}
        color={isFavorite ? "red" : "gray"}
      />
    </TouchableOpacity>
  );
}
