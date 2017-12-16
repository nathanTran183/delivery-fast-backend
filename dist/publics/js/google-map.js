"use strict";

$(function () {
    var myCenter = new google.maps.LatLng($("#latitude").val(), $("#longitude").val());
    var marker,
        autocomplete,
        map,
        geocoder = new google.maps.Geocoder();
    function initGoogleMap() {
        var mapProp = {
            center: myCenter,
            zoom: 16,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        map = new google.maps.Map(document.getElementById("googleMap"), mapProp);
        autocomplete = new google.maps.places.Autocomplete(document.getElementById("searchLocationText"), { types: ['geocode'] });
        marker = new google.maps.Marker({
            position: myCenter,
            map: map
        });

        google.maps.event.addListener(map, 'click', function (event) {
            placeMarker(event.latLng);
        });

        google.maps.event.addListener(autocomplete, 'place_changed', function () {
            var place = autocomplete.getPlace().geometry.location;
            $('#address').val(autocomplete.getPlace().formatted_address);
            placeMarker(place);
        });

        function placeMarker(location) {
            marker.setPosition(location);
            map.setCenter(location);
            setLocationDetails(location);
        }
    }
    google.maps.event.addDomListener(window, 'load', initGoogleMap);

    var setLocationDetails = function setLocationDetails(latLng) {
        var lat = latLng.lat();
        var lng = latLng.lng();

        $('#latitude').val(lat);
        $('#longitude').val(lng);
        if ($("#panel-update-store #resetBtn") != undefined) {
            $('#panel-update-store #saveBtn').removeAttr('disabled');
            $('#panel-update-store #resetBtn').removeAttr('disabled');
        }
    };
});

/** author: Phuc
 * config google map
 * calculate the distance between two markers
 * add html for search user
 **/
var latitude, longitude, position;

function loadManyMaps() {
    $(".googleMap").each(function () {
        latitude = $(this).find('.location').val().split(",")[0];
        longitude = $(this).find('.location').val().split(",")[1];
        var map,
            marker,
            geocoder = new google.maps.Geocoder();
        if (latitude != "" && longitude != "" && latitude != null && longitude != null) {
            position = new google.maps.LatLng(latitude, longitude);
            var mapProp = {
                center: position,
                zoom: 15,
                disableDoubleClickZoom: true,
                disableDefaultUI: true,
                draggable: false,
                scrollwheel: false,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            map = new google.maps.Map(this, mapProp);
            marker = new google.maps.Marker({
                position: position,
                title: "Store location",
                map: map
            });
        } else {
            $(this).html('<h3 class="label label-danger">No location</h3>');
        }
        google.maps.event.addDomListener($(this), 'load', loadManyMaps);
    });
}

function calcDistance(p1, p2) {
    return google.maps.geometry.spherical.computeDistanceBetween(p1, p2).toFixed(2);
}