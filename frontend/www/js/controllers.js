angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $http, API, $state, $ionicHistory, $interval, $cordovaGeolocation, $cordovaToast, $ionicPlatform, $cordovaDialogs, $localStorage, $cordovaLocalNotification, $ionicSideMenuDelegate, $rootScope) {

	$scope.$storage = $localStorage;
	$rootScope.headerClass= "bar-dark";

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
			$scope.dialog("There was a problem loading data from the server.", "Error");
		}	
	}	
	
	$scope.$on('Loading.error', function(event, args) {
		$scope.handleAJAXError(args.error);
	});
	
	// Toggle tutor mode when necessary on server side when app suspends / resumes
	
	$scope.$on('Device.pause', function() {
		if ( $scope.currentUser.tutor_mode == true ) {
			$localStorage.suspendWithTutorMode = true;
			var tutorToggleMessage = {
				facebook_id: $scope.currentUser.facebook_id,
				tutor_mode: false
			};
			$http.post(API.tutor_mode, tutorToggleMessage);			
		}
	});
	
	$scope.$on('Device.resume', function() {
		if ( $localStorage.suspendWithTutorMode == true ) {
			delete $localStorage.suspendWithTutorMode;
			var tutorToggleMessage = {
				facebook_id: $scope.currentUser.facebook_id,
				tutor_mode: true
			};
			$http.post(API.tutor_mode, tutorToggleMessage);
		}
	});
	
	$scope.dialog = function(message, title, tryNotify) {
		var title = typeof(title) === "undefined" ? "" : title;
		if ( $scope.onDevice() == true || angular.isDefined($scope.onDevice()) ) {
			if ( tryNotify == true ) {
				try {
					window.plugin.notification.local.promptForPermission();
					window.plugin.notification.local.add({
				    id: 1,
				    text: message,
						badge: 1						
					});
				} catch (e) {
					$cordovaDialogs.alert(message, title);					
				}
			} else {
				if ( !$scope.dialogUp ) { // Prevent dialog spam
					$scope.dialogUp = true;
					$cordovaDialogs.alert(message, title)
						.then(function(){
							$scope.dialogUp = false;
						});
				}
			}
		} else {
			if ( title == "") {
				alert(message);
			} else {				
				alert(title + ": " + message);
			}
		}
	}
	window.dialog = $scope.dialog;
	
	
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
		if ( $scope.currentUser.tutor_mode == true ) {
			$scope.currentUser.tutor_mode = false;
		}
		$scope.stopRequests();
		if ( angular.isDefined(window.refreshTimer) ){
			$interval.cancel(window.refreshTimer);
			refreshTimer = undefined;
		}
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
	
	$scope.localToggleStatus = {
		hasTapped: false
	}
	
	$scope.pollLocation = function(frequency) {
		$ionicPlatform.ready(function(){
			if ( typeof(window.LOCATION_WATCHER) === 'undefined' ) {
				$scope.LOCATION_WATCHER = $cordovaGeolocation.watchPosition({
					frequency: frequency,
					timeout: 20000,
					enableHighAccuracy: false
				});
				$scope.LOCATION_WATCHER.then(null,
				function(err){
					if ( err.code == err.TIMEOUT ) {
						// Let's try once more.
						console.log("Location services. out.");
						$scope.pingLocation();
					} 
					if ( err.code == err.PERMISSION_DENIED ) {
						var msg = "You can use Tutyr without enabling location services, but certain location-enabled features may not work.";
						$scope.dialog(msg, "Location");
					}
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
			$cordovaGeolocation.clearWatch($scope.LOCATION_WATCHER);
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
				}, function(err) {
					return;
				});
		});
	};

	// Poll for new tutor requests
	$scope.pollRequests = function(frequency) {
		console.log("Set request checking timer.")
		if ( $scope.currentUser.tutor_mode && !angular.isDefined(window.requestTimer) ) {
			// if ( !angular.isDefined($scope.currentUser.nrequests) ) {
			$scope.currentUser.nrequests = 0;
			// }
			window.requestTimer = $interval(function() {
				console.log("Checking for new Tutyr requests...");
				if ( !$scope.currentUser.busy ) {
					$http.get(API.requests + "/" + $scope.currentUser.facebook_id + "?filt=0")
						.success(function(data, status){
							var newRequests = data.length > $scope.currentUser.nrequests;
							var notInbox = ($ionicHistory.currentStateName().indexOf("tutor_request") == -1);
							if ( newRequests && notInbox ) {
								$scope.currentUser.nrequests = data.length;								
								$scope.dialog("You have a new tutoring request!", "Tutyr", true);
							}
						})
						.error(function(err) {
							$scope.handleAJAXError(err);
						});
				}	
			},frequency);			
		}
	};
	
	$scope.stopRequests = function()  {
		if ( angular.isDefined(window.requestTimer) ) {
			$interval.cancel(window.requestTimer);
			delete window.requestTimer;
		}
	};


	$scope.tutorOn = function() {
		var tutorToggleMessage = {
			facebook_id: $scope.currentUser.facebook_id,
			tutor_mode: true
		};
		
		$http.post(API.tutor_mode, tutorToggleMessage)
			.success(function(data, status) {
				if ( data.tutor_mode == $scope.currentUser.tutor_mode ) {								
					$scope.currentUser.tutor_mode = true;
					$scope.pollLocation(7.5*60*1000);
					$scope.pollRequests(20*1000);
				}
			})
			.error(function(err) {
				// it failed, so toggle back to whatever the old state was
				// $scope.currentUser.tutor_mode = !$scope.currentUser.tutor_mode;
				$scope.handleAJAXError(err);
			});
	};
	
	$scope.tutorOff = function() {
		var tutorToggleMessage = {
			facebook_id: $scope.currentUser.facebook_id,
			tutor_mode: false
		};
			
		$http.post(API.tutor_mode, tutorToggleMessage)
			.success(function(data, status) {
				if ( data.tutor_mode == $scope.currentUser.tutor_mode ) {								
					$scope.currentUser.tutor_mode = false;
					$scope.clearLocation();
					$scope.stopRequests();
				}
			})
			.error(function(err) {
				// it failed, so toggle back to whatever the old state was
				// $scope.currentUser.tutor_mode = !$scope.currentUser.tutor_mode;
				$scope.handleAJAXError(err);
			});
	}

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
				var element = angular.element(document.querySelector('ion-nav-bar'));
				
				if ( $scope.currentUser.tutor_mode == true ) {
					console.log("Tutor mode on");
					if ( $scope.currentUser.bio1 == "" ) {
						$scope.dialog("Let's fill out your profile!", "New Tutyr")
						$ionicHistory.nextViewOptions({
							disableBack: true
						});
						$state.go('app.edit_profile');
						$ionicSideMenuDelegate.toggleLeft();
					}
					$scope.tutorOn();

				} else {					
					console.log("Tutor mode off");
					$scope.tutorOff();
				}
			});					
		}
	}
	
	$scope.currentUser = {
		loggedIn: false
	}

	// Restore session from local cache on app re-open
	if ( !$scope.currentUser.loggedIn && $scope.$storage.currentUser ) {
		// Restore session
		$scope.currentUser = $scope.$storage.currentUser;
		$scope.$watch($scope.currentUser, function(){
			// Mirror current user to local storage.
			$scope.$storage.currentUser = $scope.currentUser;
		}); 		
		if ( angular.isDefined($localStorage.inProgress) && $localStorage.inProgress != false)	{
			$scope.dialog("You had a session in progress.", "Tutyr");
		}
	};	
	
	$scope.restoreSession = function() {
		var id = $localStorage.inProgress;
		$localStorage.inProgress = false;		
		$state.go('app.session', {id: id});
	}
	
	// Location ping on load
	$scope.pingLocation();
	
	if ( $scope.currentUser.tutor_mode ) {
		$scope.pollRequests(20*1000);		
	}	
})


