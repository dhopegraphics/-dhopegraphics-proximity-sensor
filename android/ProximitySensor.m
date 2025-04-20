#import "ProximitySensor.h"
#import <UIKit/UIKit.h>

@implementation ProximitySensor {
    BOOL _hasListeners;
}

RCT_EXPORT_MODULE();

- (NSArray<NSString *> *)supportedEvents {
    return @[@"proximityChange", @"proximityError"];
}

- (void)startObserving {
    _hasListeners = YES;
    [[UIDevice currentDevice] setProximityMonitoringEnabled:YES];
    [[NSNotificationCenter defaultCenter] addObserver:self
                                           selector:@selector(proximityStateDidChange:)
                                               name:UIDeviceProximityStateDidChangeNotification
                                             object:nil];
}

- (void)stopObserving {
    _hasListeners = NO;
    [[UIDevice currentDevice] setProximityMonitoringEnabled:NO];
    [[NSNotificationCenter defaultCenter] removeObserver:self
                                                  name:UIDeviceProximityStateDidChangeNotification
                                                object:nil];
}

- (void)proximityStateDidChange:(NSNotification *)notification {
    if (!_hasListeners) return;
    
    UIDevice *device = [notification object];
    NSDictionary *payload = @{
        @"isNear": @(device.proximityState),
        @"value": @(device.proximityState ? 0 : 1), // Simple binary value for iOS
        @"timestamp": @([NSDate date].timeIntervalSince1970 * 1000)
    };
    
    [self sendEventWithName:@"proximityChange" body:payload];
}

- (void)dealloc {
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}

RCT_EXPORT_METHOD(isAvailable:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    BOOL isAvailable = [UIDevice currentDevice].isProximityMonitoringEnabled;
    resolve(@(isAvailable));
}

RCT_EXPORT_METHOD(startProximitySensor:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    dispatch_async(dispatch_get_main_queue(), ^{
        if (![UIDevice currentDevice].isProximityMonitoringEnabled) {
            [[UIDevice currentDevice] setProximityMonitoringEnabled:YES];
        }
        
        if ([UIDevice currentDevice].isProximityMonitoringEnabled) {
            resolve(@YES);
        } else {
            reject(@"PROXIMITY_ERROR", @"Failed to enable proximity monitoring", nil);
        }
    });
}

RCT_EXPORT_METHOD(stopProximitySensor) {
    dispatch_async(dispatch_get_main_queue(), ^{
        [[UIDevice currentDevice] setProximityMonitoringEnabled:NO];
    });
}

+ (BOOL)requiresMainQueueSetup {
    return YES;
}

@end