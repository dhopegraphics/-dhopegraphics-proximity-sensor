import { NativeEventEmitter, NativeModules, Platform } from 'react-native';
import { ProximityData, ProximitySensorInterface, ProximitySensorError } from './types';

const LINKING_ERROR =
  `The package '@dhopegraphics/proximity-sensor' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const ProximitySensorModule = NativeModules.ProximitySensor
  ? NativeModules.ProximitySensor
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      },
    );

const eventEmitter = new NativeEventEmitter(
  Platform.OS === 'ios' ? ProximitySensorModule : undefined,
);

/**
 * Main proximity sensor API
 */
const ProximitySensor: ProximitySensorInterface = {
  async startProximitySensor(callback: (data: ProximityData) => void): Promise<boolean> {
    if (Platform.OS === 'web') {
      console.warn('Proximity sensor is not supported on web');
      return false;
    }

    try {
      const result = await ProximitySensorModule.startProximitySensor();
      this.addListener(callback);
      return result;
    } catch (error) {
      throw new Error(`Failed to start proximity sensor: ${error}`);
    }
  },

  stopProximitySensor(): void {
    if (Platform.OS === 'web') {
      return;
    }

    try {
      ProximitySensorModule.stopProximitySensor();
      this.removeAllListeners();
    } catch (error) {
      throw new Error(`Failed to stop proximity sensor: ${error}`);
    }
  },

  async isAvailable(): Promise<boolean> {
    if (Platform.OS === 'web') {
      return false;
    }

    try {
      return await ProximitySensorModule.isAvailable();
    } catch (error) {
      console.error('Error checking proximity sensor availability:', error);
      return false;
    }
  },

  addListener(listener: (data: ProximityData) => void): void {
    if (Platform.OS === 'web') {
      return;
    }

    eventEmitter.addListener('proximityChange', listener);
  },

  removeAllListeners(): void {
    if (Platform.OS === 'web') {
      return;
    }

    eventEmitter.removeAllListeners('proximityChange');
  },
};

export default ProximitySensor;
export { ProximityData, ProximitySensorError };
