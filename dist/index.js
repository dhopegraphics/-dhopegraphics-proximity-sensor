import { NativeModules, Platform } from 'react-native';
import { addProximityListener, removeAllProximityListeners } from './eventEmitter';
const { ProximitySensor } = NativeModules;
const noop = () => { };
const warnWebUnsupported = () => {
    console.warn('Proximity sensor is not supported on web platform');
};
const webImplementation = {
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
const implementation = Platform.select({
    web: webImplementation,
    default: {
        ...ProximitySensor,
        addListener: (eventName, callback) => {
            if (eventName === 'proximityChange') {
                addProximityListener(callback);
            }
        },
        removeAllListeners: (eventName) => {
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
export const startProximitySensor = (callback) => {
    return implementation.startProximitySensor(callback);
};
/**
 * Stops listening to proximity sensor changes
 */
export const stopProximitySensor = () => {
    implementation.stopProximitySensor();
};
/**
 * Checks if proximity sensor is available on the device
 * @returns Promise that resolves to boolean indicating availability
 */
export const isAvailable = () => {
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
export default {
    startProximitySensor,
    stopProximitySensor,
    isAvailable,
    addListener,
    removeAllListeners,
};
