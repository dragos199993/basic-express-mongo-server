require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const passport = require('passport');
const mongoose = require('mongoose');
const port = process.env.PORT || 5000;

// Routes
const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');

// DB connect
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true })

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(passport.initialize());

require('./config/passport.js')(passport);

app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);


app.get('/', (req, res) => {
    res.send("it is working");
});

app.listen(port, () => console.log(`Server is running at ${port}...`));