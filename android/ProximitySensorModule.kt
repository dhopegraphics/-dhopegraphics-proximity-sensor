package com.dhopegraphics.proximitysensor

import android.content.Context
import android.hardware.Sensor
import android.hardware.SensorEvent
import android.hardware.SensorEventListener
import android.hardware.SensorManager
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule

class ProximitySensorModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext), SensorEventListener {
    private var sensorManager: SensorManager? = null
    private var proximitySensor: Sensor? = null
    private var lastReading: WritableMap? = null

    override fun getName(): String {
        return "ProximitySensor"
    }

    @ReactMethod
    fun isAvailable(promise: Promise) {
        try {
            val sensorManager = reactApplicationContext.getSystemService(Context.SENSOR_SERVICE) as? SensorManager
            val hasProximitySensor = sensorManager?.getDefaultSensor(Sensor.TYPE_PROXIMITY) != null
            promise.resolve(hasProximitySensor)
        } catch (e: Exception) {
            promise.reject("SENSOR_UNAVAILABLE", "Error checking proximity sensor availability", e)
        }
    }

    @ReactMethod
    fun startProximitySensor(promise: Promise) {
        try {
            sensorManager = reactApplicationContext.getSystemService(Context.SENSOR_SERVICE) as? SensorManager
            proximitySensor = sensorManager?.getDefaultSensor(Sensor.TYPE_PROXIMITY)

            if (proximitySensor == null) {
                promise.reject("NO_SENSOR", "Proximity sensor not available")
                return
            }

            sensorManager?.registerListener(this, proximitySensor, SensorManager.SENSOR_DELAY_NORMAL)
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("SENSOR_ERROR", "Error starting proximity sensor", e)
        }
    }

    @ReactMethod
    fun stopProximitySensor() {
        try {
            sensorManager?.unregisterListener(this)
            sensorManager = null
            proximitySensor = null
        } catch (e: Exception) {
            // Log error but don't throw as this might be called during cleanup
            reactApplicationContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                .emit("proximityError", "Error stopping proximity sensor: ${e.message}")
        }
    }

    override fun onSensorChanged(event: SensorEvent?) {
        if (event?.sensor?.type != Sensor.TYPE_PROXIMITY) return

        val isNear = event.values[0] < event.sensor.maximumRange
        val timestamp = System.currentTimeMillis()

        val params = Arguments.createMap().apply {
            putBoolean("isNear", isNear)
            putDouble("value", event.values[0].toDouble())
            putDouble("timestamp", timestamp.toDouble())
        }

        lastReading = params

        reactApplicationContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit("proximityChange", params)
    }

    override fun onAccuracyChanged(sensor: Sensor?, accuracy: Int) {
        // Not used for proximity sensor
    }

    override fun onCatalystInstanceDestroy() {
        super.onCatalystInstanceDestroy()
        stopProximitySensor()
    }
}

class ProximitySensorPackage : ReactPackage {
    override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> {
        return listOf(ProximitySensorModule(reactContext))
    }

    override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> {
        return emptyList()
    }
}