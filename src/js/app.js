'use strict';

/* global google:true */

$(function() {

  const $map = $('#map');
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
    //add range ring
    addCircle();
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
    } else if($map.data('markers')[0].postcode) {
      const postcode = $map.data('markers')[0].postcode;
      $.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${postcode}&key=AIzaSyBcptw5kLGKD1dAUtrC91WtQ5H48zga-_Y`)
        .done((response) => {
          console.log(response);
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

  function addCircle() {
    new google.maps.Circle({
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.35,
      map: map,
      center: userLatLng,
      radius: 2000
    });
  }

  //function to create markers
  function createMarkers(dataArray) {
    dataArray.forEach((location) => {
      const latLng = {
        lat: location.lat,
        lng: location.lon
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

    if(infoWindow) infoWindow.close();

    //add constants here

    infoWindow = new google.maps.InfoWindow({
      content: `
      <div class="infoWindow">
        <h3>${location.title}</h3>
        <img src="${location.image}">
      </div>
      `
    });
    infoWindow.open(map, marker);
  }

  //function to grab locatin value from the map
  function captureLocation() {
    const marker = new google.maps.Marker({ map });
    map.addListener('click', (e) => {
      marker.setPosition(e.latLng);
      map.setCenter(e.latLng);
    });
  }









          // Cache the window and the DOM elements
          // var $window = $(window);
          // // var $header = $('header');
          // // var $links = $('nav a');
          // var $dropdown = $('.dropdown');
          // var $menu = $('.menu');
          //
          // function updateHeader() {
          //   // Grab the height of the window (the height of the image)
          //   var viewportHeight = $window.height();
          //   // Grab the value of how far down the user has scrolled
          //   var scrollTop = $window.scrollTop();
          //
          //   // Check if we need to add or remove the 'translucent' class to the header
          //   if (scrollTop >= viewportHeight - $header.height()) {
          //     $header.addClass('translucent');
          //   } else {
          //     $header.removeClass('translucent');
          //   }
          // }

          // function toggleMenu() {
          //   // Hide the menu if it's visible, show it if it's hidden
          //   $dropdown.slideToggle();
          // }
          //
          // function displayLinks() {
          //   // If the window width is greater than or equal to 575px show the links
          //   // This is needed if the links have been hidden on a smaller screen, and then the window is resized
          //   if ($window.width() >= 575) {
          //     $dropdown.show();
          //   }
          // }

          // // Event listeners
          // // $window.on('scroll', updateHeader).trigger('scroll');
          // $window.on('resize', displayLinks);
          // // $links.on('click', scrollToSection);
          // $menu.on('click', toggleMenu);

});
