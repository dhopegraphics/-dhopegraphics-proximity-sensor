import { NativeEventEmitter, NativeModules } from 'react-native';
import type { ProximityChangeCallback } from './types';

const { ProximitySensor } = NativeModules;

// Create a wrapped version that satisfies NativeEventEmitter requirements
const proxSensorWithEmitterSupport = {
  ...ProximitySensor,
  removeListeners: (count: number) => {
    // NativeEventEmitter requires this method but we handle listeners through removeAllListeners
    if (count === 0) {
      ProximitySensor.removeAllListeners('proximityChange');
    }
  },
  addListener: (eventType: string) => {
    // Wrap the original addListener to match the expected signature
    if (eventType === 'proximityChange') {
      return {
        remove: () => ProximitySensor.removeAllListeners('proximityChange'),
      };
    }
    // Return null for unsupported event types
    return null;
  },
};

const eventEmitter = new NativeEventEmitter(proxSensorWithEmitterSupport);

/**
 * Adds a listener for proximity change events
 * @param callback Function to call when proximity changes
 * @returns Subscription that can be used to remove the listener
 */
export const addProximityListener = (callback: ProximityChangeCallback) => {
  return eventEmitter.addListener('proximityChange', callback);
};

/**
 * Removes all proximity change listeners
 */
export const removeAllProximityListeners = () => {
  eventEmitter.removeAllListeners('proximityChange');
};
