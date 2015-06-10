// CalendarManager.m

#import "RCTMixpanel.h"
#import "RCTBridge.h"

#import "Mixpanel.h"

@implementation RCTMixpanel

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(trackEvent:(NSString*)name) {
  NSLog(@"RCTMixpanel trackEvent %@", name);
  Mixpanel *mixpanel = [Mixpanel sharedInstance];
  [mixpanel track:name properties:@{}];
}

RCT_EXPORT_METHOD(trackError:(NSString*)request err:(NSString*)err) {
  NSLog(@"RCTMixpanel trackError %@, %@", request, err);

  Mixpanel *mixpanel = [Mixpanel sharedInstance];
  [mixpanel track:@"Error" properties:@{
    @"request": request,
    @"err": err
  }];
}

@end