.controller('AboutController', function($scope, $cordovaInAppBrowser) {
	$scope.emailFeedback = function() {		
		var link = "mailto:tutyrapp@gmail.com?subject=Tutyr";
		window.location = link;
	}	
	$scope.visitWebsite = function() {
		$cordovaInAppBrowser.open('http://tutyr.me', '_blank', {toolbar: 'yes'});
	}
})

.controller('HomeScreenController', function($scope, API, $http, $cordovaGeolocation, $state){
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
		$scope.pingLocation();
		
		$http.get(API.feed + "/" + $scope.currentUser.facebook_id) 
			.success(function(data, status){
				$scope.feed = data;
			})
			.error(function(error){
				$scope.handleAJAXError(error);
			});
		
		$scope.$broadcast('scroll.refreshComplete');
	};
	
	$scope.gotoProfile = function(id) {
		$state.go('app.view_profile', {id: id});
	};
	
	$scope.toggleSearch = function() {
		$scope.showSearch = !$scope.showSearch;
	}
	
	$scope.showSearch = false;
	
	$scope.$watch("currentUser.loggedIn", function(){
		if ( $scope.currentUser.loggedIn == true ) {
			$scope.refresh();					
		}
	});

	$scope.$on('$ionicView.enter', function() {
		if ( $scope.currentUser.loggedIn == true ) {
			console.log("Logged in home screen.");
			$scope.refresh();					
		}
	});
	
	
})

