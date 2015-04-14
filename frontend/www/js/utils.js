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
							"color": "#0f9a8c"
		        },
		        "Seconds": {
		          "show": false
		        }
		    }
			});	
		}
	};
});