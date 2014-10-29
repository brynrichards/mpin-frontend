/* 
 Copyright 2014 CertiVox UK Ltd, All Rights Reserved.
 
 The CertiVox M-Pin Client and Server Libraries are free software: you can
 redistribute it and/or modify it under the terms of the BSD 3-Clause
 License - http://opensource.org/licenses/BSD-3-Clause
 
 For full details regarding our CertiVox terms of service please refer to
 the following links:
 
 * Our Terms and Conditions -
 http://www.certivox.com/about-certivox/terms-and-conditions/
 
 * Our Security and Privacy -
 http://www.certivox.com/about-certivox/security-privacy/
 
 * Our Statement of Position and Our Promise on Software Patents -
 http://www.certivox.com/about-certivox/patents/
 */
/*
 Certivox JavaScript M-Pin Authentication Functions
 
 Provides these functions:
 calculateMPinToken     Calculates the MPin Token 
 local_entropy          Gets an entropy value from the client machine
 randomX                Calculates a random 254 bit value
 addShares              Add two points on the curve that are originally in hex format
 pass1Request           Form the JSON request for pass one of the M-Pin protocol
 pass2Request           Form the JSON request for pass two of the M-Pin protocol
 */

var mpin = mpin || {};

(function () {

	console.log("dom ready");

	"use strict";
	var lang = {}, hlp = {}, loader, MPIN_URL_BASE, IMAGES_PATH;
	MPIN_URL_BASE = "%URL_BASE%";
	IMAGES_PATH = MPIN_URL_BASE + "/images/";

	//CONSTRUCTOR 
	mpin = function (options) {
		var self = this, domID;

		loader(MPIN_URL_BASE + "/css/main.css", function () {
			var opts = {};

			Handlebars.registerHelper("txt", function (optionalValue) {
				return hlp.text(optionalValue);
			});

			Handlebars.registerHelper("img", function (optionalValue) {
				return hlp.img(optionalValue);
			});

			Handlebars.registerHelper("loop", function (n, block) {
				var accum = '';
				for (var i = 0; i < n; ++i)
					accum += block.fn(i);
				return accum;
			});


			if (options || options.targetElement) {
				self.el = document.getElementById(options.targetElement);
				addClass(self.el, "mpinMaster");
				self.setupHtml();
			} else {
				return console.error("::: TargetElement are missing or wrong !");
			}

			if (!options.clientSettingsURL) {
				return self.error(4002);
			}

			domID = options.targetElement;
			opts.client = options;
			self.ajax(options.clientSettingsURL, function (serverOptions) {
				if (serverOptions.error) {
					return self.error(serverOptions.error);
				}
				opts.server = serverOptions;

				// check if Dom ready if not wait until fire load event.
				if (document.readyState === "complete") {
					self.initialize.call(self, domID, opts);
				} else {
					window.addEventListener("load", function () {
						self.initialize.call(self, domID, opts);
					});
				}
			});
		});
	};

	//CONFIGS
	mpin.prototype.cfg = {
		language: "en",
		pinSize: 4,
		requiredOptions: "appID; seedValue; signatureURL; mpinAuthServerURL; timePermitsURL; authenticateURL; registerURL",
		restrictedOptions: "signatureURL; mpinAuthServerURL; timePermitsURL",
		defaultOptions: {
			identityCheckRegex: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
			setDeviceName: false
		},
		expireOtpSeconds: 99
	};

	/**
	 * Mpin Constructor
	 * 
	 * @param {type} domID PinPad element ID
	 * @param {type} options
	 * 
	 * @returns {Boolean}
	 */
	mpin.prototype.initialize = function (domID, options) {

//		this.setupHtml();
		this.addHelp();

		//options CHECK
		if (!options || !this.checkOptions(options.server)) {
			return this.error(4003);
		}

		//Extend string with extra methods
		setStringOptions();

		//set Options
		this.setDefaults().setOptions(options.server).setOptions(options.client);

		//if false browser unsupport 
		if (!this.checkBrowser()) {
			return;
		}

		//data Source
		this.ds = this.dataSource();

		if (!this.opts.certivoxURL.mpin_endsWith("/")) {
			this.opts.certivoxURL += "/";
		}

		//if set & exist
		if (this.opts.language && lang[this.opts.language]) {
			this.language = this.opts.language;
		} else {
			this.language = this.cfg.language;
		}
		this.setLanguageText();

		this.renderLanding();
//		this.renderBlank();
//		this.error(4004);
	};

	mpin.prototype.setupHtml = function () {
		this.el.innerHTML = Handlebars.templates["mpin"]();
		this.el = document.getElementById("mpinMiracle");
	};

	mpin.prototype.checkBrowser = function () {
		var navAgent, onUnsupport = true, ieVer;
		navAgent = navigator.userAgent.toLowerCase();

		if (navAgent.indexOf('msie') !== -1) {
			ieVer = parseInt(navAgent.split('msie')[1], 10);
			if (ieVer < 10) {
				this.unsupportedBrowser(4004);
				onUnsupport = false;
			}
		}

		if (typeof window.localStorage === "undefined") {
			this.unsupportedBrowser(4005);
			onUnsupport = false;
		}

		return onUnsupport;
	};

	mpin.prototype.unsupportedBrowser = function (errCode) {
		var errMessage;
		if (this.opts.onUnsupportedBrowser) {
			errMessage = hlp.text("error_code_" + errCode);
			this.opts.onUnsupportedBrowser(errMessage);
		} else {
			this.renderError(errCode);
		}
		return;
	};

	// check minimal required Options
	//  which should be set up
	mpin.prototype.checkOptions = function (options) {
		var opts, k;
		opts = this.cfg.requiredOptions.split("; ");
		for (k = 0; k < opts.length; k++) {
			if (typeof options[opts[k]] === "undefined") {
				return false;
			}
		}
		return true;
	};

	//set defaults OPTIONS
	mpin.prototype.setDefaults = function () {
		this.opts || (this.opts = {});
		for (var i in this.cfg.defaultOptions) {
			this.opts[i] = this.cfg.defaultOptions[i];
		}
		return this;
	};

	mpin.prototype.setOptions = function (options) {
		var _i, _opts, _optionName, _options = "requestOTP; successSetupURL; onSuccessSetup; successLoginURL; onSuccessLogin; onLoaded; onGetPermit; ";
		_options += "onAccountDisabled; onUnsupportedBrowser; prerollid; onError; onGetSecret; signatureURL; certivoxURL; ";
		_options += "mpinAuthServerURL; registerURL; accessNumberURL; mobileAppFullURL; customHeaders; authenticateRequestFormatter; accessNumberRequestFormatter; ";
		_options += "registerRequestFormatter; identityCheckRegex; seedValue; appID; useWebSocket; setupDoneURL; timePermitsURL; timePermitsStorageURL; authenticateURL; ";
		_options += "language; customLanguageTexts; setDeviceName; getAccessNumberURL";
		_opts = _options.split("; ");
		this.opts || (this.opts = {});

		this.opts.useWebSocket = ('WebSocket' in window && window.WebSocket.CLOSING === 2);

		for (_i = 0; _i < _opts.length; _i++) {
			_optionName = _opts[_i];
			if (typeof options[_optionName] !== "undefined")
				this.opts[_optionName] = options[_optionName];
		}

		mpinAuth.hash_val = this.opts.seedValue;

		if (this.opts.mpinAuthServerURL.mpin_startsWith("http")) {
			this.opts.useWebSocket = false;
		}

		return this;
	};

	mpin.prototype.addHelp = function () {
		var hlpHtml;

//		hlpHtml = mpin._.template(mpin.template["help-tooltip"], {});
		hlpHtml = Handlebars.templates["help-tooltip"]();

		this.el.insertAdjacentHTML("afterend", hlpHtml);

		this.elHelpOverlay = document.getElementById("mpinHelpTag");
		this.elHelp = document.getElementById("mpinHelpContainer");
	};

	mpin.prototype.readyHtml = function (tmplName, tmplData) {
		var data = tmplData, html;

		/*
		 mpin._.extend(data, {hlp: hlp, cfg: this.cfg});
		 html = mpin._.template(mpin.template[tmplName], data);
		 */
		html = Handlebars.templates[tmplName]({data: data, cfg: this.cfg});
		if (html[0] !== "<") {
			html = html.substr(1);
		}
		return html;
	};

	mpin.prototype.render = function (tmplName, callbacks, tmplData) {
		var data = tmplData || {}, k, self = this, homeElem;

		this.el.innerHTML = this.readyHtml(tmplName, data);
		for (k in callbacks) {
			if (document.getElementById(k)) {
				document.getElementById(k).onclick = callbacks[k];
			}
		}

		//mpin_home - can remove all mpin_home definition
		homeElem = document.getElementById("mpin_home");
		if (homeElem && !callbacks.mpin_home) {
			homeElem.onclick = function () {
				self.renderHome.call(self);
			};
		}

		if (typeof mpin.custom !== 'undefined') {
			this.setCustomStyle();
		}
	};

	/**
	 * funciton	setLanguageText
	 * 
	 * replace lang with customLanguageTexts
	 */
	mpin.prototype.setLanguageText = function () {
		hlp.language = this.language;
		//		setLanguageText
		if (this.opts.customLanguageTexts && this.opts.customLanguageTexts[this.language]) {
			for (var k in this.opts.customLanguageTexts[this.language]) {
				if (lang[this.language][k]) {
					lang[this.language][k] = this.opts.customLanguageTexts[this.language][k];
				}
			}
		}
	};

	mpin.prototype.toggleHelp = function () {
		if (this.elHelpOverlay.style.display === "block") {
			this.elHelpOverlay.style.display = "none";
			this.elHelpOverlay.style.opacity = "0";
			this.elHelp.style.display = "none";
		} else {
			this.elHelpOverlay.style.display = "block";
			this.elHelpOverlay.style.opacity = "1";
			this.elHelp.style.display = "block";
		}
	};

	//////////////////////// //////////////////////// //////////////////////// 
	//////////////////////// RENDERS BEGIN FROM HERE
	//////////////////////// //////////////////////// //////////////////////// 

	//landing Page
	mpin.prototype.renderLanding = function () {
		var callbacks = {}, self = this, totalAccounts;

		function clearIntervals () {
			clearInterval(self.intervalID);
			clearTimeout(self.intervalID2);
		}
		;

		clearIntervals();

		totalAccounts = this.ds.getAccounts();
		totalAccounts = Object.keys(totalAccounts).length;
		if (totalAccounts >= 1) {
			this.renderLogin();
			return;
		}

		//check for prerollid
		if (this.opts.prerollid) {
			var userId = self.getDisplayName(this.identity);
			clearIntervals();
			//check if this identity is not register already !!!
			if (!this.identity && userId !== this.opts.prerollid) {
				this.actionSetupHome(this.opts.prerollid);
				return;
			}
		}



		callbacks.mpinLogo = function (evt) {
			clearIntervals();
			self.renderHome.call(self, evt);
		};

		callbacks.mpin_action_setup = function () {
			clearIntervals();
			self.renderMobileSetup.call(self);
		};

		callbacks.mpin_desktop = function () {
			clearIntervals();
			self.renderHome.call(self);
		};

		callbacks.mpin_access_help = function () {
			self.lastView = "renderLanding";
			self.toggleHelp.call(self);
			self.renderHelpTooltip.call(self, "landing1");
		};

		callbacks.mpin_help = function () {
			self.lastView = "renderLanding";
			self.toggleHelp.call(self);
			self.renderHelpTooltip.call(self, "landing2");
		};

		callbacks.mpin_desktop_hub = function () {
			clearIntervals();
			self.lastView = "renderLanding";
			self.renderHelpHub.call(self);
		};

		this.render("landing", callbacks);

		this.getAccessNumber();
	};


	mpin.prototype.renderHome = function () {
		var callbacks = {}, self = this;

		if (this.opts.prerollid) {
			var userId = self.getDisplayName(this.identity);
			//check if this identity is not register already !!!
			if (!this.identity && userId !== this.opts.prerollid) {
				this.actionSetupHome(this.opts.prerollid);
				return;
			}
		}

		callbacks.mpin_desktop = function () {
			self.renderDesktop.call(self);
		};

		callbacks.mpin_mobile = function () {
			self.renderMobile.call(self);
		};

		callbacks.mpin_help = function () {
			self.lastView = "renderHome";
			self.toggleHelp.call(self);
			self.renderHelpTooltip.call(self, "home");
		};

		this.render('home', callbacks);

		if (this.opts.onLoaded) {
			this.opts.onLoaded();
		}
	};

	//new View redirect to 
	//0 identity  - addIdentity
	//1 identity  - login
	mpin.prototype.renderDesktop = function () {
		var callbacks = {}, self = this, totalAccounts;

		totalAccounts = this.ds.getAccounts();
		totalAccounts = Object.keys(totalAccounts).length;

		if (totalAccounts === 0) {
			this.renderSetupHome();
		} else {
			this.renderLogin();
		}
		/*
		 else if (totalAccounts > 1) {
		 this.renderLogin(true);
		 }
		 */
	};

	mpin.prototype.renderMobile = function () {
		var callbacks = {}, self = this;

		function clearIntervals () {
			clearInterval(self.intervalID);
			clearTimeout(self.intervalID2);
		}
		;


		clearIntervals();
		callbacks.mp_action_home = function (evt) {
//			_request.abort();
			clearInterval(self.intervalID);
			clearTimeout(self.intervalID2);
			self.renderHome.call(self, evt);
		};

		callbacks.mpin_action_setup = function () {
			clearIntervals();
			self.renderMobileSetup.call(self);
//			self.renderMo
		};

		callbacks.mpinLogo = function (evt) {
			clearIntervals();
			self.renderHome.call(self, evt);
		};

		callbacks.mpin_desktop = function () {
			clearIntervals();
			self.renderDesktop.call(self);
		};
		callbacks.mpin_access_help = function () {
			self.lastView = "renderMobile";
			self.toggleHelp.call(self);
			self.renderHelpTooltip.call(self, "landing1");
		};
		callbacks.mpin_help = function () {
			self.lastView = "renderMobile";
			self.toggleHelp.call(self);
			self.renderHelpTooltip.call(self, "landing2");
		};

		if (!this.opts.accessNumberURL) {
			return this.error(4007);
		}

		this.render("mobile", callbacks);
		//get access
		this.getAccessNumber();
	};

	mpin.prototype.renderHelp = function (tmplName, callbacks, tmplData) {
		var k, self = this;
		tmplData = tmplData || {};

		this.elHelp.innerHTML = this.readyHtml(tmplName, tmplData);

		//parse directly to element...//handlebars cannot parse html tags...
		document.getElementById("mpin_help_text").innerHTML = tmplData.helpText;

		for (k in callbacks) {
			if (document.getElementById(k)) {
				document.getElementById(k).addEventListener('click', callbacks[k], false);
			}
		}

		//close tooltip by pressing I
		document.getElementById("mpinInfoCloseCorner").onclick = function () {
			self.toggleHelp.call(self);
		};
	};

	mpin.prototype.renderHelpTooltip = function (helpLabel) {
		var callbacks = {}, self = this, helpText, secondBtn = "";

		callbacks.mpin_help_ok = function () {
			self.toggleHelp.call(self);
		};

		callbacks.mpin_help_more = function () {
			//clear intervals
			if (self.intervalID) {
				clearInterval(self.intervalID);
			}
			if (self.intervalID2) {
				clearTimeout(self.intervalID2);
			}

			delete self.lastViewParams;
			self.toggleHelp.call(self);
			self.renderHelpHub.call(self);
		};

		if (helpLabel === "login" || helpLabel === "setup" || helpLabel === "loginerr") {
			secondBtn = hlp.text("help_text_" + helpLabel + "_button");

			if (helpLabel === "login" || helpLabel === "loginerr") {
				this.isLoginScreen = true;
				callbacks.mpin_help_second = function () {
					self.toggleHelp.call(self);
					self.renderLogin(true, "renderReactivatePanel");
				};
			} else if (helpLabel === "setup") {
				callbacks.mpin_help_second = function () {
					self.toggleHelp.call(self);
					self.renderHelpHubPage.call(self, 5);
				};
			}
		}

		helpText = hlp.text("help_text_" + helpLabel);

		this.renderHelp("help-tooltip-home", callbacks, {helpText: helpText, secondBtn: secondBtn});
	};

	mpin.prototype.renderHelpHub = function () {
		var callbacks = {}, self = this;

		callbacks.mpin_home = function () {
			self.renderHome.call(self);
		};
		callbacks.mpin_hub_li1 = function () {
			self.renderHelpHubPage.call(self, 1);
		};
		callbacks.mpin_hub_li2 = function () {
			self.renderHelpHubPage.call(self, 2);
		};
		callbacks.mpin_hub_li3 = function () {
			self.renderHelpHubPage.call(self, 3);
		};
		callbacks.mpin_hub_li4 = function () {
			self.renderHelpHubPage.call(self, 4);
		};
		callbacks.mpin_hub_li5 = function () {
			self.renderHelpHubPage.call(self, 5);
		};
		callbacks.mpin_hub_li6 = function () {
			self.renderHelpHubPage.call(self, 6);
		};
		callbacks.mpin_hub_li7 = function () {
			self.renderHelpHubPage.call(self, 7);
		};
		callbacks.mpin_hub_li8 = function () {
			self.renderHelpHubPage.call(self, 8);
		};
		callbacks.mpin_hub_li9 = function () {
			self.renderHelpHubPage.call(self, 9);
		};
		callbacks.mpin_hub_li10 = function () {
			self.renderHelpHubPage.call(self, 10);
		};

		callbacks.mpin_close_hub = function () {
			self.renderLastView.call(self);
		};
		this.render("help-hub", callbacks);
	};

	mpin.prototype.renderHelpHubPage = function (helpNumber) {
		var callbacks = {}, self = this, tmplName;

		callbacks.mpin_help_hub = function () {
			self.renderHelpHub.call(self);
		};
		tmplName = "help-hub-" + helpNumber;
		this.render(tmplName, callbacks);
	};

	//
	mpin.prototype.renderLastView = function () {
		var param1, param2;
		//for render accounts
		this.lastViewParams || (this.lastViewParams = []);
		param1 = this.lastViewParams[0] || false;
		param2 = this.lastViewParams[1] || false;
		console.info(">  lastVIEW :::", this.lastView);
		console.info(">  lastViewParams :::", this.lastViewParams);
		//call renderHome
		this[this.lastView](param1, param2);
	};

	mpin.prototype.renderSetupHome = function (email) {
		var callbacks = {}, self = this, userId, deviceName = "", deviceNameHolder = "";

		//set Temporary params if enter email and then press tooltip without submit request...
		function setTemp () {
			self.tmp || (self.tmp = {});
			self.tmp.setupEmail = document.getElementById("emailInput").value;
			if (self.opts.setDeviceName) {
				self.tmp.setupDeviceName = document.getElementById("deviceInput").value;
			}
		}

		callbacks.mpin_home = function () {
			delete self.tmp;
			self.renderHome.call(self);
		};
		callbacks.mpin_help = function () {
			setTemp();
			self.lastView = "renderSetupHome";
			self.toggleHelp.call(self);
			self.renderHelpTooltip.call(self, "addidentity");
		};
		callbacks.mpin_helphub = function () {
			setTemp();
			self.lastView = "renderSetupHome";
			self.renderHelpHub.call(self);
		};

		callbacks.mpin_setup = function () {
			delete self.tmp;
			self.actionSetupHome.call(self);
		};

		userId = (email) ? email : ((this.tmp && this.tmp.setupEmail) ? this.tmp.setupEmail : "");
		//one for 
		if (this.opts.setDeviceName) {
			//get from localStorage - already set
			if (this.ds.getDeviceName()) {
				deviceName = (this.tmp && this.tmp.setupDeviceName) ? this.tmp.setupDeviceName : this.ds.getDeviceName();
				deviceNameHolder = deviceName;
			} else {
				//set only placeholder value
				deviceName = (this.tmp && this.tmp.setupDeviceName) ? this.tmp.setupDeviceName : "";
				deviceNameHolder = this.suggestDeviceName();
			}

			//devicename callback
			callbacks.mpin_help_device = function () {
				setTemp();
				self.lastView = "renderSetupHome";
				self.toggleHelp.call(self);
				self.renderHelpTooltip.call(self, "devicename");
			};
		}

		this.render("setup-home", callbacks, {setDeviceName: this.opts.setDeviceName});

		//security Fixes
		var emailField = document.getElementById("emailInput");
		emailField.placeholder = hlp.text("setup_placeholder");
		emailField.value = userId;

		if (this.opts.setDeviceName) {
			var deviceNameField = document.getElementById("deviceInput");
			deviceNameField.placeholder = deviceNameHolder + " " + hlp.text("setup_device_default");
			deviceNameField.value = deviceName;
		}

		document.getElementById("emailInput").focus();
	};

	//with embeded animation
	mpin.prototype.renderSetupHome2 = function () {
		var renderElem, self = this, deviceName = "", deviceNameHolder = "";

		this.lastViewParams = [true, "renderSetupHome2"];

		//set Temporary params if enter email and then press tooltip without submit request...
		function setTemp () {
			self.tmp || (self.tmp = {});
			self.tmp.setup2Email = document.getElementById("emailInput").value;
			if (self.opts.setDeviceName) {
				self.tmp.setup2DeviceName = document.getElementById("deviceInput").value;
			}
		}

//		renderElem = document.getElementById("mpinUser");
		renderElem = document.getElementById("mpin_identities");

		if (this.opts.setDeviceName) {
			if (this.ds.getDeviceName()) {
				deviceName = (this.tmp && this.tmp.setup2DeviceName) ? this.tmp.setup2DeviceName : this.ds.getDeviceName();
				deviceNameHolder = deviceName;
			} else {
				deviceName = (this.tmp && this.tmp.setup2DeviceName) ? this.tmp.setup2DeviceName : "";
				deviceNameHolder = this.suggestDeviceName();
			}
		}

		renderElem.innerHTML = this.readyHtml("setup-home-2", {setDeviceName: this.opts.setDeviceName});
		renderElem.style.top = "0px";
//		removeClass("mpin_accounts_list", "mpHide");
		addClass("mpinCurrentIden", "mpHide");

		//security Fixes
		var emailValue, emailField = document.getElementById("emailInput");
		emailField.placeholder = hlp.text("setup_placeholder");

		emailValue = (this.tmp && this.tmp.setup2Email) ? this.tmp.setup2Email : "";
		emailField.value = emailValue;

		if (this.opts.setDeviceName) {
			var deviceNameField = document.getElementById("deviceInput");
			deviceNameField.placeholder = deviceNameHolder + " " + hlp.text("setup_device_default");
			deviceNameField.value = deviceName;
		}

		if (document.getElementById("mpin_help")) {
			document.getElementById("mpin_help").onclick = function () {
				setTemp();
				self.lastView = "renderLogin";
				self.lastViewParams = [true, "renderSetupHome2"];
				self.toggleHelp.call(self);
				self.renderHelpTooltip.call(self, "addidentity");
			};
		}


		document.getElementById("mpin_arrow").onclick = function (evt) {
			delete self.tmp;
//			addClass("mpin_help", "mpHide");
//			document.getElementById("mpin_help").style.display = "none";
			self.toggleButton();
			renderElem.style.top = "40px";
		};

		document.getElementById("mpin_setup").onclick = function () {
			delete self.tmp;
			self.actionSetupHome.call(self);
		};

		if (this.opts.setDeviceName && document.getElementById("mpin_help_device")) {
			document.getElementById("mpin_help_device").onclick = function () {
				setTemp();
				self.lastView = "renderLogin";
				self.lastViewParams = [true, "renderSetupHome2"];
				self.toggleHelp.call(self);
				self.renderHelpTooltip.call(self, "devicename");
			};
		}
	};

	mpin.prototype.renderOtp = function (authData) {
		var callbacks = {}, self = this, leftSeconds;

		//check if properties for seconds exist
		if (!authData.expireTime && !authData.nowTime) {
			self.error(4016);
			return;
		}

		function expire (expiresOn) {
			leftSeconds = (leftSeconds) ? leftSeconds - 1 : Math.floor((expiresOn - (new Date())) / 1000);
			if (leftSeconds > 0) {
				document.getElementById("mpin_seconds").innerHTML = leftSeconds + " " + hlp.text("mobileAuth_seconds");
			} else {
				//clear Interval and go to OTP expire screen.
				clearInterval(self.intervalExpire);
				self.renderOtpExpire();
			}
		}

		callbacks.mpin_home = function () {
			clearInterval(self.intervalExpire);
			self.renderHome.call(self);
		};

		callbacks.mpin_help = function () {
			clearInterval(self.intervalExpire);
			self.lastView = "renderOtp";
			self.renderHelpHub.call(self);
		};

		this.render("otp", callbacks);

		document.getElementById("mpinOTPNumber").innerHTML = authData._mpinOTP;

		var timeOffset = new Date() - new Date(authData.nowTime)
		var expireMSec = new Date(authData.expireTime + timeOffset);

		expire(expireMSec);

		this.intervalExpire = setInterval(function () {
			expire();
		}, 1000);
	};

	mpin.prototype.renderOtpExpire = function () {
		var callbacks = {}, self = this;

		callbacks.mpin_login_now = function () {
			self.renderLogin.call(self);
		};

		callbacks.mpin_help = function () {
			self.lastView = "renderOtpExpire";
			self.renderHelpHub.call(self);
		};

		this.render("otp-expire", callbacks);
	};

	mpin.prototype.suggestDeviceName = function () {
		var suggestName, platform, browser;
		platform = navigator.platform.toLowerCase();
//		browser = navigator.appCodeName;
		browser = navigator.userAgent;
		if (platform.indexOf("mac") !== -1) {
			platform = "mac";
		} else if (platform.indexOf("linux") !== -1) {
			platform = "lin";
		} else if (platform.indexOf("win") !== -1) {
			platform = "win";
		} else if (platform.indexOf("sun") !== -1) {
			platform = "sun";
		} else {
			platform = "__";
		}

		if (browser.indexOf("Chrome") !== -1) {
			browser = "Chrome";
		} else if (browser.indexOf("MSIE") !== -1 || browser.indexOf("Trident") !== -1) {
			browser = "Explorer";
		} else if (browser.indexOf("Firefox") !== -1) {
			browser = "Firefox";
		} else if (browser.indexOf("Safari") !== -1) {
			browser = "Safari";
		} else {
			browser = "_";
		}

		suggestName = platform + browser;

		return suggestName;
	};

	mpin.prototype.renderSetup = function (email, clientSecretShare, clientSecretParams) {
		var callbacks = {}, self = this;

		// temporary params >>> use from helpHUB & helpHubTOOLtip when interrupt the flow
		this.tmp || (this.tmp = {});
		console.log("email :::", email);
		console.log("email :::", (email != true));
		this.tmp.email = (email && email != true) ? email : this.tmp.email;
		this.tmp.clientSecretShare = (clientSecretShare) ? clientSecretShare : this.tmp.clientSecretShare;
		this.tmp.clientSecretParams = (clientSecretParams) ? clientSecretParams : this.tmp.clientSecretParams;

		//text || circle
		this.setupInputType = "text";

		callbacks.mpin_home = function (evt) {
			self.renderHome.call(self, evt);
		};
		callbacks.mpin_clear = function () {
			self.addToPin.call(self, "clear_setup");
		};

		//fix login ...
		callbacks.mpin_login = function () {
			var digitLen = self.pinpadInput.length;
			if (digitLen === self.cfg.pinSize) {
				self.actionSetup.call(self);
			}
		};
		callbacks.mpin_helphub = function (evt) {
			self.lastView = "renderSetup";
			delete self.lastViewParams;
			self.renderHelpHub.call(self);
		};

		callbacks.mpin_help_pinpad = function () {
			self.lastView = "renderSetup";
			delete self.lastViewParams;
			self.toggleHelp.call(self);
			self.renderHelpTooltip.call(self, "setup");
		};


		this.render("setup", callbacks, {email: this.tmp.email, pinSize: this.cfg.pinSize});
		this.enableNumberButtons(true);
		this.bindNumberButtons();

		//if none identity and prerollid is set remove HOME link
		if (this.opts.prerollid) {
			var userId = self.getDisplayName(this.identity);
			//check if this identity is not register already !!!
			if (userId === this.opts.prerollid) {
				document.getElementById("mpin_home").onclick = function () {
				};
			}
		}

		//requestSignature
		this.requestSignature(this.tmp.email, this.tmp.clientSecretShare, this.tmp.clientSecretParams);
	};

	mpin.prototype.renderLogin = function (listAccounts, subView) {
		var callbacks = {}, self = this;

		var identity = this.ds.getDefaultIdentity();
		var email = this.getDisplayName(identity);

		if (!identity) {
			this.renderSetupHome();
			return;
		}

		callbacks.mpin_home = function (evt) {
			self.renderHome.call(self, evt);
		};
		callbacks.mpin_clear = function () {
			self.addToPin.call(self, "clear");
		};
		callbacks.mpin_arrow = function () {
			self.addToPin.call(self, "clear");
			self.toggleButton.call(self);
		};
		callbacks.mpin_login = function () {
			self.actionLogin.call(self);
		};
		callbacks.mpin_helphub = function () {
//			self.lastView || (self.lastView = "renderLogin");
			self.lastView = "renderLogin";
			self.renderHelpHub.call(self);
		};
		callbacks.mpin_help_pinpad = function () {
			self.lastView = "renderLogin";
			self.toggleHelp.call(self);
			self.renderHelpTooltip.call(self, "login");
		};

		this.render("login", callbacks, {pinSize: this.cfg.pinSize});
		this.enableNumberButtons(true);
		this.bindNumberButtons();

		//fix - there are two more conditions ...
		if (listAccounts) {
			self.display(hlp.text("pinpad_default_message"));
//			this.ds.getDefaultIdentity()
			document.getElementById("mpinCurrentIden").innerHTML = this.getDisplayName(this.ds.getDefaultIdentity());
			this.toggleButton();

			if (subView) {
				this[subView]();
			}
		} else {
			addClass("mpinUser", "mpinIdentityGradient");
			this.setIdentity(this.ds.getDefaultIdentity(), true, function () {
				self.display(hlp.text("pinpad_default_message"));
			}, function () {
				return false;
			});
		}
	};

	mpin.prototype.getAccessNumber = function () {
		var _request = new XMLHttpRequest(), self = this, expire, drawTimer, timerEl, timer2d, totalSec;

		this.intervalID || (this.intervalID = {});

		//// TIMER CODE
		if (document.getElementById("mpTimer")) {
			timerEl = document.getElementById("mpTimer");
			timer2d = timerEl.getContext("2d");
		}
		//draw canvas Clock
		drawTimer = function (expireOn) {
			var start, diff;
			diff = totalSec - expireOn;
			start = -0.5 + ((diff / totalSec) * 2);
			start = Math.round(start * 100) / 100;

			timer2d.clearRect(0, 0, timerEl.width, timerEl.height);

			timer2d.beginPath();
			timer2d.strokeStyle = "#8588ac";
			timer2d.arc(20, 20, 18, start * Math.PI, 1.5 * Math.PI);
			timer2d.lineWidth = 5;
			timer2d.stroke();
		};

		////////////////// TIMER

		expire = function (expiresOn) {
			var expireAfter = Math.floor((expiresOn - (new Date())) / 1000);
			if (expireAfter <= 0) {
				if (self.intervalID) {
					clearInterval(self.intervalID);
				}
				self.getAccessNumber();
			} else {
				document.getElementById("mpin_seconds").innerHTML = expireAfter;
				//////////////////////////////////////////Clockwise
				///// Check if Timer Element exist some template did not have timer
				if (document.getElementById("mpTimer")) {
					drawTimer(expireAfter);
				}
			}
		};

		_request.onreadystatechange = function () {
			var jsonResponse, expiresOn;
			if (_request.readyState === 4 && _request.status === 200) {
				jsonResponse = JSON.parse(_request.responseText);
				document.getElementById("mpinAccessNumber").innerHTML = jsonResponse.accessNumber;
				if (jsonResponse.webOTT) {
					self.webOTT = jsonResponse.webOTT;
					if (self.intervalID2) {
						clearTimeout(self.intervalID2);
					}
					self.getAccess();
				}
				expiresOn = new Date();
				totalSec = jsonResponse.ttlSeconds;
				expiresOn.setSeconds(expiresOn.getSeconds() + jsonResponse.ttlSeconds);
				expire(expiresOn);
				self.intervalID = setInterval(function () {
					expire(expiresOn);
				}, 1000);
			} else if (_request.readyState === 4) {
				//get access Number is down or broken
				self.error(4014);
			}
		};
		_request.open("POST", this.opts.getAccessNumberURL);
//		_request.setRequestHeader('Content-Type', 'application/json');
		_request.send();
	};

	//post REQUEST wait for LOGIN
	mpin.prototype.getAccess = function () {
		var _request = new XMLHttpRequest(), self = this;
		_request.onreadystatechange = function () {
			var _jsonRes;
			if (_request.readyState === 4) {
				if (_request.status === 200) {
					_jsonRes = JSON.parse(_request.responseText);
//					self.successLogin(_jsonRes);

					var mpinResponse = _jsonRes;
					var handleToken = function (success, errorCode, errorMessage, authData) {
						if (success) {
							self.successLogin.call(self, authData);
						} else {
							self.renderHome.call(self);
						}
					};

					// Do RPA Authentication
					sendAuthToken(self.opts.authenticateURL, mpinResponse, handleToken, self.opts.authenticateRequestFormatter, self.opts.customHeaders, function () {
						self.successLogin.call(self);
					});


				} else if (!this.intervalID2) {
					self.intervalID2 = setTimeout(function () {
						self.getAccess.call(self);
					}, 3000);
				}
			}
		};

		_request.open("POST", this.opts.accessNumberURL, true);
		_request.timeout = 30000;
		_request.ontimeout = function () {
			self.getAccess();
		};
		var _sendParams = {};
		if (this.webOTT) {
			_sendParams.webOTT = this.webOTT;
			if (this.opts.accessNumberRequestFormatter) {
				_sendParams = this.opts.accessNumberRequestFormatter(_sendParams);
			}
			_request.send(JSON.stringify(_sendParams));
		} else {
			_request.send();
		}
	};

	mpin.prototype.renderMobileSetup = function () {
		var callbacks = {}, self = this, qrElem;

		callbacks.mpin_home = function () {
			self.renderHome.call(self);
		};
		callbacks.mpinbtn_mobile = function () {
			self.renderMobile.call(self);
		};
		callbacks.mpin_helphub = function () {
			self.lastView = "renderMobileSetup";
			self.renderHelpHub.call(self);
		};

		if (!this.opts.mobileAppFullURL) {
			return this.error(4006);
		}

		this.render("mobile-setup", callbacks, {mobileAppFullURL: this.opts.mobileAppFullURL});

		qrElem = document.getElementById("mpin_qrcode");

		new QRCode(qrElem, {
			text: this.opts.mobileAppFullURL,
			width: 129,
			height: 129
		});
	};

	mpin.prototype.renderActivateIdentity = function () {
		var callbacks = {}, self = this, email;
		email = this.getDisplayName(this.identity);

		callbacks.mpin_home = function (evt) {
			self.renderHome.call(self, evt);
		};

		callbacks.mpin_helphub = function (evt) {
			self.lastView = "renderActivateIdentity";
			self.renderHelpHub.call(self);
		};

		callbacks.mpin_activate = function () {
			if (self.checkBtn(this))
				self.beforeRenderSetup.call(self, this);
		};
		callbacks.mpin_resend = function () {
			if (self.checkBtn(this))
				self.actionResend.call(self, this);
		};

		this.render("activate-identity", callbacks, {email: email});
	};

	mpin.prototype.mpinButton = function (btnElem, busyText) {
		var oldHtml = btnElem.innerHTML;
		addClass(btnElem, "mpinBtnBusy");
		btnElem.innerHTML = "<span class='btnLabel'>" + hlp.text(busyText) + "</span>";
		return {
			error: function (errorText) {
				removeClass(btnElem, "mpinBtnBusy");
				addClass(btnElem, "mpinBtnError");
				btnElem.innerHTML = "<span class='btnLabel'>" + hlp.text(errorText) + "</span>";
				setTimeout(function () {
					removeClass(btnElem, "mpinBtnError");
					btnElem.innerHTML = oldHtml;
				}, 1500);

			}, ok: function (okText) {
				removeClass(btnElem, "mpinBtnBusy");
				addClass(btnElem, "mpinBtnOk");
				btnElem.innerHTML = "<span class='btnLabel'>" + hlp.text(okText) + "</span>";
				setTimeout(function () {
					removeClass(btnElem, "mpinBtnOk");
					btnElem.innerHTML = oldHtml;
				}, 1500);
			}};
	};

	mpin.prototype.beforeRenderSetup = function (btnElem) {
		var _reqData = {}, regOTT, url, self = this;
		regOTT = this.ds.getIdentityData(this.identity, "regOTT");
		url = this.opts.signatureURL + "/" + this.identity + "?regOTT=" + regOTT;

		if (btnElem) {
			var btn = this.mpinButton(btnElem, "setupNotReady_check_info1");
		}

		_reqData.URL = url;
		_reqData.method = "GET";

		//get signature
		requestRPS(_reqData, function (rpsData) {
			if (rpsData.errorStatus === 401) {
				if (btn)
					btn.error("setupNotReady_check_info2");
				//NOT ACTIVATE identity :::
				self.error("Activate identity");
				return;
			} else if (rpsData.errorStatus) {
				//client dta is DOWN (error 500)
				self.error(4013);
				return;
			}

			var userId = self.getDisplayName(self.identity);
			self.renderSetup(userId, rpsData.clientSecretShare, rpsData.params);
		});

	};

//custom render 
	mpin.prototype.renderAccountsPanel = function () {
		var self = this, renderElem, addEmptyItem, c = 0, defaultIdentity;

		if (!this.identity) {
			self.setIdentity(self.ds.getDefaultIdentity(), false);
		}

		addEmptyItem = function (cnt) {
			var p = document.createElement("div");
			p.className = "mp_contentEmptyItem";
			cnt.appendChild(p);
		};

		// Add logic to close the identity screen
		var menuBtn = document.getElementById('mpin_arrow');
		addClass(menuBtn, "mpinAUp");

		//inner ELEMENT
		renderElem = document.getElementById("mpin_identities");
		renderElem.innerHTML = this.readyHtml("accounts-panel", {});
		renderElem.style.display = "block";

		// button
		document.getElementById("mpin_add_identity").onclick = function () {
			self.renderSetupHome2.call(self);
		};
		// button
		document.getElementById("mpin_phone").onclick = function () {
			self.renderMobileSetup.call(self);
		};


		//arrow show pinpad
		menuBtn.onclick = function () {

			document.getElementById('mpinUser').style.height = "";
			removeClass(menuBtn, 'mpinClose');
			//setIdentity if empty

			if (document.getElementById("mpinUser").innerHTML === "") {

				self.setIdentity(self.ds.getDefaultIdentity(), true, function () {
					self.display(hlp.text("pinpad_default_message"));
				}, function () {
					return false;
				});
			}

			self.toggleButton.call(self);
		};


		//default IDENTITY
		var cnt = document.getElementById("mpin_accounts_list");
		defaultIdentity = this.ds.getDefaultIdentity();
		if (defaultIdentity) {
			this.addUserToList(cnt, defaultIdentity, true, 0);
		}
		//bug1 default identity
		//REMOVE THIS
//		this.addUserToList(cnt, "7b226d6f62696c65223a20302c2022697373756564223a2022323031342d31302d30332030393a30373a34362e313236313931222c2022757365724944223a2022626f79616e2e62616b6f76406365727469766f782e636f6d222c202273616c74223a202230313432376230303939353933653366227d", false, 4);

		for (var i in this.ds.getAccounts()) {
			c += 1;
			if (i != defaultIdentity)
				this.addUserToList(cnt, i, false, c);
		}
		/*
		 addEmptyItem(cnt);
		 */
	};

	mpin.prototype.renderUserSettingsPanel = function (iD) {
		var renderElem, name, self = this;

		name = this.getDisplayName(iD);

		//lastView settings
		this.lastViewParams = [true, "renderUserSettingsPanel"];
		this.isLoginScreen = false;

//		renderElem = document.getElementById("mpin_identities");
		renderElem = document.getElementById("mpinUser");
//		renderElem = document.getElementById("mp_accountListView");
		renderElem.innerHTML = this.readyHtml("user-settings", {name: name});

		this.lastView = "renderUserSettingsPanel";

		document.getElementById("mpin_deluser_btn").onclick = function (evt) {
			self.renderDeletePanel.call(self, iD);
		};
		document.getElementById("mpin_reactivate_btn").onclick = function (evt) {
			self.renderReactivatePanel.call(self, iD);
		};
		document.getElementById("mpin_cancel_btn").onclick = function (evt) {
			self.renderLogin.call(self, true);
		};
	};

	mpin.prototype.renderReactivatePanel = function (iD) {
		var renderElem, name, self = this;
		name = this.getDisplayName(iD);

		this.lastViewParams = [true, "renderReactivatePanel"];

//		renderElem = document.getElementById("mpin_identities");
		renderElem = document.getElementById("mpinUser");
		renderElem.innerHTML = this.readyHtml("reactivate-panel", {name: name});


		document.getElementById("mpin_reactivate_btn").onclick = function () {
			self.actionSetupHome.call(self, self.getDisplayName(iD));
		};
		document.getElementById("mpin_cancel_btn").onclick = function () {
			//self.renderAccountsPanel();
			self.renderLogin.call(self, !self.isLoginScreen);
		};
	};

	mpin.prototype.renderDeletePanel = function (iD) {
		var renderElem, name, self = this;
		name = this.getDisplayName(iD);

		this.lastViewParams = [true, "renderDeletePanel"];

		renderElem = document.getElementById("mpinUser");
		addClass(renderElem, "mpPaddTop10");
		renderElem.innerHTML = this.readyHtml("delete-panel", {name: name});

		document.getElementById("mpin_deluser_btn").onclick = function (evt) {
			self.deleteIdentity(iD);
		};

		document.getElementById("mpin_cancel_btn").onclick = function (evt) {
			self.renderLogin.call(self, true);
		};
	};

	mpin.prototype.renderSetupDone = function () {
		var callbacks = {}, self = this, userId;

		userId = this.getDisplayName(this.identity);

		callbacks.mpin_home = function () {
			self.renderHome.call(self);
		};
		callbacks.mpin_login_now = function () {
			self.renderLogin.call(self);
		};
		callbacks.mpin_helphub = function () {
			self.lastView = "renderSetupDone";
			self.renderHelpHub.call(self);
		};


		this.render("setup-done", callbacks, {userId: userId});
	};

	//after warning
	mpin.prototype.renderDeleteWarning = function (userId) {
		var callbacks = {}, self = this, userId;

		callbacks.mpin_home = function () {
			self.renderHome.call(self);
		};
		callbacks.mp_action_go = function () {
//			self.renderLogin.call(self);
			self.renderSetupHome.call(self, userId);
		};

		callbacks.mpin_helphub = function () {
			self.lastView = "renderDeleteWarning";
			self.lastViewParams = [userId];
			self.renderHelpHub.call(self);
		};

		this.render("delete-warning", callbacks, {userId: userId});
	};

	mpin.prototype.addUserToList = function (cnt, uId, isDefault, iNumber) {
		var rowClass, self = this;

		rowClass = (isDefault) ? "mpinRow mpinRowActive" : "mpinRow";

		var name = this.getDisplayName(uId);
		var userRow = document.createElement("li");
		userRow.setAttribute("data-identity", uId);
		userRow.className = rowClass;

		userRow.innerHTML = Handlebars.templates['user-row']({data: {name: name}});
		//security Fixes
		userRow.children[0].id = "mpin_settings_" + iNumber;
		userRow.children[1].title = name;
		userRow.children[1].setAttribute("alt", name);

		cnt.appendChild(userRow);

		document.getElementById("mpin_settings_" + iNumber).onclick = function (ev) {
			self.renderUserSettingsPanel.call(self, uId);
			ev.stopPropagation();
			return false;
		};

		userRow.onclick = function () {
			self.ds.setDefaultIdentity(uId);
			self.setIdentity(uId, true, function () {
				self.display(hlp.text("pinpad_default_message"));
			}, function () {
				self.error(4008);
				return false;
			});
			return false;
		};

		userRow.ondblclick = function () {
			self.toggleButton.call(self);
		};
	};

	//prevent mpin button multi clicks
	mpin.prototype.checkBtn = function (btnElem) {
		var btnClass = btnElem.className;
		return (btnClass.indexOf("mpinBtnBusy") === -1 && btnClass.indexOf("mpinBtnError") === -1 && btnClass.indexOf("mpinBtnOk") === -1);
	};

	mpin.prototype.renderIdentityNotActive = function (email) {
		var callbacks = {}, self = this;

		email = (email) ? email : this.getDisplayName(this.identity);

		callbacks.mp_action_home = function (evt) {
			self.renderHome.call(self, evt);
		};

		//Check again
		callbacks.mpin_activate_btn = function () {
			if (self.checkBtn(this))
				self.beforeRenderSetup.call(self, this);
		};

		//email
		callbacks.mpin_resend_btn = function () {
			if (self.checkBtn(this))
				self.actionResend.call(self, this);
		};

		callbacks.mpin_accounts_btn = function () {
//			self.renderLogin.call(self, true, email);
			self.renderLogin.call(self, true);
		};
		callbacks.mpin_helphub = function (evt) {
			self.lastView = "renderIdentityNotActive";
			self.renderHelpHub.call(self);
		};

		this.render("identity-not-active", callbacks, {email: email});
	};

	mpin.prototype.bindNumberButtons = function () {
		var self = this, btEls;
		btEls = document.getElementsByClassName("mpinPadBtn");

		for (var i = 0; i < btEls.length; i++) {
			btEls[i].onclick = function (el) {
				self.addToPin(el.target.getAttribute("data-value"));
				return false;
			};
		}
	};


	mpin.prototype.enableNumberButtons = function (enable) {
		var els = document.getElementsByClassName("mpinPadBtn");
		for (var i = 0; i < els.length; i++) {
			var element = els[i];
			if (enable && !element.id) {
				element.className = "mpinPadBtn";
				element.disabled = false;
			} else if (!element.id) {
				element.className = "mpinPadBtn mpinBtnDisabled";
				element.disabled = true;
			}
		}
	};

	//
	mpin.prototype.addToPin = function (digit) {
		var digitLen;
		this.pinpadInput || (this.pinpadInput = "");

		this.pinpadInput += digit;
		digitLen = this.pinpadInput.length;

		if (this.setupInputType === "text") {
			addClass("mpin_input_text", "mpHide");
			removeClass("mpin_input_circle", "mpHide");
			removeClass("mpin_input_parent", "mpinInputError");
			this.setupInputType = "circle";
		}

		if (digitLen <= this.cfg.pinSize) {
			this.display();
		}

		if (digitLen === 1) {
			this.enableButton(true, "clear");
		} else if (digitLen === this.cfg.pinSize) {
			this.enableNumberButtons(false);
			this.enableButton(true, "go");
		}

		//click clear BUTTON
		if (digit === 'clear') {
			this.display(hlp.text("pinpad_default_message"));
			this.enableNumberButtons(true);
			this.enableButton(false, "go");
			this.enableButton(false, "clear");
		} else if (digit === 'clear_setup') {
			this.display(hlp.text("pinpad_setup_screen_text"), false);
			this.enableNumberButtons(true);
			this.enableButton(false, "go");
			this.enableButton(false, "clear");
		}
	};

	/**
	 *	wrap all buttons function inside ...
	 * 
	 * @param {type} enable
	 * @param {type} buttonName
	 * @returns {undefined}
	 */
	mpin.prototype.enableButton = function (enable, buttonName) {
		var buttonValue = {}, _element;
		buttonValue.go = {id: "mpin_login", trueClass: "mpinPadBtn2", falseClass: "mpinPadBtn2 mpinBtnDisabled"};
		buttonValue.clear = {id: "mpin_clear", trueClass: "mpinPadBtn2", falseClass: "mpinPadBtn2 mpinBtnDisabled"};
		buttonValue.toggle = {id: "mp_toggleButton", trueClass: "mp_DisabledState", falseClass: ""};
		_element = document.getElementById(buttonValue[buttonName].id);
		if (!buttonValue[buttonName] || !_element) {
			return;
		}

		_element.disabled = !enable;
		_element.className = buttonValue[buttonName][enable + "Class"];
	};
	//showInPinPadDisplay
	mpin.prototype.display = function (message, isErrorFlag) {
		var removeCircles, self = this, textElem;

		removeCircles = function () {
			var pinSize = self.cfg.pinSize + 1, circles = [];
			for (var i = 1; i < pinSize; i++) {
				circles[i] = document.getElementById("mpin_circle_" + i);
				if (circles[i] && circles[i].childNodes[3]) {
					circles[i].removeChild(circles[i].childNodes[3]);
				}
			}
		};

		textElem = document.getElementById("mpin_inner_text");
		if (!message && !isErrorFlag) {

			var newCircle = document.createElement('div');
			newCircle.className = "mpinCircleIn";
			var circleID = "mpin_circle_" + (this.pinpadInput.length - 1);
			document.getElementById(circleID).appendChild(newCircle);
		} else if (!isErrorFlag) {
			removeCircles();

			this.pinpadInput = "";
			removeClass("mpin_input_text", "mpHide");
			addClass("mpin_input_circle", "mpHide");
			this.setupInputType = "text";
			if (textElem) {
				textElem.innerHTML = message;
			}
		} else {
			//error MESSAGE 
			removeCircles();
			this.pinpadInput = "";
			removeClass("mpin_input_text", "mpHide");
			addClass("mpin_input_parent", "mpinInputError");
			addClass("mpin_input_circle", "mpHide");
			this.setupInputType = "text";
			if (textElem) {
				textElem.innerHTML = message;
			}
		}
	};


	mpin.prototype.getDisplayName = function (uId) {
		if (!uId)
			uId = this.identity;
		try {
			return JSON.parse(mp_fromHex(uId)).userID;
		} catch (err) {
			return uId;
		}
	};


	mpin.prototype.toggleButton = function () {
		var pinpadElem, idenElem, menuBtn, userArea, identity;

		pinpadElem = document.getElementById("mpin_pinpad");
		idenElem = document.getElementById("mpin_identities");
		menuBtn = document.getElementById("mpin_arrow");
		userArea = document.getElementById("mpinUser");

		if (!pinpadElem) {
			console.log("missing ELement.");
			return;
		}

		//list identities
		if (menuBtn && !menuBtn.classList.contains("mpinAUp")) {
			this.lastViewParams = [true];
//			document.getElementById("mpinUser").style.height = "88.5%";
			addClass(userArea, "mpUserFat");
			addClass(menuBtn, "mpinClose");
			this.renderAccountsPanel();
			removeClass("mpinUser", "mpinIdentityGradient");

		} else {
			//if identity not Active render ACTIVATE
			if (this.ds.getIdentityToken(this.identity) == "") {
				identity = this.getDisplayName(this.identity);
				this.renderIdentityNotActive(identity);
				return;
			}

			//clear padScreen on flip screens
			this.addToPin("clear");
			removeClass(userArea, "mpUserFat");
			addClass(userArea, "mpUserSlim");
//			document.getElementById("mpinUser").style.height = "40px";
			removeClass(menuBtn, "mpinAUp");
			//if come from add identity remove HIDDEN
			removeClass("mpinCurrentIden", "mpHide");
			addClass("mpinUser", "mpinIdentityGradient");

			this.lastViewParams = [false];
		}
		return false;
	};

	/*
	 * 
	 */

	//error PAGE 
	mpin.prototype.renderError = function (error) {
		var callbacks = {}, errorMsg, errorCode = "";

		if (error === parseInt(error)) {
			if (!hlp.language) {
				hlp.language = this.cfg.language;
			}
			errorCode = (error === 4009) ? hlp.text("error_not_auth") : error;
			errorMsg = hlp.text("error_code_" + error);
		} else {
			errorMsg = error;
		}
		console.log("errorCode :::", errorCode);
		console.log("errorMsg :::", errorMsg);
		this.render("error", callbacks, {errorMsg: errorMsg, errorCode: errorCode});
	};

	mpin.prototype.renderBlank = function () {
		var callbacks = {}, self = this;

		callbacks.mpin_home = function () {
			self.renderHome.call(self);
		};

		callbacks.mpin_arrow = function () {
			self.toggleButton.call(self);
		};
//		console.log(" OPTS :::", this.opts.setDeviceName);
//		this.render("blank", callbacks);
//		this.render("mobile", callbacks, {setDeviceName: this.opts.setDeviceName});
		this.render("mobile", callbacks);

		this.getAccessNumber();
	};

	mpin.prototype.actionSetupHome = function (uId) {
		var _email, _deviceName, _deviceNameInput, _reqData = {}, self = this;

		_email = (uId) ? uId : document.getElementById("emailInput").value;

		if ((_email.length === 0 || !this.opts.identityCheckRegex.test(_email)) && !(this.opts.prerollid)) {
			document.getElementById("emailInput").focus();
			return;
		}

		_reqData.URL = this.opts.registerURL;
		_reqData.method = "PUT";
		_reqData.data = {
			userId: _email,
			mobile: 0
		};

		_deviceNameInput = (document.getElementById("deviceInput")) ? document.getElementById("deviceInput").value : "";
		//DEVICE NAME
		if (!this.ds.getDeviceName() && _deviceNameInput === "") {
			console.log("case NONE");
			_deviceName = this.suggestDeviceName();
		} else if (!this.ds.getDeviceName() && _deviceNameInput !== "") {
			console.log("case have INPUT");
			_deviceName = _deviceNameInput;
		} else if (_deviceNameInput !== this.ds.getDeviceName()) {
			console.log("case change");
			_deviceName = _deviceNameInput;
		} else {
			_deviceName = false;
		}

		if (_deviceName) {
			_reqData.data.deviceName = _deviceName;
			this.ds.setDeviceName(_deviceName);
		}


		if (this.opts.registerRequestFormatter) {
			_reqData.postDataFormatter = this.opts.registerRequestFormatter;
		}
		if (this.opts.customHeaders) {
			_reqData.customHeaders = this.opts.customHeaders;
		}

		console.log("_reqData ::::", _reqData);
		//register identity
		requestRPS(_reqData, function (rpsData) {
			if (rpsData.errorStatus === 403) {
				self.error(4009);
				return;
			} else if (rpsData.error || rpsData.errorStatus) {
				self.error(4010);
				return;
			}
			self.ds.addIdentity(rpsData.mpinId, "");
			self.ds.setIdentityData(rpsData.mpinId, {regOTT: rpsData.regOTT});

			//bug fix
			self.ds.setDefaultIdentity(rpsData.mpinId);

			self.identity = rpsData.mpinId;

			// Check for existing userid and delete the old one
			self.ds.deleteOldIdentity(rpsData.mpinId);
			//active = true pass activate IDNETITY Screen
			if (rpsData.active) {
				self.beforeRenderSetup();
			} else {
				self.renderActivateIdentity();
			}
		});
	};

	mpin.prototype.requestSignature = function (email, clientSecretShare, clientSecretParams) {
		var self = this;

		requestClientSecret(self.certivoxClientSecretURL(clientSecretParams), clientSecretShare, function (clientSecret) {
			self.enableNumberButtons(true);

			self.clientSecret = clientSecret;
			self.display(hlp.text("pinpad_setup_screen_text"), false);

			if (self.opts.onGetSecret) {
				self.opts.onGetSecret();
			}
		}, function (message, code) {
			self.error(message, code);
		});
	};

	mpin.prototype.error = function (msg) {
		if (this.opts && this.opts.onError) {
			this.opts.onError(msg);
		} else if (msg === parseInt(msg)) {
//			console.error("Error : " + msg);
			this.renderError(msg);
		} else {
			console.error("Error : " + msg);
		}
	};

	mpin.prototype.actionResend = function (btnElem) {
		var self = this, _reqData = {}, regOTT, _email, btn;

		console.log("this identity :::", this.identity);
		regOTT = this.ds.getIdentityData(this.identity, "regOTT");
		_email = this.getDisplayName(this.identity);

		btn = this.mpinButton(btnElem, "setupNotReady_resend_info1");

		_reqData.URL = this.opts.registerURL;
		_reqData.URL += "/" + this.identity;
		_reqData.method = "PUT";
		_reqData.data = {
			userId: _email,
			mobile: 0,
			regOTT: regOTT
		};
		if (this.opts.registerRequestFormatter) {
			_reqData.postDataFormatter = this.opts.registerRequestFormatter;
		}
		if (this.opts.customHeaders) {
			_reqData.customHeaders = this.opts.customHeaders;
		}

		//resend email 
		// add identity into URL + regOTT
		requestRPS(_reqData, function (rpsData) {
			if (rpsData.error || rpsData.errorStatus) {
				self.error("Resend problem");
				return;
			}

			if (self.identity !== rpsData.mpinId) {
				console.log("mpin CHANGED : ", rpsData.mpinId);

				//delete OLD mpinID
				self.ds.deleteIdentity(self.identity);

				//asign new one, create & set as default
				self.identity = rpsData.mpinId;
				self.ds.addIdentity(self.identity, "");
				self.ds.setDefaultIdentity(self.identity);
			}

			//should be already exist only update regOTT
			self.ds.setIdentityData(self.identity, {regOTT: rpsData.regOTT});

			// Check for existing userid and delete the old one
			self.ds.deleteOldIdentity(rpsData.mpinId);



			btn.ok("setupNotReady_resend_info2");
		});
	};

	mpin.prototype.actionSetup = function () {
		var self = this, _pin;
		_pin = this.pinpadInput;
		this.ds.addIdentity(this.identity, "");
		this.display("Verifying PIN...");

		extractPIN(_pin, this.clientSecret, this.identity, function (tokenHex) {
			self.ds.setIdentityToken(self.identity, tokenHex);
			self.clientSecret = "";

			self.enableNumberButtons(false);
			self.enableButton(false, "go");

			self.ds.setDefaultIdentity(self.identity);
			self.ds.deleteOldIdentity(self.identity);

			self.display(hlp.text("setupPin_pleasewait"), false);
			if (self.opts.setupDoneURL) {
				var _reqData = {}, url = self.opts.setupDoneURL + "/" + self.identity;

				_reqData.URL = url;
				_reqData.method = "POST";
				_reqData.data = {};

				//get signature
				requestRPS(_reqData, function (rpsData) {
					if (rpsData.error || rpsData.errorStatus) {
						self.error(4011);
						return;
					} else {
						//success
						self.successSetup(rpsData);
					}

				});
			} else {
				self.successSetup();
			}
		});
	};
	/**
	 * 
	 * @returns {undefined}
	 */
	mpin.prototype.actionLogin = function () {
		var authServer, getAuth, self = this, pinValue;
		pinValue = this.pinpadInput;
		//AlertMessage.clearDisplayWrap();
		this.enableNumberButtons(false);
		this.enableButton(false, "go");
		this.enableButton(false, "clear");
		this.enableButton(true, "toggle");

		this.display(hlp.text("authPin_pleasewait"));

		//getAuth = this.opts.useWebSocket ? getAuthToken : getAuthTokenAjax;
		//authServer = this.opts.mpinAuthServerURL;
		if (this.opts.useWebSocket) {
			getAuth = getAuthToken;
			authServer = this.opts.mpinAuthServerURL + "/authenticationToken";
		} else {
			getAuth = getAuthTokenAjax;
			authServer = this.opts.mpinAuthServerURL;
		}

		//authServer = this.opts.authenticateURL;
		getAuth(authServer, this.opts.appID, this.identity, this.ds.getIdentityPermit(this.identity), this.ds.getIdentityToken(this.identity),
				this.opts.requestOTP, "0", pinValue, this.opts.authenticateURL, this.opts.authenticateRequestFormatter, this.opts.customHeaders,
				function (success, errorCode, errorMessage, authData) {
					console.log("authenticate arguments :", arguments);
					if (success) {
						console.log(" >>> getAuth :::", authData);
						if (self.opts.requestOTP) {
							self.renderOtp(authData);
							return;
						}
						self.successLogin(authData);
					} else if (errorCode === "INVALID") {
						self.display(hlp.text("authPin_errorInvalidPin"), true);

						document.getElementById("mpin_help_pinpad").onclick = function () {
							self.lastView = "renderLogin";
							self.toggleHelp.call(self);
							self.renderHelpTooltip.call(self, "loginerr");
						};

					} else if (errorCode === "MAXATTEMPTS") {
						var iD = self.identity;
						self.deleteIdentity(iD, true);
						if (self.opts.onAccountDisabled) {
							self.opts.onAccountDisabled(iD);
						}
						return;
					} else if (errorCode === "NOTAUTHORIZED") {
						self.display(hlp.text("authPin_errorNotAuthorized"), true);
					} else if (errorCode === "EXPIRED") {
						self.display(hlp.text("authPin_errorExpired"), true);
					} else {
						//error INVOCATION
						self.display(hlp.text("authPin_errorServer"), true);
					}

					self.enableNumberButtons(true);
					self.enableButton(false, "go");
					self.enableButton(false, "clear");
					self.enableButton(true, "toggle");
					/////// change onClick helpTooltip
					// change previous state from login render 
				}, function () {
			console.log(" Before HandleToken ::::");
		});

	};

	mpin.prototype.setIdentity = function (newIdentity, requestPermit, onSuccess, onFail) {
		var displayName, accId, self = this;
		if ((typeof (newIdentity) === "undefined") || (!newIdentity)) {
			displayName = "";
		} else {
			this.identity = newIdentity;
			displayName = this.getDisplayName(this.identity);
		}

		accId = document.getElementById('mpinCurrentIden');

		if (accId) {
			accId.innerHTML = displayName;
			accId.setAttribute("title", displayName);
		}


		// no Identity go to setup HOME
		if (!this.identity) {
			this.renderSetupHome();
			return;
		}

		if (requestPermit) {

			//new flow v0.3
			if (this.ds.getIdentityToken(this.identity) == "") {
				this.renderIdentityNotActive(displayName);
				return;
			}

			this.addToPin("clear");
			this.display(hlp.text("pinpad_initializing"), false);

			this.enableNumberButtons(false);
			this.enableButton(false, "go");
			this.enableButton(false, "clear");
			this.enableButton(true, "toggle");
//			mpin.enableToggleButton(true);
			this.requestPermit(newIdentity, function (timePermitHex) {
				self.enableNumberButtons(true);
				onSuccess();
			}, function (message, statusCode) {
				if (statusCode === 404) {
					self.renderIdentityNotActive(displayName);
					onFail();
				} else {
					// Fatal server error!
					// Error getting permit 500
					self.display(hlp.text("pinpad_errorTimePermit") + " " + statusCode, true);
					self.error("Error getting the time permit.", statusCode);
					onFail();
				}
			});
		}
	};

	mpin.prototype.successSetup = function (authData) {
		var self = this;
		if (this.opts.successSetupURL) {
			window.location = this.opts.successSetupURL;
		} else if (this.opts.onSuccessSetup) {
			this.opts.onSuccessSetup(authData, function () {
				self.renderSetupDone.call(self);
			});
		} else {
			this.renderSetupDone();
		}
	};

	//Get request
	mpin.prototype.ajax = function (url, cb) {
		var _request = new XMLHttpRequest();
		_request.onreadystatechange = function () {
			if (_request.readyState === 4 && _request.status === 200) {
				cb(JSON.parse(_request.responseText));
			} else if (_request.readyState === 4) {
				cb({error: 4001});
			}
		};
		_request.open("GET", url, true);
		_request.send();
	};


	//set Custom style to pinPad
	//toDO create loop like options 
	mpin.prototype.setCustomStyle = function () {
		if (mpin.custom.frame_background && document.getElementById("mp_pinpadHolder")) {
			document.getElementById("mp_pinpadHolder").style.background = mpin.custom.frame_background;
		}
	};

	//new Function
	mpin.prototype.requestPermit = function (identity, onSuccess, onFail) {
		var self = this;
		requestTimePermit(self.certivoxPermitsURL(), self.dtaPermitsURL(), self.opts.customHeaders,
				self.ds.getIdentityPermitCache(this.identity), this.certivoxPermitsStorageURL(),
				function (timePermitHex, timePermitCache) {
					self.ds.setIdentityPermit(self.identity, timePermitHex);
					self.ds.setIdentityPermitCache(self.identity, timePermitCache);
					self.ds.save();
					self.gotPermit(timePermitHex);
					console.log(">>> SUCCESS request PERMIT params ::: ", arguments);
					onSuccess(timePermitHex);
				},
				function (message, statusCode) {
					console.log(">>> ERROR params ::: ", message, statusCode);
					if (statusCode === 410) {
						self.error(4012);
						return;
					} else {
						onFail(message, statusCode)
					}
				});
	};

	mpin.prototype.deleteIdentity = function (iID, renderWarningFlag) {
		var newDefaultAccount = "", self = this, identity;

		this.ds.deleteIdentity(iID);
		for (var i in this.ds.getAccounts()) {
			newDefaultAccount = i;
			break;
		}

		if (newDefaultAccount) {
			this.ds.setDefaultIdentity(newDefaultAccount);

			this.setIdentity(newDefaultAccount, true, function () {
				self.display(hlp.text("pinpad_default_message"));
			}, function () {
				self.error(4008);
				return false;
			});
			if (!renderWarningFlag) {
//				this.renderAccountsPanel();
				this.renderLogin(true, "renderAccountsPanel");
			}
		} else {
			this.ds.setDefaultIdentity("");
			this.setIdentity(newDefaultAccount, false);
			this.identity = "";
			if (!renderWarningFlag) {
				this.renderSetupHome();
			}
		}

		//check
		if (renderWarningFlag) {
			identity = this.getDisplayName(iID);
			this.renderDeleteWarning(identity);
		}

		return false;
	};

	//data Source with static referance
	mpin.prototype.dataSource = function () {
		var mpinDs = {}, self = this;
		this.ds || (this.ds = {});
		if (typeof (localStorage['mpin']) === "undefined") {
			localStorage.setItem("mpin", JSON.stringify({
				defaultIdentity: "",
				version: "0.3",
				accounts: {}
			}));
		}
		mpinDs.mpin = JSON.parse(localStorage.getItem("mpin"));

		mpinDs.addIdentity = function (uId, token, permit) {
			if (!mpinDs.mpin.accounts[uId]) {
				mpinDs.mpin.accounts[uId] = {"MPinPermit": "", "token": ""};
			}
			//this.mpin.defaultIdentity = uId;
			mpinDs.setIdentityToken(uId, token);
			if (permit)
				mpinDs.setIdentityPermit(uId, permit);
		};

		mpinDs.setIdentityToken = function (uId, value) {
			mpinDs.mpin.accounts[uId]["token"] = value;
			mpinDs.save();
		};
		mpinDs.setIdentityPermit = function (uId, value) {
			mpinDs.mpin.accounts[uId]["MPinPermit"] = value;
			mpinDs.save();
		};
		mpinDs.getIdentityPermit = function (uId) {
			if (!uId)
				uId = mpinDs.getDefaultIdentity();
			return mpinDs.mpin.accounts[uId]["MPinPermit"];
		};
		mpinDs.setIdentityPermitCache = function (uId, cache) {
			if (!uId) {
				uId = mpinDs.getDefaultIdentity();
			}
			mpinDs.mpin.accounts[uId]["timePermitCache"] = cache;
			mpinDs.save();
		};
		mpinDs.getIdentityPermitCache = function (uId) {
			if (!uId) {
				uId = mpinDs.getDefaultIdentity();
			}
			return mpinDs.mpin.accounts[uId]["timePermitCache"] || {};
		};
		mpinDs.getIdentityToken = function (uId) {
			if (!uId)
				uId = mpinDs.getDefaultIdentity();
			return mpinDs.mpin.accounts[uId]["token"];
		};
		mpinDs.getDefaultIdentity = function (uId) {
			return mpinDs.mpin.defaultIdentity;
		};
		mpinDs.setDefaultIdentity = function (uId) {
			mpinDs.mpin.defaultIdentity = uId;
			mpinDs.save();
		};
		mpinDs.deleteOldIdentity = function (uId) {
			var name = self.getDisplayName(uId);

			for (var i in this.getAccounts()) {
				if (i !== uId) {
					var oName = self.getDisplayName(i);
					if (oName === name) {
						mpinDs.deleteIdentity(i);
					}
				}
			}
		};
		mpinDs.deleteIdentity = function (uId) {
			delete mpinDs.mpin.accounts[uId];
			mpinDs.save();
		};
		mpinDs.save = function () {
			localStorage.setItem("mpin", JSON.stringify(mpinDs.mpin));
		};
		mpinDs.getAccounts = function () {
			return mpinDs.mpin.accounts;
		};

		mpinDs.setIdentityData = function (uId, values) {
			for (var v in values) {
				mpinDs.mpin.accounts[uId][v] = values[v];
			}
			mpinDs.save();
		};

		mpinDs.getIdentityData = function (uId, key) {
			return mpinDs.mpin.accounts[uId][key];
		};

		mpinDs.setDeviceName = function (devId) {
			mpinDs.mpin.deviceName = devId;
			console.log("data STORAGE set device ID::");
			mpinDs.save();
		};

		mpinDs.getDeviceName = function () {
			var deviceID;
			deviceID = mpinDs.mpin.deviceName;
			if (!deviceID) {
				return false;
			}

			return deviceID;
		};

		return mpinDs;
	};

	mpin.prototype.successLogin = function (authData) {
		if (this.opts.successLoginURL) {
			window.location = this.opts.successLoginURL;
		} else if (this.opts.onSuccessLogin) {
			this.opts.onSuccessLogin(authData);
		}
	};

	mpin.prototype.certivoxClientSecretURL = function (params) {
//		return this.cfg.apiUrl + this.cfg.apiVersion + "/clientSecret?" + params;
		return this.opts.certivoxURL + "clientSecret?" + params;
	};


	mpin.prototype.certivoxPermitsURL = function () {
		var hash_mpin_id_hex = mpinAuth.sha256_hex(this.identity);
		return this.opts.certivoxURL + "timePermit?app_id=" + this.opts.appID + "&mobile=0&hash_mpin_id=" + hash_mpin_id_hex;
	};

	mpin.prototype.dtaPermitsURL = function () {
		var mpin_idHex = this.identity;
//		return this.opts.timePermitsURL + "timePermit?app_id=" + this.opts.appID + "&mobile=0&mpin_id=" + mpin_idHex;
		return this.opts.timePermitsURL + "/" + mpin_idHex;
	};

	mpin.prototype.certivoxPermitsStorageURL = function () {
		var that = this;
		return function (date, storageId) {
			console.log("timePermitsStorageURL Base: " + that.opts.timePermitsStorageURL);
			console.log("that.opts.appID: " + that.opts.appID);
			if ((date) && (that.opts.timePermitsStorageURL) && (storageId)) {
				return that.opts.timePermitsStorageURL + "/" + that.opts.appID + "/" + date + "/" + storageId;
			} else {
				return null;
			}
		}
	};


	mpin.prototype.gotPermit = function (timePermit) {
		if (this.opts.onGetPermit)
			this.opts.onGetPermit(timePermit);
	};


	function mp_fromHex (s) {
		if (!s || s.length % 2 != 0)
			return '';

		s = s.toLowerCase();
		var digits = '0123456789abcdef';
		var result = '';
		for (var i = 0; i < s.length; ) {
			var a = digits.indexOf(s.charAt(i++));
			var b = digits.indexOf(s.charAt(i++));
			if (a < 0 || b < 0)
				return '';
			result += String.fromCharCode(a * 16 + b);
		}
		return result;
	}
	;

	// HELPERS and Language Dictionary


	//loader 
	loader = function (url, callback) {
		var type = url.split(".");
		type = type[type.length - 1];
		if (type === "css") {
			var script = document.createElement('link');
			script.setAttribute('rel', 'stylesheet');
			script.setAttribute('type', 'text/css');
			script.setAttribute('href', url);
		} else if (type === "js") {
			var script = document.createElement('script');
			script.type = 'text/javascript';
			script.src = url;
		}
		//IE feature detect
		if (script.readyState) {
			script.onreadystatechange = callback;
		} else {
			script.onload = callback;
		}
		document.getElementsByTagName('head')[0].appendChild(script);
	};

	function addClass (elId, className) {
		var el;
		if (typeof (elId) === "string") {
			el = document.getElementById(elId);
		} else {
			el = elId;
		}

		if (el && el.className) {
			var cNames = el.className.split(/\s+/g);
			if (cNames.indexOf(className) < 0)
				el.className += " " + className;
		} else if (el)
			el.className = className;
	}
	;

	function hasClass (elId, className) {
		var el;
		if (typeof (elId) == "string")
			el = document.getElementById(elId);
		else
			el = elId;

		var cNames = el.className.split(/\s+/g);
		return (cNames.indexOf(className) >= 0)
	}
	;

	function removeClass (elId, className) {
		var el;
		if (typeof (elId) == "string")
			el = document.getElementById(elId);
		else
			el = elId;

		if ((el) && (el.className.indexOf(className) !== -1)) {
			var cNames = el.className.split(/\s+/g);
			cNames.splice(cNames.indexOf(className), 1);
			el.className = cNames.join(" ");
		}
	}
	;

	//private variable
	//en
	lang.en = {};
	lang.en = {
		"pinpad_initializing": "Initializing...",
		"pinpad_errorTimePermit": "ERROR GETTING PERMIT:",
		"home_alt_mobileOptions": "Mobile Options",
		"home_button_authenticateMobile": "Authenticate <br/>with your Smartphone",
		"home_button_authenticateMobile_description": "Get your Mobile Access Number to use with your M-Pin Mobile App to securely authenticate yourself to this service.",
		"home_button_getMobile": "Get",
		"home_button_getMobile1": "M-Pin Mobile App",
		"mobile_button_setup": "Setup your phone",
		"home_button_getMobile_description": "Install the free M-Pin Mobile App on your Smartphone now!  This will enable you to securely authenticate yourself to this service.",
		"home_button_authenticateBrowser": "Authenticate <br/>with this Browser",
		"home_button_authenticateBrowser_description": "Enter your M-PIN to securely authenticate yourself to this service.",
		"home_button_setupBrowser": "Add an <br/>Identity to this Browser",
		"home_button_setupBrowser_description": "Add your Identity to this web browser to securely authenticate yourself to this service using this machine.",
		"mobileGet_header": "GET M-PIN MOBILE APP",
		"mobileGet_text1": "Scan this QR Code or open this URL on your Smartphone:",
		"mobileGet_text2": "or open this URL on your mobile:",
		"mobileGet_button_back": "Back",
		"mobileAuth_header": "AUTHENTICATE WITH YOUR M-PIN",
		"mobileAuth_seconds": "seconds",
		"mobileAuth_text1": "Your Access Number is:",
		"mobile_accessNumber_text": "Your access number is:",
		"mobileAuth_text2": "Note: Use this number in the next",
		"mobileAuth_text3": "with your M-Pin Mobile App.",
		"mobileAuth_text4": "Warning: Navigating away from this page will interrupt the authentication process and you will need to start again to authenticate successfully.",
		"otp_text1": "Your One-Time Password is:",
		"otp_text2": "Note: The password is only valid for<br/>{0} seconds before it expires.", // {0} will be replaced with the max. seconds
		"otp_seconds": "Remaining: {0} sec.", // {0} will be replaced with the remaining seconds
		"otp_expired_header": "Your One-Time Password has expired.",
		"otp_expired_button_home": "Login again to get a new OTP",
		"setup_header": "ADD AN IDENTITY TO THIS DEVICE",
		"setup_header2": "Add an identity",
		"setup_text1": "Enter your email address:",
		"setup_label1": "Enter Address:",
		"setup_label2": "Device name:",
		"setup_placeholder": "your email address",
		"setup_text2": "Your email address will be used as your identity when M-Pin authenticates you to this service.",
		"setup_error_unathorized": "{0} has not been registered in the system.", // {0} will be replaced with the userID
		"setup_error_server": "Cannot process the request. Please try again later.",
		"setup_error_signupexpired": "Your signup request has been expired. Please try again.",
		"setup_button_setup": "Setup M-Pin",
		"setupPin_header": "Create your M-Pin with {0} digits", // {0} will be replaced with the pin length
		"setupPin_initializing": "Initializing...",
		"setupPin_pleasewait": "Please wait...",
		"setupPin_button_clear": "Clear",
		"setupPin_button_done": "Setup<br />Pin",
		"setupPin_errorSetupPin": "ERROR SETTING PIN: {0}", // {0} is the request status code
		"setupDone_header": "Congratulations!",
		"setupDone_text1": "Your M-Pin identity:",
		"setupDone_text2": "is setup, you can now sign in.",
		"setupDone_text3": "",
		"setupDone_button_go": "Sign in now with your new M-Pin!",
		"setupDone_button_go2": "Sign in now",
		"setupReady_header": "VERIFY YOUR IDENTITY",
		"setupReady_text1": "Your M-Pin identity",
		"setupReady_text2": "is ready to setup, now you must verify it.",
		"setupReady_text3": "We have just sent you an email, simply click the link to verify your identity.",
		"setupReady_button_go": "Verified your identity? <br/>Setup your M-Pin now",
		"setupReady_button_resend": "Not received the email? <br/>Send it again",
		"setupNotReady_header": "IDENTITY ACTIVATION REQUIRED",
		"setupNotReady_text1": "Your M-Pin identity:",
		"setupNotReady_text2": "has not been activated via the M-Pin email we send you.",
		"setupNotReady_text3": "You need to click the link in the email we sent you, and then choose 'Setup M-Pin'.",
		"setupNotReady_check_info1": "Checking",
		"setupNotReady_check_info2": "Identity not verified!",
		"setupNotReady_resend_info1": "Sending email",
		"setupNotReady_resend_info2": "Email sent!",
		"setupNotReady_resend_error": "Sending email failed!",
		"setupNotReady_button_check": "I've activated, check again",
		"setupNotReady_button_resend": "Send me the email again",
		"setupNotReady_button_back": "Go to the identities list",
		"authPin_header": "Enter your M-Pin",
		"authPin_button_clear": "Clear",
		"authPin_button_login": "Login",
		"authPin_pleasewait": "Authenticating...",
		"authPin_success": "Success",
		"authPin_errorInvalidPin": "INCORRECT PIN!",
		"authPin_errorNotAuthorized": "You are not authorized!",
		"authPin_errorExpired": "The auth request expired!",
		"authPin_errorServer": "Server error!",
		"deactivated_header": "SECURITY ALERT",
		"deactivated_text1": "has been de-activated and your M-Pin token has been revoked.",
		"deactivated_text2": "To re-activate your identity, click on the blue button below to register again.",
		"deactivated_button_register": "Register again",
		"account_button_addnew": "Add a new identity to this list",
		"account_button_add": "Add new identity",
		"account_button_delete": "Remove this M-Pin Identity from this browser",
		"account_button_delete2": "Remove Identity",
		"account_button_reactivate": "Forgot my PIN. Send me a new activation email.",
		"account_button_reactivate2": "Forget PIN",
		"account_button_backToList": "Go back to identity list",
		"account_button_backToList2": "Back to identity list",
		"account_button_cancel": "Cancel and go back",
		"account_button_cancel2": "Cancel",
		"account_delete_question": "Are you sure you wish to remove this M-Pin Identity from this browser?",
		"account_delete_button": "Yes, remove this M-Pin Identity",
		"account_delete_button2": "Yes, Remove it",
		"account_reactivate_question": "Are you sure you wish to reactivate this M-Pin Identity?",
		"account_reactivate_button": "Yes, reactivate this M-Pin Identity",
		"account_reactivate_button2": "Yes, Reactivate it",
		"noaccount_header": "No identities have been added to this browser!",
		"noaccount_button_add": "Add a new identity",
		"home_intro_text": "First let's establish truth to choose the best way for you to access this service:",
		"home_intro_text2": "Choose a sign in option:",
		"signin_btn_desktop1": "Sign in with Browser",
		"signin_btn_desktop2": "(This is a PERSONAL device I DO trust)",
		"signin_btn_desktop3": "Sign in with browser",
		"signin_btn_mobile1": "Sign in with Smartphone",
		"signin_mobile_btn_text": "Sign in with your Smartphone",
		"signin_mobile_header": "Sign in with your phone",
		"signin_mobile_btn_text2": "Sign in with phone",
		"signin_button_mobile": "Sign in with Phone",
		"signin_btn_mobile2": "(This is a PUBLIC device I DO NOT trust)",
		"home_txt_between_btns": "or",
		"home_hlp_link": "Not sure which option to choose?",
		"mobile_header_txt1": "I",
		"mobile_header_donot": "DON'T",
		"mobile_header_do": "DO",
		"mobile_header_txt3": "trust this computer",
		"mobile_header_txt4": "Sign in with Smartphone",
		"mobile_button_signin": "Sign in with this device",
		"mobile_button_signin2": "Sign in",
		"mobile_header_access_number": "Your Access Number is",
		"help_ok_btn": "Ok, Got it",
		"help_more_btn": "I'm not sure, tell me more",
		"help_hub_title": "M-Pin Help Hub",
		"help_hub_li1": "What’s the difference between browser and smartphone authentication?",
		"help_hub_li2": "What should I do if I don’t have a smartphone and I don’t trust this computer?",
		"help_hub_li3": "What happens if I forget my PIN?",
		"help_hub_li4": "What happens if someone sneaks my PIN?",
		"help_hub_li5": "How should I choose my PIN number?",
		"help_hub_li6": "Can I set the same PIN on all devices every time?",
		"help_hub_li7": "How can a 4 digit PIN be more secure than a long complex password?",
		"help_hub_li8": "Should I change my PIN often?",
		"help_hub_li9": "Does CertiVox know my PIN?",
		"help_hub_li10": "Why do I have to register from each device and browser?",
		"help_hub_button": "Exit Help Hub and return to previous page",
		"help_hub_button2": "Exit Help Hub",
		"help_hub_1_p1": "The browser authentication logs you in to your account on a desktop browser using M-Pin two-factor login.",
		"help_hub_1_p2": "With smartphone authentication you use M-Pin Mobile app as a portable ID card you can use to log in to a desktop browser on any external machine.",
		"help_hub_2_p1": "You can still use the browser log in, but if you are on a shared computer or feel the machine is not secure, we advise you remove the identity from the browser after you’ve completed your session.",
		"help_hub_2_p2": "",
		"help_hub_3_p1": "You will simply need to provide an",
		"help_hub_3_p11": "[email address]",
		"help_hub_3_p12": "in order to set up your identity. You will receive an activation email to complete the set up process.",
		"help_hub_3_p2": "You will also need to create a PIN number, this will be a secret",
		"help_hub_3_p21": "[4 digit]",
		"help_hub_3_p22": "code known only to you which you will use to login to the service.",
		"help_hub_4_p1": "Your PIN can only be used from a machine and browser you’ve previously registered from. If you feel your PIN could be reused from the same machine, simply follow the instructions to reset it clicking the “Forgot my PIN button”.",
		"help_hub_4_p2": "",
		"help_hub_5_p1": "You can choose any PIN number, and reuse it across different devices, without compromising the security of your credentials. With M-Pin there is no need of complex rules to choose a password, just pick an easy to remember value.",
		"help_hub_5_p2": "",
		"help_hub_6_p1": "Yes, you can use the same PIN for different accounts, different machines and different browsers, across mobile and desktop, without affecting the security of M-Pin Authentication.",
		"help_hub_6_p2": "",
		"help_hub_7_p1": "M-Pin is a two-factor authentication, meaning we save “something” in your browser and mobile app to recognise you every time you access a service. The PIN number works only with that “something”, even if you don’t realize you need both things to log in to your account.",
		"help_hub_7_p2": "",
		"help_hub_8_p1": "There is no need for the PIN to be changed periodically, unlike what happens with passwords. Anyway, you can still do it any time, clicking the “Forgot my PIN” button and following the instructions.",
		"help_hub_8_p2": "",
		"help_hub_9_p1": "With M-Pin, your PIN number is not saved anywhere, not even encrypted. Your PIN is saved only in your head!",
		"help_hub_9_p2": "",
		"help_hub_10_p1": "To use M-Pin, you need your PIN number together with “something” saved in your browser, so you need to register from each browser to have that “something” and be able to authenticate with M-Pin.",
		"help_hub_10_p2": "",
		"help_hub_return_button": "Return to Help Hub",
		"activate_header": "ACTIVATE YOUR IDENTITY",
		"activate_text1": "Your M-Pin identity:",
		"activate_text2": "is ready to setup.",
		"activate_text3": "We have just send you an email, simply click the link in the email to activate your identity.",
		"activate_btn1": "Activated your identity via email? Setup your M-Pin now",
		"activate_btn2": "Not received the activation email? Send it again!",
		"settings_title": "IDENTITY OPTIONS",
		"landing_button_newuser": "I'm new to M-Pin, get me started",
		"mobile_header": "GET THE M-PIN SMARTPHONE APP",
		"mobile_footer_btn": "Now, sign in with your Smartphone",
		"mobile_footer_btn2": "Sign in with Phone",
		"pinpad_setup_screen_text": "CREATE YOUR M-PIN:<br> CHOOSE 4 DIGIT",
		"pinpad_default_message": "Enter your pin",
		"setup_device_label": "Choose your device name:",
		"setup_device_default": "(default name)",
		"help_text_1": "Simply choose a memorable <b>[4 digit]</b> PIN to assign to this identity by pressing the numbers in sequence followed by the 'Setup' button to setup your PIN for this identity",
		//2A
		"help_text_landing1": "This Access Number allows you to sign in with M-Pin from your smartphone.  Enter the Access Number into the M-Pin app installed on your Smartphone when prompted and follow the instructions to sign into a browser session. This number is valid for 99 seconds, once this expires a new Access number will be generated.",
		"help_text_landing2": "If you have a smartphone and are signing into <span class=mpinPurple>[xxxx]</span> using someone else’s device or a public computer, then please: <br>1. Download the ‘M-Pin Smartphone App’ <br> 2. Open the App and follow the steps to sign in, this will tell you when you need to enter the access code.",
		"help_text_login": "Simply enter your <span class=mpinPurple>[4 digit]</span> PIN that you assigned to this identity by pressing the numbers in sequence followed by the ‘Sign in’ button. If you have forgotten your PIN, then you can reset it by clicking the ‘Reset PIN’ button below.",
		"help_text_login_button": "Reset my PIN",
		"help_text_setup": "Simply choose a memorable <span class=mpinPurple>[4 digit]</span> PIN to assign to this identity by pressing the numbers in sequence followed by the ‘Setup’ button to setup your PIN for this identity.",
		"help_text_setup_button": "Advice on choosing PIN",
		"help_text_addidentity": "Your <span class=mpinPurple>[email address]</span> will be used as your identity when M-Pin signs you into this service.<br>You will receive an activation email to the address you provide.",
		"help_text_loginerr": "You have entered your PIN incorrectly.<br><br>You have 3 attempts to enter your PIN, after 3 incorrect attempts your identity will be removed and you will need to re-register.",
		"help_text_loginerr_button": "I've forgotton my PIN",
		"otp_header_btn_text": "Your One-time Password is:",
		"otp_under_btn_text": "Note: The password is only valid for 99 seconds before it expries.",
		"otp_remain_text": "Remaining:",
		"otp_expire_header": "Your One-Time Password has expired.",
		"otp_expire_btn": "Login again to get a new OTP.",
		"help_text_devicename": "This <span class=mpinPurple>[device name]</span> will be used to identify this device and the identities you create from here",
		"help_text_home": "If you are signing into <span class=mpinPurple>[xxxx]</span> with your own personal device like your computer or tablet then you can ‘Sign in with Browser’, but if you are using someone else’s device or a public computer, then ‘Sign in with Smartphone’ is recommended for additional security.",
		"error_page_title": "Error page:",
		"error_page_code": "Error code:",
		"error_page_button": "Back",
		"error_page_error": "Error:",
		"error_code_4001": "We are experiencing a technical problem. Please try again later or contact the service administrator.",
		"error_code_4002": "We are experiencing a technical problem. Please try again later or contact the service administrator.",
		"error_code_4003": "We are experiencing a technical problem. Please try again later or contact the service administrator.",
		"error_code_4004": "We detected you are using a non-compatible browser.<br> Please visit <a href='http://info.certivox.com/browser-compatibility'>our browser compatibility page</a> for more info.",
		"error_code_4005": "We detected you are using a non-compatible browser.<br> Please visit <a href='http://info.certivox.com/browser-compatibility'>our browser compatibility page</a> for more info.",
		"error_code_4006": "We are experiencing a technical problem. Please try again later or contact the service administrator.",
		"error_code_4007": "We are experiencing a technical problem. Please try again later or contact the service administrator.",
		"error_code_4008": "We are experiencing a technical problem. Please try again later or contact the service administrator.",
		"error_code_4009": "We could not complete your registration. Please contact the service administrator or try again later.", //403
		"error_code_4010": "We could not complete your registration. Please contact the service administrator or try again later.", //
		"error_code_4011": "We are experiencing a technical problem. Please try again later or contact the service administrator.", //
		"error_code_4012": "We could not complete your authentication request. Please contact the service administrator.", //
		"error_code_4013": "We could not complete your registration. Please contact the service administrator or try again later.", //
		"error_code_4014": "We are experiencing a technical problem. Please try again later or contact the service administrator.", //
		"error_code_4015": "We are experiencing a technical problem. Please try again later or contact the service administrator.", //
		"error_code_4016": "We are experiencing a technical problem. Please try again later or contact the service administrator.", //
		"error_not_auth": "You are not authorized.",  //
		"pinpad_btn_login": "Login",  //
		"pinpad_btn_clear": "Clear",  //
		"pinpad_btn_setup": "Setup"  //
	};
	//	image should have config properties
	hlp.img = function (imgSrc) {
		return IMAGES_PATH + imgSrc;
	};
	//	translate
	hlp.text = function (langKey) {
		//hlp.language set inside render
		//customLanguageTexts - language
		return lang[hlp.language][langKey];
	};

	var setStringOptions = function () {
		if (typeof (String.prototype.trim) === "undefined")
		{
			String.prototype.mpin_trim = function () {
				return String(this).replace(/^\s+|\s+$/g, '');
			};
		} else {
			String.prototype.mpin_trim = String.prototype.trim;
		}

		String.prototype.mpin_endsWith = function (substr) {
			return this.length >= substr.length && this.substr(this.length - substr.length) == substr;
		}

		String.prototype.mpin_startsWith = function (substr) {
			return this.indexOf(substr) == 0;
		}


		if (!String.prototype.mpin_format) {
			String.prototype.mpin_format = function () {
				var args = arguments;
				return this.replace(/{(\d+)}/g, function (match, number) {
					return typeof args[number] != 'undefined'
							? args[number]
							: match
							;
				});
			};
		}
	};
})();


