"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("react-native");
const { ProximitySensor } = react_native_1.NativeModules;
const eventEmitter = new react_native_1.NativeEventEmitter(react_native_1.Platform.OS === 'ios' ? react_native_1.NativeModules.ProximitySensor : undefined);
let subscription = null;
/**
 * Checks if the proximity sensor is supported on the current device
 * @returns Promise that resolves to a boolean indicating support
 */
const isSupported = async () => {
    return ProximitySensor.isSupported();
};
/**
 * Starts listening to proximity sensor events
 * @param callback Function to call when proximity changes
 */
const startProximitySensor = (callback) => {
    if (react_native_1.Platform.OS === 'android') {
        ProximitySensor.startProximitySensor();
        subscription = eventEmitter.addListener('onProximityChange', callback);
    }
    else {
        ProximitySensor.startProximitySensor((error, event) => {
            if (error) {
                console.error('Proximity sensor error:', error);
            }
            else {
                callback(event);
            }
        });
    }
};
/**
 * Stops listening to proximity sensor events
 */
const stopProximitySensor = () => {
    if (react_native_1.Platform.OS === 'android') {
        ProximitySensor.stopProximitySensor();
        if (subscription) {
            subscription.remove();
            subscription = null;
        }
    }
    else {
        ProximitySensor.stopProximitySensor();
    }
};
exports.default = {
    startProximitySensor,
    stopProximitySensor,
    isSupported,
};
//# sourceMappingURL=index.js.map