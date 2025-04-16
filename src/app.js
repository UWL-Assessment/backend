const express = require('express');
const cors = require('cors');
const bookRoutes = require('./routes/bookRoutes.js');

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

// Routes
app.use("/api/books", bookRoutes);


module.exports = app;