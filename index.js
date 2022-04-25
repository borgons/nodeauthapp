const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dbConfig = require('./config/db.config');

const auth = require('./middlewares/auth');
const errors = require('./middlewares/errors');
const unless = require('express-unless');
const dotenv = require('dotenv');

//mongoose
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URI, {
   useNewUrlParser: true,
   useUnifiedTopology: true,
}).then( () => {
   console.log('Database connected');
},
(error) => {
   console.log('Database can\'t be connected: ' + error);
});

// middleware for authenticating token submitted with requests

auth.authenticateToken.unless = unless;

app.use(
   auth.authenticateToken.unless({
      path: [
         {  url: "/users/login", methods: ["POST"] },
         {  url: "/users/register", methods: ["POST"] },
      ],
   })
);

dotenv.config();

app.use(express.json());

// initialize routes
app.use('/users', require('./routes/users.routes'));

// middleware for error responses
app.use(errors.errorHandler);

// listen for requests
app.listen(process.env.PORT || 4000, function () {
   console.log('Running on port');
})