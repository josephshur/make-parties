const Handlebars = require('handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');

// Initialize express
const express = require('express');
const methodOverride = require('method-override');
const app = express();

// INITIALIZE BODY-PARSER AND ADD IT TO APP
const bodyParser = require('body-parser');

// require handlebars
const exphbs = require('express-handlebars');
const jwtExpress = require('express-jwt');
const jwt = require('jsonwebtoken');

const models = require('./db/models');
const cookieParser = require('cookie-parser');

// override with POST having ?_method=DELETE or ?_method=PUT
app.use(methodOverride('_method'))

// Use "main" as our default layout
app.engine('handlebars', exphbs({ defaultLayout: 'main', handlebars: allowInsecurePrototypeAccess(Handlebars) }));
// Use handlebars to render
app.set('view engine', 'handlebars');

// The following line must appear AFTER const app = express() and before your routes!
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());

// // OUR MOCK ARRAY OF PROJECTS
// var events = [
//   { title: "I am your first event", desc: "A great event that is super fun to look at and good", imgUrl: "https://img.purch.com/w/660/aHR0cDovL3d3dy5saXZlc2NpZW5jZS5jb20vaW1hZ2VzL2kvMDAwLzA4OC85MTEvb3JpZ2luYWwvZ29sZGVuLXJldHJpZXZlci1wdXBweS5qcGVn" },
//   { title: "I am your second event", desc: "A great event that is super fun to look at and good", imgUrl: "https://img.purch.com/w/660/aHR0cDovL3d3dy5saXZlc2NpZW5jZS5jb20vaW1hZ2VzL2kvMDAwLzA4OC85MTEvb3JpZ2luYWwvZ29sZGVuLXJldHJpZXZlci1wdXBweS5qcGVn" },
//   { title: "I am your third event", desc: "A great event that is super fun to look at and good", imgUrl: "https://img.purch.com/w/660/aHR0cDovL3d3dy5saXZlc2NpZW5jZS5jb20vaW1hZ2VzL2kvMDAwLzA4OC85MTEvb3JpZ2luYWwvZ29sZGVuLXJldHJpZXZlci1wdXBweS5qcGVn" }
// ]

// app.use(function (req, res, next) {
//   jwtExpress({
//     secret: "AUTH-SECRET",
//     algorithms: ['HS256'],
//     credentialsRequired: true,
//     getToken: function fromHeaderOrQuerystring (req) {
//       if (req.cookies.mpJWT) {
//         return req.cookies.mpJWT;
//       }
//       return null;
//     }
//   }).unless({ path: ['/login', '/sign-up'] })
//   next();
// });

app.use(function authenticateToken(req, res, next) {
  // Gather the jwt access token from the request header
  // const authHeader = req.headers['authorization']
  // const token = authHeader && authHeader.split(' ')[1]
  const token = req.cookies.mpJWT;
  // if (token == null) return res.sendStatus(401) // if there isn't any token

  if (token) {
    jwt.verify(token, "AUTH-SECRET", (err, user) => {
      console.log(err)
      if (err) res.redirect('/');
      req.user = user
      next() // pass the execution off to whatever request the client intended
    })
  } else {
    next()
  }
});

app.use(function (req, res, next) {
  console.log("lookingUpUser:", req.user);
  // if a valid JWT token is present
  if (req.user) {
    // Look up the user's record
    console.log("Req.User:", req.user);
    models.User.findByPk(req.user.id).then(currentUser => {
      console.log("currentUser:", currentUser);
      // make the user object available in all controllers and templates
      res.locals.currentUser = currentUser;
      next();
    }).catch(err => {
      console.log(err);
    })
  } else {
    next();
  }
});

require('./controllers/auth')(app, models);
require('./controllers/events')(app, models);
require('./controllers/rsvps')(app, models);

// Choose a port to listen on
const port = process.env.PORT || 3000;

// Tell the app what port to listen on
app.listen(port, () => {
  console.log('App listening on port 3000!')
})
