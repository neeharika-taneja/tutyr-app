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
			end: base + 'session_end',
			location: base + 'session/location'
		},
		reviews_for: base + "ratings_for"
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
	return {
		getSession: function(id) {
			var self = this;
			$http.get(API.session + "/" + id)
				.success(function(data, status) {
					angular.extend(self, data);
					if ( data.session_end ) {
						self.session_length = moment.duration(moment(data.session_end) - moment(data.session_start));
						self.session_cost = Math.round(self.session_length.asHours() * self.tutor_to.hourly_rate * 100, 3)/100;
					}
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

.factory('ProfileReviewsService', function($http, API){
		return {
			list: null,
			getReviews: function(id) {
				var self = this;				
				$http.get(API.reviews_for + "/" + id)
					.success(function(data, status) {
						self.list = data;
					})
					.error(function(err) {
						alert("There was an error loading reviews for this user.");
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