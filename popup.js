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
        if (timeValue > 0) {
            var timeObject = {'value': timeValue};
            var buttonStateObject = {'value': true};
            var startTimerObject = {'value': true};
            chrome.storage.sync.set({'time': timeObject, 'isDisable': buttonStateObject, 'startTimer': startTimerObject}, function() {
                hide(startButton);
                hide(blockContainer);
            });
        }
    };

    switchContainer.onclick = function(element) {
        chrome.storage.sync.get('blockedWebsites', function(response) {
            var blockedWebsites = response.blockedWebsites.value;
            chrome.tabs.getSelected(null, function(tab) {
                var tabUrl = tab.url;
                var hostname = (new URL(tabUrl)).hostname;
                if (switchCheckbox.checked && blockedWebsites.indexOf(hostname) == -1) {
                    blockedWebsites.push(hostname);
                } else {
                    blockedWebsites.pop(hostname);
                }
                chrome.storage.sync.set({'blockedWebsites': {'value' : blockedWebsites}}, function() {});
            });     
        });
    };

    timeInput.addEventListener("keyup", function(event) {
        // Cancel the default action, if needed
        event.preventDefault();
        // Number 13 is the "Enter" key on the keyboard
        if (event.keyCode === 13) {
            startButton.click();
        }
    });
    
    var show = function (elem) {
        if (elem.classList.contains('hide')) {
            elem.classList.remove('hide');
            elem.disabled = false;
        }
    };

    var hide = function (elem) {
        elem.classList.add('hide');
        elem.disabled = true;
    };
}