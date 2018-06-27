var gmapsPolygon = angular.module('gmapsPolygon', []);

function initPolygon(color, coords) {
    return new google.maps.Polygon({
        paths: coords,
        draggable: true, // turn off if it gets annoying
        editable: true,
        strokeColor: color,
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: color,
        fillOpacity: 0.35
    });
}

function initMap(mapId) {
    var mapCenter = new google.maps.LatLng(41.34009,-95.72654);
    var mapOptions = {
      zoom: 5,
      center: mapCenter,
      mapTypeId: google.maps.MapTypeId.RoadMap
    };
    var map = new google.maps.Map(document.getElementById(mapId),mapOptions);
    return map;
}

gmapsPolygon.controller("PolygonController", function PolygonController($scope) {
    $scope.colors = ["#FF0000", "#00FF00", "#0000FF", "#00FFFF", "#FFFF00", "#FF00FF"];
    $scope.colorClasses = ["color-red", "color-green", "color-blue", "color-teal", "color-yellow", "color-purple"];
    $scope.startCoords = [
        new google.maps.LatLng(43.87761,-96.10608), 
        new google.maps.LatLng(38.60883,-102.2495), 
        new google.maps.LatLng(38.54844,-87.97311)
    ];
    $scope.polygons = [initPolygon($scope.colors[0], $scope.startCoords)]; 
    $scope.map = initMap('map-canvas', $scope.polygons, $scope.colors[0], $scope.startCoords);
    $scope.getPolygonCoords = function() {
        for (var p = 0; p < $scope.polygons.length; p++) {
            var polygon = $scope.polygons[p];
            var len = polygon.getPath().getLength();
            var htmlStr = "";
            for (var i = 0; i < len; i++) {
                console.log(polygon.getPath().getAt(i).lat());
                htmlStr += "{lat: " + polygon.getPath().getAt(i).lat() + ", lng: "+  polygon.getPath().getAt(i).lng() + "},\n";
            }
            document.getElementById('info-'+p).innerHTML = htmlStr;
        }
    }
    
    for (var i = 0; i < $scope.polygons.length; i++) {
        $scope.polygons[i].setMap($scope.map);
        google.maps.event.addListener($scope.polygons[i].getPath(), "insert_at", $scope.getPolygonCoords);
        google.maps.event.addListener($scope.polygons[i].getPath(), "set_at", $scope.getPolygonCoords);
    }

    $scope.addPolygon = function() {
        var nPolygons = $scope.polygons.length;
        var newPolygon = initPolygon($scope.colors[nPolygons], $scope.startCoords)
        $scope.polygons.push(newPolygon);
        newPolygon.setMap($scope.map);
        google.maps.event.addListener(newPolygon.getPath(), "insert_at", $scope.getPolygonCoords);
        google.maps.event.addListener(newPolygon.getPath(), "set_at", $scope.getPolygonCoords);
    }
});