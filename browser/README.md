Deploy notes for Browser version mpin ver 0.3
====================================

1. Grund default file browser/Grundfile.js 
   Update all css/mpin.css and js/templates.js
  
  - Generate underscore.templates from src/templates into js/templates.js
  
  - Compile & minify SASS files from src/sass into mpin.css

  - Live watch for file changes into src/sass & src/tmp


IMAGES into img get from: 
 /var/www/frontend/build/out/mobile/resources/templates/grey/img

SETUP M-Pin Browser environment
==================================

insall node  > ver. 0.10
install python
install gem - ruby 1.9.1
install npm
npm install (install dependencies desc into package.json) grunt









////////////////// OLD error messages ///////////////////////
		"error_code_4001": "Error fetching settings from server",
		"error_code_4002": "ClientSettingsURL are missing or incomplete(options parameter)",
		"error_code_4003": "Some required parameters are missing or incomplete.",
		"error_code_4004": "The browser is not supported.",
		"error_code_4005": "The browser does not support localStorage.",
		"error_code_4006": "mobileAppFullURL are missing or incomplete (options parameter).",
		"error_code_4007": "accessNumberURL are missing or incomplete (options parameter).",
		"error_code_4008": "Error occur while you are changing identity.",
		"error_code_4009": "Problem occur while registering your identity. Registration forbidden (403)", //403
		"error_code_4010": "Problem with register your identity", //
		"error_code_4011": "Registration done, but request after that failed.", //
		"error_code_4012": "You're not authorized to complete the authentication, because your service provider has exceeded their licence limit.<br />For more info contact the provider of the service you're trying to access, or contact CertiVox directly at <a href='mailto:info@certivox.com'>info@certivox.com</a>",  //
		"error_code_4013": "Problem occur while getting secret.",  //
		"error_code_4014": "Problem occur while getting Access Number."  //

