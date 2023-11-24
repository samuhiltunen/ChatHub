# Chathub Backend documentation

Chathub backend consists of three main components that are all hosted on the same server. The components are the API server, authentication server and file server. The API server handles getting and sending data to the database including messages, users, and threads. The authentication server handles user authentication and authorization for the API server. The file server handles uploading and downloading files to and from the server like avatars, group icons and files embedded in messages. The same server also hosts the database.

- **Chathub API** - API server that handles getting and sending data to the database including messages, users, and groups.
  - URL: `https://api.chathub.kontra.tel`

- **Chathub Auth** - Authentication server that handles user authentication and authorization for the API server.
  - URL: `https://auth.chathub.kontra.tel`

- **Chathub File** - File server that handles uploading and downloading files to and from the server like avatars, group icons and files embedded in messages.
  - URL: `https://file.chathub.kontra.tel`

## Table of Contents

### API

- [Register new user](#register-user)
- [Login user](#login-user)
- [Logout user](#logout-user)
- [Refresh token](#refresh-token)
- [Find users](#get-user)

### Database

- [Users](#users)
- [Threads](#groups)
- [Messages](#messages)
- [Files](#files)

## API Documentation

Includes all the endpoints for all different components of the backend.

### Authentication

Most api endpoints require authentication. To first authenticate, send a request to the login endpoint with the username and password as the body of the request. The login endpoint will return a JWT token that can be used to authenticate for other endpoints. The token must be sent as the Authorization header in the format `Bearer <token>`.

Authentication tokens expire after 15min and must be refreshed. To refresh a token, send a request to the token endpoint with the refresh token as the Authorization header. The login endpoint will return a new token that can be used to authenticate for another 15min.

## Register User

[**Back ➩**](#table-of-contents)

Registers a new user to the database.

- **POST:** `https://api.chathub.kontra.tel/users/register`
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

[**Back ➩**](#table-of-contents)

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

[**Back ➩**](#table-of-contents)

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

[**Back ➩**](#table-of-contents)

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
- 403 Forbidden - Refresh token is already invalidated. (User logged out)
- 404 Not Found - Refresh token not found in database.

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

[**Back ➩**](#table-of-contents)

Search for user information.

- Request: **GET:** `https://api.chathub.kontra.tel/users/`
- AUTH: token

### Parameters

| Name     | Type   | Description                                                  |
| -------- | ------ | ------------------------------------------------------------ |
| param    | string | Name of the search function |
| query    | string | Query for the search function |

### Returns

- 200 OK - User found.
  - uuid: ID of the user.
  - name: Username of the user.
  - avatar: Avatar of the user.
  - groups: List of groups the user is in.
- 401 Unauthorized - Token is invalid or missing.
- 403 Forbidden - Token is expired.

### Example

```javascript
const options = {
  method: 'GET',
  headers: {
    Authorization: 'Bearer <auth token>',
    'Content-Type': 'application/json'
  },
  body: '{"param":"mult","query":{"info.logged":"false"}}'
};

fetch('http://localhost:3001/users/test', options)
  .then(response => response.json())
  .then(response => console.log(response))
  .catch(err => console.error(err));
```

### Search Functions

| Name       | Description    | Example                                                      |
| ---------- | -------------- | ------------------------------------------------------------ |
| uuid | Search for uuid param  | <pre>{<br>  "param": "uuid",<br>  "query": "testUser"<br>}|
| name | Search for name param  | <pre>{<br>  "param": "name",<br>  "query": "testUser"<br>}|
| mult | Search for multiple parameters.|<pre>{<br>  "param": "mult",<br>  "query": {<br>    "info.logged": "false",<br>    "name": "testUser"<br>  }<br>} |

All search functions return a list of users that match the query.
Queries accept regex.

Database object structures can be found in the [database section](#database).

### Regex example

```javascript
const query = {
  param: 'name',
  query: '^testUser$'
};
```

The above will only match the exact username `testUser` and not `testUser1` or `testUser2`.
