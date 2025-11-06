import React, { createContext, useState, useEffect, useContext, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  users: User[];
  register: (newUser: User) => Promise<boolean>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
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

  useEffect(() => {
    const loadUsers = async () => {
      const data = await AsyncStorage.getItem(STORAGE_KEY_USERS);
      const current = await AsyncStorage.getItem(STORAGE_KEY_CURRENT_USER);
      if (data) setUsers(JSON.parse(data));
      if (current) setUser(JSON.parse(current));
    };
    loadUsers();
  }, []);

  const saveUsers = async (list: User[]) => {
    await AsyncStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(list));
  };

  const register = async (newUser: User) => {
    const exists = users.find((u) => u.email === newUser.email);
    if (exists) return false; // email déjà utilisé

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    await saveUsers(updatedUsers);
    setUser(newUser);
    await AsyncStorage.setItem(STORAGE_KEY_CURRENT_USER, JSON.stringify(newUser));
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

  return (
    <AuthContext.Provider value={{ user, users, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth doit être utilisé dans un AuthProvider");
  return context;
};
