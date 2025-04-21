import type { ProximityChangeCallback } from './types';
/**
 * Adds a listener for proximity change events
 * @param callback Function to call when proximity changes
 * @returns Subscription that can be used to remove the listener
 */
export declare const addProximityListener: (callback: ProximityChangeCallback) => import("react-native").EmitterSubscription;
/**
 * Removes all proximity change listeners
 */
export declare const removeAllProximityListeners: () => void;
