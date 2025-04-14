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

// Update an existing book
exports.updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Find the book by ID and update it
    const updatedBook = await Book.findByIdAndUpdate(id, updates, { new: true });

    if (!updatedBook) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.status(200).json(updatedBook);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete an existing book
exports.deleteBook = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the book by ID and delete it
    const deletedBook = await Book.findByIdAndDelete(id);

    if (!deletedBook) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.status(200).json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
