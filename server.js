require('dotenv').config()
const express = require('express');
const app = express();

const mongoose = require('mongoose');
const port = process.env.PORT || 5000;

// Routes
const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');

// DB connect
mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true })
    .then(() => console.log("mongodb connected"))
    .catch(err => console.log(err));

app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);


app.get('/', (req,res) => {
    res.send("it is working");
});

app.listen(port, () => console.log(`Server is running at ${port}...`));