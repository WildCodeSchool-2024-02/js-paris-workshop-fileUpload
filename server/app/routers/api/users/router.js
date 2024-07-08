const express = require("express");

const router = express.Router();

/* ************************************************************************* */
// Define Your API Routes Here
/* ************************************************************************* */

// Import item-related actions
const {addSkill, edit} = require("../../../controllers/userActions");
const { isAuth } = require("../../../services/auth");
const fileUpload = require("../../../services/fileUpload");

router.post("/skills", isAuth, addSkill);
router.put("/", isAuth, fileUpload.single("avatar"), edit);

/* ************************************************************************* */

module.exports = router;
