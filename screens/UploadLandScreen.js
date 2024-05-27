import React, { useState, useEffect } from 'react';
import { ScrollView, Text, Button, Alert, TextInput, View, StyleSheet, Image } from 'react-native';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import countriesList from '../components/Countries';
import { Picker } from '@react-native-picker/picker';
import { useForm, Controller } from 'react-hook-form';

const UploadLandScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [ownerId, setOwnerId] = useState(null);
  const [landImages, setLandImages] = useState([]);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm(); 

  // Fetch the logged-in user's information when the component mounts
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

  const handleImagePicker = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      allowsMultipleSelection: true, // Allow multiple image selection
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

      setLandImages([...landImages, ...selectedImages]);
    }
  };

  const handleUpload = handleSubmit(async (formData) => {
    try {
      const csrfResponse = await axios.get('https://estaty.pythonanywhere.com/api/get-csrf-token/');
      const csrfToken = csrfResponse.data.csrf_token;

      // Create a FormData object
      const uploadFormData = new FormData();

      uploadFormData.append('name', name);
      uploadFormData.append('price', price);
      uploadFormData.append('description', description);
      uploadFormData.append('owner', ownerId);
      uploadFormData.append('country', formData.country);

      landImages.forEach((image, index) => {
        uploadFormData.append(`image${index}`, {
          uri: image.uri,
          type: 'image/jpeg',
          name: image.uri.split('/').pop(),
        });
      });

      const response = await axios.post('https://estaty.pythonanywhere.com/api/upload/land/', uploadFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-CSRFToken': csrfToken,
        },
      });

      console.log('Land uploaded successfully:', response.data);
      Alert.alert('Land Uploaded Successfully');
      navigation.goBack();
    } catch (error) {
      console.error('Error uploading land:', error.message, error.response?.data);

      if (error.response?.data && error.response.data.details) {
        Alert.alert('Error', JSON.stringify(error.response.data.details, null, 2));
      } else {
        Alert.alert('Error', 'An unexpected error occurred. Please try again.');
      }
    }
  });

  return (
    <ScrollView style={styles.container}>
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.textInput}
          value={name}
          onChangeText={(text) => setName(text)}
          placeholder="Enter Name"
        />
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Price</Text>
        <TextInput
          style={styles.textInput}
          value={price}
          onChangeText={(text) => setPrice(text)}
          placeholder="Enter Price"
        />
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={styles.textInput}
          value={description}
          onChangeText={(text) => setDescription(text)}
          placeholder="Enter Description"
        />
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Country</Text> 
        <Controller
          control={control}
          render={({ field }) => (
            <Picker
              selectedValue={field.value}
              onValueChange={(itemValue) => field.onChange(itemValue)}
              style={{ 
                height: 40, 
                flex: 1, 
                marginLeft: 10, 
                backgroundColor: '#fafafa' }}
            >
              {countriesList.map((country) => (
                <Picker.Item key={country} label={country} value={country} />
              ))}
            </Picker>
          )}
          name="country"
        />
      </View>

      <View style={styles.imageContainer}>
        <Button title="Choose Land Image" onPress={handleImagePicker} />
        {landImages.map((image, index) => (
          <View key={index} style={styles.previewContainer}>
            <Text>Selected Land Image {index + 1}:</Text>
            <Image source={{ uri: image.uri }} style={styles.previewImage} />
          </View>
        ))}
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Upload Land" onPress={handleUpload} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10, 
  },
  fieldContainer: {
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center', 
  },
  label: {
    fontSize: 16,
    flexShrink: 1, 
    maxWidth: '40%', 
  },
  textInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    flex: 1,
    marginLeft: 10, 
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
  buttonContainer: {
    marginTop: 20,
  },
});

export default UploadLandScreen;