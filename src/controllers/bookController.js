const Book = require("../models/bookModel.js");

// Fetch all books with optional category filtering
exports.getBooks = async (req, res) => {
  try {
    const filter = {};
    if (req.query.category) {
      filter.category = req.query.category; // Filter by category
    }

    const page = parseInt(req.query.page) || 1;
    const limit = 15;
    const skip = (page - 1) * limit;

    const books = await Book.find(filter).limit(limit).skip(skip);
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Fetch all unique categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Book.distinct("category");
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new book
exports.createBook = async (req, res) => {
  try {
    const { title, authors, isbn, category, description, thumbnail, publishedDate, publisher, availableCopies } = req.body;

    // Validate required fields
    if (!title || !authors || !isbn || !category || !availableCopies) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check for unique ISBN
    const existingBook = await Book.findOne({ isbn });
    if (existingBook) {
      return res.status(400).json({ error: 'ISBN must be unique' });
    }

    // Create and save the new book
    const newBook = new Book({
      title,
      authors,
      isbn,
      category,
      description,
      thumbnail,
      publishedDate,
      publisher,
      availableCopies,
    });

    const savedBook = await newBook.save();
    res.status(201).json(savedBook);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
