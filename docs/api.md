This is the Compsole API documentation.

### Authenticating

There are two methods of authenticating to the Compsole API. **Basic Auth** is used solely for the purpose of the Compsole UI. **Api Key Auth** is used for service accounts to authenticate prior to accessing the REST endpoints.

#### Basic Auth

Use the [`/api/auth/local/login`](#operations-Auth_API-post_auth_local_login) endpoint below to authenticate from the Compsole UI.

#### Api Key Auth

API Key Authentication is more complicated.

1. You must retreive your `api_key` and `api_secret` from the Compsole UI after creating a service account.
2. Use the [`/rest/token`](#operations-Auth_API-post_rest_login) endpoint to retrieve an API Token to use in requests
3. Place the API Token into the `Authorization` header like so: `Authorization: Bearer <api token here...>`

##### Refresh Tokens

Refresh tokens can be used to renew a session without re-authenticating. The refresh token should be set in the `refresh-token` cookie already, so you can simply make a `POST` request to `/rest/token/refresh` and receive a new API token from this endpoint.
