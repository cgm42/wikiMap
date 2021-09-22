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

// GET /api/maps/:map_id
// router.get("api/:map_id", (req, res) => {
//   mapQueries
//     .getMapById(req.params.map_id)
//     .then((map) => {
//       res.json({ map });
//     })
//     .catch((err) => {
//       res.status(500).json({ error: err.message });
//     });
// });

// GET /maps/:map_id
router.get("/:map_id", (req, res) => {
  mapQueries
    .getMapById(req.params.map_id)
    .then((map) => {
      if (req.session.user_id == map.creator_id) {
        res.render("edit", map);
      } else {
        res.render("view", map);
      }
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

router.put("/:map_id", (req, res) => {
  const title = req.body.title;
  const latitude = req.body.lat;
  const longitude = req.body.lng;
  const zoom_level = req.body.zoom;
  const description = req.body.desc;
  const isPublic = req.body.isPublic;
  const map_id = req.params.map_id;

  mapQueries
    .updateMap(
      title,
      description,
      longitude,
      latitude,
      isPublic,
      zoom_level,
      map_id
    )
    .then((row) => {
      res.status(200).send(row);
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});
module.exports = router;
