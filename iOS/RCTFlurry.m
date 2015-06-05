// CalendarManager.m

#import "RCTFlurry.h"
#import "RCTBridge.h"

#import "Flurry.h"

@implementation RCTFlurry

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(logEvent:(NSString*)name) {
  NSLog(@"RCTFlurry logEvent %@", name);
  [Flurry logEvent:name];
}

RCT_EXPORT_METHOD(logEventWithParameters:(NSString*)name dictionary:(NSDictionary*)dictionary) {
  NSLog(@"RCTFlurry logEventWithParameters %@, %@", name, dictionary);
  [Flurry logEvent:name withParameters:dictionary];
}

RCT_EXPORT_METHOD(logError:(NSString*)name message:(NSString*)message) {
  NSLog(@"RCTFlurry logError %@, %@", name, message);
  NSException *e = [NSException
    exceptionWithName:@"Test"
    reason:@"Test"
    userInfo:nil];

  [Flurry logError:name message:message exception:e];
}


@end
