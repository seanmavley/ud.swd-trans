angular.module('trans')
  .controller('HomeController', ['$scope', 'TrainService',
    function($scope, TrainService) {

      $scope.stops = [];

      TrainService
        .then(function(data) {
          console.log('Data loaded');
          console.log(data.data)
          $scope.trainData = data.data;
          // Taken from:
          // https://github.com/woahitsraj/Caltrain/blob/master/client/dev/js/mainController.js
          $.each(data.data.stops, function(i, el) {
            var flag = true;
            $.each($scope.stops, function(index, val) {
              if (val.parent_station === el.parent_station || val.stop_name === el.stop_name) {
                flag = false;
              }
            });
            if (flag) {
              $scope.stops.push(el);
            }
          });
        })
        .catch(function(error) {
          console.log(error);
        })

      //Taken from https://github.com/yhagio/offline-caltrain/blob/master/src/js/application.js
      function hhmmssToSeconds(time) {
        var t = time.split(':');
        var hour = parseInt(t[0]);
        var minute = parseInt(t[1]);
        var second = parseInt(t[2]);

        return hour * 60 * 60 + minute * 60 + second;
      }

      //Taken from https://github.com/yhagio/offline-caltrain/blob/master/src/js/application.js
      function getDuration(departure_time, arrival_time) {
        var dSec = hhmmssToSeconds(departure_time);
        var aSec = hhmmssToSeconds(arrival_time);
        var duration = (aSec - dSec) / 60;

        return duration.toString() + ' min';
      }

      // Taken from:
      // https://github.com/woahitsraj/Caltrain/blob/master/client/dev/js/mainController.js#L53
      $scope.getTrips = function() {
        $scope.submitted = true;
        console.log($scope.departure, $scope.arrival);
        $scope.trips = [];
        var departureStops = [];
        var arrivalStops = [];
        for (var i = 0; i < $scope.trainData.stopTimes.length; i++) {
          if (parseInt($scope.trainData.stopTimes[i].stop_id) === parseInt($scope.departure.stop_id) ||
            parseInt($scope.trainData.stopTimes[i].stop_id) === (parseInt($scope.departure.stop_id) + 1)) {
            departureStops.push($scope.trainData.stopTimes[i]);
          }
          if (parseInt($scope.trainData.stopTimes[i].stop_id) === parseInt($scope.arrival.stop_id) ||
            parseInt($scope.trainData.stopTimes[i].stop_id) === (parseInt($scope.arrival.stop_id) + 1)) {
            arrivalStops.push($scope.trainData.stopTimes[i]);
          }
        }
        for (var k = 0; k < departureStops.length; k++) {
          for (var j = 0; j < arrivalStops.length; j++) {
            if (departureStops[k].trip_id === arrivalStops[j].trip_id &&
              parseInt(departureStops[k].stop_sequence) < parseInt(arrivalStops[j].stop_sequence)) {
              var departure = departureStops[k];
              var arrival = arrivalStops[j];
              var departureTime = departure.departure_time;
              var arrivalTime = arrival.arrival_time;
              var tripId = departure.trip_id;
              var routeId = $scope.trainData.trips[tripId].route_id;
              var serviceId = $scope.trainData.trips[tripId].service_id;
              var serviceType = '';
              if (serviceId.includes('Weekday')) {
                serviceType = 'Weekday';
              } else if (serviceId.includes('Sunday')) {
                serviceType = 'Sunday';
              } else if (serviceId.includes('Saturday')) {
                serviceType = 'Saturday';
              }
              var routeName = $scope.trainData.routes[routeId].route_long_name;
              var tripTime = getDuration(departureTime, arrivalTime);
              $scope.trips.push({
                serviceType: serviceType,
                routeName: routeName,
                departureTime: departureTime,
                arrivalTime: arrivalTime,
                tripTime: tripTime
              });
            }
          }
        }
        // console.log($scope.trips);
      }
    }
  ])
