chrome.runtime.onInstalled.addListener(function(details){
    if(details.reason == "install" || details.reason == "update"){
        var pagesToBlock = ['www.facebook.com', 'www.youtube.com', 'www.instagram.com', 'www.reddit.com', 'www.twitch.tv', 'www.twitter.com', 'www.pinterest.com', 'www.netflix.com', 'www.primevideo.com'];
        chrome.storage.sync.set({'time': {'value': 0}, 'isDisable': {'value': false}, "toAvoid": {'value' : pagesToBlock}}, function() {});
    }
});

// listener who check if the state of startTimer changed in the storage.    
chrome.storage.onChanged.addListener(function(changes, namespace) {
    for (key in changes) {
        if (key == 'startTimer') {
            var startTimer = changes[key].newValue;
            if (startTimer) {
                chrome.storage.sync.set({'startTimer': {'value': false}}, function() {
                    var currentTime = new Date();
                    chrome.storage.sync.get(['time'], function(result) {
                        chrome.alarms.create('productiveTimer', {delayInMinutes: result.time.value});
                    });                    
                });
            }
        } 
    }
});

// if timer is done, reset the UI and unlock websites.
chrome.alarms.onAlarm.addListener(function( alarm ) {
    chrome.storage.sync.set({'time': {'value': 0}, 'isDisable': {'value': false}}, function() {});
});

chrome.webNavigation.onBeforeNavigate.addListener(function(details) {
    chrome.storage.sync.get(['time', 'toAvoid'], function(result) {
        var isProductiveTimeOn = result.time.value != 0;
        if (isProductiveTimeOn) {
            var hostname = (new URL(details.url)).hostname;
            result.toAvoid.value.forEach(function(unProductiveWebsite) {
                if (hostname == unProductiveWebsite) {
                    chrome.tabs.remove(details.tabId, function(){});
                } 
            });
        }
    });
});