// src/screens/CameraScreen.tsx

import React, { useRef, useState } from 'react';
import { View } from 'react-native';
import { launchCamera, launchImageLibrary, Asset, CameraOptions } from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native';
import { Box, Button, Spinner, Text, VStack } from '@gluestack-ui/themed';
import ConfirmDialog from '@components/ConfirmationRemoveModal';
import ImagePreview from '@components/ImagePreview';
import { getCurrentLocation, handleUpload, requestCameraAndLocation, requestGalleryAndLocation } from '@utils/Functions/function';
import { strings } from '@utils/Strings/strings';
import styles from './styles';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';


type CameraNavProp = NativeStackNavigationProp<
  // Reuse the same type inline
  { Camera: undefined; Map: undefined, Gallery: undefined },
  'Camera'
>;
const CameraScreen = () => {
  const [image, setImage] = useState<Asset | null>(null);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [isLaunchingCamera, setIsLaunchingCamera] = useState<boolean>(false);
  const [isLaunchingGallery, setIsLaunchingGallery] = useState<boolean>(false);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [imageSource, setImageSource] = useState<'camera' | 'gallery' | null>(null);
  const cancelRef = useRef(null);
  const navigation = useNavigation<CameraNavProp>();

  const handleTakePhoto = async () => {
    const hasPermission = await requestCameraAndLocation();
    if (!hasPermission) {
      console.warn('Camera permission denied');
      return;
    }

    setIsLaunchingCamera(true);

    const loc = await getCurrentLocation();
    setLocation(loc);

    const options: CameraOptions = {
      mediaType: 'photo',
      quality: 1,
      saveToPhotos: true,
    };

    try {
      const result = await launchCamera(options);
      if (result.didCancel) {
        console.log('User cancelled camera');
      } else if (result.errorCode) {
        console.error('Camera error:', result.errorMessage);
      } else if (result.assets && result.assets.length > 0) {
        setImage(result.assets[0]);
        setImageSource('camera');
      }
    } catch (err) {
      console.error('launchCamera error:', err);
    } finally {
      setIsLaunchingCamera(false);
    }
  };

  const handleChooseFromGallery = async () => {
    const hasPermission = await requestGalleryAndLocation();

    if (!hasPermission) {
      console.warn('Gallery permission denied');
      return;
    }

    setIsLaunchingGallery(true);

    const loc = await getCurrentLocation();
    setLocation(loc);

    try {
      launchImageLibrary({ mediaType: 'photo', quality: 1 }, response => {
        if (!response.didCancel && !response.errorCode && response.assets) {
          setImage(response.assets[0]);
          setImageSource('gallery');
        }
      });
    } catch (err) {
      console.error('launchImageLibrary error:', err);
    }
    finally {
      setIsLaunchingGallery(false);
    }
  };

  const onUploadPress = async () => {
    if (!image?.uri) {
      alert('No image to upload');
      return;
    }

    const fileName = `${imageSource}_${Date.now()}.jpg`;
    if (!location) {
      alert('Location not available');
      return;
    }
    const success = await handleUpload(image.uri, fileName, location);
    if (success) {
      alert('Upload successful!');
      setImage(null);
      setImageSource(null);
      setLocation(null);
    } else {
      alert('Upload failed!');
    }
  };


  return (
    <View style={styles.container}>
      <VStack space="md" alignItems="center" mt="$4" px="$4">
        <Text size="2xl" bold color="$textDark900">
          {strings.cameraScreen.geoTaggedPhoto}
        </Text>
        <Text size="md" color="$textDark600" textAlign="center">
          {strings.cameraScreen.capturePhotosAutomatically}
          {strings.cameraScreen.selectImagesFromCamera}
        </Text>
        {
          image?.uri ?
            <>
              <ImagePreview
                image={image}
                onRemove={() => setShowAlert(true)}
                latitude={location?.latitude}
                longitude={location?.longitude}
                width={300}
              />
              {/* Upload / Remove Buttons */}
              <Button
                onPress={onUploadPress}
                width="100%"
                bg="$black"
                borderRadius="$md"
              >
                <Text
                  size="md"
                  color="$white"
                  fontWeight="bold"
                  textAlign="center"
                  width="100%"
                >
                  {strings.cameraScreen.uploadImage}
                </Text>
              </Button>
              <Button
                onPress={() => setShowAlert(true)}
                width="100%"
                bg="$white"
                borderRadius="$md"
                borderColor='$black'
                borderWidth={1}
              >
                <Text
                  size="md"
                  color="$black"
                  fontWeight="bold"
                  textAlign="center"
                  width="100%"
                >
                  {strings.cameraScreen.removeImage}
                </Text>
              </Button>
            </> :
            <>
              <Text size="md" color="$textDark600" textAlign="center">
                {strings.cameraScreen.captureImage}
              </Text>

              <Button
                onPress={handleTakePhoto}
                width="100%"
                bg="$black"
                borderRadius="$md"
              >
                <Text
                  size="md"
                  color="$white"
                  fontWeight="bold"
                  textAlign="center"
                  width="100%"
                >
                  {strings.cameraScreen.takePhoto}
                </Text>
              </Button>

              <Button
                onPress={handleChooseFromGallery}
                width="100%"
                bg="$black"
                borderRadius="$md"
              >
                <Text
                  size="md"
                  color="$white"
                  fontWeight="bold"
                  textAlign="center"
                  width="100%"
                >
                  {strings.cameraScreen.chooseFromGallery}
                </Text>
              </Button>
              <Button
                onPress={() => navigation.navigate('Map')}
                width="100%"
                bg="$black"
                borderRadius="$md"
              >
                <Text
                  size="md"
                  color="$white"
                  fontWeight="bold"
                  textAlign="center"
                  width="100%"
                >
                  {strings.cameraScreen.ViewCapturedImagesLocation}
                </Text>
              </Button>
              <Button
                onPress={() => navigation.navigate('Gallery')}
                width="100%"
                bg="$black"
                borderRadius="$md"
              >
                <Text
                  size="md"
                  color="$white"
                  fontWeight="bold"
                  textAlign="center"
                  width="100%"
                >
                  {strings.cameraScreen.AllUploadedImages}
                </Text>
              </Button>
            </>
        }
      </VStack>

      {isLaunchingCamera || isLaunchingGallery && (
        <Box
          position="absolute"
          top={0}
          bottom={0}
          left={0}
          right={0}
          justifyContent="center"
          alignItems="center"
          bg="rgba(0,0,0,0.4)"
          zIndex={10}
        >
          <Box
            bg="$white"
            px="$6"
            py="$5"
            borderRadius="$lg"
            alignItems="center"
            shadowColor="#000"
            shadowOffset={{ width: 0, height: 2 }}
            shadowOpacity={0.2}
            shadowRadius={4}
            elevation={4} // For Android shadow
          >
            <Spinner size="large" color="$primary600" />
            <Text mt="$2" fontSize="$md" fontWeight="600" color="$textDark">
              {isLaunchingCamera
                ? strings.cameraScreen.openingCamera
                : strings.cameraScreen.openingGallery}
            </Text>
          </Box>
        </Box>
      )}

      {/* Confirmation Modal */}
      <ConfirmDialog
        isOpen={showAlert}
        cancelRef={cancelRef}
        title={strings.cameraScreen.removeImage}
        description={strings.cameraScreen.removeImageConfirmation}
        confirmText={strings.cameraScreen.removeButtonText}
        cancelText={strings.cameraScreen.cancelButtonText}
        onConfirm={() => {
          setShowAlert(false);
          setImage(null);
        }}
        onCancel={() => setShowAlert(false)}
      />
    </View>
  )
};

export default CameraScreen;
