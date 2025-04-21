import { NativeModules, Platform } from 'react-native';
import { addProximityListener, removeAllProximityListeners } from './eventEmitter';
import type { ProximityChangeCallback, ProximityData, ProximitySensorInterface } from './types';

const { ProximitySensor } = NativeModules;

const noop = () => {};
const warnWebUnsupported = () => {
  console.warn('Proximity sensor is not supported on web platform');
};

const webImplementation: ProximitySensorInterface = {
  startProximitySensor: () => {
    warnWebUnsupported();
    return Promise.resolve(false);
  },
  stopProximitySensor: noop,
  isAvailable: () => {
    warnWebUnsupported();
    return Promise.resolve(false);
  },
  addListener: noop,
  removeAllListeners: noop,
  removeListeners: noop,
};

const implementation: ProximitySensorInterface = Platform.select({
  web: webImplementation,
  default: {
    ...ProximitySensor,
    addListener: (eventName: 'proximityChange', callback: ProximityChangeCallback) => {
      if (eventName === 'proximityChange') {
        addProximityListener(callback);
      }
    },
    removeAllListeners: (eventName: 'proximityChange') => {
      if (eventName === 'proximityChange') {
        removeAllProximityListeners();
      }
    },
    removeListeners: ProximitySensor.removeListeners,
  },
});

/**
 * Starts listening to proximity sensor changes
 * @param callback Function to call when proximity changes
 * @returns Promise that resolves to true if sensor is available and started
 */
export const startProximitySensor = (callback: ProximityChangeCallback): Promise<boolean> => {
  return implementation.startProximitySensor(callback);
};

/**
 * Stops listening to proximity sensor changes
 */
export const stopProximitySensor = (): void => {
  implementation.stopProximitySensor();
};

/**
 * Checks if proximity sensor is available on the device
 * @returns Promise that resolves to boolean indicating availability
 */
export const isAvailable = (): Promise<boolean> => {
  return implementation.isAvailable();
};

/**
 * Adds a listener for proximity change events
 * @param eventName Only 'proximityChange' is supported
 * @param callback Function to call when event occurs
 */
export const addListener = implementation.addListener;

/**
 * Removes all listeners for proximity change events
 * @param eventName Only 'proximityChange' is supported
 */
export const removeAllListeners = implementation.removeAllListeners;

export type { ProximityData, ProximityChangeCallback };

export default {
  startProximitySensor,
  stopProximitySensor,
  isAvailable,
  addListener,
  removeAllListeners,
} as const;
