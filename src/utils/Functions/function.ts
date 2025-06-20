import { Alert, Linking, PermissionsAndroid, Platform } from "react-native";
import { check, PERMISSIONS, request, RESULTS, Permission } from 'react-native-permissions';
import storage from '@react-native-firebase/storage';
import firestore, { addDoc, collection, getDocs, getFirestore, query, serverTimestamp, where } from '@react-native-firebase/firestore';
import Geolocation from 'react-native-geolocation-service';
import DeviceInfo from "react-native-device-info";
import { getApp } from "@react-native-firebase/app";
import RNFetchBlob from "rn-fetch-blob";

async function askIOS(permission: Permission, label: string) {
    const status = await check(permission);
    if (status === RESULTS.GRANTED || status === RESULTS.LIMITED) return true;
    if (status === RESULTS.DENIED) {
        const resp = await request(permission);
        if (resp === RESULTS.GRANTED) return true;
    } else if (status === RESULTS.BLOCKED) {
        showSettingsAlert(label);
        return false;
    }
    return false;
}

function showSettingsAlert(label: string) {
    Alert.alert(
        `${label} Permission`,
        `This feature requires ${label.toLowerCase()} permission. Please enable it in your settings.`,
        [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Linking.openSettings() }
        ]
    );
}

export async function requestCameraAndLocation(): Promise<boolean> {
    if (Platform.OS === 'android') {

        const checkCamera = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA);
        const checkLocation = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);

        let cameraOK = checkCamera;
        let locationOK = checkLocation;

        if (!cameraOK || !locationOK) {
            const granted = await PermissionsAndroid.requestMultiple([
                PermissionsAndroid.PERMISSIONS.CAMERA,
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            ]);

            cameraOK = granted['android.permission.CAMERA'] === PermissionsAndroid.RESULTS.GRANTED;
            locationOK = granted['android.permission.ACCESS_FINE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED;
        }

        if (!cameraOK) showSettingsAlert('Camera');
        if (!locationOK) showSettingsAlert('Location');

        return cameraOK && locationOK;
    }
    // iOS Flow
    const cameraOK = await askIOS(PERMISSIONS.IOS.CAMERA, 'Camera');
    if (!cameraOK) return false;

    const locOK = await askIOS(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE, 'Location');
    return locOK;
}

export async function requestGalleryAndLocation(): Promise<boolean> {
    if (Platform.OS === 'android') {
        const galleryPermissionType =
            Platform.Version >= 33
                ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
                : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;

        try {

            const galleryGranted = await PermissionsAndroid.check(galleryPermissionType);
            const locationGranted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);

            let galleryOK = galleryGranted;
            let locationOK = locationGranted;

            if (!galleryOK || !locationOK) {
                const granted = await PermissionsAndroid.requestMultiple([
                    galleryPermissionType,
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                ]);

                console.log('RequestMultiple result:', granted);

                galleryOK = granted[galleryPermissionType] === PermissionsAndroid.RESULTS.GRANTED;
                locationOK = granted[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] === PermissionsAndroid.RESULTS.GRANTED;
            }

            if (!galleryOK) showSettingsAlert('Gallery');
            if (!locationOK) showSettingsAlert('Location');

            return galleryOK && locationOK;

        } catch (error) {
            console.error('Error requesting permissions:', error);
            return false;
        }
    }

    // iOS flow
    const galleryOK = await askIOS(PERMISSIONS.IOS.PHOTO_LIBRARY, 'Photo Library');
    if (!galleryOK) return false;

    const locOK = await askIOS(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE, 'Location');
    return locOK;
}


export const getCurrentLocation = (): Promise<{
    latitude: number;
    longitude: number;
} | null> => {
    return new Promise((resolve, reject) => {
        Geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                resolve({ latitude, longitude });
            },
            (error) => {
                console.warn('Error getting location:', error);
                resolve(null);
            },
            {
                enableHighAccuracy: true, timeout: 15000, maximumAge: 10000, forceRequestLocation: true,
                showLocationDialog: true,
            }
        );
    });
};

export const uploadImage = async (imageUri: string): Promise<string | null> => {
  const fileName = imageUri.substring(imageUri.lastIndexOf('/') + 1);
  const filePath = imageUri.replace('file://', ''); // Important fix
  const reference = storage().ref(`images/${fileName}`);

  try {
    const exists = await RNFetchBlob.fs.exists(filePath);
    console.log('File exists?', exists);

    if (!exists) {
      console.error('File does not exist at path:', filePath);
      return null;
    }

    console.log('🚀 Uploading:', filePath);
    const task = reference.putFile(filePath);

    task.on('state_changed', {
      next: snap => {
        const pct = ((snap.bytesTransferred / snap.totalBytes) * 100).toFixed(0);
        console.log(`Upload progress: ${pct}%`);
      },
      error: err => {
        console.error('Upload error:', err);
      },
      complete: () => {
        console.log('Upload complete');
      },
    });

    await task;
    const downloadUrl = await reference.getDownloadURL();
    return downloadUrl;

  } catch (err) {
    return null;
  }
};

export const handleUpload = async (imageUri: string, fileName: string, location: { latitude: number, longitude: number }): Promise<boolean> => {
    try {
        // Upload image
        // const downloadUrl = await uploadImage(imageUri);

        // Save metadata
        await saveMetadata(imageUri, fileName, location);

        return true;

    } catch (error) {
        console.error('Upload error:', error);
        return false;
    }
};

const getDeviceId = () => {
    return DeviceInfo.getUniqueId();
};

export const saveMetadata = async (
    imageUrl: string,
    fileName: string,
    location: { latitude: number; longitude: number }
) => {
    const deviceId = await getDeviceId();

    const db = getFirestore(getApp());
    const photosRef = collection(db, 'GeoPhotos');

    await addDoc(photosRef, {
        fileName,
        fileUri: imageUrl,
        location,
        deviceId,
        createdAt: serverTimestamp(),
    });
};

export const fetchMetadata = async () => {
    const db = getFirestore(getApp());
    const photosRef = collection(db, 'GeoPhotos');
    const deviceId = await getDeviceId();

    // Optional: order by createdAt descending (most recent first)
    const q = query(
        photosRef,
        where('deviceId', '==', deviceId)
    );

    try {
        const querySnapshot = await getDocs(q);
        const photos: Array<{
            id: string;
            fileName: string;
            fileUri: string;
            location: { latitude: number; longitude: number };
            deviceId: string;
            createdAt: any; // timestamp
        }> = [];

        querySnapshot.forEach(doc => {
            photos.push({ id: doc.id, ...doc.data() } as any);
        });

        return photos; // array of photo metadata objects
    } catch (error) {
        console.error('Error fetching GeoPhotos:', error);
        throw error;
    }
};