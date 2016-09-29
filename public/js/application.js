var map;
function initMap() {
 map = new google.maps.Map(document.getElementById('map'), {
  center: {lat: 41.881, lng: -87.623},
  zoom: 10
});
 map.addListener('click', function(event){
    // Send ajax request to DB to create a bathroom object.
    var longitude = event.latLng.lng();
    var latitude = event.latLng.lat();
    findAddress(longitude, latitude);
    placeMarkerAndPanTo(event.latLng, map);
  });
}

function showInfoWindow(){
  this.info.open(map, this);
  console.log(this);
}

function placeMarkerAndPanTo(latLng, map) {
  var marker = new google.maps.Marker({
    position: latLng,
    map: map
  });
  marker.addListener('click', showInfoWindow)
  map.panTo(latLng);
}

function findAddress(longitude, latitude){
  $.ajax({
    url: '/address',
    data: {latitude: latitude, longitude: longitude}
  })
  .done(function(response) {
    var addressObject = JSON.parse(response);
    var formattedAddress = addressObject.results[0].formatted_address;
    createBathroom({latitude: latitude, longitude: longitude, address: formattedAddress});
  });
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
      var marker = new google.maps.Marker({
        position: {lat: toilet.latitude, lng: toilet.longitude},
        map: map
      });
      marker.info = new google.maps.InfoWindow({content: 'woohoo'})
      marker.addListener('click', showInfoWindow)
    });
  });
}

$(document).ready(function() {
  getMarkers();
  $('button').on('click', function(){
  });
});
