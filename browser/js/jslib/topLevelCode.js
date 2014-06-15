function createXMLHttp() 
{
 if (typeof XMLHttpRequest != "undefined") {
   return new XMLHttpRequest();
  }
 else if (window.ActiveXObject) 
 {
  var aVersions = ["MSXML2.XMLHttp.5.0","MSXML2.XMLHttp.4.0","MSXML2.XMLHttp.3.0","MSXML2.XMLHttp","Microsoft.XMLHttp"];
  
  for (var i = 0; i < aVersions.length; i++) 
  {
   try
   {
    var oXmlHttp = new ActiveXObject(aVersions[i]);
    return oXmlHttp;
   }
   catch(oError)
   {
    throw new Error("XMLHttp object could be created.");
   }
  }
 }
 throw new Error("XMLHttp object could be created.");
}


// Extract PIN from User's secret
function extractPIN(aPin, clientSecretHex, identity, onSuccess)
{
  var tokenHex = mpinAuth.calculateMPinToken(aPin, clientSecretHex, identity);
  onSuccess(tokenHex) 
};


// Request authToken for authServer and send to Customer web app.
function getAuthToken(wsURL, IDcustomer, identity, timePermitHex, tokenHex, requestOTP, accessNumber, seedValueHex, aPin, verifyTokenURL, authTokenFormatter, customHeaders, handleToken, onVerifySuccess)
{

  console.log("getAuthToken ");

  // Generate random x value
  var x = mpinAuth.randomX(seedValueHex);

  var IDcHex = identity;

 // Open web socket to Auth Server.
  var wsOK = false;
  var useAJAX = false;

  setTimeout(function(){
    if (!wsOK) {
      if (!useAJAX) {
        useAJAX = true;
        handleToken(false, "WEBSOCKETERROR", "WEB SOCKET ERROR");
      }
    }
  }, 5000)


  var authServerSocket = new WebSocket(wsURL);

  authServerSocket.onerror = function(event){
    console.log("Websocket error: " + event.data);
    authServerSocket.close();
    useAJAX = true;
    handleToken(false, "WEBSOCKETERROR", "WEB SOCKET ERROR");

    return;
  };

  authServerSocket.onopen = function () {
    console.log("websocket connection open");
    var request = mpinAuth.pass1Request(x, IDcHex);
    // PASS1 REQUEST
    authServerSocket.send(JSON.stringify(request));
    console.log("PASS1 REQUEST: " + request);
  }

  authServerSocket.onclose = function () {
    console.log("websocket connection closed");
  }

  authServerSocket.onmessage = function(event) {
      var response = JSON.parse(event.data);
      if (response.pass == 1)
	{
          wsOK = true;
          console.dir("PASS: "+response.pass+" message: "+event.data);

          if (useAJAX)
            return;
	  
          // Compute PASS2 request
	  var request = mpinAuth.pass2Request(x, response.y, IDcHex, timePermitHex, tokenHex, requestOTP, accessNumber, aPin);
          console.dir(request);

          // PASS2 REQUEST
          authServerSocket.send(JSON.stringify(request));
          console.log("PASS2 REQUEST : " + request);
	}
      else if (response.pass == 2) 
        {
          var response = JSON.parse(event.data);
          console.dir("PASS: "+response.pass+" message: "+event.data);
          // Send the response from the MPin server to the RP
          authServerSocket.close();
          sendAuthToken(verifyTokenURL,response, handleToken, authTokenFormatter, customHeaders, onVerifySuccess);
        }
      else
	{
      console.log("Invalid Response ");
      authServerSocket.close();
      handleToken(false, "SERVERERROR", "SERVER ERROR")
	}
  }
};

