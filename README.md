# carbon-blockchain
Blockchain Network for Carbon Accounting and Reporting

Requirements:
We're planning to have a REST interface interact with the ledger.  Then a user-facing app would connect to the REST interface.

So should we have
1. a REST api which creates credential (security key) from a certificate authority which the app is allowed to interact with
2. the REST api return the security key to the client app
3.  the client app stores the security key for the user
4.  the client app allows the user to call ledger chain code using the stored security key?
