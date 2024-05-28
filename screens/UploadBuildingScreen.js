import React, { useState, useEffect } from 'react';
import { ScrollView, Text, Switch, View, StyleSheet, Button, Alert, TextInput, Image } from 'react-native';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import countriesList from '../components/Countries';

const propertyTypes = [
  { label: 'Sale', value: 'sale' },
  { label: 'Rent', value: 'rent' },
  { label: 'Lease', value: 'lease' },
];

const buildingTypes = [
  { label: 'Apartment', value: 'apartment' },
  { label: 'Flats', value: 'flats' },
  { label: 'Villa', value: 'villa' },
  { label: 'Bungalow', value: 'bungalow' },
  { label: 'Penthouse', value: 'penthouse' },
  { label: 'Room and Parlour', value: 'room_and_parlour' },
  { label: 'Duplex', value: 'duplex' },
  { label: 'Townhouse/Terrace', value: 'townhouse_terrace' },
  { label: 'Shared Apartments', value: 'shared_apartments' },
];

const conditions = [
  { label: 'Old', value: 'old' },
  { label: 'Newly Built', value: 'newly_built' },
  { label: 'Renovated', value: 'renovated' },
];

const furnishings = [
  { label: 'Fully Furnished', value: 'fully_furnished' },
  { label: 'Unfurnished', value: 'unfurnished' },
  { label: 'Semi-Furnished', value: 'semi_furnished' },
];

