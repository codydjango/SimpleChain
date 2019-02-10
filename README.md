# SimpleChain

This express API demonstrates how to sign and verify transactions using bitcoin addresses.

Developer notes: 
* Make sure the NODE_PATH is set (it is if you use the `package.json` script commands). This enables absolute paths in require statements, which is nice.
* The code is organized in a MVC-type architecture.
* The application throws and catches custom exceptions which can be evaluated with `instanceof`, which helps in the organization of code and in simplifying business logic.
* Validation logic is handled by express-validator, and it happens in middleware.
* There's a main error handler function that catches and processes all thrown exceptions.

Install:
`npm install`

Run server on localhost:8000:
`npm run start`

### Framework

`Express 4.16.4`

### Endpoints


`POST /requestValidation` # create a ValidationRequest

`POST /message-signature/validate` # sign a pending ValidationRequest

`POST /block/` # register a star using an address that corresponds to a signed ValidationRequest

`GET /stars/address:[ADDRESS]` # Get all addresses associated with an address

`GET /stars/hash:[HASH]` # Get an address associated with a hash

`GET /block/[HEIGHT]` # Get the block at a specific height
