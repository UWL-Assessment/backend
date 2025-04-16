const request = require('supertest');
const app = require('../src/app');
const mongoose = require('mongoose');
const User = require('../src/models/userModel');
require('dotenv').config();

describe('Auth Routes - Sign Up', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_TEST_URI);
  });

  afterAll(async () => {
    // Clean up the database and close the connection
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  it('should register a new user successfully', async () => {
    const newUser = {
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'password123',
    };

    const response = await request(app)
      .post('/api/auth/register')
      .send(newUser);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('message', 'User registered successfully');
    expect(response.body).toHaveProperty('user');
    expect(response.body.user).toHaveProperty('username', newUser.username);
    expect(response.body.user).toHaveProperty('email', newUser.email);
  });

  it('should return an error if email is already in use', async () => {
    const existingUser = {
      username: 'existinguser',
      email: 'existinguser@example.com',
      password: 'password123',
    };

    // Create an existing user
    await User.create(existingUser);

    const response = await request(app)
      .post('/api/auth/register')
      .send(existingUser);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Email is already in use');
  });

  it('should return an error if required fields are missing', async () => {
    const incompleteUser = {
      username: 'incompleteuser',
    };

    const response = await request(app)
      .post('/api/auth/register')
      .send(incompleteUser);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'All fields are required');
  });
});