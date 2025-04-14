const express = require("express");
const { getBooks, getCategories, createBook, updateBook, deleteBook, reserveBook } = require("../controllers/bookController.js");

const router = express.Router();

router.route("/").get(getBooks).post(createBook);
router.route("/:id").put(updateBook).delete(deleteBook);
router.get("/categories", getCategories);
router.post('/:id/reserve', reserveBook);

module.exports = router;
