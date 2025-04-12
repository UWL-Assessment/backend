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

describe('POST /api/books', () => {
  beforeEach(async () => {
    await Book.deleteMany();
  });

  it('should create a new book with valid data', async () => {
    const newBook = {
      title: 'New Book',
      authors: 'New Author',
      isbn: '3333333333',
      category: 'Science',
      description: 'A new test book',
      thumbnail: 'http://example.com/thumb3.jpg',
      publishedDate: new Date('2023-01-01'),
      publisher: 'New Publisher',
      availableCopies: 10,
    };

    const res = await request(app).post('/api/books').send(newBook);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.title).toBe(newBook.title);
  });

  it('should return 400 if required fields are missing', async () => {
    const incompleteBook = {
      authors: 'Author Missing Title',
    };

    const res = await request(app).post('/api/books').send(incompleteBook);
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should return 400 if ISBN is not unique', async () => {
    const book = {
      title: 'Duplicate ISBN Book',
      authors: 'Author',
      isbn: '4444444444',
      category: 'History',
      description: 'A duplicate ISBN test book',
      thumbnail: 'http://example.com/thumb4.jpg',
      publishedDate: new Date('2022-01-01'),
      publisher: 'Publisher',
      availableCopies: 5,
    };

    await Book.create(book);

    const res = await request(app).post('/api/books').send(book);
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });
});

describe('PUT /api/books/:id', () => {
  let book;

  beforeEach(async () => {
    await Book.deleteMany();
    book = await Book.create({
      title: 'Book to Update',
      authors: 'Author',
      isbn: '5555555555',
      category: 'Fiction',
      description: 'A book to be updated',
      thumbnail: 'http://example.com/thumb5.jpg',
      publishedDate: new Date('2020-01-01'),
      publisher: 'Publisher',
      availableCopies: 5,
    });
  });

  it('should update a book with valid data', async () => {
    const updatedData = {
      title: 'Updated Book Title',
      availableCopies: 10,
    };

    const res = await request(app).put(`/api/books/${book._id}`).send(updatedData);
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe(updatedData.title);
    expect(res.body.availableCopies).toBe(updatedData.availableCopies);
  });

  it('should return 404 if book does not exist', async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    const res = await request(app).put(`/api/books/${nonExistentId}`).send({ title: 'Nonexistent Book' });
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error');
  });
});

describe('DELETE /api/books/:id', () => {
  let book;

  beforeEach(async () => {
    await Book.deleteMany();
    book = await Book.create({
      title: 'Book to Delete',
      authors: 'Author',
      isbn: '6666666666',
      category: 'Non-fiction',
      description: 'A book to be deleted',
      thumbnail: 'http://example.com/thumb6.jpg',
      publishedDate: new Date('2021-01-01'),
      publisher: 'Publisher',
      availableCopies: 3,
    });
  });

  it('should delete a book with a valid ID', async () => {
    const res = await request(app).delete(`/api/books/${book._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Book deleted successfully');

    const deletedBook = await Book.findById(book._id);
    expect(deletedBook).toBeNull();
  });

  it('should return 404 if book does not exist', async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    const res = await request(app).delete(`/api/books/${nonExistentId}`);
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error');
  });
});

