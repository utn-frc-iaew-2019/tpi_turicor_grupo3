const mongoose = require('mongoose');

const reservaSchema = mongoose.Schema({
  codigoReserva: String,
  fechaReserva: String,
  idCliente: Number,
  costo: Number,
  precioVenta: Number
});

module.exports= mongoose.model('reservas', reservaSchema);
