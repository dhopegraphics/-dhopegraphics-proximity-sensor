/**
 * Data structure for proximity sensor readings
 */
export interface ProximityData {
  /**
   * Whether the object is near the sensor (true) or not (false)
   */
  isNear: boolean;
  /**
   * The proximity value in centimeters (platform-specific)
   * - Android: Actual distance in cm (or max value if far)
   * - iOS: 0 when near, 1 when far (exact distance not available)
   */
  value: number;
  /**
   * Timestamp of the reading in milliseconds
   */
  timestamp: number;
}

/**
 * Event callback type for proximity changes
 */
export type ProximityChangeCallback = (data: ProximityData) => void;

/**
 * Interface for the Proximity Sensor module
 */
export interface ProximitySensorInterface {
  /**
   * Starts listening to proximity sensor changes
   * @param callback Function to call when proximity changes
   * @returns Promise that resolves to true if sensor is available and started
   */
  startProximitySensor(callback: ProximityChangeCallback): Promise<boolean>;
  /**
   * Stops listening to proximity sensor changes
   */
  stopProximitySensor(): void;
  /**
   * Checks if proximity sensor is available on the device
   * @returns Promise that resolves to boolean indicating availability
   */
  isAvailable(): Promise<boolean>;
  /**
   * Adds a listener for proximity change events
   * @param eventName Only 'proximityChange' is supported
   * @param callback Function to call when event occurs
   */
  addListener(eventName: 'proximityChange', callback: ProximityChangeCallback): void;
  /**
   * Removes all listeners for proximity change events
   * @param eventName Only 'proximityChange' is supported
   */
  removeAllListeners(eventName: 'proximityChange'): void;
  /**
   * Required by NativeEventEmitter
   * @param count Number of listeners to remove
   */
  removeListeners(count: number): void;
}

declare module 'react-native' {
  interface NativeModulesStatic {
    ProximitySensor: ProximitySensorInterface;
  }
}
