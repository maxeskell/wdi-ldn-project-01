'use strict';

/* global google:true */

$(function() {
  //jquery constants
  const $map = $('#map');
  const $lat = $('#lat');
  const $lng = $('#lng');
  const $checkboxes = $('#checkboxes');

  //set map and inforwindow to global as it is updated across several functions
  let map = null;
  let userLatLng = null;
  let infoWindow = null;
  const markers = [];
  const bounds = new google.maps.LatLngBounds();
  const dataArray = $map.data('markers');
  //only call on map API if there is a map on the page
  if ($map.length > 0) initMap();

  //initialise google map
  function initMap() {
    map = new google.maps.Map($map.get(0), {
      scrollwheel: false,
      center: {
        lat: 51.515,
        lng: -0.0723
      },
      zoom: 14
    });
    infoWindow = new google.maps.InfoWindow();
    //get user location and marker locations and scale map to show them all
    getUserLocation();
    //if the map has a data-marker then call create markers function
    if (dataArray) createMarkers(dataArray);
    //if the map has a class of new then call click event and locastion capture function
    if ($map.hasClass('new')) captureLocation();
  }

  function getUserLocation() {
    //get user location from the browser if enabled
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        userLatLng = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        //create info window to show user where they are
        infoWindow.setPosition(userLatLng);
        infoWindow.setContent('You are here.');
        infoWindow.open(map);
        //use user location and marker locations to re-scale the map
        setLocationandZoom();
      }, function() {
        handleLocationError(true, infoWindow, map.getCenter());
      });
      //if brower location is turned off then use postcode to find users location
    } else if ($map.data('markers')[0].postcode) {
      const postcode = $map.data('markers')[0].postcode;
      $.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${postcode}&key=AIzaSyBcptw5kLGKD1dAUtrC91WtQ5H48zga-_Y`)
        .done((response) => {
          const userLocation = response.results[0].geometry.location;
          userLatLng = {
            lat: userLocation.lat,
            lng: userLocation.lng
          };
          //create info window to show user where they are
          infoWindow.setPosition(userLatLng);
          infoWindow.setContent('You are here.');
          infoWindow.open(map);
          //use user location and marker locations to re-scale the map
          setLocationandZoom();
        });
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter());
    }
    // markers.push(userLatLng);
  }
  //map location error function
  function handleLocationError(browserHasGeolocation, infoWindow, userLatLng) {
    infoWindow.setPosition(userLatLng);
    infoWindow.setContent(browserHasGeolocation ?
      'Error: The Geolocation service failed.' :
      'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
  }

  //function to create markers
  function createMarkers(dataArray) {
    dataArray.forEach((location) => {
      const latLng = {
        lat: location.lat,
        lng: location.lng
      };
      const marker = new google.maps.Marker({
        position: latLng,
        map: map
      });
      //add listener to markers so that when clicjed they show an infowindow (popup)
      marker.addListener('click', () => {
        markerClick(marker, location);
      });
      //stores markers as an array so that we can re-size the map
      markers.push(marker);
    });
  }

  //add function to show info window when a marker is clicked on
  function markerClick(marker, location) {

    if (infoWindow) infoWindow.close();

    infoWindow = new google.maps.InfoWindow({
      content: `
      <div class="infoWindow">
        <h3> <a href="/wildlifePosts/${location._id}">${location.title}</a></h3>
        <img src="https://s3-eu-west-1.amazonaws.com/wildlife-log/${location.image}">
      </div>
      `
    });
    infoWindow.open(map, marker);
  }

  //using user location and marker location array re-scale the map to show them all
  function setLocationandZoom() {
    //change zoom on map to show all markers
    for (var i = 0; i < markers.length; i++) {
      bounds.extend(markers[i].getPosition());
    }
    bounds.extend(userLatLng);
    map.fitBounds(bounds);
  }

  //function to grab location value from the map when the map is clicked on (to record location for new images)
  function captureLocation() {
    const marker = new google.maps.Marker({
      map
    });
    map.addListener('click', (e) => {
      marker.setPosition(e.latLng);
      map.setCenter(e.latLng);
      const imageLatLng = e.latLng;
      $lat.val(imageLatLng.lat());
      $lng.val(imageLatLng.lng());
    });
  }

  //only call on GoogleVision api when on the create new post page
  if ($checkboxes.length > 0) googleVision();

  //call on GoogleVision API to find what is in the image
  function googleVision() {
    // Grabbing the file upload element from the form
    var $file = document.querySelector('input[type="file"]');

    // When the user chooses an image grab the file, and pass it into the base64 function
    $file.addEventListener('change', () => {
      const file = $file.files[0];
      getBase64(file); // prints the base64 string
    });

    function getBase64(file) {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function() {
        sendVisionRequest(reader.result);
      };
      reader.onerror = function(error) {
        console.log('Error: ', error);
      };
    }
    //specific request to return what is in the image (LABLE)
    function sendVisionRequest(base64String) {
      const base64 = base64String.match(/base64,(.*)$/)[1];
      const data = {
        requests: [{
          image: {
            content: base64
          },
          features: [{
            type: 'LABEL_DETECTION'
          }]
        }]
      };

      //get response from GoogleVision and push it to page in the form of checkboxes
      $.ajax({
        method: 'POST',
        url: 'https://vision.googleapis.com/v1/images:annotate?key=AIzaSyBcptw5kLGKD1dAUtrC91WtQ5H48zga-_Y',
        data: JSON.stringify(data),
        contentType: 'application/json'
      }).done((data) => {
        console.log(data);
        $checkboxes.empty();
        data.responses[0].labelAnnotations.forEach((label) => {
          $checkboxes.append(`
            <label class="checkboxes">
              <input class="form-control" type="checkbox" name="keywords[]" checked="checked" value="${label.description}"> ${label.description}
            </label>`);
        });
      });

    }
  }


});
