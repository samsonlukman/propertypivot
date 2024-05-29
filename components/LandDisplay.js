import React, { useState } from 'react';
import { View, TextInput, FlatList, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import axios from 'axios';

// Placeholder for PropertyDetail screen 
const PropertyDetail = ({ route }) => {
  const { propertyId } = route.params;
  return (
    <View>
      <Text>Property Detail Screen for Property ID: {propertyId}</Text>
    </View>
  );
};

// Placeholder for LandDetail screen 
const LandDetail = ({ route }) => {
  const { propertyId } = route.params;
  return (
    <View>
      <Text>Land Detail Screen for Property ID: {propertyId}</Text>
    </View>
  );
};

// Main SearchScreen component
const SearchScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [country, setCountry] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [buildingResults, setBuildingResults] = useState([]);
  const [landResults, setLandResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);

  const isSearchEnabled = searchQuery.length > 0 || minPrice.length > 0 || maxPrice.length > 0 || country.length > 0;

  const handleSearch = async () => {
    try {
      setLoading(true); // Start loading
      setSearchPerformed(true); // Mark search as performed
      setSearchResults([]); // Clear previous search results

      const buildingResponse = await axios.get(`https://estaty.pythonanywhere.com/api/buildingss/?search=${searchQuery}&min_price=${minPrice}&max_price=${maxPrice}&country=${country}`);
      setBuildingResults(buildingResponse.data);

      const landResponse = await axios.get(`https://estaty.pythonanywhere.com/api/landss/?search=${searchQuery}&min_price=${minPrice}&max_price=${maxPrice}&country=${country}`);
      const landImagesResponse = await axios.get('https://estaty.pythonanywhere.com/api/land-images/');

      const landResultsWithImages = landResponse.data.map((landItem) => {
        const relatedImages = landImagesResponse.data.filter(
          (image) => image.land === landItem.id
        );

        return {
          ...landItem,
          images: relatedImages.map((imageItem) => imageItem.image),
        };
      });

      setLandResults(landResultsWithImages);

      // Merge building and land results
      setSearchResults([...buildingResponse.data, ...landResultsWithImages]);
    } catch (error) {
      console.error('Error fetching search results:', error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const navigateToDetails = (item) => {
    const detailScreen = item.category === 'building' ? 'PropertyDetail' : 'LandDetail';
    navigation.navigate(detailScreen, { propertyId: item.id });
  };

  const renderResultItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigateToDetails(item)}>
      <View style={styles.resultItem}>
        {item.images && item.images.length > 0 && (
          <Image source={{ uri: item.images[0] }} style={styles.resultImage} />
        )}
        <Text style={styles.resultName}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchRow}>
        <TextInput
          style={styles.nameSearch}
          placeholder="Search by name..."
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
        />
        <View style={styles.filterContainer}>
          <TextInput
            style={styles.filterInput}
            placeholder="Min Price"
            value={minPrice}
            onChangeText={(text) => setMinPrice(text)}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.filterInput}
            placeholder="Max Price"
            value={maxPrice}
            onChangeText={(text) => setMaxPrice(text)}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.filterInput}
            placeholder="Country"
            value={country}
            onChangeText={(text) => setCountry(text)}
          />
        </View>
        <TouchableOpacity
          style={[styles.searchButton, !isSearchEnabled && styles.disabledButton]}
          onPress={isSearchEnabled ? handleSearch : null}
          disabled={!isSearchEnabled}
        >
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}> 
        {buildingResults.length > 0 && (
          <TouchableOpacity style={styles.resultButton} onPress={() => setSearchResults(buildingResults)}>
            <Text style={styles.resultButtonText}>Show Buildings</Text>
          </TouchableOpacity>
        )}
        {landResults.length > 0 && (
          <TouchableOpacity style={styles.resultButton} onPress={() => setSearchResults(landResults)}>
            <Text style={styles.resultButtonText}>Show Lands</Text>
          </TouchableOpacity>
        )} 
      </View>

      {loading ? (
        <Text style={styles.loadingText}>Fetching matching results...</Text>
      ) : (
        <FlatList
          data={searchResults}
          renderItem={renderResultItem}
          keyExtractor={(item) => item.id.toString()}
          ListEmptyComponent={() => (
            searchPerformed && (
              <View style={styles.noResultContainer}>
                <Text style={styles.noResultText}>No result found</Text>
              </View>
            )
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  searchRow: {
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  filterInput: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    marginRight: 10,
  },
  nameSearch: {
    borderColor: 'gray',
    borderWidth: 2,
    paddingLeft: 10,
    marginBottom: 10
  },
  searchButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
  },
  disabledButton: {
    backgroundColor: 'lightgray',
  },
  searchButtonText: {
    color: 'white',
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  resultImage: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  resultName: {
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row', 
    marginBottom: 10, 
  },
  resultButton: {
    backgroundColor: '#007bff', 
    padding: 10,
    borderRadius: 5,
    marginRight: 10, 
  },
  resultButtonText: {
    color: 'white',
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 18,
    marginTop: 20,
  },
  noResultContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noResultText: {
    fontSize: 18,
    color: 'gray',
  },
});

export default SearchScreen;
