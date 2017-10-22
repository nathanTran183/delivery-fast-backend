$(function(){
    var myCenter = new google.maps.LatLng($("#latitude").val(), $("#longitude").val());
    var marker, map, geocoder = new google.maps.Geocoder();
    google.maps.event.addDomListener(window, 'load', initGoogleMap);
    function initGoogleMap()
    {
        var mapProp = {
            center: myCenter,
            zoom: 14,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        map = new google.maps.Map(document.getElementById("googleMap"), mapProp);

        marker = new google.maps.Marker({
            position: myCenter,
            map: map
        });
        google.maps.event.addListener(map, 'click', function (event) {
            placeMarker(event.latLng);
        });
        function placeMarker(location) {
            marker.setPosition(location);
            map.setCenter(location);
            setLocationDetails(location);
        }
    }

    var setLocationDetails = function (latLng) {
        var lat = latLng.lat();
        var lng = latLng.lng();

        $('#latitude').val(lat);
        $('#longitude').val(lng);
    };

    $('#searchLocationButton').click(function (evt) {
        evt.preventDefault();
        var addr = $.trim($('#searchLocationText').val());
        if (addr) {
            geocoder.geocode({address: addr, region: 'sg'}, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    marker.setPosition(results[0].geometry.location);
                    map.setCenter(results[0].geometry.location);
                    setLocationDetails(results[0].geometry.location);
                }
            });
        }
    });

    $("#hasTargetLocation").click(function () {
        if (this.checked) {
            $("#targettingLocation-box").show();
            initGoogleMap();
        } else {
            $("#targettingLocation-box").hide();
        }
    });

    $("#singleLocation").click(function () {
        if (this.checked) {
            $("#target-location-maps-box").show();
            initGoogleMap();
            $("#target-location-box").hide();
        }
    });

    /**
     * author: Quang
     **/
     google.maps.event.addDomListener(window, 'load', initGoogleMapMulti);
     function initGoogleMapMulti()
     {
       var center = new google.maps.LatLng($("#latitudes0").val(), $("#longitudes0").val());
       var mapProp = {
           center: center,
           zoom: 15,
           mapTypeId: google.maps.MapTypeId.ROADMAP
       };

       map = new google.maps.Map(document.getElementById("googleMapMulti"), mapProp);

       var numLocations = $("#numLocations").val();
       for (var i = 0; i < numLocations; i++) {
           var position = new google.maps.LatLng($("#latitudes"+i).val(), $("#longitudes"+i).val());

           var marker = new google.maps.Marker({
               position: position,
               map: map
           });
       }
   }     
});

/** author: Phuc
 * config google map
 * calculate the distance between two markers
 * add html for search user
 **/
 var latitudeSubmit, longitudeSubmit, latitudeTask, longitudeTask, position1 , position2;
 function loadManyMaps()
 {    
    $(".googleMap").each(function(){
        latitudeSubmit = $(this).find('.submittedLocation').val().split(",")[0];
        longitudeSubmit = $(this).find('.submittedLocation').val().split(",")[1];
        latitudeTask = $(this).find('.taskLocation').val().split(",")[0];
        longitudeTask = $(this).find('.taskLocation').val().split(",")[1];
        var map, geocoder = new google.maps.Geocoder();
        if(latitudeSubmit!="" && longitudeSubmit!=""){
            position1 = new google.maps.LatLng(latitudeSubmit, longitudeSubmit);            
            var mapProp = {
                center: position1,
                zoom: 15,
                disableDoubleClickZoom: true,
                disableDefaultUI: true,
                draggable: false,
                scrollwheel: false,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            map = new google.maps.Map(this, mapProp); 
            markerSubmit = new google.maps.Marker({
                position: position1,
                title: "Response location",
                map: map
            });
            if(latitudeTask != "" && longitudeTask != ""){
                position2 = new google.maps.LatLng(latitudeTask, longitudeTask);
                markerTask = new google.maps.Marker({
                    position: position2,
                    title: "Task location",
                    map: map
                });
                $(this).parent().find(".distance").html("Distance: " + calcDistance(position1, position2) + " (m)");
            } else {
                $(this).parent().find(".distance").html('<h3 class="label label-danger">No distance! Task has no location</h3>');  
            }
        }
        else{
            $(this).parent().find(".distance").html('<h3 class="label label-danger">No distance! Response has no location</h3>');
        }
        google.maps.event.addDomListener($(this), 'load', loadManyMaps);
    });
}
function calcDistance(p1, p2) {
    return (google.maps.geometry.spherical.computeDistanceBetween(p1, p2)).toFixed(2);
}


