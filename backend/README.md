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
- [Get user](#get-user)
- [Upload file](#upload-file)
- [Get file](#get-file)
- [Create thread](#create-thread)
- [Update thread](#update-thread)
- [Delete thread](#delete-thread)
- [Get thread](#get-thread)

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

The parameters correspond to the fields in the user object.

Database object structures can be found in the [database section](#database).

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
    Authorization: 'Bearer <auth token>'
  }
};

fetch(encodeUri('http://localhost:3001/users/get?name=/^devUser$/'), options)
  .then(response => response.json())
  .then(response => console.log(response))
  .catch(err => console.error(err));
```

Parameters search for the exact value given. If you would like to search for a partial value, use regex. **ie:** `?name=/^devUser$/` will return a list of users with the name `devUser`. `?name=/^dev/` will return a list of users with names that start with `dev`.

To access nested objects, use dot notation. **ie:** `?info.logged=true` will return a list of users that are currently logged in.

Database object structures can be found in the [database section](#database).

## Upload File

[**Back ➩**](#table-of-contents)

Uploads a file to the server and returns the a file object.

- Request: **POST:** `https://file.chathub.kontra.tel/files`
- AUTH: token

### Parameters

| Name     | Type   | Description                                                  |
| -------- | ------ | ------------------------------------------------------------ |
| file | file | The file to be uploaded. |

### Returns

- 200 OK - File uploaded successfully.
  - ufid: ID of the file.
  - name: Original name of the file.
  - path: URL of the file.
  - owner: ID of the user who uploaded the file.
  - size: Size of the file.
  - createdAt: Date the file was uploaded.
- 401 Unauthorized - Token is invalid or missing.
- 403 Forbidden - Token is expired.
- 413 Payload Too Large - File is too large.
- 500 Internal Server Error - Server error.


### Example
  
  ```javascript
  const form = new FormData();
form.append("file", "te-palvelut.400x239jpg.jpg");

const options = {
  method: 'POST',
  headers: {
    Authorization: 'Bearer <auth token>'
  }
};

options.body = form;

// Delete the Content-Type header from the fetch options
// so the browser can set it automatically
delete options.headers['Content-Type'];

fetch('https://file.chathub.kontra.tel/files', options)
  .then(response => response.json())
  .then(response => console.log(response))
  .catch(err => console.error(err));
  ```

## Get File

[**Back ➩**](#table-of-contents)

Gets a file object or downloads the file.

- Request: **GET:** `https://file.chathub.kontra.tel/files`

### Parameters

| Name     | Type   | Description                                                  |
| -------- | ------ | ------------------------------------------------------------ |
| ufid | string | ID of the file. |
| download | boolean | If true, downloads the file. |

### Returns

- 200 OK - File found.
  - ufid: ID of the file.
  - name: Original name of the file.
  - path: URL of the file.
  - owner: ID of the user who uploaded the file.
  - size: Size of the file.
  - createdAt: Date the file was uploaded.
- 200 OK - Fie data (Only id download is true).
- 404 Not Found - File not found.
- 401 Unauthorized - Token is invalid or missing.
- 500 Internal Server Error - Server error.

### Example

```javascript
const options = {
  method: 'GET',
  headers: {
    Authorization: 'Bearer <auth token>'
  }
};

fetch('https://file.chathub.kontra.tel/files?ufid=w4HPV38nBU&download=true', options)
  .then(response => response.json())
  .then(response => console.log(response))
  .catch(err => console.error(err));
```

## Create thread

[**Back ➩**](#table-of-contents)

Creates a new thread.

- Request: **POST:** `https://api.chathub.kontra.tel/threads/create`
- AUTH: token

### Parameters

| Name     | Type   | Description                                                  |
| -------- | ------ | ------------------------------------------------------------ |
| title | string | Name of the thread. (required) |
| members | array | List of members in the thread. (uid) |
| moderators | array | List of moderators in the thread. (uid) |
| nsfw | boolean | If true, thread is marked as nsfw. |

All users in moderators will also be added to members automatically. The owner of the thread is the user who created the thread. All duplicate users will be removed from the list automatically. Invalid users will be ignored.

### Returns

- 200 OK - Thread created successfully.
  - Thread object. (see [database section](#database))
- 401 Unauthorized - Token is invalid or missing.
- 403 Forbidden - Token is expired.
- 400 Bad Request - Title is missing.
- 500 Internal Server Error - Server error.

### Example

```javascript
const options = {
  method: 'POST',
  headers: {
    Authorization: 'Bearer <auth token>',
    'Content-Type': 'application/json'
  },
  body: '{
    "title":"thread2",
    "members":["e3Bvw5cc"],
    "moderators":["adsasdas"],
    "nsfw":"false"
    }'
};

fetch('http://localhost:3001/threads/create', options)
  .then(response => response.json())
  .then(response => console.log(response))
  .catch(err => console.error(err));
```

## Update thread

[**Back ➩**](#table-of-contents)

Updates a thread.

- Request: **POST:** `https://api.chathub.kontra.tel/threads/update`
- AUTH: token

### Parameters

| Name     | Type   | Description                                                  |
| -------- | ------ | ------------------------------------------------------------ |
| utid | string | ID of the thread. (required) |
| opers | array | List of operations to be performed. |

### Operations

Operations are objects that contain the operation to be performed and the data to be used in the operation. See examples for more details.

Ther are two types of operations arrays and strings. Arrays are used for operations that require multiple values like adding or removing members. Strings are used for operations that require only one value like changing the title.

#### Array operations example

```javascript
{
  "type": "members", // members or moderators
  "value": ["et5HUjjC"], // list of members to be added or removed
  "action": "remove" // remove or add
}
```

#### String operations example

```javascript
{
  "type": "title", // title, nsfw, locked, owner
  "value": "newName" // new title, nsfw value, locked value, new owner
}
```

### Returns

- 200 OK - Thread updated successfully.
  - Thread object. (see [database section](#database))
- 401 Unauthorized - Token is invalid or missing.
- 403 Forbidden - Token is expired.
- 400 Bad Request - Title is missing.
- 500 Internal Server Error - Server error.

### Example

```javascript

const body = {
  utid: 'w4HPV38nBU',
  opers: [
    {
      type: 'members',
      value: ['e3Bvw5cc'],
      action: 'remove'
    },
    {
      type: 'title',
      value: 'newName'
    }
  ]
};

const options = {
  method: 'POST',
  headers: {
    Authorization: 'Bearer <auth token>',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(body)
};

fetch('http://localhost:3001/threads/update', options)
  .then(response => response.json())
  .then(response => console.log(response))
  .catch(err => console.error(err));
```

## Delete thread

[**Back ➩**](#table-of-contents)

Deletes a thread.

- Request: **DELETE:** `https://api.chathub.kontra.tel/threads/delete`
- AUTH: token

### Parameters

| Name     | Type   | Description                                                  |
| -------- | ------ | ------------------------------------------------------------ |
| utid | string | ID of the thread. (required) |

### Returns

- 204 No Content - Thread deleted successfully.
- 401 Unauthorized - Token is invalid or missing.
- 403 Forbidden - Token is expired.
- 500 Internal Server Error - Server error.
- 404 Not Found - Thread not found.

### Example

```javascript
const options = {
  method: 'DELETE',
  headers: {
    Authorization: 'Bearer <auth token>',
    'Content-Type': 'application/json'
  },
  body: '{"utid":"jgp0V8Yu"}' // utid of the thread to be deleted
};

fetch('http://localhost:3001/threads/del', options)
  .then(response => response.json())
  .then(response => console.log(response))
  .catch(err => console.error(err));
```

## Get thread

[**Back ➩**](#table-of-contents)

Gets a thread.

- Request: **GET:** `https://api.chathub.kontra.tel/threads/get`
- AUTH: token

### Parameters

The parameters correspond to the fields in the thread object.

Database object structures can be found in the [database section](#database).

### Returns

- 200 OK - Thread found.
  - Thread object. (see [database section](#database))
- 401 Unauthorized - Token is invalid or missing.
- 403 Forbidden - Token is expired.
- 500 Internal Server Error - Server error.
- 404 Not Found - Thread not found.

### Example

```javascript
const options = {
  method: 'GET',
  headers: {
    Authorization: 'Bearer <auth token>'
  }
};

fetch('http://localhost:3001/threads/a?title=thread2&options.owner=DpHytzT9', options)
  .then(response => response.json())
  .then(response => console.log(response))
  .catch(err => console.error(err));
```

Parameters search for the exact value given. If you would like to search for a partial value, use regex. **ie:** `?title=/^thread/` will return a list of threads with the title starting with `thread`.

To access nested objects, use dot notation. **ie:** `?options.owner=DpHytzT9` will return a list of threads that have the owner `DpHytzT9`.

Database object structures can be found in the [database section](#database).

## Create message

[**Back ➩**](#table-of-contents)