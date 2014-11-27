The **M-Pin System** consists of two groups of Services - Customer-hosted Services and CertiVox-hosted Services.

The third, but no less important component, is the *Client*. Currently there are two clients available - the Browser Client, also called the *PIN Pad*, and the *Mobile Client*, known as the Mobile App

**PIN Pad**

The PIN Pad is a JavaScript software component that should be integrated into the Customer's Application Web Page. The PIN Pad encapsulates all the operations and logic that needs to be performed at the front-end, in order to register and authenticate an end-user.

**Mobile App**

The Mobile App is a JavaScript application, much similar to the PIN Pad. The Mobile App also carries out the operations needed to register and authenticate an end-user, but the user is authenticated to a browser session, rather than to a session on the mobile device.

**Building the PIN Pad**

1. Install *SASS*
  1. Install *ruby*. For instance on an Ubuntu machine you would need to do: `sudo apt-get install ruby1.9.1`
  2. `sudo gem install sass`
2. Install *Node* and *Node Package Manager*. For instance on Ubuntu you need to do:
  1. `sudo apt-get install node`
  2. `sudo apt-get install npm`
3. Install *grunt* and the required modules
  1. `sudo npm install -g grunt-cli`
4. Install *handlebars* and the required modules
  1. `sudo npm install -g handlebars`
5. Checkout/clone the repository to `<work-dir>`
6. As normal user:
  1. `cd <work-dir>/browser`
  2. `npm install`
7. Create `settings.json` file
  1. `cp settings.json_build settings.json`
8. Build the app
  1. `grunt build`

The built app should be placed in `<work-dir>/build/out/browser`.

**NOTE** that the `settings.json` file that was created above, should be modified with the correct base URL for the PIN Pad resources and with the desired template. For more details see the bellow documentation.

For more information on building, configuring & customising the PIN pad please see: [Tech_Spec_-_M-Pin_v3.3.0_PIN_Pad.pdf](/Tech_Spec_-_M-Pin_v3.3.0_PIN_Pad.pdf)

For information on building, configuring & customising the Mobile app please see: [Tech_Spec_-_M-Pin_v3.3.0_Mobile_App.pdf](/Tech_Spec_-_M-Pin_v3.3.0_Mobile_App.pdf)
