angular.module('starter.services', [])

.factory('API', function() {
	var base = "https://tutyr.heroku.com/api/";
	
	return {
		login: base + "account/register"
	};
	
})

.factory('TutorRequestService', function(){
	var requests = {
		1: {
			from: 'Bob',
			comments: 'I want help understanding mitochondria',
			profileimage: 'img/test-person.jpg',
			status: 0,
			request_time: '2015-04-07T19:43:37-0500',
			requestid: 1
		},
		2: {
			from: 'Mary',
			comments: "Need help with my HCI project",
			profileimage: 'img/test-person.jpg',
			status: 0,
			request_time: '2015-04-07T19:43:37-0500',
			requestid: 2
		}
	};
	
	return {
		requests: requests,
		getRequest: function(id) {
			return requests[id];
		}
	}
})

.factory('ProfileService', function(){
	var profiles = {
		1:	{
				realname: 'Firstname Lastname',
				profileimage: 'test-person.jpg',
				bio1: 'Hi, I am a piece of testing data.',
				bio2: "This is all about me. I'm a really nice junior who likes to eat pizza" + 
						"and do math all day long. Please request me because I am a good person",
				rating: 4,
				rate: "8",
				subjects: "Math, Computer Science, Java, Python, Calculus",
				customlocation: 'Carnegie Mellon University',
				id: 1
			},
		2:	{
				realname: 'Firstname Lastname',
				profileimage: 'test-person.jpg',
				bio1: 'Hi, I am a piece of testing data.',
				bio2: "This is all about me. I'm a really nice junior who likes to eat pizza" + 
						"and do math all day long. Please request me because I am a good person",
				rating: 4,
				rate: "8",
				subjects: "Math, Computer Science, Java, Python, Calculus",
				customlocation: 'Carnegie Mellon University',
				id: 2
			},
		3: {
				realname: 'Firstname Lastname',
				profileimage: 'test-person.jpg',
				bio1: 'Hi, I am a piece of testing data.',
				bio2: "This is all about me. I'm a really nice junior who likes to eat pizza" + 
						"and do math all day long. Please request me because I am a good person", 
				rating: 4,
				rate: "8",
				subjects: "Math, Computer Science, Java, Python, Calculus",
				customlocation: 'Carnegie Mellon University',
				id: 3
			},
		4: {
				realname: 'Firstname Lastname',
				profileimage: 'test-person.jpg',
				bio1: 'Hi, I am a piece of testing data.',
				bio2: "This is all about me. I'm a really nice junior who likes to eat pizza" +
						"and do math all day long. Please request me because I am a good person", 
				rating: 4,
				rate: "8",
				subjects: "Math, Computer Science, Java, Python, Calculus",
				customlocation: 'Carnegie Mellon University',
				id: 4
			}
		};		
		
		return {
			getProfile: function(id) {
				if ( profiles.hasOwnProperty(id) ) {
					return profiles[id];
				} else {
					return {error: "Profile not found."};
				}
			}
		}
});