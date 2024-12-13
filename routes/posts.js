const express = require('express');
const postsController = require('../controllers/post.controller');
const authCheckMiddleware = require('../middleware/authentication');

const router = express.Router();

router.post("/", authCheckMiddleware.authCheck, postsController.save);
router.get("/",authCheckMiddleware.authCheck,postsController.index);
router.get("/:id",authCheckMiddleware.authCheck,postsController.show);
router.patch("/:id", authCheckMiddleware.authCheck, postsController.update);
router.delete("/:id", authCheckMiddleware.authCheck, postsController.destroy);

module.exports = router;