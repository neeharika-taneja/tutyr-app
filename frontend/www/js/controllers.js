angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $http, API, $state, $ionicViewService) {
	$scope.fbLogin = function() {
		/**
			Handle communication with the openFB library to authenticate user using
			the Facebook API.
		 */
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
	
	$scope.genFBUser = function() {
		/**
			Get user information from Facebook once authentication succeeds.
		 */
		
		// Request name, email, ID, profile image
	  openFB.api({
	    path: '/me',
	    params: {fields: 'id,name,email'},
	    success: function(user) {
	      $scope.$apply(function() {
	        $scope.fbUser = {
	        	loggedIn: false,
						realname: user.name,
						email: user.email,
						fbID: user.id,
						profileimage: "http://graph.facebook.com/" + user.id + "/picture?width=512&height=512",
						tutor: false
	        };
	      });
				
				// Send this information to the Tutyr backend
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
			$scope.currentUser = $scope.fbUser;
			$scope.$apply(function() {
				$scope.currentUser.loggedIn = true;
			});
		}	
	}

	$scope.logout = function() {
		if ( $scope.currentUser.loggedIn == true ) {
			$scope.currentUser.loggedIn = false;
			$scope.fbUser = {};
			$ionicViewService.nextViewOptions({
				disableBack: true
			});
			$state.go('app.intro');
		} else {
			alert("You attempted to log out, but you're not logged in.");
		}
	}

	$scope.fakeLogin = function() {
		$scope.currentUser.loggedIn = true;
	}

	$scope.currentUser = {
		loggedIn: false,
		realname: 'Andrea Smith',
		email: 'test.person@example.com',
		profileimage: 'img/test-person.jpg',
		tutor: false
	};	

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
})

.controller('EditProfileController', function($scope, $http) {
	// Reference current user's profile: $scope.currentUser
	$scope.profile = $scope.currentUser;
})

.controller('TutorSessionController', function($scope) {
	$scope.session = {
		started: "2015-04-14 10:30:00",
		active: true,
		tutee: {
			realname: "Henry Kip",
			profileimage: "img/test-person.jpg"
		},
		tutor: {
			realname: "Andrea Smith",
			profileimage: "http://placekitten.com/512/512",
			bio1: "Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
			bio2: 10,
			bio3: "",
			location: [null, null],
			customLocation: "Hunt Library, 3rd floor"
		}
	};

});