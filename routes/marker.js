const express = require("express");
const router = express.Router();

module.exports = (db) => {
  //get markers belong to a map
  router.get("/:mapId", (req, res) => {
    const map_id = req.params.mapId;

    db.query(`SELECT * FROM markers WHERE map_id=$1`, [map_id])
      .then((data) => {
        console.log(data.rows);
        return data.rows;
      })
      .then((rows) => {
        res.send(rows);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  router.post("/", (req, res) => {
    const map_id = req.body.mapId;
    const user_id = req.session.user_id;
    const title = req.body.title;
    const description = req.body.desc;
    const imgUrl = req.body.imgUrl;
    const longitude = req.body.lng;
    const latitude = req.body.lat;

    db.query(
      `INSERT INTO markers (map_id, user_id, title, description,
                        image_url, longitude, latitude)
                        VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [map_id, user_id, title, description, imgUrl, longitude, latitude]
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

  router.put("/:marker_id", (req, res) => {
    const title = req.body.title;
    const description = req.body.desc;
    const imgUrl = req.body.imgUrl;
    const marker_id = req.params.marker_id;
    db.query(
      `UPDATE markers SET title=$1, description=$2, image_url=$3
       WHERE id=$4`,
      [title, description, imgUrl, marker_id]
    )
      .then(() => {
        res.status(200).send("updated marker");
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  router.delete("/delete/:marker_id", (req, res) => {
    const marker_id = req.params.marker_id;
    db.query(
      `DELETE FROM markers
    WHERE id = $1;`,
      [marker_id]
    )
      .then(() => {
        res.status(200).send("deleted marker");
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  return router;
};
