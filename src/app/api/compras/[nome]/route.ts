import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Compra from '@/models/Compra';

export async function GET(
  request: Request,
  context: { params: Promise<{ nome: string }> }
) {
  try {
    await connectDB();
    
    const { nome } = await context.params;
    
    const compras = await Compra.find({ 
      nome: decodeURIComponent(nome) 
    }).sort({ dataCompra: -1 });
    
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