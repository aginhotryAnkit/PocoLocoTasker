// app.js
const express = require('express');
const app = express();
const path = require('path');
require('dotenv').config();
app.use(express.json());


// Set up the view engine and views directory
app.set('view engine', '.ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Define routes
const indexRouter = require('./routes/route');
app.use('/', indexRouter);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
