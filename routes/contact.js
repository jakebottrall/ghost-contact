const express = require("express");
const router = express.Router();
const rest = require("../handlers/contact");

router.route("/contact").post(rest.contact);

module.exports = router;
