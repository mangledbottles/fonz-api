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

User.isValidSession = (result, sid, email, service) => {
  sql.query(`SELECT * FROM authentication WHERE
    sid = '${sid}' AND email = '${email}' AND service = '${service}' LIMIT 1 `,
    (err, resp) => {
      if(err) return result(err, null, null, null);
      result(null, (resp.length == 1 &&  resp[0].active == 1), resp[0].access_token, resp[0].refresh_token);
    });
}

User.getAccessAndRefreshToken = (result, sid) => {
  sql.query(`SELECT access_token, refresh_token FROM authentication WHERE sid = '${sid}' `,
  (err, resp) => {
      if(err) return result(err, null);
      const { access_token, refresh_token } = resp[0];
      result(null, resp[0]);
    })
}

module.exports = User;
