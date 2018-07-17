window.onload = function() {

    var startButton = document.getElementById('timerButton');
    var timeInput = document.getElementById('time');
    var blockContainer = document.getElementById('blockContainer');
    var blockLabel = document.getElementById('blockLabel');
    var unblockLabel = document.getElementById('unblockLabel');
    var switchCheckbox = document.getElementById('switchCheckbox');
    var switchContainer = document.getElementById('switchContainer');

    chrome.storage.sync.get(null, function(response) {
        var timeValue = 0;
        if (response.time && ( response.time.value != "" || response.time.value != undefined )) {
            timeValue =  response.time.value;
        }
        timeInput.value = timeValue;

        if (response.blockedWebsites) {
            chrome.tabs.getSelected(null, function(tab) {
                var tabUrl = tab.url;
                var hostname = (new URL(tabUrl)).hostname;
                isBlocked = response.blockedWebsites.value.includes(hostname);
                switchCheckbox.checked = isBlocked;
                if (isBlocked) {
                    hideElement(blockLabel);
                    showElement(unblockLabel);
                } else {
                    showElement(blockLabel);
                    hideElement(unblockLabel);
                }

                var isDisable = response.isDisable ? response.isDisable.value : false;
                if (isDisable) {
                    hideElement(startButton);
                    hideElement(blockContainer);
                } else {
                    showElement(startButton);
                    showElement(blockContainer);
                }
            });
        }
    });

    startButton.onclick = function(element) {
        var timeValue = parseInt(timeInput.value);
        if (timeValue > 0) {
            var timeObject = {'value': timeValue};
            var buttonStateObject = {'value': true};
            var startTimerObject = {'value': true};
            chrome.storage.sync.set({'time': timeObject, 'isDisable': buttonStateObject, 'startTimer': startTimerObject}, function() {
                hideElement(startButton);
                hideElement(blockContainer);
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
                    hideElement(blockLabel);
                    showElement(unblockLabel);
                } else {
                    blockedWebsites.splice(blockedWebsites.indexOf(hostname), 1);
                    hideElement(unblockLabel);
                    showElement(blockLabel);
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

    var showElement = function (elem) {
        if (elem.classList.contains('hide')) {
            elem.classList.remove('hide');
            elem.disabled = false;
        }
    };
    
    var hideElement = function (elem) {
        elem.classList.add('hide');
        elem.disabled = true;
    };
}