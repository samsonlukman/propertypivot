import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Modal, Button } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import Swiper from 'react-native-swiper';

const PropertyDetail = ({ route }) => {
  const { user } = useAuth();
  const propertyId = route.params.propertyId;
  const [property, setProperty] = useState(null);
  const [images, setImages] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const navigation = useNavigation();

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  useEffect(() => {
    const fetchPropertyDetail = async () => {
      try {
        const propertyResponse = await axios.get(`https://estaty.pythonanywhere.com/api/buildings/${propertyId}`);
        setProperty(propertyResponse.data);
      } catch (error) {
        console.error('Error fetching property detail:', error);
      }
    };

    const fetchBuildingImages = async () => {
      try {
        const imagesResponse = await axios.get(`https://estaty.pythonanywhere.com/api/building-images/?building=${propertyId}`);
        const filteredImages = imagesResponse.data
          .filter(image => image.building === propertyId)
          .map(image => image.image);
        setImages(filteredImages);
      } catch (error) {
        console.error('Error fetching building images:', error);
      }
    };

    fetchPropertyDetail();
    fetchBuildingImages();
  }, [propertyId]);

  const [fontsLoaded, fontError] = useFonts({
    'Roboto-Italic': require('../assets/fonts/Roboto-Italic.ttf'),
    'Roboto-Regular': require('../assets/fonts/Roboto-Regular.ttf'),
    'Roboto-Bold': require('../assets/fonts/Roboto-Bold.ttf'),
  });

  useEffect(() => {
    const handleFontLoading = async () => {
      if (fontsLoaded || fontError) {
        await SplashScreen.hideAsync();
      }
    };

    handleFontLoading();
  }, [fontsLoaded, fontError]);

  const renderContactUserSection = () => {
    if (!property) return null;

    if (user && user.isAuthenticated) {
      return (
        <TouchableOpacity onPress={toggleModal}>
          <View style={styles.contactUserButton}>
            <Icon name="phone" size={12} style={{ marginRight: 5 }} />
            {renderContactUserSection()}
          </View>
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginButton}>Login to see owner's contact info</Text>
        </TouchableOpacity>
      );
    }
  };

  const renderUserInfoModal = () => {
    if (!property) return null;

    return (
      <Modal visible={isModalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <TouchableOpacity onPress={toggleModal}>
            <Text style={styles.modalCloseText}>Close</Text>
          </TouchableOpacity>
          {property.property_owner.profile_pics ? (
           <Image source={{ uri: property.property_owner.profile_pics }} style={styles.modalProfileImage} />
          ) : (
            <View style={styles.noProfilePic}>
              <Text style={styles.noProfilePicText}>No Profile Picture</Text>
            </View>
          )}
          <View style={styles.modalUserInfo}>
            <Text style={styles.modalName}>
              {property.property_owner.first_name} {property.property_owner.last_name}
            </Text>
            <Text style={styles.modalUsername}>Username: {property.property_owner.username}</Text>
            <Text style={styles.modalEmail}>Email: {property.property_owner.email}</Text>
            <Text style={styles.modalPhoneNumber}>Phone Number: {property.property_owner.phone_number}</Text>
            <Text style={styles.modalAbout}>About: {property.property_owner.about}</Text>
          </View>
        </View>
      </Modal>
    );
  };

  const renderAmenities = (amenity, name) => {
    const iconName = amenity ? 'check' : 'times';
    return (
      <Text style={styles.propertyDetailLabel} key={name}>
        <Icon name={iconName} size={16} style={{ marginRight: 5 }} />
        {name}: {amenity ? 'Yes' : 'No'}
      </Text>
    );
  };

  const renderPropertyInfo = () => {
    if (!property) return null;

    return (
      <View>
        <Swiper
        style={styles.carouselContainer}
          loop={false}
          showsPagination
          dot={<View style={styles.paginationDot} />}
          activeDot={<View style={styles.activePaginationDot} />}
          onIndexChanged={(index) => setActiveImageIndex(index)}
        >
          {images.map((image, index) => (
            <View key={index}>
              <Image source={{ uri: image }} style={styles.propertyImage} />
            </View>
          ))}
        </Swiper>
        <Text style={styles.propertyTitle}>{property.name}</Text>

        <View style={styles.propertyDetails}>
          <Text style={styles.propertyDetailLabel}>
            <Icon name="user" size={16} style={{ marginRight: 5 }} /> Owner: {property.property_owner.username}
          </Text>
          {user.isAuthenticated ? (
          <TouchableOpacity onPress={toggleModal}>
            <Text style={styles.contactUserButton}>Contact Owner</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.contactUserButton}>Login to Contact Owner</Text>
          </TouchableOpacity>
        )}

          <Text style={styles.propertyDetailLabel}>
            <Icon name={property.property_type === 'sale' ? 'home' : 'home'} size={16} style={{ marginRight: 5 }} /> Price: {property.price}
          </Text>
          <Text style={styles.propertyDetailLabel}>
            <Icon name="building" size={16} style={{ marginRight: 5 }} /> Condition: {property.condition}
          </Text>
          <Text style={styles.propertyDetailLabel}>
            <Icon name="flag" size={16} style={{ marginRight: 5 }} /> Country: {property.country}
          </Text>
          <Text style={styles.propertyDetailLabel}>
            <Icon name="building" size={16} style={{ marginRight: 5 }} /> Type: {property.building_type}
          </Text>
          <Text style={styles.propertyDetailLabel}>
            <Icon name="calendar" size={16}
             style={{ marginRight: 5 }} />  {property.date_posted.substring(0, 10)}
             </Text>
             <Text style={styles.propertyDetailLabel}>
               <Icon name="bed" size={16} style={{ marginRight: 5 }} /> Bedrooms: {property.bedrooms}
             </Text>
             <Text style={styles.propertyDetailLabel}>
               <Icon name="bath" size={16} style={{ marginRight: 5 }} /> Bathrooms: {property.bathrooms}
             </Text>
             <Text style={styles.propertyDetailLabel}>
               <Icon name="bath" size={16} style={{ marginRight: 5 }} /> Toilets: {property.toilets}
             </Text>
   
             {renderAmenities(property.furnishing, 'Furnishing')}
             {renderAmenities(property.swimming_pool, 'Swimming Pool')}
             {renderAmenities(property.highspeed_internet, 'Highspeed Internet')}
             {renderAmenities(property.gym, 'Gym')}
             {renderAmenities(property.dishwasher, 'Dishwasher')}
             {renderAmenities(property.wifi, 'Wifi')}
             {renderAmenities(property.garage, 'Garage')}
           </View>
         </View>
       );
     };
   
     if (!fontsLoaded && !fontError) {
       return null; // Or display a loading indicator
     }
   
     return (
       <View>
         {renderPropertyInfo()}
         {renderUserInfoModal()}
       </View>
     );
   };
   
   
   const styles = StyleSheet.create({
      container: {
       flex: 1,
       padding: 20,
       backgroundColor: '#FFC46C',
     },
     propertyImage: {
       width: '100%',
       height: 250,
       resizeMode: 'cover',
       borderRadius: 8,
       objectFit: 'contain'
     },
     propertyTitle: {
       fontSize: 22,
       fontWeight: 'bold',
       marginBottom: 10,
       left: 15
     },
     propertyDetails: {
       flexDirection: 'row',
       flexWrap: 'wrap',
       justifyContent: 'space-between',
       marginBottom: 20,
       padding: 10
     },
     propertyDetailLabel: {
       width: '48%', // Adjusted width for better spacing
       marginBottom: 10,
       flexDirection: 'row',
       alignItems: 'center',
       fontFamily: 'Roboto-Regular',
     },
     loginButton: {
       color: 'blue',
       textDecorationLine: 'underline',
       marginBottom: 10,
       fontFamily: 'Roboto-Regular',
     },
     contactUserButton: {
       flexDirection: 'row',
       alignItems: 'center',
       backgroundColor: '#aaffaa',
       padding: 2,
       borderRadius: 5,
       right: '100%'
     },
     carouselContainer: {
      height: 200,
    },
     modalContainer: {
       backgroundColor: 'white',
       width: '80%',
       borderRadius: 10, 
       padding: 20, 
       position: 'absolute', 
       top: '20%',
       left: '10%', // Changed 'left' to center horizontally
     },
     modalCloseText: {
     
       fontSize: 18,
       marginBottom: 20,
       fontFamily: 'Roboto-Bold',
     },
     modalProfileImage: {
       width: 100,
       height: 100,
       borderRadius: 50,
       borderWidth: 3,
       borderColor: 'white',
       left: 90
     },
     noProfilePic: {
       width: 100,
       height: 100,
       borderRadius: 50,
       backgroundColor: '#f0f0f0',
       justifyContent: 'center',
       alignItems: 'center',
       left: 60
     },
     noProfilePicText: {
       fontSize: 16,
       fontFamily: 'Roboto-Regular',
     },
     modalUserInfo: {
     marginTop: 20
     },
     modalName: {
       fontSize: 20,
       fontFamily: 'Roboto-Bold',
       marginBottom: 5,
       
     },
     modalUsername: {
       fontSize: 16,
       marginBottom: 5,
       fontFamily: 'Roboto-Regular', 
     
       marginTop: 10
     },
     modalEmail: {
       fontSize: 16,
       marginBottom: 5,
       fontFamily: 'Roboto-Regular',
    
       marginTop: 10
     },
     modalPhoneNumber: {
       fontSize: 16,
       marginBottom: 5,
       fontFamily: 'Roboto-Regular',
     
       marginTop: 10
     },
     modalAbout: {
       fontSize: 16,
       marginBottom: 5,
       fontFamily: 'Roboto-Regular',
       marginTop: 10
     },
     paginationContainer: {
       paddingVertical: 6,
     },
     paginationDot: {
      width: 30,
      height: 10,
      borderRadius: 4,
      backgroundColor: 'black',
      marginHorizontal: 10,
    },
    activePaginationDot: {
      width: 30,
      height: 10,
      borderRadius: 4,
      backgroundColor: 'white',
      marginHorizontal: 5,
    },
   });
   
   export default PropertyDetail;
   
