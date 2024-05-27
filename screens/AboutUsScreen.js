import React from 'react';
import { ScrollView, View, Text, StyleSheet, Image } from 'react-native';

const AboutUsScreen = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={{ uri: 'https://www.propertyadvisorynetwork.com/wp-content/uploads/2018/08/Estate-Management.jpg' }}
        style={styles.logo}
      />
      <Text style={styles.title}>International Estate Management</Text>
      <Text style={styles.description}>
        Welcome to our app! We specialize in providing a comprehensive estate
        management solution on an international scale. Whether you're buying,
        selling, or renting properties, we've got you covered.
      </Text>
      <Text style={styles.featuresTitle}>Key Features:</Text>
      <Text style={styles.feature}>
        🌐 Global Property Listings - Explore properties from around the world.
      </Text>
      <Text style={styles.feature}>
        🏠 Property Management - Easily manage your real estate portfolio.
      </Text>
      <Text style={styles.feature}>
        🤝 Secure Transactions - Ensure safe and secure property transactions.
      </Text>
      <Text style={styles.feature}>
        💼 Professional Services - Access expert advice and services.
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    textAlign: 'center',
    marginBottom: 20,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 20,
  },
  feature: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default AboutUsScreen;
