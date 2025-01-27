import mongoose from 'mongoose';

const ClienteSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'Nome é obrigatório'],
    trim: true
  },
  cidade: {
    type: String,
    required: [true, 'Cidade é obrigatória'],
    trim: true
  },
  bairro: {
    type: String,
    required: [true, 'Bairro é obrigatório'],
    trim: true
  },
  rua: {
    type: String,
    required: [true, 'Rua é obrigatória'],
    trim: true
  },
  numero: {
    type: String,
    required: [true, 'Número é obrigatório'],
    trim: true
  },
  telefone: {
    type: String,
    required: [true, 'Telefone é obrigatório'],
    trim: true
  },
  cnpj: {
    type: String,
    required: [true, 'CNPJ é obrigatório'],
    unique: true,
    trim: true
  },
  beneficios: {
    type: [String],
    required: [true, 'Benefícios são obrigatórios'],
    validate: {
      validator: function(v: string[]) {
        return v.length === 3;
      },
      message: 'Devem ser selecionados exatamente 3 benefícios'
    }
  },
  dataCadastro: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.Cliente || mongoose.model('Cliente', ClienteSchema); 