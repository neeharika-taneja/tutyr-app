angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $http, API) {
	$scope.genFBUser = function() {
		// Grab the user
	  openFB.api({
	    path: '/me',
	    params: {fields: 'id,name,email'},
	    success: function(user) {
				// When the backend goes live, something like
				// send FB ID to backend 
				// if the ID is already associated with an account, send back info and stick in fbUser
				// otherwise, do the same but also send back a 'new account' message
	      $scope.$apply(function() {
	        $scope.fbUser = {
	        	loggedIn: true,
						realname: user.name,
						email: user.email,
						fbID: user.id,
						profileimage: "http://graph.facebook.com/" + user.id + "/picture?width=512&height=512",
						tutor: false
	        };
	      });
				
				// request to backend 
				$scope.login($scope.fbUser, true);								
	    },
	    error: function(error) {
	      alert('Facebook error: ' + error.error_description);
	    }
	  });		
	}
	
	$scope.login = function(fbUser, debug) {
		if ( !debug ) {
			$http.post(API.login, fbUser)
			.success(function(data, status) {
				$scope.currentUser = data;
				$scope.currentUser.loggedIn = true;
			})
			.error(function(data, status) {
				alert("There was an error logging you in");
			});			
		} else {
			$scope.fakeLogin();
		}	
	}

	$scope.fakeLogin = function() {
		$scope.currentUser.loggedIn = true;
		$scope.fbUser = $scope.currentUser;
	}

	$scope.currentUser = {
		loggedIn: false,
		realname: 'Andrea Smith',
		email: 'test.person@example.com',
		profileimage: 'img/test-person.jpg',
		tutor: true
	};
	
	$scope.fbLogin = function() {
    openFB.login(
			function(response) {
				if (response.status === 'connected') {
				    console.log('Facebook login succeeded');
						$scope.genFBUser();
				} else {
				    alert('Facebook login failed');
				}
			},
			{scope: 'public_profile,email'}
		);
	}

})

.controller('AboutController', function($scope) {
	$scope.emailFeedback = function() {		
		var link = "mailto:tutyrapp@gmail.com?subject=Tutyr";
		window.location = link;
	}	
})

.controller('HomeScreenController', function($scope){
	$scope.mockNewsfeed = {
		profiles: [
			{
				realname: 'Firstname Lastname',
				profileimage: 'test-person.jpg',
				bio1: 'Hi, I am a piece of testing data.',
				rating: 4,
				customlocation: 'Carnegie Mellon University',
				id: 1
			},
			{
				realname: 'Firstname Lastname',
				profileimage: 'test-person.jpg',
				bio1: 'Hi, I am a piece of testing data.',
				rating: 4,
				customlocation: 'Carnegie Mellon University',
				id: 2
			},
			{
				realname: 'Firstname Lastname',
				profileimage: 'test-person.jpg',
				bio1: 'Hi, I am a piece of testing data.',
				rating: 4,
				customlocation: 'Carnegie Mellon University',
				id: 3
			},
			{
				realname: 'Firstname Lastname',
				profileimage: 'test-person.jpg',
				bio1: 'Hi, I am a piece of testing data.',
				rating: 4,
				customlocation: 'Carnegie Mellon University',
				id: 4
			}
		],
		subjectlist: [
			{
				subjectname: 'English',
				subjectid: 1
			},
			{
				subjectname: 'Math',
				subjectid: 2
			},
			{
				subjectname: 'History',
				subjectid: 3
			},
			{
				subjectname: 'Computer Science',
				subjectid: 4
			},
			{
				subjectname: 'Design',
				subjectid: 5
			}
		]
	};
})

.controller('ViewProfileController', function($scope, ProfileObject) {
	$scope.profile = ProfileObject;
})

.controller('TutorRequestsController', function($scope, $ionicModal, TutorRequestService) {
	$scope.requests = TutorRequestService.requests;
	$scope.nRequests = {
		total: Object.keys($scope.requests).length
	};

	$scope.decline = function(requestid) {
		alert("You declined request #" + requestid);
	}
})

.controller('TutorRequestController', function($scope, TutorRequest) {
	$scope.request = TutorRequest;
});