.controller('ViewProfileController', function($scope, ProfileObject, ReviewsObject, API, $http, $state, $ionicLoading, $ionicHistory) {
	$scope.profile = ProfileObject;
	$scope.ratings = ReviewsObject;
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
				$ionicHistory.nextViewOptions({
					disableBack: true
				});									
				$state.go("app.session_pending", {id: data.id} );
			})
			.error(function(err) {
				$ionicLoading.hide();
				$scope.handleAJAXError(err);
			});
	};
})

.controller('TutorRequestsController', function($scope, $ionicLoading, API, $http, $interval, $filter) {
	$scope.requests = {};
	$scope.requestFilter = 0;
	$scope.refresh = function(pulled) {
		if ( !pulled ) $ionicLoading.show();
		$http.get(API.requests + "/" + $scope.currentUser.facebook_id)
			.success(function(data, status) {
				$scope.requests = data;
				$scope.currentUser.nrequests = $filter('filter')(data, {status: 0}).length;
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
			status: 99
		};
		
		$http.post(API.status.status, data)
			.success(function(data, status) {
				$scope.refresh();
			})
			.error(function(err) {
				$scope.handleAJAXError(err);
			});
	}
	
	
	$scope.$on('$ionicView.enter', function() {
		console.log("Tutor request inbox");
		$scope.refresh();
	});	
})

.controller('TutorRequestController', function($scope, $state, Session, $http, API, $ionicHistory) {
	$scope.request = Session;
	if ( $scope.request.status == 98 ) {
		$state.$go("app.tutor_requests.index");
		$scope.dialog("Your tutee cancelled the request.", "Request cancelled")		
	};
	
	$scope.acceptRequest = function() {
		console.log($scope.request);
		
		// Generate location information
		if ( $scope.currentUser.latitude ) {
			$scope.request.location_latitude = $scope.currentUser.latitude;
			$scope.request.location_longitude = $scope.currentUser.longitude;
		} else {
			if ( $scope.request.location_comments == "") {
				alert("Since you don't have location enabled, please enter a location.");
				return;
			} 
		}		

		var tutorLocation = {
			latitude: $scope.currentUser.latitude ? $scope.currentUser.latitude : null,
			longitude: $scope.currentUser.longitude ? $scope.currentUser.longitude : null,
			comments: $scope.request.location_comments,
			id: $scope.request.id
		};
		
		// Update session status		
		var accept = {
			id: $scope.request.id,
			status: 1
		};				
		
		$http.post(API.status.location, tutorLocation) // Update location
			.success(function(data, status) {
				console.log("Successfully pushed location.");
				
				$http.post(API.status.status, accept)			// Update status on success
					.success(function(data, status) {
						console.log("Successfully changed status from 0 to 1");
						$ionicHistory.nextViewOptions({
							disableBack: true
						});											
						$state.go('app.session', {id: $scope.request.id});				
					})
					.error(function(err) {
						$scope.handleAJAXError(err);
					});						
			})
			.error(function(err) {
				$scope.handleAJAXError(err);
			});
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


.controller('TutorSessionController', function($scope, $http, API, $interval, Session, $state, $ionicHistory, $rootScope, $localStorage, $cordovaInAppBrowser) {
	/* Session objects */
	$scope.session = Session;
	$scope.thisSessionRoles = {}
	$scope.rating = {};
	
	/* Define user roles */
	$scope.$watch("session.tutor_from", function(){
		if ( angular.isDefined($scope.session) && $scope.session.tutor_to ) {
			$scope.thisSessionRoles.userIsTutor = $scope.session.tutor_to.facebook_id == $scope.currentUser.facebook_id;
			$scope.thisSessionRoles.userIsTutee = $scope.session.tutor_from.facebook_id == $scope.currentUser.facebook_id;			
		}
	});
	
	/* Session state helper functions */
	$scope.reloadSession = function() {
		$http.get(API.session + "/" + $scope.session.id)
			.success(function(data, status) {
				$scope.session = data;
			})
			.error(function(err) {
				$scope.handleAJAXError(err);
			});
	};
	
	/* Button click functions */
	
	$scope.getDirections = function() {
		console.log($scope.session);
		var latLng = $scope.session.location_latitude + ", " + $scope.session.location_longitude
		var url = "https://maps.google.com/?daddr=" + latLng; 
		$cordovaInAppBrowser.open(url, '_system');
	};
	
	$scope.venmoSession = function() {
		var buildUrl = function(recipient, amount, note) {
			return "https://venmo.com/?txn=pay&recipients=" + recipient +
				"&amount=" + amount + 
				"&note=" + note + 
				"&audience=private";
		}
		var url = buildUrl($scope.session.tutor_to.bio3, $scope.session.session_cost, "Tutyr session");
		$cordovaInAppBrowser.open(url, '_system');		
	}
	
	/* FSM helper functions */
	$scope.$watch('session.location_latitude', function() {
		if ( angular.isDefined($scope.session) &&
				angular.isDefined($scope.session.location_latitude) && 
				angular.isDefined($scope.session.location_longitude) ) {
			console.log("Setting map object");
			$scope.mapData = {
				options: {
					disableDefaultUI: true			
				},
				zoom: 12,
				center: {
					latitude: $scope.session.location_latitude,
					longitude: $scope.session.location_longitude			
				}
			}
		}
	});
	
	$scope.startWatch = function(interval) {
		// Start statusWatch() to redirect to pages based on status
		console.log("Starting statusWatch");
		if ( angular.isDefined(window.refreshTimer)) { 
			return;
		} else {
			window.refreshTimer = $interval(function() {
				$scope.reloadSession();
				$scope.statusWatch();
			}, interval);
		}
	}
	
	$scope.stopWatch = function() {
		// Kill statusWatch refresh timer
		console.log("Stopping statusWatch");
		$localStorage.inProgress = false;		
		if ( angular.isDefined(window.refreshTimer) ){
			$interval.cancel(window.refreshTimer);
			refreshTimer = undefined;
		}
	}
	
	
	$scope.switchStatus = function() {
		$ionicHistory.nextViewOptions({
			disableBack: true
		});				
		if ( $scope.session.status > 0  && $scope.session.status < 90 )  {
			$localStorage.inProgress = $scope.session.id;
		} 
		switch ( $scope.session.status ) {
			case 0: 
				if ( $scope.thisSessionRoles.userIsTutor ) {
					$state.go('app.tutor_requests.index', {id: $scope.session.id});							
				} else {
					$state.go('app.session_pending', {id: $scope.session.id});							
				}
				break;						
			case 1:
				if ( $scope.thisSessionRoles.userIsTutor ) {
					$state.go('app.session', {id: $scope.session.id});							
				} else {
					$state.go('app.session_pending', {id: $scope.session.id});							
				}
				break;
			case 2:
				$state.go('app.session', {id: $scope.session.id});
				break;
			case 3:
				$scope.stopWatch();
				$state.go('app.session_over', {id: $scope.session.id});
				break;
			case 4:
				$scope.stopWatch();
				$state.go('app.session_over', {id: $scope.session.id});
				break;
			case 98:
				$scope.stopWatch();						
				if ( $scope.thisSessionRoles.userIsTutor ) {
					// You are the tutor
					$scope.dialog("Your tutee cancelled the request.", "Request cancelled")
					delete $scope.session;
					$state.go('app.intro');
				} else { 
					delete $scope.session;
					$state.go('app.intro');
				}
				break;
			case 99:
				$scope.stopWatch();		
				$localStorage.inProgress = false;				
				break;	
			default:
				console.log("Unexpected state.", $scope.session);
				break;
		} // end switch				
	}
	
	$scope.changeStatus = function(id, status) { 
		var data = {
			id: id,
			status: status
		}
		return $http.post(API.status.status, data);
	}

	$scope.tuteeCancel = function() {
		$scope.changeStatus($scope.session.id, 98)
			.success(function(data, status) {
				$scope.session = data;				
			})
			.error(function(error) {
				$scope.handleAJAXError(error);
			});
	}
	
	$scope.completeSession = function() {
		// Send status change 4 to server
		// Send ratings/comments to server
		if ( !$scope.rating.rating ) {
			$scope.dialog("Please rate this tutoring session.", 'Tutyr');
			return;
		}
		
		$scope.changeStatus($scope.session.id, 4)
			.success(function(data, status){
				$scope.session = data;
			})
			.error(function(err) {
				$scope.handleAJAXError(err);
			});
		
			var rating = {
				rating: $scope.rating.rating,
				comments: $scope.rating.comments,
				fbID_from: null,
				fbID_to: null,
				session_id: $scope.session.id
			};
			
			if ( $scope.currentUser.tutor_mode ) {
				rating.fbID_from = $scope.session.tutor_to.facebook_id
				rating.fbID_to = $scope.session.tutor_from.facebook_id
			} else {
				rating.fbID_from = $scope.session.tutor_from.facebook_id
				rating.fbID_to = $scope.session.tutor_to.facebook_id				
			}			

		$http.post(API.rating, rating)
			.success(function(data, status) {
				if ( data.status == true ) {
					$scope.sessionOver();
				}
			})
			.error(function(error) {
				$scope.dialog("There was an error rating this user. Please try again", "Rating error");
			});
	};
	

	$scope.sessionOver = function() {
		// Shortcut to end timer and go back to homescreen
		console.log("Called sessionOver, stopping.");
		$localStorage.inProgress = false;		
		$scope.stopWatch();		
		delete $scope.session;						
		$ionicHistory.nextViewOptions({
			disableBack: true
		});				
		$state.go('app.intro');		
	}
		
	$scope.statusWatch = function() {
		// Watch for changes in session status and redirect to appropriate page
		console.log("Called statusWatch");
		if ( angular.isDefined($scope.session.status) ) {
			var status_map = {
				0: "app.session_pending",
				1: "app.session_pending",
				2: "app.session",
				3: "app.session_over",
				4: "app.session_over"
			};
	
			if ( status_map[$scope.session.status] == $ionicHistory.currentStateName() ) {
				console.log("Current state is correct, no redirect.");
				if ( $scope.session.status > 2 ) {
					console.log("State greater than 2, switching and stopping.")
					$scope.switchStatus();
					$scope.stopWatch();
				}
				return;
			} else {
				console.log("Incorrect state, switching.");
				$scope.switchStatus();
				$rootScope.redirectStarted = true;							
			} // endif correct state
		} // endif status defined
	}

	
	$scope.startSession = function() {	
		// Mark session_start timestamp 
		$http.post(API.status.start, {id: $scope.session.id})
			.success(function(data, status) {
				console.log("Successfully marked session start.");
			})
			.error(function(err) {
				$scope.handleAJAXError(err);
			});
			
		// Change session status
		$scope.changeStatus($scope.session.id, 2)
			.success(function(data, status) {
				console.log("Changed status to 2.");
				$scope.session = data;
			})
			.error(function(err) {
				$scope.handleAJAXError(err);
			});
	};
	
	$scope.endSession = function() {
		// Mark session_end timestamp
		$http.post(API.status.end, {id: $scope.session.id})
			.success(function(data, status) {
				// Send status change 3 to server
				$scope.changeStatus($scope.session.id, 3)
					.success(function(data, status) {
						$scope.session = data;
						$ionicHistory.nextViewOptions({
							disableBack: true
						});				
						$state.go('app.session_over', {id: $scope.session.id});
					})
					.error(function(err) {
						$scope.handleAJAXError(err);
					});
			})
			.error(function(err) {
				$scope.handleAJAXError(err);
			});
	}
	
	if ( $ionicHistory.currentStateName() != 'app.session_over' ) {		
		console.log("Automatic startwatch");
		$scope.startWatch(10000);
	} 
	
	$scope.$watch('session.status', function(newStatus, oldStatus) {
		if ( angular.isDefined($scope.session) && angular.isDefined($scope.session.status) && newStatus != oldStatus) {
			$scope.statusWatch();
		};
	});
	
});