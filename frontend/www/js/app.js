// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

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

.config(function($stateProvider, $urlRouterProvider) {
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
    url: "/view_profile",
    views: {
      'menuContent': {
        templateUrl: "templates/view_profile.html",
        controller: 'HomeScreenController'  
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
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/intro');
});
