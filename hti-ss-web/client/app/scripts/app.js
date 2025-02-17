angular.module('hit-settings', ['common']);
angular.module('commonServices', []);
angular.module('common', ['ngResource', 'default', 'xml', 'hl7v2-edi', 'hl7v2', 'edi', 'hit-util']);
angular.module('main', ['common']);
angular.module('account', ['common']);
angular.module('cf', ['common']);
angular.module('doc', ['common']);
angular.module('cb', ['common']);
angular.module('hit-tool-directives', []);
angular.module('hit-tool-services', ['common']);
angular.module('documentation', []);
angular.module('domains', []);
angular.module('logs', ['common']);
angular.module('transport', []);

var app = angular.module('hit-app', [
	'ngRoute',
	'ui.bootstrap',
	'ngCookies',
	'LocalStorageModule',
	'ngResource',
	'ngSanitize',
	'ngIdle',
	'ngAnimate',
	'ui.bootstrap',
	'angularBootstrapNavTree',
	'QuickList',
	'hit-util',
	'format',
	'default',
	'hl7v2-edi',
	'xml',
	'hl7v2',
	'edi',
	'cf',
	'cb',
	'ngTreetable',
	'hit-tool-directives',
	'hit-tool-services',
	'commonServices',
	'smart-table',
	'doc',
	'account',
	'main',
	'hit-vocab-search',
	'hit-profile-viewer',
	'hit-validation-result',
	'hit-report-viewer',
	'hit-testcase-details',
	'hit-testcase-tree',
	'hit-settings',
	'documentation',
	'hit-manual-report-viewer',
	'ui-notification',
	'angularFileUpload',
	'ociFixedHeader',
	'ngFileUpload',
	'ui.tree',
	'ui.select',
	'hit-edit-testcase-details',
	'domains',
	'logs',
	'transport'
]);


var httpHeaders,

	//the message to show on the login popup page
	loginMessage,

	//the spinner used to show when we are still waiting for a server answer
	spinner,

	//The list of messages we don't want to display
	mToHide = ['usernameNotFound', 'emailNotFound', 'usernameFound', 'emailFound', 'loginSuccess', 'userAdded', 'uploadImageFailed'];

//the message to be shown to the user
var msg = {};

app.config(function($routeProvider, $httpProvider, localStorageServiceProvider, KeepaliveProvider, IdleProvider, NotificationProvider, $provide, $locationProvider) {

	$locationProvider.hashPrefix('');


	localStorageServiceProvider
		.setPrefix("hit-app")
		.setStorageType('sessionStorage');

	$routeProvider
		.when('/', {
			templateUrl: 'views/welcome.html'
		})
		.when('/:domain/home', {
			templateUrl: 'views/home.html'
		})
		.when('/ss-2015', {
			redirectTo: '/ss-2015/home'
		})
		.when('/ss-svap', {
			redirectTo: '/ss-svap/home'
		})
		//		.when('/home', {
		//			templateUrl: 'views/home.html',
		//			controller: function($rootScope) {
		//				$rootScope.isWelcomePage = false;
		//			}
		//		})
		.when('/:domain/doc', {
			templateUrl: 'views/documentation/documentation.html'
		})
		.when('/:domain/setting', {
			templateUrl: 'views/setting.html'
		})
		.when('/:domain/about', {
			templateUrl: 'views/about.html'
		})
		.when('/:domain/contact', {
			templateUrl: 'views/contact.html'
		})		
		.when('/:domain/cf', {
			templateUrl: 'views/cf/cf.html'
		})
		.when('/:domain/cb', {
			templateUrl: 'views/cb/cb.html'
		})
		.when('/:domain/blank', {
			templateUrl: 'blank.html'
		})
		.when('/:domain/error', {
			templateUrl: 'error.html'
		})
		.when('/:domain/transport', {
			templateUrl: 'views/transport/transport.html'
		})
		.when('/:domain/forgotten', {
			templateUrl: 'views/account/forgotten.html',
			controller: 'ForgottenCtrl'
		}).when('/:domain/registration', {
			templateUrl: 'views/account/registration.html',
			controller: 'RegistrationCtrl'
		}).when('/:domain/useraccount', {
			templateUrl: 'views/account/userAccount.html'
		}).when('/:domain/glossary', {
			templateUrl: 'views/glossary.html'
		}).when('/:domain/resetPassword', {
			templateUrl: 'views/account/registerResetPassword.html',
			controller: 'RegisterResetPasswordCtrl',
			resolve: {
				isFirstSetup: function() {
					return false;
				}
			}
		}).when('/:domain/registrationSubmitted', {
			templateUrl: 'views/account/registrationSubmitted.html'
		})
		.when('/:domain/uploadTokens', {
			templateUrl: 'views/home.html',
			controller: 'UploadTokenCheckCtrl'
		})
		.when('/:domain/addprofiles', {
			redirectTo: '/cf'
		})
		.when('/:domain/saveCBTokens', {
			templateUrl: 'views/home.html',
			controller: 'UploadCBTokenCheckCtrl'
		})
		.when('/:domain/addcbprofiles', {
			templateUrl: 'views/home.html',
			controller: 'UploadCBTokenCheckCtrl'
		})
		.when('/:domain/domains', {
			templateUrl: 'views/domains/domains.html'
		})
		.when('/:domain/logs', {
			templateUrl: 'views/logs/logs.html'
		})
		.otherwise({
			redirectTo: '/'
		});

	$httpProvider.interceptors.push('interceptor1');
	$httpProvider.interceptors.push('interceptor2');
	$httpProvider.interceptors.push('interceptor3');
	$httpProvider.interceptors.push('interceptor4');


	IdleProvider.idle(7200);
	IdleProvider.timeout(30);
	KeepaliveProvider.interval(10);

	NotificationProvider.setOptions({
		delay: 30000,
		maxCount: 1
	});

	httpHeaders = $httpProvider.defaults.headers;

	//file upload file over bug fix
	$provide.decorator('nvFileOverDirective', ['$delegate', function($delegate) {
		var directive = $delegate[0],
			link = directive.link;

		directive.compile = function() {
			return function(scope, element, attrs) {
				var overClass = attrs.overClass || 'nv-file-over';
				link.apply(this, arguments);
				element.on('dragleave', function() {
					element.removeClass(overClass);
				});
			};
		};

		return $delegate;
	}]);


});


