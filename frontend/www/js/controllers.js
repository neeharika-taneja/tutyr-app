angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $http, API, $state, $ionicHistory, $interval, $cordovaGeolocation, $cordovaToast, $ionicPlatform, $cordovaDialogs, $localStorage) {

	$scope.$storage = $localStorage;

	$scope.onDevice = function() {
    return (window.cordova || window.PhoneGap || window.phonegap) 
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
	
	$scope.$on('Loading.error', function(event, args) {
		$scope.handleAJAXError(args.error);
	})
	
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
			profileimage: fbUser.profile_pic
		};
		
		if ( !debug ) {
			$http.post(API.login, registrationData)
			.success(function(data, status) {
				$scope.currentUser = data;
				$scope.currentUser.loggedIn = true;
				$scope.$storage.currentUser = data;
				$scope.$watch($scope.currentUser, function(){
					// Mirror current user to local storage.
					$scope.$storage.currentUser = $scope.currentUser;
				}); 				
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
		delete $scope.$storage.currentUser;
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
					console.log($scope.currentUser.location);
					var locationData = {
						latitude: lat,
						longitude: long,
						fbID: $scope.currentUser.facebook_id
					}
					$http.post(API.location, locationData)
						.success(function(data, status){
							console.log(data);
						})
						.error(function(error) {
							$scope.handleAJAXError(error);
						});						
				});
			}			
		});
	};
		
	// Stop polling for location
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
	
	// Onetime location ping
	$scope.pingLocation = function() {
		$ionicPlatform.ready(function() {
			$cordovaGeolocation.getCurrentPosition({timeout: 10000, maximumAge: 30000, enableHighAccuracy: false})
				.then(function(position) {
		      var lat  = position.coords.latitude
		      var long = position.coords.longitude
					$scope.currentUser.latitude = lat;
					$scope.currentUser.longitude = long;
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
	
	$scope.currentUser = {
		loggedIn: false
	}

	if ( !$scope.currentUser.loggedIn && $scope.$storage.currentUser ) {
		// Restore session
		$scope.currentUser = $scope.$storage.currentUser;
	} 	

})


.controller('AboutController', function($scope) {
	$scope.emailFeedback = function() {		
		var link = "mailto:tutyrapp@gmail.com?subject=Tutyr";
		window.location = link;
	}	
})

.controller('HomeScreenController', function($scope, API, $http, $cordovaGeolocation){
	$scope.updateLocation = function() {
		$cordovaGeolocation
			.getCurrentPosition({timeout: 15000, enableHighAccuracy:false})
			.then(function(position) {
				$scope.filter.latitude = position.coords.latitude;
				$scope.filter.longitude = position.coords.longitude;
				$scope.filter.done = true;			
				$scope.refresh($scope.filter);
			
			}, function(err) {
				$scope.handleAJAXError(err);
				$scope.refresh($scope.filter);
				
			});
	}

	$scope.filter = {
		latitude: null,
		longitude: null,
		subjects: []
	};
		
	$scope.refresh = function() {
		// Would grab from API here...
		$http.get(API.feed)
			.success(function(data, status){
				$scope.feed = data;
			})
			.error(function(error){
				$scope.handleAJAXError(error);
			});
		
		$scope.$broadcast('scroll.refreshComplete');
	};
	
	$scope.$watch("currentUser.loggedIn", function(){
		if ( $scope.currentUser.loggedIn == true ) {
			$scope.refresh();					
		}
	});
})

.controller('ViewProfileController', function($scope, ProfileObject, API, $http, $state, $ionicLoading) {
	$scope.profile = ProfileObject;
	$scope.sessionTemplate = {
		comments: null
	};
	$scope.generateSession = function(profile) {
		var sessionData = {
			fbID_from: $scope.currentUser.facebook_id,
			fbID_to: $scope.profile.facebook_id,
			comments: $scope.sessionTemplate.comments
		}
		$ionicLoading.show({template: "Requesting session..."});
		$http.post(API.session, sessionData)
			.success(function(data, status) {
				$ionicLoading.hide();
				$state.go("app.session_pending", {id: data.id} );
			})
			.error(function(err) {
				$ionicLoading.hide();
				$scope.handleAJAXError(err);
			});
	};
})

.controller('TutorRequestsController', function($scope, $ionicLoading, API, $http) {
	$scope.requests = {};
	$scope.refresh = function(pulled) {
		if ( !pulled ) $ionicLoading.show();
		$http.get(API.requests + "/" + $scope.currentUser.facebook_id)
			.success(function(data, status) {
				$scope.requests = data;
			})
			.error(function(error) {
				$scope.handleAJAXError(error);
			})
			.finally(function(){
				if (!pulled) $ionicLoading.hide();				
				$scope.$broadcast('scroll.refreshComplete');
			});
	}
	$scope.decline = function(id) {
		/* Decline request with id `id` */
		var data = {
			id: id, 
			status: 2
		};
		
		$http.post(API.sessionStatus, data)
			.success(function(data, status) {
				if ( data.status == true ) {
					$scope.refresh();
				}
			})
			.error(function(err) {
				$scope.handleAJAXError(err);
			})
	}
	
	$scope.refresh();
})

.controller('TutorRequestController', function($scope, $state, Session) {
	$scope.request = Session;
	$scope.acceptRequest = function() {
		console.log($scope.request);

		if ( $scope.currentUser.latitude ) {
			$scope.request.location_latitude = $scope.currentUser.latitude;
			$scope.request.location_longitude = $scope.currentUser.longitude;
		} else {
			if ( $scope.request.location_comments == "") {
				alert("Since you don't have location enabled, please enter a custom location.")
			} 
		}		
		// push stuff to server here that changes ID to 2
		
		$state.go('app.session_inprog', {id: $scope.request.id});
	}
})

.controller('EditProfileController', function($scope, $http, API, $state, $ionicLoading, $ionicHistory, Subjects) {
	$scope.subjects = Subjects;
	
	$scope.updateProfile = function() {
		var updatedProfile = $scope.currentUser;
		$ionicLoading.show({
			template: "Saving your profile..."
		});
		$http.post(API.profile, $scope.currentUser)
			.success(function(data, status){
				console.log("Profile updated successfully!");
				$scope.currentUser = data;
				// Navigate to requests inbox
				$ionicHistory.nextViewOptions({
					disableBack: true
				});					
		    $ionicLoading.hide();					
				$state.go('app.tutor_requests.index');				
			})
			.error(function(err){
		    $ionicLoading.hide();				
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

.controller('TutorSessionController', function($scope, $http, API, $interval, Session, $state) {
	var refreshTimer;
	$scope.map = {
		center: {latitude: 40.4414, longitude: -79.9419},
		zoom: 10,
		options: {
			disableDefaultUI: true
		}
	};
	
	$scope.session = Session;

	$scope.completeSession = function() {
		//TODO
		// Send status change 4 to server
		// Send ratings/comments to server
		$state.go('app.intro');
		
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
			if ( $scope.session.status == 3 ) {
				$state.go('app.session_over', {id: $scope.session.id});
			} else if ( $scope.session.status == 2) {
				return;
			} else {
				alert("Error: unexpected session status " + $scope.session.status);
				$state.go('app.intro');
			}
		});	
	}
	
	$scope.stopWatch = function() {
		if ( angular.isDefined(refreshTimer) ){
			$interval.cancel(refreshTimer);
			refreshTimer = undefined;
		}
	}
	
	$scope.startSession = function() {
		//TODO
		// Change session_start timestamp to Date.now()
	};
	$scope.endSession = function() {
		//TODO
		// Send status change 3 to server
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