function editedLocationData(body) {
  return {
    latitude: body[0].lat,
    longitude: body[0].lon,
    formatted_query: body[0].display_name
  };
}

function editedWeatherData(body) {
  const oneWeek = body.slice(0, 7);
  const result = oneWeek.map(entry => {
    const container = {};
    let options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
    container['forecast'] = entry.weather.description;
    container['time'] = new Date(entry.datetime).toLocaleString('en-US', options); 
    return container;
  });
  return result;
}

function editedYelpData(body) {
  return body.map(entry => {
    const container = {};
    container['name'] = entry.name;
    container['image_url'] = entry.image_url;
    container['price'] = entry.price;
    container['rating'] = entry.rating;
    container['url'] = entry.url;
    return container;
  });
}

function editedTrailsData(body) {
  return body.map(entry => {
    const container = {};
    const cleanSummary = decodeURI(entry.desc);
    container['name'] = entry.name;
    container['location'] = entry.city;
    container['length'] = entry.distance;
    container['stars'] = entry.rating;
    container['star_votes'] = entry.ratings;
    container['summary'] = cleanSummary;
    container['trail_url'] = entry.url;
    return container;
  });
}


module.exports = {
  editedLocationData,
  editedWeatherData,
  editedYelpData,
  editedTrailsData
};
