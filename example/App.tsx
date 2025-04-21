import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button, Platform } from 'react-native';
import ProximitySensor, { ProximityData } from '@dhopegraphics/proximity-sensor';

export default function App() {
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [proximityData, setProximityData] = useState<ProximityData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkAvailability();
    return () => {
      ProximitySensor.stopProximitySensor();
    };
  }, []);

  const checkAvailability = async () => {
    try {
      const available = await ProximitySensor.isAvailable();
      setIsAvailable(available);
    } catch (err) {
      setError(`Availability check failed: ${err instanceof Error ? err.message : String(err)}`);
      setIsAvailable(false);
    }
  };

  const toggleProximitySensor = async () => {
    if (isActive) {
      ProximitySensor.stopProximitySensor();
      setIsActive(false);
      setProximityData(null);
    } else {
      try {
        const started = await ProximitySensor.startProximitySensor(data => {
          setProximityData(data);
        });
        setIsActive(started);
        setError(null);
      } catch (err) {
        setError(`Failed to start sensor: ${err instanceof Error ? err.message : String(err)}`);
        setIsActive(false);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Proximity Sensor Demo</Text>
      <Text style={styles.platform}>Platform: {Platform.OS}</Text>

      <Text style={styles.status}>
        Sensor available: {isAvailable === null ? 'Checking...' : isAvailable ? 'Yes' : 'No'}
      </Text>

      {isAvailable && (
        <Button
          title={isActive ? 'Stop Proximity Sensor' : 'Start Proximity Sensor'}
          onPress={toggleProximitySensor}
        />
      )}

      {proximityData && (
        <View style={styles.dataContainer}>
          <Text style={styles.dataText}>Object near: {proximityData.isNear ? 'Yes' : 'No'}</Text>
          <Text style={styles.dataText}>Value: {proximityData.value.toFixed(2)}</Text>
          <Text style={styles.dataText}>
            Timestamp: {new Date(proximityData.timestamp).toISOString()}
          </Text>
        </View>
      )}

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  platform: {
    fontSize: 18,
    marginBottom: 20,
  },
  status: {
    fontSize: 18,
    marginBottom: 20,
  },
  dataContainer: {
    marginTop: 30,
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    width: '100%',
  },
  dataText: {
    fontSize: 16,
    marginBottom: 8,
  },
  errorContainer: {
    marginTop: 30,
    padding: 15,
    backgroundColor: '#ffebee',
    borderRadius: 8,
    width: '100%',
  },
  errorText: {
    fontSize: 16,
    color: '#d32f2f',
  },
});
