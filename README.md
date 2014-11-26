The M-Pin System consists of two groups of Services - Customer-hosted Services and CertiVox-hosted Services.

The third, but no less important component, is the Client. Currently there are two clients available - the Browser Client, also called the PIN Pad, and the Mobile Client, known as the Mobile App

PIN Pad

The PIN Pad is a JavaScript software component that should be integrated into the Customer's Application Web Page. The PIN Pad encapsulates all the operations and logic that needs to be performed at the front-end, in order to register and authenticate an end-user.

Mobile App

The Mobile App is a JavaScript application, much similar to the PIN Pad. The Mobile App also carries out the operations needed to register and authenticate an end-user, but the user is authenticated to a browser session, rather than to a session on the mobile device.

To build and use PIN Pad

1. Install _SASS_
  1. `sudo gem install sass`
  2. Install _ruby_. For instance on an Ubuntu machine you would need to do:
  ```
  sudo apt-get install ruby1.9.1
  ```
2. Install _grunt_ and the required modules
  1. `sudo npm install -g grunt-cli`
  2. `sudo npm install -g handlebars`
3. As normal user:
  1. `cd <work-dir>/browser`
  2. `npm install`
4. Build the app
  1. `cp settings.json_build settings.json`
  2. `grunt build`

The built app should be placed in `<work-dir>/build/out/browser`.

NOTE that the `settings.json` file that was created above, should be modified with the correct base URL for the PIN Pad resources and with the desired template. For more details see the bellow documentation.

For more information on building, configuring & customising the PIN pad please see: [Tech_Spec_-_M-Pin_v3.3.0_PIN_Pad.pdf](/Tech_Spec_-_M-Pin_v3.3.0_PIN_Pad.pdf)

For information on building, configuring & customising the Mobile app please see: [Tech_Spec_-_M-Pin_v3.3.0_Mobile_App.pdf](/Tech_Spec_-_M-Pin_v3.3.0_Mobile_App.pdf)




