const express = require('express');
const router = express.Router();
const mapQueries = require('../lib/maps_query');

// GET /maps/
router.get('/', (req, res) => {
  mapQueries.getMaps()
    .then((maps) => {
      res.json({ maps });
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
});

// GET /maps/:map_id
router.get('/:map_id', (req, res) => {
  mapQueries.getMapById(req.params.product_id)
    .then((map) => {
      res.json({ map });
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
});

module.exports = router;
