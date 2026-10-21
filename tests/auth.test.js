const request = require('supertest');
const app = require('../src/app'); // Express app

describe('Authentication Module Unit Tests', () => {

  // 1. Positive Case
  it('[Positive] Should successfully register a new user with valid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'Password123!'
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('token');
  });

  // 2. Negative Case
  it('[Negative] Should reject login attempt with wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'testuser@example.com',
        password: 'WrongPassword'
      });

    expect(res.statusCode).toEqual(401);
    expect(res.body.message).toMatch(/invalid credentials/i);
  });

  // 3. Boundary Case
  it('[Boundary] Should fail registration when password is shorter than 8 characters', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'shortpass',
        email: 'short@example.com',
        password: '123'
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body.errors).toBeDefined();
  });

});