const UploadBuildingScreen = ({ navigation }) => {
  const [propertyType, setPropertyType] = useState(propertyTypes[0].value);
  const [buildingType, setBuildingType] = useState(buildingTypes[0].value);
  const [condition, setCondition] = useState(conditions[0].value);
  const [furnishing, setFurnishing] = useState(furnishings[0].value);
  const [bedrooms, setBedrooms] = useState('0');
  const [bathrooms, setBathrooms] = useState('0');
  const [toilets, setToilets] = useState('0');
  const [swimmingPool, setSwimmingPool] = useState(false);
  const [highSpeedInternet, setHighSpeedInternet] = useState(false);
  const [gym, setGym] = useState(false);
  const [dishwasher, setDishwasher] = useState(false);
  const [wifi, setWifi] = useState(false);
  const [garage, setGarage] = useState(false);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');

  const [ownerId, setOwnerId] = useState(null);
  const [BuildingImages, setBuildingImages] = useState([]);
  const [country, setCountry] = useState(countriesList[0]);

  const referer = 'https://estaty.pythonanywhere.com'

  const booleanFields = [
    { label: 'Swimming Pool', value: swimmingPool, setter: setSwimmingPool },
    { label: 'High-Speed Internet', value: highSpeedInternet, setter: setHighSpeedInternet },
    { label: 'Gym', value: gym, setter: setGym },
    { label: 'Dishwasher', value: dishwasher, setter: setDishwasher },
    { label: 'WiFi', value: wifi, setter: setWifi },
    { label: 'Garage', value: garage, setter: setGarage },
  ];

  const countriesPickerItems = countriesList.map((country) => (
    <Picker.Item key={country} label={country} value={country} />
  ));

  const handleImagePicker = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [4, 3],
      quality: 1,
      allowsMultipleSelection: true
    });

    if (!result.cancelled) {
      const selectedImages = result.assets.map((asset) => {
        const fileName = asset.uri.split('/').pop();
        return {
          uri: asset.uri,
          type: 'image/jpeg', 
          name: fileName,
        };
      });

      setBuildingImages([...BuildingImages, ...selectedImages]);
    }
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userInfoResponse = await axios.get('https://estaty.pythonanywhere.com/api/user/');
        setOwnerId(userInfoResponse.data.id);
      } catch (error) {
        console.error('Error fetching user information:', error.message);
      }
    };

    fetchUserInfo();
  }, []);

  const handleUpload = async () => {
    try {
      const csrfResponse = await axios.get('https://estaty.pythonanywhere.com/api/get-csrf-token/');
      const csrfToken = csrfResponse.data.csrf_token;

      const formData = new FormData();

      formData.append('property_owner', ownerId);
      formData.append('name', name);
      formData.append('price', price);
      formData.append('property_type', propertyType);
      formData.append('building_type', buildingType);
      formData.append('condition', condition);
      formData.append('furnishing', furnishing);
      formData.append('bedrooms', parseInt(bedrooms, 10));
      formData.append('bathrooms', parseInt(bathrooms, 10));
      formData.append('toilets', parseInt(toilets, 10));
      formData.append('swimming_pool', swimmingPool);
      formData.append('highspeed_internet', highSpeedInternet);
      formData.append('gym', gym);
      formData.append('dishwasher', dishwasher);
      formData.append('wifi', wifi);
      formData.append('garage', garage);
      formData.append('country', country);

      BuildingImages.forEach((image, index) => {
        formData.append(`image${index}`, {
          uri: image.uri,
          type: 'image/jpeg',
          name: image.uri.split('/').pop(),
        });
      });

      const response = await axios.post('https://estaty.pythonanywhere.com/api/upload/building/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-CSRFToken': csrfToken,
          'referer': referer
        },
      });

      console.log('Building uploaded successfully:', response.data);
      Alert.alert('Property Added Successfully');
      navigation.navigate('Home');
    } catch (error) {
      console.error('Error uploading building:', error.message, error.response?.data);

      if (error.response?.data && error.response.data.details) {
        Alert.alert('Error', JSON.stringify(error.response.data.details, null, 2));
      } else {
        Alert.alert('Error', 'An unexpected error occurred. Please try again. Did you fill all the fields?');
      }
    }
  };

  const renderBooleanField = (item) => (
    <View style={styles.booleanFieldContainer} key={item.label}>
      <Text style={styles.label}>{item.label}</Text>
      <Switch
        value={item.value}
        onValueChange={(newValue) => item.setter(newValue)}
      />
    </View>
  );

  const renderPickerField = (label, value, setter, choices) => (
    <View style={styles.pickerFieldContainer} key={label}>
      <Text style={styles.label}>{label}</Text>
      <Picker
        selectedValue={value}
        onValueChange={(value) => setter(value)}
        style={styles.picker}
      >
        {choices.map((choice) => (
          <Picker.Item key={choice.value} label={choice.label} value={choice.value} />
        ))}
      </Picker>
    </View>
  );

  const renderTextField = (label, value, setter) => (
    <View style={styles.textFieldContainer} key={label}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.textInput}
        value={value}
        onChangeText={(text) => setter(text)}
        placeholder={`Enter ${label}`}
      />
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {renderTextField('Name', name, setName)}
      {renderTextField('Price', price, setPrice)}
      {renderTextField('Bedrooms', bedrooms, setBedrooms)}
      {renderTextField('Bathrooms', bathrooms, setBathrooms)}
      {renderTextField('Toilets', toilets, setToilets)}

      {booleanFields.map(renderBooleanField)}

      {renderPickerField('Property Type', propertyType, setPropertyType, propertyTypes)}
      {renderPickerField('Building Type', buildingType, setBuildingType, buildingTypes)}
      {renderPickerField('Condition', condition, setCondition, conditions)}
      {renderPickerField('Furnishing', furnishing, setFurnishing, furnishings)}

      <View style={styles.pickerFieldContainer}>
        <Text style={styles.label}>Country</Text>
        <Picker
          selectedValue={country}
          onValueChange={(value) => setCountry(value)}
          style={styles.picker}
        >
          {countriesPickerItems}
        </Picker>
      </View>

      <View style={styles.imageContainer}>
        <Button title="Choose Building Image(s)" onPress={handleImagePicker} />
        {BuildingImages.map((image, index) => (
          <View key={index} style={styles.previewContainer}>
            <Text>Selected Building Image {index + 1}:</Text>
            <Image source={{ uri: image.uri }} style={styles.previewImage} />
          </View>
        ))}
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Upload Property" onPress={handleUpload} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5
  },
  imageContainer: {
    marginBottom: 20,
    overflow: 'hidden', 
  },
  previewContainer: {
    marginTop: 10,
  },
  previewImage: {
    width: '100%',
    height: 100,
    marginTop: 5,
    resizeMode: 'contain', 
  },
  booleanFieldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
    borderColor: 'gray',
    borderWidth: 1,
  },
  pickerFieldContainer: {
    marginBottom: 15,
    borderColor: 'gray',
    borderWidth: 1,
  },
  textFieldContainer: {
    marginBottom: 15,
  },
  picker: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
  },
  textInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
  },
  label: {
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 20,
  },
});

export default UploadBuildingScreen;
