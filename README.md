# FastPaper
[Spritz](http://www.spritzinc.com/) reader for [Pocket](https://getpocket.com/)

# Setup
1.Install dependencies
```
npm install
```
2.Install CocoaPods. (https://mixpanel.com/help/reference/ios)
```
gem install cocoapods
pod install
```
3.Init config
```
cp etc/Config.h.sample etc/Config.h
vim etc/Config.h
```

`POCKET_CONSUMER_KEY` - _REQUIRED_ http://getpocket.com/developer/
`READABILITY_TOKEN` - _REQUIRED_ https://www.readability.com/developers/api
`MIXPANEL_TOKEN` - _OPTIONAL_ http://mixpanel.com/
