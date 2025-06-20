import React from 'react';
import "./global.css";
import { config } from '@gluestack-ui/config';
import { GluestackUIProvider } from '@gluestack-ui/themed';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CameraScreen from '@screens/Camera';
import MapScreen from '@screens/Map';
import { GalleryScreen } from '@screens/Gallery';
import { strings } from '@utils/Strings/strings';


const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <GluestackUIProvider config={config}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={strings.navigationScreens.camera}>
          <Stack.Screen
            name={strings.navigationScreens.camera}
            component={CameraScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={strings.navigationScreens.map}
            component={MapScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={strings.navigationScreens.gallery}
            component={GalleryScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </GluestackUIProvider>
  )
};

export default App;
