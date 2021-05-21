import 'react-native-gesture-handler';
// import { StatusBar } from 'expo-status-bar';
import React from 'react';
import WelcomeScreen from './app/screens/WelcomeScreen';
import ResultScreen from './app/screens/ResultScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';


const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{
        headerShown: false
      }}>
        <Stack.Screen
          name="Home"
          component={WelcomeScreen}
        />
        <Stack.Screen
          name="SlotResults"
          component={ResultScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}