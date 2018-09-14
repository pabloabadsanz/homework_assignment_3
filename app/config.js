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
    'key' : 'sk_test_FHLoeqt2mf9JSIBL5ZWnf1ja',
    'currency' : 'eur'
  },
  'mailgun': {
    'key': 'api:7c505237e6d36910698446ae286b2072-f45b080f-9cd90cfc',
    'path': '/v3/sandboxc03436a1c5374c71b3a5f60679c88a18.mailgun.org/messages',
    'sender': 'Pablo\'s Pizza <postmaster@sandboxc03436a1c5374c71b3a5f60679c88a18.mailgun.org>'
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
