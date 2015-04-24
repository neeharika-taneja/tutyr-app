// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'starter.utils', 'ui.bootstrap.rating', 'ui.bootstrap.tpls', 'uiGmapgoogle-maps', 'ngCordova', 'checklist-model'])

.run(function($rootScope, $ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider, uiGmapGoogleMapApiProvider) {
  uiGmapGoogleMapApiProvider.configure({
      //    key: 'your api key',
      v: '3.17',
      libraries: 'geometry'
  });
	
	openFB.init({
		appId: '607765576024618'
	});
	
  $stateProvider

	/* Menu */
  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
  })

	/* About screen */
  .state('app.about', {
    url: "/about",
    views: {
      'menuContent': {
        templateUrl: "templates/about.html",
				controller: 'AboutController'
      }
    }
  })
	
	.state('app.credits', {
		url: "/about/credits",
		views: {
			'menuContent': {
				templateUrl: "templates/about_credits.html"
			}			
		}
	}) 


	/* Preferences screen */
  .state('app.preferences', {
    url: "/settings",
    views: {
      'menuContent': {
        templateUrl: "templates/settings.html"
      }
    }
  })

	/* Login and newsfeed */
  .state('app.intro', {
    url: "/intro",
    views: {
      'menuContent': {
        templateUrl: "templates/intro.html",
				controller: 'HomeScreenController'	
      }
    },
  })
	
	/* view a tutor's profile */
  .state('app.view_profile', {
    url: "/view_profile/:id",
    views: {
      'menuContent': {
        templateUrl: "templates/view_profile.html",
        controller: 'ViewProfileController',
				resolve: {
					ProfileObject: function($stateParams, ProfileService) {
						return ProfileService.getProfile($stateParams.id);
					}
				}
      }
    },
  })

	/* confirm tutor request */
  .state('app.confirm', {
    url: "/confirm/:id",
    views: {
      'menuContent': {
        templateUrl: "templates/confirm.html",
        controller: 'ViewProfileController',
				resolve: {
					ProfileObject: function($stateParams, ProfileService) {
						return ProfileService.getProfile($stateParams.id);
					}
				}
      }
    },
  })
	
	/* edit your profile */
	.state('app.edit_profile', {
		url: "/edit_profile",
		views: {
			'menuContent': {
				templateUrl: "templates/edit_profile.html",
				controller: "EditProfileController"
			}
		}
	})
	
	/* --------- SESSIONS --------- */

 	/* Session pending state (including directions screen) */
  .state('app.session_pending', {
    url: "/session_pending/:id",
    views: {
      'menuContent': {
        templateUrl: "templates/session_pending.html",
        controller: 'TutorSessionController',
				resolve: {
					Session: function($stateParams, TutorSessionService) {
						var s = TutorSessionService;
						s.getSession($stateParams.id);
						return s;
					}
				}
      }
    },
  })
	
	/* Session in progress state */
	
  .state('app.session', {
    url: "/session/:id",
    views: {
      'menuContent': {
        templateUrl: "templates/session_inprog.html",
        controller: 'TutorSessionController',
				resolve: {
					Session: function($stateParams, TutorSessionService) {
						var s = TutorSessionService;
						s.getSession($stateParams.id);
						return s;
					}
				}
      }
    },
  })
	
	
	/* Session over state (includes ratings) */
	.state('app.session_over', {
    url: "/session_over/:id",
    views: {
      'menuContent': {
        templateUrl: "templates/session_over.html",
        controller: 'TutorSessionController',
				resolve: {
					Session: function($stateParams, TutorSessionService) {
						var s = TutorSessionService;
						s.getSession($stateParams.id);
						return s;
					}
				}
      }
    },
	})
	
	/* Tutor requests screen */
	.state('app.tutor_requests', {
		abstract: true,
		url: '/tutor_requests',
		views: {
			'tutor_requests': {
				template: '<ion-nav-view></ion-nav-view>'
			},
			'menuContent': {
				template: '<ion-nav-view></ion-nav-view>'
			}			
		}
	})
	
  .state('app.tutor_requests.index', {
    url: "",		
		templateUrl: "templates/tutor_requests.html",
		controller: 'TutorRequestsController'
  })

	
  .state('app.tutor_requests.detail', {
    url: "/:tutor_request",
		templateUrl: "templates/tutor_request.html",
		controller: 'TutorRequestController',
		resolve: {
			TutorRequest: function($stateParams, TutorRequestService) {
				return TutorRequestService.getRequest($stateParams.tutor_request);
			}
		}
  })
	
	.state('app.debug', {
		url: "/debug",
		views: {
			'menuContent': {
				templateUrl: "templates/debug.html"
			}
		}
	})
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/intro');
});
