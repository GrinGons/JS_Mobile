let cont = {

    init: function(){
        document.getElementById("btnContact").addEventListener("click", cont.listContacts);
        document.getElementById('btnNew').addEventListener('click', cont.showNew);
        document.getElementById('btnSave').addEventListener('click', cont.saveContact);
        document.getElementById('btnFind').addEventListener('click', cont.showDelete);
        document.getElementById('btnSearch').addEventListener('click', cont.findContact);
    },

    listContacts: function(){
        var options = new ContactFindOptions();
        options.filter = "";
        options.multiple = true;
        var fields = ["*"];
        navigator.contacts.find(fields, cont.onSuccess, cont.onError, options);
    },

    onSuccess: function(contacts){
        document.getElementById("contactList").style.display = "block";
        document.getElementById("newContact").style.display = "none";
        document.getElementById("searchFrom").style.display = "none";

        document.getElementById("contactList").innerHTML = "";
        var ul = document.getElementById("contactList");
        for(var i=0; i<contacts.length; i++){
            var newLI = document.createElement('li');
            newLI.innerHTML = contacts[i].name.formatted;
            ul.appendChild(newLI);
        }
    },

    onError: function(){
        alert("Some error");
    },

    showNew: function(){
        document.getElementById("contactList").style.display = "none";
        document.getElementById("newContact").style.display = "block";
        document.getElementById("searchFrom").style.display = "none";
    },


    saveContact: function(){
        
        // create a new contact object
        var contact = navigator.contacts.create();
        contact.displayName = document.getElementById("first").value;
        contact.nickname = document.getElementById("last").value;            // specify both to support all devices

        // populate some fields
        var name = new ContactName();
        name.givenName = document.getElementById("first").value;
        name.familyName = document.getElementById("last").value;
        contact.name = name;

        // save to device
        contact.save(cont.successCB, cont.failCB); 
    },

    successCB: function(contact) {
        alert("Save Success");
    },

    failCB: function(contactError) {
        alert("Error = " + contactError.code);
    },

    showDelete: function(){
        document.getElementById("contactList").style.display = "none";
        document.getElementById("newContact").style.display = "none";
        document.getElementById("searchFrom").style.display = "block";
    },

    findContact: function(){
        // find all contacts
        var options = new ContactFindOptions();
        options.filter = "";
        options.multiple = true;
        var fields = ["*"];
        navigator.contacts.find(fields, cont.findSuccess, cont.findError, options);

    },

    findSuccess: function(contacts) {
        for (var i = 0; i < contacts.length; i++) {
            var sName = document.getElementById("searchName").value;
            var string = contacts[i].name.formatted
            var txt = "";
            if(string.indexOf(sName) != -1){
                alert(contacts[i].name.formatted);
            }else{
                txt = "Could not find the information you entered";
            }
        }
        if(txt !== ""){
            alert(txt);
        }
    },

    findError: function(contactError) {
        alert('onError!');
    }
        
}

document.addEventListener('deviceready', cont.init);
