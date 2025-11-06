import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import defaultProperties, { PropertyHome } from '../src/components/Data/defaultProperties';

// Clef unique pour AsyncStorage
const STORAGE_KEY = 'properties_storage_key';
const STORAGE_KEY_FAVORITES = 'favorites_storage_key'; // Clef pour les favoris

//Définition du type de contexte
interface PropertyContextType {
  properties: PropertyHome[];
  addProperty: (property: PropertyHome) => void;
  deleteProperty: (id: number) => void;
  modifyProperty: (property: PropertyHome) => void;
  favorites: string[];
  addFavorite: (id: number) => void;
  removeFavorite: (id: number) => void;
  toggleFavorite: (id: number) => void;
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

// 👇 Typage du Provider
interface PropertyProviderProps {
  children: ReactNode;
}

// Provider qui encapsule toute l'application et fournit les données + fonctions
export const PropertyProvider: React.FC<PropertyProviderProps> = ({ children }) => {

  const [properties, setProperties] = useState<PropertyHome[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);

  // Charger les données au démarrage
  useEffect(() => {
    async function loadProperties() {
      try {
        const data = await AsyncStorage.getItem(STORAGE_KEY);
        const favData = await AsyncStorage.getItem(STORAGE_KEY_FAVORITES);

        if (data !== null) {
          setProperties(JSON.parse(data));
        } else {
          // Pas de données sauvegardées, on initialise avec les propriétés par défaut
          console.log("Pas de données sauvegardées, chargement valeurs par défaut...");
          setProperties(defaultProperties);
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(defaultProperties)); // On stocke aussi ce tableau par défaut pour la suite
        }

        if (favData !== null) setFavorites(JSON.parse(favData));
        else setFavorites([]);

      } catch (error) {
        console.log("Erreur chargement properties:", error);
        setProperties(defaultProperties); // En cas d'erreur, on initialise avec les propriétés par défaut
      }
    }
    loadProperties();
  }, []);

  // Fonction pour sauvegarder dans AsyncStorage à chaque modification
  const saveProperties = async (newProperties) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newProperties));
    } catch (error) {
      console.log("Erreur sauvegarde properties:", error);
    }
  };

  //
  const saveFavorites = async (newFavorites) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY_FAVORITES, JSON.stringify(newFavorites));
    } catch (error) {
      console.log("Erreur sauvegarde favorites:", error);
    }
  };

  // Ajout d'une annonce
  const addProperty = (property) => {
    const newList = [property, ...properties];
    setProperties(newList);
    saveProperties(newList);
  };

  // Suppression
  const deleteProperty = (id) => {
    const newList = properties.filter(p => p.id !== id);
    setProperties(newList);
    saveProperties(newList);

     // Nettoyer des favoris au besoin
    if (favorites.includes(id)) {
      const newFavs = favorites.filter(favId => favId !== id);
      setFavorites(newFavs);
      saveFavorites(newFavs);
    }
  };

  // Modification
  const modifyProperty = (updatedProperty) => {
    const newList = properties.map(p => p.id === updatedProperty.id ? { ...p, ...updatedProperty } : p); 
    setProperties(newList);
    saveProperties(newList);
  };

  // Ajout/suppression/toggle favoris
 const addFavorite = (id) => {
  if (!favorites.includes(id)) { // Vérifie si l'ID n'est pas déjà dans les favoris
    const newFavs = [...favorites, id]; // Crée un nouveau tableau avec l'ID ajouté
    setFavorites(newFavs); // Met à jour l'état React
    saveFavorites(newFavs); // Sauvegarde (dans localStorage/API/etc.)
  }
};

  const removeFavorite = (id) => {
    if (favorites.includes(id)) {
      const newFavs = favorites.filter(favId => favId !== id); // Filtre l'ID à supprimer
      setFavorites(newFavs);
      saveFavorites(newFavs);
    }
  };

  const toggleFavorite = (id) => {
    if (favorites.includes(id)) {
      removeFavorite(id); // Si déjà favori, on le retire
    } else {
      addFavorite(id); // Sinon on l'ajoute
    }
  };

  // Fournir le state et fonctions aux composants enfants
  return (
   <PropertyContext.Provider value={{
      properties,
      addProperty,
      deleteProperty,
      modifyProperty,
      favorites,
      addFavorite,
      removeFavorite,
      toggleFavorite
    }}>
      {children}
    </PropertyContext.Provider>
  );
};

// Hook personnalisé pour simplifier la consommation de ce contexte dans les composants
export const useProperties = () => useContext(PropertyContext);

