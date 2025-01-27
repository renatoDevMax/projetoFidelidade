import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Cliente from '@/models/Cliente';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const cliente = await Cliente.findById(params.id);
    
    if (!cliente) {
      return NextResponse.json({
        message: "Cliente não encontrado",
        success: false
      }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true,
      data: cliente 
    });

  } catch (error) {
    return NextResponse.json({
      message: error instanceof Error ? error.message : "Erro ao buscar cliente",
      success: false
    }, { status: 400 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    const cliente = await Cliente.findByIdAndUpdate(
      params.id,
      body,
      { new: true, runValidators: true }
    );
    
    if (!cliente) {
      return NextResponse.json({
        message: "Cliente não encontrado",
        success: false
      }, { status: 404 });
    }

    return NextResponse.json({ 
      message: "Cliente atualizado com sucesso",
      success: true,
      data: cliente 
    });

  } catch (error) {
    return NextResponse.json({
      message: error instanceof Error ? error.message : "Erro ao atualizar cliente",
      success: false
    }, { status: 400 });
  }
} 