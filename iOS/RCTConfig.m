#import "RCTConfig.h"
#import "RCTBridge.h"

#import "Config.h"

@implementation RCTConfig

RCT_EXPORT_MODULE();

- (NSDictionary *)constantsToExport
{
  return @{
    @"READABILITY_TOKEN": READABILITY_TOKEN,
  };
}

@end
