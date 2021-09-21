const db = require('./db');

const getFavourites = () => {
  return db.query(`
  SELECT *
  FROM favourites
  JOIN maps ON maps.id = map_id
  ;`)
    .then((data) => {
      return data.rows;
    });
};

const getFavouritesById = (id) => {
  return db.query(`SELECT * FROM favourites WHERE id = $1`, [id])
    .then((data) => {
      return data.rows[0];
    });
};

module.exports = {
  getFavourites,
  getFavouritesById
};
