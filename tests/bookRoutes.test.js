const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app.js');
const Book = require('../src/models/bookModel.js');
require('dotenv').config();

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_TEST_URI);
});

afterAll(async () => {
  await mongoose.connection.close();
});


describe('GET /api/books', () => {
  beforeEach(async () => {
    await Book.deleteMany();
    await Book.insertMany([
      {
        title: 'Book One',
        authors: 'Author One',
        isbn: '1111111111',
        category: 'Fiction',
        description: 'A test book',
        thumbnail: 'http://example.com/thumb1.jpg',
        publishedDate: new Date('2020-01-01'),
        publisher: 'Publisher One',
        availableCopies: 5,
      },
      {
        title: 'Book Two',
        authors: 'Author Two',
        isbn: '2222222222',
        category: 'Non-fiction',
        description: 'Another test book',
        thumbnail: 'http://example.com/thumb2.jpg',
        publishedDate: new Date('2021-05-15'),
        publisher: 'Publisher Two',
        availableCopies: 3,
      },
    ]);
  });

  it('should fetch all books with pagination', async () => {
    const res = await request(app).get('/api/books');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThanOrEqual(2);
  });

  it('should filter books by category', async () => {
    const res = await request(app).get('/api/books?category=Fiction');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].category).toBe('Fiction');
  });

  it('should paginate results correctly', async () => {
    const res = await request(app).get('/api/books?page=1');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeLessThanOrEqual(15);
  });

  it('should return empty array if category not found', async () => {
    const res = await request(app).get('/api/books?category=Nonexistent');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(0);
  });

  it('should default to page 1 if page query is invalid', async () => {
    const res = await request(app).get('/api/books?page=invalid');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should handle extremely high page number', async () => {
    const res = await request(app).get('/api/books?page=9999');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(0);
  });
});

describe('GET /api/books/categories', () => {
  it('should fetch all unique book categories', async () => {
    const res = await request(app).get('/api/books/categories');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toContain('Fiction');
    expect(res.body).toContain('Non-fiction');
  });

  it('should return empty array if no books exist', async () => {
    await Book.deleteMany();
    const res = await request(app).get('/api/books/categories');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });
});
