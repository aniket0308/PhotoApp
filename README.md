# 📸 Geo-Tagged Photo Logger

A React Native CLI project that lets users capture photos, fetch their current location, and upload both the image and coordinates to **Firebase (Firestore)**. Users can view uploaded photos in a styled gallery with timestamps and location data.

---

## 🚀 Features

- 📷 Capture photos using the camera
- 📍 Auto-fetch GPS coordinates (latitude & longitude)
- ☁️ Upload to **Firebase Storage**
- 🗂 Save metadata (image URI, location, timestamp) to **Firestore**
- 🖼 View uploaded photos in a styled **Gallery Screen**
- 📌 Tap to open coordinates in Google Maps

---

## 🧰 Tech Stack

| Library / Tool                         | Purpose                            |
|----------------------------------------|------------------------------------|
| React Native (CLI, v0.76.5)            | Cross-platform app framework       |
| TypeScript                             | Type-safe development              |
| @react-native-firebase/app             | Firebase initialization            |
| @react-native-firebase/firestore       | Firestore for storing metadata     |
| react-native-image-picker              | Capture/select images              |
| react-native-geolocation-service       | Accurate GPS location fetching     |
| gluestack-ui                           | UI components                      |

---

## 🔐 Permissions Required

| Platform | Permissions                         |
|----------|-------------------------------------|
| Android  | `CAMERA`, `ACCESS_FINE_LOCATION`, `READ_MEDIA_IMAGES` (or `READ_EXTERNAL_STORAGE` for Android <13) |
| iOS      | `CAMERA`, `PHOTO_LIBRARY`, `LOCATION_WHEN_IN_USE` |

Handled using:
- `PermissionsAndroid` (Android)
- `react-native-permissions` (iOS)

---

## 🖼 Screens Overview

### 📷 Camera Screen
- Launch camera
- Fetch coordinates
- Show preview
- Upload to Firebase

### 🗂 Gallery Screen
- List all uploaded images
- Show timestamp & coordinates
- Tap to open in Google Maps

---

