import { NativeEventEmitter, NativeModules } from 'react-native';
import { ProximityChangeCallback, ProximityData } from './types';

const { ProximitySensor } = NativeModules;
const eventEmitter = new NativeEventEmitter(ProximitySensor);

/**
 * Adds a listener for proximity change events
 * @param callback Function to call when proximity changes
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