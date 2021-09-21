const db = require('./db');

const getUserByUsername = (username) => {
  return db.query('SELECT * FROM users WHERE user_name = $1;', [username])
    .then((data) => {
      console.log(data.rows[0])
      return data.rows[0];
    });
};

const getUserById = (id) => {

  return db.query('SELECT * FROM users WHERE id = $1', [id])
    .then((data) => {
      return data.rows[0];
    });
};


module.exports = {
  getUserByUsername,
  getUserById
};
