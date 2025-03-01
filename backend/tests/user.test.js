const request = require('supertest');
const app = require('../server');
const User = require('../models/User');

describe('User Endpoints', () => {
  describe('POST /api/users/register', () => {
    it('should create a new user', async () => {
      const res = await request(app)
        .post('/api/users/register')
        .send({
          username: 'testuser'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('username', 'testuser');
      expect(res.body).toHaveProperty('inviteCode');
      expect(res.body.score).toEqual({ correct: 0, incorrect: 0 });
    });

    it('should not allow duplicate usernames', async () => {
      await User.create({
        username: 'testuser',
        inviteCode: '12345678'
      });

      const res = await request(app)
        .post('/api/users/register')
        .send({
          username: 'testuser'
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('message', 'Username already taken');
    });
  });

  describe('GET /api/users/invite/:inviteCode', () => {
    it('should get user by invite code', async () => {
      const user = await User.create({
        username: 'testuser',
        inviteCode: '12345678'
      });

      const res = await request(app)
        .get(`/api/users/invite/${user.inviteCode}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('username', 'testuser');
      expect(res.body).toHaveProperty('score');
    });

    it('should return 404 for invalid invite code', async () => {
      const res = await request(app)
        .get('/api/users/invite/invalid');

      expect(res.statusCode).toBe(404);
    });
  });

  describe('POST /api/users/update-score', () => {
    beforeEach(async () => {
      await User.create({
        username: 'testuser',
        score: { correct: 0, incorrect: 0 }
      });
    });

    it('should increment correct score', async () => {
      const res = await request(app)
        .post('/api/users/update-score')
        .send({
          username: 'testuser',
          isCorrect: true
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.score).toEqual({ correct: 1, incorrect: 0 });
    });

    it('should increment incorrect score', async () => {
      const res = await request(app)
        .post('/api/users/update-score')
        .send({
          username: 'testuser',
          isCorrect: false
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.score).toEqual({ correct: 0, incorrect: 1 });
    });
  });
}); 