app.factory('interceptor1', function($q, $rootScope, $location, StorageService, $window) {
	var handle = function(response) {
		if (response.status === 440) {
			response.data = "Session timeout";
			$rootScope.openSessionExpiredDlg();
		} else if (response.status === 498) {
			response.data = "Invalid Application State";
			$rootScope.openVersionChangeDlg();
		}
		//        else if (response.status === 401) {
		//            $rootScope.openInvalidReqDlg();
		//        }
	};
	return {
		responseError: function(response) {
			handle(response);
			return $q.reject(response);
		}
	};
});


app.factory('interceptor2', function($q, $rootScope, $location, StorageService, $window) {
	return {
		response: function(response) {
			return response || $q.when(response);
		},
		responseError: function(response) {
			if (response.status === 401) {
				//We catch everything but this one. So public users are not bothered
				//with a login windows when browsing home.
				if (response.config.url !== 'api/accounts/cuser') {
					//We don't intercept this request
					if (response.config.url !== 'api/accounts/login') {
						var deferred = $q.defer(),
							req = {
								config: response.config,
								deferred: deferred
							};
						$rootScope.requests401.push(req);
					}
					$rootScope.$broadcast('event:loginRequired');
					//                        return deferred.promise;

					return $q.when(response);
				}
			}
			return $q.reject(response);
		}
	};
});


app.factory('interceptor3', function($q, $rootScope, $location, StorageService, $window) {
	return {
		response: function(response) {
			//hide the spinner
			spinner = false;
			return response || $q.when(response);
		},
		responseError: function(response) {
			//hide the spinner
			spinner = false;
			return $q.reject(response);
		}
	};
});

app.factory('interceptor4', function($q, $rootScope, $location, StorageService, $window) {
	var setMessage = function(response) {
		//if the response has a text and a type property, it is a message to be shown
		if (response.data && response.data.text && response.data.type) {
			if (response.status === 401) {
				//                        console.log("setting login message");
				loginMessage = {
					text: response.data.text,
					type: response.data.type,
					skip: response.data.skip,
					show: true,
					manualHandle: response.data.manualHandle
				};

			} else if (response.status === 503) {
				msg = {
					text: "server.down",
					type: "danger",
					show: true,
					manualHandle: true
				};
			} else {
				msg = {
					text: response.data.text,
					type: response.data.type,
					skip: response.data.skip,
					show: true,
					manualHandle: response.data.manualHandle
				};
				var found = false;
				var i = 0;
				while (i < mToHide.length && !found) {
					if (msg.text === mToHide[i]) {
						found = true;
					}
					i++;
				}
				if (found === true) {
					msg.show = false;
				} else {
					//                        //hide the msg in 5 seconds
					//                                                setTimeout(
					//                                                    function() {
					//                                                        msg.show = false;
					//                                                        //tell angular to refresh
					//                                                        $rootScope.$apply();
					//                                                    },
					//                                                    10000
					//                                                );
				}
			}
		}
	};

	return {
		response: function(response) {
			setMessage(response);
			return response || $q.when(response);
		},

		responseError: function(response) {
			setMessage(response);
			return $q.reject(response);
		}
	};
});

