const express = require("express");
const router = express.Router();
const favQueries = require("../lib/favourites_query");

// GET /favourites/
router.get("/", (req, res) => {
  favQueries
    .getFavourites()
    .then((favourites) => {
      res.json({ favourites });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

// GET /favourite/:favourite_id
router.get("/:favourite_id", (req, res) => {
  favQueries
    .getfavouriteById(req.params.favourite_id)
    .then((favourite) => {
      res.json({ favourites });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

// POST /:favourite_id/delete
router.post("/:favourite_id/delete", (req, res) => {
  const userName = req.session.username;
  favQueries.removeFavouriteById(req.params.favourite_id)
    .then(dbres => {
      res.redirect(`/profile/${userName}`);

    })
})
router.post('/:map_id/add', (req, res) => {
  const userID = req.session.user_id;
  favQueries.addFavourite(req.params.map_id, userID)
    .then(dbres => {
      res.redirect(`/featured/`);
    })
})

module.exports = router;
