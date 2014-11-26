The M-Pin System consists of two groups of Services - Customer-hosted Services and CertiVox-hosted Services.

The third, but no less important component, is the Client. Currently there are two clients available - the Browser Client, also called the PIN Pad, and the Mobile Client, known as the Mobile App

PIN Pad

The PIN Pad is a JavaScript software component that should be integrated into the Customer's Application Web Page. The PIN Pad encapsulates all the operations and logic that needs to be performed at the front-end, in order to register and authenticate an end-user.

Mobile App

The Mobile App is a JavaScript application, much similar to the PIN Pad. The Mobile App also carries out the operations needed to register and authenticate an end-user, but the user is authenticated to a browser session, rather than to a session on the mobile device.

To build and use PIN Pad

1. Install SASS

1.1 gem install sass

2. Install grunt and the required modules

2.1 su
2.2 npm install -g grunt-cli 
2.3 npm install handlebars -g

As normal user:

2.3 cd frontend/browser
2.4 npm install 

3 Build app

3.1 cd libs/jslib
3.2 ln -s ../../../mpin/crypto/js crypto
3.3 cd frontend/browser
3.4 ln -s settings.json_kealan settings.json
3.5 grunt build

The output is in frontend/build/out/browser

For more information on building, configuring & customising the PIN pad please see: Tech_Spec_-_M-Pin_v3.3.0_PIN_Pad.pdf

For information on building, configuring & customising the Mobile app please see: Tech_Spec_-_M-Pin_v3.3.0_Mobile_App.pdf




