var mpin = mpin || {};
 
(function() {
    var lang = {}, hlp = {};
    var loader;
    var IMAGES_PATH = "resources/templates/@@templatename/img/";
 
    //CONSTRUCTOR
    mpin = function(domID, options) {
        var self = this;
 
        loader("js/handlebars.runtime.min.js", function() {
            loader("js/mpin-all.min.js", function() {
                loader("js/templates.js", function() {
                    var _options = {};
                    if (!options.clientSettingsURL) {
                        return console.error("set client Settings");                    
                    }
 
                    //remove _ from global SCOPE
                    _options.client = options;
 
                    self.ajax(options.clientSettingsURL, function(serverOptions) {
                        if(serverOptions.error === 500) {
 
                            _options.server = '';
                            document.getElementById(domID).innerHTML = mpin._.template(mpin.template['offline'], {});
                            return;
                        }
                        _options.server = serverOptions;
                        self.initialize.call(self, domID, _options);
                    });
                });
            });
        });
 
    };
 
    //CONFIGS
    mpin.prototype.cfg = {
//      apiVersion: "v0.3",
//      apiUrl: "https://m-pinapi.certivox.net/",
//      apiUrl: "http://dtatest.certivox.me/",
        language: "en",
        pinpadDefaultMessage: "",
        pinSize: 4,
        requiredOptions: "appID; signatureURL; mpinAuthServerURL; timePermitsURL; seedValue",
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
        this.elHelp = document.getElementById('helpContainer');
        this.elHelpOverlay = document.getElementsByTagName("help")[0];
        this.elHelpHub = document.getElementsByTagName("helpHub")[0];

        // Register handlebars helper

        Handlebars.registerHelper("hlp", function(optionalValue) {
            return hlp.text(optionalValue);
        });

        //options CHECK
        if (!options || !this.checkOptions(options.server)) {
//          this.error(" Some options are required :" + this.cfg.requiredOptions);
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
 
        //if set & exist
        if (this.opts.language && lang[this.opts.language]) {
            this.language = this.opts.language;
        } else {
            this.language = this.cfg.language;
        }
        this.setLanguageText();
 
 
        console.log("language:: ", this.language);
        console.log("language:: ", lang);
 
         
        // Prevent user from scrolling on touch
 
        document.ontouchmove = function(e){ e.preventDefault(); }
 
        this.renderHomeMobile();

        // Caching - monitor if new version of the cache exists
 
        // setInterval(function () { window.applicationCache.update(); }, 2000); // Check for an updated manifest file every 60 minutes. If it's updated, download a new cache as defined by the new manifest file.
 
        // window.applicationCache.addEventListener('updateready', function(){ // when an updated cache is downloaded and ready to be used
        //         window.applicationCache.swapCache(); //swap to the newest version of the cache
        //         alert("I updated the cache");
        //         window.location.reload();
        // }, false);
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

    //set defaults OPTIONS
    mpin.prototype.setDefaults = function() {
        this.opts || (this.opts = {});
        for (var i in this.cfg.defaultOptions) {
            this.opts[i] = this.cfg.defaultOptions[i];
        }
        return this;
    };
 
    mpin.prototype.setOptions = function(options) {
        var _i, _opts, _optionName, _options = "stage; allowAddUser; requestOTP; successSetupURL; onSuccessSetup; successLoginURL; onSuccessLogin; onLoaded; onGetPermit; ";
        _options += "onReactivate; onAccountDisabled; onUnsupportedBrowser; prerollid; onError; onGetSecret; mpinDTAServerURL; signatureURL; verifyTokenURL; certivoxURL; ";
        _options += "mpinAuthServerURL; registerURL; accessNumberURL; mobileAppFullURL; authenticateHeaders; authTokenFormatter; accessNumberRequestFormatter; ";
        _options += "registerRequestFormatter; onVerifySuccess; mobileSupport; emailCheckRegex; seedValue; appID; useWebSocket; setupDoneURL; timePermitsURL; timePermitsStorageURL; authenticateURL; ";
        _options += "language; customLanguageTexts; accessNumberDigits; mobileAuthenticateURL; setDeviceName";

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
        html = Handlebars.templates[tmplName]({data:data, cfg: this.cfg});
        return html;
    };

    mpin.prototype.readyHelp= function(tmplName, tmplData) {
        var data = tmplData, html;
        html = Handlebars.templates[tmplName]({data:data, cfg: this.cfg});
        return html;
    };

    mpin.prototype.readyHelpHub= function(tmplName, tmplData) {
        var data = tmplData, html;
        html = Handlebars.templates[tmplName]({data:data, cfg: this.cfg});
        return html;
    };
    
 
    mpin.prototype.render = function(tmplName, callbacks, tmplData) {
        var data = tmplData || {}, k;
        this.el.innerHTML = this.readyHtml(tmplName, data);
 
        for (k in callbacks) {
            if (document.getElementById(k)) {

                if (window.navigator.msPointerEnabled) {
                    document.getElementById(k).addEventListener("MSPointerDown", callbacks[k], false);
                }
                else {
                    // document.getElementById(k).addEventListener('touchstart', callbacks[k], false);
                    document.getElementById(k).addEventListener('click', callbacks[k], false);

                }
 
            }
        }
        if (typeof mpin.custom !== 'undefined') {
            this.setCustomStyle();
        }
    };

    mpin.prototype.renderHelp = function(tmplName, callbacks, tmplData) {
        var data = tmplData || {}, k;

        this.elHelpOverlay.style.display = 'block';
        this.elHelpOverlay.style.opacity = "1";
        this.elHelp.innerHTML = this.readyHelp(tmplName, data);
        this.elHelp.style.display = 'block';

        for (k in callbacks) {
            if (document.getElementById(k)) {

                if (window.navigator.msPointerEnabled) {
                    document.getElementById(k).addEventListener("MSPointerDown", callbacks[k], false);
                }
                else {
                    document.getElementById(k).addEventListener('touchstart', callbacks[k], false);

                }
    
            }
        }
        if (typeof mpin.custom !== 'undefined') {
            this.setCustomStyle();
        }
    };

    mpin.prototype.renderHelpHub = function(tmplName, tmplData) {
        var data = tmplData || {}, k, self = this, helphubBtns = {};

        // // Dissmiss any open help menus

        self.dismissHelp();

        this.elHelpHub.style.display = 'flex';
        this.elHelpHub.style.opacity = "1";
        this.elHelpHub.innerHTML = this.readyHelpHub(tmplName, data);

        helphubBtns.first = function(evt) {
            // Modify the sequence for the templates
            // self.renderHelp("help-helphub", callbacks);

            console.log("This is clicked first");
        };

        helphubBtns.second = function(evt) {
            // Modify the sequence for the templates
            // self.renderHelp("help-helphub", callbacks);

            console.log("This is clicked seconds");
        };

        helphubBtns.details = function(evt) {
            // Modify the sequence for the templates
            self.renderHelpHub("helphub-details");

        };

        helphubBtns.forth = function(evt) {
            // Modify the sequence for the templates
            // self.renderHelp("help-helphub", callbacks);
        };

        helphubBtns.return = function(evt) {
            self.renderHelpHub("helphub-index");
        }

        helphubBtns.exit = function(evt) {
            self.dismissHelpHub();
        };

        for (k in helphubBtns) {
            if (document.getElementById(k)) {

                if (window.navigator.msPointerEnabled) {
                    document.getElementById(k).addEventListener("MSPointerDown", helphubBtns[k], false);
                }
                else {
                    document.getElementById(k).addEventListener('touchstart', helphubBtns[k], false);

                }

            }
        }
        if (typeof mpin.custom !== 'undefined') {
            this.setCustomStyle();
        }
    };

    mpin.prototype.dismissHelp = function() {
            this.elHelpOverlay.style.display = 'none';
            this.elHelpOverlay.style.opacity = '0';
            this.elHelp.style.display = 'none';
    }

    mpin.prototype.dismissHelpHub = function() {
            this.elHelpHub.style.display = 'none';
            this.elHelpHub.style.opacity = '0';
    }
 
    mpin.prototype.setLanguageText = function() {
        hlp.language = this.language;
        //      setLanguageText
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
 
        callbacks.mpin_authenticate = function(evt) {
 
            // Check for identity
            if(self.ds.getDefaultIdentity()) {
                self.renderLogin();
            } else {
                self.renderSetupHome.call(self, evt);               
            }
        };
        callbacks.mp_action_Login1 = function(evt) {
            self.renderLogin.call(self);
        };
        callbacks.mp_action_addIdentity2 = callbacks.mpin_authenticate;
        callbacks.mp_action_Login2 = callbacks.mp_action_Login1;
 
        this.render('home', callbacks);
 
        if (this.opts.mobileAppFullURL) {
            // RenderMobile Home
            this.renderHomeMobile();
        }
    };
    mpin.prototype.renderHomeMobile = function() {

        var callbacks = {}, self = this, identity;

        if (this.opts.prerollid) {
            this.renderSetup(this.opts.prerollid);
        }
 
        callbacks.mpin_authenticate = function(evt) {
            // Modify the sequence for the templates
            self.renderSetupHome.call(self);
        };

        callbacks.ok_dismiss = function(evt) {
            // Modify the sequence for the templates
            self.dismissHelp.call(self);
        };

        callbacks.show_more = function(evt) {
            // Modify the sequence for the templates
            self.renderHelp("help-helphub", callbacks);
        };

        callbacks.info = function(evt) {
            // Show the help item
            self.renderHelp("help-setup-home", callbacks);
        };

        callbacks.mp_action_setup = function(evt) {
            self.actionSetupHome.call(self);
        };
 
        identity = this.ds.getDefaultIdentity();
 
 
        // Check browsers
 
        function isMobileSafari() {
            return navigator.userAgent.match(/(iPad|iPhone|iPod touch)/)
            // return /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor);

        }

        function isIos7() {
            return navigator.userAgent.match(/(iPad|iPhone);.*CPU.*OS 7_\d/i)
        }
 
        // Check if Safari and if it's open as standalone app
        if(isMobileSafari() && !window.navigator.standalone) {
 
            // Render IOS7 view
            if(isIos7()) {
                
                this.render('ios7-startup', callbacks);
 
            } else {

                // Render the IOS6 view - the difference is in the icons
                this.render('ios6-startup', callbacks);
 
            }
 
        } else {
 
            // Check if online
            
            if(!navigator.onLine) {
                this.render('offline', callbacks);
            }
 
            // Check if there's identity, redirect to login where 'Add to identity will appear'
            else if (identity) {

                totalAccounts = this.ds.getAccounts();
                totalAccounts = Object.keys(totalAccounts).length;

                 if (totalAccounts === 0) {
                  this.renderSetupHome();
                 } else if (totalAccounts === 1) {
                  this.renderLogin();
                 } else if (totalAccounts > 1) {
                  this.renderLogin(true);
                 }

            } else {
                // Render renderSetupHome, if no identity exists
                this.renderSetupHome();
            }
        }
 
    };
 
    mpin.prototype.renderSetupHome = function(email, errorID) {

        var callbacks = {}, self = this, userId, descHtml, deviceName = "", deviceNameHolder = "";


        totalAccounts = this.ds.getAccounts();
        totalAccounts = Object.keys(totalAccounts).length;
        
        callbacks.mp_action_home = function(evt) {
            if (totalAccounts === 0) {
             self.renderSetupHome();
            } else if (totalAccounts === 1) {
             self.renderLogin();
            } else if (totalAccounts > 1) {
             self.renderLogin(true);
            }
        };
        callbacks.mp_action_setup = function(evt) {
            self.actionSetupHome.call(self);
        };

        userId = (email) ? email : "";

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

        console.log("Opts of the device name", this.opts.setDeviceName);

        this.render("setup-home", callbacks, {userId: userId, setDeviceName: this.opts.setDeviceName, deviceName: deviceName, deviceNameHolder: deviceNameHolder});

    };

    mpin.prototype.suggestDeviceName = function() {
        var suggestName, platform, browser;
        platform = navigator.platform.toLowerCase();
        browser = navigator.userAgent;

        if (platform.indexOf("mac") !== -1) {
            platform = "mac";
        } else if (platform.indexOf("linux") !== -1) {
            platform = "lin";
        } else if (platform.indexOf("win") !== -1) {
            platform = "win";
        } else if (platform.indexOf("sun") !== -1) {
            platform = "sun";
        } else if (platform.indexOf("iphone") !== -1) {
            platform = "iOS";
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
        } else if (browser.indexOf("iPhone") !== -1) {
            browser = "iPhone";
        } else {
            browser = "_";
        }

        suggestName = platform + browser;

        return suggestName;
    };
 
 
    mpin.prototype.renderSetup = function(email, clientSecretShare, clientSecretParams) {
        
        var callbacks = {}, self = this;

        callbacks.mp_action_home = function(evt) {
            if (totalAccounts === 0) {
             this.renderSetupHome();
            } else if (totalAccounts === 1) {
             this.renderLogin();
            } else if (totalAccounts > 1) {
             this.renderLogin(true);
            }
        };
        callbacks.mpinClear = function() {
            self.addToPin.call(self, "clear");
        };
        callbacks.mpinLogin = function() {
            self.actionSetup.call(self);
        };
 
        callbacks.menuBtn = function() {
            self.toggleButton.call(self);
        };

        callbacks.show_more = function(evt) {
            // Modify the sequence for the templates
            self.renderHelpHub("helphub-index", callbacks);
        };

        callbacks.info = function(evt) {
            // Show the help item
            self.renderHelp("help-setup-home", callbacks);
        };

        this.render("setup", callbacks, {email: email});


        var pinpadContainer = document.getElementById('circlesHolder');

        // Create dummy input els
        if (!this.isAccNumber) {

            var renderElem = document.getElementById('codes');
            renderElem.style.display = 'block';
            renderElem.innerHTML = "Enter your pin";

            for (var i = this.cfg.pinSize - 1; i >= 0; i--) {
                var circleA = document.createElement("div");
                var circleB = document.createElement("div");

                circleA.className = "circle";
                circleB.className = "outer-circle";

                circleA.appendChild(circleB);
                pinpadContainer.appendChild(circleA);
            };
        } 
        
 
        document.body.className = 'pinpadGlobal';
 
        this.enableNumberButtons(true);
        this.bindNumberButtons();
        
        //requestSignature
        this.requestSignature(email, clientSecretShare, clientSecretParams);
    };
 
    mpin.prototype.renderLogin = function(listAccounts) {

        var callbacks = {}, self = this;
 
        this.isAccNumber = true;

        var identity = this.ds.getDefaultIdentity();
        var email = this.getDisplayName(identity);

        if (!identity) {
            this.renderSetupHome();
        }

        if (!this.identity) {
            console.log("Comming even here");
            self.setIdentity(self.ds.getDefaultIdentity(), true);

        }
 
        callbacks.mp_action_home = function(evt) {
            if (totalAccounts === 0) {
             self.renderSetupHome();
            } else if (totalAccounts === 1) {
             self.renderLogin();
            } else if (totalAccounts > 1) {
             self.renderLogin(true);
            }
        };

        callbacks.mpinClear = function() {
            self.addToPin.call(self, "clear");
        };
 
        callbacks.menuBtn = function() {
            self.toggleButton.call(self);
        };


        callbacks.mpinLogin = function() {

            var callbacks = {};

            var pinpadDisplay = document.getElementById("pinpad-input");
 
            if (self.isAccNumber) {
                self.accessNumber = pinpadDisplay.value;

                if(self.accessNumber.length < self.opts.accessNumberDigits ) {
                    return;
                }

                // Clear the error codes display

                self.display(false, true);

                self.isAccNumber = false;

                self.enableButton(false, "go");
                self.enableButton(false, "clear");

                var pinPad = document.getElementById('pinsHolder');
                pinPad.className = '';

                // Empty the div
                document.getElementById('circlesHolder').innerHTML = "";

                var circlesHolder = document.getElementById('circlesHolder');

                for (var i = self.cfg.pinSize - 1; i >= 0; i--) {

                   var circleA = document.createElement("div");
                   var circleB = document.createElement("div");

                   circleA.className = "circle";
                   circleB.className = "outer-circle";

                   circleA.appendChild(circleB);
                   circlesHolder.appendChild(circleA);
                };

                self.addToPin("login");
            } else {

                self.pinPadLength = pinpadDisplay.value;

                if(self.pinPadLength.length < self.cfg.pinSize ) {
                    return;
                }
                self.actionLogin.call(self);
            }
        };
         
        this.render("setup", callbacks, {email: email, menu: true});
        this.enableNumberButtons(true);
        this.bindNumberButtons();
 
        var pinpadDisplay = document.getElementById("pinpad-input");

        //set placeholder to access Number text
        pinpadDisplay.placeholder = hlp.text("pinpad_placeholder_text2");
        pinpadDisplay.type = "text";

        var pinPad = document.getElementById('pinsHolder');
        var circlesHolder = document.getElementById('circlesHolder');
        var pinpadContainer = document.getElementById('inputContainer');

        var renderElem = document.getElementById('codes');
        renderElem.style.display = 'block';
        renderElem.innerHTML = "<info-inline id='acInfo'><i></i></info>" + hlp.text("pinpad_placeholder_text2");

        // Help hub callbacks

        callbacks.ok_dismiss = function(evt) {
            // Modify the sequence for the templates
            self.dismissHelp.call(self);
        };

        callbacks.show_more = function(evt) {
            // Modify the sequence for the templates
            self.renderHelpHub("helphub-index");
        };

        document.getElementById('acInfo').onclick = function(evt) {
            console.log("Click here?");
            // Show the help item
            self.renderHelp("help-setup-home", callbacks);
        };

        // Helphub calbacks

        document.getElementById('openHelpHub').onclick = function(evt) {
            self.renderHelpHub("helphub-index");
        };


        // Create dummy input els
        if (this.isAccNumber) {

            // Change class if ac number

            pinPad.className = 'access-number';

            for (var i = this.opts.accessNumberDigits - 1; i >= 0; i--) {
                var circleA = document.createElement("div");
                var circleB = document.createElement("div");

                circleA.className = "circle";
                circleB.className = "outer-circle";

                circleA.appendChild(circleB);
                circlesHolder.appendChild(circleA);
            };
        } 

        if (listAccounts) {
            this.toggleButton();
        } else {

            console.log("This is the before identttyty!!!!##!##");
            this.setIdentity(this.ds.getDefaultIdentity(), true, function() {
                self.display(hlp.text("pinpad_default_message"));
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
                if (jsonResponse.webOTP) {
                    self.webOTP = jsonResponse.webOTP;
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
//      _request.setRequestHeader('Content-Type', 'application/json');
        _request.send();
    };
 
    //post REQUEST
    mpin.prototype.getAccess = function() {
        var _request = new XMLHttpRequest(), self = this;
 
        _request.onreadystatechange = function() {
            var _jsonRes;
            if (_request.readyState === 4) {
                if (_request.status === 200) {
                    _jsonRes = JSON.parse(_request.responseText);
                    if (self.opts.onVerifySuccess) {
                        self.opts.onVerifySuccess(_jsonRes);
                    } else {
                        self.successLogin(_jsonRes);
                    }
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
        var _sendParams = {};
        if (this.webOTP) {
            sendParams.webOTP = this.webOTP;
            _request.send(JSON.stringify(_sendParams));
        } else {
            _request.send();
        }
        return _request;
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
        callbacks.mpin_action_setup = function(evt) {
            if (self.checkBtn(this))
                self.beforeRenderSetup.call(self, this);
        };
        callbacks.mpin_action_resend = function(evt) {
            if (self.checkBtn(this))
                self.actionResend.call(self, this);
        };
        this.render("activate-identity", callbacks, {email: email});
    };

    //prevent mpin button multi clicks
    mpin.prototype.checkBtn = function(btnElem) {
        var btnClass = btnElem.className;
        return (btnClass.indexOf("mpinBtnBusy") === -1 && btnClass.indexOf("mpinBtnError") === -1 && btnClass.indexOf("mpinBtnOk") === -1);
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

        console.log("I get the render btn el", btnElem);

        var btn = this.mpinButton(btnElem, "setupNotReady_check_info1");

        this.isAccNumber = false;

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
    mpin.prototype.renderAccountsPanel = function(back) {

        var self = this, 
            callbacks = {},
            renderElem, 
            addEmptyItem, 
            c = 0,
            mpBack = document.getElementById('mp_back'),
            menuBtn = document.getElementById('menuBtn');

            if (window.navigator.msPointerEnabled) {
                menuBtn.style.bottom = '0';
            }

        menuBtn.onclick = function(evt) {
            document.getElementById('accountTopBar').style.height = "";
            menuBtn.className = 'up';

        };

        addEmptyItem = function(cnt) {
            var p = document.createElement("div");
            p.className = "mp_contentEmptyItem";
            cnt.appendChild(p);
        };
 
        addMpinBack = function () {
            renderElem = document.getElementById('accountTopBar').appendChild(document.createElement("div"));
            renderElem.id = "mp_back";
            mpBack = document.getElementById("mp_back");
            mpBack.innerHTML = self.readyHtml("accounts-panel", {});
        }
 

        // Fix for IE compatibillity
        if(document.body.contains(mpBack) === false) {

            addMpinBack();
            mpBack.style.display = 'block';
 
 
            document.getElementById("mp_acclist_adduser").onclick = function(evt) {
                self.renderSetupHome.call(self, evt);
            };

            // Appending happens here

            var cnt = document.getElementById("mp_accountContent");
            this.addUserToList(cnt, this.ds.getDefaultIdentity(), true, 0);
            
            for (var i in this.ds.getAccounts()) {
                c += 1;
                if (i != this.ds.getDefaultIdentity())
                    this.addUserToList(cnt, i, false, c);
            }

            addEmptyItem(cnt);
 
        }
 
        //default IDENTITY


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
            mpBack = document.getElementById('mp_back');
            mpBack.parentNode.removeChild(mpBack);
            self.renderAccountsPanel();
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
            self.renderUserSettingsPanel(iD);
        };
    };
 
    mpin.prototype.renderDeletePanel = function(iD) {
        var renderElem, name, self = this;
        name = this.getDisplayName(iD);
 
        renderElem = document.getElementById("mp_back");
        renderElem.innerHTML = this.readyHtml("delete-panel", {name: name});
 
        document.getElementById("mp_acclist_deluser").onclick = function(evt) {
            self.deleteIdentity(iD);

            self.renderHomeMobile.call(self, evt);
            // Render the identity list too
 
        };
        document.getElementById("mp_acclist_cancel").onclick = function(evt) {
            self.renderUserSettingsPanel(iD);
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
            divClass = "mp_contentItem one-edge-shadow default";
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
 
        if (window.navigator.msPointerEnabled) {

            rowElem.addEventListener('MSPointerDown', mEventsHandler, false);
        }
        else {
            rowElem.addEventListener('touchstart', mEventsHandler, false);

        }
 
        // document.getElementById('mp_back').remove();
 
        function mEventsHandler(e) {

            var elem = document.getElementById("mp_back");
            elem.parentNode.removeChild(elem);
 
            removeClass(document.getElementsByClassName("mp_itemSelected")[0], "mp_itemSelected");
            // addClass(rowElem, "mp_itemSelected");
            self.ds.setDefaultIdentity(uId);
            self.setIdentity(uId, true);
            self.renderLogin();

            // Hide the identity list

            menuBtn = document.getElementById('menuBtn');

            document.getElementById('accountTopBar').style.height = "";
            menuBtn.className = 'up';

        }
 
        document.getElementById("mp_btIdSettings_" + iNumber).onclick = function(ev) {
            console.log(uId);
            self.renderUserSettingsPanel(uId);
            ev.stopPropagation();
            return false;
        };
 
    };
 
    mpin.prototype.renderIdentityNotActive = function(email) {
        var callbacks = {}, self = this;
 
        callbacks.mp_action_home = function(evt) {
            if (totalAccounts === 0) {
             self.renderSetupHome();
            } else if (totalAccounts === 1) {
             self.renderLogin();
            } else if (totalAccounts > 1) {
             self.renderLogin(true);
            }
        };
        //Check again
        callbacks.mpin_action_setup = function() {
            if (self.checkBtn(this))
                self.beforeRenderSetup.call(self, this);
        };
        //email
        callbacks.mpin_action_resend = function() {
            if (self.checkBtn(this))
                self.actionResend.call(self, this);
        };
        //identities list
        callbacks.mp_action_accounts = function() {
            self.renderLogin.call(self, true, email);
        };

        this.render("identity-not-active", callbacks, {email: email});
    };
 
    mpin.prototype.bindNumberButtons = function() {
        var self = this, btEls;
        btEls = document.getElementsByClassName("btn");

        for (var i = 0; i < btEls.length; i++) {

            // Mobile touch events

            if (window.navigator.msPointerEnabled) {

                btEls[i].addEventListener('MSPointerDown', mEventsHandler, false);

            }
            else {
                btEls[i].addEventListener('touchstart', mEventsHandler, false);

            }
 
            function mEventsHandler(e) {

                var parent = document.getElementById("inputContainer");
                var child = document.getElementById("codes");
                
                // if (e.type == "touchstart") {

                if(self.isAccNumber && parent.contains(child)) {
                    child.style.display = 'none';
                }

                var circles = document.getElementsByClassName("circle");

                for (var i = circles.length - 1; i >= 0; i--) {
                    circles[i].style.display = 'inline-block';
                };


                var circlesHolder = document.getElementById("circlesHolder");

                circlesHolder.style.display = 'flex';

                self.addToPin(e.target.getAttribute("data-value"));
                // return false;
 
              // }
            }
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
                element.className = "btn disabled";
                element.disabled = true;
            }
        }
    };
    //
    mpin.prototype.addToPin = function(digit) {

        this.display("");

        var pinpadContainer = document.getElementById('inputContainer')
            , pinElement = document.getElementById('pinpad-input')
            , element
            , elemForErrcode = document.getElementById('codes')
            , circlesHolder = document.getElementById('circlesHolder')
            , ifDigit = new RegExp('[0-9]');

        if(ifDigit.test(parseInt(digit))) {

            // Hide codes

            elemForErrcode.style.display = 'none';
            circlesHolder.style.display = 'block';

            var circles = document.getElementsByClassName("circle");

            // Add circles

            element = document.createElement("div");

            if(this.isAccNumber) {
                element.className = 'inner-circle-ac';
                element.innerHTML = digit;
            } else {
                element.className = 'inner-circle';
            }

            // Use setTimeout to trigger the animation

            element.style.width = "18px";
            element.style.height = "18px";
            element.style.margin = "7px";

            pinElement.value += digit;

            var addToDivNum =  pinElement.value.length -1;

            // Append the circle element here
            circles[addToDivNum].appendChild(element);
        }

        if (digit === 'clear') {

           var circlesClear = document.getElementsByClassName("circle")
             , element = {};

           if(this.isAccNumber) {
               element.className = 'inner-circle-ac';
           } else {
               element.className = 'inner-circle';
           }

           // Rotate the circles

            for (var i = 0; i < circlesClear.length; i++) {

                var nodes = circlesClear[i].querySelector('.' + element.className);

                if (circlesClear[i].querySelector('.' + element.className)) {

                    circlesClear[i].removeChild(nodes);

                    pinElement.value = "";
                    this.enableNumberButtons(true);
                }

            }

            // Disable the clear and the sign in buttons

            this.enableButton(false, "go");
            this.enableButton(false, "clear");

        }
 
        if (digit === 'login') {
 
            if (!this.isAccNumber) {

                pinElement.value = "";
 
                elemForErrcode.style.display = "block";
                elemForErrcode.innerHTML = "Enter your pin";
                circlesHolder.style.display = 'none';

                pinElement.type = "password";
 
                this.enableNumberButtons(true);
 
                return;
            }
        }
 
        if (pinElement.value.length === 1) {

            console.log("Comming here to enable the clear");
            this.enableButton(true, "clear");
        }
 
        else if (this.isAccNumber) {
            if (pinElement.value.length === this.opts.accessNumberDigits) {

                console.log("Comming here to enable the digits");

                // Append the number of circles

                this.enableNumberButtons(false);
                this.enableButton(true, "go");
                this.enableButton(true, "clear");
            }
        }
 
        else if (pinElement.value.length === this.cfg.pinSize) {

            this.enableNumberButtons(false);
            this.enableButton(true, "go");
            this.enableButton(true, "clear");
        }
    };
    /**
     *  wrap all buttons function inside ...
     * 
     * @param {type} enable
     * @param {type} buttonName
     * @returns {undefined}
     */
    mpin.prototype.enableButton = function(enable, buttonName) {

        var buttonValue = {}, _element;
        buttonValue.go = {id: "mpinLogin", trueClass: "btnLogin", falseClass: "btnLogin disabled"};
        buttonValue.clear = {id: "mpinClear", trueClass: "btnClear", falseClass: "btnClear disabled"};
        buttonValue.toggle = {id: "mp_toggleButton", trueClass: "mp_DisabledState", falseClass: ""};
        _element = document.getElementById(buttonValue[buttonName].id);
        if (!buttonValue[buttonName] || !_element) {
            return;
        }
 
        _element.disabled = !enable;
        _element.className = buttonValue[buttonName][enable + "Class"];
    };
    //showInPinPadDisplay
    mpin.prototype.display = function(message, clear) {

        var self = this;
 
        var elemForErrcode = document.getElementById('codes');

        if(message === 'INCORRECT M-PIN!') {

            elemForErrcode.style.display = "block";
            elemForErrcode.className = "error";
            elemForErrcode.innerHTML = message;

            self.addToPin("clear");
        } 

        if(message === 'INVALID ACCESS NUMBER!') {

            elemForErrcode.style.display = "block";
            elemForErrcode.className = "error";
            elemForErrcode.innerHTML = message;

            self.addToPin("clear");
        }

        if(clear) {
            elemForErrcode.className = "";
        }
        
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
        var accountTopBar = document.getElementById('accountTopBar')
        var menuBtn = document.getElementById("menuBtn");

        // console.log(self);

        // if(menuBtn.classList.contains("close")) {
        //     return;
        // }

        if (menuBtn && !menuBtn.classList.contains("close")) {
 
            console.log("set IDENTITY ;::", typeof this.setIdentity);
 
            this.setIdentity(this.identity, true, function() {
                self.display(self.cfg.pinpadDefaultMessage);
            }, function() {
                return false;
            });

            accountTopBar.style.height = "100%"
            menuBtn.className = 'close';

            this.renderAccountsPanel();
 
            removeClass("mp_toggleButton", "mp_SelectedState");
            removeClass("mp_panel", "mp_flip");
        }

        return false;
    };
 
    mpin.prototype.actionSetupHome = function(uId) {

        var _email, _deviceName, _deviceNameInput, _reqData = {}, self = this;

        _email = (uId) ? uId : document.getElementById("emailInput").value;

        if (_email.length === 0 || !this.opts.emailCheckRegex.test(_email)) {
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
            console.log("case set DEVICE NAME", _deviceName);

            _reqData.data.deviceName = _deviceName;
            this.ds.setDeviceName(_deviceName);
        }

        console.log("############_reqData", _reqData);
 
        //register identity
        requestRPS(_reqData, function(rpsData) {
            console.log("rpsData ::::", rpsData);
            if (rpsData.error) {
                self.error("Activate First");
                return;
            }
            self.ds.addIdentity(rpsData.mpinId, "");
            self.ds.setIdentityData(rpsData.mpinId, {regOTT: rpsData.regOTT});

            self.ds.setDefaultIdentity(rpsData.mpinId);
            self.identity = rpsData.mpinId;
 
            // Check for existing userid and delete the old one
            self.ds.deleteOldIdentity(rpsData.mpinId);
 
            self.renderActivateIdentity();
        });
    };
 
    mpin.prototype.requestSignature = function(email, clientSecretShare, clientSecretParams) {
        var self = this;
 
        /*
         requestSignature(email, 0, this.opts.signatureURL, this.opts.authenticateHeaders, function(params) {
         var _urlParams = ["app_id=" + encodeURIComponent(params.app_id), "mpin_id=" + encodeURIComponent(params.mpin_id), "expires=" + encodeURIComponent(params.expires),
         "mobile=" + encodeURIComponent(params.mobile), "signature=" + encodeURIComponent(params.signature)].join("&");
         self.identity = params.mpin_id;
         */

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

        // add identity into URL + regOTT
        requestRPS(_reqData, function(rpsData) {
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
 
    mpin.prototype.actionSetup = function() {

        var self = this, _pin = document.getElementById('pinpad-input').value;
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
                    self.successSetup();
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

        var callbacks = {};

        var authServer, getAuth, self = this, pinValue = document.getElementById('pinpad-input').value, accessNumber;
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
        accessNumber = this.accessNumber;
        //authServer = this.opts.authenticateURL;
        getAuth(authServer, this.opts.appID, this.identity, this.ds.getIdentityPermit(this.identity), this.ds.getIdentityToken(this.identity),
                this.opts.requestOTP, accessNumber, this.opts.seedValue, pinValue, this.opts.mobileAuthenticateURL, this.opts.authenticateRequestFormatter, this.opts.customHeaders,
                function(success, errorCode, errorMessage, authData) {
                    console.log("authenticate arguments :", errorCode);
                    if (success) {
                        var iD = self.identity;
                        self.successLogin(authData, iD);
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

                        callbacks.mp_action_register = function(evt) {

                            self.renderSetupHome.call(self, evt);
                        };

                        // TODO: Register again or select new identity

                        self.render('access-denied', callbacks, {email: self.getDisplayName(iD)});

                    } else if (errorCode === "INVALIDACCESSNUMBER") {

                        // Render the access number again
                        self.renderLogin.call(self);
                        self.display(hlp.text("authPin_errorInvalidAccessNumber"));
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
        
        accId = document.getElementById('mpinUser');

        if(accId) {
            accId.children[0].innerText = displayName;
            accId.setAttribute("title", displayName);
        }

        // no Identity go to setup HOME
        if (!this.identity) {
            this.renderSetupHome();
            return;
        }

        if (requestPermit) {

            if (this.ds.getIdentityToken(this.identity) == "") {
                this.renderIdentityNotActive(displayName);
                return;
            }
 
            this.enableNumberButtons(false);
            this.enableButton(false, "go");
            this.enableButton(false, "clear");
            this.enableButton(true, "toggle");
//          mpin.enableToggleButton(true);
            console.log("before call identity PERMIT :)");
            this.requestPermit(newIdentity, function(timePermitHex) {
                console.log("call IDENTITY PERMIT :::");
                self.enableNumberButtons(true);
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
 
    /*
     *
     * @param {type} authData
     * @returns {undefined}
     *  successSetup: function(authData){
     if (mpin.opts.successSetupURL) {
     window.location = mpin.opts.successSetupURL;
     } else if (mpin.opts.onSuccessSetup) {
     ,          mpin.opts.onSuccessSetup(authData, function(){
     mpin.renderSetupDone();
     });
     } else {
     mpin.renderSetupDone();
     }
     },
     *
     */
 
 
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
        _request.open("GET", url, true);
        _request.send();
 
        _request.onreadystatechange = function() {
            if (_request.readyState === 4 && _request.status === 200)
            {
                cb(JSON.parse(_request.responseText));
            } else if (_request.readyState === 4 && !navigator.onLine) {
                cb({error: 500});
            }
        };
 
    };
 
    //Post request
    mpin.prototype.ajaxPost = function(url, data, cb) {
        var _request = new XMLHttpRequest();
        _request.onreadystatechange = function() {
            if (_request.status === 106)
            {
                console.log("POST success ....");
 
                // Tempory fix
                if (_request.responseText == '') {
                    cb(true);
                }
            }
        };
        _request.open("Post", url, true);
        _request.send(JSON.stringify(data));
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
            // Render the identity list panel
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
        if (typeof(localStorage['mpin']) === "undefined") {
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
 
        mpinDs.getIdentityData = function(uId, key) {
            return mpinDs.mpin.accounts[uId][key];
        };
 
        return mpinDs;
    };
 
    mpin.prototype.successLogin = function(authData, iD) {
        var callbacks = {}, self = this;

        callbacks.mp_action_home = function(evt) {
            if (totalAccounts === 0) {
             self.renderSetupHome();
            } else if (totalAccounts === 1) {
             self.renderLogin();
            } else if (totalAccounts > 1) {
             self.renderLogin(true);
            }
        };

        callbacks.mp_action_logout = function(evt) {

            if(authData.logoutURL) {
                self.ajaxPost( authData.logoutURL, authData.logoutData, function(res) {
                    if (res) {
                        self.renderLogin();
                    }
                });
            } else {
                self.renderLogin();
            }

        };

        this.render("success-login", callbacks, {email: self.getDisplayName(iD)});
    };

    mpin.prototype.certivoxClientSecretURL = function(params) {
//      return this.cfg.apiUrl + this.cfg.apiVersion + "/clientSecret?" + params;
        return this.opts.certivoxURL + "clientSecret?" + params;
    };
 
    mpin.prototype.dtaClientSecretURL = function(params) {
        return this.opts.mpinDTAServerURL + "clientSecret?" + params;
    };
 
     mpin.prototype.certivoxPermitsURL = function() {
        var hash_mpin_id_hex = mpinAuth.sha256_hex(this.identity);
        return this.opts.certivoxURL + "timePermit?app_id=" + this.opts.appID + "&mobile=0&hash_mpin_id=" + hash_mpin_id_hex;
    };

    mpin.prototype.dtaPermitsURL = function() {
        var mpin_idHex = this.identity;
//      return this.opts.timePermitsURL + "timePermit?app_id=" + this.opts.appID + "&mobile=0&mpin_id=" + mpin_idHex;
        return this.opts.timePermitsURL + "/" + mpin_idHex;
    };

    mpin.prototype.certivoxPermitsStorageURL = function() {
        var that = this;

        return function(date, storageId) {
            console.log("timePermitsStorageURL Base: " + that.opts.timePermitsStorageURL)
            if ((date) && (that.opts.timePermitsStorageURL) && (storageId)) {
                return that.opts.timePermitsStorageURL + "/" + that.opts.appID + "/" + date + "/" + storageId;
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
        } else {
            el.className = className;
        }
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
    ;
 
    function removeClass(elId, className) {
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
    ;
 
    //private variable
    //en
    lang.en = {};
    lang.en = {
        "pinpad_initializing": "Initializing...",
        "pinpad_errorTimePermit": "ERROR GETTING PERMIT:",
        "home_alt_mobileOptions": "Mobile Options",
        "home_button_authenticateMobile_noTrust": "Sign in with Smartphone <br> (This is a PUBLIC device which I DO NOT trust)",
        "home_button_authenticateMobile_trust": "Sign in with Browser <br> (This is a PERSONAL device which I DO trust)",
        "home_button_authenticateMobile_intro": "First let's establish trust to choose the best way for you to access this service:",
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
        "setup_header": "ADD AN IDENTITY TO THIS DEVICE",
        "setup_text1": "Enter your email address:",
        "setup_text2": "Your email address will be used as your identity when M-Pin authenticates you to this service.",
        "setup_text3": "your email address",
        "setup_error_unathorized": "{0} has not been registered in the system.", // {0} will be replaced with the userID
        "setup_error_server": "Cannot process the request. Please try again later.",
        "setup_error_signupexpired": "Your signup request has been expired. Please try again.",
        "setup_button_setup": "Setup M-Pin",
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
        "setupReady_button_go": "Verified your identity?",
        "setupReady_button_go_cont": "Setup your M-Pin now",
        "setupReady_button_resend": "Not received the email?Send it again",
        "setupReady_button_resend_cont": "Send it again",
        "setupNotReady_header": "YOU MUST VERIFY <br/>YOUR IDENTITY",
        "setupNotReady_text1": "Your identity",
        "setupNotReady_text2": "has not been verified.",
        "setupNotReady_text3": "You need to click the link in the email we sent you, and then choose <br/> 'Setup M-Pin'.",
        "setupNotReady_check_info1": "Checking",
        "setupNotReady_check_info2": "Identity not verified!",
        "setupNotReady_resend_info1": "Sending email",
        "setupNotReady_resend_info2": "Email sent!",
        "setupNotReady_button_check": "Setup M-Pin",
        "setupNotReady_button_resend": "Send the email again",
        "setupNotReady_button_back": "Go to the identities list",
        "authPin_header": "Enter your M-Pin",
        "authPin_button_clear": "Clear",
        "authPin_button_login": "Login",
        "authPin_pleasewait": "Authenticating...",
        "authPin_success": "Success",
        "authPin_errorInvalidPin": "INCORRECT M-PIN!",
        "authPin_errorInvalidAccessNumber": "INVALID ACCESS NUMBER!",
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
        "pinpad_placeholder_text": "Enter your pin",
        "pinpad_placeholder_text2": "Enter your access Number",
        "logout_text1": "YOU ARE NOW LOGGED IN",
        "logout_button": "Logout",
        "home_button_setupMobile": "Add an identity to this browser",
        "mobile_splash_text": "INSTALL THE M-PIN MOBILE APP",
        "mobile_add_home_ios6": "Tap the <img src='resources/templates/@@templatename/img/ios6-share.png'/> icon to 'Add to homescreen'",
        "mobile_add_home_ios7": "Tap the <img src='resources/templates/@@templatename/img/ios7-share.png'/> icon to 'Add to homescreen'",
        "help_text_1": "Simply choose a memorable <b>[4 digit]</b> PIN to assign to this identity by pressing the numbers in sequence followed by the 'Setup' button to setup your PIN for this identity",
        "help_ok_btn": "Ok, Got it",
        "help_more_btn": "I'm not sure, tell me more",
        "logout_btn": "Sign out",
        "success_header": "Success",
        "success_text": "You are now signed in as:",
        "accessdenied_header": "Access Denied",
        "accessdenied_text": "Your M-Pin identity",
        "accessdenied_text_cont": "has been removed from this device.",
        "accessdenied_btn": "Register again"
    };
    //  image should have config properties
    hlp.img = function(imgSrc) {
        return IMAGES_PATH + imgSrc;
    };
    //  translate
    hlp.text = function(langKey) {
        //hlp.language set inside render
        //customLanguageTexts - language
        return lang[hlp.language][langKey];
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
})();