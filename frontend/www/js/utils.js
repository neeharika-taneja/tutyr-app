angular.module('starter.utils', [])

.directive('timer', function($compile){
	/**
	 * AngularJS directive wrapper for the TimeCircles jQuery plugin.
	 * @param {String} start Takes a date string yyyy-mm-dd hh:mm:ss.
	 * @returns Renders a TimeCircles instance.
	 */
	
	return {
		terminal: true,
		priority: 1000,
		link: function(scope, element, attrs) {
			$(element).attr('data-date', scope.$eval(attrs.start));
			$(element).TimeCircles({
		    "animation": "smooth",
		    "bg_width": 1.2,
		    "fg_width": 0.025,
		    "time": {
		        "Days": {
		          "show": false
		        },
		        "Hours": {
		          "show": true
		        },
		        "Minutes": {
		          "show": true,
							"color": "#00B197"
		        },
		        "Seconds": {
		          "show": false
		        }
		    }
			});	
		}
	};
})

.directive('reverseGeocode', function () {
  return {
      restrict: 'E',
      template: '<div></div>',
      link: function (scope, element, attrs) {
          var geocoder = new google.maps.Geocoder();
          var latlng = new google.maps.LatLng(attrs.lat, attrs.lng);
          geocoder.geocode({ 'latLng': latlng }, function (results, status) {
              if (status == google.maps.GeocoderStatus.OK) {
                  if (results[1]) {
                      element.text(results[1].address_components[1].long_name);
                  } else {
                      element.text('Location not found');
                  }
              } else {
                  // element.text('Geocoder failed due to: ' + status);
									element.text('Location not given');
              }
          });
      },
      replace: true
  }
});
