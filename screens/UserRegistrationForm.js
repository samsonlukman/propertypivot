import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  Button, 
  StyleSheet, 
  Alert, 
  Image, 
  ScrollView 
} from 'react-native';
import axios from 'axios';
import { useForm, Controller } from 'react-hook-form';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import countriesList from '../components/Countries';

const UserRegistrationForm = ({ navigation }) => {
  const {
    control, 
    handleSubmit, 
    formState: { errors }, 
  } = useForm();
  const [profileImage, setProfileImage] = useState(null);

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
    });

    if (!result.cancelled) {
      const fileName = result.assets[0].uri.split('/').pop();

      setProfileImage({
        uri: result.assets[0].uri,
        type: 'image/jpeg',
        name: fileName,
      });
    }
  };

  const onSubmit = async (data) => {
    try {
      const csrfResponse = await axios.get('https://estaty.pythonanywhere.com/api/get-csrf-token/');
      const csrfToken = csrfResponse.data.csrf_token;

      const formData = new FormData();
      formData.append('username', data.username);
      formData.append('first_name', data.first_name);
      formData.append('last_name', data.last_name);
      formData.append('about', data.about);
      formData.append('email', data.email);
      formData.append('phone_number', data.phone_number);
      formData.append('password', data.password);

      if (profileImage) {
        formData.append('profile_pics', profileImage);
      }

      formData.append('country', data.country);

      const response = await axios.post('https://estaty.pythonanywhere.com/api/register/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-CSRFToken': csrfToken,
        },
      });

      Alert.alert('Registration Successful', 'User registered successfully');
      navigation.navigate('Login');
    } catch (error) {
      if (error.response && error.response.data) {
        Alert.alert('Error', 'Check password (Min: 8 characters) and other fields.');
      } else {
        console.error('Registration error:', error.message);
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
   

      <View style={styles.inputContainer}>
        <Controller
          control={control}
          render={({ field }) => (
            <TextInput 
              style={styles.inputField} 
              placeholder="Username" 
              onChangeText={field.onChange} 
            />
          )}
          name="username"
          rules={{ required: 'Username is required' }}
        />
        {errors.username && <Text style={styles.errorText}>{errors.username.message}</Text>}
      </View>

      <View style={styles.inputContainer}>
        <Controller
          control={control}
          render={({ field }) => (
            <TextInput
              style={styles.inputField}
              placeholder="Password"
              secureTextEntry
              onChangeText={field.onChange}
            />
          )}
          name="password"
          rules={{ required: 'Password is required' }}
        />
        {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}
      </View>

      <View style={styles.inputContainer}>
        <Controller
          control={control}
          render={({ field }) => (
            <TextInput
              style={styles.inputField}
              placeholder="First Name"
              onChangeText={field.onChange}
            />
          )}
          name="first_name"
          rules={{ required: 'First Name is required' }}
        />
        {errors.first_name && <Text style={styles.errorText}>{errors.first_name.message}</Text>}
      </View>

      <View style={styles.inputContainer}>
        <Controller
          control={control}
          render={({ field }) => (
            <TextInput
              style={styles.inputField}
              placeholder="Last Name"
              onChangeText={field.onChange}
            />
          )}
          name="last_name"
          rules={{ required: 'Last Name is required' }}
        />
        {errors.last_name && <Text style={styles.errorText}>{errors.last_name.message}</Text>}
      </View>

      <View style={styles.inputContainer}>
        <Controller
          control={control}
          render={({ field }) => (
            <TextInput
              style={styles.inputField}
              placeholder="Email"
              onChangeText={field.onChange}
              keyboardType="email-address"
            />
          )}
          name="email"
          rules={{ required: 'Email is required' }}
        />
        {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}
      </View>

      <View style={styles.inputContainer}>
        <Controller
          control={control}
          render={({ field }) => (
            <TextInput
              style={styles.inputField}
              placeholder="Phone Number"
              onChangeText={field.onChange}
              keyboardType="numeric"
            />
          )}
          name="phone_number"
          rules={{ required: 'Phone Number is required' }}
        />
        {errors.phone_number && <Text style={styles.errorText}>{errors.phone_number.message}</Text>}
      </View>

      <View style={styles.inputContainer}>
        <Controller
          control={control}
          render={({ field }) => (
            <TextInput
              style={styles.inputField}
              placeholder="About"
              onChangeText={field.onChange}
            />
          )}
          name="about"
          rules={{ required: 'About is required' }}
        />
        {errors.about && <Text style={styles.errorText}>{errors.about.message}</Text>}
      </View>

      <Button title="Choose Profile Picture" onPress={handleImagePicker} />
      {profileImage && (
        <View style={styles.previewContainer}>
          <Text>Selected Profile Picture:</Text>
          <Image source={{ uri: profileImage.uri }} style={styles.previewImage} />
        </View>
      )}

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Country</Text>
        <Controller
          control={control}
          render={({ field }) => (
            <Picker
              selectedValue={field.value}
              onValueChange={field.onChange}
              style={styles.picker}
            >
              {countriesList.map((country) => (
                <Picker.Item key={country} label={country} value={country} />
              ))}
            </Picker>
          )}
          name="country"
          rules={{ required: 'Country is required' }}
        />
        {errors.country && <Text style={styles.errorText}>{errors.country.message}</Text>}
      </View>

      <Button title="Register" onPress={handleSubmit(onSubmit)} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f7f7f7',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputField: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    backgroundColor: '#fff',
  },
  errorText: {
    color: 'red',
    marginTop: 5,
  },
  previewContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },
  previewImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  picker: {
    height: 50,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
});

export default UserRegistrationForm;
