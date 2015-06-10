// CalendarManager.m

#import "RCTPocket.h"
#import "RCTBridge.h"

#import "Config.h"

#import "PocketAPI.h"
#import "PocketAPITypes.h"

@implementation RCTPocket

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(getLoggedInUser:(RCTResponseSenderBlock)callback) {
  NSLog(@"RCTPocket getLoggedInUser");
  NSString *username = [[PocketAPI sharedAPI] username] ? [[PocketAPI sharedAPI] username] : @"";
  int isLoggedIn = [[PocketAPI sharedAPI] isLoggedIn] ? [[PocketAPI sharedAPI] isLoggedIn] : 0;

  callback(@[[NSNull null], @{
    @"username": username,
    @"isLoggedIn": [NSString stringWithFormat:@"%d", isLoggedIn]
  }]);
}

RCT_EXPORT_METHOD(login:(RCTResponseSenderBlock)callback) {
  NSLog(@"RCTPocket login");

  [[PocketAPI sharedAPI] loginWithHandler: ^(PocketAPI *API, NSError *error){
    if (error != nil) {
      NSLog(@"RCTPocket login.error %@",[error localizedDescription]);
      callback(@[@{ @"error": [error localizedDescription]}]);
    } else {
      NSString *username = [API username] ? [API username] : @"";
      int isLoggedIn = [API isLoggedIn] ? [API isLoggedIn] : 0;
      NSLog(@"RCTPocket login.success %@, %d", username, isLoggedIn);

      callback(@[[NSNull null], @{
        @"username": username,
        @"isLoggedIn": [NSString stringWithFormat:@"%d", isLoggedIn]
      }]);
    }
  }];
}

RCT_EXPORT_METHOD(logout) {
  NSLog(@"RCTPocket logout");
  [[PocketAPI sharedAPI] logout];
}

RCT_EXPORT_METHOD(fetch:(NSString*)since callback:(RCTResponseSenderBlock)callback)
{
  NSLog(@"RCTPocket fetch. since:%@", since);

  NSString *apiMethod = @"get";
  PocketAPIHTTPMethod httpMethod = PocketAPIHTTPMethodPOST;
  NSDictionary *arguments = @{
    @"contentType": @"article",
    @"sort": @"newest",
    @"detailType": @"complete",
    @"since": since ? since : @""
  };

  [[PocketAPI sharedAPI] callAPIMethod:apiMethod
                        withHTTPMethod:httpMethod
                             arguments:arguments
                               handler: ^(PocketAPI *api, NSString *apiMethod, NSDictionary *response, NSError *error){
                                if (error != nil) {
                                  NSLog(@"RCTPocket fetch.error %@",[error localizedDescription]);
                                  callback(@[@{ @"error": [error localizedDescription]}]);
                                } else {
                                  NSLog(@"RCTPocket fetch.success");
                                  // NSLog(@"fetch.success %@", response );
                                  callback(@[[NSNull null], response]);
                                }
                               }];

}

RCT_EXPORT_METHOD(modify:(NSArray*)actions callback:(RCTResponseSenderBlock)callback)
{
  NSLog(@"RCTPocket modify %@", actions);

  NSString *apiMethod = @"send";
  PocketAPIHTTPMethod httpMethod = PocketAPIHTTPMethodPOST;
  NSDictionary *arguments = @{
                              @"actions": actions
                            };


  [[PocketAPI sharedAPI] callAPIMethod:apiMethod
                        withHTTPMethod:httpMethod
                             arguments:arguments
                               handler: ^(PocketAPI *api, NSString *apiMethod, NSDictionary *response, NSError *error){
                                 if (error != nil) {
                                   NSLog(@"RCTPocket modify.error %@",[error localizedDescription]);
                                   callback(@[@{ @"error": [error localizedDescription]}]);
                                 } else {
                                   NSLog(@"RCTPocket modify.success %@", response);
                                   callback(@[[NSNull null], response]);
                                 }
                               }];

}

@end
