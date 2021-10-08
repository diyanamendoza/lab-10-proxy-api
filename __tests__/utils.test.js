const { editedLocationData, editedWeatherData, editedYelpData, editedTrailsData } = require('../lib/utils.js');
const { data } = require('../data/location-raw.js');
const { weatherData } = require('../data/weather-raw.js');
const { yelpData } = require('../data/yelp-raw.js');
const { trailsData } = require('../data/trails-raw.js');

describe('utils', () => {
  // got rid of all the auth test stuff because we no longer have a database
  test('editedLocationData', async() => {
    const expectation = {
      'latitude': expect.any(String),
      'longitude': expect.any(String),
      'formatted_query': expect.any(String)
    };
    const editedData = editedLocationData(data);
    expect(editedData).toEqual(expectation);
  });

  test('editedWeatherData', async() => {
    const expectation = {
      'forecast': expect.any(String),
      'time': expect.any(String),
    };
    const editedData = editedWeatherData(weatherData);
    expect(editedData).toEqual(expect.arrayContaining([expectation]));
  });

  test('editedYelpData', async() => {
    const expectation = {
      name: expect.any(String),
      image_url: expect.any(String),
      price: expect.any(String),
      rating: expect.any(Number),
      url: expect.any(String)
    };
    const editedData = editedYelpData(yelpData);
    expect(editedData).toEqual(expect.arrayContaining([expectation]));
  });

  test('editedTrailsData', async() => {
    const expectation = {
      name: expect.any(String),
      location: expect.any(String),
      length: expect.any(Number),
      stars: expect.any(Number),
      star_votes: expect.any(Number),
      summary: expect.any(String),
      trail_url: expect.any(String)
    };
    const editedData = editedTrailsData(trailsData);
    expect(editedData).toEqual(expect.arrayContaining([expectation]));
  });
});