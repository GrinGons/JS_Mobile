
function dialog(){
    navigator.notification.prompt('Enter your location name and description', onPrompt, 'location and description', ['ok', 'cancel'], 'fanshawe, studying there');

    navigator.geolocation.getCurrentPosition(success, error);
}

function onPrompt(e){
    var result = e.input1;
    result = result.split(",");
    document.getElementById("location").value = result[0];
    document.getElementById("description").value = result[1];
}

function success(position){
    var lat = position.coords.latitude;
    var long = position.coords.longitude;

    document.getElementById('latitude').value = lat;
    document.getElementById('longitude').value = long;
}

function error(e){
    alert(e.message);
} 

var app = {
    initFirebase: function() {
        this.bindEvents();
    }, 

    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        app.receivedEvent('deviceReady');

        $('input[type=radio][name=radio-choice-color]').change(function() {
            listExamples.watchUsersWithFavouriteColor(this.value);
        });

        firebase.auth().onAuthStateChanged(function(user) {

            if (user) {

                console.log(JSON.stringify(user));
                var email = user.email;
                var userId = user.uid;

                console.log('User ID is ' + userId);
                appAuth.displayUser(userId, email);

                readExamples.loadCurrentUser(userId);
                readExamples.watchCurrentUser(userId);

            } else {
                appAuth.displayUser('', '');
            }

        });

    },

    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    receivedEvent: function(id) {

    },

    loginUser: function() {
        appAuth.displayUser('', '');

        var email = "test@test.com"; // please put firebase id info.
        var password = "test123"; // please put firebase password info.

        appAuth.loginUser(email, password);
    },

    logoutUser: function() {
      appAuth.logoutUser();
    },

    setUserName: function() {
        writeExamples.displayStatusMessage('');

        var location = document.getElementById('location').value;
        var description = document.getElementById('description').value;
        var latitude = document.getElementById('latitude').value;
        var longitude = document.getElementById('longitude').value;

        writeExamples.setUserName(location, description, latitude, longitude);
    },
};

var appAuth = {
    loginUser: function(email, password) {

        if (!email || !password) {
            appAuth.displayAuthError('Invalid email/password');
        } else {
            firebase.auth().signInWithEmailAndPassword(email, password)
                .catch(function (error) {
                    var errorCode = error.code;
                    var errorMessage = error.message;

                    console.error('Received error: ' + errorCode);
                    appAuth.displayAuthError(errorMessage);
                });
        }
    },

    logoutUser: function() {
        firebase.auth().signOut();
    },

    displayUser: function(id, email) {
        document.getElementById('authUserId').value = id;
        document.getElementById('authEmail').value = email;
    },

    getCurrentUser: function() {
        return firebase.auth().currentUser.uid;
    },

    displayAuthError: function(error) {
        console.error(error);
        document.getElementById('authError').innerText = error;
    }
};

var readExamples = {
    

    loadCurrentUser: function(userId) {

        firebase.database().ref('FaceTac_Group 31/' + userId)
            .once('value', function(snapshot) {

                console.log('I got user: ' + snapshot.key);
                console.log(JSON.stringify(snapshot.val()));

                var userId = snapshot.key;
                var location= snapshot.val().location;
                var description = snapshot.val().description;
                var latitude= snapshot.val().latitude;
                var longitude = snapshot.val().longitude;

                readExamples.displayUserOnce(userId, location, description, latitude, longitude);

            });

    },

    watchCurrentUser: function(userId) {

        firebase.database().ref('FaceTac_Group 31/' + userId)
            .on('value', function(snapshot) {

                console.log('I got user: ' + snapshot.key);
                console.log(JSON.stringify(snapshot.val()));

                var userId = snapshot.key;
                var location= snapshot.val().location;
                var description = snapshot.val().description;
                var latitude= snapshot.val().latitude;
                var longitude = snapshot.val().longitude;

                readExamples.displayUserOn(userId, location, description, latitude, longitude);

            });
    },

    displayUserOn: function(id, location, description, latitude, longitude) {
        document.getElementById('userIdOn').innerHTML = id;
        document.getElementById('locationOn').innerHTML = location;
        document.getElementById('descriptionOn').innerHTML = description;
        document.getElementById('latitudeOn').innerHTML = latitude;
        document.getElementById('longitudeOn').innerHTML = longitude;
    },

    displayStatusMessage: function(message) {
        document.getElementById('readStatusMessage').innerText = message;
    }
};

var writeExamples = {

    setUserName: function(location, description, latitude, longitude) {

        var userId = appAuth.getCurrentUser();
        var data = {
          location: location,
          description: description,
          latitude: latitude, 
          longitude: longitude
        };

        firebase.database().ref('FaceTac_Group 31/' + userId)
            .set(data)
            .then(function(err) {

                if (err) {
                    console.error(err);
                    writeExamples.displayStatusMessage(err);
                } else {
                    console.log('I wrote stuff!!');
                    writeExamples.displayStatusMessage('I wrote stuff!!!');
                }

            });


        var member = {
          Developer_1: 'Jaechil Kwon',
          Developer_2: 'Rishabh Chopra',
          Designer_1: 'Kunho Lee', 
          Designer_2: 'Joon Kim'
        };

        firebase.database().ref('Team Members/' + userId)
            .set(member)
            .then(function(err) {

                if (err) {
                    console.error(err);
                    writeExamples.displayStatusMessage(err);
                } else {
                    console.log('I wrote stuff!!');
                    writeExamples.displayStatusMessage('I wrote stuff!!!');
                }

            });
    },

    displayStatusMessage: function(message) {
        document.getElementById('writeStatusMessage').innerText = message;
    }

};

function User(userId, location, description, latitude, longitude) {
    this.userId = userId;
    this.location = location;
    this.description = description;
    this.latitude = latitude;
    this.longitude = longitude;

}
User.fromSnapshot = function(snapshot) {
    return new User(
        snapshot.key,
        snapshot.val().location,
        snapshot.val().description,
        snapshot.val().latitude,
        snapshot.val().longitude
    );
};
