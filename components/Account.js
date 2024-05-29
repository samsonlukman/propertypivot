import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Modal, Button, ScrollView } from 'react-native';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { Linking } from 'react-native';


const Account = ({ navigation }) => {
  const { user, logout } = useAuth();
  const [userInfo, setUserInfo] = useState(null);
  const [isSavedPropertiesModalVisible, setIsSavedPropertiesModalVisible] = useState(false);
  const [isContactUsModalVisible, setIsContactUsModalVisible] = useState(false);
  const [isUploadModalVisible, setIsUploadModalVisible] = useState(false);
  

  const toggleUploadModal = () => {
    setIsUploadModalVisible(!isUploadModalVisible);
  };
  

  const toggleContactUsModal = () => {
    setIsContactUsModalVisible(!isContactUsModalVisible);
  };

  const toggleSavedPropertiesModal = () => {
    setIsSavedPropertiesModalVisible(!isSavedPropertiesModalVisible);
  };

  const handleWhatsApp = () => {
    // You can replace '1234567890' with the actual phone number
    Linking.openURL(`whatsapp://send?text=Hello&phone=+2349066440069`);
  };

  const handleEmail = () => {
    // You can replace 'recipient@example.com' with the actual email address
    Linking.openURL('mailto:worknorm99@gmail.com?subject=Complaint&body=Hello%20there');
  };

  const [fontsLoaded, fontError] = useFonts({
    'Roboto-Italic': require('../assets/fonts/Roboto-Italic.ttf'),
    'Roboto-Regular': require('../assets/fonts/Roboto-Regular.ttf'),
    'Roboto-Bold': require('../assets/fonts/Roboto-Bold.ttf'),
  });

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get('https://estaty.pythonanywhere.com/api/user/');
        setUserInfo(response.data);
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    const handleFontLoading = async () => {
      if (fontsLoaded || fontError) {
        await SplashScreen.hideAsync();
      }
    };

    if (user && user.isAuthenticated) {
      SplashScreen.preventAutoHideAsync();
      fetchUserInfo();
      handleFontLoading();
    }
  }, [user, fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    
    <View style={styles.container}>
      {user && user.isAuthenticated ? (
        <View style={styles.userInfo}>
          <View style={styles.profileSection}>
            {userInfo && userInfo.profile_pics ? (
              
                <Image
                  style={styles.profileImage}
                  source={{ uri: `https://estaty.pythonanywhere.com/${userInfo.profile_pics}` }}
                />
              
            ) : (
              <View style={styles.noProfilePic}>
                <Text style={styles.noProfilePicText}>No Profile Picture</Text>
              </View>
            )}

            <View style={styles.nameInfo}>
              <Text style={styles.name}>
                {userInfo && userInfo.first_name} {userInfo && userInfo.last_name}
              </Text>
            </View>
          </View>

          <View style={styles.detailsSection}>
            <View style={styles.detailItem}>
              <Text style={styles.label}>Username: </Text>
              <Text style={styles.value}>{userInfo && userInfo.username}</Text>
            </View>

            <View style={styles.detailItem}>
              <Text style={styles.label}>Email: </Text>
              <Text style={styles.value}>{userInfo && userInfo.email}</Text>
            </View>

            <View style={styles.detailItem}>
              <Text style={styles.label}>Phone Number: </Text>
              <Text style={styles.value}>{userInfo && userInfo.phone_number}</Text>
            </View>

            
              
              
          
          </View>

         

          
          <TouchableOpacity onPress={toggleUploadModal}>
            <Text style={styles.linkText}>Upload Property</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={toggleSavedPropertiesModal}>
            <Text style={styles.linkText}>Saved Properties</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('AboutUs')}>
            <Text style={styles.linkText}>About Us</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={toggleContactUsModal}>
            <Text style={styles.linkText}>Contact Us</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
            <Text style={styles.linkText}>Settings</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => { logout(); navigation.navigate('Login'); }}>
            <Text style={styles.linkText}>Logout</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.notLoggedIn}>
          <Text>You are not logged in.</Text>
          <Button title="Login/Signup" onPress={() => navigation.navigate('Login')} />
        </View>
      )}

      {/* Uplaod Modal */}

      <Modal
        animationType="slide"
        transparent={true}
        visible={isUploadModalVisible}
        onRequestClose={toggleUploadModal}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity onPress={() => { toggleUploadModal(); navigation.navigate('UploadLand')}} >
            <Text style={styles.modalEmail}>Land---></Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => { toggleUploadModal(); navigation.navigate('UploadBuilding')}}>
            <Text style={styles.modalWhatsapp}>Building---></Text>
          </TouchableOpacity>

          <Button title="Close" onPress={toggleUploadModal} />
        </View>
      </Modal>

      {/* Saved Properties Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isSavedPropertiesModalVisible}
        onRequestClose={toggleSavedPropertiesModal}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity onPress={() => { toggleSavedPropertiesModal(); navigation.navigate('SavedLands')}} >
            <Text style={styles.modalEmail}>Lands---></Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => { toggleSavedPropertiesModal(); navigation.navigate('SavedBuildings')}}>
            <Text style={styles.modalWhatsapp}>Buildings---></Text>
          </TouchableOpacity>

          <Button title="Close" onPress={toggleSavedPropertiesModal} />
        </View>
      </Modal>

      {/* Contact Us Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isContactUsModalVisible}
        onRequestClose={toggleContactUsModal}
      >
        <View style={styles.modalContainer}>         
          <TouchableOpacity onPress={handleEmail}>
            <Text style={styles.modalEmail}>email ---></Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleWhatsApp}>
            <Text style={styles.modalWhatsapp}>WhatsApp ---></Text>
          </TouchableOpacity>
          
          <Button title="Close" onPress={toggleContactUsModal} />
        </View>
      </Modal>
    </View>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: '#80A878',
    marginBottom: 10,
    marginTop: 10,
  },
  userInfo: {
    maxWidth: '80%',
  },
  profileSection: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#FFC46C',
  },
  noProfilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noProfilePicText: {
    fontSize: 16,
  },
  nameInfo: {
    marginLeft: 20,
  },
  detailsSection: {
    marginTop: 15,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
  },
  value: {
    fontSize: 15,
  },
  name: {
    fontSize: 20,
    fontFamily: 'Roboto-Bold',
  },
  detailItem: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  linkText: {
    fontSize: 16,
    marginTop: 15,
  },
  notLoggedIn: {
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'purple',
    width: '50%',
    maxHeight: '90%',
    top: '10%'
  },
  modalEmail: {
    fontSize: 20,
    
    marginBottom: 0,
    backgroundColor: '#FFC46C',
    paddingLeft: 20,
    paddingRight: 20,
    zIndex: 50,
  },
  modalWhatsapp: {
    fontSize: 16,
    color: 'white',
    marginBottom: 20,
    backgroundColor: 'green',
    paddingLeft: 20,
    paddingRight: 20,
    zIndex: 50
  },
});

export default Account;
