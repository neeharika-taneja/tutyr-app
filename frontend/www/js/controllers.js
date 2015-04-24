angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $http, API, $state, $ionicHistory, $interval, $cordovaGeolocation, $cordovaToast, $ionicPlatform, $cordovaDialogs) {
	
	$scope.onDevice = function() {
		var hasCdv = typeof(cordova) === 'undefined' ? false: true;
    return hasCdv
    && /^file:\/{3}[^\/]/i.test(window.location.href) 
    && /ios|iphone|ipod|ipad|android/i.test(navigator.userAgent);		
	}
	
	$scope.handleAJAXError = function(err) {
		if ( err ) { 
			if (err.hasOwnProperty('message') ) {
				alert("There was a server error: " + err.message);			
				$scope.dialog("Server error", err.message);
			} else {
				$scope.dialog(err);
			}
		} else {
			$scope.dialog("Error.");
		}	
	}	
	
	$scope.dialog = function(message, title) {
		var title = typeof(title) === "undefined" ? "" : title;
		if ( $scope.onDevice() ) {
			$cordovaDialogs.alert(message, title);
		} else {
			if ( title == "") {
				alert(message);
			} else {				
				alert(title + ": " + message);
			}
		}
	}
	
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
						profile_pic: "http://graph.facebook.com/" + user.id + "/picture?width=512&height=512",
						tutor: false
	        };
	      });
				
				// Send this information to the Tutyr backend
				$scope.login($scope.fbUser, false);								
	    },
	    error: function(error) {
				$scope.dialog(error.error_description, "Facebook error");
	    }
	  });		
	}
	
	$scope.login = function(fbUser, debug) {
		var registrationData = {
			realname: fbUser.realname,
			email: fbUser.email,
			fbID: fbUser.fbID,
			profile_pic: fbUser.profile_pic
		};
		
		if ( !debug ) {
			$http.post(API.login, registrationData)
			.success(function(data, status) {
				$scope.currentUser = data;
				$scope.currentUser.loggedIn = true;
			})
			.error(function(err) {
				$scope.handleAJAXError(err);
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
			openFB.logout(function(){
				$scope.currentUser.loggedIn = false;
				$scope.fbUser = {};
				$ionicHistory.nextViewOptions({
					disableBack: true
				});
				$state.go('app.intro');				
			}, function(err) {
				alert(err.message);
			});
		} else {
			alert("You attempted to log out, but you're not logged in.");
		}
	};

	$scope.fakeLogin = function() {
		$scope.currentUser.loggedIn = true;
	}

	$scope.currentUser = {
		loggedIn: false,
		realname: 'Andrea Smith',
		email: 'test.person@example.com',
		profile_pic: 'img/test-person.jpg',
		bio1: "",
		bio2: "",
		bio3: "",
		subjects: [],
		tutor_mode: false
	};	
	
	$scope.localToggleStatus = {
		hasTapped: false
	}
	
	$scope.pollLocation = function(frequency) {
		$ionicPlatform.ready(function(){
			if ( typeof(window.LOCATION_WATCHER) === 'undefined' ) {
				$scope.LOCATION_WATCHER = $cordovaGeolocation.watchPosition({
					frequency: frequency,
					timeout: 10000,
					enableHighAccuracy: false
				});
				$scope.LOCATION_WATCHER.then(null,
				function(err){
					alert("Geolocation error: " + err);
				},
				function(position){
					// Here is where you send the current location to the server
		      var lat  = position.coords.latitude
		      var long = position.coords.longitude
					$scope.currentUser.location = {
						latitude: lat,
						longitude: long
					};
				});
			}			
		});
	};

	$scope.clearLocation = function() {
		$ionicPlatform.ready(function(){
			$cordovaGeolocation.clearWatch($scope.LOCATION_WATCHER)
				.then(function(result){
					console.log("Geolocation stopped.");
				}, function(err){
					alert("Could not turn off location refreshing: " + err);
				});			
			});
	};

	// Monitor status of Tutor toggle
	$scope.monitorTutorToggle = function() {
		if ( $scope.localToggleStatus.hasTapped == false ) {
			console.log("Monitoring tutor toggle now");
			$scope.localToggleStatus.hasTapped = true;
			$scope.$watch('currentUser.tutor_mode', function() {
				var tutorToggleMessage = {
					facebook_id: $scope.currentUser.facebook_id,
					tutor_mode: $scope.currentUser.tutor_mode
				};
				
				if ( $scope.currentUser.tutor_mode == true ) {
					console.log("Tutor mode on");
					if ( $scope.currentUser.bio1 == "" ) {
						// toast("Let's fill out your Tutyr profile!")
						$ionicHistory.nextViewOptions({
							disableBack: true
						});
						$state.go('app.edit_profile');
					}
					$http.post(API.tutor_mode, tutorToggleMessage)
						.success(function(data, status) {
							if ( data.tutor_mode == $scope.currentUser.tutor_mode ) {								
								$scope.currentUser.tutor_mode = true;
								// $scope.pollLocation();
							}
						})
						.error(function(err) {
							// it failed, so toggle back to whatever the old state was
							// $scope.currentUser.tutor_mode = !$scope.currentUser.tutor_mode;
							$scope.handleAJAXError(err);
						});
				} else {
					console.log("Tutor mode off");
					$http.post(API.tutor_mode, tutorToggleMessage)
						.success(function(data, status) {
							if ( data.tutor_mode == $scope.currentUser.tutor_mode ) {								
								$scope.currentUser.tutor_mode = false;
								// $scope.clearLocation();
							}
						})
						.error(function(err) {
							// it failed, so toggle back to whatever the old state was
							// $scope.currentUser.tutor_mode = !$scope.currentUser.tutor_mode;
							$scope.handleAJAXError(err);
						});
				}
			});					
		}
	}

})


