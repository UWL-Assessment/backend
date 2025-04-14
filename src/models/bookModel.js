const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    authors: { type: String, required: true },
    isbn: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String },
    thumbnail: { type: String },
    publishedDate: { type: Date, required: true },
    publisher: { type: String, required: true },
    availableCopies: { type: Number, required: true, min: 0 },
    reservedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true, strict: false }
);

const Book = mongoose.model("books", bookSchema);

module.exports = Book;