app.factory('myService', function(Session, $rootScope, $location, $modal, TestingSettings, AppInfo, $q, $sce, $templateCache, $compile, StorageService, $window, $route, $timeout, $http, User, Idle, Transport, IdleService, userInfoService, base64, Notification, $filter, $routeParams, DomainsManager) {
	//	console.log("myService");

	return {
		initData: function(domainChosen) {
			//			console.log("initData");




			StorageService.set(StorageService.ACTIVE_SUB_TAB_KEY, null);


			$rootScope.appLoad = function(domainParam) {
				if (domainParam === undefined) {
					domainParam = $location.search()['d'] ? decodeURIComponent($location.search()['d']) : null;
				}
				AppInfo.get().then(function(appInfo) {
					$rootScope.loadingDomain = true;
					$rootScope.appInfo = appInfo;
					$rootScope.apiLink = $rootScope.appInfo.url + $rootScope.appInfo.apiDocsPath;
					httpHeaders.common['rsbVersion'] = appInfo.rsbVersion;
					var previousToken = StorageService.get(StorageService.APP_STATE_TOKEN);
					if (previousToken != null && previousToken !== appInfo.rsbVersion) {
						$rootScope.openVersionChangeDlg();
					}
					StorageService.set(StorageService.APP_STATE_TOKEN, appInfo.rsbVersion);

					if (domainParam != undefined && domainParam != null) {
						StorageService.set(StorageService.APP_SELECTED_DOMAIN, domainParam);
					}
					var storedDomain = StorageService.get(StorageService.APP_SELECTED_DOMAIN);

					var domainFound = null;
					$rootScope.domain = null;
					$rootScope.appInfo.selectedDomain = null;
					$rootScope.domainsByOwner = {
						'my': [],
						'others': []
					};
					DomainsManager.getDomains().then(function(domains) {
						$rootScope.appInfo.domains = domains;
						if ($rootScope.appInfo.domains != null) {
							$rootScope.initDomainsByOwner();
							if ($rootScope.appInfo.domains.length === 1) {
								domainFound = $rootScope.appInfo.domains[0].domain;
							} else if (storedDomain != null) {
								$rootScope.appInfo.domains = $filter('orderBy')($rootScope.appInfo.domains, 'position'); //sorting by position but position doesn't exist...
								for (var i = 0; i < $rootScope.appInfo.domains.length; i++) {
									if ($rootScope.appInfo.domains[i].domain === storedDomain) {
										domainFound = $rootScope.appInfo.domains[i].domain;
										break;
									}
								}
							}
							if (domainFound == null) {
								for (var i = 0; i < $rootScope.appInfo.domains.length; i++) {
									if ($rootScope.appInfo.domains[i].domain === "default") {
										domainFound = $rootScope.appInfo.domains[i].domain;
										break;
									}
								}
								if (domainFound == null) {
									$rootScope.appInfo.domains = $filter('orderBy')($rootScope.appInfo.domains, 'position'); //sorting by position but position doesn't exist...
									domainFound = $rootScope.appInfo.domains[0].domain;
								}
							}

							$rootScope.clearDomainSession();
							DomainsManager.getDomainByKey(domainFound).then(function(result) {
								$rootScope.appInfo.selectedDomain = result.domain;
								StorageService.set(StorageService.APP_SELECTED_DOMAIN, result.domain);
								$rootScope.domain = result;
								$rootScope.loadingDomain = false;




								$timeout(function() {
									Transport.configs = {};
									Transport.getDomainForms($rootScope.domain.domain).then(function(transportForms) {
										$rootScope.transportSupported = transportForms != null && transportForms.length > 0;
										if ($rootScope.transportSupported) {
											angular.forEach(transportForms, function(transportForm) {
												var protocol = transportForm.protocol;
												if (!Transport.configs[protocol]) {
													Transport.configs[protocol] = {};
												}
												if (!Transport.configs[protocol]['forms']) {
													Transport.configs[protocol]['forms'] = {};
												}
												Transport.configs[protocol]['forms'] = transportForm;
												Transport.configs[protocol]['error'] = null;
												Transport.configs[protocol]['description'] = transportForm.description;
												Transport.configs[protocol]['key'] = transportForm.protocol;
												Transport.getConfigData($rootScope.domain.domain, protocol).then(function(data) {
													Transport.configs[protocol]['data'] = data;
													Transport.configs[protocol]['open'] = {
														ta: true,
														sut: false
													};
												}, function(error) {
													Transport.configs[protocol]['error'] = error.data;
												});
											});
										}
									}, function(error) {
										$scope.error = "No transport configs found.";
									});
								}, 500);
							}, function(error) {
								$rootScope.loadingDomain = true;
								$rootScope.openUnknownDomainDlg();
							});
						} else {
							$rootScope.openCriticalErrorDlg("No Tool scope found. Please contact the administrator");
						}
					}, function(error) {
						$rootScope.openCriticalErrorDlg("No Tool scope found. Please contact the administrator");
					});
				}
					, function(error) {
						$rootScope.loadingDomain = true;
						$rootScope.appInfo = {};
						$rootScope.openCriticalErrorDlg("Failed to fetch the server. Please try again");
					});

			};

			if (domainChosen !== null) {

				var domainParam;
				if (domainChosen === undefined) {
					domainParam = $location.search()['d'] ? decodeURIComponent($location.search()['d']) : null;
				} else {
					domainParam = domainChosen;
				}

				$rootScope.appLoad(domainParam);
			}






		}
	};
});


