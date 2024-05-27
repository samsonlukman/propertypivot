// AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if the user is authenticated when the component mounts
    checkAuthentication();
  }, []);

  const checkAuthentication = async () => {
    try {
      // Fetch the user authentication status from AsyncStorage or your server
      const token = await AsyncStorage.getItem('token');
      if (token) {
        // User is authenticated, set the user state
        setUser({ isAuthenticated: true });
      } else {
        // User is not authenticated
        setUser({ isAuthenticated: false });
      }
    } catch (error) {
      console.error('Authentication error:', error);
    }
  };

  const login = async (username, password) => {
    try {
      // Fetch the CSRF token from your server
      const csrfResponse = await axios.get('https://estaty.pythonanywhere.com/api/get-csrf-token/');
      const csrfToken = csrfResponse.data.csrf_token;

      // Include the CSRF token in the headers of the login request
      const response = await axios.post('https://estaty.pythonanywhere.com/api/user/login/', {
        username,
        password,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
      });

      // Store the CSRF token in AsyncStorage
      await AsyncStorage.setItem('token', csrfToken);

      // After successful login, update the user state
      setUser({ isAuthenticated: true });
    } catch (error) {
      console.error('Login error:', error);
      throw error; // Propagate the error to handle it in the component
    }
  };

  const logout = async () => {
    try {
      
      // After successful logout, update the user state
      setUser({ isAuthenticated: false });

      // Clear the token from AsyncStorage
      await AsyncStorage.removeItem('token');
    } catch (error) {
      console.error('Logout error:', error);
      throw error; // Propagate the error to handle it in the component
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
