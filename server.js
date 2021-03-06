const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const path = require('path');

const app = express();

// Define routes
const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');
const auth = require('./routes/api/auth');

// Body Parser Middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.json({extended: false}));

// DB Config
//const db = require('./config/keys').mongoURI;

// option 2 for connection
const connectDB = require('./config/db');
connectDB();

// Connect to MongoDB
/* mongoose
    .connect(db)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err)); */

// Passport Middleware
app.use(passport.initialize());

// Passport Config
require('./config/passport')(passport);

// Use routes
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);
app.use('/api/auth', auth);

// Server static assets if in production
if (process.env.NODE_ENV === 'production') {
    // Set static folder
    app.use(express.static('client/build'));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