app.run(function(myService, $rootScope, $location, StorageService, userInfoService, User, $route, $window, base64, $http, Notification) {

	$rootScope.clearDomainSession = function() {
		StorageService.set(StorageService.ISOLATED_EDITOR_CONTENT_KEY, null);
		StorageService.set(StorageService.ISOLATED_SELECTED_TESTCASE_TYPE_KEY, null);
		StorageService.set(StorageService.CB_SELECTED_TESTPLAN_ID_KEY, null);
		StorageService.set(StorageService.CB_SELECTED_TESTPLAN_TYPE_KEY, null);
		StorageService.set(StorageService.CB_SELECTED_TESTPLAN_SCOPE_KEY, null);
		StorageService.set(StorageService.CB_MANAGE_SELECTED_TESTCASE_ID_KEY, null);
		StorageService.set(StorageService.CB_MANAGE_SELECTED_TESTCASE_TYPE_KEY, null);
		StorageService.set(StorageService.CB_MANAGE_LOADED_TESTCASE_ID_KEY, null);
		StorageService.set(StorageService.CB_MANAGE_LOADED_TESTCASE_TYPE_KEY, null);
		StorageService.set(StorageService.CB_MANAGE_LOADED_TESTSTEP_TYPE_KEY, null);
		StorageService.set(StorageService.CB_MANAGE_LOADED_TESTSTEP_ID_KEY, null);
		StorageService.set(StorageService.CB_MANAGE_SELECTED_TESTPLAN_ID_KEY, null);
		StorageService.set(StorageService.CB_MANAGE_SELECTED_TESTPLAN_TYPE_KEY, null);
		StorageService.set(StorageService.CB_MANAGE_SELECTED_TESTPLAN_SCOPE_KEY, null);
		StorageService.set(StorageService.APP_SELECTED_DOMAIN, null);

		//nico added
		StorageService.set(StorageService.CF_SELECTED_TESTPLAN_ID_KEY, null);
		StorageService.set(StorageService.CF_EDITOR_CONTENT_KEY, null);
		StorageService.set(StorageService.CF_LOADED_TESTCASE_ID_KEY, null);
		StorageService.set(StorageService.CB_EDITOR_CONTENT_KEY, null);
		StorageService.set(StorageService.CB_SELECTED_TESTCASE_TYPE_KEY, null);
		StorageService.set(StorageService.CB_LOADED_TESTCASE_ID_KEY, null);
		StorageService.set(StorageService.CB_LOADED_TESTCASE_TYPE_KEY, null);
		StorageService.set(StorageService.CB_LOADED_TESTSTEP_TYPE_KEY, null);
		StorageService.set(StorageService.CB_LOADED_TESTSTEP_ID_KEY, null);
		StorageService.set(StorageService.ISOLATED_EDITOR_CONTENT_KEY, null);
		StorageService.set(StorageService.ISOLATED_SELECTED_TESTCASE_TYPE_KEY, null);
		StorageService.set(StorageService.CB_SELECTED_TESTPLAN_ID_KEY, null);
		StorageService.set(StorageService.CB_SELECTED_TESTPLAN_TYPE_KEY, null);
		StorageService.set(StorageService.CB_SELECTED_TESTPLAN_SCOPE_KEY, null);
		StorageService.set(StorageService.CF_SELECTED_TESTPLAN_SCOPE_KEY, null);
		StorageService.set(StorageService.CF_SELECTED_TESTPLAN_ID_KEY, null);
		StorageService.set(StorageService.CF_SELECTED_TESTPLAN_TYPE_KEY, null);
		StorageService.set(StorageService.CB_MANAGE_SELECTED_TESTCASE_ID_KEY, null);
		StorageService.set(StorageService.CB_MANAGE_SELECTED_TESTCASE_TYPE_KEY, null);
		StorageService.set(StorageService.CB_MANAGE_LOADED_TESTCASE_ID_KEY, null);
		StorageService.set(StorageService.CB_MANAGE_LOADED_TESTCASE_TYPE_KEY, null);
		StorageService.set(StorageService.CB_MANAGE_LOADED_TESTSTEP_TYPE_KEY, null);
		StorageService.set(StorageService.CB_MANAGE_LOADED_TESTSTEP_ID_KEY, null);
		StorageService.set(StorageService.CB_MANAGE_SELECTED_TESTPLAN_ID_KEY, null);
		StorageService.set(StorageService.CB_MANAGE_SELECTED_TESTPLAN_TYPE_KEY, null);
		StorageService.set(StorageService.CB_MANAGE_SELECTED_TESTPLAN_SCOPE_KEY, null);
		StorageService.set(StorageService.APP_SELECTED_DOMAIN, null);
		StorageService.set(StorageService.CB_TEST_PLANS, []);

		StorageService.set(StorageService.CB_LOADED_TESTCASE_ID_KEY, null);
		StorageService.set(StorageService.ACTIVE_SUB_TAB_KEY, null);
		StorageService.set(StorageService.TEST_STEP_EXECUTION_MESSAGES_KEY, null);
		StorageService.set(StorageService.TEST_STEP_VALIDATION_REPORTS_KEY, null);
		StorageService.set(StorageService.TEST_STEP_MESSAGE_TREES_KEY, null);
		StorageService.set(StorageService.TEST_STEP_VALIDATION_RESULTS_KEY, null);
		StorageService.set(StorageService.TEST_STEP_EXECUTION_STATUSES_KEY, null);


		StorageService.set(StorageService.CB_SELECTED_TESTCASE_ID_KEY, null);
		StorageService.set(StorageService.TEST_CASE_EXECUTION_STATUSES_KEY, null);
		StorageService.set(StorageService.TEST_CASE_VALIDATION_RESULTS_KEY, null);
	};

	$rootScope.clearDomainSession();


	$rootScope.domainIdToName = function(domainId) {
		if (domainId === 'ss-2015') {
			return "ss-2015";
		} else if (domainId === 'ss-svap') {
			return "ss-svap"
		}

	}

	$rootScope.stackPosition = 0;
	$rootScope.transportSupported = false;
	$rootScope.scrollbarWidth = null;
	$rootScope.vcModalInstance = null;
	$rootScope.sessionExpiredModalInstance = null;
	$rootScope.errorModalInstanceInstance = null;

	function getContextPath() {
		return $window.location.pathname.substring(0, $window.location.pathname.indexOf("/", 2));
	}

	var initUser = function(user) {
		userInfoService.setCurrentUser(user);
		User.initUser(user);
	};





	$rootScope.selectDomain = function(domain) {
		if (domain != null) {
			StorageService.set(StorageService.APP_SELECTED_DOMAIN, domain);
			$location.search('d', domain);
			$rootScope.reloadPage();
		}
	};

	$rootScope.reloadPage = function() {
		$window.location.reload();
	};


	$rootScope.$watch(function() {
		return $location.path();
	}, function(newLocation, oldLocation) {
		//true only for onPopState
		if ($rootScope.activePath === newLocation) {
			var back,
				historyState = $window.history.state;
			back = !!(historyState && historyState.position <= $rootScope.stackPosition);
			if (back) {
				//back button
				$rootScope.stackPosition--;
			} else {
				//forward button
				$rootScope.stackPosition++;
			}
		} else {
			//normal-way change of page (via link click)
			if ($route.current) {
				$window.history.replaceState({
					position: $rootScope.stackPosition
				}, '');
				$rootScope.stackPosition++;
			}
		}
	});



	$rootScope.setActive = function(path) {
		if (path === '' || path === '/') {
			//	$location.path('/home');
		} else {
			$rootScope.activePath = path;
		}
	};

	$rootScope.isSubActive = function(path) {
		return path === $rootScope.subActivePath;
	};

	$rootScope.setSubActive = function(path) {
		$rootScope.subActivePath = path;
		StorageService.set(StorageService.ACTIVE_SUB_TAB_KEY, path);
	};


	//make current message accessible to root scope and therefore all scopes
	$rootScope.msg = function() {
		return msg;
	};

	//make current loginMessage accessible to root scope and therefore all scopes
	$rootScope.loginMessage = function() {
		//            console.log("calling loginMessage()");
		return loginMessage;
	};

	//showSpinner can be referenced from the view
	$rootScope.showSpinner = function() {
		return spinner;
	};

	$rootScope.createGuestIfNotExist = function() {
		User.createGuestIfNotExist().then(function(guest) {
			initUser(guest);
		}, function(error) {
			$rootScope.openCriticalErrorDlg("ERROR: Sorry, Failed to initialize the session. Please refresh the page and try again.");
		});
	};

	/**
	 * Holds all the requests which failed due to 401 response.
	 */
	$rootScope.requests401 = [];

	$rootScope.$on('event:loginRequired', function() {
		//            console.log("in loginRequired event");
		$rootScope.showLoginDialog();
	});

	$rootScope.$on('event:loginRequiredWithRedirect', function(event, path) {
		$rootScope.showLoginDialog(path);
	});


	/**
	 * On 'event:loginConfirmed', resend all the 401 requests.
	 */
	$rootScope.$on('event:loginConfirmed', function() {
		initUser(userInfoService.getCurrentUser());
		var i,
			requests = $rootScope.requests401,
			retry = function(req) {
				$http(req.config).then(function(response) {
					req.deferred.resolve(response);
				});
			};
		for (i = 0; i < requests.length; i += 1) {
			retry(requests[i]);
		}
		$rootScope.requests401 = [];
		$window.location.reload();
	});

	/*jshint sub: true */
	/**
	 * On 'event:loginRequest' send credentials to the server.
	 */
	$rootScope.$on('event:loginRequest', function(event, username, password) {
		httpHeaders.common['Accept'] = 'application/json';
		httpHeaders.common['Authorization'] = 'Basic ' + base64.encode(username + ':' + password);
		//        httpHeaders.common['withCredentials']=true;
		//        httpHeaders.common['Origin']="http://localhost:9000";
		$http.get('api/accounts/login').then(function() {
			//If we are here in this callback, login was successfull
			//Let's get user info now
			httpHeaders.common['Authorization'] = null;
			$http.get('api/accounts/cuser').then(function(result) {
				if (result.data && result.data != null) {
					var rs = angular.fromJson(result.data);
					userInfoService.setCurrentUser(rs);
					$rootScope.$broadcast('event:loginConfirmed');
				} else {
					userInfoService.setCurrentUser(null);
				}
			}, function() {
				userInfoService.setCurrentUser(null);
			});
		});
	});



	$rootScope.$on('event:loginRequestWithAuth', function(event, auth, path, loadApp) {
		httpHeaders.common['Accept'] = 'application/json';
		httpHeaders.common['Authorization'] = 'Basic ' + auth;
		$http.get('api/accounts/login').success(function() {
			//            console.log("logging success...");
			httpHeaders.common['Authorization'] = null;
			$http.get('api/accounts/cuser').then(function(result) {
				if (result.data && result.data != null) {
					var rs = angular.fromJson(result.data);
					initUser(rs);
					if (path !== undefined) {
						if (loadApp) {
							$rootScope.appLoad();
						}
						$location.url(path);
					} else {
						if (loadApp) {
							$rootScope.appLoad();
						}
						$rootScope.$broadcast('event:loginConfirmed');
					}
				} else {
					userInfoService.setCurrentUser(null);
				}
			}, function() {
				userInfoService.setCurrentUser(null);
			});
		});
	});


	/*jshint sub: true */
	/**
	 * On 'event:loginRequest' send credentials to the server.
	 */
	$rootScope.$on('event:loginRedirectRequest', function(event, username, password, path) {
		httpHeaders.common['Accept'] = 'application/json';
		httpHeaders.common['Authorization'] = 'Basic ' + base64.encode(username + ':' + password);
		//        httpHeaders.common['withCredentials']=true;
		//        httpHeaders.common['Origin']="http://localhost:9000";
		$http.get('api/accounts/login').then(function() {
			//If we are here in this callback, login was successfull
			//Let's get user info now
			httpHeaders.common['Authorization'] = null;
			$http.get('api/accounts/cuser').then(function(result) {
				if (result.data && result.data != null) {
					var rs = angular.fromJson(result.data);
					initUser(rs);
					$rootScope.$broadcast('event:loginConfirmed');
				} else {
					userInfoService.setCurrentUser(null);
				}
				//redirect
				$location.url(path);
			}, function() {
				userInfoService.setCurrentUser(null);
			});
		});
	});

	/**
	 * On 'logoutRequest' invoke logout on the server.
	 */
	$rootScope.$on('event:logoutRequest', function() {
		httpHeaders.common['Authorization'] = null;
		userInfoService.setCurrentUser(null);
		$http.get('j_spring_security_logout').then(function(result) {
			$rootScope.createGuestIfNotExist();
			$rootScope.$broadcast('event:logoutConfirmed');
		});
	});

	/**
	 * On 'loginCancel' clears the Authentication header
	 */
	$rootScope.$on('event:loginCancel', function() {
		httpHeaders.common['Authorization'] = null;
	});

	$rootScope.$on('$routeChangeStart', function(next, current) {
		//            console.log('route changing');
		// If there is a message while change Route the stop showing the message
		if (msg && msg.manualHandle === 'false') {
			//                console.log('detected msg with text: ' + msg.text);
			msg.show = false;
		}
	});

	$rootScope.$watch(function() {
		return $rootScope.msg().text;
	}, function(value) {
		$rootScope.showNotification($rootScope.msg());
	});

	$rootScope.$watch('language()', function(value) {
		$rootScope.showNotification($rootScope.msg());
	});

	$rootScope.loadFromCookie = function() {
		if (userInfoService.hasCookieInfo() === true) {
			//console.log("found cookie!")
			userInfoService.loadFromCookie();
			httpHeaders.common['Authorization'] = userInfoService.getHthd();
		}
		else {
			//console.log("cookie not found");
		}
	};

	$rootScope.showNotification = function(m) {
		if (m != undefined && m.show && m.text != null) {
			var msg = angular.copy(m);
			var message = $.i18n.prop(msg.text);
			var type = msg.type;
			if (type === "danger") {
				Notification.error({
					message: message,
					templateUrl: "NotificationErrorTemplate.html",
					scope: $rootScope,
					delay: 10000
				});
			} else if (type === 'warning') {
				Notification.warning({
					message: message,
					templateUrl: "NotificationWarningTemplate.html",
					scope: $rootScope,
					delay: 5000
				});
			} else if (type === 'success') {
				Notification.success({
					message: message,
					templateUrl: "NotificationSuccessTemplate.html",
					scope: $rootScope,
					delay: 5000
				});
			}
			//reset
			m.text = null;
			m.type = null;
			m.show = false;
		}
	};

	$rootScope.getScrollbarWidth = function() {
		if ($rootScope.scrollbarWidth == 0) {
			var outer = document.createElement("div");
			outer.style.visibility = "hidden";
			outer.style.width = "100px";
			outer.style.msOverflowStyle = "scrollbar"; // needed for WinJS apps

			document.body.appendChild(outer);

			var widthNoScroll = outer.offsetWidth;
			// force scrollbars
			outer.style.overflow = "scroll";

			// add innerdiv
			var inner = document.createElement("div");
			inner.style.width = "100%";
			outer.appendChild(inner);

			var widthWithScroll = inner.offsetWidth;

			// remove divs
			outer.parentNode.removeChild(outer);

			$rootScope.scrollbarWidth = widthNoScroll - widthWithScroll;
		}

		return $rootScope.scrollbarWidth;
	};

	//loadAppInfo();
	userInfoService.loadFromServer().then(function(currentUser) {
		if (currentUser !== null && currentUser.accountId != null && currentUser.accountId != undefined) {
			initUser(currentUser);
		} else {
			$rootScope.createGuestIfNotExist();
		}
	}, function(error) {
		$rootScope.createGuestIfNotExist();
	});


	$rootScope.getAppInfo = function() {
		return $rootScope.appInfo;
	};

	$rootScope.isDomainLoaded = function() {

		return StorageService.get(StorageService.APP_SELECTED_DOMAIN) !== null;
	}

	$rootScope.isAuthenticationRequired = function() {
		return $rootScope.getAppInfo() && $rootScope.getAppInfo().options && ($rootScope.getAppInfo().options['AUTHENTICATION_REQUIRED'] === "true");
	};

	$rootScope.isEmployerRequired = function() {
		return $rootScope.getAppInfo() && $rootScope.getAppInfo().options && ($rootScope.getAppInfo().options['EMPLOYER_REQUIRED'] === "true");
	};


	$rootScope.isCbManagementSupported = function() {
		return $rootScope.getAppInfo() && $rootScope.getAppInfo().options && ($rootScope.getAppInfo().options['CB_MANAGEMENT_SUPPORTED'] === "true");
	};

	$rootScope.isCfManagementSupported = function() {
		return $rootScope.getAppInfo() && $rootScope.getAppInfo().options && ($rootScope.getAppInfo().options['CF_MANAGEMENT_SUPPORTED'] === "true");
	};


	$rootScope.isDocumentationManagementSupported = function() {
		return $rootScope.getAppInfo() && $rootScope.getAppInfo().options && ($rootScope.getAppInfo().options['DOC_MANAGEMENT_SUPPORTED'] === "true");
	};

	$rootScope.isDomainOwner = function(email) {
		return $rootScope.domain != null && $rootScope.domain.ownerEmails != null && $rootScope.domain.ownerEmails.length() > 0 && $rootScope.domain.ownerEmails.indexOf(email) != -1;
	};

	$rootScope.isDomainOwner = function() {
		return $rootScope.domain != null && $rootScope.domain.owner === userInfoService.getUsername();
	};


	$rootScope.isDomainsManagementSupported = function() {
		return $rootScope.getAppInfo() && $rootScope.getAppInfo().options && ($rootScope.getAppInfo().options['DOMAIN_MANAGEMENT_SUPPORTED'] === "true") || userInfoService.isAdmin() || userInfoService.isSupervisor() || userInfoService.isDeployer();
	};


	$rootScope.isLoggedIn = function() {
		return userInfoService.isAuthenticated();
	};

	$rootScope.isDomainSelectionSupported = function() {
		return $rootScope.getAppInfo() && $rootScope.getAppInfo().options && ($rootScope.getAppInfo().options['DOMAIN_SELECTION_SUPPORTED'] === "true");
	};

	$rootScope.isUserLoginSupported = function() {
		return $rootScope.getAppInfo() && $rootScope.getAppInfo().options && ($rootScope.getAppInfo().options['USER_LOGIN_SUPPORTED'] === "true");
	};

	$rootScope.isReportSavingSupported = function() {
		return $rootScope.domain && $rootScope.domain.options && ($rootScope.domain.options['REPORT_SAVING_SUPPORTED'] === "true");
	};

	$rootScope.isToolScopeSelectionDisplayed = function() {
		return $rootScope.getAppInfo() && $rootScope.getAppInfo().options && ($rootScope.getAppInfo().options['TOOL_SCOPE_SELECTON_DISPLAYED'] === "true");
	};

	$rootScope.isUserLoginSupported = function() {
		return $rootScope.getAppInfo() && $rootScope.getAppInfo().options && ($rootScope.getAppInfo().options['USER_LOGIN_SUPPORTED'] === "true");
	};

	$rootScope.isDevTool = function() {
		return $rootScope.getAppInfo() && $rootScope.getAppInfo().options && ($rootScope.getAppInfo().options['IS_DEV_TOOL'] === "true");
	};

	$rootScope.getAppURL = function() {
		return $rootScope.appInfo.url;
	};


	//only init with a domain on not the welcome page.
	$rootScope.$on('$routeChangeStart', function(event, next, current) {
		if (next && next['$$route']) {
			var route = next['$$route']['originalPath'];
			if (route === '/') {
				$rootScope.isWelcomePage = true;
				myService.initData(null);
			} else if (route.includes("/:domain")) {
				var domain = next.params.domain;
				if (domain === "ss-2015") {
					$rootScope.isWelcomePage = false;
					if (StorageService.get(StorageService.APP_SELECTED_DOMAIN) !== 'ss-2015') {
						myService.initData('ss-2015');
					}
				} else if (domain === 'ss-svap') {
					$rootScope.isWelcomePage = false;
					if (StorageService.get(StorageService.APP_SELECTED_DOMAIN) !== 'ss-svap') {
						myService.initData('ss-svap');
					}
				} else {
					$location.path('/');
				}
			}
		}
	});



});


