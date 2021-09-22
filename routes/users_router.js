const express = require('express');
const router = express.Router();
const userQueries = require('../lib/users_query');
const mapQueries = require('../lib/maps_query');
const favQueries = require('../lib/favourites_query');

// GET /profile/:username
// router.get('/:username', (req, res) => {
//   userQueries.getUserByUsername(req.params.username)
//     .then((user) => {
//       res.json({ user });
//     })
//     .catch(err => {
//       res
//         .status(500)
//         .json({ error: err.message });
//     });
// });

// GET /profile/:username
router.get('/:username', (req, res) => {
  const templateVars = {};
  // req.session.user_id = req.params.user_id;
  userQueries.getUserByUsername(req.params.username)
    .then((user) => {
      templateVars.user = user;
      templateVars.sessionId = req.session.user_id
      return mapQueries.getMaps()
    }).then((maps) => {
      templateVars.maps = maps;
      return favQueries.getFavourites()
    }).then((fav) => {
      templateVars.favourites = fav;
      // console.log("sessionId:", templateVars.sessionId)
      // console.log("favvvvv:", templateVars.favourites)
      res.render('profile_show', templateVars)
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
});

module.exports = router;
