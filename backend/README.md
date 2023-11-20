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

- Register new user [API_URI/users/register](#register-user)
- Login user [AUTH_URI/login](#login-user)

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

