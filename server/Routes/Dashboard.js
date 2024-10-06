const express = require("express");
const router = express.Router();
const { fetchuser } = require("../middleware/fetchuser");

router.post("/dashboard", fetchuser, async (req, res) => {
  console.log("dashboard data")
  const id = req.user.id;
  console.log(id);
  res.send({id:id})
});
module.exports = router;
