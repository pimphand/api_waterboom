const express = require('express');
const agendaController = require('../controllers/agenda.controller');
const authCheckMiddleware = require('../middleware/authentication');

const router = express.Router();

router.post("/",authCheckMiddleware.authCheck,  agendaController.save);
router.get("/",agendaController.index);
// router.get("/:id",agendaController.show);
router.put("/:id",authCheckMiddleware.authCheck, agendaController.update);
// router.delete("/:id",authCheckMiddleware.authCheck, agendaController.destroy);

module.exports = router;