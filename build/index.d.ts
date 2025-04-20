type ProximityEvent = {
    isNear: boolean;
    value?: number;
    maxRange?: number;
};
type ProximitySensorType = {
    startProximitySensor: (callback: (event: ProximityEvent) => void) => void;
    stopProximitySensor: () => void;
    isSupported: () => Promise<boolean>;
};
declare const _default: ProximitySensorType;
export default _default;
