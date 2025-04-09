const express = require("express");
const { getBooks, getCategories } = require("../controllers/bookController.js");

const router = express.Router();

router.get("/", getBooks);
router.get("/categories", getCategories);

module.exports = router;
