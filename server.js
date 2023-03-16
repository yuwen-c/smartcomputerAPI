const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');
const { port, KNEX_CONFIGURATION } = require('./config');

const db = knex(KNEX_CONFIGURATION);

const app = express();

// middlewear to decode req.body
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// test if server works
app.get('/', (req, res) => {
  res.json('connecting to server');
  // console.log('console: connecting!!');
});

// user signin with data in body
app.post('/signin', (req, res) => signin.handleSignin(req, res, db, bcrypt));

// new user sign up with data in body
// add data to 2 tables: login and users,
// store hash in login
// also, use transaction to make sure that the data will add to 2 tables at one time
app.post('/register', (req, res) =>
  register.handleRegister(req, res, db, bcrypt)
);

// get user profile through id
app.get('/profile/:id', (req, res) => profile.handleProfileGet(req, res, db));

// send url from front to back end, and make clarifai api request to get face-recog data
app.post('/imageUrl', image.handleApiCall);

// every time when user send an url, increase the entries.
app.put('/image', image.handleImage(db));

// app.listen(process.env.PORT || 3000, ()=> {
//     console.log(`it's running on port ${process.env.PORT}!`);
// })

app.listen(port || 3000, () => {
  console.log(`it's running on port ${port} based on the dotenv!`);
});
