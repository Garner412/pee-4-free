var map;
function initMap() {
 map = new google.maps.Map(document.getElementById('map'), {
  center: {lat: 41.881, lng: -87.623},
  zoom: 10
});
}

$(document).ready(function() {
  $('button').on('click', function(){
    var marker = new google.maps.Marker({
      position: {lat: 41.888500, lng: -87.636073},
      map: map,
      title: 'DBC'
    });
  })
});
