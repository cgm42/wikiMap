const express = require('express');
const router = express.Router();
const userQueries = require('../lib/users_query');
const mapQueries = require('../lib/maps_query');

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

// GET /profile/:user_id
router.get('/:user_id', (req, res) => {
  const templateVars = {};
  req.session.user_id = req.params.user_id;
  userQueries.getUserById(req.params.user_id)
    .then((user) => {
      templateVars.user = user
      return mapQueries.getMaps()
    }).then((maps) => {
      templateVars.maps = maps
      res.render('profile_show', templateVars)
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
});

module.exports = router;
