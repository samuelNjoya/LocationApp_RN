import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Platform, ScrollView, KeyboardAvoidingView } from 'react-native';
import { useAuth, User } from '../../contexts/AuthContext'; // Assurez-vous que ce chemin est correct
import { AntDesign, Feather } from '@expo/vector-icons';
import { COLORS } from '../../assets/Theme';
import { useToast } from 'react-native-toast-notifications';

interface ProfileFormModalProps {
    isVisible: boolean;
    onClose: () => void;
}

const ProfileFormModal: React.FC<ProfileFormModalProps> = ({ isVisible, onClose }) => {
    const { user, updateProfile } = useAuth();
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    // NOTE: La modification de la photo est complexe (gestion des fichiers/uploads). 
    // Pour l'instant, on laisse l'URL par défaut. Si vous implémentez l'upload de photo, cette partie changera.
    const Toast = useToast();

    useEffect(() => {
        if (user) {
            setName(user.name);
            setPhone(user.phone || '');
            setAddress(user.address || '');
            setCity(user.city || '');
        }
    }, [user]);

    const handleSave = async () => {
        if (!user) return;

        const updates: Partial<User> = { name, phone, address, city };
        
        // Ici, nous n'incluons PAS la mise à jour du mot de passe ou de l'email.
        // Celles-ci nécessitent des étapes de sécurité supplémentaires.

        const success = await updateProfile(updates);

        if (success) {
            Toast.show('Profil mis à jour avec succès !', { type: 'success', placement: 'top' });
            onClose();
        } else {
            Toast.show('Erreur lors de la mise à jour du profil.', { type: 'danger', placement: 'top' });
        }
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView
                style={modalStyles.centeredView}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <View style={modalStyles.modalView}>
                    <View style={modalStyles.header}>
                        <Text style={modalStyles.modalTitle}>Modifier mon Profil</Text>
                        <TouchableOpacity onPress={onClose}>
                            <AntDesign name="close-circle" size={24} color="#999" />
                        </TouchableOpacity>
                    </View>
                    
                    <ScrollView style={{ width: '100%' }}>
                        
                        <View style={modalStyles.inputGroup}>
                            <Text style={modalStyles.label}>Nom complet</Text>
                            <TextInput
                                style={modalStyles.input}
                                value={name}
                                onChangeText={setName}
                                placeholder="Votre nom"
                            />
                        </View>

                        <View style={modalStyles.inputGroup}>
                            <Text style={modalStyles.label}>Numéro de Téléphone</Text>
                            <TextInput
                                style={modalStyles.input}
                                value={phone}
                                onChangeText={setPhone}
                                keyboardType="phone-pad"
                                placeholder="Ex: 77 XX XX XX XX"
                            />
                        </View>
                        
                        <View style={modalStyles.inputGroup}>
                            <Text style={modalStyles.label}>Ville</Text>
                            <TextInput
                                style={modalStyles.input}
                                value={city}
                                onChangeText={setCity}
                                placeholder="Ville de résidence"
                            />
                        </View>

                        <View style={modalStyles.inputGroup}>
                            <Text style={modalStyles.label}>Adresse Physique</Text>
                            <TextInput
                                style={modalStyles.input}
                                value={address}
                                onChangeText={setAddress}
                                placeholder="Adresse complète"
                            />
                        </View>
                        
                        {/* Optionnel: Placeholder pour la photo */}
                        <View style={modalStyles.photoPlaceholder}>
                            <Image 
                                source={{ uri: user?.photoUrl }}
                                style={modalStyles.photo}
                            />
                            <Text style={modalStyles.photoText}>Pour modifier la photo, veuillez utiliser une autre plateforme.</Text>
                        </View>

                    </ScrollView>

                    <TouchableOpacity style={modalStyles.saveButton} onPress={handleSave}>
                        <Text style={modalStyles.saveButtonText}>Enregistrer les modifications</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};

export default ProfileFormModal;

const modalStyles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 25,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: '90%',
        maxHeight: '80%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.greenColors,
    },
    inputGroup: {
        width: '100%',
        marginBottom: 15,
    },
    label: {
        fontSize: 14,
        color: '#555',
        marginBottom: 5,
        fontWeight: '600',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 10,
        backgroundColor: '#f9f9f9',
        fontSize: 16,
    },
    saveButton: {
        backgroundColor: COLORS.greenColors,
        borderRadius: 10,
        padding: 14,
        elevation: 2,
        marginTop: 20,
        width: '100%',
    },
    saveButtonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 16,
    },
    photoPlaceholder: {
        alignItems: 'center',
        paddingVertical: 15,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        marginTop: 10,
    },
    photo: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginBottom: 8,
        borderWidth: 2,
        borderColor: '#ddd',
    },
    photoText: {
        fontSize: 12,
        color: '#888',
        textAlign: 'center',
    }
});