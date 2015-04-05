angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
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
					$scope.currentUser.loggedIn = true;
	      });
	    },
	    error: function(error) {
	      alert('Facebook error: ' + error.error_description);
	    }
	  });		
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
		tutor: false
	};
	$scope.mockNewsfeed = {
		profiles: [
			{
				realname: 'Firstname Lastname',
				profileimage: 'test-person.jpg',
				bio1: 'Hi, I am a piece of testing data.',
				rating: 4,
				customlocation: 'Carnegie Mellon University'
			},
			{
				realname: 'Firstname Lastname',
				profileimage: 'test-person.jpg',
				bio1: 'Hi, I am a piece of testing data.',
				rating: 4,
				customlocation: 'Carnegie Mellon University'
			},
			{
				realname: 'Firstname Lastname',
				profileimage: 'test-person.jpg',
				bio1: 'Hi, I am a piece of testing data.',
				rating: 4,
				customlocation: 'Carnegie Mellon University'
			},
			{
				realname: 'Firstname Lastname',
				profileimage: 'test-person.jpg',
				bio1: 'Hi, I am a piece of testing data.',
				rating: 4,
				customlocation: 'Carnegie Mellon University'
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
	}
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

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
});
