const express = require('express');
const bookRoutes = require('./routes/bookListRoutes.js');

const app = express();
app.use(express.json());

// Routes
app.use("/api/books", bookRoutes);


module.exports = app;