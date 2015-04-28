angular.module('starter.services', [])

.factory('API', function() {
	var base = "http://tutyr.herokuapp.com/api/";
	// var base = "http://localhost:8000/api/";
	return {
		login: base + "account/register", // POST login
		tutor_mode: base + "account/tutor_mode", // POST toggle
		profile: base + "account/profile", // POST edit profile | GET account/profile/:id
		feed: base + "feed", // GET newsfeed
		location: base + "account/location", // POST update location
		session: base + "session", // POST new session | GET session/:id
 		rating: base + "rate", // POST rate a user 
		subjects: base + "subjects",
		requests: base + "sessions_for",
		status: {
			status: base + 'session_status',
			start: base + 'session_start',
			end: base + 'session_end'
		}
	};
	
})

.factory('TutorRequestService', function(API, $http, $ionicLoading){
	
	return {		
		requests: null,
		getRequest: function(id) {
			$ionicLoading.show();
			var self = this;
			$http.get(API.requests + "/" + facebook_id)
				.success(function(data, status) {
					self.requests = data;
					$ionicLoading.hide();					
				})
				.error(function(err) {
					$ionicLoading.hide();					
					alert(err);
				});
		}
	}
})

.factory('TutorSessionService', function($rootScope, $http, API) {
	var sessions = {
		1: {
			from: 'Bob',
			comments: 'I want help understanding mitochondria',
			profile_pic: 'img/test-person.jpg',
			status: 0,
			request_time: '2015-04-07T19:43:37-0500',
			requestid: 1
		},
		2: {
			from: 'Mary',
			comments: "Need help with my HCI project",
			profile_pic: 'img/test-person.jpg',
			status: 0,
			request_time: '2015-04-07T19:43:37-0500',
			requestid: 2
		}
	};
	
	return {
		sessions: sessions,
		getSession: function(id) {
			var self = this;
			$http.get(API.session + "/" + id)
				.success(function(data, status) {
					angular.extend(self, data);
				})
				.error(function(error) {
					$rootScope.$broadcast('Loading.error', {error: error});
				})
		}
	}
})

.factory('ProfileService', function($http, API, $ionicLoading){
		return {
			getProfile: function(id) {
				var self = this;				
				$ionicLoading.show();
				$http.get(API.profile + "/" + id)
					.success(function(data, status) {
						$ionicLoading.hide();
						angular.extend(self, data);
					})
					.error(function(err) {
						$ionicLoading.hide();
					})
			}
		}
})

.factory('SubjectService', function($http, API) {
	return {
		getSubjects: function() {
			var self = this;
			$http.get(API.subjects)
				.success(function(data, status){
					self.list = data;
				})
				.error(function(err){
					return;
				})
		},
		list: null
	};
});