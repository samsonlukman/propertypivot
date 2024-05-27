// UploadProperty.js
import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const UploadProperty = ({ navigation }) => {
  const handlePropertyType = (propertyType) => {
    // Depending on the propertyType, navigate to the appropriate screen
    if (propertyType === 'apartment') {
      navigation.navigate('UploadBuilding');
    } else if (propertyType === 'land') {
      navigation.navigate('UploadLand');
    }
  };

  return (
    <View style={styles.container}>
      <Text>Select Property Type:</Text>
      <Button title="Apartment" onPress={() => handlePropertyType('apartment')} />

      <Button title="Land" onPress={() => handlePropertyType('land')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5
  },
});

export default UploadProperty;
