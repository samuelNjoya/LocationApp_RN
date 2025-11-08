import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons, Feather, AntDesign, Ionicons } from '@expo/vector-icons';
// Assurez-vous d'importer useTheme depuis le bon chemin
import { useTheme } from '../../contexts/ThemeContext'; 

// --- Simulation de constantes de police pour le style ---
const FONTS = {
    Poppins_Medium: 'Poppins_500Medium',
    Poppins_SemiBold: 'Poppins_600SemiBold',
    Poppins_Regular: 'Poppins_400Regular',
};
// --------------------------------------------------------

// Composant réutilisable pour une ligne de réglage
const SettingItem = ({ icon, label, onPress, value, type = 'navigate', actionText, disabled = false, iconPack: IconPack = MaterialCommunityIcons }) => {
    const { colors, currentFontScale } = useTheme();
    const isToggle = type === 'toggle';
    const isAction = type === 'action';
    
    const Component = isToggle ? View : TouchableOpacity;
    
    return (
        <Component 
            style={[
                styles.itemContainer, 
                { borderBottomColor: colors.border, backgroundColor: colors.surface }
            ]} 
            onPress={isToggle ? null : onPress}
            activeOpacity={0.7}
            disabled={disabled}
        >
            <View style={styles.leftContent}>
                <IconPack name={icon} size={20 * currentFontScale} color={colors.primary} style={styles.iconStyle} />
                <Text style={[styles.label, { color: colors.textPrimary, fontSize: 14 * currentFontScale, fontFamily: FONTS.Poppins_Regular }]}>
                    {label}
                </Text>
            </View>
            
            <View style={styles.rightContent}>
                {/* Texte d'action ou valeur */}
                {actionText && (
                    <Text style={[styles.actionText, { color: colors.textSecondary, fontSize: 13 * currentFontScale }]}>
                        {actionText}
                    </Text>
                )}

                {/* Switch (Interrupteur) */}
                {isToggle && (
                    <Switch
                        trackColor={{ false: colors.switchInactive, true: colors.switchActive }}
                        thumbColor={colors.surface}
                        ios_backgroundColor={colors.switchInactive}
                        onValueChange={onPress}
                        value={value}
                    />
                )}
                
                {/* Flèche de navigation */}
                {!isToggle && !isAction && (
                    <MaterialCommunityIcons 
                        name="chevron-right" 
                        size={24 * currentFontScale} 
                        color={colors.textSecondary} 
                    />
                )}
            </View>
        </Component>
    );
};


