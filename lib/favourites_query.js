const db = require("./db");

const getFavourites = () => {
  return db
    .query(
      `
  SELECT favourites.id as id, favourites.map_id as map_id, maps.title as title, maps.description as description
  FROM favourites
  JOIN maps ON maps.id = map_id
  ORDER BY id DESC
  ;`
    )
    .then((data) => {
      return data.rows;
    });
};

const getFavouriteById = (id) => {
  return db
    .query(`SELECT * FROM favourites WHERE id = $1`, [id])
    .then((data) => {
      return data.rows[0];
    });
};

const removeFavouriteById = (id) => {
  return db
    .query(
      `DELETE FROM favourites
  WHERE id = $1;`,
      [id]
    )
    .then((data) => {
      return data.rows[0];
    })
    .catch((err) => console.log(err.stack));
};

const addFavourite = (map_id, user_id) => {
  const queryParams = [map_id, user_id];
  const queryString = `
  INSERT INTO favourites (map_id, user_id)
  VALUES ($1, $2)
  RETURNING *;
  `
  return db.query(queryString, queryParams)
    .then(res => res.rows[0])
    .catch(err => console.log(err.stack));
};

module.exports = {
  getFavourites,
  getFavouriteById,
  removeFavouriteById,
  addFavourite
};
