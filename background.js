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
    chrome.storage.sync.get(['time'], function(result) {
        var isProductiveTimeOn = result.time.value != 0;

        if (isProductiveTimeOn && details.url.includes('facebook')) {
            chrome.tabs.remove(details.tabId, function(){});
        }
    });
});