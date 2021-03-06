const express = require('express');
const cors = require('cors');
const app = express();
const morgan = require('morgan');
const ensureAuth = require('./auth/ensure-auth');
const createAuthRoutes = require('./auth/create-auth-routes');
const request = require('superagent');
const { editedLocationData, editedWeatherData, editedYelpData, editedTrailsData } = require('./utils.js');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev')); // http logging

const authRoutes = createAuthRoutes();

// setup authentication routes to give user an auth token
// creates a /auth/signin and a /auth/signup POST route. 
// each requires a POST body with a .email and a .password
app.use('/auth', authRoutes);

// everything that starts with "/api" below here requires an auth token!
app.use('/api', ensureAuth);

// and now every request that has a token in the Authorization header will have a `req.userId` property for us to see who's talking
app.get('/api/test', (req, res) => {
  res.json({
    message: `in this proctected route, we get the user's id like so: ${req.userId}`
  });
});
// dummy data get
// app.get('/reviews', async(req, res) => {
//   try {
    
//     res.json([
//       {
//         'forecast': 'Partly cloudy until afternoon.',
//         'time': 'Tuesday, June 29, 2021'
//       },
//       {
//         'forecast': 'Mostly cloudy in the morning.',
//         'time': 'Wednesday, June 30, 2021'
//       },
//     ]);
//   } catch(e) {
    
//     res.status(500).json({ error: e.message });
//   }
// });

app.get('/location', async(req, res) => {
  try {
    const city = req.query.search;
    const response = await request.get(`https://us1.locationiq.com/v1/search.php?key=${process.env.LOCATION_KEY}&q=${city}&format=json`);
    const editedRes = editedLocationData(response.body);
    res.json(editedRes);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});

app.get('/weather', async(req, res) => {
  try {
    const lat = req.query.latitude;
    const lon = req.query.longitude;
    const response = await request.get(`https://api.weatherbit.io/v2.0/forecast/daily?&lat=${lat}&lon=${lon}&key=${process.env.WEATHER_KEY}`);
    const editedRes = editedWeatherData(response.body.data);
    res.json(editedRes);
    // res.json(response.body.data);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});

app.get('/reviews', async(req, res) => {
  try {
    const lat = req.query.latitude;
    const lon = req.query.longitude;
    const response = await request.get(`https://api.yelp.com/v3/businesses/search?latitude=${lat}&longitude=${lon}`).set('Authorization', `Bearer ${process.env.YELP_KEY}`);
    const editedRes = editedYelpData(response.body.businesses);
    res.json(editedRes);
    // res.json(response.body.businesses);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});

app.get('/trails', async(req, res) => {
  try {
    const lat = req.query.latitude;
    const lon = req.query.longitude;
    const response = await request.get(`https://prescriptiontrails.org/api/filter/?by=coord&lat=${lat}&lng=${lon}&offset=0&count=2`);
    const editedRes = editedTrailsData(response.body.trails);
    res.json(editedRes);
    // res.json(response.body.trails);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});

app.use(require('./middleware/error'));

module.exports = app;
