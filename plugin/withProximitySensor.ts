import { ConfigPlugin, withInfoPlist } from '@expo/config-plugins';
import { mergeContents } from '@expo/config-plugins/build/utils/generateCode';

/**
 * Config plugin to configure the iOS and Android project for the proximity sensor
 */
const withProximitySensor: ConfigPlugin = (config) => {
  // iOS: No specific entitlements needed for proximity sensor
  config = withInfoPlist(config, (config) => {
    // Add any required Info.plist entries if needed
    return config;
  });

  return config;
};

export default withProximitySensor;