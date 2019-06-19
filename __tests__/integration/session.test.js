const request = require('supertest');
const faker = require('faker');

const app = require('../../src/app');

const truncate = require('../utils/truncate');

describe('Authentication', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should authenticate with valid credentials', async () => {
    const response = await request(app)
      .post('/player/signup')
      .send({
        name: faker.name.findName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      });

    expect(response.status).toBe(201);
  });

  // it('should not authenticate with invalid credentials', async () => {
  //   const user = await factory.create('User', {
  //     password: '123123',
  //   });

  //   console.log(user);

  //   const response = await request(app)
  //     .post('/sessions')
  //     .send({
  //       email: user.email,
  //       password: '123456',
  //     });

  //   expect(response.status).toBe(401);
  // });

  // it('shoud return jwt token when authenticated', async () => {
  //   const user = await factory.create('User', {
  //     password: '123123',
  //   });

  //   const response = await request(app)
  //     .post('/sessions')
  //     .send({
  //       email: user.email,
  //       password: '123123',
  //     });

  //   expect(response.body).toHaveProperty('token');
  // });

  // it('should be able to access private routes when authenticated', async () => {
  //   const user = await factory.create('User', {
  //     password: '123123',
  //   });

  //   const response = await request(app)
  //     .get('/dashboard')
  //     .set('Authorization', `Bearer ${user.generateToken()}`);

  //   expect(response.status).toBe(200);
  // });

  // it('should not be able to access private routes without jwt token', async () => {
  //   const response = await request(app).get('/dashboard');

  //   expect(response.status).toBe(401);
  // });

  // it('should not be able to access privatewith invalid jwt token', async () => {
  //   const response = await request(app)
  //     .get('/dashboard')
  //     .set('Authorization', 'Bearer 123456');

  //   expect(response.status).toBe(401);
  // });
});
