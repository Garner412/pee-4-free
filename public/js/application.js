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
    findAddress(longitude, latitude)
    placeMarkerAndPanTo(event.latLng, map);
  })
}

function placeMarkerAndPanTo(latLng, map) {
  var marker = new google.maps.Marker({
    position: latLng,
    map: map
  });
  map.panTo(latLng);
}

function findAddress(longitude, latitude){
  $.ajax({
    url: '/address',
    data: {latitude: latitude, longitude: longitude}
  })
  .done(function(response) {
    console.log(response)
    var addressObject = JSON.parse(response);
    var formattedAddress = addressObject.results[0].formatted_address;
    createBathroom({latitude: latitude, longitude: longitude, address: formattedAddress})
  });
}

function createBathroom(args){
  console.log(args)
};

$(document).ready(function() {
  $('button').on('click', function(){
    var marker = new google.maps.Marker({
      position: {lat: 41.888500, lng: -87.636073},
      map: map,
      title: 'DBC'
    });
  })
});
