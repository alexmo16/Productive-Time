window.onload = function() {
    var startButton = document.getElementById('timerButton');
    var timeInput = document.getElementById('time');
    chrome.storage.sync.get(null, function(response) {
        
        if (response.time && response.isDisable) {
            console.log(response.time.value);
            console.log(response.isDisable.value);
        }

        var timeValue = 0;
        if (response.time && ( response.time.value != "" || response.time.value != undefined )) {
            timeValue =  response.time.value;
        }
        timeInput.value = timeValue;
        
        var isDisable = response.isDisable ? response.isDisable.value : false;
        startButton.disabled = isDisable;
    });

    startButton.onclick = function(element) {
        var timeValue = parseInt(timeInput.value);
        var timeObject = {'value': timeValue};
        var buttonStateObject = {'value': true};
        var startTimerObject = {'value': true};
        chrome.storage.sync.set({'time': timeObject, 'isDisable': buttonStateObject, 'startTimer': startTimerObject}, function() {
            startButton.disabled = true;
        });
    };
}