const db = require("./db");

const getMaps = () => {
  return db.query("SELECT * FROM maps ORDER BY maps.id DESC;").then((data) => {
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

//save a new map to db for the 1st time
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

const updateMap = (
  title,
  description,
  longitude,
  latitude,
  isPublic,
  zoom_level,
  map_id,
  basemap
) => {
  return db
    .query(
      `UPDATE maps SET title=$1, description=$2, longitude=$3, latitude=$4, isPublic=$5,
    zoom_level=$6, basemap=$8
     WHERE id=$7 RETURNING *`,
      [
        title,
        description,
        longitude,
        latitude,
        isPublic,
        zoom_level,
        map_id,
        basemap,
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
  updateMap,
};
