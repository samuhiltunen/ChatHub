# Chathub Backend



## Chathub backend consists of three main components:

- **Chathub API** - API server that handles getting and sending data to the database including messages, users, and groups.
  - URL: `https://api.chathub.kontra.tel`

- **Chathub Auth** - Authentication server that handles user authentication and authorization for the API server.
  - URL: `https://auth.chathub.kontra.tel`

- **Chathub File** - File server that handles uploading and downloading files to and from the server like profile pictures and group icons and files embedded in messages.
  - URL: `https://file.chathub.kontra.tel`

## API Documentation

Includes all the endpoints for all different components of the backend.

### Table of Contents

- Register new user [api/user/register](#register-user)
- Login user [auth/login](#login-user)
- Logout user [auth/logout](#logout-user)
- Refresh token [auth/token](#refresh-token)

## Authentication

Most api endpoints require authentication. To first authenticate, send a request to the login endpoint with the username and password as the body of the request. The login endpoint will return a JWT token that can be used to authenticate for other endpoints. The token must be sent as the Authorization header in the format `Bearer <token>`.

Authentication tokens expire after 15min and must be refreshed. To refresh a token, send a request to the token endpoint with the refresh token as the Authorization header. The login endpoint will return a new token that can be used to authenticate for another 15min.

## Register User

Registers a new user to the database.

- **POST:** `https://auth.chathub.kontra.tel/api/register`
- AUTH: None

### Parameters

| Name     | Type   | Description                                                  |
| -------- | ------ | ------------------------------------------------------------ |
| name | string | The username of the user. Must be unique.                    |
| password | string | The password of the user.                                    |

### Returns

- 200 OK - User registered successfully.
- 403 Forbidden - Username already exists.
- 400 Bad Request - Username or password is missing.
- 500 Internal Server Error - Server error. (happens usually when there is an error with db query)

### Example

```javascript
const options = {
  method: 'POST',
  headers: {Authorization: 'Bearer ', 'Content-Type': 'application/json'},
  body: '{"name":"testUser","password":"passwrd2"}'
};

fetch('https://api.chathub.kontra.tel/users/register', options)
  .then(response => response.json())
  .then(response => console.log(response))
  .catch(err => console.error(err));

```

## Login User

Logs in a user and returns a JWT token that can be used to authenticate the user for other endpoints. See authentication section for more details.

- Request: **POST:** `https://auth.chathub.kontra.tel/login`
- AUTH: None

### Parameters

| Name     | Type   | Description                                                  |
| -------- | ------ | ------------------------------------------------------------ |
| name | string | The username of the user. Must be unique.                    |
| password | string | The password of the user.                                    |

### Returns

- 200 OK - User logged in successfully.
  - accessToken: JWT token that can be used to authenticate for other endpoints.
  - refreshToken: JWT token that can be used to refresh the accessToken.
- 401 Unauthorized - Username or password is incorrect.
- 400 Bad Request - Username or password is missing.
- 500 Internal Server Error - Server error.

### Example

```javascript
const options = {
  method: 'POST',
  headers: {Authorization: 'Bearer ', 'Content-Type': 'application/json'},
  body: '{"name":"testUser","password":"passwrd2"}'
};

fetch('https://auth.chathub.kontra.tel/login', options)
  .then(response => response.json())
  .then(response => console.log(response))
  .catch(err => console.error(err));
```

## Logout User

Logs out a user and invalidates the refresh token.

- Request: **DELETE:** `https://auth.chathub.kontra.tel/logout`
- AUTH: token

### Parameters

| Name     | Type   | Description                                                  |
| -------- | ------ | ------------------------------------------------------------ |
| token | string | Refresh token of the user |

### Returns

- 204 No Content - User logged out successfully.
- 401 Unauthorized - Refresh token is invalid.
- 500 Internal Server Error - Server error.

### Example

```javascript
const options = {
  method: 'DELETE',
  headers: {Authorization: 'Bearer <auth token>', 'Content-Type': 'application/json'},
  body: '{"token":"<refresh token>"}'
};

fetch('https://auth.chathub.kontra.tel/logout', options)
  .then(response => response.json())
  .then(response => console.log(response))
  .catch(err => console.error(err));
```

## Refresh Token

Refreshes the access token using the refresh token.

- Request: **POST:** `https://auth.chathub.kontra.tel/token`
- AUTH: none

### Parameters

| Name     | Type   | Description                                                  |
| -------- | ------ | ------------------------------------------------------------ |
| token | string | Refresh token of the user |

### Returns

- 200 OK - Token refreshed successfully.
  - accessToken: JWT token that can be used to authenticate for other endpoints.
- 400 Bad Request - Refresh token is missing.
- 401 Unauthorized - Refresh token is invalid.
- 404 Not Found - Refresh token not found in database.
- 403 Forbidden - Refresh token is already invalidated. (User logged out)

### Example

```javascript
const options = {
  method: 'POST',
  headers: {
    Authorization: 'Bearer ',
    'Content-Type': 'application/json'
  },
  body: '{"token":"<refresh token>"}'
};

fetch('https://auth.chathub.kontra.tel/token', options)
  .then(response => response.json())
  .then(response => console.log(response))
  .catch(err => console.error(err));
```

## Get User

Gets the user information of the user with the given name.