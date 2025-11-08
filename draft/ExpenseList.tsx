import React, { useState, useMemo } from 'react';
import { View, FlatList, TextInput, StyleSheet, Text, TouchableOpacity, Modal } from 'react-native';
import PropertyCard from '../components/PropertyCard';
import Feather from '@expo/vector-icons/Feather';
import MaterialIcons from '@expo/vector-icons/MaterialIcons'; // Ajouté pour les flèches du sélecteur
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'; // Ajouté pour l'icône de table

// Assurez-vous d'importer COLORS et d'utiliser la bonne structure de dossiers
import { COLORS } from '../../assets/Theme'; 
import { useProperties } from '../../contexts/PropertyContext';
import { DataTable } from 'react-native-paper'; // Importé pour le composant de pagination

export default function ListingsScreen({ navigation }) {

  const { properties } = useProperties();
  const [searchText, setSearchText] = useState('');

  // 1. ÉTATS DE PAGINATION
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10); // Valeur par défaut
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const pageOptions = [10, 25, 50]; // Options pour le sélecteur d'éléments

  // 2. FILTRAGE DES DONNÉES (useMemo)
  const filteredProperties = useMemo(() => {
    if (!Array.isArray(properties)) return [];
    if (!searchText.trim()) return properties;

    return properties.filter(p =>
      p.title.toLowerCase().includes(searchText.toLowerCase()) ||
      p.location.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [searchText, properties]);
  
  // 3. CALCULS DE PAGINATION
  const totalItems = filteredProperties.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const paginatedProperties = useMemo(() => {
    const start = currentPage * itemsPerPage;
    return filteredProperties.slice(start, start + itemsPerPage);
  }, [currentPage, filteredProperties, itemsPerPage]);

  const startIndex = currentPage * itemsPerPage + 1;
  const endIndex = Math.min(startIndex + paginatedProperties.length - 1, totalItems);

  // 4. GESTION DU SÉLECTEUR
  const handleSelectValue = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(0); // Réinitialiser à la première page
    setDropdownVisible(false);
  };
  
  // Fonction pour changer de page
  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Optionnel : remonter en haut de la liste lors du changement de page
    // if (listRef.current) { listRef.current.scrollToOffset({ offset: 0, animated: true }); }
  };

  return (
    <View style={styles.listingsContainer}>
      <View style={styles.searchInputContainer}>
        <Feather name="search" size={20} color={COLORS.gray} />
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher par titre ou lieu..."
          value={searchText}
          onChangeText={(text) => {
            setSearchText(text);
            setCurrentPage(0); // Réinitialiser la page lors de la recherche
          }}
          placeholderTextColor={COLORS.gray}
          clearButtonMode="always"
        />
      </View>

      {/* 5. AFFICHER LE SÉLECTEUR DU NOMBRE D'ÉLÉMENTS */}
      {totalItems > 0 && (
        <View style={styles.paginationSelectorContainer}>
          <View style={{ flexDirection: 'row', alignItems: "center", gap: 5 }}>
            <MaterialCommunityIcons name="home-city" size={18} color={COLORS.gray} />
            <Text style={styles.selectorLabel}>
              {String(startIndex)} – {String(endIndex)} sur {String(totalItems)} annonces
            </Text>
          </View>

          <View style={{ zIndex: 10 }}> {/* ZIndex important pour le Modal sur le Dropdown */}
            <TouchableOpacity
              style={styles.customSelect}
              onPress={() => setDropdownVisible(!dropdownVisible)}
            >
              <Text style={styles.customSelectText}>{itemsPerPage}</Text>
              <MaterialIcons name="arrow-drop-down" size={20} color={COLORS.black} />
            </TouchableOpacity>

            <Modal
                transparent={true}
                visible={dropdownVisible}
                onRequestClose={() => setDropdownVisible(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    onPress={() => setDropdownVisible(false)}
                >
                    <View style={[styles.dropdownOptions, { top: 0, right: 15 }]}>
                        {pageOptions.map((value) => (
                            <TouchableOpacity
                                key={value}
                                style={styles.dropdownOption}
                                onPress={() => handleSelectValue(value)}
                            >
                                <Text style={styles.dropdownOptionText}>{String(value)}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </TouchableOpacity>
            </Modal>

          </View>
        </View>
      )}

      {/* 6. MODIFICATION DE LA LISTE : Utiliser les données paginées */}
      <FlatList
        showsVerticalScrollIndicator={false}
        data={paginatedProperties} // Changement : utilise les données paginées
        keyExtractor={item => String(item.id)} // Assurer que la clé est une chaîne
        contentContainerStyle={paginatedProperties.length === 0 ? styles.listEmptyContainer : styles.listContentContainer}
        ListEmptyComponent={() => (
          <View style={styles.emptyList}>
            <Text style={styles.emptyText}>
              {searchText ? "Aucune annonce ne correspond à votre recherche." : "Aucune annonce enregistrée."}
            </Text>
          </View>
        )}
        renderItem={({ item }) => (
          <PropertyCard
            property={item}
            onPress={() => navigation.navigate('Detail', { property: item })}
          />
        )}
      />

      {/* 7. COMPOSANT DE PAGINATION INFÉRIEUR */}
      {totalPages > 1 && (
        <DataTable.Pagination
          page={currentPage}
          numberOfPages={totalPages}
          onPageChange={handlePageChange}
          label={`Page ${currentPage + 1} sur ${totalPages}`}
          showFastPaginationControls // Pour aller directement au début/fin
          style={styles.paginationControls}
          // Customisation des couleurs pour s'aligner avec votre palette (si COLORS.primary est défini)
          color={COLORS.primary || 'blue'}
        />
      )}

    </View>
  );
}

// =========================================================================================
// STYLES AJUSTÉS ET NOUVEAUX STYLES
// =========================================================================================

const styles = StyleSheet.create({
  listingsContainer: {
    flex: 1,
    backgroundColor: COLORS.background, // Utilisation de la nouvelle palette
    paddingHorizontal: 15,
    paddingTop: 10
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    height: 44,
  },
  searchInput: {
    flex: 1,
    height: 42,
    fontSize: 14,
    color: COLORS.black,
    paddingLeft: 10,
  },
  // Nouveaux styles pour le sélecteur de pagination
  paginationSelectorContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    paddingHorizontal: 5,
  },
  selectorLabel: {
    fontSize: 12,
    color: COLORS.gray,
  },
  customSelect: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: COLORS.white,
  },
  customSelectText: {
    fontSize: 14,
    color: COLORS.black,
  },
  dropdownOptions: {
    position: "absolute",
    width: 60,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 8,
    // Positionnement par rapport à son parent (Modal Overlay)
    // Nous devons ajuster le positionnement dans le Modal pour qu'il s'affiche correctement
  },
  dropdownOption: {
    paddingVertical: 8,
    alignItems: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.gray,
  },
  dropdownOptionText: { 
    fontSize: 14, 
    color: COLORS.secondary 
  },
  modalOverlay: {
    flex: 1,
    // Permet de cliquer à l'extérieur pour fermer, sans obscurcir l'écran
  },
  // Style pour la liste
  listContentContainer: { paddingBottom: 20 },
  listEmptyContainer: { flexGrow: 1, justifyContent: 'center', alignItems: 'center' },
  emptyList: {
    flex: 1,
    alignItems: 'center',
    marginTop: 80,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.gray,
  },
  paginationControls: {
    borderTopWidth: 1,
    borderColor: COLORS.gray,
    paddingVertical: 5,
    backgroundColor: COLORS.white,
  }
});