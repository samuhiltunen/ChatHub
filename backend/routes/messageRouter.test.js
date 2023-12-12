const request = require('supertest');
const express = require('express');
const router = require('./messages'); // Update the path accordingly

const app = express();
app.use(express.json());
app.use('/messages', router);

describe('Message Router Tests', () => {
  // Mock user data for authentication
  const mockUser = {
    uuid: 'mockUserId',
    name: 'mockUserName',
    // Add other necessary user properties based on your implementation
  };

  // Mock authentication middleware
  const mockAuthMiddleware = (req, res, next) => {
    req.user = mockUser;
    next();
  };

  it('should create a new message', async () => {
    const response = await request(app)
      .post('/messages/create')
      .set('Authorization', 'Bearer mockAuthToken') // Mock authentication token
      .send({ utid: 'mockThreadId', content: 'Hello, World!' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('content');
    expect(response.body.content).toHaveProperty('umid');
  });

  it('should update a message', async () => {
    // Assume umid is a valid message ID
    const response = await request(app)
      .post('/messages/update')
      .set('Authorization', 'Bearer mockAuthToken') // Mock authentication token
      .send({ umid: 'mockMessageId', content: 'Updated content' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('content', 'Message updated');
  });

  it('should delete a message', async () => {
    // Assume umid is a valid message ID
    const response = await request(app)
      .delete('/messages')
      .set('Authorization', 'Bearer mockAuthToken') // Mock authentication token
      .send({ umid: 'mockMessageId' });

    expect(response.status).toBe(204);
  });

  it('should get a single message by umid', async () => {
    // Assume umid is a valid message ID
    const response = await request(app)
      .get('/messages')
      .set('Authorization', 'Bearer mockAuthToken') // Mock authentication token
      .query({ umid: 'mockMessageId' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('content');
    // Add assertions based on the expected outcome
  });

  it('should get messages by thread utid', async () => {
    // Assume utid is a valid thread ID
    const response = await request(app)
      .get('/messages')
      .set('Authorization', 'Bearer mockAuthToken') // Mock authentication token
      .query({ utid: 'mockThreadId' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('content');
    // Add assertions based on the expected outcome
  });
});
