import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, Button } from 'react-native';
import { StatusBar } from 'expo-status-bar';

function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 }}>
      <Text style={{ fontSize: 22, fontWeight: '600' }}>Verdantia</Text>
      <Button title="Scan a Plant" onPress={() => navigation.navigate('Scan')} />
      <Button title="View Plant" onPress={() => navigation.navigate('PlantDetail', { id: 'pl_001' })} />
      <StatusBar style="auto" />
    </View>
  );
}

function ScanScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 }}>
      <Text style={{ fontSize: 18 }}>Camera placeholder</Text>
      <Button title="Upload Photo (mock)" onPress={() => navigation.navigate('PlantDetail', { id: 'pl_001' })} />
    </View>
  );
}

function PlantDetailScreen({ route }) {
  const { id } = route.params || { id: 'pl_001' };
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16, gap: 10 }}>
      <Text style={{ fontSize: 18, fontWeight: '600' }}>Plant {id}</Text>
      <Text>Next watering: (fetch from API)</Text>
      <Text>Interval: 8 days</Text>
    </View>
  );
}

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Scan" component={ScanScreen} />
        <Stack.Screen name="PlantDetail" component={PlantDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