// Request authToken for authServer and send to Customer web app using websocketProxy.
function getAuthTokenAjax(restURL, IDcustomer, identity, timePermitHex, tokenHex, requestOTP, accessNumber, seedValueHex, aPin, verifyTokenURL, authTokenFormatter, customHeaders, handleToken, onVerifySuccess)
{
  console.log("Using getAuthTokenAJAX");
  console.log("PASS1");

  var rURL = (restURL.mpin_endsWith("/")) ? restURL.slice(0, restURL.length-1) : restURL;
  rURL = restURL.split("/authenticationToken").join("")

  var urlSplit = rURL.split("://")
  if (urlSplit[0] == "wss")
    urlSplit[0] = "https";
  else if (urlSplit[0] == "ws")
    urlSplit[0] = "http";

  rURL = urlSplit.join("://")
  var restURLPass1 = rURL + "/pass1";
  var restURLPass2 = rURL + "/pass2";

  var xhrPass1 = createXMLHttp();

// Generate random x value
  var x = mpinAuth.randomX(seedValueHex);
  var IDcHex = identity;

  // Form request body
  var request1 = mpinAuth.pass1Request(x, IDcHex);
  var postData1 = JSON.stringify(request1);
  var requestDataType = 'application/json';


  xhrPass1.onreadystatechange=function(evtXHR){
      if (xhrPass1.readyState == 4) {
        if (xhrPass1.status == 200) {
          console.log("PASS2");
          var jsonText1 = xhrPass1.responseText;
          var response1 = JSON.parse(jsonText1);

          // Compute PASS2 request
          var request2 = mpinAuth.pass2Request(x, response1.y, IDcHex, timePermitHex, tokenHex, requestOTP, accessNumber, aPin);
          request2.IDc = IDcHex;
          var postData2 = JSON.stringify(request2);

          // PASS2 REQUEST
          var xhrPass2 = createXMLHttp();

          xhrPass2.onreadystatechange=function(evtXHR){
            if (xhrPass2.readyState == 4) {
              if (xhrPass2.status == 200) {
                var jsonText2 = xhrPass2.responseText;
                var response2 = JSON.parse(jsonText2);

                console.log("PASS2 RESPONSE:" + jsonText2);
                sendAuthToken(verifyTokenURL, response2, handleToken, authTokenFormatter, customHeaders, onVerifySuccess);

                }
              else {
                // ERROR PASS 2
                console.error("Error PASS2 on Ajax Authentication Request: " + xmlhttpPass2.status)
                handleToken(false, "SERVERERROR", "SERVER ERROR")

                }
              } //readystate
            } //onreadystate

          xhrPass2.open("POST", restURLPass2, true);
          xhrPass2.setRequestHeader("Content-Type",requestDataType);

          for (var headerKey in customHeaders) { 
            console.log("Adding custom header " + headerKey + " with value: " + customHeaders[headerKey]);
            xhrPass2.setRequestHeader(headerKey, customHeaders[headerKey]);
          }  
          xhrPass2.send(postData2);

        } else {
          // ERROR PASS 1
          console.error("Error PASS1 on Ajax Authentication Request: " + xmlhttpAuthToken.status)
          handleToken(false, "SERVERERROR", "SERVER ERROR")

        }
      }
    }

  xhrPass1.open("POST", restURLPass1, true);
  xhrPass1.setRequestHeader("Content-Type",requestDataType);
  for (var headerKey in customHeaders) { 
    console.log("Adding custom header " + headerKey + " with value: " + customHeaders[headerKey]);
    xhrPass1.setRequestHeader(headerKey, customHeaders[headerKey]);
  }  
  xhrPass1.send(postData1);
};

