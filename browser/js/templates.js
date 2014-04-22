(function() {
    mpin.template = {};
    mpin.template['mobile-setup'] = ['<div class="pinpad" id="topNav">',
        '    <a id="mp_action_home" href="#">',
        '        <div id="homeBtn"></div>',
        '    </a>',
        '    <div id="mpinLogo"></div>',
        '</div>',
        '',
        '<div id="mpinMobileTitle">',
        '	<%=hlp.text( "mobileGet_header") %>',
        '</div>',
        '',
        '<div id="pinsHolder">',
        '	<div class="mpinMobileHolder" id="mpinSetupHolder">',
        '		<p>',
        '			<%=hlp.text( "mobileGet_text1") %>',
        '		</p>',
        '		',
        '		<span id="mpin_qrcode">',
        '		</span>',
        '		',
        '		<p>',
        '			<%=hlp.text( "mobileGet_text2") %>',
        '			<br />',
        '            <%= mobileAppFullURL %>',
        '		</p>',
        '		',
        '	</div>',
        '	',
        '	<div id="mpinMobileButton">',
        '		<button id="mp_action_cancel" class="mpinMobileButton">',
        '				<%=hlp.text( "mobileGet_button_back") %>',
        '		</button>',
        '	</div>',
        '</div>',
        '',
        '<div id="mpinFooter">',
        '    <div id="homeBtn"></div>',
        '</div>'].join('');

    mpin.template['accounts-panel'] = ['<div id="mp_accountListView" class="active">',
        '    <div class="mp_customScrollBox">',
        '        <div class="mp_container">',
        '            <div id="mp_accountContent" class="mp_content"></div>',
        '        </div>',
        '    </div>',
        '</div>',
        '',
        '<div id="bottomBtnHolder">',
        '	<button class="mpinBtn" id="mp_acclist_adduser">',
        '		<span class="btnLabel"><%=hlp.text("account_button_addnew") %></span>',
        '	</button>',
        '</div>'].join('');

    mpin.template['delete-warning'] = ['<!-- Home/Top Nav Bar -->',
        '',
        '<div id="topNav">',
        '    <div id="mp_action_home">',
        '    </div>',
        '    <div id="mpinLogo">',
        '    </div>',
        '</div>',
        '',
        '<!-- User section -->',
        '',
        '<div id="header">',
        '  <div id="menuIcon"></div>',
        '  <div id="mpinLogo"></div>',
        '</div>',
        '',
        '<!-- Input button -->',
        '',
        '<div id="identityContainer">',
        '',
        '  <div class="identityMainText">',
        '      <div class="congrats">',
        '        <%= hlp.text("deactivated_header") %>',
        '      </div>',
        '',
        '      <div class="identityBodyText">',
        '          <p>',
        '			  <span class="mp_accountField">',
        '				  <%=  userId %>',
        '			  </span>',
        '          </p>',
        '          <p>',
        '            <%= hlp.text("deactivated_text1") %>',
        '          </p>',
        '          <p>',
        '              <%= hlp.text("deactivated_text2") %>',
        '          </p>',
        '      </div>',
        '  </div>',
        '',
        '  <div id="buttonsContainer">',
        '      <div class="mpinBtn" id="mp_action_go">',
        '          <span class="iconArrow"></span>',
        '          <span class="btnLabel"><%= hlp.text("deactivated_button_register") %></span>',
        '      </div>',
        '  </div> ',
        '',
        '</div>',
        '',
        '<div id="mpinFooter">',
        '    <div id="homeBtn">',
        '    </div>',
        '</div>'].join('');

    mpin.template['home_mobile'] = ['<div id="homeIcon">',
        '    <div id="mobileIcon"></div>',
        '</div>',
        '<div id="buttonsContainer">',
        '    <div class="mpinBtn" id="mpin_mobile_login">',
        '        <span class="iconArrow"></span>',
        '        <span class="btnLabel"><%=hlp.text( "home_button_authenticateMobile") %></span>',
        '    </div>',
        '	<div class="mpinBtn" id="mpin_mobile_setup">',
        '        <span class="iconArrow"></span>',
        '        <span class="btnLabel"><%=hlp.text( "home_button_getMobile") %></span>',
        '    </div> ',
        '</div>',
        ''].join('');

    mpin.template['user-settings'] = ['<div id="mp_accountListView" class="active">',
        '    <div class="mp_customScrollBox">',
        '        <div class="mp_container">',
        '            <div id="mp_accountContent" class="mp_content">',
        '			',
        '			',
        '			    <div class="mp_accountField" style="padding: 10px 5px 50px 5px;">',
        '					<%=name %>',
        '				</div>',
        '				<div style="padding:0px 10px">',
        '					<button id="mp_deluser" class="mpinBtn" style="padding: 5px;" tabindex=-1>',
        '						<%=hlp.text( "account_button_delete")%>',
        '					</button>',
        '					<br />',
        '					<button id="mp_reactivate" class="mpinBtn" style="padding: 5px;" tabindex=-1>',
        '						<%=hlp.text( "account_button_reactivate")%>',
        '					</button>',
        '				</div>',
        '			',
        '			',
        '			',
        '			</div>',
        '        </div>',
        '    </div>',
        '</div>',
        '',
        '	',
        '<div id="bottomBtnHolder">',
        '	<button class="mpinBtn" id="mp_acclist_cancel">',
        '		<span class="btnLabel"><%=hlp.text("account_button_backToList") %></span>',
        '	</button>',
        '</div>'].join('');

    mpin.template['setup'] = ['<div class="pinpad" id="topNav">',
        '    <a id="mp_action_home" href="#">',
        '        <div id="homeBtn"></div>',
        '    </a>',
        '    <div id="mpinLogo"></div>',
        '</div>',
        '<div id="accountTopBar">',
        '    <div id="mpinUser">',
        '        <p><%= email %> <% console.log("cfg :::", cfg); %></p>',
        '    </div>',
        '</div>',
        ' ',
        '<div id="pinsHolder">',
        '',
        '    <div id="inputContainer">',
        '        <input id="pinpad-input" type="text" readonly="true" placeholder="<%= hlp.text("pinpad_placeholder_text") %>">',
        '    </div>',
        '',
        '    <div class="pre-row">',
        '        <div class="row">',
        '            <button class="btn" data-value="1">',
        '                1',
        '            </button>',
        '            <button class="btn" data-value="2">',
        '                2',
        '            </button>',
        '            <button class="btn" data-value="3">',
        '                3',
        '            </button>',
        '        </div>',
        '    </div>',
        '    <div class="pre-row">',
        '        <div class="row">',
        '            <button class="btn" data-value="4">',
        '                4',
        '            </button>',
        '            <button class="btn" data-value="5">',
        '                5',
        '            </button>',
        '            <button class="btn" data-value="6">',
        '                6',
        '            </button>',
        '        </div>',
        '    </div>',
        '    <div class="pre-row">',
        '        <div class="row">',
        '            <button class="btn" data-value="7">',
        '                7',
        '            </button>',
        '            <button class="btn" data-value="8">',
        '                8',
        '            </button>',
        '            <button class="btn" data-value="9">',
        '                9',
        '            </button>',
        '        </div> ',
        '    </div>',
        '    <div class="pre-row">',
        '        <div class="row bottom">',
        '            <button class="btnClear" data-value="clear" id="mpinClear" disabled>',
        '                <span class="label"><%= hlp.text("setupPin_button_clear") %></span>',
        '            </button>',
        '            <button class="btn" data-value="0">',
        '                <span class="label mp_pindigit">0</span>',
        '            </button>',
        '            <button class="btnLogin" data-value="go" id="mpinLogin" disabled>',
        '                <span class="label"><%= hlp.text("setupPin_button_done") %></span>',
        '            </button>',
        '        </div>',
        '    </div>',
        '</div>',
        '<div class="pinpad" id="mpinFooter">',
        '    <div id="homeBtn"></div>',
        '</div>'].join('');

    mpin.template['delete-panel'] = ['<div id="mp_operationView" class="active">',
        '	<div class="mp_container">',
        '            ',
        '		<div class="mp_headerFrame">',
        '			<div class="mp_alertTitle">',
        '				<%=hlp.text( "account_delete_question") %>',
        '			</div>',
        '			<div class="mp_accountField">',
        '				<%=name %>',
        '			</div>',
        '		</div>',
        '		<div class="mp_bottomFrame">',
        '			<div style="padding:0px 10px">',
        '				<button id="mp_acclist_deluser" class="mpinBtn" tabindex=-1>',
        '					<%=hlp.text( "account_delete_button") %>',
        '				</button>',
        '			</div>',
        '			<button id="mp_acclist_cancel" class="mpinGreyButton" tabindex=-1>',
        '				<%=hlp.text( "account_button_cancel") %>',
        '			</button>',
        '		</div>',
        '	',
        '	</div>',
        '</div>',
        ''].join('');

    mpin.template['setup-done'] = ['<!-- Home/Top Nav Bar -->',
        '',
        '<div id="topNav">',
        '    <div id="mp_action_home">',
        '    </div>',
        '    <div id="mpinLogo">',
        '    </div>',
        '</div>',
        '',
        '<!-- User section -->',
        '',
        '<div id="header">',
        '  <div id="menuIcon"></div>',
        '  <div id="mpinLogo"></div>',
        '</div>',
        '',
        '<!-- Input button -->',
        '',
        '<div id="identityContainer">',
        '',
        '  <div class="identityMainText">',
        '      <div class="congrats">',
        '        <%= hlp.text("setupDone_header") %>',
        '      </div>',
        '',
        '      <div class="identityBodyText">',
        '          <p>',
        '              <%= hlp.text("setupDone_text1") %>',
        '                  <span class="mp_accountField">',
        '                      <%=  userId %>',
        '                  </span>',
        '          </p>',
        '          <p>',
        '            <%= hlp.text("setupDone_text2") %>',
        '          </p>',
        '          <p>',
        '              <%= hlp.text("setupDone_text3") %>',
        '          </p>',
        '      </div>',
        '  </div>',
        '',
        '  <div id="buttonsContainer">',
        '      <div class="mpinBtn" id="mp_action_go">',
        '          <span class="iconArrow"></span>',
        '          <span class="btnLabel"><%= hlp.text("setupDone_button_go") %></span>',
        '      </div>',
        '  </div> ',
        '',
        '</div>',
        '',
        '<div id="mpinFooter">',
        '    <div id="homeBtn">',
        '    </div>',
        '</div>'].join('');

    mpin.template['reactivate-panel'] = ['<div id="mp_operationView" class="active">',
        '	<div class="mp_container">',
        '            ',
        '		<div class="mp_headerFrame">',
        '			<div class="mp_alertTitle">',
        '				<%=hlp.text( "account_reactivate_question") %>',
        '			</div>',
        '			<div class="mp_accountField">',
        '				<%=name %>',
        '			</div>',
        '		</div>',
        '		<div class="mp_bottomFrame">',
        '			<div style="padding:0px 10px">',
        '				<button id="mp_acclist_reactivateuser" class="mpinBtn" tabindex=-1>',
        '					<%=hlp.text( "account_reactivate_button") %>',
        '				</button>',
        '			</div>',
        '			<button id="mp_acclist_cancel" class="mpinGreyButton" tabindex=-1>',
        '				<%=hlp.text( "account_button_cancel") %>',
        '			</button>',
        '		</div>',
        '	',
        '	</div>',
        '</div>'].join('');

    mpin.template['home'] = ['<div id="header">',
        '    <div id="mpinLogo"></div>',
        '</div>',
        '',
        '<div id="renderMobileHome"></div>',
        '',
        '<div id="homeIcon">',
        '    <div id="desktopIcon"></div>',
        '</div>',
        '<div id="buttonsContainer">',
        '    <div class="mpinBtn" id="mpin_authenticate">',
        '        <span class="iconArrow"></span>',
        '        <span class="btnLabel"><%=hlp.text("home_button_authenticateBrowser") %></span>',
        '    </div>',
        '    <div class="mpinBtn" id="mpin_setup">',
        '        <span class="iconArrow"></span>',
        '        <span class="btnLabel"><%=hlp.text("home_button_setupBrowser") %></span>',
        '    </div>       ',
        '</div>',
        '<div id="mpinFooter">',
        '    <div id="homeBtn"></div>',
        '</div>'].join('');

    mpin.template['identity-not-active'] = ['<!-- Home/Top Nav Bar -->',
        '<div class="pinpad" id="topNav">',
        '    <a id="mp_action_home" href="#">',
        '        <div id="homeBtn"></div>',
        '    </a>',
        '    <div id="mpinLogo"></div>',
        '</div>',
        '',
        '<!-- Input button -->',
        '',
        '<div id="identityContainer">',
        '',
        '  <div class="identityMainText">',
        '      <div>',
        '	  <h1><%= hlp.text("setupNotReady_header") %></h1>',
        '      </div>',
        '',
        '      <div class="mp_note" style="margin:0pxpadding:0px">',
        '          <p class="mp_center">',
        '              <%=hlp.text( "setupNotReady_text1") %>',
        '                  <br/>',
        '                  <span style="padding: 10px 5px 20px 5px" class="mp_accountField">',
        '                      <%= email %>',
        '                  </span>',
        '                  <br/>',
        '                  <%=hlp.text( "setupNotReady_text2") %>',
        '          </p>',
        '          <p class="mp_after_center">',
        '              <%=hlp.text( "setupNotReady_text3") %>',
        '          </p>',
        '      </div>',
        '  </div>',
        '',
        '  <div id="buttonsContainer">',
        '      <div class="mpinBtn" id="mpin_setup">',
        '          <span class="iconArrow"></span>',
        '          <span class="btnLabel"><%=hlp.text( "setupNotReady_button_check") %></span>',
        '      </div>',
        '      <div class="mpinBtn" id="mpin_resend">',
        '          <span class="iconArrow"></span>',
        '          <span class="btnLabel"><%=hlp.text( "setupNotReady_button_resend")%></span>',
        '      </div>',
        '	  <div class="mpinBtn" id="mpin_accounts">',
        '          <span class="iconArrow"></span>',
        '          <span class="btnLabel"><%=hlp.text( "setupNotReady_button_back")%></span>',
        '      </div>',
        '  </div>',
        '',
        '</div>',
        '',
        '<div id="mpinFooter">',
        '    <div id="homeBtn">',
        '    </div>',
        '</div>'].join('');

    mpin.template['login'] = ['<div class="pinpad" id="topNav">',
        '    <a id="mp_action_home" href="#">',
        '        <div id="homeBtn"></div>',
        '    </a>',
        '    <div id="mpinLogo"></div>',
        '</div>',
        '',
        '<div id="accountTopBar">',
        '    <div id="mpinUser">',
        '    </div>',
        '		<div id="menuBtn"></div>',
        '</div>',
        ' ',
        '<div id="pinsHolder">',
        '',
        '    <div id="inputContainer">',
        '        <input id="pinpad-input" type="text" readonly="true" placeholder="<%= hlp.text("pinpad_placeholder_text") %>">',
        '    </div>',
        '',
        '    <div class="pre-row">',
        '        <div class="row">',
        '            <button class="btn" data-value="1">',
        '                1',
        '            </button>',
        '            <button class="btn" data-value="2">',
        '                2',
        '            </button>',
        '            <button class="btn" data-value="3">',
        '                3',
        '            </button>',
        '        </div>',
        '    </div>',
        '    <div class="pre-row">',
        '        <div class="row">',
        '            <button class="btn" data-value="4">',
        '                4',
        '            </button>',
        '            <button class="btn" data-value="5">',
        '                5',
        '            </button>',
        '            <button class="btn" data-value="6">',
        '                6',
        '            </button>',
        '        </div>',
        '    </div>',
        '    <div class="pre-row">',
        '        <div class="row">',
        '            <button class="btn" data-value="7">',
        '                7',
        '            </button>',
        '            <button class="btn" data-value="8">',
        '                8',
        '            </button>',
        '            <button class="btn" data-value="9">',
        '                9',
        '            </button>',
        '        </div>',
        '    </div>',
        '    <div class="pre-row">',
        '        <div class="row bottom">',
        '            <button class="btnClear" data-value="clear" id="mpinClear" disabled>',
        '                <span class="label">clear</span>',
        '            </button>',
        '            <button class="btn" data-value="0">',
        '                <span class="label mp_pindigit">0</span>',
        '            </button>',
        '            <button class="btnLogin" data-value="go" id="mpinLogin" disabled>',
        '                <span class="label">login</span>',
        '            </button>',
        '        </div>',
        '    </div>',
        '</div>',
        '<div id="mpinIdentities" style="display: none;">',
        '</div>',
        '',
        '',
        '',
        '<div class="pinpad" id="mpinFooter">',
        '    <div id="homeBtn"></div>',
        '</div>'].join('');

    mpin.template['setup-home'] = ['<!-- Home/Top Nav Bar -->',
        '',
        '<div id="topNav">',
        '    <div id="mp_action_home">',
        '    </div>',
        '    <div id="mpinLogo">',
        '    </div>',
        '</div>',
        '',
        '<!-- User section -->',
        '',
        '<div id="addIdentity">',
        '  <div class="identityHeader"><%=hlp.text( "setup_header") %></div>',
        '</div>',
        '',
        '<!-- Input button -->',
        '',
        '<div id="identityContainer" class="active">',
        '  <div class="inputContainer">',
        '    ',
        '    <div class="identityElHolder">',
        '      <div class="identityText">',
        '          <span><%=hlp.text( "setup_text1") %></span>',
        '      </div>',
        '',
        '      <div class="identityInput">',
        '        <div>',
        '          <input type="email" id="emailInput" placeholder="Enter pin here" value="<%= userId %>">',
        '        </div>',
        '      </div>',
        '    </div>',
        '',
        '  </div>',
        '',
        '  <div class="identityMainText">',
        '      <div>',
        '        <%=hlp.text( "setup_text2") %>',
        '      </div>',
        '  </div>',
        '',
        '</div>',
        '',
        '<div id="bottomBtnHolder">',
        '    <button class="mpinBtn" id="mp_action_setup">',
        '        <span class="btnLabel"><%=hlp.text( "setup_button_setup") %></span>',
        '    </button>',
        '</div>',
        '',
        '<div id="mpinFooter">',
        '    <div id="homeBtn">',
        '    </div>',
        '</div>'].join('');

    mpin.template['user-row'] = ['<div id="mp_StarIcon_<%= iNumber %>" class="mp_starIcon" tabindex=-1></div>',
        '<div class="mp_titleItem" title="<%= name %>">',
        '    <%=name %>',
        '</div>',
        '<div id="mp_btIdSettings_<%= iNumber %>" class="mp_buttonItem">',
        '    <img src="<%= hlp.img("id-settings.svg") %>" tabindex=-1/>',
        '</div>'].join('');

    mpin.template['activate-identity'] = ['<!-- User section -->',
        '<div class="pinpad" id="topNav">',
        '    <a id="mp_action_home" href="#">',
        '        <div id="homeBtn"></div>',
        '    </a>',
        '    <div id="mpinLogo"></div>',
        '</div>',
        '',
        '<!-- Input button -->',
        '',
        '<div id="identityContainer">',
        '',
        '  <div class="identityMainText">',
        '		',
        '	<div>',
        '		<h1><%= hlp.text("setupReady_header") %></h1>',
        '    </div>',
        '	  ',
        '	    <div class="mp_note" style="margin:0pxpadding:0px">',
        '          <p class="mp_center">',
        '              <%=hlp.text( "setupReady_text1") %>',
        '                  <br/>',
        '                  <span style="padding: 10px 5px 20px 5px" class="mp_accountField">',
        '                      <%= email %>',
        '                  </span>',
        '                  <br/>',
        '                  <%=hlp.text( "setupReady_text2") %>',
        '          </p>',
        '          <p class="mp_after_center">',
        '              <%=hlp.text( "setupReady_text3") %>',
        '          </p>',
        '      </div>',
        '  </div>',
        '',
        '  <div id="buttonsContainer">',
        '      <div class="mpinBtn" id="mpin_action_setup">',
        '          <span class="iconArrow"></span>',
        '          <span class="btnLabel"><%=hlp.text( "setupReady_button_go") %></span>',
        '      </div>',
        '      <div class="mpinBtn" id="mpin_action_resend">',
        '          <span class="iconArrow"></span>',
        '          <span class="btnLabel"><%=hlp.text( "setupReady_button_resend")%></span>',
        '      </div>',
        '  </div> ',
        '',
        '</div>',
        '',
        '<div id="mpinFooter">',
        '    <div id="homeBtn">',
        '    </div>',
        '</div>'].join('');

    mpin.template['mobile-login'] = ['<!-- Home/Top Nav Bar -->',
        '<div class="pinpad" id="topNav">',
        '    <a id="mp_action_home" href="#">',
        '        <div id="homeBtn"></div>',
        '    </a>',
        '    <div id="mpinLogo"></div>',
        '</div> ',
        '',
        '<div id="mpinMobileTitle">',
        '	<%=hlp.text( "mobileAuth_header") %>',
        '</div>',
        '',
        '<div id="pinsHolder">',
        '',
        '	<div class="mpinMobileHolder" id="mpinLoginHolder">',
        '		<p>',
        '			<%=hlp.text( "mobileAuth_text1") %>',
        '		</p>',
        '		<span id="mpin_accessNumber">',
        '			',
        '		</span>',
        '	</div>',
        '	',
        '	<div id="mpinMobileDesc">',
        '		<p class="mp_note">',
        '			<%=hlp.text( "mobileAuth_text2") %>',
        '				<br/>',
        '				<label id="mpin_seconds"></label>',
        '				<br/>',
        '				<%=hlp.text( "mobileAuth_text3") %>',
        '		</p>',
        '		',
        '		<p class="mpinNoteWarning">',
        '			<%=hlp.text( "mobileAuth_text4") %>',
        '		</p>',
        '	</div>',
        '',
        '</div>',
        '',
        '<div id="mpinFooter">',
        '    <div id="homeBtn">',
        '    </div>',
        '</div>'].join('');

    mpin.template['logout'] = ['<!-- Home/Top Nav Bar -->',
        '',
        '<div id="topNav">',
        '    <div id="mp_action_home">',
        '    </div>',
        '    <div id="mpinLogo">',
        '    </div>',
        '</div>',
        '',
        '<!-- User section -->',
        '',
        '<div id="header">',
        '  <div id="menuIcon"></div>',
        '  <div id="mpinLogo"></div>',
        '</div>',
        '',
        '<!-- Input button -->',
        '',
        '<div id="identityContainer">',
        '',
        '  <div class="identityMainText">',
        '      <div class="congrats">',
        '        <%= hlp.text("logout_text1") %>',
        '      </div>',
        ' ',
        '  </div>',
        '',
        '  <div id="buttonsContainer">',
        '      <div class="mpinBtn" id="mpin_action_logout">',
        '          <span class="iconArrow"></span>',
        '          <span class="btnLabel"><%= hlp.text("logout_button") %></span>',
        '      </div>',
        '  </div> ',
        '',
        '</div>',
        '',
        '<div id="mpinFooter">',
        '    <div id="homeBtn">',
        '    </div>',
        '</div>'].join('');
})();