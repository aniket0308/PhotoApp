import React, { useEffect, useState } from 'react';
import { View, Text, Image, Platform } from 'react-native';
import { Camera, MapView, MarkerView, PointAnnotation, } from '@maplibre/maplibre-react-native';
import { fetchMetadata } from '@utils/Functions/function';
import { Button, ChevronLeftIcon, Icon } from '@gluestack-ui/themed';
import { useNavigation } from '@react-navigation/native';
import styles from './styles';

const MapScreen = () => {

  const [locationPhotos, setLocationPhotos] = useState<Array<{ uri: string; latitude: number; longitude: number }>>([]);
  const navigation = useNavigation();

  const loadPhotos = async () => {
    const photos = await fetchMetadata();
    const mappedPhotos = photos.map((photo: any) => ({
      uri: photo.fileUri,
      latitude: photo.location.latitude,
      longitude: photo.location.longitude,
    }));
    setLocationPhotos(mappedPhotos);
  };

  useEffect(() => {
    loadPhotos();
  }, []);

  const indiaLocations = [
    {
      name: 'Delhi',
      latitude: 28.6139,
      longitude: 77.2090,
      imageUri: 'https://fastly.picsum.photos/id/341/200/300.jpg?hmac=tZpxFpS1LmFfC4e_ChqA5I8JfUfJuwH3oZvmQ58SzHc',
    },
    {
      name: 'Mumbai',
      latitude: 19.0760,
      longitude: 72.8777,
      imageUri: 'https://fastly.picsum.photos/id/626/200/300.jpg?hmac=8P_lvCUkxcubJb1bckQk2YQymRoW6JdkOgtL4ThZMjw',
    },
    {
      name: 'Chennai',
      latitude: 13.0827,
      longitude: 80.2707,
      imageUri: 'https://fastly.picsum.photos/id/866/200/300.jpg?hmac=rcadCENKh4rD6MAp6V_ma-AyWv641M4iiOpe1RyFHeI',
    },
    {
      name: 'Kolkata',
      latitude: 22.5726,
      longitude: 88.3639,
      imageUri: 'https://picsum.photos/seed/kolkata/200/300',
    },
    {
      name: 'Bengaluru',
      latitude: 12.9716,
      longitude: 77.5946,
      imageUri: 'https://picsum.photos/seed/bengaluru/200/300',
    },
    {
      name: 'Hyderabad',
      latitude: 17.3850,
      longitude: 78.4867,
      imageUri: 'https://picsum.photos/seed/hyderabad/200/300',
    },
    {
      name: 'Ahmedabad',
      latitude: 23.0225,
      longitude: 72.5714,
      imageUri: 'https://picsum.photos/seed/ahmedabad/200/300',
    },
    {
      name: 'Pune',
      latitude: 18.5204,
      longitude: 73.8567,
      imageUri: 'https://picsum.photos/seed/pune/200/300',
    },
    {
      name: 'Jaipur',
      latitude: 26.9124,
      longitude: 75.7873,
      imageUri: 'https://picsum.photos/seed/jaipur/200/300',
    },
    {
      name: 'Lucknow',
      latitude: 26.8467,
      longitude: 80.9462,
      imageUri: 'https://picsum.photos/seed/lucknow/200/300',
    },
    {
      name: 'Bhopal',
      latitude: 23.2599,
      longitude: 77.4126,
      imageUri: 'https://picsum.photos/seed/bhopal/200/300',
    },
    {
      name: 'Patna',
      latitude: 25.5941,
      longitude: 85.1376,
      imageUri: 'https://picsum.photos/seed/patna/200/300',
    },
    {
      name: 'Chandigarh',
      latitude: 30.7333,
      longitude: 76.7794,
      imageUri: 'https://picsum.photos/seed/chandigarh/200/300',
    },
    {
      name: 'Goa',
      latitude: 15.2993,
      longitude: 74.1240,
      imageUri: 'https://picsum.photos/seed/goa/200/300',
    },
    {
      name: 'Nagpur',
      latitude: 21.1458,
      longitude: 79.0882,
      imageUri: 'https://picsum.photos/seed/nagpur/200/300',
    },
    {
      name: 'Surat',
      latitude: 21.1702,
      longitude: 72.8311,
      imageUri: 'https://picsum.photos/seed/surat/200/300',
    },
    {
      name: 'Indore',
      latitude: 22.7196,
      longitude: 75.8577,
      imageUri: 'https://picsum.photos/seed/indore/200/300',
    },
    {
      name: 'Kanpur',
      latitude: 26.4499,
      longitude: 80.3319,
      imageUri: 'https://picsum.photos/seed/kanpur/200/300',
    },
    {
      name: 'Guwahati',
      latitude: 26.1445,
      longitude: 91.7362,
      imageUri: 'https://picsum.photos/seed/guwahati/200/300',
    },
    {
      name: 'Srinagar',
      latitude: 34.0837,
      longitude: 74.7973,
      imageUri: 'https://fastly.picsum.photos/id/341/200/300.jpg?hmac=tZpxFpS1LmFfC4e_ChqA5I8JfUfJuwH3oZvmQ58SzHc',
    },
  ];


  return (
    <View style={styles.container}>
      <MapView style={styles.map}>
        {/* Center camera on Surat */}
        <Camera
          zoomLevel={3} // Adjust zoom to show a larger area of India
          centerCoordinate={[78.9629, 22.5937]} // Center of India
        />
        {locationPhotos.map((loc, index) => {
          const MarkerComponent = Platform.OS === 'android' ? MarkerView : PointAnnotation;

          return (
            <MarkerComponent
              key={`marker-${index}`}
              id={`marker-${index}`}
              coordinate={[loc.longitude, loc.latitude]}
            >
              <Image
                source={{ uri: loc.uri }}
                style={styles.markerImage}
                resizeMode="cover"
              />
            </MarkerComponent>
          );
        })}
      </MapView>
      <View style={styles.backButtonContainer}>
        <Button
          variant="link"
          onPress={() => navigation.goBack()}
          action="secondary"
          size="sm"
        >
          <Icon as={ChevronLeftIcon} mr="$1" />
          <Text>Go Back</Text>
        </Button>
      </View>
    </View>
  );
};

export default MapScreen;