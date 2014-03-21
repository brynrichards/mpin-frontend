(function() {
    mpin.template = {};
    mpin.template['mobile-setup'] = ['<div id="mp_pinpadHolder">',
        '    <div id="mp_headersml">',
        '        <section class="mp_floatLeft"><a href="#" id="mp_action_home"><img src="<%= hlp.img("icon-home-sml.png") %>" alt="Home" /></a>',
        '        </section>',
        '        <section class="mp_floatRight">',
        '            <img src="<%= hlp.img(" m-pin-logo-white-sml.png ") %>" alt="M-Pin Logo" />',
        '        </section>',
        '        <div class="mp_clear"></div>',
        '    </div>',
        '    <div id="mp_contentPadWithHeaderthin">',
        '        <div id="mp_wrapperthin">',
        '            <h1>',
        '                <%=hlp.text( "mobileGet_header") %>',
        '            </h1>',
        '            <div class="mp_qrHolder">',
        '                <p>',
        '                    <%=hlp.text( "mobileGet_text1") %>',
        '                </p>',
        '                <div id="mp_qrcode" style="margin: 0 autowidth: 129px height: 129px padding: 5px background-color: white" alt="QR"></div>',
        '                <p class="mp_scanUrl">',
        '                    <%=hlp.text( "mobileGet_text2") %>',
        '                        <br />',
        '                        <%=mobileAppFullURL %>',
        '                </p>',
        '                <div class="mp_clear"></div>',
        '            </div>',
        '            <a href="#" id="mp_action_cancel" class="mp_button">',
        '                <%=hlp.text( "mobileGet_button_back") %>',
        '            </a>',
        '        </div>',
        '    </div>',
        '</div>'].join('');

    mpin.template['accounts-panel'] = ['<div id="mp_accountListView" class="PinPadListViewSkin">',
        '    <div class="mp_customScrollBox">',
        '        <div class="mp_container">',
        '            <div id="mp_accountContent" class="mp_content"></div>',
        '        </div>',
        '    </div>',
        '</div>',
        '<div style="padding:0px 10px">',
        '    <button id="mp_acclist_adduser" class="mp_blueSkin" tabindex=-1>',
        '        <%=hlp.text( "setupReady_button_resend") %>',
        '    </button>',
        '</div>'].join('');

    mpin.template['home_mobile'] = ['<header id="header">',
        '    <div id="mpinLogo"></div>',
        '</header>',
        '<div id="homeIcon">',
        '    <div id="mobileIcon"></div>',
        '</div>',
        '<div id="buttonsContainer">',
        '    <div class="mpinBtn" id="mpin_authenticate">',
        '        <span class="iconArrow"></span>',
        '        <span class="btnLabel"><%=hlp.text( "home_button_authenticateMobile") %></span>',
        '    </div>    ',
        '</div>',
        '<footer id="mpinFooter">',
        '    <div id="homeBtn"></div>',
        '</footer>'].join('');

    mpin.template['user-settings'] = ['<div id="mp_accountListView" class="PinPadListViewSkin">',
        '    <div class="customScrollBox">',
        '        <div class="mp_container">',
        '            <div id="mp_accountContent" class="mp_content"></div>',
        '        </div>',
        '    </div>',
        '</div>',
        '<dWiv class="mp_alertContainer mp_alertMainContainer">',
        '    <div class="mp_headerFrameCancelOnly">',
        '        <div class="mp_accountField" style="padding: 10px 5px 50px 5px;">',
        '            <%=name%>',
        '        </div>',
        '        <div style="padding:0px 10px">',
        '            <button id="mp_deluser" class="mp_blueSkin" tabindex=-1>',
        '                <%=hlp.text( "account_button_delete"%>',
        '            </button>',
        '            <button id="mp_reactivate" class="mp_blueSkin" tabindex=-1>',
        '                <%=hlp.text( "account_button_reactivate")%>',
        '            </button>',
        '        </div>',
        '    </div>',
        '    <div class="mp_bottomFrame">',
        '        <div style="padding:0px 10px">',
        '            <button id="mp_acclist_cancel" class="mp_graySkin" tabindex=-1>',
        '                <%=hlp.text( "account_button_backToList") %>',
        '            </button>',
        '        </div>',
        '    </div>',
        '    </div>'].join('');

    mpin.template['setup'] = ['',
        '<header class="pinpad" id="topNav">',
        '    <a id="mp_action_home" href="#">',
        '        <div id="homeBtn"></div>',
        '    </a>',
        '    </div>',
        '    <div id="mpinLogo"></div>',
        '</header>',
        '<div id="accountTopBar">',
        '    <div id="mpinUser">',
        '        <p><%= email %> <% console.log("cfg :::", cfg); %></p>',
        '    </div>',
        '    <div id="menuBtn"></div>',
        '</div>',
        '',
        '<div id="pinsHolder">',
        '',
        '    <div id="inputContainer">',
        '        <input id="pinpad-input" type="text" readonly="true" placeholder="Enter your Access Number">',
        '    </div>',
        '',
        '    <div class="pre-row">',
        '        <div class="row">',
        '            <div class="btn">',
        '                <span class="label mp_pindigit" data-value="1">1</span>',
        '            </div>',
        '            <div class="btn">',
        '                <span class="label mp_pindigit" data-value="2">2</span>',
        '            </div>',
        '            <div class="btn">',
        '                <span class="label mp_pindigit" data-value="3">3</span>',
        '            </div>',
        '        </div>',
        '    </div>',
        '    <div class="pre-row">',
        '        <div class="row">',
        '            <div class="btn">',
        '                <span class="label mp_pindigit" data-value="4">4</span>',
        '            </div>',
        '            <div class="btn">',
        '                <span class="label mp_pindigit" data-value="5">5</span>',
        '            </div>',
        '            <div class="btn">',
        '                <span class="label mp_pindigit" data-value="6">6</span>',
        '            </div>',
        '        </div>',
        '    </div>',
        '    <div class="pre-row">',
        '        <div class="row">',
        '            <div class="btn">',
        '                <span class="label mp_pindigit" data-value="7">7</span>',
        '            </div>',
        '            <div class="btn">',
        '                <span class="label mp_pindigit" data-value="8">8</span>',
        '            </div>',
        '            <div class="btn">',
        '                <span class="label mp_pindigit" data-value="9">9</span>',
        '            </div>',
        '        </div>',
        '    </div>',
        '    <div class="pre-row">',
        '        <div class="row bottom">',
        '            <div class="btn">',
        '                <span class="label" id="mpinClear" data-value="clear">clear</span>',
        '            </div>',
        '            <div class="btn">',
        '                <span class="label mp_pindigit" data-value="0">0</span>',
        '            </div>',
        '            <div class="btn">',
        '                <span class="label" id="mpinLogin" data-value="go">login</span>',
        '            </div>',
        '        </div>',
        '    </div>',
        '</div>',
        '<footer class="pinpad" id="mpinFooter">',
        '    <div id="homeBtn"></div>',
        '</footer>'].join('');

    mpin.template['delete-panel'] = ['<div id="mp_accountListView" class="PinPadListViewSkin">',
        '    <div class="customScrollBox">',
        '        <div class="mp_container">',
        '            <div id="mp_accountContent" class="mp_content"></div>',
        '        </div>',
        '    </div>',
        '</div>',
        '<div class="mp_alertContainer mp_alertMainContainer">',
        '    <div class="mp_headerFrame">',
        '        <div class="mp_alertTitle">',
        '            <%=hlp.text( "account_delete_question") %>',
        '        </div>',
        '        <div class="mp_accountField">',
        '            <%=name %>',
        '        </div>',
        '    </div>',
        '    <div class="mp_bottomFrame">',
        '        <div style="padding:0px 10px">',
        '            <button id="mp_acclist_deluser" class="mp_blueSkin" tabindex=-1>',
        '                <%=hlp.text( "account_delete_button") %>',
        '            </button>',
        '        </div>',
        '        <button id="mp_acclist_cancel" class="mp_graySkin" tabindex=-1>',
        '            <%=hlp.text( "account_button_cancel") %>',
        '        </button>',
        '    </div>',
        '</div>',
        ''].join('');

    mpin.template['reactivate-panel'] = ['<div id="mp_accountListView" class="PinPadListViewSkin">',
        '    <div class="customScrollBox">',
        '        <div class="mp_container">',
        '            <div id="mp_accountContent" class="mp_content"></div>',
        '        </div>',
        '    </div>',
        '</div>',
        '<div class="mp_alertContainer mp_alertMainContainer">',
        '    <div class="mp_headerFrame">',
        '        <div class="mp_alertTitle">',
        '            <%=hlp.text( "account_reactivate_question") %>',
        '        </div>',
        '        <div class="mp_accountField">',
        '            <%=name %>',
        '        </div>',
        '    </div>',
        '    <div class="mp_bottomFrame">',
        '        <div style="padding:0px 10px">',
        '            <button id="mp_acclist_reactivateuser" class="mp_blueSkin" tabindex=-1>',
        '                <%=hlp.text( "account_reactivate_button") %>',
        '            </button>',
        '        </div>',
        '        <button id="mp_acclist_cancel" class="mp_graySkin" tabindex=-1>',
        '            <%=hlp.text( "account_button_cancel") %>',
        '        </button>',
        '    </div>',
        '</div>',
        '</div>',
        '</div>'].join('');

    mpin.template['home'] = ['<header id="header">',
        '    <div id="mpinLogo"></div>',
        '</header>',
        '<div id="homeIcon">',
        '    <div id="mobileIcon"></div>',
        '</div>',
        '<div id="buttonsContainer">',
        '    <div class="mpinBtn" id="mpin_authenticate">',
        '        <span class="iconArrow"></span>',
        '        <span class="btnLabel"><%=hlp.text( "home_button_authenticateMobile") %></span>',
        '    </div>',
        '    <div class="mpinBtn" id="getPassword">',
        '        <span class="iconArrow"></span>',
        '        <span class="btnLabel">Get One-Time Password</span>',
        '    </div>',
        '    <div class="mpinBtn" id="deviceIdentity">',
        '        <span class="iconArrow"></span>',
        '        <span class="btnLabel"><%=hlp.text( "home_button_setupMobile")%></span>',
        '    </div>',
        '    ',
        '</div>',
        '<footer id="mpinFooter">',
        '    <div id="homeBtn"></div>',
        '</footer>'].join('');

    mpin.template['identity-not-active'] = ['<!-- Home/Top Nav Bar -->',
        '',
        '<header id="topNav">',
        '    <div id="homeBtn">',
        '    </div>',
        '    <div id="mpinLogo">',
        '    </div>',
        '</header>',
        '',
        '<!-- User section -->',
        '',
        '<header id="header">',
        '  <div id="mpinLogo"></div>',
        '</header>',
        '',
        '<!-- Input button -->',
        '',
        '<div id="identityContainer">',
        '',
        '  <div class="identityMainText">',
        '      <div>',
        '        Your email address will be used as your identity when M-Pin authenticates you to this service.',
        '      </div>',
        '',
        '      <div class="mp_note" style="margin:0pxpadding:0px">',
        '          <p class="mp_center" style="width:240px">',
        '              <%=hlp.text( "setupNotReady_text1") %>',
        '                  <br/>',
        '                  <span style="padding: 10px 5px 20px 5px" class="mp_accountField">',
        '                      jordan@dasdsa.com',
        '                  </span>',
        '                  <br/>',
        '                  <%=hlp.text( "setupReady_text2") %>',
        '          </p>',
        '          <p>',
        '              <%=hlp.text( "setupReady_text3") %>',
        '          </p>',
        '      </div>',
        '  </div>',
        '',
        '  <div id="buttonsContainer">',
        '      <div class="mpinBtn" id="mpin_authenticate">',
        '          <span class="iconArrow"></span>',
        '          <span class="btnLabel"><%=hlp.text( "setupReady_button_go") %></span>',
        '      </div>',
        '      <div class="mpinBtn" id="deviceIdentity">',
        '          <span class="iconArrow"></span>',
        '          <span class="btnLabel"><%=hlp.text( "setupNotReady_button_resend")%></span>',
        '      </div>',
        '  </div>',
        '',
        '</div>',
        '',
        '<footer id="mpinFooter">',
        '    <div id="homeBtn">',
        '    </div>',
        '</footer>'].join('');

    mpin.template['login'] = ['<header id="topNav">',
        '    <a id="mp_action_home" href="#">',
        '        <div id="homeBtn"></div>',
        '    </a>',
        '    </div>',
        '    <div id="mpinLogo"></div>',
        '</header>',
        '<div id="accountTopBar">',
        '    <div id="mpinUser">',
        '        <p><%= email %></p>',
        '    </div>',
        '    <div id="menuBtn"></div>',
        '</div>',
        '',
        '<div id="pinsHolder">',
        '',
        '    <div id="inputContainer">',
        '        <input id="pinpad-input" type="text" readonly="true" placeholder="Enter your Access Number" maxlength="mpin.pinSize">',
        '    </div>',
        '',
        '    <div class="pre-row">',
        '        <div class="row">',
        '            <div class="btn mp_pindigit" data-value="1">',
        '                <span class="label">1</span>',
        '            </div>',
        '            <div class="btn mp_pindigit" data-value="2">',
        '                <span class="label">2</span>',
        '            </div>',
        '            <div class="btn mp_pindigit" data-value="3">',
        '                <span class="label">3</span>',
        '            </div>',
        '        </div>',
        '    </div>',
        '    <div class="pre-row">',
        '        <div class="row">',
        '            <div class="btn mp_pindigit" data-value="4">',
        '                <span class="label">4</span>',
        '            </div>',
        '            <div class="btn mp_pindigit" data-value="5">',
        '                <span class="label">5</span>',
        '            </div>',
        '            <div class="btn mp_pindigit" data-value="6">',
        '                <span class="label">6</span>',
        '            </div>',
        '        </div>',
        '    </div>',
        '    <div class="pre-row">',
        '        <div class="row">',
        '            <div class="btn mp_pindigit" data-value="7">',
        '                <span class="label">7</span>',
        '            </div>',
        '            <div class="btn mp_pindigit" data-value="8">',
        '                <span class="label">8</span>',
        '            </div>',
        '            <div class="btn mp_pindigit" data-value="9">',
        '                <span class="label">9</span>',
        '            </div>',
        '        </div>',
        '    </div>',
        '    <div class="pre-row">',
        '        <div class="row bottom">',
        '            <div class="btn" id="mpinClear" data-value="clear">',
        '                <span class="label"><%=hlp.text( "authPin_button_clear") %></span>',
        '            </div>',
        '            <div class="btn mp_pindigit" data-value="0">',
        '                <span class="label">0</span>',
        '            </div>',
        '            <div class="btn" id="mpinLogin" data-value="go">',
        '                <span class="label"><%=hlp.text( "authPin_button_login") %></span>',
        '            </div>',
        '        </div>',
        '    </div>',
        '</div>',
        '<footer id="mpinFooter">',
        '    <div id="homeBtn"></div>',
        '</footer>'].join('');

    mpin.template['setup-home'] = ['<!-- Home/Top Nav Bar -->',
        '',
        '<header id="topNav">',
        '    <div id="mp_action_home">',
        '    </div>',
        '    <div id="mpinLogo">',
        '    </div>',
        '</header>',
        '',
        '<!-- User section -->',
        '',
        '<div id="addIdentity">',
        '  <div class="identityHeader"><%=hlp.text( "setup_header") %></div>',
        '</div>',
        '',
        '<!-- Input button -->',
        '',
        '<div id="identityContainer">',
        '  <div class="inputContainer">',
        '    ',
        '    <div class="identityElHolder">',
        '      <div class="identityText">',
        '          <span><%=hlp.text( "setup_text1") %></span>',
        '      </div>',
        '',
        '      <div class="identityInput">',
        '        <div>',
        '          <input type="email" id="emailInput" placeholder="Enter pin here" value="">',
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
        '<footer id="mpinFooter">',
        '    <div id="homeBtn">',
        '    </div>',
        '</footer>'].join('');

    mpin.template['user-row'] = ['<div id="mp_StarIcon_<%= iNumber %>" class="mp_starIcon" tabindex=-1></div>',
        '<div class="mp_titleItem" title="<%= name %>">',
        '    <%=name %>',
        '</div>',
        '<div id="mp_btIdSettings_<%= iNumber %>" class="mp_buttonItem">',
        '    <img src="<%= hlp.img(" id-settings.png ") %>" tabindex=-1/>',
        '</div>'].join('');

    mpin.template['activate-identity'] = ['<!-- Home/Top Nav Bar -->',
        '',
        '<header id="topNav">',
        '    <div id="mp_action_home">',
        '    </div>',
        '    <div id="mpinLogo">',
        '    </div>',
        '</header>',
        '',
        '<!-- User section -->',
        '',
        '<header id="header">',
        '  <div id="menuIcon"></div>',
        '  <div id="mpinLogo"></div>',
        '</header>',
        '',
        '<!-- Input button -->',
        '',
        '<div id="identityContainer">',
        '',
        '  <div class="identityMainText">',
        '      <div class="congrats">',
        '        <%=hlp.text( "setupReady_header") %>',
        '      </div>',
        '',
        '      <div class="identityBodyText">',
        '          <p>',
        '              <%=hlp.text( "setupReady_text1") %>',
        '                  <span class="email">',
        '                      <%= email %>',
        '                  </span>',
        '          </p>',
        '          <p>',
        '            <%=hlp.text( "setupReady_text2") %>',
        '          </p>',
        '          <p>',
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
        '<footer id="mpinFooter">',
        '    <div id="homeBtn">',
        '    </div>',
        '</footer>'].join('');

    mpin.template['mobile-login'] = ['<div id="mp_pinpadHolder">',
        '    <div id="mp_headersml">',
        '        <section class="mp_floatLeft"><a href="#" id="mp_action_home"><img src="<%= hlp.img("icon-home-sml.png" ) %>" alt="Home" /></a>',
        '        </section>',
        '        <section class="mp_floatRight">',
        '            <img src="<%= hlp.img(" m-pin-logo-white-sml.png ") %>" alt="M-Pin Logo" />',
        '        </section>',
        '        <div class="mp_clear"></div>',
        '    </div>',
        '    <div id="mp_contentPadWithHeaderthin">',
        '        <div id="mp_wrapperthin">',
        '            <h1>',
        '                <%=hlp.text( "mobileAuth_header") %>',
        '            </h1>',
        '            <div class="mp_accessNumberHolder">',
        '                <p>',
        '                    <%=hlp.text( "mobileAuth_text1") %>',
        '                </p>',
        '                <label class="mp_accessNumber" id="mp_accessNumber"></label>',
        '                <div class="clear"></div>',
        '            </div>',
        '            <p class="mp_note">',
        '                <%=hlp.text( "mobileAuth_text2") %>',
        '                    <br/>',
        '                    <label id="mp_seconds" class="mp_red"></label>',
        '                    <br/>',
        '                    <%=hlp.text( "mobileAuth_text3") %>',
        '            </p>',
        '            <p class="mp_note_small">',
        '                <%=hlp.text( "mobileAuth_text4") %>',
        '            </p>',
        '        </div>',
        '    </div>',
        '</div>'].join('');
})();