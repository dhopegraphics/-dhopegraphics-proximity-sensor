# @dhopegraphics/proximity-sensor

React Native package for proximity sensor detection with Expo support

## Features

- Cross-platform support (Android, iOS)
- Simple API with TypeScript support
- Real-time event listening
- Expo config plugin for easy setup
- Works with both managed and bare workflows

## Installation

```sh
npm install @dhopegraphics/proximity-sensor
# or
yarn add @dhopegraphics/proximity-sensorS
```


import ProximitySensor, { ProximityData } from '@dhopegraphics/proximity-sensor';

// Check if sensor is available
const available = await ProximitySensor.isAvailable();

// Start listening with callback
await ProximitySensor.startProximitySensor((data: ProximityData) => {
  console.log('Proximity changed:', data);
});

// Or use event listener
const subscription = ProximitySensor.addListener('proximityChange', (data: ProximityData) => {
  console.log('Proximity event:', data);
});

// When done
ProximitySensor.stopProximitySensor();
subscription.remove();