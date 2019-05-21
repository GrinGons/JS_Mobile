var map = {};
var markers = [];
var place = [];
var globalPos;
var autocomplete;

function loadMap(){
  document.getElementById("search").focus();
  
  var latitude = document.getElementById('latitude').value;
  var longitude = document.getElementById('longitude').value;
  document.getElementById('search').value = document.getElementById('location').value;

  map = new google.maps.Map(document.getElementById('map'), {
     center: new google.maps.LatLng(latitude, longitude),
     zoom: 11
  }); 

  getLocation();
}

function getLocation() {

    if (navigator.geolocation) {

        navigator.geolocation.getCurrentPosition(showPosition);
    }
}

function showPosition(position) {
  globalPos = {
  lat: position.coords.latitude, 
  lng: position.coords.longitude
  };
  
  map.setCenter(globalPos);
}

//  display a route on the map
function calcRoute() {
  var start = document.getElementById('search').value;
  var end = document.getElementById('end').value;
  var mode = document.getElementById('mode').value;
  document.getElementById("navPaner").innerHTML = "";
  document.getElementById("navPaner").style.visibility = "visible";

  var map = new google.maps.Map(document.getElementById('map'), {
    center: new google.maps.LatLng(43.011987, -81.200276),
    zoom: 13 
  });

  var directionsDisplay = new google.maps.DirectionsRenderer({
    map: map
  });

  var request = {
    destination: end,
    origin: start,
    travelMode: mode
  };

  var directionsService = new google.maps.DirectionsService();
  directionsService.route(request, function(response, status) {
    if (status == 'OK') {

      directionsDisplay.setDirections(response);
    }
  });

  directionsDisplay.setMap(map);
  directionsDisplay.setPanel(document.getElementById('navPaner'));

  var onChangeHandler = function() {
    calculateAndDisplayRoute(directionsService, directionsDisplay);
  };
  document.getElementById('search').addEventListener('change', onChangeHandler);
  document.getElementById('end').addEventListener('change', onChangeHandler);
}

function clearRoute(){
  document.getElementById("search").value = "";
  document.getElementById("end").value = "";
  document.getElementById("navPaner").innerHTML = "";
  document.getElementById("navPaner").style.visibility = "hidden";
  deleteMarkers();
  initMap();
}

// autocomplete address       
function geolocate(id) {
  autocomplete = new google.maps.places.Autocomplete(
      (document.getElementById(id)),
      {types: ['geocode']});

  autocomplete.addListener('place_changed', fillInAddress);

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var geolocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      var circle = new google.maps.Circle({
        center: geolocation,
        radius: position.coords.accuracy
      });
      autocomplete.setBounds(circle.getBounds());
    });
  }
}


//  marker and search
function searchDestination(x) {
  var str = "";
  if(x === "search"){
    str = document.getElementById(x).value;
  }else {
    str = x.value;
  }

  deleteMarkers();

  var request = {
  location: globalPos, 
  radius: '10000',
  query: [str]
};

  var service = new google.maps.places.PlacesService(map);

  service.textSearch(request, callback);

  function callback(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      for (var i = 0; i < results.length; i++){
        addMarker(results[i]);
      }
    }
  }

  displayAllMarkers(map);
}

function addMarker(place) {
var marker = new google.maps.Marker({
  position: place.geometry.location,
  map: map,
  title: place.name + "\n" + place.formatted_address, 
  animation: google.maps.Animation.DROP
});

marker.addListener('click', function() {
  map.setZoom(16);
  map.setCenter(marker.getPosition());
});

markers.push(marker);
}

function displayAllMarkers(map) {
for (var i = 0; i < markers.length; i++) {
  markers[i].setMap(map);
}
} 

function deleteMarkers() {
displayAllMarkers(null);
markers = [];
}
