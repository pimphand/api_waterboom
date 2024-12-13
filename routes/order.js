const express = require("express");
const orderController = require("../controllers/order.controller");
const authCheckMiddleware = require("../middleware/authentication");

const router = express.Router();

router.post("/", authCheckMiddleware.authCheck, orderController.save);
router.get("/", orderController.index);
// router.get("/:id",orderController.show);
router.put("/:id", authCheckMiddleware.authCheck, orderController.update);
// router.delete("/:id",authCheckMiddleware.authCheck, orderController.destroy);

module.exports = router;
