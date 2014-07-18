(function(Leap, angular) {

	'use strict';
//
//	controller.on('frame',function(){
//		console.log('bingo');
//	});
//	https://github.com/roboleary/LeapTrainer.js#importing-and-exporting-gestures
//	http://blog.artlogic.com/2013/04/22/listening-for-leap-gestures-with-jquery/
//	http://12devs.co.uk/articles/web-experiments-with-the-leap-motion/
//	http://www.groy-groy.de/czerbst/threejsboilerplate/index5.html
//	http://js.leapmotion.com/examples/visualizer.html
//

	var FRONT_CENTER_X = 300;
	var FRONT_CENTER_Y = 400;
	var video = document.querySelector('[data-video]');

	angular.module('leapview',[])
		.controller('ViewCtrl', function($scope){
			$scope.title = 'LeapView';

			$scope.frontCenterX = FRONT_CENTER_X;
			$scope.frontCenterY = FRONT_CENTER_Y;

			var updateInfo = function(data){
				$scope.hands = data.hands;
				$scope.$apply();
			};

			var isStopGesture = function(data) {
				var isStopGesture = false;
				var hand = data.hands[0];
				if(hand){
					if(hand.fingers.length >= 4){
						isStopGesture = true;
						var handPalmY = hand.palmPosition[1];
						hand.fingers.forEach(function(finger){
							if(finger.stabilizedTipPosition[1] < handPalmY){
								isStopGesture = false;
							}
						});
					}
				}
				return isStopGesture;
			};

			var handleGesture = function(data){
				if(isStopGesture(data)){
					$scope.pause();
				} else {
					$scope.play();
				}
			};

			var frameNumber = 0;
			var fps = 5;
			Leap.loop(function(frame){
				// if(frame.hands){
				// 	console.log(frame.hands);
				// 	debugger;
				// }
				frameNumber ++;
				if(frameNumber >= 60/fps){
					frameNumber = 0;
					updateInfo(frame);
					handleGesture(frame);
				}
			});

			$scope.play = function() {
				video.play();
			};
			$scope.pause = function() {
				video.pause();
			};
		});


	var controller = new Leap.Controller();

	controller.on('connect', function() {
		console.log("Successfully connected.");
	});

	controller.on('deviceConnected', function() {
		console.log("A Leap device has been connected.");
	});

	controller.on('deviceDisconnected', function() {
		console.log("A Leap device has been disconnected.");
	});

	controller.connect();

}(Leap, angular));