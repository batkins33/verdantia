import React from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors } from '../theme/colors';
import { useCare } from '../hooks/useCare';
import { useAlerts } from '../hooks/useAlerts';
import { RootStackParamList } from '../navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'PlantDetail'>;

export default function PlantDetailScreen({ route }: Props) {
  const { id, speciesId } = route.params;
  const { data: carePlan, isLoading: careLoading, error: careError } = useCare(id);
  const { data: alerts, isLoading: alertsLoading } = useAlerts('Keller');

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Plant {id}</Text>
        
        {speciesId && (
          <View style={styles.speciesInfo}>
            <Text style={styles.speciesLabel}>Species ID:</Text>
            <Text style={styles.speciesValue}>{speciesId}</Text>
          </View>
        )}
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Care Plan</Text>
          
          {careLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color={colors.primary} />
              <Text style={styles.loadingText}>Loading care plan...</Text>
            </View>
          )}
          
          {careError && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>
                Failed to load care plan. Please try again.
              </Text>
            </View>
          )}
          
          {carePlan && (
            <View style={styles.careInfo}>
              <View style={styles.careItem}>
                <Text style={styles.careLabel}>Next Watering:</Text>
                <Text style={styles.careValue}>
                  {formatDate(carePlan.next_water_at)}
                </Text>
              </View>
              
              <View style={styles.careItem}>
                <Text style={styles.careLabel}>Watering Interval:</Text>
                <Text style={styles.careValue}>
                  {carePlan.interval_days} days
                </Text>
              </View>
              
              <View style={styles.careItem}>
                <Text style={styles.careLabel}>Feeding Schedule:</Text>
                <Text style={styles.careValue}>
                  Every {carePlan.feed_plan.cadence_days} days
                </Text>
              </View>
            </View>
          )}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Weather Alerts</Text>
          
          {alertsLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color={colors.primary} />
              <Text style={styles.loadingText}>Loading alerts...</Text>
            </View>
          )}
          
          {alerts && alerts.alerts.length > 0 ? (
            <View style={styles.alertsContainer}>
              {alerts.alerts.map((alert, index) => (
                <View key={index} style={styles.alertItem}>
                  <Text style={styles.alertType}>{alert.type.replace('_', ' ').toUpperCase()}</Text>
                  <Text style={styles.alertMessage}>{alert.message}</Text>
                  <Text style={styles.alertSeverity}>
                    Severity: {alert.severity}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.noAlertsText}>No alerts at this time</Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 20,
  },
  speciesInfo: {
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  speciesLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  speciesValue: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 12,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loadingText: {
    marginLeft: 8,
    color: colors.textSecondary,
  },
  errorContainer: {
    backgroundColor: colors.error,
    padding: 12,
    borderRadius: 8,
  },
  errorText: {
    color: colors.white,
    textAlign: 'center',
  },
  careInfo: {
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  careItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  careLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    flex: 1,
  },
  careValue: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  alertsContainer: {
    gap: 12,
  },
  alertItem: {
    backgroundColor: colors.warning,
    padding: 12,
    borderRadius: 8,
  },
  alertType: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.white,
    marginBottom: 4,
  },
  alertMessage: {
    fontSize: 14,
    color: colors.white,
    marginBottom: 4,
  },
  alertSeverity: {
    fontSize: 12,
    color: colors.white,
    opacity: 0.8,
  },
  noAlertsText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
