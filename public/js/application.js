var map;
var markers = [];
var toiletIcon = 'https://i.imgur.com/8HQL2BK.png'

function closeAllWindows(){
  markers.forEach(function(marker){
   marker.info.close(map, marker);
  })
}

function initAutocomplete() {
  // Create the search box and link it to the UI element.
  var input = document.getElementById('pac-input');
  var searchBox = new google.maps.places.SearchBox(input);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  // Bias the SearchBox results towards current map's viewport.
  map.addListener('bounds_changed', function() {
    searchBox.setBounds(map.getBounds());
    });

  var markers = [];
  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener('places_changed', function(){
    var places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }
  // For each place, get the icon, name and location.
  var bounds = new google.maps.LatLngBounds();
  places.forEach(function(place) {
  if (!place.geometry) {
    console.log("Returned place contains no geometry");
    return;
  }
  // Create a marker for each place.
  markers.push(new google.maps.Marker({
    map: map,
    title: place.name,
    position: place.geometry.location
  }));

  if (place.geometry.viewport) {
  // Only geocodes have viewport.
    bounds.union(place.geometry.viewport);
  } else {
    bounds.extend(place.geometry.location);
  }
    });
    map.fitBounds(bounds);
  });
}

function initMap() {
 map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 41.881, lng: -87.623},
    zoom: 15
  });

 if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(function(position) {
    var pos = {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    };
    map.setCenter(pos);
  }, function() {
    handleLocationError(true, infoWindow, map.getCenter());
    });
  }
  initAutocomplete();
}

function showInfoWindow(){
  closeAllWindows();
  this.info.open(map, this);
}

function buildInfoWindow(marker){
  marker.info = new google.maps.InfoWindow({content: marker.address + '<br><strong>Name: </strong>' + marker.name + '<br><strong>Rank: </strong>'+ marker.ranking})
  marker.addListener('click', showInfoWindow)
}

function placeMarker(latitude, longitude, map) {
  var marker = new google.maps.Marker({
    position: {lat: latitude, lng: longitude},
    map: map,
    icon: toiletIcon
  });
  $.when(findAddress(longitude, latitude, marker)).then(function(){
    marker.addListener('click', showInfoWindow);

  var html = "<table class='name-toilet'>" + "<input type='hidden' id='address' name=address value='"+ marker.address +"'>"+
             "<tr><td>Name:</td> <td><input type='text' id='name'/> </td> </tr>" +
             "<tr><td>Ranking:</td> <td><select id='ranking'>" +
             "<option value=5 SELECTED>5</option>" +
             "<option value=4>4</option>" +
             "<option value=3>3</option>" +
             "<option value=2>2</option>" +
             "<option value=1>1</option>" +
             "</select> </td></tr>" +
             "<tr><td></td><td><input type='button' value='Save & Close' onclick='saveData()'/></td></tr>"

    marker.info = new google.maps.InfoWindow({content: html})
    closeAllWindows();
    marker.info.open(map, marker);
    })
  markers.push(marker);
}

function saveData(){
  var address = document.getElementById("address").value
  var name = document.getElementById("name").value;
  var ranking = document.getElementById("ranking").value

  $.ajax({
    url: '/bathrooms',
    method: 'put',
    data: {address: address, name: name, ranking: ranking}
  }).done(function(response){
    var marker = markers.find(function(marker){
      return marker.address === address
    })
    marker.info.close(map, marker);
  })
}

function findAddress(longitude, latitude, marker){
  var request = $.ajax({
    url: '/address',
    data: {latitude: latitude, longitude: longitude}
  })
  .done(function(response) {
    var addressObject = JSON.parse(response);
    formattedAddress = addressObject.results[0].formatted_address;
    createBathroom({latitude: latitude, longitude: longitude, address: formattedAddress, name: marker.name, ranking: marker.ranking});
    marker.address = formattedAddress
  });
  return request
}

function createBathroom(args){
  $.ajax({
    url: '/bathroom',
    method: 'POST',
    data: args
  });
}

function getMarkers(){
  $.ajax({
    url: '/bathrooms/data'
  })
  .done(function(response){
    var toilets = JSON.parse(response);
    toilets.forEach(function(toilet){
      var image = {url: 'http://i.imgur.com/sFa2YC1.png',
      size: new google.maps.Size(25, 30)
      }
      var marker = new google.maps.Marker({
        position: {lat: toilet.latitude, lng: toilet.longitude},
        map: map,
        icon: toiletIcon
      });
      marker.address = toilet.address
      marker.rank = toilet.rank
      marker.info = new google.maps.InfoWindow({content: toilet.address + '<br><strong>Name: </strong>' + toilet.name + '<br><strong>Rank: </strong>'+ toilet.ranking})
      marker.addListener('click', showInfoWindow)
      markers.push(marker);
    });
  });
}

$(document).ready(function() {
  getMarkers();
  $('.bathroom-button').on('click', function(){
     map.addListener('click', function(event){
    // Send ajax request to DB to create a bathroom object.
    var longitude = event.latLng.lng();
    var latitude = event.latLng.lat();
    placeMarker(latitude, longitude, map);
  });
  });
  $('.whatever').on('click', function() {
    $('h2').append("<h2>Being homeless, I've traversed the city. I am the free bathroom guru.</h2>")
  });
});
