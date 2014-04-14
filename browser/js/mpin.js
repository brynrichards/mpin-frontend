var mpin = mpin || {};
(function() {
	var lang = {}, hlp = {}, loader;
	var IMAGES_PATH = "public/images/";

	//CONSTRUCTOR 
	mpin = function(domID, options) {
		var self = this;
		loader("public/mpin/underscore-min.js", function() {
			loader("public/mpin/mpin-all.js", function() {
				loader("public/mpin/templates.js", function() {
					var _options = {};
					if (!options.clientSettingsURL)
						return console.error("set client Settings");

					//remove _ from global SCOPE
					mpin._ = _.noConflict();
					_options.client = options;
					self.ajax(options.clientSettingsURL, function(serverOptions) {
						_options.server = serverOptions;
						self.initialize.call(self, domID, _options);
					});
				});
			});
		});
	};

	//CONFIGS
	mpin.prototype.cfg = {
//		apiVersion: "v0.3",
//		apiUrl: "https://m-pinapi.certivox.net/",
//		apiUrl: "http://dtatest.certivox.me/",
		language: "en",
		pinpadDefaultMessage: "Enter your M-Pin",
		pinSize: 4,
		requiredOptions: "appID; signatureURL; mpinAuthServerURL; timePermitsURL; seedValue"
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
		this.setOptions(options.server).setOptions(options.client);

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

		this.renderHome();
//		this.renderSetup("123da");
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

	mpin.prototype.setOptions = function(options) {
		var _i, _opts, _optionName, _options = "requestOTP; successSetupURL; onSuccessSetup; successLoginURL; onSuccessLogin; onLoaded; onGetPermit; ";
		_options += "onAccountDisabled; onUnsupportedBrowser; prerollid; onError; onGetSecret; signatureURL; certivoxURL; ";
		_options += "mpinAuthServerURL; registerURL; accessNumberURL; mobileAppFullURL; customHeaders; authenticateRequestFormatter; accessNumberRequestFormatter; ";
		_options += "registerRequestFormatter; identityCheckRegex; seedValue; appID; useWebSocket; setupDoneURL; timePermitsURL; authenticateURL; ";
		_options += "language; customLanguageTexts";
		_opts = _options.split("; ");
		this.opts || (this.opts = {});

		this.opts.useWebSocket = ('WebSocket' in window && window.WebSocket.CLOSING === 2);
		this.opts.requestOTP = "0";

		for (_i = 0; _i < _opts.length; _i++) {
			_optionName = _opts[_i];
			if (typeof options[_optionName] !== "undefined")
				this.opts[_optionName] = options[_optionName];
		}
		return this;
	};

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
				console.log("this.opts.customLanguageTexts[this.language]", this.opts.customLanguageTexts[this.language][k]);
				if (lang[this.language][k]) {
					lang[this.language][k] = this.opts.customLanguageTexts[this.language][k];
				}
			}
		}
	};

	mpin.prototype.renderHome = function() {
		var callbacks = {}, self = this;

		if (this.opts.prerollid) {
			this.renderSetup(this.opts.prerollid);
		}

		callbacks.mpin_setup = function() {
			self.renderSetupHome.call(self);
		};
		callbacks.mpin_authenticate = function() {
			self.renderLogin.call(self);
		};
//		callbacks.mp_action_addIdentity2 = callbacks.mp_action_addIdentity1;
//		callbacks.mp_action_Login2 = callbacks.mp_action_Login1;
		this.render('home', callbacks);

		if (this.opts.mobileAppFullURL) {
			this.renderHomeMobile();
		}

		if (this.opts.onLoaded) {
			this.opts.onLoaded();
		}
	};
	mpin.prototype.renderHomeMobile = function() {
		var renderElem = "renderMobileHome", self = this;

		renderElem = document.getElementById(renderElem);
		renderElem.innerHTML = this.readyHtml("home_mobile", {});

		document.getElementById("mpin_mobile_login").onclick = function(evt) {
			self.renderMobileLogin.call(self, evt);
		};
		document.getElementById("mpin_mobile_setup").onclick = function() {
			self.renderMobileSetup.call(self);
		};
	};

	mpin.prototype.renderSetupHome = function(email, errorID) {
		var callbacks = {}, self = this, descHtml;

		callbacks.mp_action_home = function(evt) {
			self.renderHome.call(self, evt);
		};
		callbacks.mp_action_setup = function(evt) {
			self.actionSetupHome.call(self, evt);
		};

		if (errorID) {
			descHtml = '<div class="mp_infoDescription mp_error">' + hlp.text(errorID).mpin_format(email) + '</div>';
		} else {
			descHtml = '<div class="mp_infoDescription">' + hlp.text("setup_text2") + '</div>';
		}

		this.render("setup-home", callbacks, {description: descHtml});
	};


	mpin.prototype.renderSetup = function(email, clientSecretShare, clientSecretParams) {
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
		this.enableNumberButtons(true);
		this.bindNumberButtons();

		//requestSignature
		this.requestSignature(email, clientSecretShare, clientSecretParams);
	};

	mpin.prototype.renderLogin = function(listAccounts) {
		var callbacks = {}, self = this;

		var identity = this.ds.getDefaultIdentity();
		var email = this.getDisplayName(identity);

		if (!identity) {
			this.renderSetupHome();
			return;
		}

		callbacks.mp_action_home = function(evt) {
			self.renderHome.call(self, evt);
		};
		callbacks.mpinClear = function() {
			self.addToPin.call(self, "clear");
		};
		callbacks.menuBtn = function() {
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
		var callbacks = {}, self = this;

		callbacks.mp_action_home = function(evt) {
//			_request.abort();
			clearInterval(self.intervalID);
			clearTimeout(self.intervalID2);
			self.renderHome.call(self, evt);
		};

		this.render("mobile-login", callbacks);
		//get access
		this.getAccessNumber();
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
				document.getElementById("mpin_seconds").innerHTML = expireAfter + " " + hlp.text("mobileAuth_seconds");
			}
		};

		_request.onreadystatechange = function() {
			var jsonResponse, expiresOn;
			if (_request.readyState === 4 && _request.status === 200) {
				jsonResponse = JSON.parse(_request.responseText);
				document.getElementById("mpin_accessNumber").innerHTML = jsonResponse.accessNumber;
				if (jsonResponse.webOTP) {
					self.webOTP = jsonResponse.webOTP;
					if (self.intervalID2) {
						clearTimeout(self.intervalID2);
					}
					self.getAccess(jsonResponse.webOTP);
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
					self.successLogin(_jsonRes);
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
		if (this.webOTP) {
			_sendParams.webOTP = this.webOTP;
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

		callbacks.mp_action_home = function() {
			self.renderHome.call(self);
		};
		callbacks.mp_action_cancel = function() {
			self.renderHome.call(self);
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

		callbacks.mp_action_home = function() {
			self.renderHome.call(self);
		};
		callbacks.mpin_action_setup = function() {
			self.beforeRenderSetup.call(self, this);
		};

		callbacks.mpin_action_resend = function() {
			self.actionResend.call(self, this);
		};

		this.render("activate-identity", callbacks, {email: email});
	};

	mpin.prototype.mpinButton = function(btnElem, busyText) {
		var oldHtml = btnElem.innerHTML;
		addClass(btnElem, "mpinBtnBusy");
		btnElem.innerHTML = hlp.text(busyText);
		return {
			error: function(errorText) {
				removeClass(btnElem, "mpinBtnBusy");
				addClass(btnElem, "mpinBtnError");
				btnElem.innerHTML = hlp.text(errorText);
				setTimeout(function() {
					removeClass(btnElem, "mpinBtnError");
					btnElem.innerHTML = oldHtml;
				}, 1500);

			}, ok: function(okText) {
				removeClass(btnElem, "mpinBtnBusy");
				btnElem.innerHTML = hlp.text(okText);
				setTimeout(function() {
					btnElem.innerHTML = oldHtml;
				}, 1500);
			}};
	};

	mpin.prototype.beforeRenderSetup = function(btnElem) {
		var _reqData = {}, regOTP, url, self = this;
		regOTP = this.ds.getIdentityData(this.identity, "regOTP");
		url = this.opts.signatureURL + "/" + this.identity + "?regOTP=" + regOTP;

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
		addEmptyItem = function(cnt) {
			var p = document.createElement("div");
			p.className = "mp_contentEmptyItem";
			cnt.appendChild(p);
		};
		renderElem = document.getElementById("mpinIdentities");
		renderElem.innerHTML = this.readyHtml("accounts-panel", {});

		document.getElementById("mp_acclist_adduser").onclick = function(evt) {
			self.renderSetupHome.call(self, evt);
		};
		//default IDENTITY
		var cnt = document.getElementById("mp_accountContent");
		defaultIdentity = this.ds.getDefaultIdentity();
		if (defaultIdentity) {
			this.addUserToList(cnt, defaultIdentity, true, 0);
		}
		//bug1 default identity

		console.log("defaultIDENTITY :", defaultIdentity);

		for (var i in this.ds.getAccounts()) {
			c += 1;
			if (i != defaultIdentity)
				this.addUserToList(cnt, i, false, c);
		}
		addEmptyItem(cnt);
	};

	mpin.prototype.renderUserSettingsPanel = function(iD) {
		var renderElem, name, self = this;
		name = this.getDisplayName(iD);
		renderElem = document.getElementById("mpinIdentities");
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
		renderElem = document.getElementById("mpinIdentities");
		renderElem.innerHTML = this.readyHtml("reactivate-panel", {name: name});

		document.getElementById("mp_acclist_reactivateuser").onclick = function() {
//			self.renderSetup(self.getDisplayName(iD));
			console.log("resend :", self.getDisplayName(iD));
			self.actionSetupHome.call(self, self.getDisplayName(iD));
		};
		document.getElementById("mp_acclist_cancel").onclick = function() {
			self.renderAccountsPanel();
		};
	};

	mpin.prototype.renderDeletePanel = function(iD) {
		var renderElem, name, self = this;
		name = this.getDisplayName(iD);

		renderElem = document.getElementById("mpinIdentities");
		renderElem.innerHTML = this.readyHtml("delete-panel", {name: name});

		document.getElementById("mp_acclist_deluser").onclick = function(evt) {
			self.deleteIdentity(iD);
		};

		document.getElementById("mp_acclist_cancel").onclick = function(evt) {
			self.renderAccountsPanel.call(self, evt);
		};
	};

	mpin.prototype.renderSetupDone = function() {
		var callbacks = {}, self = this, userId;

		userId = this.getDisplayName(this.identity);

		callbacks.mp_action_home = function() {
			self.renderHome.call(self);
		};
		callbacks.mp_action_go = function() {
			self.renderLogin.call(self);
		};

		this.render("setup-done", callbacks, {userId: userId});
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
		};

		document.getElementById("mp_btIdSettings_" + iNumber).onclick = function(ev) {
			self.renderUserSettingsPanel(uId);
			ev.stopPropagation();
			return false;
		};
	};

	mpin.prototype.renderIdentityNotActive = function(email) {
		var callbacks = {}, self = this;

		callbacks.mp_action_home = function(evt) {
			self.renderHome.call(self, evt);
		};

		//Check again
		callbacks.mpin_setup = function() {
			var _reqData = {}, regOTP, url, btn;

			btn = self.mpinButton(this, "setupNotReady_check_info1");

			regOTP = self.ds.getIdentityData(self.identity, "regOTP");
			url = self.opts.signatureURL + "/" + self.identity + "?regOTP=" + regOTP;

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
		callbacks.mpin_resend = function() {
			var btn, regOTP, _email, _reqData = {};

			btn = self.mpinButton(this, "setupNotReady_resend_info1");

			regOTP = self.ds.getIdentityData(self.identity, "regOTP");
			_email = self.getDisplayName(self.identity);

			_reqData.URL = self.opts.registerURL;
			_reqData.URL += "/" + self.identity;
			_reqData.method = "PUT";
			_reqData.data = {
				userId: _email,
				mobile: 0,
				regOTP: regOTP
			};

			if (self.opts.registerRequestFormatter) {
				_reqData.postDataFormatter = self.opts.registerRequestFormatter;
			}
			if (self.opts.customHeaders) {
				_reqData.customHeaders = self.opts.customHeaders;
			}
			//registerRequestFormatter

			//resend email 
			// add identity into URL + regOTP
			requestRPS(_reqData, function(rpsData) {
				if (rpsData.error || rpsData.errorStatus) {
					self.error("Resend problem");

					btn.error("setupNotReady_resend_error");
					return;
				}
//				self.identity = rpsData.mpinId;

				//should be already exist only update regOTP
//				self.ds.setIdentityData(rpsData.mpinId, {regOTP: rpsData.regOTP});
				self.ds.setIdentityData(self.identity, {regOTP: rpsData.regOTP});

				// Check for existing userid and delete the old one
				self.ds.deleteOldIdentity(rpsData.mpinId);

				btn.ok("setupNotReady_resend_info2");
//			self.renderActivateIdentity();

				//--//spanElem.innerHTML = hlp.text("setupNotReady_resend_info2");
				//--//spanElem.style.background = "none";

				setTimeout(function() {
					//--//spanElem.style.display = "none";
					//--//that.style.display = "inline-block";
				}, 1500);
			});
		};
		//identities list
		callbacks.mpin_accounts = function() {
//			self.renderAccountsPanel(self);
			self.renderLogin.call(self, true, email);
		};
		this.render("identity-not-active", callbacks, {email: email});
	};

	mpin.prototype.bindNumberButtons = function() {
		var self = this, btEls;
		btEls = document.getElementsByClassName("btn");

		for (var i = 0; i < btEls.length; i++) {
			btEls[i].onclick = function(el) {
				self.addToPin(el.target.getAttribute("data-value"));
				return false;
			};
		}
	};


	mpin.prototype.enableNumberButtons = function(enable) {
		var els = document.getElementsByClassName("btn");
		for (var i = 0; i < els.length; i++) {
			var element = els[i];
			if (enable) {
				element.className = "btn";
				element.disabled = false;
			} else {
				element.className = "btn mp_inactive";
				element.disabled = true;
			}
		}
	};
	//
	mpin.prototype.addToPin = function(digit) {
		var elemDisplay = document.getElementById('pinpad-input');

		console.log("elemDisplay", elemDisplay);
		//convert input text to password
		if (this.displayType === "text" && elemDisplay) {
			elemDisplay.value = "";
			elemDisplay.type = "password";
			this.displayType = "password";
		}

		if (digit === 'clear') {
			this.display(this.cfg.pinpadDefaultMessage);
			this.enableNumberButtons(true);
			this.enableButton(false, "go");
			this.enableButton(false, "clear");
			return;
		}

		elemDisplay.value += digit;
		if (elemDisplay.value.length === 1) {
			this.enableButton(true, "clear");
		} else if (elemDisplay.value.length === this.cfg.pinSize) {
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
		buttonValue.go = {id: "mpinLogin", trueClass: "mp_pin mp_actionbutton", falseClass: "mp_pin mp_actionbutton mp_inactive"};
		buttonValue.clear = {id: "mpinClear", trueClass: "mp_pin mp_actionbutton", falseClass: "mp_pin mp_actionbutton mp_inactive"};
		buttonValue.toggle = {id: "mp_toggleButton", trueClass: "mp_DisabledState", falseClass: ""};
		_element = document.getElementById(buttonValue[buttonName].id);
		if (!buttonValue[buttonName] || !_element) {
			return;
		}

		_element.disabled = !enable;
//		_element.className = buttonValue[buttonName][enable + "Class"];
	};
	//showInPinPadDisplay
	mpin.prototype.display = function(message, isError) {
		var elem, elemText, elemPass;

		//pinpad-input
		elem = document.getElementById('pinpad-input');
		elem.type = "text";
		elem.value = message;
		this.displayType = "text";
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
		/*
		 if (isError)
		 addClass(d, "mp_display_error")
		 else
		 removeClass(d, "mp_display_error")
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
		var self = this, pinpadElem, idenElem;

		pinpadElem = document.getElementById("pinsHolder");
		idenElem = document.getElementById("mpinIdentities");

		console.log("pinpadDisplay::", pinpadElem.style.display);

		if (pinpadElem.style.display === "none") {
			document.getElementById('mpinUser').style.display = '';
			this.setIdentity(this.identity, true, function() {
				self.display(self.cfg.pinpadDefaultMessage);
			}, function() {
				return false;
			});

			removeClass("menuBtn", "activeBtn");
			pinpadElem.style.display = "";
			idenElem.style.display = "none";
		} else {
			document.getElementById('mpinUser').style.display = 'none';
			pinpadElem.style.display = "none";
			idenElem.style.display = "";
			addClass("menuBtn", "activeBtn");
			this.renderAccountsPanel();
		}
		return false;
	};

	mpin.prototype.actionSetupHome = function() {
		var _email = document.getElementById("emailInput").value, _reqData = {}, self = this;
		if (_email.length === 0 || !this.opts.identityCheckRegex.test(_email)) {
			document.getElementById("mp_emailaddress").focus();
			return;
		}

		_reqData.URL = this.opts.registerURL;
		_reqData.method = "PUT";
		_reqData.data = {
			userId: _email,
			mobile: 0
		};

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
			self.ds.setIdentityData(rpsData.mpinId, {regOTP: rpsData.regOTP});

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
			document.getElementById("pinpad-input").value = self.cfg.pinpadDefaultMessage;

			if (self.opts.onGetSecret) {
				self.opts.onGetSecret();
			}
		}, function(message, code) {
			self.error(message, code);
		});
		/*	
		 }, function(err) {
		 console.log("ERRORRR  :::");
		 });
		 */
	};

	mpin.prototype.error = function(msg) {
		if (this.opts.onError) {
			this.opts.onError(msg);
		} else {
			console.error("Error : " + msg);
		}
	};

	mpin.prototype.actionResend = function(btnElem) {
		var self = this, _reqData = {}, regOTP, _email, btn;

		regOTP = this.ds.getIdentityData(this.identity, "regOTP");
		_email = this.getDisplayName(this.identity);

		btn = this.mpinButton(btnElem, "setupNotReady_resend_info1");

		_reqData.URL = this.opts.registerURL;
		_reqData.URL += "/" + this.identity;
		_reqData.method = "PUT";
		_reqData.data = {
			userId: _email,
			mobile: 0,
			regOTP: regOTP
		};
		if (this.opts.registerRequestFormatter) {
			_reqData.postDataFormatter = this.opts.registerRequestFormatter;
		}
		if (this.opts.customHeaders) {
			_reqData.customHeaders = this.opts.customHeaders;
		}

		//resend email 
		// add identity into URL + regOTP
		requestRPS(_reqData, function(rpsData) {
			if (rpsData.error || rpsData.errorStatus) {
				self.error("Resend problem");
				return;
			}
			self.identity = rpsData.mpinId;

			//should be already exist only update regOTP
			self.ds.setIdentityData(rpsData.mpinId, {regOTP: rpsData.regOTP});

			// Check for existing userid and delete the old one
			self.ds.deleteOldIdentity(rpsData.mpinId);

			btn.ok("setupNotReady_resend_info2");
		});
	};

	mpin.prototype.actionSetup = function() {
		var self = this, _pin = document.getElementById('pinpad-input').value;
		this.ds.addIdentity(this.identity, "");
		this.display("Verifying PIN...");

		console.log("_pin: ", _pin);
		console.log("clientSecret: ", this.clientSecret);
		console.log("identity: ", this.identity);

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
		var authServer, getAuth, self = this, pinValue = document.getElementById('pinpad-input').value;
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
						self.display(hlp.text("authPin_errorInvalidPin"), false);

						self.enableNumberButtons(true);

						self.enableButton(false, "go");
						self.enableButton(false, "clear");
						self.enableButton(true, "toggle");
					} else if (errorCode === "MAXATTEMPTS") {
						var iD = self.identity;
						self.deleteIdentity(iD);
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
		console.info("call setIdentity:", newIdentity);
		if ((typeof (newIdentity) === "undefined") || (!newIdentity)) {
			displayName = "";
		} else {
			this.identity = newIdentity;
			displayName = this.getDisplayName(this.identity);
		}

		accId = document.getElementById('mpinUser');
		accId.innerHTML = "<p>" + displayName + "</p>";
		accId.setAttribute("title", displayName);

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

	mpin.prototype.deleteIdentity = function(iID) {
		var newDefaultAccount = "", self = this;

		this.ds.deleteIdentity(iID);
		for (var i in this.ds.getAccounts()) {
			newDefaultAccount = i;
			break;
		}

		if (newDefaultAccount) {
			this.setIdentity(newDefaultAccount, true, function() {
				self.display(self.cfg.pinpadDefaultMessage);
			}, function() {
				return false;
			});

			this.ds.setDefaultIdentity(newDefaultAccount);
			this.renderAccountsPanel();
		} else {
			this.setIdentity(newDefaultAccount, false);
			this.ds.setDefaultIdentity("");
			this.identity = "";
			this.renderSetupHome();
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
		return this.opts.certivoxURL + "/clientSecret?" + params;
	};

	mpin.prototype.certivoxPermitsURL = function() {
		var mpin_idHex = this.identity;
		return this.opts.certivoxURL + "/timePermit?app_id=" + this.opts.appID + "&mobile=0&mpin_id=" + mpin_idHex;
	};

	mpin.prototype.dtaPermitsURL = function() {
		var mpin_idHex = this.identity;
//		return this.opts.timePermitsURL + "timePermit?app_id=" + this.opts.appID + "&mobile=0&mpin_id=" + mpin_idHex;
		return this.opts.timePermitsURL + "/" + mpin_idHex;
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

		if ((el) && (el.className)) {
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
		"mobileGet_text1": "Scan this QR code",
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
		"setup_header": "ADD AN IDENTITY TO THIS BROWSER",
		"setup_text1": "Enter your email address:",
		"setup_text2": "Your email address will be used as your identity when M-Pin authenticates you to this service.",
		"setup_error_unathorized": "{0} has not been registered in the system.", // {0} will be replaced with the userID
		"setup_error_server": "Cannot process the request. Please try again later.",
		"setup_error_signupexpired": "Your signup request has been expired. Please try again.",
		"setup_button_setup": "Setup M-Pin&trade;",
		"setupPin_header": "Create your M-Pin with {0} digits", // {0} will be replaced with the pin length
		"setupPin_initializing": "Initializing...",
		"setupPin_pleasewait": "Please wait...",
		"setupPin_button_clear": "Clear",
		"setupPin_button_done": "Setup Pin",
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
		"setupNotReady_text3": "You need to click the link in the email we sent you, and then choose <br/> 'Setup M-Pin'.",
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
		"authPin_errorInvalidPin": "INCORRECT M-PIN!",
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
		"noaccount_button_add": "Add a new identity"
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
