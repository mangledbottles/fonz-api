var express = require('express');
var router = express.Router();
var SpotifyWebApi = require('spotify-web-api-node');

router.get('/spotify', function(req, res, next) {
  // var access_token = 'BQDje2p0FZciM9GpS1bOIr43yRnh7JOUaWs3MfidakNHEJuuM_fEUPBFN1RSWvgPgRzfK7doCv_NapIpecIRd8kJcqpyU6_1D-uaNuNDZia95S-RUPgY42tHl-2wt02r2IxBMA8y66chm-zF0jQLYQou1_hm5gZUy2o&refresh_token=AQAFNWFJ9PNI4ybqmVGB4gAMjQD9kZSNo8Sx8JeMwfqUjIefGgLA5w6sTmUKW7nOMc2K3nDWcrNXR3F5jVJKUtg0nLT_ri2x7Y34GpMeXK2lQ_O4WEjySn8QshadyCX_GJE';
  var access_token = 'BQBAYrCUTRcIxzwngFlcV8V5zKh9X3bzDXpF_kGQ9tXiEob0DVh9ewHgW7DJhMoZAJVskmfNcTgX7hXps4piIXcvDyZvDQpZ4aGtUmVjbIAnAyLgXO9YA7ASzWJMfUoS-sAfNuUvEtsifxtH4ktcZwb0gWTUXCvKjGg&refresh_token=AQCSx8gyF9-R4iGXgkq6q9GiTeQyoEs38pZLWwYgroPyLMdDhrCVhi_YWLyThs0qTS27UP5XnFC1nGj3Bm3kIJspjksIT8JWT9nALWrSCQl1wtzHjgDi6XOft8bJWD3S9kM';
  // var access_token = 'AQDTU8rrcLiHADyb5xLvlcI0Pj2Vj4ricoFQHBTwwARlWWdWm6ku3EJE9atOPR3W4tBv7OzdyvPO831ONmkpzDbbOs9EKsNvX-mMiutHb_f24xBJBgtUbEAukQ60VHFErZe6NOauaH2HU-RupxkVAjFnUZgRdur34FA2WwEiqDVzogX4kOtPpCJLqqsiXbkJyeWiarxNPaKvokjbUpmIk1ifwHCc0uDPHlBlE1iZ';
  var spotifyApi = new SpotifyWebApi();
  spotifyApi.setAccessToken(access_token);
  // Get the authenticated user
  spotifyApi.getMe()
    .then(function(data) {
      res.json(data.body)
      console.log('Some information about the authenticated user', data.body);
    }, function(err) {
      console.log('Something went wrong!', err);
  });
});

router.get('/spotify/current', function(req, res, next) {
  // var access_token = 'BQBAYrCUTRcIxzwngFlcV8V5zKh9X3bzDXpF_kGQ9tXiEob0DVh9ewHgW7DJhMoZAJVskmfNcTgX7hXps4piIXcvDyZvDQpZ4aGtUmVjbIAnAyLgXO9YA7ASzWJMfUoS-sAfNuUvEtsifxtH4ktcZwb0gWTUXCvKjGg&refresh_token=AQCSx8gyF9-R4iGXgkq6q9GiTeQyoEs38pZLWwYgroPyLMdDhrCVhi_YWLyThs0qTS27UP5XnFC1nGj3Bm3kIJspjksIT8JWT9nALWrSCQl1wtzHjgDi6XOft8bJWD3S9kM';
  var access_token = 'BQB7JTvPQBfXNK0Ewz_0NrRn3ha71E9AlBIyWpRA1ELa8n4SCJs64fnyUkMcdpKv9vgAKbbEEa2cCAut6GN6hPbNv_3ydNyQk-SYJJsBG0LuD21KS6GGkqHR3sHlqZv4YxoWEoFPZD-waOR66jXcZ0KisZHJQuUSyg04QtIuQ-k_S20JgHmIPTeLMs4';
  var spotifyApi = new SpotifyWebApi();
  spotifyApi.setAccessToken(access_token);
  // Get information about current playing song for signed in user
  spotifyApi.getMyCurrentPlaybackState().then(function(data) {
      // Output items
      res.json(data.body)
      console.log("Now Playing: ",data.body);
    }, function(err) {
      console.log('Something went wrong! getMyCurrentPlaybackState', err);
    });
});

module.exports = router;
