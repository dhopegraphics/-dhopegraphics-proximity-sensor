import type { ProximityChangeCallback, ProximityData } from './types';
/**
 * Starts listening to proximity sensor changes
 * @param callback Function to call when proximity changes
 * @returns Promise that resolves to true if sensor is available and started
 */
export declare const startProximitySensor: (callback: ProximityChangeCallback) => Promise<boolean>;
/**
 * Stops listening to proximity sensor changes
 */
export declare const stopProximitySensor: () => void;
/**
 * Checks if proximity sensor is available on the device
 * @returns Promise that resolves to boolean indicating availability
 */
export declare const isAvailable: () => Promise<boolean>;
/**
 * Adds a listener for proximity change events
 * @param eventName Only 'proximityChange' is supported
 * @param callback Function to call when event occurs
 */
export declare const addListener: (eventName: "proximityChange", callback: ProximityChangeCallback) => void;
/**
 * Removes all listeners for proximity change events
 * @param eventName Only 'proximityChange' is supported
 */
export declare const removeAllListeners: (eventName: "proximityChange") => void;
export type { ProximityData, ProximityChangeCallback };
declare const _default: {
    readonly startProximitySensor: (callback: ProximityChangeCallback) => Promise<boolean>;
    readonly stopProximitySensor: () => void;
    readonly isAvailable: () => Promise<boolean>;
    readonly addListener: (eventName: "proximityChange", callback: ProximityChangeCallback) => void;
    readonly removeAllListeners: (eventName: "proximityChange") => void;
};
export default _default;
