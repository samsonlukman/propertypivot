import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, Button } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';

const SavedLands = () => {
  const [savedProperties, setSavedProperties] = useState([]);
  const [landDetails, setLandDetails] = useState({});
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const [landImages, setLandImages] = useState({});
  const navigation = useNavigation();
  const { user } = useAuth(); // Assuming user object contains isAuthenticated property

  useEffect(() => {
    if (user && user.isAuthenticated) {
      // Fetch the logged-in user ID
      axios
        .get('https://estaty.pythonanywhere.com/api/user/')
        .then((response) => {
          const loggedInUserId = response.data.id;
          setLoggedInUserId(loggedInUserId);
          // Fetch saved properties only if the user is authenticated
          axios
            .get('https://estaty.pythonanywhere.com/api/saved-land/')
            .then((response) => {
              // Filter saved properties based on the logged-in user's ID
              const userSavedProperties = response.data.filter(property => property.user === loggedInUserId);
              setSavedProperties(userSavedProperties);
              // Extract land IDs to fetch corresponding land details
              const landIds = userSavedProperties.map(item => item.land);
              fetchLandDetails(landIds);
            })
            .catch((error) => {
              console.error('Error fetching saved properties:', error);
            });
        })
        .catch((error) => {
          console.error('Error fetching logged-in user ID:', error);
        });
    }
  }, [user]);

  const fetchLandDetails = async (landIds) => {
    try {
      const details = {};
      for (const landId of landIds) {
        const response = await axios.get(`https://estaty.pythonanywhere.com/api/land/${landId}`);
        details[landId] = response.data;
      }
      setLandDetails(details);
      fetchLandImages(landIds);
    } catch (error) {
      console.error('Error fetching land details:', error);
    }
  };

  const fetchLandImages = async (landIds) => {
    try {
      const images = {};
      for (const landId of landIds) {
        const response = await axios.get(`https://estaty.pythonanywhere.com/api/land-images/?land=${landId}`);
        const landImages = response.data.map(image => image.image);
        images[landId] = landImages;
      }
      setLandImages(images);
    } catch (error) {
      console.error('Error fetching building images:', error);
    }
  };

  const navigateToPropertyDetail = (propertyId) => {
    navigation.navigate('Land Detail', { propertyId });
  };

  const renderSavedPropertyItem = ({ item }) => {
    const land = landDetails[item.land];
    const images = landImages[item.land];
    if (!land  || !images) {
      return null; // Render nothing if land details are not available yet
    }
    return (
      <TouchableOpacity onPress={() => navigateToPropertyDetail(item.land)}>
        <View style={styles.savedPropertyItem}>
        <Image source={{ uri: images[0] }} style={styles.propertyImage} />
          <Text style={styles.savedPropertyTitle}>{land.name}</Text>
          <Text>Price: {land.price}</Text>
          <Text>Country: {land.country}</Text>
          <Text>Type: {land.land_type}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {user && user.isAuthenticated ? (
        <>
        
          <FlatList
            data={savedProperties}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderSavedPropertyItem}
          />
        </>
      ) : (
        <View style={styles.notLoggedIn}>
          <Text>You are not logged in.</Text>
          <Button title="Login/Signup" onPress={() => navigation.navigate('Login')} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  savedPropertyItem: {
    marginBottom: 15,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#FFC46C'
  },
  savedPropertyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  propertyImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
    borderRadius: 8,
    marginBottom: 10,
  },
  notLoggedIn: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
});

export default SavedLands;
