import { ConfigPlugin, withInfoPlist } from '@expo/config-plugins';

/**
 * Config plugin to configure the ProximitySensor
 */
const withProximitySensor: ConfigPlugin = (config:any) => {
  return withInfoPlist(config, (mod:any) => {
    // iOS doesn't require any special permissions for proximity sensor
    // But we ensure the UIBackgroundModes are not modified
    if (!mod.modResults.UIBackgroundModes) {
      mod.modResults.UIBackgroundModes = [];
    }

    // Android doesn't require any special permissions for proximity sensor

    return mod;
  });
};

export default withProximitySensor;