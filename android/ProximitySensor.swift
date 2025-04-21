import Foundation
import UIKit

@objc(ProximitySensor)
class ProximitySensor: RCTEventEmitter {
    private var hasListeners = false
    
    override static func requiresMainQueueSetup() -> Bool {
        return true
    }
    
    override func supportedEvents() -> [String]! {
        return ["proximityChange"]
    }
    
    override func startObserving() {
        hasListeners = true
        UIDevice.current.isProximityMonitoringEnabled = true
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(proximityStateChanged),
            name: UIDevice.proximityStateDidChangeNotification,
            object: nil
        )
    }
    
    override func stopObserving() {
        hasListeners = false
        UIDevice.current.isProximityMonitoringEnabled = false
        NotificationCenter.default.removeObserver(
            self,
            name: UIDevice.proximityStateDidChangeNotification,
            object: nil
        )
    }
    
    @objc func proximityStateChanged(notification: NSNotification) {
        if hasListeners {
            let isNear = UIDevice.current.proximityState
            let timestamp = NSDate().timeIntervalSince1970 * 1000 // Convert to milliseconds
            
            sendEvent(
                withName: "proximityChange",
                body: [
                    "isNear": isNear,
                    "value": isNear ? 0.0 : 1.0, // iOS doesn't provide exact value, so we simulate it
                    "timestamp": timestamp
                ]
            )
        }
    }
    
    @objc func isAvailable(_ resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        resolve(true) // Proximity sensor is available on all iOS devices that support it
    }
    
    @objc func startProximitySensor(_ resolve: @escaping RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        DispatchQueue.main.async {
            UIDevice.current.isProximityMonitoringEnabled = true
            resolve(true)
        }
    }
    
    @objc func stopProximitySensor() {
        DispatchQueue.main.async {
            UIDevice.current.isProximityMonitoringEnabled = false
        }
    }
    
    @objc func addListener(_ eventName: String) {
        // Keep: Required for RN built-in EventEmitter
    }
    
    @objc func removeListeners(_ count: Int) {
        // NativeEventEmitter requires this method
        if count == 0 {
            stopProximitySensor()
        }
    }
    
    override func invalidate() {
        stopProximitySensor()
        super.invalidate()
    }
}