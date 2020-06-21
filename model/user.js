'use strict';
let sql = require('../db');

const User = () => {
  this.timestamp = new Date();
}

User.creatAuthentication = (result, service, email, access_token, refresh_token, sid, spotifyId, product) => {
  sql.query(`
    INSERT INTO authentication (email, service, access_token, refresh_token, sid, spotifyId, product)
    VALUES ('${email}', '${service}', '${access_token}', '${refresh_token}', '${sid}', ${spotifyId}, '${product}')`,
    (err, res) => {
      if(err) return (err, null);
      result(null, res);
    }
  );
}

module.exports = User;
