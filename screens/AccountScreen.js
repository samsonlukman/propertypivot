// AccountScreen.js
import React from 'react';
import { ScrollView, View, Text, Button } from 'react-native';
import Account from '../components/Account';


const AccountScreen = ({ navigation }) => {
  const handleNavigateToUploadProperty = () => {
    navigation.navigate('UploadProperty'); // Adjust the screen name based on your actual screen name
  };

  return (
    <ScrollView>
      <View>
       
        <Account navigation={navigation} />
     
      </View>
    </ScrollView>
  );
};

export default AccountScreen;
