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

			var gestureTimeout;

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

			var handleCircleGesture = function(data) {
				var gesture = data.gestures[0];
				var pointableID = gesture.pointableIds[0];
				var direction = data.pointable(pointableID).direction;
				var dotProduct = Leap.vec3.dot(direction, gesture.normal);
				var isClockwise = (dotProduct > 0);
				if(gestureTimeout) {
					clearTimeout(gestureTimeout);
				}
				if(isClockwise) {
					$scope.forward();
				} else {
					$scope.rewind();
				}
				gestureTimeout = setTimeout(function(){
					video.playbackRate = 1;
				}, 200);
			}

			var handleGesture = function(data){
				var gesture = data.gestures[0];
				if(gesture) {
					switch(gesture.type) {
						case 'circle':
							handleCircleGesture(data);
							break;
						default:
							console.info('unhandled gesture', gesture.type);
							break;
					}
					return;
				}
				if(isStopGesture(data)){
					$scope.pause();
				} else {
					$scope.play();
				}
			};

			var frameNumber = 0;
			var fps = 5;
			Leap.loop({ enableGestures: true }, function(frame){
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
			$scope.forward = function() {
				console.log('ffw');
				video.playbackRate = 10;
			}
			$scope.rewind = function() {
				console.log('frw');
				video.playbackRate = -10;
			}
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