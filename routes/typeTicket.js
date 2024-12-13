const express = require('express');
const typeTicketController = require('../controllers/typeTicket.controller');
const authCheckMiddleware = require('../middleware/authentication');

const router = express.Router();

router.post("/", authCheckMiddleware.authCheck, typeTicketController.save);
router.get("/",typeTicketController.index);
// router.get("/:id",typeTicketController.show);
router.put("/:id", authCheckMiddleware.authCheck, typeTicketController.update);
router.delete("/:id", authCheckMiddleware.authCheck, typeTicketController.destroy);

module.exports = router;