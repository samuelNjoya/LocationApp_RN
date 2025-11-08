import React, { createContext, useState, useContext, useMemo } from 'react';

// --- A. DÉFINITION DES COULEURS ---

// Couleurs de base de votre palette raffinée (Thème CLAIR)
export const lightTheme = {
    themeName: 'light',
    // Couleurs principales
    primary: '#4a6fa5',       // Bleu principal
    secondary: '#1c3e5c',     // Bleu marine (Texte titre/accents sombres)
    accent: '#3aafa9',        // Bleu-vert pour les boutons
    error: '#e76f51',         // Rouge pour les erreurs/déconnexion
    
    // Couleurs de fond et de texte
    background: '#f8f8f8',    // Gris très clair (Fond de l'écran)
    surface: '#ffffff',       // Blanc (Fond des cartes, listes, modales)
    textPrimary: '#222222',   // Noir charbon
    textSecondary: '#a0a0a0', // Gris pour les textes secondaires/placeholders
    border: '#eeeeee',        // Lignes de séparation
    switchActive: '#3aafa9',  // Couleur de l'interrupteur actif
    switchInactive: '#a0a0a0',// Couleur de l'interrupteur inactif
};

// Couleurs pour le Thème SOMBRE
export const darkTheme = {
    themeName: 'dark',
    // Couleurs principales (généralement conservées ou ajustées)
    primary: '#6a9cbc',
    secondary: '#b3cbe0',
    accent: '#3aafa9',
    error: '#ff9478',
    
    // Couleurs de fond et de texte
    background: '#121212',     // Fond très sombre
    surface: '#1e1e1e',        // Fond des cartes/listes légèrement moins sombre
    textPrimary: '#ffffff',    // Texte Blanc
    textSecondary: '#bbbbbb',  // Texte Gris clair
    border: '#333333',         // Lignes de séparation sombres
    switchActive: '#3aafa9',
    switchInactive: '#555555',
};

// --- B. CONTEXTE GLOBAL ET LOGIQUE ---

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

const FONT_SCALES = [0.9, 1.0, 1.1, 1.2]; // Petit, Normal, Grand, Très Grand

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState('light');
    const [fontSizeIndex, setFontSizeIndex] = useState(1); // 1 = 1.0 (Normal)

    const toggleTheme = () => {
        setTheme(currentTheme => (currentTheme === 'light' ? 'dark' : 'light'));
    };
    
    // Fonctions pour ajuster la taille de la police
    const adjustFontSize = (direction) => {
        setFontSizeIndex(prevIndex => {
            if (direction === 'increase') {
                return Math.min(prevIndex + 1, FONT_SCALES.length - 1);
            }
            return Math.max(prevIndex - 1, 0);
        });
    };

    const currentFontScale = FONT_SCALES[fontSizeIndex];
    const colors = theme === 'light' ? lightTheme : darkTheme;
    
    // Valeur fournie par le contexte
    const value = useMemo(() => ({
        theme,
        colors,
        currentFontScale,
        toggleTheme,
        adjustFontSize,
        // Indicateurs pour l'UI de la page Paramètres
        canIncreaseFont: fontSizeIndex < FONT_SCALES.length - 1,
        canDecreaseFont: fontSizeIndex > 0,
        currentFontSizeLabel: ['Petit', 'Normal', 'Grand', 'Très Grand'][fontSizeIndex]
    }), [theme, fontSizeIndex]);

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};