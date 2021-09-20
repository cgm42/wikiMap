const express = require("express");
const router = express.Router();

module.exports = (db) => {
  router.post("/", (req, res) => {
    const creator_id = req.session.user_id;
    db.query(
      `INSERT INTO maps (creator_id, title, description,
                        longitude, latitude, isPublic, created_on, zoom_level)
                        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [req.params.username] //TODO:
    )
      .then((row) => {
        req.session.user_id = row.id;
        res.redirect("/");
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  return router;
};
