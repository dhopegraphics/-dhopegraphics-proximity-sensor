#import "ProximitySensor.h"
#import <UIKit/UIKit.h>

@implementation ProximitySensor {
  BOOL _hasListeners;
}

RCT_EXPORT_MODULE();

- (NSArray<NSString *> *)supportedEvents {
  return @[@"onProximityChange"];
}

- (void)startObserving {
  _hasListeners = YES;
  [[UIDevice currentDevice] setProximityMonitoringEnabled:YES];
  [[NSNotificationCenter defaultCenter] addObserver:self
                                         selector:@selector(proximityChanged:)
                                             name:UIDeviceProximityStateDidChangeNotification
                                           object:nil];
}

- (void)stopObserving {
  _hasListeners = NO;
  [[UIDevice currentDevice] setProximityMonitoringEnabled:NO];
  [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (void)proximityChanged:(NSNotification *)notification {
  if (!_hasListeners) return;
  
  UIDevice *device = [notification object];
  BOOL isNear = device.proximityState;
  
  [self sendEventWithName:@"onProximityChange" body:@{
    @"isNear": @(isNear),
    @"value": @(isNear ? 0 : 1), // iOS doesn't provide exact values
    @"maxRange": @1 // iOS proximity is binary (near/far)
  }];
}

RCT_EXPORT_METHOD(isSupported:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  BOOL supported = [UIDevice currentDevice].isProximityMonitoringEnabled;
  resolve(@(supported));
}

RCT_EXPORT_METHOD(startProximitySensor:(RCTResponseSenderBlock)callback) {
  dispatch_async(dispatch_get_main_queue(), ^{
    if (![UIDevice currentDevice].isProximityMonitoringEnabled) {
      [[UIDevice currentDevice] setProximityMonitoringEnabled:YES];
    }
    
    if ([UIDevice currentDevice].isProximityMonitoringEnabled) {
      callback(@[[NSNull null], @{
        @"isNear": @([UIDevice currentDevice].proximityState),
        @"value": @([UIDevice currentDevice].proximityState ? 0 : 1),
        @"maxRange": @1
      }]);
    } else {
      callback(@[@"Proximity monitoring not available", [NSNull null]]);
    }
  });
}

RCT_EXPORT_METHOD(stopProximitySensor) {
  dispatch_async(dispatch_get_main_queue(), ^{
    [[UIDevice currentDevice] setProximityMonitoringEnabled:NO];
  });
}

- (void)dealloc {
  [[NSNotificationCenter defaultCenter] removeObserver:self];
}

@end