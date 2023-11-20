// Unit tests for the backend using jest

// Imports


// Global variables
const apiPort = process.env.API_PORT || 3000;
const filePort = process.env.FILE_PORT || 3002;
const authPort = process.env.AUTH_PORT || 3001;
const apiURL = `http://localhost:${apiPort}`;
const fileURL = `http://localhost:${filePort}`;
const authURL = `http://localhost:${authPort}`;

// Global variables for testing
let accessToken;
let refreshToken;
const user = 'testuser';
const password = 'testpassword';

// Tests

// Test 1: Create user. API server
describe('Create user', () => {
    test('Create user', async () => {
        const response = await axios.post(`${apiURL}/users/register`, {
            name: user,
            password: password
        });

        expect(response.status).toBe(201);
    });
});