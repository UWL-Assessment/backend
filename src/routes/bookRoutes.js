const express = require("express");
const { getBooks, getCategories, createBook } = require("../controllers/bookController.js");

const router = express.Router();

router.route("/").get(getBooks).post(createBook);
router.get("/categories", getCategories);


module.exports = router;
