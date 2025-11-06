import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

export default function Spinner({ visible }) {
  if (!visible) return null;
  return (
    <View style={styles.overlay}>
      <ActivityIndicator size="large" color="#2a9d8f" />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,//Le composant prend toute la taille de son parent 
    backgroundColor:'rgba(0,0,0,0.16)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
});
