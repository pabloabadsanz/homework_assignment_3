In this assignment I've added the frontend reusing the templates from the course's lessons.

The user section allows users to sign up providing the REST API with the username, name, address, mail address, and a password.

Once the user is signed up, it automatically takes the user to the page for start ordering a pizza.

When a user does not exist, but tries to log in, the system shows an error message. If the user exists though, the user is logged in and taken to the "Order Pizza" page.

A user can modify their account details later on, so that they can specify a new password, or change their mail and home addresses. The username, which is key, cannot be changed.

The items are listed in that page, and can be checked in the box above. When the user is done with the selection of the ingredients, the user can proceed to the next page where the selected items can be reviewed. If the user is not happy with the ingredients he selected, they can go back and modify their selection.
Anytime the "Order a Pizza" page is opened, if the user had some ingredients already added to a cart (from the previous assignment), they will be preloaded by checking them in the list of ingredients. Even when the user logs out and in again.

When the user wants to review the ingredients, before placing the order, if there are no ingredients, a warning message will be shown.

If the list of ingredients is valid, and the user is fine with it, the payment is processed via stripe.com API. If there's some issue with the payment, an error message is shown. If the payment is OK, then a mail message with the invoice is sent to the user via mailgun API.

When the order is successfully placed, then the cart from the save user object is emptied so that a new order can be started anytime.

Also, taking advantage of the previous assignment's REST API, when a user is deleted, the pending cart items are also removed since they are inside the user object, as well as the tokens.
The tokens workers are also in place again, for removing expired tokens.