export default function SettingsScreen({ navigation }) {
    // Utiliser le hook pour accéder au contexte
    const { 
        colors, 
        theme, 
        toggleTheme, 
        adjustFontSize,
        canIncreaseFont,
        canDecreaseFont,
        currentFontSizeLabel,
        currentFontScale 
    } = useTheme();
    
    // Fonctionnalités factices pour les démos de navigation
    const handleNavigation = (screen) => {
        // navigation.navigate(screen); // Décommenter si les routes existent
        console.log(`Naviguer vers : ${screen}`);
    };

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
            <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.textPrimary, fontFamily: FONTS.Poppins_SemiBold }]}>Paramètres</Text>
            </View>

            <View style={styles.scrollContent}>
                {/* Profil Utilisateur */}
                <TouchableOpacity style={[styles.profileCard, { backgroundColor: colors.surface, borderBottomColor: colors.border }]} onPress={() => handleNavigation('Profile')}>
                    <MaterialCommunityIcons name="account-circle" size={50} color={colors.primary} />
                    <View style={styles.profileInfo}>
                        <Text style={[styles.profileName, { color: colors.textPrimary, fontSize: 16 * currentFontScale, fontFamily: FONTS.Poppins_Medium }]}>
                            John Doe
                        </Text>
                        <Text style={[styles.profileEmail, { color: colors.textSecondary, fontSize: 13 * currentFontScale }]}>
                            john.doe@email.com
                        </Text>
                    </View>
                </TouchableOpacity>

                {/* --- COMPTE --- */}
                <Text style={[styles.sectionTitle, { color: colors.textSecondary, fontFamily: FONTS.Poppins_SemiBold }]}>COMPTE</Text>
                <SettingItem 
                    icon="account-settings-outline" 
                    label="Informations Personnelles" 
                    onPress={() => handleNavigation('PersonalInfo')}
                    iconPack={MaterialCommunityIcons}
                />
                <SettingItem 
                    icon="home-city-outline" 
                    label="Gérer les Annonces" 
                    onPress={() => handleNavigation('ManageListings')}
                    iconPack={MaterialCommunityIcons}
                />
                <SettingItem 
                    icon="credit-card-outline" 
                    label="Préférences de Paiement" 
                    onPress={() => handleNavigation('PaymentPrefs')}
                    iconPack={MaterialCommunityIcons}
                />

                {/* --- GÉNÉRAL --- */}
                <Text style={[styles.sectionTitle, { color: colors.textSecondary, fontFamily: FONTS.Poppins_SemiBold }]}>GÉNÉRAL</Text>
                
                {/* 1. THÈME CLAIR/SOMBRE */}
                <SettingItem 
                    icon={theme === 'light' ? 'weather-sunny' : 'weather-night'} 
                    label={`Thème : ${theme === 'light' ? 'Clair' : 'Sombre'}`} 
                    type="toggle"
                    value={theme === 'dark'}
                    onPress={toggleTheme}
                    iconPack={MaterialCommunityIcons}
                />
                
                {/* 2. TAILLE DE LA POLICE */}
                <View style={[styles.itemContainer, { borderBottomColor: colors.border, backgroundColor: colors.surface }]}>
                    <View style={styles.leftContent}>
                        <Feather name="type" size={20 * currentFontScale} color={colors.primary} style={styles.iconStyle} />
                        <Text style={[styles.label, { color: colors.textPrimary, fontSize: 14 * currentFontScale, fontFamily: FONTS.Poppins_Regular }]}>
                            Taille de la police ({currentFontSizeLabel})
                        </Text>
                    </View>
                    <View style={styles.fontAdjuster}>
                        <TouchableOpacity onPress={() => adjustFontSize('decrease')} disabled={!canDecreaseFont}>
                            <AntDesign name="minuscircleo" size={22 * currentFontScale} color={canDecreaseFont ? colors.primary : colors.textSecondary} />
                        </TouchableOpacity>
                        <Text style={[styles.fontScaleLabel, { color: colors.textPrimary, fontSize: 14 * currentFontScale }]}>
                            A a
                        </Text>
                        <TouchableOpacity onPress={() => adjustFontSize('increase')} disabled={!canIncreaseFont}>
                            <AntDesign name="pluscircleo" size={22 * currentFontScale} color={canIncreaseFont ? colors.primary : colors.textSecondary} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* 3. LANGUE (Action factice) */}
                <SettingItem 
                    icon="globe-outline" 
                    label="Langue" 
                    onPress={() => handleNavigation('Language')}
                    actionText="Français"
                    iconPack={Ionicons}
                />
                
                {/* --- NOTIFICATIONS & SÉCURITÉ --- */}
                <Text style={[styles.sectionTitle, { color: colors.textSecondary, fontFamily: FONTS.Poppins_SemiBold }]}>NOTIFICATIONS & SÉCURITÉ</Text>
                <SettingItem 
                    icon="bell-outline" 
                    label="Alertes de Messages" 
                    type="toggle"
                    value={true} // Factice
                    onPress={() => console.log('Toggle Messages')} 
                    iconPack={MaterialCommunityIcons}
                />
                <SettingItem 
                    icon="trending-up" 
                    label="Nouveaux Résultats" 
                    type="toggle"
                    value={false} // Factice
                    onPress={() => console.log('Toggle Results')} 
                    iconPack={Feather}
                />
                <SettingItem 
                    icon="tag-outline" 
                    label="Promotions" 
                    type="toggle"
                    value={true} // Factice
                    onPress={() => console.log('Toggle Promotions')} 
                    iconPack={MaterialCommunityIcons}
                />
                <SettingItem 
                    icon="lock-open-outline" 
                    label="Authentification à deux facteurs" 
                    onPress={() => handleNavigation('2FA')}
                    iconPack={MaterialCommunityIcons}
                />

                {/* --- SUPPORT --- */}
                <Text style={[styles.sectionTitle, { color: colors.textSecondary, fontFamily: FONTS.Poppins_SemiBold }]}>SUPPORT</Text>
                <SettingItem 
                    icon="help-circle-outline" 
                    label="Centre d'Aide Support" 
                    onPress={() => handleNavigation('HelpCenter')}
                    iconPack={MaterialCommunityIcons}
                />
                <SettingItem 
                    icon="file-document-outline" 
                    label="Politique de Confidentialité" 
                    onPress={() => handleNavigation('PrivacyPolicy')}
                    iconPack={MaterialCommunityIcons}
                />
                <SettingItem 
                    icon="file-text-outline" 
                    label="Conditions d'Utilisation" 
                    onPress={() => handleNavigation('Terms')}
                    iconPack={MaterialCommunityIcons}
                />
                
                {/* Bouton de Déconnexion */}
                <TouchableOpacity 
                    style={[styles.logoutButton, { backgroundColor: colors.error + '10' }]} 
                    onPress={() => console.log('Déconnexion...')}
                >
                    <MaterialCommunityIcons name="logout" size={20} color={colors.error} />
                    <Text style={[styles.logoutText, { color: colors.error, fontSize: 15 * currentFontScale, fontFamily: FONTS.Poppins_Medium }]}>
                        Déconnexion
                    </Text>
                </TouchableOpacity>

            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderBottomWidth: StyleSheet.hairlineWidth,
        position: 'relative',
    },
    backButton: {
        position: 'absolute',
        left: 15,
        padding: 5,
        zIndex: 10,
    },
    headerTitle: {
        fontSize: 18,
    },
    scrollContent: {
        flex: 1,
        paddingHorizontal: 15,
    },
    // --- Profil ---
    profileCard: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 10,
        marginVertical: 15,
        borderRadius: 10,
        borderWidth: StyleSheet.hairlineWidth,
        elevation: 1,
    },
    profileInfo: {
        marginLeft: 15,
    },
    profileName: {
        // fontSize géré par currentFontScale
    },
    profileEmail: {
        // fontSize géré par currentFontScale
    },
    // --- Sections et Items ---
    sectionTitle: {
        marginTop: 20,
        marginBottom: 8,
        paddingLeft: 10,
        fontSize: 12,
        letterSpacing: 0.5,
    },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 10,
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    leftContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconStyle: {
        width: 30,
        marginRight: 10,
    },
    label: {
        flexShrink: 1,
    },
    rightContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    actionText: {
        marginRight: 5,
    },
    // --- Ajusteur de Police ---
    fontAdjuster: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
    },
    fontScaleLabel: {
        fontWeight: 'bold',
    },
    // --- Déconnexion ---
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 30,
        padding: 15,
        borderRadius: 10,
        borderWidth: StyleSheet.hairlineWidth,
    },
    logoutText: {
        marginLeft: 10,
    },
});