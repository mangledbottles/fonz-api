'use strict';
const axios = require('axios').default;
const _ = require('lodash');

exports.searchSong = (term, limit, offset) => {
    return new Promise((resolve, reject) => {
      axios.get('https://cdn.shazam.com/search/v4/en/IE/iphone/search?types=songs,artists', {
        params: {
          term, limit, offset
        }
      })
      .then((resp) => {
        let output = [];
        _.forEach(resp.data.tracks.hits, (o) => {
          let { key, title, artist: subtitle } = o.track;
          let providers = o.track.hub.providers;
          output.push({ key, title, subtitle, providers });
        });
        resolve(output)
      })
      .catch((err) => {
        reject(err);
      });
    });
}
