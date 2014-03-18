var mpin = mpin || {};

(function() {

	// Cache elements

	// var $MASTER_CONTAINER = document.getElementById('master');

	// var $MPIN_USER = document.getElementById('mpinUser');
	// var $MPIN_MENU = document.getElementById('menuBtn');

	// var $MPIN_CLEAR = document.getElementById('mpinClear');
	// var $MPIN_LOGIN = document.getElementById('mpinLogin');

	// // Home button
	// var $MPIN_HOME = document.getElementById('homeBtn');

	// // Authenticate button

	// var $MPIN_AUTH_BTN = document.getElementById('authenticate');

	// Add interactivity for the demo

	var lang, hlp = {}, loader;

	//loader 
	loader = function(url, callback) {
		var script = document.createElement('script');
		script.type = 'text/javascript';
		script.src = url;
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
		if (typeof(elId) === "string") {
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
		if (typeof(elId) == "string")
			el = document.getElementById(elId);
		else
			el = elId;

		var cNames = el.className.split(/\s+/g);
		return (cNames.indexOf(className) >= 0)
	}

	function removeClass(elId, className)
	{
		var el;
		if (typeof(elId) == "string")
			el = document.getElementById(elId);
		else
			el = elId;

		if ((el) && (el.className)) {
			var cNames = el.className.split(/\s+/g);
			cNames.splice(cNames.indexOf(className), 1);
			el.className = cNames.join(" ");
		}
	}

	//private variable
	lang = {
		"pinpad_initializing": "Initializing...",
		"pinpad_errorTimePermit": "ERROR GETTING PERMIT:",
		"home_alt_mobileOptions": "Mobile Options",
		"home_button_authenticateMobile": "Authenticate <br/>with your device",
		"home_button_authenticateMobile_description": "Get your Mobile Access Number to use with your M-Pin Mobile App to securely authenticate yourself to this service.",
		"home_button_getMobile": "Get <br/>M-Pin Mobile App",
		"home_button_getMobile_description": "Install the free M-Pin Mobile App on your Smartphone now!  This will enable you to securely authenticate yourself to this service.",
		"home_button_authenticateBrowser": "Authenticate <br/>with this Browser",
		"home_button_authenticateBrowser_description": "Enter your M-PIN to securely authenticate yourself to this service.",
		"home_button_setupBrowser": "Add an <br/>Identity to this Browser",
		"home_button_setupMobile": "Add an <br/>Identity to this device",
		"home_button_setupBrowser_description": "Add your Identity to this web browser to securely authenticate yourself to this service using this machine.",
		"mobileGet_header": "GET M-PIN MOBILE APP",
		"mobileGet_text1": "Scan this QR code",
		"mobileGet_text2": "or open this URL on your mobile:",
		"mobileGet_button_back": "Back",
		"mobileAuth_header": "AUTHENTICATE WITH YOUR M-PIN",
		"mobileAuth_seconds": "seconds",
		"mobileAuth_text1": "Your Access Number is:",
		"mobileAuth_text2": "Note: Use this number in the next",
		"mobileAuth_text3": "with your M-Pin Mobile App.",
		"mobileAuth_text4": "Warning: Navigating away from this page will interrupt the authentication process and you will need to start again to authenticate successfully.",
		"setup_header": "ADD AN IDENTITY TO THIS BROWSER",
		"setup_text1": "Enter your email address:",
		"setup_text2": "Your email address will be used as your identity when M-Pin authenticates you to this service.",
		"setup_button_setup": "Setup M-Pin&trade;",
		"setupPin_header": "Create your M-Pin with {0} digits", // {0} will be replaced with the pin length
		"setupPin_initializing": "Initializing...",
		"setupPin_pleasewait": "Please wait...",
		"setupPin_button_clear": "Clear",
		"setupPin_button_done": "Setup Pin",
		"setupPin_errorSetupPin": "ERROR SETTING PIN: {0}", // {0} is the request status code
		"setupReady_header": "Congratulations!",
		"setupReady_text1": "Your M-Pin identity",
		"setupReady_text2": "is setup, now you must activate it.",
		"setupReady_text3": "We have just sent you an email, simply click the link to activate your identity.",
		"setupReady_button_go": "Activated your identity? <br/>Login now",
		"setupReady_button_resend": "Not received the email? <br/>Send it again",
		"setupNotReady_header": "YOU MUST ACTIVATE <br/>YOUR IDENTITY",
		"setupNotReady_text1": "Your identity",
		"setupNotReady_text2": "has not been activated.",
		"setupNotReady_text3": "You need to click the link in the email we sent you, and then choose <br/> 'Check again'.",
		"setupNotReady_check_info1": "Checking",
		"setupNotReady_check_info2": "Identity not activated!",
		"setupNotReady_resend_info1": "Sending email",
		"setupNotReady_resend_info2": "Email sent!",
		"setupNotReady_button_check": "Check again",
		"setupNotReady_button_resend": "Send the email again",
		"setupNotReady_button_back": "Go to the identities list",
		"authPin_header": "Enter your M-Pin",
		"authPin_button_clear": "Clear",
		"authPin_button_login": "Login",
		"authPin_pleasewait": "Authenticating...",
		"authPin_success": "Success",
		"authPin_errorInvalidPin": "INCORRECT M-PIN!",
		"authPin_errorNotAuthorized": "You are not authorized!",
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
		"noaccount_button_add": "Add a new identity"
	};
	//	image should have config properties
	hlp.img = function(imgSrc) {
		return "images/" + imgSrc;
	};
	//	translate
	hlp.text = function(langKey) {
		return lang[langKey];
	};

	var setStringOptions = function() {
		if (typeof(String.prototype.trim) === "undefined")
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

//
	mpin = function(domID, options) {
		var self = this;

		loader("js/lib/underscore-min.js", function() {
			loader("js/lib/mpin-all.js", function() {
				loader("../build/out/mobile/js/templates.js", function() {
					//remove _ from global SCOPE
					mpin._ = _.noConflict();
					self.initialize.call(self, domID, options);
				});
			});
		});
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
		console.log("options", arguments);
		//options CHECK
		if (!options || !this.checkOptions(options)) {
			this.error(" Some options are required :" + this.cfg.requiredOptions);
			return false;
		}

		//Extend string with extra methods
		setStringOptions();

		//data Source
		this.ds = this.dataSource();

		this.setOptions(options);

		// this.renderSetupHome();
//		this.renderMobileSetup();
		// Check for appID
		this.renderHome();
		// this.render("activate-identity");
		// this.renderLogin();
		// this.setOptions(options).renderHome();
		// this.setOptions(options).renderSetupHome();
		// this.setOptions(options);
	};

	//CONFIGS
	mpin.prototype.cfg = {
		apiVersion: "v0.2",
//		apiUrl: "https://m-pinapi.certivox.net/",
		apiUrl: "https://mpinapi-qa.certivox.org/",
		pinpadDefaultMessage: "",
		pinSize: 4,
		requiredOptions: "appID; mpinDTAServerURL; signatureURL; verifyTokenURL; seedValue"
	};

	// check minimal required Options
	//  which should be set up
	mpin.prototype.checkOptions = function(options) {
		var _opts;
		_opts = this.cfg.requiredOptions.split("; ");
		for (var k = 0, l = _opts.length; k < l; k++) {
			if (typeof options[_opts[k]] === "undefined") {
				return false;
			}
		}
		return true;
	};

	mpin.prototype.setOptions = function(options) {
		var _i, _opts, _optionName, _options = "stage; allowAddUser; requestOTP; successSetupURL; onSuccessSetup; successLoginURL; onSuccessLogin; onLoaded; onGetPermit; ";
		_options += "onReactivate; onAccountDisabled; onUnsupportedBrowser; prerollid; onError; onGetSecret; mpinDTAServerURL; signatureURL; verifyTokenURL; ";
		_options += "mpinAuthServerURL; registerURL; accessNumberURL; mobileAppFullURL; authenticateHeaders; authTokenFormatter; accessNumberRequestFormatter; ";
		_options += "registerRequestFormatter; onVerifySuccess; mobileSupport; emailCheckRegex; seedValue; appID; useWebSocket";
		_opts = _options.split("; ");
		this.opts || (this.opts = {});

		this.opts.useWebSocket = ('WebSocket' in window && window.WebSocket.CLOSING === 2);
		this.opts.requestOTP = "0";

		for (var _i = 0, _l = _opts.length; _i < _l; _i++) {
			_optionName = _opts[_i];
			if (typeof options[_optionName] !== "undefined")
				this.opts[_optionName] = options[_optionName];
		}
		return this;
	};

	//return readyHtml
	mpin.prototype.readyHtml = function(tmplName, tmplData) {
		var data = tmplData, html;
		mpin._.extend(data, {hlp: hlp, cfg: this.cfg});
		html = mpin._.template(mpin.template[tmplName], data);
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
	mpin.prototype.renderHome = function() {
		var callbacks = {}, self = this;
			console.log(mpin.template);
			
		if (this.opts.prerollid) {
			this.renderSetup(this.opts.prerollid);
		}

		callbacks.mpin_authenticate = function(evt) {

			// Modify the sequence for the templates
			self.renderSetupHome.call(self, evt);
		};
		callbacks.mp_action_Login1 = function(evt) {
			self.renderLogin.call(self);
		};
		callbacks.mp_action_addIdentity2 = callbacks.mpin_authenticate;
		callbacks.mp_action_Login2 = callbacks.mp_action_Login1;

		this.render('home', callbacks);

		if (this.opts.mobileAppFullURL) {
			this.renderHomeMobile();
		}
	};
	mpin.prototype.renderHomeMobile = function() {
		var renderElem = "renderMobileHome", self = this;

		renderElem = document.getElementById(renderElem);
		renderElem.innerHTML = this.readyHtml("home_mobile", {});

		document.getElementById("mp_action_mobileLogin1").onclick = function(evt) {
			self.renderMobileLogin.call(self, evt);
		};
		document.getElementById("mp_action_mobileSetup1").onclick = function() {
			self.renderMobileSetup.call(self);
		};

		document.getElementById("mp_action_mobileLogin2").onclick = document.getElementById("mp_action_mobileLogin1").onclick;
		document.getElementById("mp_action_mobileSetup2").onclick = document.getElementById("mp_action_mobileSetup1").onclick;
	};

	mpin.prototype.renderSetupHome = function() {
		var callbacks = {}, self = this;

		callbacks.mp_action_home = function(evt) {
			self.renderHome.call(self, evt);
		};
		callbacks.mp_action_setup = function(evt) {
			self.actionSetupHome.call(self, evt);
		};
		this.render("setup-home", callbacks);

		callbacks.mp_action_home = function(evt) {
			console.log("clicked")
			self.renderHome.call(self, evt);
		};

		// this.render("setup", callbacks, {email: 'jordan@certivox.com'});


	};
	mpin.prototype.renderSetup = function(email) {
		var callbacks = {}, self = this;
		callbacks.mp_action_home = function(evt) {
			self.renderHome.call(self, evt);
		};
		callbacks.mpinClear = function() {
			self.addToPin.call(self, "clear");
		};
		callbacks.mpinLogin = function() {
			self.actionSetup.call(self);
		};
		this.render("setup", callbacks, {email: email});

		document.body.className = 'pinpadGlobal'

		this.enableNumberButtons(true);
		this.bindNumberButtons();

		//requestSignature
		this.requestSignature(email);
	};

	mpin.prototype.renderLogin = function(listAccounts) {
		var callbacks = {}, self = this;
		callbacks.mp_action_home = function(evt) {
			self.renderHome.call(self, evt);
		};
		callbacks.mpinClear = function() {
			self.addToPin.call(self, "clear");
		};
		callbacks.mp_toggleButton = function() {
			self.toggleButton.call(self);
		};
		callbacks.mpinLogin = function() {
			self.actionLogin.call(self);
		};

		this.render("login", callbacks);
		this.enableNumberButtons(true);
		this.bindNumberButtons();

		//fix - there are two more conditions ...
		if (listAccounts) {
			this.toggleButton();
		} else {
			this.setIdentity(this.ds.getDefaultIdentity(), true, function() {
				self.display(self.cfg.pinpadDefaultMessage);
			}, function() {
				return false;
			});
		}
	};

	mpin.prototype.renderMobileLogin = function() {
		var callbacks = {}, self = this, reqIntervalID, _request;

		callbacks.mp_action_home = function(evt) {
			console.log("reqInterval :: ", self.intervalID);
			console.log("_request :: ", _request);

			_request.abort();

			clearInterval(self.intervalID);
			self.renderHome.call(self, evt);
		};

		this.render("mobile-login", callbacks);

		this.getAccessNumber();
		_request = this.getAccess();

	};

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
				document.getElementById("mp_seconds").innerHTML = expireAfter + " " + hlp.text("mobileAuth_seconds");
			}
		};

		_request.onreadystatechange = function() {
			var jsonResponse, expiresOn;
			if (_request.readyState === 4 && _request.status === 200) {
				jsonResponse = JSON.parse(_request.responseText);
				document.getElementById("mp_accessNumber").innerHTML = jsonResponse.accessNumber;
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

	mpin.prototype.getAccess = function() {
		var _request = new XMLHttpRequest(), self = this;

		_request.onreadystatechange = function() {
			var _jsonRes;
			if (_request.readyState === 4) {
				if (_request.status === 200) {
					_jsonRes = JSON.parse(_request.responseText)
					console.log("success !!!");
					if (self.opts.onVerifySuccess) {
						self.opts.onVerifySuccess(_jsonRes);
					}
					self.successLogin(_jsonRes);
				} else {
					console.log("NOT success !!!");
				}
			}
		};

		_request.open("POST", this.opts.accessNumberURL, true);
		_request.timeout = 30000;
		_request.ontimeout = function() {
			self.getAccess();
		};

		_request.send();
		return _request;
	};

	mpin.prototype.renderMobileSetup = function() {
		var callbacks = {}, self = this, qrElem;

		callbacks.mp_action_home = function() {
			console.log("clicked")
			self.renderHome.call(self);
		};
		callbacks.mp_action_cancel = function() {
			self.renderHome.call(self);
		};

		this.render("mobile-setup", callbacks, {mobileAppFullURL: this.opts.mobileAppFullURL});
		qrElem = document.getElementById("mp_qrcode");

		new QRCode(qrElem, {
			text: this.opts.mobileAppFullURL,
			width: 129,
			height: 129
		});
	};

	mpin.prototype.renderActivateIdentity = function() {
		var callbacks = {}, self = this, email;
		email = this.getDisplayName(this.identity);
		callbacks.mp_action_home = function(evt) {
			self.renderHome.call(self, evt);
		};
		callbacks.mp_action_login = function(evt) {
			self.renderLogin.call(self, evt);
		};
		callbacks.mp_action_resend = function(evt) {
			self.actionResend.call(self, evt);
		};
		this.render("activate-identity", callbacks, {email: email});
	};

//custom render 
	mpin.prototype.renderAccountsPanel = function() {
		var self = this, renderElem, addEmptyItem, c = 0;
		addEmptyItem = function(cnt) {
			var p = document.createElement("div");
			p.className = "mp_contentEmptyItem";
			cnt.appendChild(p);
		};
		renderElem = document.getElementById("mp_back");
		renderElem.innerHTML = this.readyHtml("accounts-panel", {});

		document.getElementById("mp_acclist_adduser").onclick = function(evt) {
			self.renderSetupHome.call(self, evt);
		};
		//default IDENTITY
		var cnt = document.getElementById("mp_accountContent");
		this.addUserToList(cnt, this.ds.getDefaultIdentity(), true, 0);

		for (var i in this.ds.getAccounts()) {
			c += 1;
			if (i != this.ds.getDefaultIdentity())
				this.addUserToList(cnt, i, false, c);
		}
		addEmptyItem(cnt);
	};

	mpin.prototype.renderUserSettingsPanel = function(iD) {
		var renderElem, name, self = this;
		name = this.getDisplayName(iD);
		renderElem = document.getElementById("mp_back");
		renderElem.innerHTML = this.readyHtml("user-settings", {name: name});

		document.getElementById("mp_deluser").onclick = function(evt) {
			self.renderDeletePanel.call(self, iD);
		};
		document.getElementById("mp_reactivate").onclick = function(evt) {
			self.renderReactivatePanel.call(self, iD);
		};
		document.getElementById("mp_acclist_cancel").onclick = function(evt) {
			self.renderAccountsPanel.call(self, evt);
		};
	};

	mpin.prototype.renderReactivatePanel = function(iD) {
		var renderElem, name, self = this;
		name = this.getDisplayName(iD);
		renderElem = document.getElementById("mp_back");
		renderElem.innerHTML = this.readyHtml("reactivate-panel", {name: name});

		document.getElementById("mp_acclist_reactivateuser").onclick = function() {
			self.renderSetup(self.getDisplayName(iD));
		};
		document.getElementById("mp_acclist_cancel").onclick = function() {
			self.renderAccountsPanel();
		};
	};

	mpin.prototype.renderDeletePanel = function(iD) {
		var renderElem, name, self = this;
		name = this.getDisplayName(iD);

		renderElem = document.getElementById("mp_back");
		renderElem.innerHTML = this.readyHtml("delete-panel", {name: name});

		document.getElementById("mp_acclist_deluser").onclick = function(evt) {
//			self.renderSetupHome.call(self, evt);
			alert("not Implement yet mp_acclist_deluser.");
		};
		document.getElementById("mp_acclist_cancel").onclick = function(evt) {
			self.renderAccountsPanel.call(self, evt);
		};
	};

	mpin.prototype.addUserToList = function(cnt, uId, isDefault, iNumber) {
		var starClass, divClass, self = this, starButton;

		if (isDefault) {
			starClass = "mp_starButtonSelectedState";
			divClass = "mp_contentItem one-edge-shadow mp_itemSelected";
		} else {
			starClass = "mp_starButtonDefaultState";
			divClass = "mp_contentItem one-edge-shadow";
		}


		starButton = document.createElement("div");
		var name = this.getDisplayName(uId);
		starButton.setAttribute("tabindex", "-1");
		starButton.className = starClass;
		starButton.id = "mp_accountItem_" + iNumber;

		var rowElem = document.createElement("div");
		rowElem.className = divClass;
		rowElem.setAttribute("data-identity", uId);
		rowElem.appendChild(starButton);

		var tmplData = {iNumber: iNumber, name: name};
		mpin._.extend(tmplData, {hlp: hlp, cfg: this.cfg});
		rowElem.innerHTML = mpin._.template(mpin.template['user-row'], tmplData);

		cnt.appendChild(rowElem);

		rowElem.onclick = function() {
			removeClass(document.getElementsByClassName("mp_itemSelected")[0], "mp_itemSelected");
			addClass(rowElem, "mp_itemSelected");

			self.ds.setDefaultIdentity(uId);
			self.setIdentity(uId, true, function() {
				self.display(self.cfg.pinpadDefaultMessage);
			}, function() {
				return false;
			});
			return false;
		};

		rowElem.ondblclick = function() {
			self.toggleButton.call(self);
			/*
			 setTimeout(self.toggleButton, 1);
			 return false;
			 */
		};


		document.getElementById("mp_btIdSettings_" + iNumber).onclick = function(ev) {
			self.renderUserSettingsPanel(uId);
			ev.stopPropagation();
			return false;
		};

		// var btDel = document.getElementById("mp_btDel_" + iNumber);
		// btDel.onclick = function(){
		// 	p.onclick();
		// 	mpin.renderDeletePanel(uId);
		// 	return false;
		// }

		// mp_AddTooltip(btDel, "right", "Delete this token from this machine")

		// var btReact = document.getElementById("mp_btReactivate_" + iNumber);
		// 	btReact.onclick = function(){
		// 		p.onclick();
		// 		mpin.renderReactivatePanel(uId);
		// 		return false;
		// 	}
		// mp_AddTooltip(btReact, "right", "Verify your identity if you have forgotten your pin number")


//		return p;
	};

	mpin.prototype.renderIdentityNotActive = function(email) {
		var callbacks = {}, self = this;

		callbacks.mp_action_home = function(evt) {
			self.renderHome.call(self, evt);
		};
		//Check again
		callbacks.mp_action_login = function() {
			var spanElem = document.getElementById("mp_info_recheck"), that = this;
			this.style.display = "none";
			spanElem.className = "info-checking";
			spanElem.style.display = "inline";
			spanElem.innerHTML = hlp.text("setupNotReady_check_info1") + "<br/>";

			self.requestPermit(self.identity,
					function() {
						spanElem.style.display = "none";
						mpin.renderLogin(true);
					},
					function(message, status) {
						var e = document.getElementById("mp_info_recheck");
						spanElem.className = "info-error";
						spanElem.innerHTML = hlp.text("setupNotReady_check_info2") + "<br/>";

						setTimeout(function() {
							spanElem.style.display = "none";
							that.style.display = "inline-block";
						}, 1500);
					}
			);
		};
		//email
		callbacks.mp_action_resend = function() {
			var spanElem = document.getElementById("mp_info_resend"), that = this;
			this.style.display = "none";
			spanElem.className = "info-checking";
			spanElem.innerHTML = hlp.text("setupNotReady_resend_info1");

			requestRegister(self.opts.registerURL, self.identity, self.opts.authenticateHeaders, self.opts.registerRequestFormatter,
					function() {
						spanElem.className = "info-error";
						spanElem.innerHTML = hlp.text("setupNotReady_resend_info2");
						spanElem.style.display = "inline-block";
						setTimeout(function() {
							spanElem.style.display = "none";
							that.style.display = "inline-block";
						}, 1500);
					},
					function(message, status) {
						self.error(message, status);
						self.display(hlp.text("setupPin_errorSetupPin").mpin_format(status), true);
					});
		};
		//identities list
		callbacks.mp_action_accounts = function() {
			console.log(" CREATE frame ELEMENT before use this render HINT !!!");
//			self.renderAccountsPanel(self);
			self.renderLogin.call(self, true, email);
		};
		this.render("identity-not-active", callbacks, {email: email});
	};

	mpin.prototype.bindNumberButtons = function() {
		var self = this, btEls;
		btEls = document.getElementsByClassName("mp_pindigit");
		for (var i = 0; i < btEls.length; i++) {
			btEls[i].onclick = function(el) {
				self.addToPin(el.target.getAttribute("data-value"));
				return false;
			};
		}
	};
	mpin.prototype.enableNumberButtons = function(enable) {
		var els = document.getElementsByClassName("mp_pindigit");
		for (var i = 0; i < els.length; i++) {
			var element = els[i];
			if (enable) {
				element.className = "btn mp_pindigit";
				element.disabled = false;
			} else {
				element.className = "btn mp_pindigit mp_inactive";
				element.disabled = true;
			}
		}
	};
	//
	mpin.prototype.addToPin = function(digit) {
		var pinElement = document.getElementById('pinpad-input');
		pinElement.setAttribute('type','password')

		if (digit === 'clear') {
			this.display("");
			this.enableNumberButtons(true);
			this.enableButton(false, "go");
			this.enableButton(false, "clear");
			return;
		}

		pinElement.value += digit;

		if (pinElement.value.length === 1) {
			this.enableButton(true, "clear");
		} else if (pinElement.value.length === this.cfg.pinSize) {
			this.enableNumberButtons(false);
			this.enableButton(true, "go");
			this.enableButton(true, "clear");
		}
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
		buttonValue.go = {id: "mpinLogin", trueClass: "btn", falseClass: "btn mp_inactive"};
		buttonValue.clear = {id: "mpinClear", trueClass: "btn", falseClass: "btn mp_inactive"};
		buttonValue.toggle = {id: "mp_toggleButton", trueClass: "mp_DisabledState", falseClass: ""};
		_element = document.getElementById(buttonValue[buttonName].id);
		if (!buttonValue[buttonName] || !_element) {
			return;
		}

		_element.disabled = !enable;
		_element.className = buttonValue[buttonName][enable + "Class"];
	};
	//showInPinPadDisplay
	mpin.prototype.display = function(message, isError) {

		console.log("Coming here");
		var elemPass;
		elemPass = document.getElementById('pinpad-input');
		// Changed to convert the existing input to password type
		elemPass.setAttribute('type','password')
		elemPass.value = message;
		elemPass.value = '';


		/*
		 if (isError)
		 addClass(d, "pinpad-input_error")
		 else
		 removeClass(d, "pinpad-input_error")
		 */
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
		var self = this;
		if (hasClass("mp_panel", "mp_flip")) {
			document.getElementById('mp_accountID').style.display = 'inline';

			console.log("set IDENTITY ;::", typeof this.setIdentity);

			this.setIdentity(this.identity, true, function() {
				self.display(self.cfg.pinpadDefaultMessage);
			}, function() {
				return false;
			});

			removeClass("mp_toggleButton", "mp_SelectedState");
			removeClass("mp_panel", "mp_flip");
		} else {
			document.getElementById('mp_accountID').style.display = 'none';
			this.renderAccountsPanel();
			addClass("mp_toggleButton", "mp_SelectedState");
			addClass("mp_panel", "mp_flip");
		}
		return false;
	};

	mpin.prototype.actionSetupHome = function() {
		var _email = document.getElementById("emailInput").value;
		if (_email.length === 0 || !this.opts.emailCheckRegex.test(_email)) {
			document.getElementById("emailInput").focus();
			return;
		}

		this.renderSetup(_email);
	};

	mpin.prototype.requestSignature = function(email) {
		var self = this;
		requestSignature(email, 0, this.opts.signatureURL, this.opts.authenticateHeaders, function(params) {
			var _urlParams = ["app_id=" + encodeURIComponent(params.app_id), "mpin_id=" + encodeURIComponent(params.mpin_id), "expires=" + encodeURIComponent(params.expires),
				"mobile=" + encodeURIComponent(params.mobile), "signature=" + encodeURIComponent(params.signature)].join("&");
			self.identity = params.mpin_id;
			requestClientSecret(self.certivoxClientSecretURL(_urlParams), self.dtaClientSecretURL(_urlParams), self.opts.authenticateHeaders, function(clientSecret) {
				self.enableNumberButtons(true);

				self.clientSecret = clientSecret;
				document.getElementById("pinpad-input").value = self.cfg.pinpadDefaultMessage;

				if (self.opts.onGetSecret) {
					self.opts.onGetSecret();
				}
			}, function(message, code) {
				self.error(message, code);
			});
		}, function(err) {
			console.log("ERRORRR  :::");
		});
	};

	mpin.prototype.error = function(msg) {
		if (this.opts.onError) {
			this.opts.onError(msg);
		} else {
			console.error("Error : " + msg);
		}
	};

	mpin.prototype.actionResend = function() {
		var self = this;
		requestRegister(this.opts.registerURL, this.identity, this.opts.authenticateHeaders, this.opts.registerRequestFormatter,
				function() {
					self.renderActivateIdentity();
				},
				function(message, status) {
					self.error(message, status);
					self.display(hlp.text("setupPin_errorSetupPin").mpin_format(status), true);
				}
		);
	};

	mpin.prototype.actionSetup = function() {
		var self = this, _pin = document.getElementById('pinpad-input').value;
		this.ds.addIdentity(this.identity, "");
		this.display("Verifying PIN...");

		// extractPIN(_pin, this.clientSecret, this.identity, function(tokenHex) {
		// 	self.ds.setIdentityToken(self.identity, tokenHex);
		// 	self.clientSecret = "";

		// 	self.enableNumberButtons(false);
		// 	self.enableButton(false, "go");

		// 	self.ds.setDefaultIdentity(self.identity);
		// 	self.ds.deleteOldIdentity(self.identity);

		// 	self.display(hlp.text("setupPin_pleasewait"), false);

		// 	// requestRegister(self.opts.registerURL, self.identity, self.opts.authenticateHeaders, self.opts.registerRequestFormatter,
		// 	// 		function() {
		// 	// 			console.log("inside Success SETUP .>>>");
		// 	// 			self.successSetup();
		// 	// 			self.renderActivateIdentity();

		// 	// 		},
		// 	// 		function(message, status) {
		// 	// 			mpin.error(message, status);
		// 	// 			mpin.showInPinPadDisplay(mpin.text(setupPin_errorSetupPin).mpin_format(status), true);
		// 	// 		}
		// 	// );


		// });

		self.renderActivateIdentity();

	};
	/**
	 * 
	 * @returns {undefined}
	 */
	mpin.prototype.actionLogin = function() {
		var authServer, getAuth, self = this, pinValue = document.getElementById('mp_pin').value;
		//AlertMessage.clearDisplayWrap();
		this.enableNumberButtons(false);
		this.enableButton(false, "go");
		this.enableButton(false, "clear");
		this.enableButton(true, "toggle");

		this.display(hlp.text("authPin_pleasewait"));

		getAuth = this.opts.useWebSocket ? getAuthToken : getAuthTokenAjax;
		authServer = this.opts.mpinAuthServerURL;
		console.log("WebsocketSupport :::", this.opts.useWebSocket)
		console.log("action LOGIN :::", (this.opts.webSocketSupport ? "getAuthToken" : "getAuthTokenAjax"));
		console.log("action authServer :::", authServer);
		console.log("action appID :::", this.opts.appID);
		console.log("action identity :::", this.identity);
		console.log("action this.opts.seedValue :::", this.opts.seedValue);
		console.log("action TOKEN :::", this.ds.getIdentityToken(this.identity));
		console.log("action TOKEN :::", this.opts.verifyTokenURL);

		getAuth(authServer, this.opts.appID, this.identity, this.ds.getIdentityPermit(this.identity), this.ds.getIdentityToken(this.identity),
				this.opts.requestOTP, "0", this.opts.seedValue, pinValue, this.opts.verifyTokenURL, this.opts.authTokenFormatter, this.opts.authenticateHeaders,
				function(success, errorCode, errorMessage, authData) {
					if (success) {
						self.successLogin(authData);
					}

				}, function() {
			console.log(" Before HandleToken ::::");
		});

	};

	mpin.prototype.setIdentity = function(newIdentity, requestPermit, onSuccess, onFail) {
		var displayName, accId, self = this;
		if ((typeof(newIdentity) === "undefined") || (!newIdentity))
			displayName = "";
		else {
			this.identity = newIdentity;
			displayName = this.getDisplayName(this.identity);
		}

		accId = document.getElementById('mp_accountID');
		accId.innerHTML = displayName;
		accId.setAttribute("title", displayName);

		if (requestPermit) {
			this.addToPin("clear");
			this.display(hlp.text("pinpad_initializing"), false);

			this.enableNumberButtons(false);
			this.enableButton(false, "go");
			this.enableButton(false, "clear");
			this.enableButton(true, "toggle");
//			mpin.enableToggleButton(true);
			console.log("before call identity PERMIT :)");
			this.requestPermit(newIdentity, function(timePermitHex) {
				console.log("call IDENTITY PERMIT :::");
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
		if (this.opts.successSetupURL) {
			window.location = this.opts.successSetupURL;
		} else {
			if (this.opts.onSuccessSetup)
				this.opts.onSuccessSetup(authData);
		}
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
		requestTimePermit(self.certivoxPermitsURL(), self.dtaPermitsURL(), self.opts.authenticateHeaders,
				function(timePermitHex) {
					self.ds.setIdentityPermit(self.identity, timePermitHex);
					self.ds.save();
					self.gotPermit(timePermitHex);
					onSuccess(timePermitHex);
				},
				function(message, statusCode) {
					onFail(message, statusCode)
				});

	};

	//data Source with static referance
	mpin.prototype.dataSource = function() {
		var mpinDs = {}, self = this;
		this.ds || (this.ds = {});
		if (typeof(localStorage['mpin']) === "undefined") {
			localStorage.setItem("mpin", JSON.stringify({
				defaultIdentity: "",
				version: "0.2",
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
			console.log("uId :::", uId);
			console.dir(mpinDs);
			return mpinDs.mpin.accounts[uId]["MPinPermit"];
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
		return this.cfg.apiUrl + this.cfg.apiVersion + "/clientSecret?" + params;
	};

	mpin.prototype.dtaClientSecretURL = function(params) {
		return this.opts.mpinDTAServerURL + "clientSecret?" + params;
	};


	mpin.prototype.certivoxPermitsURL = function() {
		var mpin_idHex = this.identity;
		return this.cfg.apiUrl + this.cfg.apiVersion + "/timePermit?app_id=" + this.opts.appID + "&mobile=0&mpin_id=" + mpin_idHex;
	};

	mpin.prototype.dtaPermitsURL = function() {
		var mpin_idHex = this.identity;
		return this.opts.mpinDTAServerURL + "timePermit?app_id=" + this.opts.appID + "&mobile=0&mpin_id=" + mpin_idHex;
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

})();