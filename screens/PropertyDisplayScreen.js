// PropertyDisplayScreen.js
import React from 'react';
import { ScrollView, View, Text } from 'react-native';
import PropertyDisplay from '../components/PropertyDisplay';

const PropertyDisplayScreen = () => {
  return (
    <ScrollView>
      <View>
        <PropertyDisplay />
      </View>
    </ScrollView>
  );
};

export default PropertyDisplayScreen;
