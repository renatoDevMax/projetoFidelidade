import mongoose from 'mongoose';

const CompraSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'Nome do cliente é obrigatório'],
    trim: true
  },
  cnpj: {
    type: String,
    required: [true, 'CNPJ do cliente é obrigatório'],
    trim: true
  },
  dataCompra: {
    type: Date,
    required: [true, 'Data da compra é obrigatória'],
    default: Date.now
  },
  valor: {
    type: Number,
    required: [true, 'Valor da compra é obrigatório']
  }
});

export default mongoose.models.Compra || mongoose.model('Compra', CompraSchema, 'compraFidelidade'); 