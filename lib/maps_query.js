const db = require('./db');

const getMaps = () => {
  return db.query('SELECT * FROM maps;')
    .then((data) => {
      return data.rows;
    });
};

const getMapById = (id) => {
  return db.query('SELECT * FROM maps WHERE id = $1', [id])
    .then((data) => {
      return data.rows[0];
    });
};

const removeMapById = (id) => {
  return db.query(`DELETE FROM maps
  WHERE id = $1;`, [id])
    .then((data) => {
      return data.rows[0];
    })
}

module.exports = {
  getMaps,
  getMapById,
  removeMapById
};
