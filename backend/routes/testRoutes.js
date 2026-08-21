const express = require("express");
const { testDatabase } = require("../controllers/testController");

const router = express.Router();

router.get("/test-db", testDatabase);

module.exports = router;