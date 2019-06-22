const mongoose = require('mongoose');

const clienteSchema = mongoose.Schema({
  id: Number,
  nombre: String,
  documento: Number
});

module.exports= mongoose.model('clientes', clienteSchema, 'cliente');
