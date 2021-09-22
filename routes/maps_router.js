const express = require("express");
const router = express.Router();
const mapQueries = require("../lib/maps_query");

// GET /maps/
router.get("/", (req, res) => {
  mapQueries
    .getMaps()
    .then((maps) => {
      res.json({ maps });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

// GET /maps/:map_id
router.get("/:map_id", (req, res) => {
  mapQueries
    .getMapById(req.params.product_id)
    .then((map) => {
      res.json({ map });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

// POST /:map_id/delete
router.post("/:map_id/delete", (req, res) => {
  const userID = req.session.user_id;
  mapQueries.removeMapById(req.params.map_id).then((dbres) => {
    res.redirect(`/profile/${userID}`);
  });
});

// POST /
router.post("/", (req, res) => {
  const creator_id = req.session.user_id;
  const title = req.body.title;
  const latitude = req.body.lat;
  const longitude = req.body.lng;
  const zoom_level = req.body.zoom;
  const description = req.body.desc;
  const isPublic = req.body.isPublic;

  mapQueries
    .saveMap(
      creator_id,
      title,
      description,
      longitude,
      latitude,
      isPublic,
      zoom_level
    )
    .then((row) => {
      res.send(row);
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

module.exports = router;
