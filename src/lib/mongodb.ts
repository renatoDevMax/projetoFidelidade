import mongoose from 'mongoose';

declare global {
  var mongoose: MongooseCache | undefined;
}

const MONGODB_URI = process.env.MONGODB_URI || 'sua_string_de_conexao_atual';

if (!MONGODB_URI) {
  throw new Error('Por favor, defina a variável de ambiente MONGODB_URI');
}

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    try {
      cached.promise = mongoose.connect(MONGODB_URI, opts);
      cached.conn = await cached.promise;
      console.log('Conexão com MongoDB estabelecida com sucesso!');
      return cached.conn;
    } catch (error) {
      console.error('Erro ao conectar com MongoDB:', error);
      cached.promise = null;
      throw error;
    }
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB; 