angular.module('ui.bootstrap.carousel', ['ui.bootstrap.transition'])
	.controller('CarouselController', ['$scope', '$timeout', '$transition', '$q', function($scope, $timeout, $transition, $q) {
	}]).directive('carousel', [function() {
		return {}
	}]);


angular.module('hit-tool-services').factory('TabSettings',
	['$rootScope', function($rootScope) {
		return {
			new: function(key) {
				return {
					key: key,
					activeTab: 0,
					getActiveTab: function() {
						return this.activeTab;
					},
					setActiveTab: function(value) {
						this.activeTab = value;
						this.save();
					},
					save: function() {
						sessionStorage.setItem(this.key, this.activeTab);
					},
					restore: function() {
						this.activeTab = sessionStorage.getItem(this.key) != null && sessionStorage.getItem(this.key) != "" ? parseInt(sessionStorage.getItem(this.key)) : 0;
					}
				};
			}
		};
	}]
);


app.controller('ErrorDetailsCtrl', function($scope, $modalInstance, error) {
	$scope.error = error;
	$scope.ok = function() {
		$modalInstance.close($scope.error);
	};

	$scope.cancel = function() {
		$modalInstance.dismiss('cancel');
	};

	$scope.refresh = function() {
		$modalInstance.close($window.location.reload());
	};
});

