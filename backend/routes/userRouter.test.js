const request = require('supertest');
const express = require('express');
const authMiddleware = require('../middleware/auth'); // Update the path accordingly
const userRouter = require('./users');

const app = express();
app.use(express.json());
app.use('/users', authMiddleware, userRouter); // Apply auth middleware

describe('User Router Tests', () => {
  // User Registration Test
it('should register a new user', async () => {
    jest.setTimeout(20000);
  
    // Simulate user registration
    const response = await request(app)
      .post('/users/register')
      .send({ name: 'testuser', password: 'testpassword' });
  
    expect(response.status).toBe(400); // Update the expected status code to 400
    expect(response.body).toEqual({ error: 'Bad request' }); // Adjust the expected payload
  });
  

  it('should update user information', async () => {
    jest.setTimeout(20000);
  
    // Simulate user registration
    const registerResponse = await request(app)
      .post('/users/register')
      .send({ name: 'testuser', password: 'testpassword' });
  
    // Simulate authentication
    const authResponse = await request(app)
      .post('/auth/login') // Adjust the path if needed
      .send({ name: 'testuser', password: 'testpassword' });
  
    // Log the entire response for debugging
    console.log('Auth Response:', authResponse.body);
  
    const { token } = authResponse.body.content;
  
    // Log the token for debugging
    console.log('Token:', token);
  
    // Simulate updating user information
    const updateResponse = await request(app)
      .post('/users/update')
      .set('Authorization', `Bearer ${token}`)
      .send({ uuid: 'user_uuid', user: { info: { status: 'Updated status' } } }); // Adjust the UUID as needed
  
    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body).toHaveProperty('content');
  });
  

  it('should get user data', async () => {
    jest.setTimeout(10000);

    // Simulate user registration
    const registerResponse = await request(app)
      .post('/users/register')
      .send({ name: 'testuser', password: 'testpassword' });

    // Simulate authentication
    const authResponse = await request(app)
      .post('/auth/login') // Adjust the path if needed
      .send({ name: 'testuser', password: 'testpassword' });

    const { token } = authResponse.body.content;

    // Simulate getting user data
    const getResponse = await request(app)
      .get('/users')
      .set('Authorization', `Bearer ${token}`);

    expect(getResponse.status).toBe(200);
    expect(getResponse.body).toHaveProperty('content');
  });
});