.controller('AboutController', function($scope) {
	$scope.emailFeedback = function() {		
		var link = "mailto:tutyrapp@gmail.com?subject=Tutyr";
		window.location = link;
	}	
})

.controller('HomeScreenController', function($scope){
	$scope.refresh = function() {
		// Would grab from API here...
		$scope.$broadcast('scroll.refreshComplete');
	}
	$scope.mockNewsfeed = {
		profiles: [
			{
				realname: 'Firstname Lastname',
				profile_pic: 'test-person.jpg',
				bio1: 'Python, Java',
				rating: 4,
				customlocation: 'Carnegie Mellon University',
				id: 1
			},
			{
				realname: 'Firstname Lastname',
				profile_pic: 'test-person.jpg',
				bio1: 'English, Math',
				rating: 4,
				customlocation: 'Carnegie Mellon University',
				id: 2
			},
			{
				realname: 'Firstname Lastname',
				profile_pic: 'test-person.jpg',
				bio1: 'Hi, I am a piece of testing data.',
				rating: 4,
				customlocation: 'Carnegie Mellon University',
				id: 3
			},
			{
				realname: 'Firstname Lastname',
				profile_pic: 'test-person.jpg',
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

.controller('ViewProfileController', function($scope, ProfileObject, API, $http, $state) {
	$scope.profile = ProfileObject;
	$scope.sessionTemplate = {
		fbID_from: $scope.currentUser.fbID,
		fbID_to: $scope.profile.fbID,
		comments: null
	};
	$scope.generateSession = function(profile) {
		// $http.post(API.session, $scope.sessionTemplate)
		// 	.success(function(data, status) {
		// 		// redirect here
		// 	})
		// 	.error(function(err) {
		// 		$scope.handleAJAXError(err);
		// 	});
		// $state.go('app.session_pending', {id: 1});
	};
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

.controller('EditProfileController', function($scope, $http, API, $state) {
	$scope.updateProfile = function() {
		var updatedProfile = $scope.currentUser;
		// DEBUGGING ONLY
		updatedProfile.subjects = ["Math", "English", "History"];
		$http.post(API.profile, $scope.currentUser)
			.success(function(data, status){
				if ( $scope.currentUser == data ) {
					console.log("Profile updated successfully!");
					// Navigate to requests inbox
					$ionicHistory.nextViewOptions({
						disableBack: true
					});
					$state.go('app.tutor_requests');				
				}
			})
			.error(function(err){
				$scope.handleAJAXError(err);
			});
	};	
})

/* ------ Tutoring session controllers ------ */

.controller('TutorSessionPendingController', function($scope) {
	$scope.title = "Tutyr Confirmed";
	$scope.map = {
		center: {latitude: 40.4414, longitude: -79.9419},
		zoom: 10,
		options: {
			disableDefaultUI: true
		}
	};
	
	$scope.session = {
		started: "2015-04-14 10:30:00",
		active: true,
		status: 2,
		tutee: {
			realname: "Henry Kip",
			profile_pic: "img/test-person.jpg"
		},
		tutor: {
			realname: "Andrea Smith",
			profile_pic: "http://placekitten.com/512/512",
			bio1: "Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
			bio2: 10,
			bio3: "",
			location: [null, null],
			customLocation: "Hunt Library, 3rd floor"
		}
	};
	
	$scope.fakeAccept = function() {
		$scope.session.status = 3;
	};
	
})

.controller('TutorSessionController', function($scope, $http, API, $interval, Session) {
	var refreshTimer;
	$scope.map = {
		center: {latitude: 40.4414, longitude: -79.9419},
		zoom: 10,
		options: {
			disableDefaultUI: true
		}
	};
	
	// $scope.session = SessionObject;
	$scope.debug = Session;
	$scope.session = {
		started: "2015-04-14 10:30:00",
		active: true,
		tutee: {
			realname: "Henry Kip",
			profile_pic: "img/test-person.jpg"
		},
		tutor: {
			realname: "Andrea Smith",
			profile_pic: "http://placekitten.com/512/512",
			bio1: "Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
			bio2: 10,
			bio3: "",
			location: [null, null],
			customLocation: "Hunt Library, 3rd floor"
		}
	};
	
	$scope.completeSession = function() {
		alert("Session completed");
	};
	
	$scope.reloadSession = function() {
		$http.get(API.session + "/" + $scope.session.id)
			.success(function(data, status) {
				$scope.session = data;
			})
			.error(function(err) {
				$scope.handleAJAXError(err);
			});
	}
	
	$scope.startWatch = function() {
		if ( angular.isDefined(refreshTimer)) { return; }
		refreshTimer = $interval($scope.reloadSession);
		$scope.$watch('session.status', function() {
			// redirect based on status change
			return;
		});	
	}
	
	$scope.stopWatch = function() {
		if ( angular.isDefined(refreshTimer) ){
			$interval.cancel(refreshTimer);
			refreshTimer = undefined;
		}
	}
	
})	

.controller('TutorSessionOverController', function($scope){
	$scope.session = {
		started: "2015-04-14 10:30:00",
		active: true,
		rating: null,
		tutee: {
			realname: "Henry Kip",
			profile_pic: "img/test-person.jpg"
		},
		tutor: {
			realname: "Andrea Smith",
			profile_pic: "http://placekitten.com/512/512",
			bio1: "Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
			bio2: 10,
			bio3: "",
			location: [null, null],
			customLocation: "Hunt Library, 3rd floor"
		}
	};
});