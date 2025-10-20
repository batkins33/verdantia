import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import { colors } from '../theme/colors';
import { api } from '../lib/api';
import { DiagnosisSchema, type Diagnosis } from '../schemas';
import { useQueueStore } from '../store/queue';
import { RootStackParamList } from '../navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Scan'>;

export default function ScanScreen({ navigation }: Props) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addToQueue, updateStatus } = useQueueStore();

  const pickImage = async () => {
    try {
      setError(null);
      
      // Request permissions
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permissionResult.granted === false) {
        Alert.alert('Permission required', 'Please grant camera roll permissions to upload photos.');
        return;
      }

      // Pick image
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        await uploadImage(result.assets[0].uri);
      }
    } catch (err) {
      console.error('Image picker error:', err);
      setError('Failed to pick image. Please try again.');
    }
  };

  const uploadImage = async (uri: string) => {
    setIsUploading(true);
    const queueId = addToQueue(uri);
    
    try {
      updateStatus(queueId, 'uploading');
      
      // Create form data
      const formData = new FormData();
      formData.append('image', {
        uri,
        type: 'image/jpeg',
        name: 'plant.jpg',
      } as any);

      // Upload to API
      const response = await api.post('/v1/diagnose', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const diagnosis = DiagnosisSchema.parse(response.data);
      updateStatus(queueId, 'completed');
      
      // Navigate to plant detail with the first species
      const firstSpecies = diagnosis.top_species[0];
      if (firstSpecies) {
        navigation.navigate('PlantDetail', { 
          id: 'pl_new', 
          speciesId: firstSpecies.species_id 
        });
      }
      
    } catch (err: any) {
      console.error('Upload error:', err);
      updateStatus(queueId, 'failed', err.message);
      
      if (err.response?.status === 413) {
        setError('Image too large. Please choose a smaller image (max 10MB).');
      } else if (err.response?.status === 429) {
        setError('Too many requests. Please wait a moment and try again.');
      } else if (err.response?.status === 415) {
        setError('Unsupported image format. Please use JPEG, PNG, or WebP.');
      } else {
        setError('Upload failed. Please check your connection and try again.');
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Plant Scanner</Text>
        <Text style={styles.subtitle}>
          Take a photo of your plant to get instant identification and care recommendations.
        </Text>
        
        {error && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.uploadButton, isUploading && styles.uploadButtonDisabled]}
            onPress={pickImage}
            disabled={isUploading}
          >
            {isUploading ? (
              <ActivityIndicator color={colors.background} />
            ) : (
              <Text style={styles.uploadButtonText}>Upload Photo</Text>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Back to Home</Text>
          </TouchableOpacity>
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
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  errorBanner: {
    backgroundColor: colors.error,
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    width: '100%',
  },
  errorText: {
    color: colors.white,
    fontSize: 14,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
  },
  uploadButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  uploadButtonDisabled: {
    backgroundColor: colors.textSecondary,
  },
  uploadButtonText: {
    color: colors.background,
    fontSize: 18,
    fontWeight: '600',
  },
  backButton: {
    backgroundColor: 'transparent',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  backButtonText: {
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: '500',
  },
});
