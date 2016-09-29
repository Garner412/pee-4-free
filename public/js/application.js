var map;
function initMap() {
 map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 41.881, lng: -87.623},
    zoom: 10
  });

}

function showInfoWindow(){
  console.log(this)
  this.info.open(map, this);
}

function placeMarker(latitude, longitude, map) {
  var marker = new google.maps.Marker({
    position: {lat: latitude, lng: longitude},
    map: map
  });
  $.when(findAddress(longitude, latitude, marker)).then(function(){
    marker.info = new google.maps.InfoWindow({content: marker.address + '<br>' + marker.name})
    marker.addListener('click', showInfoWindow)
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
    createBathroom({latitude: latitude, longitude: longitude, address: formattedAddress});
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
      var marker = new google.maps.Marker({
        position: {lat: toilet.latitude, lng: toilet.longitude},
        map: map
      });
      marker.info = new google.maps.InfoWindow({content: toilet.address + '<br>' + toilet.name})
      marker.addListener('click', showInfoWindow)
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
});
