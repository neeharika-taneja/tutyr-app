angular.module('starter.services', [])
.factory('TutorRequestService', function(){
	var requests = {
		1: {
			from: 'Bob',
			comments: 'I want help understanding mitochondria',
			profileimage: 'img/test-person.jpg',
			status: 0,
			request_time: '2015-04-07T19:43:37-0500',
			requestid: 1
		},
		2: {
			from: 'Mary',
			comments: "Need help with my HCI project",
			profileimage: 'img/test-person.jpg',
			status: 0,
			request_time: '2015-04-07T19:43:37-0500',
			requestid: 2
		}
	};
	
	return {
		requests: requests,
		getRequest: function(id) {
			return requests[id];
		}
	}
});