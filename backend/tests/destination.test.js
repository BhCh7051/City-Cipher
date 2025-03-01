const request = require('supertest');
const app = require('../server'); // We'll need to modify server.js to export app
const Destination = require('../models/Destination');

describe('Destination Endpoints', () => {
  beforeEach(async () => {
    // Create test destination
    await Destination.create({
      city: 'Paris',
      country: 'France',
      clues: ['Known for its iron tower', 'City of Love'],
      fun_fact: ['The Eiffel Tower was meant to be temporary'],
      trivia: ['It has over 400 cheese varieties']
    });
  });

  describe('GET /api/destinations/random', () => {
    it('should return a random destination with clues and options', async () => {
      const res = await request(app)
        .get('/api/destinations/random');
      
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('questionData');
      expect(res.body).toHaveProperty('options');
      expect(res.body.options).toHaveLength(1);
      expect(res.body.questionData).toHaveProperty('clues');
    });
  });

  describe('POST /api/destinations/check-answer', () => {
    it('should correctly verify a right answer', async () => {
      const destination = await Destination.findOne({ city: 'Paris' });
      
      const res = await request(app)
        .post('/api/destinations/check-answer')
        .send({
          destinationId: destination._id,
          answer: { city: 'Paris', country: 'France' }
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.isCorrect).toBe(true);
      expect(res.body.destination).toHaveProperty('city', 'Paris');
    });

    it('should correctly verify a wrong answer', async () => {
      const destination = await Destination.findOne({ city: 'Paris' });
      
      const res = await request(app)
        .post('/api/destinations/check-answer')
        .send({
          destinationId: destination._id,
          answer: { city: 'London', country: 'UK' }
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.isCorrect).toBe(false);
    });
  });
}); 