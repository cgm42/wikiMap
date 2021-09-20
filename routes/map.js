const express = require("express");
const router = express.Router();

module.exports = (db) => {
  router.post("/", (req, res) => {
    const creator_id = req.session.user_id;
    const title = req.body.title;
    const latitude = req.body.lat;
    const longitude = req.body.lng;
    const zoom_level = req.body.zoom;
    const description = req.body.desc;
    const isPublic = req.body.isPublic;

    db.query(
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
      })
      .then((row) => {
        res.send(row);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  return router;
};
