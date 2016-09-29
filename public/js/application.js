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
    marker.info = new google.maps.InfoWindow({content: "<table>" + "<input type='hidden' name=id, value="+marker.id+">"+
                 "<tr><td>Name:</td> <td><input type='text' id='name'/> </td> </tr>" +
                 "<tr><td>Ranking:</td> <td><select id='ranking'>" +
                 "<option value=5 SELECTED>5</option>" +
                 "<option value=4>4</option>" +
                 "<option value=3>3</option>" +
                 "<option value=2>2</option>" +
                 "<option value=1>1</option>" +
                 "</select> </td></tr>" +
                 "<tr><td></td><td><input type='button' value='Save & Close' onclick='saveData(marker)'/></td></tr>"})

  $.when(findAddress(longitude, latitude, marker)).then(function(){
    marker.addListener('click', showInfoWindow);
  })
    marker.info.open(map, marker);

}
function saveData(id){
  console.log(id)
  // marker.name = document.getElementById("name").value;
  // marker.ranking = document.getElementById("ranking").value;
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
