import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import defaultProperties, { PropertyHome } from '../src/components/Data/defaultProperties';

const STORAGE_KEY = 'properties_storage_key';
const STORAGE_KEY_FAVORITES = 'favorites_storage_key';

// 👇 Définition du type de contexte
interface PropertyContextType {
  properties: PropertyHome[];
  addProperty: (property: PropertyHome) => void;
  deleteProperty: (id: number) => void;
  modifyProperty: (property: PropertyHome) => void;
  favorites: number[];
  addFavorite: (id: number) => void;
  removeFavorite: (id: number) => void;
  toggleFavorite: (id: number) => void;
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

// 👇 Typage du Provider
interface PropertyProviderProps {
  children: ReactNode;
}

export const PropertyProvider: React.FC<PropertyProviderProps> = ({ children }) => {
  const [properties, setProperties] = useState<PropertyHome[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);

  // Charger les données au démarrage
  useEffect(() => {
    async function loadProperties() {
      try {
        const data = await AsyncStorage.getItem(STORAGE_KEY);
        const favData = await AsyncStorage.getItem(STORAGE_KEY_FAVORITES);

        if (data) {
          setProperties(JSON.parse(data));
        } else {
          setProperties(defaultProperties);
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(defaultProperties));
        }

        if (favData) setFavorites(JSON.parse(favData));
      } catch (error) {
        console.error("Erreur chargement properties:", error);
        setProperties(defaultProperties);
      }
    }
    loadProperties();
  }, []);

  const saveProperties = async (newProperties: PropertyHome[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newProperties));
    } catch (error) {
      console.log("Erreur sauvegarde properties:", error);
    }
  };

  const saveFavorites = async (newFavorites: number[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY_FAVORITES, JSON.stringify(newFavorites));
    } catch (error) {
      console.log("Erreur sauvegarde favorites:", error);
    }
  };

  const addProperty = (property: PropertyHome) => {
    const newList = [property, ...properties];
    setProperties(newList);
    saveProperties(newList);
  };

  const deleteProperty = (id: number) => {
    const newList = properties.filter(p => p.id !== id);
    setProperties(newList);
    saveProperties(newList);

    if (favorites.includes(id)) {
      const newFavs = favorites.filter(favId => favId !== id);
      setFavorites(newFavs);
      saveFavorites(newFavs);
    }
  };

  const modifyProperty = (updatedProperty: PropertyHome) => {
    const newList = properties.map(p => p.id === updatedProperty.id ? { ...p, ...updatedProperty } : p);
    setProperties(newList);
    saveProperties(newList);
  };

  const addFavorite = (id: number) => {
    if (!favorites.includes(id)) {
      const newFavs = [...favorites, id];
      setFavorites(newFavs);
      saveFavorites(newFavs);
    }
  };

  const removeFavorite = (id: number) => {
    if (favorites.includes(id)) {
      const newFavs = favorites.filter(favId => favId !== id);
      setFavorites(newFavs);
      saveFavorites(newFavs);
    }
  };

  const toggleFavorite = (id: number) => {
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
