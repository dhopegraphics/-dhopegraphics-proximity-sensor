package com.dhopegraphics.proximitysensor

import android.content.Context
import android.hardware.Sensor
import android.hardware.SensorEvent
import android.hardware.SensorEventListener
import android.hardware.SensorManager
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule

class ProximitySensorModule(context: ReactApplicationContext) : ReactContextBaseJavaModule(context), SensorEventListener {
    private val sensorManager: SensorManager? by lazy {
        reactApplicationContext.getSystemService(Context.SENSOR_SERVICE) as? SensorManager
    }
    private var proximitySensor: Sensor? = null
    private var lastUpdateTime: Long = 0
    private var isListening = false

    override fun getName(): String = "ProximitySensor"

    override fun getConstants(): Map<String, Any>? = mapOf(
        "PROXIMITY_SENSOR_DELAY_NORMAL" to SensorManager.SENSOR_DELAY_NORMAL,
        "PROXIMITY_SENSOR_DELAY_UI" to SensorManager.SENSOR_DELAY_UI,
        "PROXIMITY_SENSOR_DELAY_GAME" to SensorManager.SENSOR_DELAY_GAME,
        "PROXIMITY_SENSOR_DELAY_FASTEST" to SensorManager.SENSOR_DELAY_FASTEST
    )

    @ReactMethod
    fun isAvailable(promise: Promise) {
        promise.resolve(proximitySensor != null)
    }

    @ReactMethod
    fun startProximitySensor(delay: Int, promise: Promise) {
        if (isListening) {
            promise.resolve(true)
            return
        }

        if (sensorManager == null || proximitySensor == null) {
            promise.reject("SENSOR_UNAVAILABLE", "Proximity sensor not available on this device")
            return
        }

        try {
            sensorManager?.registerListener(this, proximitySensor, delay)
            isListening = true
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("SENSOR_ERROR", "Failed to start proximity sensor", e)
        }
    }

    @ReactMethod
    fun stopProximitySensor() {
        if (isListening) {
            sensorManager?.unregisterListener(this)
            isListening = false
        }
    }

    @ReactMethod
    fun addListener(eventName: String) {
        // Keep: Required for RN built-in EventEmitter
    }

    @ReactMethod
    fun removeListeners(count: Int) {
        // NativeEventEmitter requires this method
        if (count == 0) {
            stopProximitySensor()
        }
    }

    override fun onSensorChanged(event: SensorEvent?) {
        if (event?.sensor?.type != Sensor.TYPE_PROXIMITY) return

        val currentTime = System.currentTimeMillis()
        if (currentTime - lastUpdateTime < 100) return // Throttle events to 10Hz max

        lastUpdateTime = currentTime
        val isNear = event.values[0] < (proximitySensor?.maximumRange ?: 0f) * 0.5
        val value = event.values[0]
        val timestamp = event.timestamp / 1000000 // Convert nanoseconds to milliseconds

        val params = Arguments.createMap().apply {
            putBoolean("isNear", isNear)
            putDouble("value", value.toDouble())
            putDouble("timestamp", timestamp.toDouble())
        }

        reactApplicationContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            ?.emit("proximityChange", params)
    }

    override fun onAccuracyChanged(sensor: Sensor?, accuracy: Int) {
        // Not used for proximity sensor
    }

    override fun initialize() {
        super.initialize()
        proximitySensor = sensorManager?.getDefaultSensor(Sensor.TYPE_PROXIMITY)
    }

    override fun onCatalystInstanceDestroy() {
        super.onCatalystInstanceDestroy()
        stopProximitySensor()
    }
}