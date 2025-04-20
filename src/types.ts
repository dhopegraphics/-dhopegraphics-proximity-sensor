/**
 * Data structure for proximity sensor readings
 */
export interface ProximityData {
    /**
     * Boolean indicating if an object is near the sensor
     */
    isNear: boolean;
    /**
     * Raw sensor value (distance in cm where available)
     */
    value: number;
    /**
     * Timestamp of the reading (in milliseconds since epoch)
     */
    timestamp: number;
  }
  
  /**
   * Error codes that can be thrown by the proximity sensor
   */
  export enum ProximitySensorError {
    NOT_AVAILABLE = 'NOT_AVAILABLE',
    NOT_SUPPORTED = 'NOT_SUPPORTED',
    PERMISSION_DENIED = 'PERMISSION_DENIED',
    START_FAILED = 'START_FAILED',
    STOP_FAILED = 'STOP_FAILED',
  }
  
  /**
   * Interface for the proximity sensor module
   */
  export interface ProximitySensorInterface {
    /**
     * Starts listening to proximity sensor changes
     * @param callback Function to be called when proximity state changes
     * @returns Promise that resolves to true if sensor was started successfully
     */
    startProximitySensor(callback: (data: ProximityData) => void): Promise<boolean>;
    
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
     * @param listener Function to be called when proximity changes
     */
    addListener(listener: (data: ProximityData) => void): void;
    
    /**
     * Removes all listeners for proximity change events
     */
    removeAllListeners(): void;
  }
  
  /**
   * Event payload for proximity change events
   */
  export type ProximityChangeEvent = {
    data: ProximityData;
  };