// PropertyDisplayScreen.js
import React from 'react';
import { ScrollView, FlatList, View, SectionList, Text } from 'react-native';
import PropertyDisplay from '../components/PropertyDisplay';


const PropertyDisplayScreen = () => {
  return (
    <FlatList>
      <View>
        <PropertyDisplay />
      </View>
      </FlatList>
  );
};

export default PropertyDisplayScreen;
