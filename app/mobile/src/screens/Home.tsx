import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { colors } from '../theme/colors';
import { useQueueStore } from '../store/queue';
import { RootStackParamList } from '../navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const { getPendingCount, queue } = useQueueStore();
  const pendingCount = getPendingCount();

  const handleSync = () => {
    if (pendingCount === 0) {
      Alert.alert('No pending uploads', 'All uploads are synced!');
      return;
    }
    
    // In a real app, this would trigger the retry logic
    Alert.alert('Sync', `Retrying ${pendingCount} pending uploads...`);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.content}>
        <Text style={styles.title}>Verdantia</Text>
        <Text style={styles.subtitle}>Plant Care Made Simple</Text>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={() => navigation.navigate('Scan')}
          >
            <Text style={styles.primaryButtonText}>Scan a Plant</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('PlantDetail', { id: 'pl_001' })}
          >
            <Text style={styles.secondaryButtonText}>View Plant</Text>
          </TouchableOpacity>
          
          {pendingCount > 0 && (
            <TouchableOpacity 
              style={styles.syncButton}
              onPress={handleSync}
            >
              <Text style={styles.syncButtonText}>
                Sync ({pendingCount} pending)
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 40,
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: colors.background,
    fontSize: 18,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: colors.accent,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: '600',
  },
  syncButton: {
    backgroundColor: colors.warning,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  syncButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '500',
  },
});
