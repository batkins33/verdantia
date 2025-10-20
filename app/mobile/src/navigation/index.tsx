import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors } from '../theme/colors';

import HomeScreen from '../screens/Home';
import ScanScreen from '../screens/Scan';
import PlantDetailScreen from '../screens/PlantDetail';

export type RootStackParamList = {
  Home: undefined;
  Scan: undefined;
  PlantDetail: { id: string; speciesId?: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTintColor: colors.background,
          headerTitleStyle: {
            fontWeight: '600',
          },
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{ title: 'Verdantia' }}
        />
        <Stack.Screen 
          name="Scan" 
          component={ScanScreen}
          options={{ title: 'Scan Plant' }}
        />
        <Stack.Screen 
          name="PlantDetail" 
          component={PlantDetailScreen}
          options={{ title: 'Plant Details' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
