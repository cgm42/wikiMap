const express = require('express');
const router = express.Router();
const favQueries = require('../lib/favourites_query');

// GET /favourites/
router.get('/', (req, res) => {
  favQueries.getFavourites()
    .then((favourites) => {
      res.json({ favourites });
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
});

// GET /favourite/:favourite_id
router.get('/:favourite_id', (req, res) => {
  favQueries.getfavouriteById(req.params.product_id)
    .then((favourite) => {
      res.json({ favourites });
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
});

// POST /:favourite_id/delete
router.post('/:favourite_id/delete', (req, res) => {
  const userID = req.session.user_id;
  favQueries.removeFavouriteById(req.params.favourite_id)
    .then(dbres => {
      res.redirect(`/profile/${userID}`);

    })
})
router.post('/:map_id/add', (req, res) => {
  const userID = req.session.user_id;
  console.log("🚀 ~ file: favourites_router.js ~ line 43 ~ router.post ~ userID", userID)
  const mapId = req.params.map_id;
  console.log("🚀 ~ file: favourites_router.js ~ line 45 ~ router.post ~ mapId", mapId)
  favQueries.addFavourite(req.params.map_id, userID)
    .then(dbres => {
      res.redirect(`/featured/`);
    })
})


module.exports = router;
