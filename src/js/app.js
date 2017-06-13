'use strict';

/* global google:true */

$(function() {

  const $map = $('#map');
  const $lat = $('#lat');
  const $lng = $('#lng');
  const $checkboxes = $('#checkboxes');

  //set map and inforwindow to global as it is updated across several functions
  let map = null;
  let userLatLng = null;
  let infoWindow = null;
  //only call on map API if there is a map on the page
  if ($map.length > 0) initMap();

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
    //get user location and re-center map
    getUserLocation();
    //if the map has a data-marker then call create markers function
    const dataArray = $map.data('markers');
    if (dataArray) createMarkers(dataArray);
    //if the map has a class of new then call click event and locastion capture function
    if ($map.hasClass('new')) captureLocation();
  }

  function getUserLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        userLatLng = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        infoWindow.setPosition(userLatLng);
        infoWindow.setContent('You are here.');
        infoWindow.open(map);
        map.setCenter(userLatLng);
      }, function() {
        handleLocationError(true, infoWindow, map.getCenter());
      });
    } else if ($map.data('markers')[0].postcode) {
      const postcode = $map.data('markers')[0].postcode;
      $.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${postcode}&key=AIzaSyBcptw5kLGKD1dAUtrC91WtQ5H48zga-_Y`)
        .done((response) => {
          const userLocation = response.results[0].geometry.location;
          userLatLng = {
            lat: userLocation.lat,
            lng: userLocation.lng
          };
        });
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter());
    }
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

      marker.addListener('click', () => {
        markerClick(marker, location);
      });
    });
  }

  //add function to show info window when a marker is clicked on
  function markerClick(marker, location) {

    if (infoWindow) infoWindow.close();
    console.log(location);

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

  //function to grab location value from the map
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

  if ($checkboxes.length > 0) googleVision();

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

      $.ajax({
        method: 'POST',
        url: 'https://vision.googleapis.com/v1/images:annotate?key=AIzaSyBcptw5kLGKD1dAUtrC91WtQ5H48zga-_Y',
        data: JSON.stringify(data),
        contentType: 'application/json'
      }).done((data) => {
        console.log(data);
        data.responses[0].labelAnnotations.forEach((label) => {
          $checkboxes.append(`<input class="form-control" type="checkbox" name="keywords[]" checked="checked" value="${label.description}"> ${label.description}`);
        });
      });

    }
  }




});
