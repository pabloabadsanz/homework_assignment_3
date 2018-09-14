/*
 * Helpers for performing several tasks
 *
 */

// Dependencies
var crypto = require('crypto');
var config = require('../config');
var https = require('https');
var querystring = require('querystring');
var path = require('path');
var fs = require('fs');

 // Container for all the Helpers
 var helpers = {};

// Creates a SHA256 hash
helpers.hash = function(str) {
  if (typeof(str) == 'string' && str.length > 0) {
    var hash = crypto.createHmac('sha256', config.hashingsecret).update(str).digest('hex');
    return hash;
  } else {
    return false;
  }
};

// Parses JSON string to an object in all cases
helpers.parseJSONtoObject = function(str) {
  try {
    var obj = JSON.parse(str);
    return obj;
  } catch(e) {
    return {};
  }
};

// Creates a string of random characters, of a given length
helpers.createRandomString = function(strLength) {
  strLength = typeof(strLength) == 'number' && strLength > 0 ? strLength : false;
  if (strLength) {
    // Define all the possible characters that could go into a string
    var possibleCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    // Start the final string
    var str = '';
    for(i = 1; i <= strLength; i++) {
      // Get a random character from the possibleCharacters string
      var randomChar = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
      // Append this character to the final string
      str += randomChar;
    }

    return str;
  } else {
    return false;
  }
}

// Payment with stripe.com
helpers.paymentWithStripe = function(amount, callback) {

  // Build the request details object
  var req_details = {
      'protocol': 'https:',
      'method': 'POST',
      'hostname': 'api.stripe.com',
      'path': '/v1/charges',
      'auth': config.stripe.key
  };

  // Build the payload object
  var payload = {
      'amount': amount,
      'source': 'tok_visa',
      'description': 'Pablo\'s Pizza Restaurant Order',
      'currency': config.stripe.currency
  };

  var stringpayload = querystring.stringify(payload);

  // Instantiate the request
  var req = https.request(req_details, function(res) {
      var statuscode = res.statusCode;
      if(statuscode === 200 || statuscode === 201) {
        callback(false);
      } else {
        callback(statuscode);
      }
  });

  req.on('error', callback);

  req.write(stringpayload);
  req.end();

};

helpers.sendMailWithOrder = function(userData, order, callback) {

  // Build the request object
  var requestdetails = {
      protocol: 'https:',
      hostname: 'api.mailgun.net',
      method: 'POST',
      path: config.mailgun.path,
      auth: config.mailgun.key
  };

  // Build the payload object
  var payload = {
      from: config.mailgun.sender,
      to: userData.mail,
      subject: 'Your Pizza Order!',
      text: order
  };

  var stringpayload = querystring.stringify(payload);

  requestdetails.headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(stringpayload)
  };

  // Instantiate the request.
  var req = https.request(requestdetails, function(res) {
      var status = res.statusCode;
      if(status === 200 || status === 201) {
        console.log("Mail sent out");
        callback(false);
      } else {
        callback(status);
      }
  });

  req.on('error', (err) => {
    callback(err);
  });
  req.write(stringpayload);
  req.end();
};

// Get the string content of a template
helpers.getTemplate = function(templateName, data, callback) {

  templateName = typeof(templateName) == 'string' && templateName.length > 0 ? templateName : false;
  data = typeof(data) == 'object' && data !== null ? data : {};

  if (templateName) {
    var templatesDir = path.join(__dirname, '/../templates/');
    fs.readFile(templatesDir + templateName + '.html', 'utf8', function(err, str) {
      if (!err && str && str.length > 0) {

        // Do interpolation on the string
        var finalString = helpers.interpolateString(str, data);
        callback(false, finalString);
      } else {
        callback('No template could be found');
      }
    });
  } else {
    callback('A valid template name was not specified');
  }
};

// Add the header and footer templates to a string, and pass the data object to the header and footer for interpolation
helpers.addHeaderAndFooterTemplates = function(str, data, callback) {

  str = typeof(str) == 'string' && str.length > 0 ? str : '';
  data = typeof(data) == 'object' && data !== null ? data : {};

  // Get header from the templates folder
  helpers.getTemplate('_siteheader', data, function(err, headerString) {
    if (!err && headerString) {
      // Get the footer
      helpers.getTemplate('_sitefooter', data, function(err, footerString) {
        if (!err && footerString) {
          // Add them all together
          var fullString = headerString + str + footerString;
          callback(false, fullString);
        } else {
          callback("Could not find the footer template");
        }
      });
    } else {
      callback('Could not find the header template');
    }
  });
};
 // Take a given string and a data object and find/replace all the keys within it
helpers.interpolateString = function(str, data) {
  str = typeof(str) == 'string' && str.length > 0 ? str : '';
  data = typeof(data) == 'object' && data !== null ? data : {};

   // Add the template globals to the data object, prepending their key name with "global"
  for(var keyName in config.templateGlobals) {
    if (config.templateGlobals.hasOwnProperty(keyName)) {
      data['global.' + keyName] = config.templateGlobals[keyName];
    }
  }
   // For each key in the data object, insert its value at the corresponding place holder
  for(var key in data) {
    if (data.hasOwnProperty(key) && typeof(data[key]) == 'string') {
      var replace = data[key];
      var find = '{' + key + '}';
      str = str.replace(find, replace);
    }
  }
  return str;
};

// Get the contents of the static asset
helpers.getStaticAssetContents = function(fileName, callback) {
  fileName = typeof(fileName) == 'string' && fileName.length > 0 ? fileName : false;
  if (fileName) {
    var publicDir = path.join(__dirname, '/../public/');
    fs.readFile(publicDir + fileName, function(err, data) {
      if (!err && data) {
        callback(false, data);
      } else {
        callback('No file could be found with the specified name');
      }
    });
  } else {
    callback('A valid file name was not specified');
  }
};

// Export the module
module.exports = helpers;
