const express = require("express");
const router = express.Router();

module.exports = (db) => {
  router.get("/:username", (req, res) => {
    // Query DB to see if username exists
    // If not exist, create the user
    // Assign current session to this user and return
    db.query(`SELECT * FROM users WHERE user_name=$1`, [req.params.username])
      .then((data) => {
        if (data.rows.length === 0) {
          return db
            .query(
              "INSERT INTO users (user_name, password, avatar_url) VALUES ($1, $2, $3) RETURNING *",
              [
                req.params.username,
                "password",
                "https://robohash.org/etconsecteturalias.png?size=50x50&set=set1",
              ]
            )
            .then((result) => result.rows[0]);
        }
        return data.rows[0];
      })
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
