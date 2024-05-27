import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, Button } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';

const SavedBuildings = () => {
  const [savedProperties, setSavedProperties] = useState([]);
  const [buildingDetails, setBuildingDetails] = useState({});
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const [buildingImages, setBuildingImages] = useState({});
  const navigation = useNavigation();
  const { user } = useAuth(); // Assuming user object contains isAuthenticated property

  useEffect(() => {
    if (user && user.isAuthenticated) {
      // Fetch the logged-in user ID
      axios
        .get('https://estaty.pythonanywhere.com/api/user/')
        .then((response) => {
          const loggedInUserId = response.data.id;
          console.log('user-id: ', loggedInUserId)
          setLoggedInUserId(loggedInUserId);
          // Fetch saved properties only if the user is authenticated
          axios
            .get('https://estaty.pythonanywhere.com/api/saved-properties/')
            .then((response) => {
              // Filter saved properties based on the logged-in user's ID
              console.log(response.data)
              const userSavedProperties = response.data.filter(property => property.user === loggedInUserId);
              console.log("l", userSavedProperties)
              setSavedProperties(userSavedProperties);
              // Extract building IDs to fetch corresponding building details
              const buildingIds = userSavedProperties.map(item => item.building);
              fetchBuildingDetails(buildingIds);
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

  const fetchBuildingDetails = async (buildingIds) => {
    try {
      const details = {};
      for (const buildingId of buildingIds) {
        const response = await axios.get(`https://estaty.pythonanywhere.com/api/buildings/${buildingId}`);
        details[buildingId] = response.data;
      }
      setBuildingDetails(details);
      fetchBuildingImages(buildingIds); // Fetch images after fetching details
    } catch (error) {
      console.error('Error fetching building details:', error);
    }
  };

  const fetchBuildingImages = async (buildingIds) => {
    try {
      const images = {};
      for (const buildingId of buildingIds) {
        const response = await axios.get(`https://estaty.pythonanywhere.com/api/building-images/?building=${buildingId}`);
        const buildingImages = response.data.map(image => image.image);
        images[buildingId] = buildingImages;
      }
      setBuildingImages(images);
    } catch (error) {
      console.error('Error fetching building images:', error);
    }
  };

  const navigateToPropertyDetail = (propertyId) => {
    navigation.navigate('PropertyDetail', { propertyId });
  };

  const renderSavedPropertyItem = ({ item }) => {
    const building = buildingDetails[item.building];
    const images = buildingImages[item.building];
    if (!building || !images) {
      return null; // Render nothing if building details or images are not available yet
    }
    return (
      <TouchableOpacity onPress={() => navigateToPropertyDetail(item.building)}>
        <View style={styles.savedPropertyItem}>
          <Image source={{ uri: images[0] }} style={styles.propertyImage} />
          <Text style={styles.savedPropertyTitle}>{building.name}</Text>
          <Text>Price: {building.price}</Text>
          <Text>Country: {building.country}</Text>
          <Text>Type: {building.building_type}</Text>
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

export default SavedBuildings;
