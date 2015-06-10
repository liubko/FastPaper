//
//  PocketLoginViewController.h
//  iOS Test App
//
//  Created by Shuichi Asai on 2014/02/06.
//  Copyright (c) 2014年 Read It Later, Inc. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface PocketLoginViewController : UIViewController
@property (retain, nonatomic) IBOutlet UIWebView *webView;
@property (retain, nonatomic) NSString *url;
- (IBAction)cancelClicked:(id)sender;
@end
