import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import Icon from 'react-native-vector-icons/FontAwesome';
import Swiper from 'react-native-swiper';


const LandDisplay = () => {
  const [properties, setProperties] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [csrfToken, setCsrfToken] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const navigation = useNavigation();
  const { user, logout } = useAuth();

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await axios.get('https://estaty.pythonanywhere.com/api/get-csrf-token/');
        setCsrfToken(response.data.csrf_token);
      } catch (error) {
        console.error('Error fetching CSRF token:', error.message);
      }
    };

    fetchCsrfToken();
  }, []);

  useEffect(() => {
    if (csrfToken && user && user.isAuthenticated) {
      axios
        .get('https://estaty.pythonanywhere.com/api/user/', {
          headers: {
            'X-CSRFToken': csrfToken,
          },
        })
        .then((response) => {
          setLoggedInUser(response.data);
        })
        .catch((error) => {
          console.error('Error fetching user details:', error.response ? error.response.data : error.message);
        });
    }
  }, [csrfToken, user]);
  

  useEffect(() => {
    const fetchLandsAndImages = async () => {
      try {
        const landResponse = await axios.get('https://estaty.pythonanywhere.com/api/land/');
        const landImagesResponse = await axios.get('https://estaty.pythonanywhere.com/api/land-images/');
        
        let propertiesWithImages = landResponse.data.map((landItem) => {
          const relatedImages = landImagesResponse.data.filter(
            (image) => image.land === landItem.id
          );
  
          return {
            ...landItem,
            images: relatedImages.map((imageItem) => imageItem.image),
          };
        });
  
        // Filter lands by country for logged-in users
        if (loggedInUser) {
          propertiesWithImages = propertiesWithImages.filter(
            (land) => land.country === loggedInUser.country
          );
        }
  
        setProperties(propertiesWithImages);
      } catch (error) {
        console.error('Error fetching lands and images:', error.response ? error.response.data : error.message);
      }
    };
  
    fetchLandsAndImages();
  }, [loggedInUser]);
  

  const navigateToPropertyDetail = (propertyId) => {
    navigation.navigate('Land Detail', { propertyId });
  };

  const SaveUnsaveButton = ({ propertyId }) => {
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
      const checkIfLandIsSaved = async () => {
        try {
          const response = await axios.get('https://estaty.pythonanywhere.com/api/saved-land/', {
            headers: { 'X-CSRFToken': csrfToken },
          });
          const savedLands = response.data;
          const isLandAlreadySaved = savedLands.some((savedLand) => savedLand.land === propertyId && savedLand.user === loggedInUser.id);
          setIsSaved(isLandAlreadySaved);
        } catch (error) {
          console.error('Error checking saved lands:', error.response ? error.response.data : error.message);
        }
      };
  
      if (loggedInUser) {
        checkIfLandIsSaved();
      }
    }, [loggedInUser, csrfToken, propertyId]);
  
    const handleToggleSaveProperty = async () => {
      try {
        if (isSaved) {
          Alert.alert('Already Saved');
        } else {
          await axios.post(
            'https://estaty.pythonanywhere.com/api/saved-land/',
            { land: propertyId, user: loggedInUser.id },
            {
              headers: {
                'X-CSRFToken': csrfToken,
                'Referer': 'https://estaty.pythonanywhere.com',
              },
            }
          );
          setIsSaved(true);
          Alert.alert('Property Saved');
        }
      } catch (error) {
        console.error('Error saving property:', error.response ? error.response.data : error.message);
        Alert.alert('Error saving property');
      }
    };
    return (
      <TouchableOpacity onPress={handleToggleSaveProperty}>
      <Icon name='heart' size={30} color={isSaved ? 'red' : 'grey'} />
    </TouchableOpacity>
    );
  };

  const renderPropertyItem = ({ item }) => (
    
      <View style={styles.landItem}>
        <View style={styles.carouselContainer}>
          <Swiper
            loop={false}
            showsPagination
            paginationStyle={styles.paginationStyle}
  dot={<View style={styles.paginationDot} />}
  activeDot={<View style={styles.activePaginationDot} />}
            onIndexChanged={(index) => setActiveImageIndex(index)}
          >
            {item.images.map((image, index) => (
              <View key={index}>
                <Image source={{ uri: image }} style={styles.landImage} />
              </View>
            ))}
          </Swiper>
        </View> 
       
        <TouchableOpacity onPress={() => navigateToPropertyDetail(item.id)}>
          <View style={styles.propertyDetails}>
            <View style={styles.rowContainer}> 
              <Text style={styles.propertyTitle}>{item.name}</Text>
              {user && user.isAuthenticated && (
                <View style={styles.iconContainer}>
                  <SaveUnsaveButton propertyId={item.id} />
                </View>
              )}
            </View>
            <Text style={styles.propertyPrice}>Price: {item.currency}{item.price}</Text>
            <Text style={styles.propertyCountry}>Country: {item.country}</Text>
          </View>
        </TouchableOpacity>
      </View>
   
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={properties}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderPropertyItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    padding: 10,
  },
  landItem: {
    marginBottom: 20,
    backgroundColor: '#FFC46C',  
    borderRadius: 8,
    shadowColor: '#ccc',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3, 
    width: '100%', // Ensure the container is full width 
    borderBottomLeftRadius: 60,
    paddingBottom: 20
  },
  carouselContainer: {
    width: '100%',
    height: 200, 
  },
  landImage: { 
    width: '100%',
    height: '100%', 
    resizeMode: 'cover', 
    borderBottomLeftRadius: 80, // Add these lines
    
  }, 
  paginationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
  },
  paginationText: {
    color: '#fff',
    fontSize: 16,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start', 
    paddingHorizontal: 10,
  },
  iconContainer: {
    marginLeft: 8, 
  },
  propertyDetails: { 
    paddingLeft: 40
  }, 
  propertyTitle: {
    fontSize: 16, 
    fontWeight: 'bold',
    flexShrink: 1, 
    maxWidth: '80%',
    top: 5,
    right: 10,
    marginBottom: 5
  },
  propertyPrice: {
    fontSize: 12,
    top: 5
  },
  propertyCountry: {
    fontSize: 12, 
  },
  propertyOwner: {
    fontSize: 14,
  },
  paginationDot: {
    width: 30,
    height: 10,
    borderRadius: 4,
    backgroundColor: 'black',
    marginHorizontal: 5,
  },
  activePaginationDot: {
    width: 30,
    height: 10,
    borderRadius: 4,
    backgroundColor: 'white',
    marginHorizontal: 5,
  },
});

export default LandDisplay;

