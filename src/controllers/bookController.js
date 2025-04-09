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
