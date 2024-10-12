import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { GluestackUIProvider } from "@gluestack-ui/themed";
import HomeScreen from './src/screens/HomeScreen';
import ProcessingScreen from './src/screens/ProcessingScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <GluestackUIProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen 
            name="Home" 
            component={HomeScreen} 
            options={{ title: 'Furniture 3D' }}
          />
          <Stack.Screen 
            name="Processing" 
            component={ProcessingScreen} 
            options={{ title: 'Processing' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </GluestackUIProvider>
  );
}