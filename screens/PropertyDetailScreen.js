import React from 'react';
import { ScrollView, View, Text } from 'react-native';
import PropertyDetail from '../components/PropertyDetail';

const PropertyDetailScreen = ({ route }) => {
  const { propertyId } = route.params;

  return (
    <ScrollView>
      <View>
       
        <PropertyDetail route={{ params: { propertyId } }} />
      </View>
    </ScrollView>
  );
};

export default PropertyDetailScreen;
