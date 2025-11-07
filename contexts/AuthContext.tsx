import React, { createContext, useState, useEffect, useContext, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from 'react-native'; // Import nécessaire pour l'URL de la photo par défaut

// URL de photo par défaut (Icône utilisateur générique)
const DEFAULT_PHOTO_URL = Platform.select({
    ios: 'https://placehold.co/100x100/A2D2FF/ffffff?text=U',
    android: 'https://placehold.co/100x100/A2D2FF/ffffff?text=U',
    default: 'https://placehold.co/100x100/A2D2FF/ffffff?text=U'
});

export interface User {
    id: string; // Devrait probablement être uid
    name: string;
    email: string;
    password: string;
    phone?: string;         // Nouveau champ
    address?: string;       // Nouveau champ
    city?: string;          // Nouveau champ
    photoUrl?: string;      // Nouveau champ (URL de la photo)
}

interface AuthContextType {
    user: User | null;
    users: User[];
    isLoading: boolean;
    register: (newUser: Omit<User, 'photoUrl'> & { photoUrl?: string }) => Promise<boolean>;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => Promise<void>;
    updateProfile: (updates: Partial<User>) => Promise<boolean>; // Nouvelle fonction pour mise à jour
}

const STORAGE_KEY_USERS = "users_storage_key";
const STORAGE_KEY_CURRENT_USER = "current_user";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const loadAuthData = async () => {
            try {
                const data = await AsyncStorage.getItem(STORAGE_KEY_USERS);
                const current = await AsyncStorage.getItem(STORAGE_KEY_CURRENT_USER);
                if (data) setUsers(JSON.parse(data));
                if (current) setUser(JSON.parse(current));
            } catch (error) {
                console.error("Erreur lors du chargement de l'authentification:", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadAuthData();
    }, []);

    const saveUsers = async (list: User[]) => {
        await AsyncStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(list));
    };

    // Lors de l'inscription, on s'assure que les nouveaux champs existent
    const register = async (newUser: Omit<User, 'photoUrl'> & { photoUrl?: string }) => {
        const exists = users.find((u) => u.email === newUser.email);
        if (exists) return false;

        const completeUser: User = {
            ...newUser,
            photoUrl: newUser.photoUrl || DEFAULT_PHOTO_URL,
            // Assurez-vous que tous les champs sont initialisés, même vides, si non fournis par le formulaire d'inscription
            phone: newUser.phone || '', 
            address: newUser.address || '', 
            city: newUser.city || '', 
        };

        const updatedUsers = [...users, completeUser];
        setUsers(updatedUsers);
        await saveUsers(updatedUsers);
        setUser(completeUser);
        await AsyncStorage.setItem(STORAGE_KEY_CURRENT_USER, JSON.stringify(completeUser));
        return true;
    };

    const login = async (email: string, password: string) => {
        const found = users.find(
            (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
        );
        if (!found) return false;

        setUser(found);
        await AsyncStorage.setItem(STORAGE_KEY_CURRENT_USER, JSON.stringify(found));
        return true;
    };

    const logout = async () => {
        setUser(null);
        await AsyncStorage.removeItem(STORAGE_KEY_CURRENT_USER);
    };
    
    // NOUVELLE FONCTION: Met à jour le profil
    const updateProfile = async (updates: Partial<User>): Promise<boolean> => {
        if (!user) return false;
        
        const updatedUser = { ...user, ...updates };
        
        // 1. Mettre à jour la liste des utilisateurs
        const updatedUsers = users.map(u => 
            u.id === user.id ? updatedUser : u
        );
        
        setUsers(updatedUsers);
        await saveUsers(updatedUsers);
        
        // 2. Mettre à jour l'utilisateur courant
        setUser(updatedUser);
        await AsyncStorage.setItem(STORAGE_KEY_CURRENT_USER, JSON.stringify(updatedUser));
        
        return true;
    };


    return (
        <AuthContext.Provider value={{ user, users, isLoading, register, login, logout, updateProfile }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth doit être utilisé dans un AuthProvider");
    return context;
};