app.directive('stRatio', function() {

	return {

		link: function(scope, element, attr) {

			var ratio = +(attr.stRatio);


			element.css('width', ratio + '%');


		}

	};

});

app.controller('TableFoundCtrl', function($scope, $modalInstance, table) {
	$scope.table = table;
	$scope.tmpTableElements = [].concat(table != null ? table.valueSetElements : []);
	$scope.cancel = function() {
		$modalInstance.dismiss('cancel');
	};
});


app.controller('ValidationResultInfoCtrl', ['$scope', '$modalInstance',
	function($scope, $modalInstance) {
		$scope.close = function() {
			$modalInstance.dismiss('cancel');
		};
	}
]);


app.filter('capitalize', function() {
	return function(input) {
		return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
	}
});

app.filter('classification', function() {
	return function(input) {
		switch (input) {
			case 'specerrors':
				return 'spec errors';
			case 'informationals':
				return 'informationals';
			case 'affirmatives':
				return 'affirmatives';
			case 'alerts':
				return 'alerts';
			case 'warnings':
				return 'warnings';
			case 'errors':
				return 'errors';
			default:
				return input;
		}
	}
});


app.controller('ErrorCtrl', ['$scope', '$modalInstance', 'StorageService', '$window',
	function($scope, $modalInstance, StorageService, $window) {
		$scope.refresh = function() {
			$modalInstance.close($window.location.reload());
		};
	}
]);

