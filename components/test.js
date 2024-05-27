import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import PropertyDisplayScreen from './screens/PropertyDisplayScreen';
import PropertySearch from './screens/SearchScreen';
import PropertyDetailScreen from './screens/PropertyDetailScreen';
import LoginScreen from './screens/LoginScreen';
import SearchScreen from './screens/SearchScreen';
import SavedBuildings from './screens/SavedBuildings';
import SavedLands from './screens/SavedLands';
import AccountScreen from './screens/AccountScreen';
import UserRegistrationForm from './screens/UserRegistrationForm';
import UploadPropertyScreen from './screens/UploadPropertyScreen';
import UploadBuildingScreen from './screens/UploadBuildingScreen';
import UploadLandScreen from './screens/UploadLandScreen';
import { AuthProvider } from './contexts/AuthContext';
import PropertyDisplay from './components/PropertyDisplay';
import LandDisplay from './components/LandDisplay';
import LandDetail from './components/LandDetail';
import Account from './components/Account';
import AboutUs from './screens/AboutUsScreen';
import Settings from './screens/SettingsScreen';

const Stack = createNativeStackNavigator();
const Tab = createMaterialTopTabNavigator();

const PropertiesStack = () => {
  return (
    <Stack.Navigator initialRouteName="PropertyDisplayScreen">
      <Stack.Screen name="PropertyDisplayScreen" component={PropertyDisplayScreen} options={{ headerShown: true }} />
      <Stack.Screen name="PropertyDetail" component={PropertyDetailScreen} options={{ headerShown: true }} />
    </Stack.Navigator>
  );
};

const LandsStack = () => {
  return (
    <Stack.Navigator initialRouteName="Lands">
      <Stack.Screen name="Lands" component={LandDisplay} options={{ headerShown: true }} />
      <Stack.Screen name="Land Detail" component={LandDetail} options={{ headerShown: true }} />
      
    </Stack.Navigator>
  );
};

const AccountStack = () => {
  return (
    <Stack.Navigator initialRouteName="Account">
      <Stack.Screen name="Account" component={Account} options={{ headerShown: false }} />
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: true }} />
    <Stack.Screen name="UserRegistrationForm" component={UserRegistrationForm} options={{ headerShown: true }} />
    <Stack.Screen name="UploadProperty" component={UploadPropertyScreen} options={{ headerShown: true }} />
    <Stack.Screen name="UploadBuilding" component={UploadBuildingScreen} options={{ headerShown: true }} />
    <Stack.Screen name="UploadLand" component={UploadLandScreen} options={{ headerShown: true }} />
    <Stack.Screen name="About Us" component={AboutUs} options={{ headerShown: true }} />
    <Stack.Screen name="Settings" component={Settings} options={{ headerShown: true }} />
    <Stack.Screen name="SavedBuildings" component={SavedBuildings} options={{ headerShown: false}} />
    <Stack.Screen name="SavedLands" component={SavedLands} options={{ headerShown: false}} />
    </Stack.Navigator>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <AuthProvider>
        <Tab.Navigator
          screenOptions={{
            tabBarLabelStyle: { 
              fontSize: 8,
              textTransform: 'capitalize' 
            },
            tabBarItemStyle: { height: 60 },
            tabBarStyle: { marginTop: 30 },
          }}
        >
          <Tab.Screen name="Properties" component={PropertiesStack} />
          <Tab.Screen name="Lands" component={LandsStack} options={{ headerShown: true }} />
          <Tab.Screen name="Search" component={SearchScreen} options={{ headerShown: true }} />
          <Tab.Screen name="Account" component={AccountStack} options={{ headerShown: false }} />
        </Tab.Navigator>
      </AuthProvider>
    </NavigationContainer>
  );
};

export default App;