// Send Authentication token to RP server
function sendAuthToken(restURL, mpinResponse, handleToken, authTokenFormatter, customHeaders, onVerifySuccess)
{
  var requestDataType = 'application/json';
  var xmlhttpAuthToken;

  // Get the OTP and delete it from the mpinResponse so it will not be transferred in plain text.
  var OTP = mpinResponse["OTP"]
  delete mpinResponse["OTP"]

  // Declare data
  var jsonObj = {"mpinResponse": mpinResponse};

  if (authTokenFormatter)
    jsonObj = authTokenFormatter(jsonObj)


  // Sting
  var postData = JSON.stringify(jsonObj);

  var xmlhttpAuthToken = createXMLHttp()

  xmlhttpAuthToken.onreadystatechange=function(evtXHR)
  {
  if (xmlhttpAuthToken.readyState == 4)
    {
      if (xmlhttpAuthToken.status == 200)
        {
          var jsonText = xmlhttpAuthToken.responseText;
          var response;
          if (jsonText) {
            response = JSON.parse(jsonText);
          } else {
            response = {}
          }

          // add the OTP to the handled response
          response._mpinOTP = OTP;

          if (onVerifySuccess)
             onVerifySuccess(response)

          handleToken(true, "OK", "Authenticated", response);
        }
      else if (xmlhttpAuthToken.status == 401)
      {
        handleToken(false, "INVALID", "INVALID PIN");
      } 
      else if (xmlhttpAuthToken.status == 403)
      {
        handleToken(false, "NOTAUTHORIZED", "You are not authorized!");
      } 
      else if (xmlhttpAuthToken.status == 408)
      {
        handleToken(false, "EXPIRED", "The request took too much time!");
      } 
      else if (xmlhttpAuthToken.status == 410)
      {
        handleToken(false, "MAXATTEMPTS", "Max Attempts Reached");
      }
      else if (xmlhttpAuthToken.status == 412)
      {
        handleToken(false, "INVALIDACCESSNUMBER", "Invalid Access Number");
      }
      else
      {
        handleToken(false, "INVOCATION", "Invocation Errors Occured " + xmlhttpAuthToken.readyState + " and the status is " + xmlhttpAuthToken.status);
      }
    }
  };
  xmlhttpAuthToken.open("POST",restURL,true);
  xmlhttpAuthToken.setRequestHeader("Content-Type",requestDataType);
  for (var headerKey in customHeaders) { 
    console.log("VERIFY Adding custom header " + headerKey + " with value: " + customHeaders[headerKey]);
    xmlhttpAuthToken.setRequestHeader(headerKey, customHeaders[headerKey]);
  }  
  xmlhttpAuthToken.send(postData);
};



function requestSignature(userID, mobile, signatureURL, customHeaders, onSuccess, onFail)
{
  var requestDataType = 'application/json';
  var restURL = signatureURL + "?userid=" + encodeURIComponent(userID)+"&mobile="+mobile;

  var xmlhttpSecret = createXMLHttp();

  xmlhttpSecret.onreadystatechange=function(evtXHR)
    {
      if (xmlhttpSecret.readyState == 4)
        {
          if (xmlhttpSecret.status == 200)
            {
              var jsonText = xmlhttpSecret.responseText;
              var response = JSON.parse(jsonText);
              onSuccess(response)
          }
          else if (xmlhttpSecret.status == 401)
          {
              // var jsonText = xmlhttpSecret.responseText;
              // var response = JSON.parse(jsonText);
              
              onFail("Error getting the mpin signature", xmlhttpSecret.status)
          }
          else if (xmlhttpSecret.status == 403)
          {
              // User is not authorised
              
              onFail("User not authorized", xmlhttpSecret.status)
          }
         else
           {
              onFail("Error getting the mpin signature", xmlhttpSecret.status)
           }
        }
    }
  xmlhttpSecret.open("GET", restURL, true);
  xmlhttpSecret.setRequestHeader("Content-Type",requestDataType);
  for (var headerKey in customHeaders) { 
    console.log("VERIFY Adding custom header " + headerKey + " with value: " + customHeaders[headerKey]);
    xmlhttpSecret.setRequestHeader(headerKey, customHeaders[headerKey]);
  }    
  xmlhttpSecret.send();
};




function requestRegister(registerURL, userid, customHeaders, postDataFormatter, onSuccess, onFail)
{
    if (! postDataFormatter) {
      postDataFormatter = function(data){ return data}
    }

    var postData = JSON.stringify(postDataFormatter({identity: mpinid}))
      
    var xmlhttpRegister = createXMLHttp()
    xmlhttpRegister.onreadystatechange=function(evtXHR) {
    if (xmlhttpRegister.readyState == 4)
      {
        if (xmlhttpRegister.status == 200)
          {     
              var jsonText = xmlhttpSecret.responseText;
              var response = JSON.parse(jsonText);
              onSuccess(response)
          }
        else
        {
          onFail(xmlhttpRegister.responseText, xmlhttpRegister.status)
        } 
      }
  };
  xmlhttpRegister.open("POST", registerURL, true);
  xmlhttpRegister.setRequestHeader("Content-Type", "application/json");
  for (var headerKey in customHeaders) { 
    xmlhttpRegister.setRequestHeader(headerKey, customHeaders[headerKey]);
  }    

  xmlhttpRegister.send(postData);
};