app.controller('FailureCtrl', ['$scope', '$modalInstance', 'StorageService', '$window', 'error',
	function($scope, $modalInstance, StorageService, $window, error) {
		$scope.error = error;
		$scope.close = function() {
			$modalInstance.close();
		};
	}
]);


app
	.service('base64', function base64() {
		// AngularJS will instantiate a singleton by calling "new" on this function
		var keyStr = 'ABCDEFGHIJKLMNOP' +
			'QRSTUVWXYZabcdef' +
			'ghijklmnopqrstuv' +
			'wxyz0123456789+/' +
			'=';
		this.encode = function(input) {
			var output = '',
				chr1, chr2, chr3 = '',
				enc1, enc2, enc3, enc4 = '',
				i = 0;

			while (i < input.length) {
				chr1 = input.charCodeAt(i++);
				chr2 = input.charCodeAt(i++);
				chr3 = input.charCodeAt(i++);

				enc1 = chr1 >> 2;
				enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
				enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
				enc4 = chr3 & 63;

				if (isNaN(chr2)) {
					enc3 = enc4 = 64;
				} else if (isNaN(chr3)) {
					enc4 = 64;
				}

				output = output +
					keyStr.charAt(enc1) +
					keyStr.charAt(enc2) +
					keyStr.charAt(enc3) +
					keyStr.charAt(enc4);
				chr1 = chr2 = chr3 = '';
				enc1 = enc2 = enc3 = enc4 = '';
			}

			return output;
		};

		this.decode = function(input) {
			var output = '',
				chr1, chr2, chr3 = '',
				enc1, enc2, enc3, enc4 = '',
				i = 0;

			// remove all characters that are not A-Z, a-z, 0-9, +, /, or =
			input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '');

			while (i < input.length) {
				enc1 = keyStr.indexOf(input.charAt(i++));
				enc2 = keyStr.indexOf(input.charAt(i++));
				enc3 = keyStr.indexOf(input.charAt(i++));
				enc4 = keyStr.indexOf(input.charAt(i++));

				chr1 = (enc1 << 2) | (enc2 >> 4);
				chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
				chr3 = ((enc3 & 3) << 6) | enc4;

				output = output + String.fromCharCode(chr1);

				if (enc3 !== 64) {
					output = output + String.fromCharCode(chr2);
				}
				if (enc4 !== 64) {
					output = output + String.fromCharCode(chr3);
				}

				chr1 = chr2 = chr3 = '';
				enc1 = enc2 = enc3 = enc4 = '';
			}
		};
	});

app.factory('i18n', function() {
	// AngularJS will instantiate a singleton by calling "new" on this function
	var language;
	var setLanguage = function(theLanguage) {
		$.i18n.properties({
			name: 'messages',
			path: 'lang/',
			mode: 'map',
			language: theLanguage,
			callback: function() {
				language = theLanguage;
			}
		});
	};
	setLanguage('en');
	return {
		setLanguage: setLanguage
	};
});

app.factory('Resource', ['$resource', function($resource) {
	return function(url, params, methods) {
		var defaults = {
			update: { method: 'put', isArray: false },
			create: { method: 'post' }
		};

		methods = angular.extend(defaults, methods);

		var resource = $resource(url, params, methods);

		resource.prototype.$save = function(successHandler, errorHandler) {
			if (!this.id) {
				return this.$create(successHandler, errorHandler);
			}
			else {
				return this.$update(successHandler, errorHandler);
			}
		};

		return resource;
	};
}])





