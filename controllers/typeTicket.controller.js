const validator = require("fastest-validator");
const models = require("../models");

const save = (req, res) => {
  const ticket = {
    name: req.body.name,
    price: req.body.price,
    description: req.body.description,
  };

  const schema = {
    name: { type: "string", required: false, max: "65" },
    description: { type: "string", optional: true, max: "200" },
    price: { type: "number", optional: false },
  };

  const validate = new validator();
  const validationResponse = validate.validate(ticket, schema);

  if (validationResponse !== true) {
    return res.status(400).json({
      message: "Validation failed",
      error: validationResponse,
    });
  }

  models.TicketType.create(ticket)
    .then((result) => {
      res.status(201).json({
        message: "Tipe Tiket Berhasil dibuat",
        post: result,
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Terjadi Kesalahan",
        error: error,
      });
    });
};

function index(req, res) {
  // Get the first and last date of the current month using moment.js
  const startParam = req.query.start;
  models.TicketType.findAll()
    .then((result) => {
      if (result && result.length > 0) {
        res.status(200).json({
          message: "Tipe Tiket ditemukan",
          data: result,
        });
      } else {
        res.status(404).json({
          message: "Agenda not found!",
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Something went wrong!",
        error: error.message,
      });
    });
}

function update(req, res) {
  const id = req.params.id;

  const ticket = {
    name: req.body.name,
    price: req.body.price,
    description: req.body.description,
  };

  const schema = {
    name: { type: "string", required: false, max: "65" },
    description: { type: "string", optional: true, max: "200" },
    price: { type: "number", optional: false },
  };

  const validate = new validator();
  const validationResponse = validate.validate(ticket, schema);

  if (validationResponse !== true) {
    return res.status(400).json({
      message: "Validation failed",
      error: validationResponse,
    });
  }

  models.TicketType.findByPk(id)
    .then((result) => {
      if (result) {
        models.TicketType.update(ticket, { where: { id: id } }).then(
          (result) => {
            return res.status(200).json({
              message: "Agenda updated successfully",
            });
          }
        );
      } else {
        res.status(404).json({
          message: "Tipe Tiket tidak ditemukan",
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Terjadi Kesalahan",
      });
    });
}

function destroy(req, res) {
  const id = req.params.id;

  models.TicketType.destroy({ where: { id: id } })
    .then((result) => {
      if (result) {
        res.status(200).json({
          message: "Tipe Tiket Berhasil dihapus",
        });
      } else {
        res.status(404).json({
          message: "Tipe Tiket tidak ditemukan",
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Something wrong",
        error: error,
      });
    });
}

module.exports = {
  save: save,
  index: index,
  update: update,
  destroy: destroy,
};