//same as RequestRPSJSON
// usage like function just call
function requestRPS (params, cb) {
  var _request = new XMLHttpRequest(), _method, _postData;
  _method = params.method || "GET";
  
  params.postDataFormatter || (params.postDataFormatter = function (data) {return data;});
  //
  _postData = JSON.stringify(params.postDataFormatter(params.data));
  
  _request.onreadystatechange = function () {
    if (_request.readyState === 4) {
      if (_request.status === 200) {
        cb(_request.responseText ? JSON.parse(_request.responseText): {});
      } else {
        var _errorData = {};
        _errorData.error = _request.responseText;
        _errorData.errorStatus = _request.status;
        cb(_errorData);
      }
    }
  };
  
  _request.open(_method, params.URL, true);
  _request.setRequestHeader("Content-Type", "application/json");
  if (params.customHeaders) {
    for (var headerKey in params.customHeaders) { 
      _request.setRequestHeader(headerKey, params.customHeaders[headerKey]);
    }
  }
  _request.send(_postData);
};


function RequestRPSJSON(params)
{
  // Params: URL, method, data, customHeaders, postDataFormatter, timeout, onSuccess, onFail, onTimeout

  var postData;
  var method = params.method || "GET"

  if (method == "GET") 
    postData = null
  else {
    if (! params.postDataFormatter) {
      params.postDataFormatter = function(data){ return data}
    }

    postData = JSON.stringify(params.postDataFormatter(params.data))
  }

  var xhr = createXMLHttp()

  xhr.onreadystatechange=function(evtXHR) {
    if (xhr.readyState == 4)
      {
        if (xhr.status == 200)
          {     
              if (params.onSuccess) {
                var response = xhr.responseText ? JSON.parse(xhr.responseText) : {};
                params.onSuccess(response)
              }
          }
        else
        {
          if (params.onFail) {
            params.onFail(xhr.status, xhr.responseText)
          }
        } 
      }
  };

  if (params.onTimeout) {
    xhr.ontimeout = function(){ params.onTimeout() }
  }

  xhr.open(method, params.URL, true);

  if (params.timeout) {
    xhr.timeout = params.timeout;
  }


  xhr.myURL = params.URL;
  xhr.setRequestHeader("Content-Type", "application/json");
  if (params.customHeaders) {
    for (var headerKey in params.customHeaders) { 
      xhr.setRequestHeader(headerKey, params.customHeaders[headerKey]);
    }    
  }
  xhr.send(postData);

  this.abortRequest = function(){
    params.onFail = null;
    xhr.abort();
  }

  return this
};



// Request Client Secret from a TA.
function requestClientSecretShare(restURL, onSuccess, onFail)
{
  var xmlhttpClientSecret;
  var requestDataType = 'application/json';

  var xmlhttpClientSecret = createXMLHttp()
  xmlhttpClientSecret.onreadystatechange=function(evtXHR)
    {
      if (xmlhttpClientSecret.readyState == 4)
        {
          if (xmlhttpClientSecret.status == 200)
            {
              var jsonText = xmlhttpClientSecret.responseText;
              var response = JSON.parse(jsonText);
              onSuccess(response.clientSecret)
    	    }
          else if (xmlhttpClientSecret.status == 401 || xmlhttpClientSecret.status == 403)
    	    {
              var jsonText = xmlhttpClientSecret.responseText;
              var response = JSON.parse(jsonText);

              onFail("Error getting the client secret: " + xmlhttpClientSecret.status, xmlhttpClientSecret.status)
    	    }
         else
           {
              onFail("Error getting the client secret: " + xmlhttpClientSecret.status, xmlhttpClientSecret.status)
           }
        }
    }
  xmlhttpClientSecret.open("GET", restURL, true);
  xmlhttpClientSecret.setRequestHeader("Content-Type",requestDataType);
  xmlhttpClientSecret.send();
};

