const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');
const session = require('express-session')

//const uri = 'mongodb+srv://softwareEng:softwareEng@cluster0.h1p6g.mongodb.net/soft?retryWrites=true&w=majority';

const { MongoClient, ServerApiVersion } = require('mongodb');
const options = { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 }

const uri = "mongodb+srv://softwareEng:softwareEng@cluster0.h1p6g.mongodb.net/petroldb?retryWrites=true&w=majority";


//require('dotenv').config({ path: './sample.env' });


//mongoose.connect(uri, options);
mongoose.connect(uri);

mongoose.connection.on('connected', () => {
   console.log('Connected to database' + config.database);
});

mongoose.connection.on('error', (err) => {
    console.log('Database error: ' + err.database);
});

//mongoose.connect();

const app = express();

const users = require('./routes/users')

//Port Number
const port = process.env.PORT || 8080;
console.log('port '+ port);
//CORS Middleware
app.use(cors());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));
// Body Parser Middleware
app.use(bodyParser.json());

// Passport Middleware

app.use(session({
    secret: config.secret,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
  }))
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

app.use('/users', users);

app.get('/', (req, res) => {
    res.send('invaild endpoint');
  });
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
  });
  
  // Start Server
  app.listen(port, () => {
    console.log('Server started on port '+port);
  });

  