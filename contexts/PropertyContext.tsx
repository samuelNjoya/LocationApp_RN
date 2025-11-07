import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import defaultProperties, { PropertyHome } from '../src/components/Data/defaultProperties';
import { useAuth } from './AuthContext';

const STORAGE_KEY_PROPERTIES = 'properties_storage_key';
const BASE_STORAGE_KEY_FAVORITES = 'favorites_storage_key';

// 👇 Définition du type de contexte
interface PropertyContextType {
  properties: PropertyHome[];
  addProperty: (property: PropertyHome) => void;
  deleteProperty: (id: number | string) => void;
  modifyProperty: (property: PropertyHome) => void;
  //favorites: number[];
  favorites: (number | string)[]; // Mise à jour du type ID
  addFavorite: (id: number | string) => void;
  removeFavorite: (id: number | string) => void;
  toggleFavorite: (id: number | string) => void;
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

// 👇 Typage du Provider
interface PropertyProviderProps {
  children: ReactNode;
}

export const PropertyProvider: React.FC<PropertyProviderProps> = ({ children }) => {
  const { user } = useAuth(); // <--- RÉCUPÉRATION DE L'UTILISATEUR CONNECTÉ
  const userId = user?.id || 'anonymous'; // Utilise l'ID de l'utilisateur ou 'anonymous' si déconnecté
  const [properties, setProperties] = useState<PropertyHome[]>([]);
  const [favorites, setFavorites] = useState<(number | string)[]>([]);
  // Fonction utilitaire pour générer la clé de favoris spécifique à l'utilisateur
  const getFavoritesStorageKey = (id: string): string => `${BASE_STORAGE_KEY_FAVORITES}_${id}`;

  // Charger les données au démarrage
  // useEffect(() => {
  //   async function loadProperties() {
  //     try {
  //       const data = await AsyncStorage.getItem(STORAGE_KEY);
  //       const favData = await AsyncStorage.getItem(STORAGE_KEY_FAVORITES);

  //       if (data) {
  //         setProperties(JSON.parse(data));
  //       } else {
  //         setProperties(defaultProperties);
  //         await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(defaultProperties));
  //       }

  //       if (favData) setFavorites(JSON.parse(favData));
  //     } catch (error) {
  //       console.error("Erreur chargement properties:", error);
  //       setProperties(defaultProperties);
  //     }
  //   }
  //   loadProperties();
  // }, []);

  // Charger les données au démarrage ET lorsque l'utilisateur change
  useEffect(() => {
    async function loadData() {
      // 1. Charger les propriétés (Globales)
      try {
        const data = await AsyncStorage.getItem(STORAGE_KEY_PROPERTIES);
        if (data) {
          setProperties(JSON.parse(data));
        } else {
          // Si rien, initialise avec les données par défaut
          setProperties(defaultProperties);
          await AsyncStorage.setItem(STORAGE_KEY_PROPERTIES, JSON.stringify(defaultProperties));
        }
      } catch (error) {
        console.error("Erreur chargement properties:", error);
        setProperties(defaultProperties);
      }

      // 2. Charger les favoris (Spécifiques à l'utilisateur)
      const favKey = getFavoritesStorageKey(userId);
      try {
        const favData = await AsyncStorage.getItem(favKey);
        if (favData) {
          setFavorites(JSON.parse(favData));
        } else {
          // Utilisateur n'a pas encore de favoris, on initialise à vide
          setFavorites([]);
        }
      } catch (error) {
        console.error(`Erreur chargement favoris pour ${userId}:`, error);
        setFavorites([]);
      }
    }

    // Le chargement est déclenché au montage et à chaque changement de userId (connexion/déconnexion)
    loadData();

    // Nettoyage : si l'utilisateur change, on pourrait vouloir effacer l'état local avant le rechargement
    return () => {
      // Optionnel: vous pouvez ajouter ici une logique pour gérer la déconnexion
    };
  }, [userId]); // <--- DÉPENDANCE CRUCIALE : RECHARGEMENT LORSQUE L'ID UTILISATEUR CHANGE

  
  const saveProperties = async (newProperties: PropertyHome[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY_PROPERTIES, JSON.stringify(newProperties));
    } catch (error) {
      console.log("Erreur sauvegarde properties:", error);
    }
  };

  // const saveFavorites = async (newFavorites: number[]) => {
  //   try {
  //     await AsyncStorage.setItem(STORAGE_KEY_FAVORITES, JSON.stringify(newFavorites));
  //   } catch (error) {
  //     console.log("Erreur sauvegarde favorites:", error);
  //   }
  // };

  // 2. Sauvegarde des favoris spécifiques à l'utilisateur
  const saveFavorites = async (newFavorites: (number | string)[], currentUserId: string) => {
    try {
      const key = getFavoritesStorageKey(currentUserId);
      await AsyncStorage.setItem(key, JSON.stringify(newFavorites));
    } catch (error) {
      console.log(`Erreur sauvegarde favoris pour ${currentUserId}:`, error);
    }
  };

  const addProperty = (property: PropertyHome) => {
    const newList = [property, ...properties];
    setProperties(newList);
    saveProperties(newList);
  };

  const deleteProperty = (id: number | string) => {
    const newList = properties.filter(p => p.id !== id);
    setProperties(newList);
    saveProperties(newList);

    if (favorites.includes(id)) {
      const newFavs = favorites.filter(favId => favId !== id);
      setFavorites(newFavs);
      saveFavorites(newFavs,userId);
    }
  };

  const modifyProperty = (updatedProperty: PropertyHome) => {
    const newList = properties.map(p => p.id === updatedProperty.id ? { ...p, ...updatedProperty } : p);
    setProperties(newList);
    saveProperties(newList);
  };

  const addFavorite = (id: number | string) => {
    if (!favorites.includes(id)) {
      const newFavs = [...favorites, id];
      setFavorites(newFavs);
      saveFavorites(newFavs,userId);
    }
  };

  const removeFavorite = (id: number | string) => {
    if (favorites.includes(id)) {
      const newFavs = favorites.filter(favId => favId !== id);
      setFavorites(newFavs);
      saveFavorites(newFavs,userId); //Id de l'utilisateur
    }
  };

  const toggleFavorite = (id: number | string) => {
    favorites.includes(id) ? removeFavorite(id) : addFavorite(id);
  };

  return (
    <PropertyContext.Provider
      value={{
        properties,
        addProperty,
        deleteProperty,
        modifyProperty,
        favorites,
        addFavorite,
        removeFavorite,
        toggleFavorite,
      }}
    >
      {children}
    </PropertyContext.Provider>
  );
};

// 👇 Hook personnalisé (avec vérification de sécurité)
export const useProperties = (): PropertyContextType => {
  const context = useContext(PropertyContext);
  if (!context) {
    throw new Error("useProperties doit être utilisé à l'intérieur d'un PropertyProvider");
  }
  return context;
};
