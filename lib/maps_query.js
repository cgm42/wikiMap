const db = require("./db");

const getMaps = () => {
  return db.query("SELECT * FROM maps;").then((data) => {
    return data.rows;
  });
};

const getMapById = (id) => {
  return db.query("SELECT * FROM maps WHERE id = $1", [id]).then((data) => {
    return data.rows[0];
  });
};

const removeMapById = (id) => {
  return db
    .query(
      `DELETE FROM maps
  WHERE id = $1;`,
      [id]
    )
    .then((data) => {
      return data.rows[0];
    });
};

const saveMap = (
  creator_id,
  title,
  description,
  longitude,
  latitude,
  isPublic,
  zoom_level
) => {
  return db
    .query(
      `INSERT INTO maps (creator_id, title, description,
                        longitude, latitude, isPublic, zoom_level)
                        VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [
        creator_id,
        title,
        description,
        longitude,
        latitude,
        isPublic,
        zoom_level,
      ]
    )
    .then((data) => {
      return data.rows[0];
    });
};

module.exports = {
  getMaps,
  getMapById,
  removeMapById,
  saveMap,
};