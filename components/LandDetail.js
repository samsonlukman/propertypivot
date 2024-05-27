import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, Modal } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import Swiper from 'react-native-swiper';

const PropertyDetail = ({ route }) => {
  const [property, setProperty] = useState(null);
  const { user } = useAuth();
  const propertyId = route.params.propertyId;
  const navigation = useNavigation();
  const [contactModalVisible, setContactModalVisible] = useState(false);
  const [images, setImages] = useState([]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    const fetchPropertyDetail = async () => {
      try {
        const response = await axios.get(
          `https://estaty.pythonanywhere.com/api/land/${propertyId}`
        );
        setProperty(response.data);
      } catch (error) {
        console.error('Error fetching property detail:', error);
      }
    };

    const fetchLandImages = async () => {
      try {
        const imagesResponse = await axios.get(`https://estaty.pythonanywhere.com/api/land-images/?land=${propertyId}`);
        const filteredImages = imagesResponse.data
          .filter(image => image.land === propertyId)
          .map(image => image.image);
        setImages(filteredImages);
      } catch (error) {
        console.error('Error fetching land images:', error);
      }
    };

    fetchPropertyDetail();
    fetchLandImages();
  }, [propertyId]);

  const handleContactUser = () => {
    setContactModalVisible(!contactModalVisible);
  };

  const propertyInfoData = [
    { key: 'owner', label: 'Owner:', value: property?.owner.username },
    { key: 'country', label: 'Country:', value: property?.country },
    { key: 'phoneNumber', label: 'Phone Number:', value: property?.owner.phone_number },
    { key: 'datePosted', label: 'Date Posted:', value: property?.date_posted?.substring(0, 10) },
    { key: 'price', label: 'Price', value: property?.price },
    { key: 'description', label: 'Description:', value: property?.description },
  ];

  const renderPropertyInfoItem = ({ item }) => {
    if (item.key === 'phoneNumber' && (!user || !user.isAuthenticated)) {
      return (
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginButton}>Login to see owner's phone number</Text>
        </TouchableOpacity>
      );
    } else if (item.key === 'phoneNumber' && user && user.isAuthenticated) {
      return (
        <View style={styles.detailRow}>
          <Icon name="phone" size={16} style={styles.detailIcon} />
          <TouchableOpacity onPress={handleContactUser}>
            <Text style={[styles.detailText, styles.contactButton]}>Contact User</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.detailRow}>
        <Icon name={item.key === 'description' ? 'align-left' : 'user'} size={16} style={styles.detailIcon} />
        <Text style={styles.detailText}>
          {item.label} {item.value}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.mainContainer}>
      <Swiper
        style={styles.carouselContainer}
        showsButtons={false}
        loop={false}
        activeDotStyle={styles.activePaginationDot}
        dotStyle={styles.paginationDot}
        onIndexChanged={(index) => setActiveImageIndex(index)}
      >
        {images.map((image, index) => (
          <View key={index} style={styles.slide}>
            <Image source={{ uri: image }} style={styles.propertyImage} />
          </View>
        ))}
      </Swiper>
      <Text style={styles.propertyTitle}>{property?.name}</Text>
      <FlatList
        data={propertyInfoData}
        renderItem={renderPropertyInfoItem}
        keyExtractor={(item) => item.key}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={contactModalVisible}
        onRequestClose={() => setContactModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Contact Information</Text>
            <Text style={styles.modalText}>Username: {property?.owner.username}</Text>
            <Text style={styles.modalText}>Phone Number: {property?.owner.phone_number}</Text>
            <Text style={styles.modalText}>Email: {property?.owner.email}</Text>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setContactModalVisible(false)}
            >
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    
    backgroundColor: 'white',
  },
  carouselContainer: {
    height: 200,
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    marginTop: 10,
    paddingLeft: 10,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    paddingLeft: 10,
  },
  detailIcon: {
    marginRight: 5,
  },
  detailText: {
    flex: 1,
  },
  loginButton: {
    color: 'blue',
    textDecorationLine: 'underline',
    marginBottom: 10,
  },
  contactButton: {
    color: 'green',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    marginBottom: 10,
  },
  modalCloseButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  modalCloseText: {
    color: 'white',
    fontWeight: 'bold',
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
