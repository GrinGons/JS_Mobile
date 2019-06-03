var app = {
    initialize: function() {
        this.bindEvents();
    },
   
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
   
    onDeviceReady: function() {
        var p = document.getElementById('deviceinfo');
        p.innerHTML = device.cordova + '<br/>'+
                    device.platform + '<br/>' +
                    device.model + '<br/>' +
                    device.uuid + '<br/>' +
                    device.version + '<br/>' +
                    device.manufacturer + '<br/>' +
                    device.isVirtual + '<br/>' +
                    device.serial + '<br/>';

        app.receivedEvent('deviceready');
    },
    
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');
        console.log('Received Event: ' + id);
    },
};   
    function confirmCallback(theIndex) {
        if(theIndex==1){
            location.href='index.html#page2';
            contactInfo()
        }
        if(theIndex==2){
            alert("Whatever....");
        }
    }

    var options = ["Yes", "No"];

    function showConfirm() {
        navigator.notification.confirm(
            "Permission to access contact information",  // message
            confirmCallback,                  // callback to invoke
            "Contact Information",            // title
            options             // buttonLabels
        );
    }

    function contactInfo(contacts){
        var ul = document.getElementById('contactsinfo');
        for (var i=0; i < contacts.length; i++){
            var newLI = document.createElement('Li');
            newLI.innerHTML = contacts[i].name.formatted;
            ul.appendChild(newLI);
        }
    }
