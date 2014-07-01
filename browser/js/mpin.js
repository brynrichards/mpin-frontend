var mpin = mpin || {};
(function() {
	var lang = {}, hlp = {}, loader;
	var MPIN_URL_BASE = "%URL_BASE%"
	var IMAGES_PATH = MPIN_URL_BASE + "/images/";

	//CONSTRUCTOR 
	mpin = function(options) {
		var self = this, domID;

		loader(MPIN_URL_BASE + "/css/main.css", function() {
			var _options = {};
			if (!options.clientSettingsURL)
				return console.error("M-Pin: clientSettings not set!");

			domID = options.targetElement;
			if (_) {
				//remove _ from global SCOPE
				mpin._ = _.noConflict();
			}
			_options.client = options;
			self.ajax(options.clientSettingsURL, function(serverOptions) {
				_options.server = serverOptions;
				self.initialize.call(self, domID, _options);
			});
		});

	};

	//CONFIGS
	mpin.prototype.cfg = {
		language: "en",
		pinSize: 4,
		requiredOptions: "appID; signatureURL; mpinAuthServerURL; timePermitsURL; seedValue",
		restrictedOptions: "signatureURL; mpinAuthServerURL; timePermitsURL",
		defaultOptions: {
			identityCheckRegex: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
			setDeviceName: false
		}
	};

	/**
	 * Mpin Constructor
	 * 
	 * @param {type} domID PinPad element ID
	 * @param {type} options
	 * 
	 * @returns {Boolean}
	 */
	mpin.prototype.initialize = function(domID, options) {
		this.el = document.getElementById(domID);
		addClass(this.el, "mpinMaster");

		this.setupHtml();
		this.addHelp();

		//options CHECK
		if (!options || !this.checkOptions(options.server)) {
//			this.error(" Some options are required :" + this.cfg.requiredOptions);
			return console.error("Some options are required: " + this.cfg.requiredOptions);
		}
		//Extend string with extra methods
		setStringOptions();

		//data Source
		this.ds = this.dataSource();

		//set Options
		this.setDefaults().setOptions(options.server).setOptions(options.client);

		if (!this.opts.certivoxURL.mpin_endsWith("/")) {
			this.opts.certivoxURL += "/";
		}

		//if false browser unsupport 
		if (!this.checkBrowser()) {
			return;
		}

		//if set & exist
		if (this.opts.language && lang[this.opts.language]) {
			this.language = this.opts.language;
		} else {
			this.language = this.cfg.language;
		}
		this.setLanguageText();

		this.displayType = "text";

		this.renderLanding();

//		this.renderMobile();
//		this.renderDesktop();
//		this.renderLogin();
//		this.renderHome();
//		this.renderSetupHome();
//		this.renderSetupDone();
//		this.renderActivateIdentity();
//		this.renderSetup("bobo");
//		this.renderHelpHub();
//		new VIEWs
//		this.renderMobileLogin();
//		this.renderDesktop();
//		this.renderSetup("123da");
//		this.renderDeleteWarning("dada");
//		this.renderBlank();
	};

	mpin.prototype.setupHtml = function() {
		this.el.innerHTML = mpin._.template(mpin.template["mpin"], {});
		this.el = document.getElementById("mpinMiracle");
	};

	mpin.prototype.checkBrowser = function() {
		var navAgent, onUnsupport = true;
		navAgent = navigator.userAgent.toLowerCase();

		if (navAgent.indexOf('msie') !== -1) {
			var ieVer = parseInt(navAgent.split('msie')[1]);
			if (ieVer < 10) {
				this.unsupportedBrowser("The browser is not supported");
				onUnsupport = false;
			}
		}

		if (typeof window.localStorage === "undefined") {
			this.unsupportedBrowser("The browser does not support localStorage");
			onUnsupport = false;
		}

		return onUnsupport;
	};

	mpin.prototype.unsupportedBrowser = function(message) {
		if (this.opts.onUnsupportedBrowser) {
			this.opts.onUnsupportedBrowser(message);
		} else {
			this.el.innerHTML = "<b>" + message + "</b>";
		}
		return;
	};

	// check minimal required Options
	//  which should be set up
	mpin.prototype.checkOptions = function(options) {
		var _opts;
		_opts = this.cfg.requiredOptions.split("; ");
		for (var k = 0; k < _opts.length; k++) {
			if (typeof options[_opts[k]] === "undefined") {
				return false;
			}
		}
		return true;
	};

	//set defaults OPTIONS
	mpin.prototype.setDefaults = function() {
		this.opts || (this.opts = {});
		for (var i in this.cfg.defaultOptions) {
			this.opts[i] = this.cfg.defaultOptions[i];
		}
		return this;
	};

	mpin.prototype.setOptions = function(options) {
		var _i, _opts, _optionName, _options = "requestOTP; successSetupURL; onSuccessSetup; successLoginURL; onSuccessLogin; onLoaded; onGetPermit; ";
		_options += "onAccountDisabled; onUnsupportedBrowser; prerollid; onError; onGetSecret; signatureURL; certivoxURL; ";
		_options += "mpinAuthServerURL; registerURL; accessNumberURL; mobileAppFullURL; customHeaders; authenticateRequestFormatter; accessNumberRequestFormatter; ";
		_options += "registerRequestFormatter; identityCheckRegex; seedValue; appID; useWebSocket; setupDoneURL; timePermitsURL; timePermitsStorageURL; authenticateURL; ";
		_options += "language; customLanguageTexts; setDeviceName";
		_opts = _options.split("; ");
		this.opts || (this.opts = {});

		this.opts.useWebSocket = ('WebSocket' in window && window.WebSocket.CLOSING === 2);
		this.opts.requestOTP = "0";

		for (_i = 0; _i < _opts.length; _i++) {
			_optionName = _opts[_i];
			if (typeof options[_optionName] !== "undefined")
				this.opts[_optionName] = options[_optionName];
		}

		if (this.opts.mpinAuthServerURL.mpin_startsWith("http")) {
			this.opts.useWebSockets = false;
		}

		return this;
	};

	mpin.prototype.addHelp = function() {
		var hlpHtml;
		hlpHtml = mpin._.template(mpin.template["help-tooltip"], {});
		this.el.insertAdjacentHTML("afterend", hlpHtml);

		this.elHelpOverlay = document.getElementById("mpinHelpTag");
		this.elHelp = document.getElementById("mpinHelpContainer");
	};

	mpin.prototype.readyHtml = function(tmplName, tmplData) {
		var data = tmplData, html;
		mpin._.extend(data, {hlp: hlp, cfg: this.cfg});
		html = mpin._.template(mpin.template[tmplName], data);
		if (html[0] !== "<") {
			html = html.substr(1);
		}
		return html;
	};

	mpin.prototype.render = function(tmplName, callbacks, tmplData) {
		var data = tmplData || {}, k;
		this.el.innerHTML = this.readyHtml(tmplName, data);
		for (k in callbacks) {
			if (document.getElementById(k)) {
				document.getElementById(k).onclick = callbacks[k];
			}
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
	mpin.prototype.setLanguageText = function() {
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

	mpin.prototype.toggleHelp = function() {
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
	mpin.prototype.renderLanding = function() {
		var callbacks = {}, self = this, totalAccounts;

		function clearIntervals() {
			clearInterval(self.intervalID);
			clearTimeout(self.intervalID2);
		}
		;

		clearIntervals();

		totalAccounts = this.ds.getAccounts();
		totalAccounts = Object.keys(totalAccounts).length;
		if (totalAccounts === 1) {
			this.renderLogin();
			return;
		} else if (totalAccounts > 1) {
			this.renderLogin(true);
			return;
		}





		callbacks.mpinLogo = function(evt) {
			clearIntervals();
			self.renderHome.call(self, evt);
		};

		callbacks.mpin_action_setup = function() {
			clearIntervals();
			self.renderMobileSetup.call(self);
		};

		callbacks.mpin_desktop = function() {
			clearIntervals();
			self.renderDesktop.call(self);
		};

		callbacks.mpin_access_help = function() {
			self.lastView = "renderLanding";
			self.toggleHelp.call(self);
			self.renderHelpTooltip.call(self);
		};

		callbacks.mpin_help = function() {
			self.lastView = "renderLanding";
			self.toggleHelp.call(self);
			self.renderHelpTooltip.call(self);
		};

		callbacks.mpin_desktop_hub = function() {
			clearIntervals();
			self.lastView = "renderLanding";
			self.renderHelpHub.call(self);
		};

		this.render("landing", callbacks);

		this.getAccessNumber();
	};


	mpin.prototype.renderHome = function() {
		var callbacks = {}, self = this;

		if (this.opts.prerollid) {
			this.renderSetup(this.opts.prerollid);
		}

		callbacks.mpin_desktop = function() {
			self.renderDesktop.call(self);
		};

		callbacks.mpin_mobile = function() {
			self.renderMobile.call(self);
		};

		callbacks.mpin_help = function() {
			self.lastView = "renderHome";
			self.toggleHelp.call(self);
			self.renderHelpTooltip.call(self);
		};

		this.render('home', callbacks);

		if (this.opts.onLoaded) {
			this.opts.onLoaded();
		}
	};

	//new View redirect to 
	//0 identity  - addIdentity
	//1 identity  - login
	mpin.prototype.renderDesktop = function() {
		var callbacks = {}, self = this, totalAccounts;

		totalAccounts = this.ds.getAccounts();
		totalAccounts = Object.keys(totalAccounts).length;

		if (totalAccounts === 0) {
			this.renderSetupHome();
		} else if (totalAccounts === 1) {
			this.renderLogin();
		} else if (totalAccounts > 1) {
			this.renderLogin(true);
		}

		return;

//		callbacks.mp_action_home = function(evt) {
		callbacks.mpinLogo = function(evt) {
			self.renderHome.call(self, evt);
		};
		callbacks.mpinClear = function() {
			self.addToPin.call(self, "clear");
		};
		callbacks.mpinLogin = function() {
			self.actionSetup.call(self);
		};

		callbacks.mpin_mobile = function() {
			self.renderMobileLogin.call(self);
		};

		callbacks.mpin_desktop_hub = function(ev) {
			self.lastView = "renderDesktop";
			self.renderHelpHub.call(self);
			ev.preventDefault();
			return;
		};


		this.render("desktop", callbacks);
	};



	mpin.prototype.renderMobile = function() {
		var callbacks = {}, self = this;

		function clearIntervals() {
			clearInterval(self.intervalID);
			clearTimeout(self.intervalID2);
		}
		;
		clearIntervals();
		callbacks.mp_action_home = function(evt) {
//			_request.abort();
			clearInterval(self.intervalID);
			clearTimeout(self.intervalID2);
			self.renderHome.call(self, evt);
		};

		callbacks.mpin_action_setup = function() {
			clearIntervals();
			self.renderMobileSetup.call(self);
//			self.renderMo
		};

		callbacks.mpinLogo = function(evt) {
			clearIntervals();
			self.renderHome.call(self, evt);
		};

		callbacks.mpin_desktop = function() {
			clearIntervals();
			self.renderDesktop.call(self);
		};
		callbacks.mpin_help = function() {
			self.lastView = "renderMobile";
			self.toggleHelp.call(self);
			self.renderHelpTooltip.call(self);
		};
		callbacks.mpin_access_help = function() {
			self.lastView = "renderMobile";
			self.toggleHelp.call(self);
			self.renderHelpTooltip.call(self);
		};

		this.render("mobile", callbacks);
		//get access
		this.getAccessNumber();
	};


	mpin.prototype.renderHelp = function(tmplName, callbacks, tmplData) {
		var k, self = this;
		tmplData = tmplData || {};
		this.elHelp.innerHTML = this.readyHtml(tmplName, tmplData);

		for (k in callbacks) {
			if (document.getElementById(k)) {
				document.getElementById(k).addEventListener('click', callbacks[k], false);
			}
		}

		//close tooltip by pressing I
		document.getElementById("mpinInfoCloseCorner").onclick = function() {
			self.toggleHelp.call(self);
		}
	};

	mpin.prototype.renderBlank = function() {
		var callbacks = {};

		callbacks.show_identity = function() {
			alert(" : show IDENTITY : ");
		};

		this.render('blank', callbacks);
	};


	mpin.prototype.renderHelpTooltip = function() {
		var callbacks = {}, self = this;

		callbacks.mpin_help_ok = function() {
			self.toggleHelp.call(self);
		};

		callbacks.mpin_help_more = function() {
			self.toggleHelp.call(self);
			self.renderHelpHub.call(self);
		};

		this.renderHelp("help-tooltip-home", callbacks);
	};

	mpin.prototype.renderHelpHub = function() {
		var callbacks = {}, self = this;

		callbacks.mpin_home = function() {
			self.renderHome.call(self);
		};
		callbacks.mpin_hub_li1 = function() {
			self.renderHelpHubPage.call(self, 1);
		};
		callbacks.mpin_hub_li2 = function() {
			self.renderHelpHubPage.call(self, 2);
		};
		callbacks.mpin_hub_li3 = function() {
			self.renderHelpHubPage.call(self, 3);
		};
		callbacks.mpin_hub_li4 = function() {
			self.renderHelpHubPage.call(self, 4);
		};

		callbacks.mpin_close_hub = function() {
			self.renderLastView.call(self);
		};
		this.render("help-hub", callbacks);
	};

	mpin.prototype.renderHelpHubPage = function(helpNumber) {
		var callbacks = {}, self = this, tmplName;

		callbacks.mpin_help_hub = function() {
			self.renderHelpHub.call(self);
		};
		tmplName = "help-hub-1";
		this.render(tmplName, callbacks);
	};

	//
	mpin.prototype.renderLastView = function() {
		var param1, param2;
		//for render accounts
		this.lastViewParams || (this.lastViewParams = []);
		param1 = this.lastViewParams[0] || false;
		param2 = this.lastViewParams[1] || false;
		console.info("lastVIEW :::", this.lastView);
		console.info("lastVIEW :::", this.lastViewParams);
		//call renderHome
		this[this.lastView](param1, param2);
	};

	mpin.prototype.renderSetupHome = function(email) {
		var callbacks = {}, self = this, userId, deviceName = "", deviceNameHolder = "";

		callbacks.mpin_home = function(evt) {
			self.renderHome.call(self, evt);
		};
		callbacks.mpin_help = function(evt) {
			self.lastView = "renderSetupHome";
			self.toggleHelp.call(self);
			self.renderHelpTooltip.call(self);
		};
		callbacks.mpin_helphub = function(evt) {
			self.lastView = "renderSetupHome";
			self.renderHelpHub.call(self);
		};

		callbacks.mpin_setup = function() {
			self.actionSetupHome.call(self);
		};


		if (this.accountsLinkFlag) {
			callbacks.mpin_arrow = function() {
				self.renderLogin.call(self, true);
			};
		}

		userId = (email) ? email : "";
		//one for 
		if (this.opts.setDeviceName) {

			//get from localStorage - already set
			if (this.ds.getDeviceName()) {
				deviceName = this.ds.getDeviceName();
				deviceNameHolder = deviceName;
			} else {
				//set only placeholder value
				deviceNameHolder = this.suggestDeviceName();
				deviceName = "";
			}
		}

		this.render("setup-home", callbacks, {userId: userId, setDeviceName: this.opts.setDeviceName, deviceName: deviceName, deviceNameHolder: deviceNameHolder});


		if (this.accountsLinkFlag) {
			document.getElementById("mpin_help").style.bottom = "18%";
			document.getElementById("mpin_accounts_list").style.bottom = "9%";
			removeClass("mpin_accounts_list", "mpHide");
			this.accountsLinkFlag = false;
		}

		document.getElementById("emailInput").focus();
	};

	//with embeded animation
	mpin.prototype.renderSetupHome2 = function() {
		var renderElem, self = this, deviceName = "", deviceNameHolder = "";

//		renderElem = document.getElementById("mpinUser");
		renderElem = document.getElementById("mpin_identities");

		if (this.opts.setDeviceName) {
			if (this.ds.getDeviceName()) {
				deviceName = this.ds.getDeviceName();
				deviceNameHolder = deviceName;
			} else {
				deviceNameHolder = this.suggestDeviceName();
				deviceName = "";
			}
		}

		renderElem.innerHTML = this.readyHtml("setup-home-2", {userId: "", setDeviceName: this.opts.setDeviceName, deviceName: deviceName, deviceNameHolder: deviceNameHolder});

		renderElem.style.top = "0px";
//		removeClass("mpin_accounts_list", "mpHide");
		addClass("mpinCurrentIden", "mpHide");
		document.getElementById("mpin_help").style.bottom = "-13%";


		document.getElementById("mpin_arrow").onclick = function(evt) {
//			addClass("mpin_help", "mpHide");
			document.getElementById("mpin_help").style.display = "none";
			self.toggleButton();
			renderElem.style.top = "40px";
		};

		document.getElementById("mpin_setup").onclick = function() {
			self.actionSetupHome.call(self);
		};
	};

	mpin.prototype.suggestDeviceName = function() {
		var suggestName, platform, browser;
		platform = navigator.platform.toLowerCase();
//		browser = navigator.appCodeName;
		browser = navigator.userAgent;
		if (platform.indexOf("Mac") !== -1) {
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

	mpin.prototype.renderSetup = function(email, clientSecretShare, clientSecretParams) {
		var callbacks = {}, self = this;

		//text || circle
		this.setupInputType = "text";

		callbacks.mpin_home = function(evt) {
			self.renderHome.call(self, evt);
		};
		callbacks.mpin_clear = function() {
			self.addToPin.call(self, "clear");
		};
		callbacks.mpin_login = function() {
			self.actionSetup.call(self);
		};
		callbacks.mpin_helphub = function(evt) {
			self.lastView = "renderSetup";
			self.renderHelpHub.call(self);
		};


		this.render("setup", callbacks, {email: email});
		this.enableNumberButtons(true);
		this.bindNumberButtons();

		//requestSignature
		this.requestSignature(email, clientSecretShare, clientSecretParams);
	};

	mpin.prototype.renderLogin = function(listAccounts, subView) {
		var callbacks = {}, self = this;

		var identity = this.ds.getDefaultIdentity();
		var email = this.getDisplayName(identity);

		if (!identity) {
			this.renderSetupHome();
			return;
		}

		callbacks.mpin_home = function(evt) {
			self.renderHome.call(self, evt);
		};
		callbacks.mpin_clear = function() {
			self.addToPin.call(self, "clear");
		};
		callbacks.mpin_arrow = function() {
			self.toggleButton.call(self);
		};
		callbacks.mpin_login = function() {
			self.actionLogin.call(self);
		};
		callbacks.mpin_helphub = function() {
//			self.lastView || (self.lastView = "renderLogin");
			self.lastView = "renderLogin";
			self.renderHelpHub.call(self);
		};
		callbacks.mpin_help_pinpad = function() {
			self.lastView = "renderLogin";
			self.toggleHelp.call(self);
			self.renderHelpTooltip.call(self);
		};

		this.render("login", callbacks);
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
			this.setIdentity(this.ds.getDefaultIdentity(), true, function() {
				self.display(hlp.text("pinpad_default_message"));
			}, function() {
				return false;
			});
		}
	};

	//access NUMBER page





	mpin.prototype.getAccessNumber = function() {
		var _request = new XMLHttpRequest(), self = this, expire;

		this.intervalID || (this.intervalID = {});

		expire = function(expiresOn) {
			var expireAfter = Math.floor((expiresOn - (new Date())) / 1000);
			if (expireAfter <= 0) {
				if (self.intervalID) {
					clearInterval(self.intervalID);
				}
				self.getAccessNumber();
			} else {
				document.getElementById("mpin_seconds").innerHTML = expireAfter + " " + hlp.text("mobileAuth_seconds");
			}
		};

		_request.onreadystatechange = function() {
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
				expiresOn.setSeconds(expiresOn.getSeconds() + jsonResponse.ttlSeconds);
				expire(expiresOn);
				self.intervalID = setInterval(function() {
					expire(expiresOn);
				}, 1000);
			}
		};
		_request.open("GET", this.opts.accessNumberURL);
//		_request.setRequestHeader('Content-Type', 'application/json');
		_request.send();
	};

	//post REQUEST wait for LOGIN
	mpin.prototype.getAccess = function() {
		var _request = new XMLHttpRequest(), self = this;
		_request.onreadystatechange = function() {
			var _jsonRes;
			if (_request.readyState === 4) {
				if (_request.status === 200) {
					_jsonRes = JSON.parse(_request.responseText);
//					self.successLogin(_jsonRes);

					var mpinResponse = _jsonRes;
					var handleToken = function(success, errorCode, errorMessage, authData) {
						if (success) {
							self.successLogin.call(self, authData);
						} else {
							self.renderHome.call(self);
						}
					};

					// Do RPA Authentication
					sendAuthToken(self.opts.authenticateURL, mpinResponse, handleToken, self.opts.authenticateRequestFormatter, self.opts.customHeaders, function() {
						self.successLogin.call(self);
					});


				} else if (!this.intervalID2) {
					self.intervalID2 = setTimeout(function() {
						self.getAccess.call(self);
					}, 3000);
				}
			}
		};

		_request.open("POST", this.opts.accessNumberURL, true);
		_request.timeout = 30000;
		_request.ontimeout = function() {
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

	mpin.prototype.renderMobileSetup = function() {
		var callbacks = {}, self = this, qrElem;

		callbacks.mpin_home = function() {
			self.renderHome.call(self);
		};
		callbacks.mpinbtn_mobile = function() {
			self.renderMobile.call(self);
		};
		callbacks.mpin_helphub = function() {
			self.lastView = "renderMobileSetup";
			self.renderHelpHub.call(self);
		};

		this.render("mobile-setup", callbacks, {mobileAppFullURL: this.opts.mobileAppFullURL});

		qrElem = document.getElementById("mpin_qrcode");

		new QRCode(qrElem, {
			text: this.opts.mobileAppFullURL,
			width: 129,
			height: 129
		});
	};

	mpin.prototype.renderActivateIdentity = function() {
		var callbacks = {}, self = this, email;
		email = this.getDisplayName(this.identity);

		callbacks.mpin_home = function(evt) {
			self.renderHome.call(self, evt);
		};
		callbacks.mpin_help = function(evt) {
			self.lastView = "renderActivateIdentity";
			self.toggleHelp.call(self);
			self.renderHelpTooltip.call(self);
		};
		callbacks.mpin_helphub = function(evt) {
			self.lastView = "renderActivateIdentity";
			self.renderHelpHub.call(self);
		};

		callbacks.mpin_activate = function() {
			self.beforeRenderSetup.call(self, this);
		};
		callbacks.mpin_resend = function() {
			self.actionResend.call(self, this);
		};

		this.render("activate-identity", callbacks, {email: email});
	};

	mpin.prototype.mpinButton = function(btnElem, busyText) {
		var oldHtml = btnElem.innerHTML;
		addClass(btnElem, "mpinBtnBusy");
		btnElem.innerHTML = "<span class='btnLabel'>" + hlp.text(busyText) + "</span>";
		return {
			error: function(errorText) {
				removeClass(btnElem, "mpinBtnBusy");
				addClass(btnElem, "mpinBtnError");
				btnElem.innerHTML = "<span class='btnLabel'>" + hlp.text(errorText) + "</span>";
				setTimeout(function() {
					removeClass(btnElem, "mpinBtnError");
					btnElem.innerHTML = oldHtml;
				}, 1500);

			}, ok: function(okText) {
				removeClass(btnElem, "mpinBtnBusy");
				addClass(btnElem, "mpinBtnOk");
				btnElem.innerHTML = "<span class='btnLabel'>" + hlp.text(okText) + "</span>";
				setTimeout(function() {
					removeClass(btnElem, "mpinBtnOk");
					btnElem.innerHTML = oldHtml;
				}, 1500);
			}};
	};

	mpin.prototype.beforeRenderSetup = function(btnElem) {
		var _reqData = {}, regOTT, url, self = this;
		regOTT = this.ds.getIdentityData(this.identity, "regOTT");
		url = this.opts.signatureURL + "/" + this.identity + "?regOTT=" + regOTT;

		var btn = this.mpinButton(btnElem, "setupNotReady_check_info1");

		_reqData.URL = url;
		_reqData.method = "GET";

		//get signature
		requestRPS(_reqData, function(rpsData) {
			if (rpsData.errorStatus) {

				btn.error("setupNotReady_check_info2");

				self.error("Activate identity");
				return;
			}

			var userId = self.getDisplayName(self.identity);
			self.renderSetup(userId, rpsData.clientSecretShare, rpsData.params);
		});

	};

//custom render 
	mpin.prototype.renderAccountsPanel = function() {
		var self = this, renderElem, addEmptyItem, c = 0, defaultIdentity;

		if (!this.identity) {
			self.setIdentity(self.ds.getDefaultIdentity(), false);
		}

		addEmptyItem = function(cnt) {
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
		document.getElementById("mpin_add_identity").onclick = function() {
			self.accountsLinkFlag = true;
//			self.renderSetupHome.call(self);
			self.renderSetupHome2.call(self);
		};
		// button
		document.getElementById("mpin_phone").onclick = function() {
			self.renderMobileSetup.call(self);
		};


		//arrow show pinpad
		menuBtn.onclick = function() {

			document.getElementById('mpinUser').style.height = "";
			removeClass(menuBtn, 'close');
			//setIdentity if empty

			if (document.getElementById("mpinUser").innerHTML === "") {

				self.setIdentity(self.ds.getDefaultIdentity(), true, function() {
					self.display(hlp.text("pinpad_default_message"));
				}, function() {
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

		for (var i in this.ds.getAccounts()) {
			c += 1;
			if (i != defaultIdentity)
				this.addUserToList(cnt, i, false, c);
		}
		/*
		 addEmptyItem(cnt);
		 */
	};

	mpin.prototype.renderUserSettingsPanel = function(iD) {
		var renderElem, name, self = this;

		name = this.getDisplayName(iD);

		//lastView settings
		this.lastViewParams = [true, "renderUserSettingsPanel"];

//		renderElem = document.getElementById("mpin_identities");
		renderElem = document.getElementById("mpinUser");
//		renderElem = document.getElementById("mp_accountListView");
		renderElem.innerHTML = this.readyHtml("user-settings", {name: name});

		this.lastView = "renderUserSettingsPanel";

		document.getElementById("mpin_deluser_btn").onclick = function(evt) {
			self.renderDeletePanel.call(self, iD);
		};
		document.getElementById("mpin_reactivate_btn").onclick = function(evt) {
			self.renderReactivatePanel.call(self, iD);
		};
		document.getElementById("mpin_cancel_btn").onclick = function(evt) {
//			self.renderAccountsPanel.call(self, evt);
			self.renderLogin.call(self, true);
		};
	};

	mpin.prototype.renderReactivatePanel = function(iD) {
		var renderElem, name, self = this;
		name = this.getDisplayName(iD);

		this.lastViewParams = [true, "renderReactivatePanel"];

//		renderElem = document.getElementById("mpin_identities");
		renderElem = document.getElementById("mpinUser");
		renderElem.innerHTML = this.readyHtml("reactivate-panel", {name: name});


		document.getElementById("mpin_reactivate_btn").onclick = function() {
			self.actionSetupHome.call(self, self.getDisplayName(iD));
		};
		document.getElementById("mpin_cancel_btn").onclick = function() {
			//self.renderAccountsPanel();
			self.renderLogin.call(self, true);
		};
	};

	mpin.prototype.renderDeletePanel = function(iD) {
		var renderElem, name, self = this;
		name = this.getDisplayName(iD);

		this.lastViewParams = [true, "renderDeletePanel"];

		renderElem = document.getElementById("mpinUser");
		addClass(renderElem, "mpPaddTop10");
		renderElem.innerHTML = this.readyHtml("delete-panel", {name: name});

		document.getElementById("mpin_deluser_btn").onclick = function(evt) {
			self.deleteIdentity(iD);
		};

		document.getElementById("mpin_cancel_btn").onclick = function(evt) {
//			self.renderAccountsPanel.call(self, evt);
			self.renderLogin.call(self, true);
		};
	};

	mpin.prototype.renderSetupDone = function() {
		var callbacks = {}, self = this, userId;

		userId = this.getDisplayName(this.identity);

		callbacks.mpin_home = function() {
			self.renderHome.call(self);
		};
		callbacks.mpin_login_now = function() {
			self.renderLogin.call(self);
		};

		this.render("setup-done", callbacks, {userId: userId});
	};

	//after warning
	mpin.prototype.renderDeleteWarning = function(userId) {
		var callbacks = {}, self = this, userId;

		callbacks.mpin_home = function() {
			self.renderHome.call(self);
		};
		callbacks.mp_action_go = function() {
//			self.renderLogin.call(self);
			self.renderSetupHome.call(self, userId);
		};



		this.render("delete-warning", callbacks, {userId: userId});
	};

	mpin.prototype.addUserToList = function(cnt, uId, isDefault, iNumber) {
		var rowClass, self = this;

		rowClass = (isDefault) ? "mpinRow mpinRowActive" : "mpinRow";

		var name = this.getDisplayName(uId);
		var userRow = document.createElement("li");
		userRow.setAttribute("data-identity", uId);
		userRow.className = rowClass;

		var tmplData = {iNumber: iNumber, name: name};

		mpin._.extend(tmplData, {hlp: hlp, cfg: this.cfg});
		userRow.innerHTML = mpin._.template(mpin.template['user-row'], tmplData);

		cnt.appendChild(userRow);

		document.getElementById("mpin_settings_" + iNumber).onclick = function(ev) {

			self.renderUserSettingsPanel.call(self, uId);
			ev.stopPropagation();

			return false;
		};

		userRow.onclick = function() {
			self.ds.setDefaultIdentity(uId);
			self.setIdentity(uId, true, function() {
				self.display(hlp.text("pinpad_default_message"));
			}, function() {
				return false;
			});
			return false;
		};

		userRow.ondblclick = function() {
			self.toggleButton.call(self);
		};

	};

	mpin.prototype.renderIdentityNotActive = function(email) {
		var callbacks = {}, self = this;

		callbacks.mp_action_home = function(evt) {
			self.renderHome.call(self, evt);
		};

		//Check again
		callbacks.mpin_activate_btn = function() {
			var _reqData = {}, regOTT, url, btn;

			btn = self.mpinButton(this, "setupNotReady_check_info1");

			regOTT = self.ds.getIdentityData(self.identity, "regOTT");
			url = self.opts.signatureURL + "/" + self.identity + "?regOTT=" + regOTT;

			_reqData.URL = url;
			_reqData.method = "GET";

			requestRPS(_reqData, function(rpsData) {
				if (rpsData.errorStatus) {
					btn.error("setupNotReady_check_info2");
					self.error("Activate identity");
					return;
				}

				var userId = self.getDisplayName(self.identity);
				self.renderSetup(userId, rpsData.clientSecretShare, rpsData.params);
			});
		};
		//email
		callbacks.mpin_resend_btn = function() {
			self.actionResend.call(self, this);
		};

		callbacks.mpin_accounts_btn = function() {
//			self.renderLogin.call(self, true, email);
			self.renderLogin.call(self, true);
		};
		callbacks.mpin_helphub = function(evt) {
			self.lastView = "renderIdentityNotActive";
			self.renderHelpHub.call(self);
		};

		this.render("identity-not-active", callbacks, {email: email});
	};

	mpin.prototype.bindNumberButtons = function() {
		var self = this, btEls;
		btEls = document.getElementsByClassName("mpinPadBtn");

		for (var i = 0; i < btEls.length; i++) {
			btEls[i].onclick = function(el) {
				self.addToPin(el.target.getAttribute("data-value"));
				return false;
			};
		}
	};


	mpin.prototype.enableNumberButtons = function(enable) {
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
	mpin.prototype.addToPin = function(digit) {
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
		}

		return;
		//convert input text to password
		if (this.displayType === "text") {
			elemDisplay.value = "";
			elemDisplay.type = "password";
			this.displayType = "password";
		}

		if (digit === 'clear') {
			this.displayText(hlp.text("pinpad_default_message"));
			this.enableNumberButtons(true);
			this.enableButton(false, "go");
			this.enableButton(false, "clear");
			return;
		}


		console.log("input VALUE :", this.pinpadInput);
//		elemDisplay.value += digit;
		return;
		if (elemDisplay.value.length === 1) {
			this.enableButton(true, "clear");
		} else if (elemDisplay.value.length === this.cfg.pinSize) {
			this.enableNumberButtons(false);
			this.enableButton(true, "go");
			this.enableButton(true, "clear");
		}
	};

	mpin.prototype.displayText = function() {

	};
	/**
	 *	wrap all buttons function inside ...
	 * 
	 * @param {type} enable
	 * @param {type} buttonName
	 * @returns {undefined}
	 */
	mpin.prototype.enableButton = function(enable, buttonName) {
		var buttonValue = {}, _element;
		buttonValue.go = {id: "mpin_login", trueClass: "mpinPadBtn", falseClass: "mpinPadBtn mpinBtnDisabled"};
		buttonValue.clear = {id: "mpin_clear", trueClass: "mpinPadBtn", falseClass: "mpinPadBtn mpinBtnDisabled"};
		buttonValue.toggle = {id: "mp_toggleButton", trueClass: "mp_DisabledState", falseClass: ""};
		_element = document.getElementById(buttonValue[buttonName].id);
		if (!buttonValue[buttonName] || !_element) {
			return;
		}

		_element.disabled = !enable;
		_element.className = buttonValue[buttonName][enable + "Class"];
	};
	//showInPinPadDisplay
	mpin.prototype.display = function(message, isErrorFlag) {
		var elem, elemText, elemPass, removeCircles, self = this;

		removeCircles = function() {
			var pinSize = self.cfg.pinSize + 1, circles = [];
			for (var i = 1; i < pinSize; i++) {
				circles[i] = document.getElementById("mpin_circle_" + i);
				if (circles[i].childNodes[3]) {
					circles[i].removeChild(circles[i].childNodes[3]);
				}
			}
		};

		if (!message && !isErrorFlag) {
			var newCircle = document.createElement('div');
			newCircle.className = "mpinCircleIn";
			circleID = "mpin_circle_" + this.pinpadInput.length;
			document.getElementById(circleID).appendChild(newCircle);
		} else if (!isErrorFlag) {
			removeCircles();

			this.pinpadInput = "";
			removeClass("mpin_input_text", "mpHide");
			addClass("mpin_input_circle", "mpHide");
			this.setupInputType = "text";
			document.getElementById("mpin_inner_text").innerHTML = message;
		} else {
			//error MESSAGE 
			removeCircles();
			this.pinpadInput = "";
			removeClass("mpin_input_text", "mpHide");
			addClass("mpin_input_parent", "mpinInputError");
			addClass("mpin_input_circle", "mpHide");
			this.setupInputType = "text";

			document.getElementById("mpin_inner_text").innerHTML = message;
		}

		return;
		//pinpad-input
		elem = document.getElementById('pinpad-input');
		elem.type = "text";
		elem.value = message;
		this.displayType = "text";

		if (isErrorFlag) {
			addClass(elem, "errorPin");
		}


		return;
		//old template
		elemPass = document.getElementById('mp_pin');
		elemText = document.getElementById('mp_display');
		if (!elemPass || !elemText)
			return;
		elemPass.value = '';
		elemPass.style.display = 'none';
		elemText.style.display = 'block';
		elemText.value = message;
	};


	mpin.prototype.getDisplayName = function(uId) {
		if (!uId)
			uId = this.identity;
		try {
			return JSON.parse(mp_fromHex(uId)).userID;
		} catch (err) {
			return uId;
		}
	};


	mpin.prototype.toggleButton = function() {
		var self = this, pinpadElem, idenElem, identity;

		pinpadElem = document.getElementById("mpin_pinpad");
		idenElem = document.getElementById("mpin_identities");

		var menuBtn = document.getElementById("mpin_arrow");

		if (!pinpadElem) {
			console.log("missing ELement.");
			return;
		}

		//
		if (menuBtn && !menuBtn.classList.contains("mpinAUp")) {
			document.getElementById("mpinUser").style.height = "81.5%";
			addClass(menuBtn, "close");
			this.renderAccountsPanel();
//			addClass(pinpadElem, "mpZero");
//			removeClass(idenElem, "mpZero");
			addClass(idenElem, "mpPaddTop10");
			removeClass("mpinUser", "mpinIdentityGradient");

			// //lastView
			this.lastViewParams = [false];
		} else {
			//if identity not Active render ACTIVATE
			if (this.ds.getIdentityToken(this.identity) == "") {
				identity = this.getDisplayName(this.identity);
				this.renderIdentityNotActive(identity);
				return;
			}


			document.getElementById("mpinUser").style.height = "28px";
			removeClass(menuBtn, "mpinAUp");
			//if come from add identity remove HIDDEN
			removeClass("mpinCurrentIden", "mpHide");
			addClass("mpinUser", "mpinIdentityGradient");
			//lastView
			this.lastViewParams = [true];
		}
		return false;
	};

	mpin.prototype.actionSetupHome = function(uId) {
		var _email, _deviceName, _deviceNameInput, _reqData = {}, self = this;

		_email = (uId) ? uId : document.getElementById("emailInput").value;



		console.log();
		if (_email.length === 0 || !this.opts.identityCheckRegex.test(_email)) {
			document.getElementById("emailInput").focus();
			return;
		}

		_reqData.URL = this.opts.registerURL;
		_reqData.method = "PUT";
		_reqData.data = {
			userId: _email,
			mobile: 0
		};

		_deviceNameInput = document.getElementById("deviceInput").value;
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
			console.log("case set DEVICE NAME", _deviceName);

			_reqData.data.deviceName = _deviceName;
			this.ds.setDeviceName(_deviceName);
		}


		if (this.opts.registerRequestFormatter) {
			_reqData.postDataFormatter = this.opts.registerRequestFormatter;
		}
		if (this.opts.customHeaders) {
			_reqData.customHeaders = this.opts.customHeaders;
		}
		//register identity
		requestRPS(_reqData, function(rpsData) {
			if (rpsData.error) {
				self.error("Activate First");
				return;
			}
			self.ds.addIdentity(rpsData.mpinId, "");
			self.ds.setIdentityData(rpsData.mpinId, {regOTT: rpsData.regOTT});

			//bug fix
			self.ds.setDefaultIdentity(rpsData.mpinId);

			self.identity = rpsData.mpinId;
			// Check for existing userid and delete the old one
			self.ds.deleteOldIdentity(rpsData.mpinId);

			self.renderActivateIdentity();
		});
	};

	mpin.prototype.requestSignature = function(email, clientSecretShare, clientSecretParams) {
		var self = this;

		requestClientSecret(self.certivoxClientSecretURL(clientSecretParams), clientSecretShare, function(clientSecret) {
			self.enableNumberButtons(true);

			self.clientSecret = clientSecret;
			self.display(hlp.text("pinpad_setup_screen_text"), false);

			if (self.opts.onGetSecret) {
				self.opts.onGetSecret();
			}
		}, function(message, code) {
			self.error(message, code);
		});
	};

	mpin.prototype.error = function(msg) {
		if (this.opts.onError) {
			this.opts.onError(msg);
		} else {
			console.error("Error : " + msg);
		}
	};

	mpin.prototype.actionResend = function(btnElem) {
		var self = this, _reqData = {}, regOTT, _email, btn;

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
		requestRPS(_reqData, function(rpsData) {
			if (rpsData.error || rpsData.errorStatus) {
				self.error("Resend problem");
				return;
			}
			self.identity = rpsData.mpinId;

			//should be already exist only update regOTT
			self.ds.setIdentityData(rpsData.mpinId, {regOTT: rpsData.regOTT});

			// Check for existing userid and delete the old one
			self.ds.deleteOldIdentity(rpsData.mpinId);

			btn.ok("setupNotReady_resend_info2");
		});
	};

	mpin.prototype.actionSetup = function() {
		var self = this, _pin;
		_pin = this.pinpadInput;
		this.ds.addIdentity(this.identity, "");
		this.display("Verifying PIN...");

		extractPIN(_pin, this.clientSecret, this.identity, function(tokenHex) {
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
				requestRPS(_reqData, function(rpsData) {
					if (rpsData.errorStatus) {
						self.error("ooops");
						return;
					}
					self.successSetup(rpsData);
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
	mpin.prototype.actionLogin = function() {
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
				this.opts.requestOTP, "0", this.opts.seedValue, pinValue, this.opts.authenticateURL, this.opts.authenticateRequestFormatter, this.opts.customHeaders,
				function(success, errorCode, errorMessage, authData) {
					console.log("authenticate arguments :", arguments);
					if (success) {
						self.successLogin(authData);
					} else if (errorCode === "INVALID") {
						self.display(hlp.text("authPin_errorInvalidPin"), true);
						self.enableNumberButtons(true);
						self.enableButton(false, "go");
						self.enableButton(false, "clear");
						self.enableButton(true, "toggle");
					} else if (errorCode === "MAXATTEMPTS") {
						var iD = self.identity;
						self.deleteIdentity(iD, true);
						if (self.opts.onAccountDisabled) {
							self.opts.onAccountDisabled(iD);
						}
					}

				}, function() {
			console.log(" Before HandleToken ::::");
		});

	};

	mpin.prototype.setIdentity = function(newIdentity, requestPermit, onSuccess, onFail) {
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

			this.displayType = "text";

			this.enableNumberButtons(false);
			this.enableButton(false, "go");
			this.enableButton(false, "clear");
			this.enableButton(true, "toggle");
//			mpin.enableToggleButton(true);
			this.requestPermit(newIdentity, function(timePermitHex) {
				self.enableNumberButtons(true);
				onSuccess();
			}, function(message, statusCode) {
				if (statusCode === 404) {
					self.renderIdentityNotActive(displayName);
					onFail();
				} else {
					// Fatal server error!
					self.display(hlp.text("pinpad_errorTimePermit") + " " + statusCode, true);
					self.error("Error getting the time permit.", statusCode);
					onFail();
				}
			});
		}
	};

	mpin.prototype.successSetup = function(authData) {
		var self = this;
		if (this.opts.successSetupURL) {
			window.location = this.opts.successSetupURL;
		} else if (this.opts.onSuccessSetup) {
			this.opts.onSuccessSetup(authData, function() {
				self.renderSetupDone.call(self);
			});
		} else {
			this.renderSetupDone();
		}
	};

	//Get request
	mpin.prototype.ajax = function(url, cb) {
		var _request = new XMLHttpRequest();
		_request.onreadystatechange = function() {
			if (_request.readyState === 4 && _request.status === 200)
			{
				cb(JSON.parse(_request.responseText));
			}
		};
		_request.open("GET", url, true);
		_request.send();
	};


	//set Custom style to pinPad
	//toDO create loop like options 
	mpin.prototype.setCustomStyle = function() {
		if (mpin.custom.frame_background && document.getElementById("mp_pinpadHolder")) {
			document.getElementById("mp_pinpadHolder").style.background = mpin.custom.frame_background;
		}
	};

	//new Function
	mpin.prototype.requestPermit = function(identity, onSuccess, onFail) {
		var self = this;
		requestTimePermit(self.certivoxPermitsURL(), self.dtaPermitsURL(), self.opts.customHeaders,
				self.ds.getIdentityPermitCache(this.identity), this.certivoxPermitsStorageURL(),
				function(timePermitHex, timePermitCache) {
					self.ds.setIdentityPermit(self.identity, timePermitHex);
					self.ds.setIdentityPermitCache(mpin.identity, timePermitCache);
					self.ds.save();
					self.gotPermit(timePermitHex);
					onSuccess(timePermitHex);
				},
				function(message, statusCode) {
					onFail(message, statusCode)
				});
	};

	mpin.prototype.deleteIdentity = function(iID, renderWarningFlag) {
		var newDefaultAccount = "", self = this, identity;

		this.ds.deleteIdentity(iID);
		for (var i in this.ds.getAccounts()) {
			newDefaultAccount = i;
			break;
		}

		if (newDefaultAccount) {
			this.ds.setDefaultIdentity(newDefaultAccount);

			this.setIdentity(newDefaultAccount, true, function() {
				self.display(hlp.text("pinpad_default_message"));
			}, function() {
				return false;
			});
			if (!renderWarningFlag) {
				this.renderAccountsPanel();
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
	mpin.prototype.dataSource = function() {
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

		mpinDs.addIdentity = function(uId, token, permit) {
			if (!mpinDs.mpin.accounts[uId]) {
				mpinDs.mpin.accounts[uId] = {"MPinPermit": "", "token": ""};
			}
			//this.mpin.defaultIdentity = uId;
			mpinDs.setIdentityToken(uId, token);
			if (permit)
				mpinDs.setIdentityPermit(uId, permit);
		};

		mpinDs.setIdentityToken = function(uId, value) {
			mpinDs.mpin.accounts[uId]["token"] = value;
			mpinDs.save();
		};
		mpinDs.setIdentityPermit = function(uId, value) {
			mpinDs.mpin.accounts[uId]["MPinPermit"] = value;
			mpinDs.save();
		};
		mpinDs.getIdentityPermit = function(uId) {
			if (!uId)
				uId = mpinDs.getDefaultIdentity();
			return mpinDs.mpin.accounts[uId]["MPinPermit"];
		};
		mpinDs.setIdentityPermitCache = function(uId, cache) {
			if (!uId) {
				uId = mpinDs.getDefaultIdentity();
			}
			mpinDs.mpin.accounts[uId]["timePermitCache"] = cache;
			mpinDs.save();
		};
		mpinDs.getIdentityPermitCache = function(uId) {
			if (!uId) {
				uId = mpinDs.getDefaultIdentity();
			}
			return mpinDs.mpin.accounts[uId]["timePermitCache"] || {};
		};
		mpinDs.getIdentityToken = function(uId) {
			if (!uId)
				uId = mpinDs.getDefaultIdentity();
			return mpinDs.mpin.accounts[uId]["token"];
		};
		mpinDs.getDefaultIdentity = function(uId) {
			return mpinDs.mpin.defaultIdentity;
		};
		mpinDs.setDefaultIdentity = function(uId) {
			mpinDs.mpin.defaultIdentity = uId;
			mpinDs.save();
		};
		mpinDs.deleteOldIdentity = function(uId) {
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
		mpinDs.deleteIdentity = function(uId) {
			delete mpinDs.mpin.accounts[uId];
			mpinDs.save();
		};
		mpinDs.save = function() {
			localStorage.setItem("mpin", JSON.stringify(mpinDs.mpin));
		};
		mpinDs.getAccounts = function() {
			return mpinDs.mpin.accounts;
		};

		mpinDs.setIdentityData = function(uId, values) {
			for (var v in values) {
				mpinDs.mpin.accounts[uId][v] = values[v];
			}
			mpinDs.save();
		};

		mpinDs.getIdentityData = function(uId, key) {
			return mpinDs.mpin.accounts[uId][key];
		};

		mpinDs.setDeviceName = function(devId) {
			mpinDs.mpin.deviceName = devId;
			console.log("data STORAGE set device ID::");
			mpinDs.save();
		};

		mpinDs.getDeviceName = function() {
			var deviceID;
			deviceID = mpinDs.mpin.deviceName;
			if (!deviceID) {
				return false;
			}

			return deviceID;
		};

		return mpinDs;
	};

	mpin.prototype.successLogin = function(authData) {
		if (this.opts.successLoginURL) {
			window.location = this.opts.successLoginURL;
		} else if (this.opts.onSuccessLogin) {
			this.opts.onSuccessLogin(authData);
		}
	};

	mpin.prototype.certivoxClientSecretURL = function(params) {
//		return this.cfg.apiUrl + this.cfg.apiVersion + "/clientSecret?" + params;
		return this.opts.certivoxURL + "clientSecret?" + params;
	};


	mpin.prototype.certivoxPermitsURL = function() {
		var hash_mpin_id_hex = mpinAuth.sha256_hex(this.identity);
		return this.opts.certivoxURL + "timePermit?app_id=" + this.opts.appID + "&mobile=0&hash_mpin_id=" + hash_mpin_id_hex;
	};

	mpin.prototype.dtaPermitsURL = function() {
		var mpin_idHex = this.identity;
//		return this.opts.timePermitsURL + "timePermit?app_id=" + this.opts.appID + "&mobile=0&mpin_id=" + mpin_idHex;
		return this.opts.timePermitsURL + "/" + mpin_idHex;
	};

	mpin.prototype.certivoxPermitsStorageURL = function() {
		var that = this;
		return function(date, storageId) {
			console.log("timePermitsStorageURL Base: " + that.opts.timePermitsStorageURL)
			if ((date) && (that.opts.timePermitsStorageURL) && (storageId)) {
				return that.opts.timePermitsStorageURL + "/" + mpin.appID + "/" + date + "/" + storageId;
			} else {
				return null;
			}
		}
	};


	mpin.prototype.gotPermit = function(timePermit) {
		if (this.opts.onGetPermit)
			this.opts.onGetPermit(timePermit);
	};


	function mp_fromHex(s) {
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
	loader = function(url, callback) {
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

	function addClass(elId, className) {
		var el;
		if (typeof (elId) === "string") {
			el = document.getElementById(elId);
		} else {
			el = elId;
		}

		if (el.className) {
			var cNames = el.className.split(/\s+/g);
			if (cNames.indexOf(className) < 0)
				el.className += " " + className;
		} else
			el.className = className;
	}
	;

	function hasClass(elId, className) {
		var el;
		if (typeof (elId) == "string")
			el = document.getElementById(elId);
		else
			el = elId;

		var cNames = el.className.split(/\s+/g);
		return (cNames.indexOf(className) >= 0)
	}
	;

	function removeClass(elId, className) {
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
		"home_button_getMobile": "Get <br/>M-Pin Mobile App",
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
		"mobileAuth_text2": "Note: Use this number in the next",
		"mobileAuth_text3": "with your M-Pin Mobile App.",
		"mobileAuth_text4": "Warning: Navigating away from this page will interrupt the authentication process and you will need to start again to authenticate successfully.",
		"otp_text1": "Your One-Time Password is:",
		"otp_text2": "Note: The password is only valid for<br/>{0} seconds before it expires.", // {0} will be replaced with the max. seconds
		"otp_seconds": "Remaining: {0} sec.", // {0} will be replaced with the remaining seconds
		"otp_expired_header": "Your One-Time Password has expired.",
		"otp_expired_button_home": "Login again to get a new OTP",
		"setup_header": "ADD AN IDENTITY TO THIS DEVICE",
		"setup_text1": "Enter your email address:",
		"setup_placeholder": "your email address",
		"setup_text2": "Your email address will be used as your identity when M-Pin authenticates you to this service.",
		"setup_error_unathorized": "{0} has not been registered in the system.", // {0} will be replaced with the userID
		"setup_error_server": "Cannot process the request. Please try again later.",
		"setup_error_signupexpired": "Your signup request has been expired. Please try again.",
		"setup_button_setup": "Setup M-Pin&trade;",
		"setupPin_header": "Create your M-Pin with {0} digits", // {0} will be replaced with the pin length
		"setupPin_initializing": "Initializing...",
		"setupPin_pleasewait": "Please wait...",
		"setupPin_button_clear": "Clear",
		"setupPin_button_done": "Setup<br />Pin",
		"setupPin_errorSetupPin": "ERROR SETTING PIN: {0}", // {0} is the request status code
		"setupDone_header": "Congratulations!",
		"setupDone_text1": "Your M-Pin identity",
		"setupDone_text2": "is setup, now you can login.",
		"setupDone_text3": "",
		"setupDone_button_go": "Login now",
		"setupReady_header": "VERIFY YOUR IDENTITY",
		"setupReady_text1": "Your M-Pin identity",
		"setupReady_text2": "is ready to setup, now you must verify it.",
		"setupReady_text3": "We have just sent you an email, simply click the link to verify your identity.",
		"setupReady_button_go": "Verified your identity? <br/>Setup your M-Pin now",
		"setupReady_button_resend": "Not received the email? <br/>Send it again",
		"setupNotReady_header": "YOU MUST VERIFY <br/>YOUR IDENTITY",
		"setupNotReady_text1": "Your identity",
		"setupNotReady_text2": "has not been verified.",
		"setupNotReady_text3": "You need to click the link in the email we sent you, and then choose 'Setup M-Pin'.",
		"setupNotReady_check_info1": "Checking",
		"setupNotReady_check_info2": "Identity not verified!",
		"setupNotReady_resend_info1": "Sending email",
		"setupNotReady_resend_info2": "Email sent!",
		"setupNotReady_resend_error": "Sending email failed!",
		"setupNotReady_button_check": "Setup M-Pin",
		"setupNotReady_button_resend": "Send the email again",
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
		"account_button_delete": "Remove this M-Pin Identity from this browser",
		"account_button_reactivate": "Forgot my PIN. Send me a new activation email.",
		"account_button_backToList": "Go back to identity list",
		"account_button_cancel": "Cancel and go back",
		"account_delete_question": "Are you sure you wish to remove this M-Pin Identity from this browser?",
		"account_delete_button": "Yes, remove this M-Pin Identity",
		"account_reactivate_question": "Are you sure you wish to reactivate this M-Pin Identity?",
		"account_reactivate_button": "Yes, reactivate this M-Pin Identity",
		"noaccount_header": "No identities have been added to this browser!",
		"noaccount_button_add": "Add a new identity",
		"home_intro_text": "First let's establish truth to choose the best way for you to access this service:",
		"signin_btn_desktop1": "Sign in with Browser",
		"signin_btn_desktop2": "(This is a PERSONAL device which I DO trust)",
		"signin_btn_mobile1": "Sign in with Smartphone",
		"signin_mobile_btn_text": "Sign in with your Smartphone",
		"signin_btn_mobile2": "(This is a PUBLIC device which I DO NOT trust)",
		"home_txt_between_btns": "or",
		"home_hlp_link": "Not sure which option to choose?",
		"mobile_header_txt1": "I",
		"mobile_header_donot": "DON'T",
		"mobile_header_do": "DO",
		"mobile_header_txt3": "trust this computer",
		"help_text_1": "Simply choose a memorable <b>[4 digit]</b> PIN to assign to this identity by pressing the numbers in sequence followed by the 'Setup' button to setup your PIN for this identity",
		"help_ok_btn": "Ok, Got it",
		"help_more_btn": "I'm not sure, tell me more",
		"help_hub_title": "M-Pin Help Hub",
		"help_hub_li1": "What is the difference between signing in with the browser or with Smartphone?",
		"help_hub_li2": "Which is the most secure method to sign in?",
		"help_hub_li3": "What details will i need to provide?",
		"help_hub_li4": "Who can see my identity?",
		"help_hub_button": "Exit Help Hub and return to previous page",
		"help_hub_3_p1": "You will simply need to provide an <span class=mpinPurple>[email address]</span> in order to set up your identity. You will receive an activation email to complete the set up process.",
		"help_hub_3_p2": "You will also need to create a PIN number, this will be a secret <span class=mpinPurple>[4 digit]</span> code known only to you which you will use to login to the service.",
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
		"pinpad_setup_screen_text": "CREATE YOUR M-PIN:<br> CHOOSE 4 DIGIT",
		"pinpad_default_message": "ENTER YOUR PIN",
		"setup_device_label": "Choose a device friendly name:",
		"setup_device_default": "(default name)"

	};
	//	image should have config properties
	hlp.img = function(imgSrc) {
		return IMAGES_PATH + imgSrc;
	};
	//	translate
	hlp.text = function(langKey) {
		//hlp.language set inside render
		//customLanguageTexts - language
		return lang[hlp.language][langKey];
	};

	var setStringOptions = function() {
		if (typeof (String.prototype.trim) === "undefined")
		{
			String.prototype.mpin_trim = function() {
				return String(this).replace(/^\s+|\s+$/g, '');
			};
		} else {
			String.prototype.mpin_trim = String.prototype.trim;
		}

		String.prototype.mpin_endsWith = function(substr) {
			return this.length >= substr.length && this.substr(this.length - substr.length) == substr;
		}

		String.prototype.mpin_startsWith = function(substr) {
			return this.indexOf(substr) == 0;
		}


		if (!String.prototype.mpin_format) {
			String.prototype.mpin_format = function() {
				var args = arguments;
				return this.replace(/{(\d+)}/g, function(match, number) {
					return typeof args[number] != 'undefined'
							? args[number]
							: match
							;
				});
			};
		}
	};

})();
