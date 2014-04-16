(function() {
	mpin.template = {};
	//mobile
	mpin.template['home_mobile'] = '<div class="mp_welcomeOpt"><img src="<%= hlp.img("mobile-icon.png") %>" width="50" height="42" /></div>' +
			'<section id="mp_acc1">' +
			'<h2><span class="mp_minimise"><a href="#mp_min1"><img src="<%= hlp.img("minimise.png") %>" width="16" height="16" alt="minimise" /></a></span><a href="#mp_acc1">' +
			'<img class="mp_maximise" src="<%= hlp.img("maximise.png") %>" width="16" height="16" alt="maximise" /></a><a href="#" id="mp_action_mobileLogin1"><%= hlp.text("home_button_authenticateMobile")%>' +
			'</a><a class="mp_arrow" href="#" id="mp_action_mobileLogin2"><img src="<%= hlp.img("arrow.png") %>" width="29" height="29"/></a></h2>' +
			'<p><%= hlp.text("home_button_authenticateMobile_description") %></p>' +
			'</section>' +
			'<section id="mp_acc2">' +
			'<h2><span class="mp_minimise"><a href="#mp_min2"><img src="<%= hlp.img("minimise.png") %>" width="16" height="16" alt="minimise" /></a></span><a href="#mp_acc2">' +
			'<img class="mp_maximise" src="<%= hlp.img("maximise.png") %>" width="16" height="16" alt="maximise" /></a><a href="#" id="mp_action_mobileSetup1"><%= hlp.text("home_button_getMobile") %></a>' +
			'</a><a class="mp_arrow" href="#" id="mp_action_mobileSetup2"><img src="<%= hlp.img("arrow.png") %>" width="29" height="29" /></a></h2>' +
			'<p><%= hlp.text("home_button_getMobile_description") %></p>' +
			'</section>';

	mpin.template['home'] =
			'<div id="mp_pinpadHolder" style="height:auto;">' +
			'<div id="mp_headerlrg">' +
			'	<img src="<%= hlp.img("m-pin-header-logo.png") %>" width="183" height="69" alt="M-Pin Logo" />' +
			'	<div class="mp_clear"></div></div>' +
			'	<div id="mp_contentPadWithHeaderthin">' +
			'		<div id="mp_wrapperthin">' +
			'			<article class="mp_accordion">' +
			'				<div id="renderMobileHome"></div>' +
			'				<div class="mp_welcomeOpt"><img src="<%= hlp.img("mac-icon.png") %>" width="50" height="42" alt="Browser on desktop Options" /></div>' +
			'				<section id="mp_acc3">' +
			'					<h2><span class= "mp_minimise"><a href="#mp_min3"><img src="<%= hlp.img("minimise.png") %>" width="16" height="16" alt="minimise" /></a></span><a href="#mp_acc3">' +
			'					<img class="mp_maximise" src="<%= hlp.img("maximise.png") %>" width="16" height="16" alt="maximise" /></a><a href="#" id="mp_action_Login1"><%= hlp.text("home_button_authenticateBrowser") %></a>' +
			'					<a class="mp_arrow" href="#" id="mp_action_Login2"><img src="<%= hlp.img("arrow.png") %>" width="29" height="29"/></a></h2>' +
			'					<p><%= hlp.text("home_button_authenticateBrowser_description") %></p>' +
			'				</section>' +
			'				<section id="mp_acc4">' +
			'					<h2><span class="mp_minimise"><a href="#mp_min4"><img src="<%= hlp.img("minimise.png") %>" width="16" height="16" alt="minimise" /></a></span><a href="#mp_acc4">' +
			'					<img class="mp_maximise" src="<%= hlp.img("maximise.png") %>" width="16" height="16" alt="maximise" /></a><a href="#" id="mp_action_addIdentity1"><%= hlp.text("home_button_setupBrowser") %></a>' +
			'					<a class="mp_arrow" href="#" id="mp_action_addIdentity2" title="Authenticate with your Mobile"><img src="<%= hlp.img("arrow.png") %>" width="29" height="29" alt="Setup identity in this Browser" /></a></h2>' +
			'					<p><%= hlp.text("home_button_setupBrowser_description")%></p>' +
			'				</section>' +
			'			</article>' +
			'</div></div></div>';

	mpin.template['login'] =
			'<div id="mp_pinpadHolder">' +
			'<div id="mp_headersml">' +
			'	<section class="mp_floatLeft"><a href="#" id="mp_action_home"><img src="<%= hlp.img("icon-home-sml.png") %>" alt="Home" /></a></section>' +
			'	<section class="mp_floatRight"><img src="<%= hlp.img("m-pin-logo-white-sml.png") %>" alt="M-Pin Logo" /></section>' +
			'	<div class="mp_clear"></div>' +
			'</div>' +
			'<div id="mp_contentPadWithHeaderthin">' +
			'	<div id="mp_wrapperthin">' +
			'		<div class="mp_mainMenu">' +
			'			<div id="mp_accountID"></div>' +
			'       	<button id = "mp_toggleButton" tabindex ="-1" ></button>' +
			'		</div><div class="mp_clear"></div>' +
			'		<div id="mp_panel" class="mp_panel">' +
			'		<div id="mp_front" class="mp_front">' +
			'			<div id="mp_main_wrap">' +
			'				<div id="mp_display_wrap" >' +
			'    				<input type="text" id="mp_display" tabindex ="-1" readonly = "readonly" />' +
//			'					<input type="password" id="mp_pin" maxlength="' + mpin.pinSize + '" value="" readonly="readonly" style="display: none;"/>' +
			'					<input type="password" id="mp_pin" maxlength="100" value="" readonly="readonly" style="display: none;"/>' +
			'				</div>' +
			'				<div id="mp_pin_wrap" >' +
			'    					<button class="mp_pin mp_pindigit mp_inactive" tabindex="-1" data-value="1">1</button>' +
			'    					<button class="mp_pin mp_pindigit mp_inactive" tabindex="-1" data-value="2">2</button>' +
			'    					<button class="mp_pin mp_pindigit mp_inactive" tabindex="-1" data-value="3">3</button>' +
			'	    				<button class="mp_pin mp_pindigit mp_inactive" tabindex="-1" data-value="4">4</button>' +
			'   	 				<button class="mp_pin mp_pindigit mp_inactive" tabindex="-1" data-value="5">5</button>' +
			'    					<button class="mp_pin mp_pindigit mp_inactive" tabindex="-1" data-value="6">6</button>' +
			'    					<button class="mp_pin mp_pindigit mp_inactive" tabindex="-1" data-value="7">7</button>' +
			'    					<button class="mp_pin mp_pindigit mp_inactive" tabindex="-1" data-value="8">8</button>' +
			'    					<button class="mp_pin mp_pindigit mp_inactive" tabindex="-1" data-value="9">9</button>' +
			'   	 				<button id="mp_btclear" class="mp_pin mp_actionbutton mp_inactive" tabindex="-1" data-value="clear"><%= hlp.text("authPin_button_clear") %><br />&times;</button>' +
			' 	   					<button class="mp_pin mp_pindigit mp_inactive" tabindex="-1" data-value="0">0</button>' +
			'						<button id="mp_btgo" class="mp_pin mp_actionbutton mp_loginbutton mp_inactive" tabindex="-1" data-value="go"><%= hlp.text("authPin_button_login") %><br />&rarr;</button>' +
			'				</div>' +
			'			</div>' +
			'		</div>' +
			'		<div id="mp_back" class="mp_back mp_main_wrap_style">kkk</div>' +
			'		</div' +
			'		<div style="clear:both;"></div>' +
			'		<div id="mp_pinfooter">' +
			'			<img id="mp_mpinlogo" src="<%= hlp.img("byCertivox.png")%>" height="13" style="height:13px;" alt="CertiVox M-PIN"/>' +
			'		</div>' +
			'	</div>' +
			'</div></div>';

	mpin.template['setup'] =
			'<div id="mp_pinpadHolder">' +
			'<div id="mp_headersml">' +
			'	<section class="mp_floatLeft"><a href="#" id="mp_action_home"><img src="<%= hlp.img("icon-home-sml.png" ) %>" alt="Home" /></a></section>' +
			'	<section class="mp_floatRight"><img src="<%= hlp.img("m-pin-logo-white-sml.png" ) %>" alt="M-Pin Logo" /></section>' +
			'	<div class="mp_clear"></div>' +
			'</div>' +
			'<div id="mp_contentPadWithHeaderthin">' +
			'	<div id="mp_wrapperthin">' +
			'		<div id="mp_accountID" alt="<%= email %>"><%= email %> <% console.log("cfg :::", cfg); %></div>' +
			'		<div id="mp_main_wrap">' +
			'			<div id="mp_display_wrap" >' +
			'    			<input type="text" id="mp_display" tabindex ="-1" readonly = "readonly" />' +
			'				<input type="password" id="mp_pin" maxlength="' + mpin.pinSize + '" value="" readonly="readonly" style="display: none;"/>' +
			'			</div>' +
			'			<div id="mp_pin_wrap" >' +
			'    				<button class="mp_pin mp_pindigit mp_inactive" tabindex="-1" data-value="1">1</button>' +
			'    				<button class="mp_pin mp_pindigit mp_inactive" tabindex="-1" data-value="2">2</button>' +
			'    				<button class="mp_pin mp_pindigit mp_inactive" tabindex="-1" data-value="3">3</button>' +
			'    				<button class="mp_pin mp_pindigit mp_inactive" tabindex="-1" data-value="4">4</button>' +
			'    				<button class="mp_pin mp_pindigit mp_inactive" tabindex="-1" data-value="5">5</button>' +
			'    				<button class="mp_pin mp_pindigit mp_inactive" tabindex="-1" data-value="6">6</button>' +
			'    				<button class="mp_pin mp_pindigit mp_inactive" tabindex="-1" data-value="7">7</button>' +
			'    				<button class="mp_pin mp_pindigit mp_inactive" tabindex="-1" data-value="8">8</button>' +
			'    				<button class="mp_pin mp_pindigit mp_inactive" tabindex="-1" data-value="9">9</button>' +
			'    				<button id="mp_btclear" class="mp_pin mp_actionbutton mp_inactive" tabindex="-1" data-value="clear"><%= hlp.text("setupPin_button_clear" ) %><br/>&times;</button>' +
			'    				<button class="mp_pin mp_pindigit mp_inactive" tabindex="-1" data-value="0">0</button>' +
			'					<button id="mp_btgo" class="mp_pin mp_actionbutton mp_loginbutton mp_inactive" tabindex="-1" data-value="go"><%= hlp.text("setupPin_button_done" ) %><br />&rarr;</button>' +
			'			</div>' +
			'		</div>' +
			'		<div style="clear:both;"></div>' +
			'		<div id="mp_pinfooter">' +
			'			<img id="mp_mpinlogo" src="<%= hlp.img("byCertivox.png" ) %>" height="13" style="height:13px;margin-top:10px" alt="CertiVox M-PIN"/>' +
			'		</div>' +
			'	</div>' +
			'</div></div>';



	mpin.template['setup-home'] =
			'<div id="mp_pinpadHolder">' +
			'<div id="mp_headersml">' +
			'	<section class="mp_floatLeft"><a href="#" id="mp_action_home"><img src="<%= hlp.img("icon-home-sml.png") %>" alt="Home" /></a></section>' +
			'	<section class="mp_floatRight"><img src="<%= hlp.img("m-pin-logo-white-sml.png") %>" alt="M-Pin Logo" /></section>' +
			'	<div class="mp_clear"></div>' +
			'</div>' +
			'<div id="mp_contentPadWithHeaderthin">' +
			'	<div id="mp_wrapperthin">' +
			'		<h1><%= hlp.text("setup_header") %></h1>' +
			'		<div class="mp_back mp_main_wrap_style">' +
			'			<div class="PinPadListViewSkin">' +
			'				<div class="mp_headerFrame" style="text-align:center;">' +
			'					<div class="mp_infoTitle" style="margin-top: 20px;"><%= hlp.text("setup_text1") %></div>' +
			'					<input class="mp_emailInput" id="mp_emailaddress" type="email" />' +
			' <%= description %> ' +
			'				</div>' +
			'				<div id="mp_acclist_adduser" style="padding:20px 10px 0px 10px">' +
			'					<button class="mp_blueSkin" tabindex=-1 id="mp_action_setup"><%= hlp.text("setup_button_setup") %></button>' +
			'				</div>' +
			'			</div>' +
			'		</div>' +
			'		<div style="clear:both;"></div>' +
			'		<div id="mp_pinfooter">' +
			'			<img id="mp_mpinlogo" src="<%= hlp.img("byCertivox.png") %>" height="13" style="height:13px;margin-top:10px" alt="CertiVox M-PIN" />' +
			'		</div>' +
			'	</div>' +
			'</div></div>';

	mpin.template['activate-identity'] = '<div id="mp_pinpadHolder">' +
			'<div id="mp_headersml">' +
			'	<section class="mp_floatLeft"><a href="#" id="mp_action_home"><img src="<%= hlp.img("icon-home-sml.png") %>" alt="Home" /></a></section>' +
			'	<section class="mp_floatRight"><img src="<%= hlp.img("m-pin-logo-white-sml.png") %>" alt="M-Pin Logo" /></section>' +
			'	<div class="mp_clear"></div>' +
			'</div>' +
			'<div id="mp_contentPadWithHeaderthin">' +
			'	<div id="mp_wrapperthin">' +
			'		<h1 class="mp_largerText"><%= hlp.text("setupReady_header") %></h1>' +
			'		<div class="mp_note" style="margin-top:0px"><p class="mp_center"><%= hlp.text("setupReady_text1") %><br/>' +
			'           <span style="padding: 10px 5px 20px 5px;" class="mp_accountField"><%= email %></span><br/><%= hlp.text("setupReady_text2") %></p>' +
			'			<p><%= hlp.text("setupReady_text3") %></p>' +
			'		</div>' +
			'		<button type="button" name="" value="" class="mp_blueBtn" id="mp_action_setup"><%= hlp.text("setupReady_button_go") %></button>' +
			'		<span id="mp_action_info" class="info-checking"><%= hlp.text("setupNotReady_check_info1") %></span>' +
			'		<button type="button" name="" value="" class="mp_blueBtn" id="mp_action_resend"><%= hlp.text("setupReady_button_resend") %></button>' +
			'		<span id="mp_action_info" class="info-checking"><%= hlp.text("setupNotReady_check_info1") %></span>' +
			'		<div style="clear:both;"></div>' +
			'	</div>' +
			'</div></div>';

	mpin.template['accounts-panel'] =
			' <div id="mp_accountListView" class="PinPadListViewSkin" > ' +
			'<div class="mp_customScrollBox" >' +
			'<div class="mp_container" >' +
			'<div id="mp_accountContent" class="mp_content"></div>' +
			'</div>' +
			'</div>' +
			'</div> ' +
			'<div style="padding:0px 10px"><button id="mp_acclist_adduser" class="mp_blueSkin" tabindex=-1><%= hlp.text("account_button_addnew") %>' +
			'</button></div>';


	mpin.template['identity-not-active'] = '<div id="mp_pinpadHolder">' +
			'<div id="mp_headersml">' +
			'	<section class="mp_floatLeft"><a href="#" id="mp_action_home"><img src="<%= hlp.img("icon-home-sml.png") %>" alt="Home" /></a></section>' +
			'	<section class="mp_floatRight"><img src="<%= hlp.img("m-pin-logo-white-sml.png") %>" alt="M-Pin Logo" /></section>' +
			'	<div class="mp_clear"></div>' +
			'</div>' +
			'<div id="mp_contentPadWithHeaderthin">' +
			'	<div id="mp_wrapperthin" style="overflow:hidden">' +
			'		<h1 class="mp_largerText"><%= hlp.text("setupNotReady_header") %></h1>' +
			'		<div class="mp_note" style="margin:0px;padding:0px"><p class="mp_center" style="width:240px"><%= hlp.text("setupNotReady_text1") %><br/>' +
			'			<span style="padding: 10px 5px 20px 5px;" class="mp_accountField"><%= email %></span><br/><%= hlp.text("setupNotReady_text2") %></p>' +
			'			<p><%= hlp.text("setupNotReady_text3") %></p>' +
			'		</div>' +
			'		<button type="button" name="" value="" class="mp_blueBtn" id="mp_action_setup"><%= hlp.text("setupNotReady_button_check") %></button>' +
			'		<span id="mp_info_recheck" class="info-checking"><%= hlp.text("setupNotReady_check_info1") %></span>' +
			'		<button type="button" name="" value="" class="mp_blueBtn" id="mp_action_resend"><%= hlp.text("setupNotReady_button_resend") %></button>' +
			'		<span id="mp_info_resend" class="info-checking"><%= hlp.text("setupNotReady_resend_info1") %></span>' +
			'		<button type="button" name="" value="" class="mp_blueBtn" id="mp_action_accounts"><%= hlp.text("setupNotReady_button_back") %></button>' +
			'	</div>' +
			'</div></div>';

	mpin.template['user-row'] = '<div id="mp_StarIcon_<%= iNumber %>" class="mp_starIcon" tabindex=-1></div>' +
			'<div class="mp_titleItem" title="<%= name %>"><%= name %></div>' +
			'<div id="mp_btIdSettings_<%= iNumber %>" class="mp_buttonItem"><img src="<%= hlp.img("id-settings.png") %>" tabindex=-1/></div>';


	mpin.template['user-settings'] = '<div id="mp_accountListView" class="PinPadListViewSkin" > ' +
			'<div class="customScrollBox" >' +
			'<div class="mp_container" >' +
			'<div id="mp_accountContent" class="mp_content"></div>' +
			'</div>' +
			'</div>' +
			'</div> ' +
			'<dWiv class="mp_alertContainer mp_alertMainContainer">' +
			'<div class="mp_headerFrameCancelOnly">' +
			'	<div class="mp_accountField" style="padding: 10px 5px 50px 5px;"><%= name %></div>' +
			'	<div style="padding:0px 10px">' +
			'		<button id="mp_deluser" class="mp_blueSkin" tabindex=-1><%= hlp.text("account_button_delete") %></button>' +
			'		<button id="mp_reactivate" class="mp_blueSkin" tabindex=-1><%= hlp.text("account_button_reactivate") %></button>' +
			'	</div>' +
			'</div>' +
			'<div class="mp_bottomFrame">' +
			'	<div style="padding:0px 10px">' +
			'		<button id="mp_acclist_cancel" class="mp_graySkin" tabindex=-1><%= hlp.text("account_button_backToList") %></button>' +
			'	</div>' +
			'</div>' +
			'</div>';

	mpin.template['delete-panel'] = '<div id="mp_accountListView" class="PinPadListViewSkin" > ' +
			'<div class="customScrollBox" >' +
			'<div class="mp_container" >' +
			'<div id="mp_accountContent" class="mp_content"></div>' +
			'</div>' +
			'</div>' +
			'</div> ' +
			'<dWiv class="mp_alertContainer mp_alertMainContainer">' +
			'<div class="mp_headerFrame">' +
			'<div class="mp_alertTitle"><%= hlp.text("account_delete_question")  %></div>' +
			'<div class="mp_accountField"><%= name %></div>' +
			'</div>' +
			'<div class="mp_bottomFrame">' +
			'<div style="padding:0px 10px">' +
			'<button id="mp_acclist_deluser" class="mp_blueSkin" tabindex=-1><%= hlp.text("account_delete_button") %></button></div>' +
			'<button id="mp_acclist_cancel" class="mp_graySkin" tabindex=-1><%= hlp.text("account_button_cancel") %></button></div>' +
			'</div>' +
			'</div>' +
			'</div>';

	mpin.template['reactivate-panel'] = '<div id="mp_accountListView" class="PinPadListViewSkin" > ' +
			'<div class="customScrollBox" >' +
			'<div class="mp_container" >' +
			'<div id="mp_accountContent" class="mp_content"></div>' +
			'</div>' +
			'</div>' +
			'</div> ' +
			'<div class="mp_alertContainer mp_alertMainContainer">' +
			'<div class="mp_headerFrame">' +
			'<div class="mp_alertTitle"><%= hlp.text("account_reactivate_question") %></div>' +
			'<div class="mp_accountField"><%= name %></div>' +
			'</div>' +
			'<div class="mp_bottomFrame">' +
			'<div style="padding:0px 10px">' +
			'<button id="mp_acclist_reactivateuser" class="mp_blueSkin" tabindex=-1><%= hlp.text("account_reactivate_button") %></button></div>' +
			'<button id="mp_acclist_cancel" class="mp_graySkin" tabindex=-1><%= hlp.text("account_button_cancel") %></button></div>' +
			'</div>' +
			'</div>' +
			'</div>';

	mpin.template['mobile-login'] = '<div id="mp_pinpadHolder">' +
			'<div id="mp_headersml">' +
			'	<section class="mp_floatLeft"><a href="#" id="mp_action_home"><img src="<%= hlp.img("icon-home-sml.png" ) %>" alt="Home" /></a></section>' +
			'	<section class="mp_floatRight"><img src="<%= hlp.img("m-pin-logo-white-sml.png") %>" alt="M-Pin Logo" /></section>' +
			'	<div class="mp_clear"></div>' +
			'</div>' +
			'<div id="mp_contentPadWithHeaderthin">' +
			'	<div id="mp_wrapperthin">' +
			'		<h1><%= hlp.text("mobileAuth_header") %></h1>' +
			'		<div class="mp_accessNumberHolder">' +
			'			<p><%= hlp.text("mobileAuth_text1") %></p>' +
			'			<label class="mp_accessNumber" id="mp_accessNumber"></label>' +
			'			<div class="clear"></div>' +
			'		</div>' +
			'		<p class="mp_note"><%= hlp.text("mobileAuth_text2") %><br/>' +
			'		<label id="mp_seconds" class="mp_red"></label><br/><%= hlp.text("mobileAuth_text3") %></p>' +
			'		<p class="mp_note_small"><%= hlp.text("mobileAuth_text4") %></p>' +
			'	</div>' +
			'</div></div>';

	mpin.template['mobile-setup'] = '<div id="mp_pinpadHolder">' +
			'<div id="mp_headersml">' +
			'	<section class="mp_floatLeft"><a href="#" id="mp_action_home"><img src="<%= hlp.img("icon-home-sml.png") %>" alt="Home" /></a></section>' +
			'	<section class="mp_floatRight"><img src="<%= hlp.img("m-pin-logo-white-sml.png") %>" alt="M-Pin Logo" /></section>' +
			'	<div class="mp_clear"></div>' +
			'</div>' +
			'<div id="mp_contentPadWithHeaderthin">' +
			'	<div id="mp_wrapperthin">' +
			'		<h1><%= hlp.text("mobileGet_header") %></h1>' +
			'		<div class="mp_qrHolder">' +
			'			<p><%= hlp.text("mobileGet_text1") %></p>' +
			'			<div id="mp_qrcode" style="margin: 0 auto;width: 129px; height: 129px; padding: 5px; background-color: white" alt="QR"></div>' +
			'			<p class="mp_scanUrl"><%= hlp.text("mobileGet_text2") %><br /><%= mobileAppFullURL %></p>' +
			'			<div class="mp_clear"></div>' +
			'		</div>' +
			'		<a href="#" id="mp_action_cancel" class="mp_button"><%= hlp.text("mobileGet_button_back") %></a>' +
			'	</div>' +
			'</div></div>';
	
	mpin.template['setup-done'] = '<div id="mp_pinpadHolder">' +
		'<div id="mp_headersml">' +
		'	<section class="mp_floatLeft"><a href="#" id="mp_action_home"><img src="<%=  hlp.img("icon-home-sml.png") %>" alt="Home" /></a></section>' +
		'	<section class="mp_floatRight"><img src="<%=  hlp.img("m-pin-logo-white-sml.png") %>" alt="M-Pin Logo" /></section>' +
		'	<div class="mp_clear"></div>' +
		'</div>' +
		'<div id="mp_contentPadWithHeaderthin">' +
		'	<div id="mp_wrapperthin">' +
		'		<h1 class="mp_largerText"><%= hlp.text("setupDone_header") %></h1>' +
		'		<div class="mp_note" style="margin-top:0px"><p class="mp_center"><%= hlp.text("setupDone_text1") %><br/>'+
		'           <span style="padding: 10px 5px 20px 5px;" class="mp_accountField"><%=  userId %></span><br/><%= hlp.text("setupDone_text2") %></p>' +
		'			<p><%= hlp.text("setupDone_text3") %></p>' +
		'		</div>' +
		'		<button type="button" name="" value="" class="mp_blueBtn" id="mp_action_go"><%= hlp.text("setupDone_button_go") %></button>' +
   		'		<div style="clear:both;"></div>'+
		'	</div>' +
		'</div></div>';
			
})();


