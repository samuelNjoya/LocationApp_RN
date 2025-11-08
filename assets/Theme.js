import { Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");

// export const COLORS = {
//     greenColors: '#2a9d8f',
//     greenWhite:'#e9f5f3',
//     secondary: '#264653',
//     background: '#e9f5f3',
//     white: '#ffffff',
//     black: '#000000',
//     gray: '#ccc',
//     primary:'rgba(40, 40, 118, 1)'
// };

export const COLORS = {
    greenColors: '#3aafa9', // Un bleu-vert océan clair et apaisant, parfait pour les CTA ou les accents.
    greenWhite: '#e9fcfb', // Un vert-bleu très pâle, presque blanc, pour les arrière-plans légers.
    secondary: '#1c3e5c', // Un bleu marine profond, élégant et sophistale.
    background: '#f8f8f8', // Un gris très clair, presque blanc, pour les fonds principaux.
    white: '#ffffff',
    black: '#222222', // Un noir plus doux pour les textes principaux.
    gray: '#a0a0a0', // Un gris neutre et moderne pour les textes secondaires, bordures.
    primary: '#4a6fa5' // Un bleu plus doux et rassurant, parfait pour les CTA principaux.
};


export const FONTS = {
  //les polices d'ecriture de l'app sesamPayX Poppins
   Poppins_Regular:'Poppins_400Regular',
   Poppins_Medium:'Poppins_500Medium',
   Poppins_SemiBold:'Poppins_600SemiBold',
   Poppins_Bold:'Poppins_700Bold',
}