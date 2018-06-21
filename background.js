chrome.runtime.onInstalled.addListener(function(details){
    if(details.reason == "install" || details.reason == "update"){
        var pagesToBlock = ['facebook', 'youtube', 'instagram', 'reddit', 'twitch', 'twitter', 'pinterest', 'netflix', 'primevideo'];
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

// if timer is done, reset the UI and unlock social medias.
chrome.alarms.onAlarm.addListener(function( alarm ) {
    chrome.storage.sync.set({'time': {'value': 0}, 'isDisable': {'value': false}}, function() {});
});

chrome.webNavigation.onBeforeNavigate.addListener(function(details) {
    chrome.storage.sync.get(['time', 'toAvoid'], function(result) {
        var isProductiveTimeOn = result.time.value != 0;
        if (isProductiveTimeOn) {
            var hostname = (new URL(details.url)).hostname;
            result.toAvoid.value.forEach(function(site) {
                if (hostname.includes(site)) {
                    chrome.tabs.remove(details.tabId, function(){});
                } 
            });
        }
    });
});