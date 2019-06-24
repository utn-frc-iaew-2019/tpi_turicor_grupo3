const mongoose = require('mongoose');

const clienteSchema = mongoose.Schema({
  id: Number,
  nombre: String,
  apellido: String,
  documento: Number
});

module.exports= mongoose.model('clientes', clienteSchema, 'cliente');
