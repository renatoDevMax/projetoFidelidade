import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Compra from '@/models/Compra';

export async function POST(request: Request) {
  try {
    await connectDB();

    const body = await request.json();
    
    const compraData = {
      nome: body.nomeCliente,
      cnpj: body.cnpjCliente,
      dataCompra: new Date(),
      valor: Number(body.valor)
    };

    const compra = await Compra.create(compraData);

    return NextResponse.json({ 
      message: "Compra registrada com sucesso",
      success: true,
      data: compra 
    });

  } catch (error) {
    return NextResponse.json({
      message: error instanceof Error ? error.message : "Erro ao registrar compra",
      success: false
    }, { status: 400 });
  }
}

export async function GET() {
  try {
    await connectDB();
    
    const compras = await Compra.find()
      .sort({ dataCompra: -1 }) // Ordena por data decrescente
      .limit(10); // Limita a 10 últimas compras
    
    return NextResponse.json({ 
      success: true,
      data: compras 
    });

  } catch (error) {
    return NextResponse.json({
      message: error instanceof Error ? error.message : "Erro ao buscar compras",
      success: false
    }, { status: 400 });
  }
} 