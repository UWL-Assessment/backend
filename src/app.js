const express = require('express');
const bookRoutes = require('./routes/bookRoutes.js');

const app = express();
app.use(express.json());

// Routes
app.use("/api/books", bookRoutes);


module.exports = app;