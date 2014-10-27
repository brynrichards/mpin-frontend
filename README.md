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