// Request the Client Secret Share and add them to form ClientSecret
function requestClientSecret(certivoxURL, clientSecretShare, onSuccess, onFail)
{
  // Get Client Secret Share from Certivox TA
  // n.b. Not a mobile request
//  var certivoxURL = certivoxURL+"&mobile=0"; 
  requestClientSecretShare(certivoxURL, function(certivoxShare){
      // Add secret shares to form Client Secret
      var clientSecretHex = mpinAuth.addShares(certivoxShare, clientSecretShare);
      console.log("clientSecretHex: "+clientSecretHex);

      // Callback
      onSuccess(clientSecretHex);
  }, onFail);
};



MPIN_LOADED = true;



// Request Time Permit Share from a TA.
// TODO WHAT HAPPENS FOR 401, 403 or 500 errors
function requestTimePermitShare(restURL, customHeaders, onSuccess, onFail)
{
  var xmlhttpTimePermit;
  var requestDataType = 'application/json';

  var xmlhttpTimePermit = createXMLHttp()
  xmlhttpTimePermit.onreadystatechange=function(evtXHR)
    {
      if (xmlhttpTimePermit.readyState == 4)
        {
          if (xmlhttpTimePermit.status == 200)
            {
              var jsonText = xmlhttpTimePermit.responseText;
              var response = JSON.parse(jsonText);

              onSuccess(response.timePermit, response)
          } else
           {
             var jsonText = xmlhttpTimePermit.responseText;
             var response = "";
             if (jsonText) {
                 var response = JSON.parse(jsonText);
              }
             onFail(response, xmlhttpTimePermit.status)
           }
        }
    }
  xmlhttpTimePermit.open("GET", restURL, true);
  xmlhttpTimePermit.setRequestHeader("Content-Type",requestDataType);
  for (var headerKey in customHeaders) { 
    xmlhttpTimePermit.setRequestHeader(headerKey, customHeaders[headerKey]);
  }    

  xmlhttpTimePermit.send();
};

function requestTimePermitStorageShare(restURL, onSuccess, onFail)
{
  if (!restURL) {
    onFail()

  } else {

    var xmlhttpTimePermit;

    var xmlhttpTimePermit = createXMLHttp()
    xmlhttpTimePermit.onreadystatechange=function(evtXHR)
      {
        if (xmlhttpTimePermit.readyState == 4)
          {
            if (xmlhttpTimePermit.status == 200)
              {
                var timePermitShare = xmlhttpTimePermit.responseText;

                onSuccess(timePermitShare);
      	    } else
             {
               onFail();
             }
          }
      }
    xmlhttpTimePermit.open("GET", restURL, true);
    xmlhttpTimePermit.send();
  }
};


// Request the Time Permit Shares and add them to form TimePermit
function requestTimePermit(certivoxURL, MPinDTAServerURL, customHeaders, timePermitCache, makePermitsStorageURLFunc, onSuccess, onFail)
{

  var combineShares = function(appShare, certivoxShare, currentDate, onSuccess){
    var timePermitHex = mpinAuth.addShares(appShare, certivoxShare);
    console.log("timePermitHex: " + timePermitHex);
    // Callback
    cache = {"date": currentDate, "timePermit": certivoxShare}

    onSuccess(timePermitHex, cache);
  }

  requestTimePermitShare(MPinDTAServerURL, customHeaders, function(appShare, response){
    currentDate = response["date"]
    storageId = response["storageId"]
    if ((currentDate) && (currentDate == timePermitCache["date"])) {
      certivoxShare = timePermitCache.timePermit;
      console.log("Getting time permit from the local cache")
      combineShares(appShare, certivoxShare, currentDate, onSuccess);

    } else {
      var storageURL = makePermitsStorageURLFunc(currentDate, storageId);
      console.log("StorageURL: ", storageURL)
      requestTimePermitStorageShare(storageURL,
        function(certivoxShare){
          console.log("Got timePermit from Storage URL")

          combineShares(appShare, certivoxShare, currentDate, onSuccess);
        }, 
        function() {
          requestTimePermitShare(certivoxURL, {}, function(certivoxShare){
          // Get Time Permit Share from Application TA
            // Add shares to form Time Permit
            console.log("Got timePermit from DTA")

           combineShares(appShare, certivoxShare, currentDate, onSuccess);

          }, onFail);
        }
      );
    }

  }, onFail);
};

