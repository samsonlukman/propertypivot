import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const EditProfile = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get('https://estaty.pythonanywhere.com/api/user/');
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    fetchUserInfo();
  }, []);

  const [updatedInfo, setUpdatedInfo] = useState({
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    about: '',
    password: '',
    profile_pics: '',
    country: '',
  });

  useEffect(() => {
    if (user) {
      setUpdatedInfo({
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone_number: user.phone_number,
        about: user.about,
        password: '',
        profile_pics: user.profile_pics,
        country: user.country,
      });
    }
  }, [user]);

  const handleChange = (key, value) => {
    setUpdatedInfo((prevInfo) => ({ ...prevInfo, [key]: value }));
  };

  const handleUpdate = async () => {
    try {
      if (!user || !user.id) {
        throw new Error('User information is not available.');
      }

      const csrfResponse = await axios.get('https://estaty.pythonanywhere.com/api/get-csrf-token/');
      const csrfToken = csrfResponse.data.csrf_token;

      const response = await fetch(`https://estaty.pythonanywhere.com/api/edit-profile/${user.id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
        body: JSON.stringify(updatedInfo),
      });

      if (!response.ok) {
        throw new Error(`Update failed with status: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.indexOf('application/json') !== -1) {
        const data = await response.json();
        console.log('Update successful:', data);
      } else {
        const text = await response.text();
        console.log('Update response (non-JSON):', text);
      }

      navigation.navigate('Account');
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert(`Error, ${error.message}. Check Username`);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Update Profile</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        value={updatedInfo.username}
        onChangeText={(text) => handleChange('username', text)}
      />

      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={updatedInfo.first_name}
        onChangeText={(text) => handleChange('first_name', text)}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={updatedInfo.last_name}
        onChangeText={(text) => handleChange('last_name', text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={updatedInfo.phone_number}
        onChangeText={(text) => handleChange('phone_number', text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={updatedInfo.email}
        onChangeText={(text) => handleChange('email', text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Country"
        value={updatedInfo.country}
        onChangeText={(text) => handleChange('country', text)}
      />

      <TextInput
        style={styles.input}
        placeholder="About"
        value={updatedInfo.about}
        onChangeText={(text) => handleChange('about', text)}
      />

      <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
        <Text style={styles.buttonText}>Update Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFC46C',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    padding: 10,
    borderRadius: 5,
    backgroundColor: 'white',
  },
  updateButton: {
    backgroundColor: '#80A878',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default EditProfile;
