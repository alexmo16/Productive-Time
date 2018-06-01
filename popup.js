window.onload = function() {
    var startButton = document.getElementById('timerButton');
    var timeInput = document.getElementById('time');
    chrome.storage.sync.get('time', function(response) {
        console.log(response.time.value);
        var timeValue = 0;
        if (response.time && ( response.time.value != "" || response.time.value != undefined )) {
            timeValue =  response.time.value;
        }
        timeInput.value = timeValue;
        
        chrome.storage.sync.get('isDisable', function(response) {
            var isDisable = response.isDisable ? response.isDisable.value : false;
            startButton.disabled = isDisable;
        });
    });
//
    startButton.onclick = function(element) {
        var timeValue = timeInput.value;
        var timeObject = {'value': timeValue};
        var buttonStateObject = {'value': true};
        chrome.storage.sync.set({'time': timeObject, 'isDisable': buttonStateObject}, function() {
            startButton.disabled = true;
        });
    };
}