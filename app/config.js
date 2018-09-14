/*
 * Create configuration variables
 *
 */

// Container
var environments = {};

environments.production = {
  'httpPort' : 1234,
  'envName' : 'production',
  'hashingsecret': 'thisIsASecret',
  'menuItemsData': {
    'Tomato': 4,
    'Tuna': 3,
    'Ham': 3,
    'Pepperoni': 4,
    'Cheese': 4,
  },
  'stripe' : {
    'key' : '',
    'currency' : 'eur'
  },
  'mailgun': {
    'key': '',
    'path': '',
    'sender': ''
  },
  'templateGlobals': {
    'appName': 'Order your pizza',
    'companyName': 'Pablo\'s Pizza',
    'yearCreated': '2018',
    'baseUrl': 'http://localhost:1234/'
  }
}


// Export the module
module.exports = environments.production;
