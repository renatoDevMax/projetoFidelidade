import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Cliente from '@/models/Cliente';

export async function POST(request: Request) {
  try {
    await connectDB();

    const body = await request.json();
    
    // Formatando os benefícios do cliente
    const beneficios = [body.beneficio1, body.beneficio2, body.beneficio3];
    
    // Removendo os campos individuais de benefícios e adicionando o array
    const clienteData = {
      ...body,
      beneficios,
    };
    delete clienteData.beneficio1;
    delete clienteData.beneficio2;
    delete clienteData.beneficio3;

    const cliente = await Cliente.create(clienteData);

    return NextResponse.json({ 
      message: "Cliente cadastrado com sucesso",
      success: true,
      data: cliente 
    });

  } catch (error) {
    return NextResponse.json({
      message: error instanceof Error ? error.message : "Erro ao cadastrar cliente",
      success: false
    }, { status: 400 });
  }
}

export async function GET() {
  try {
    await connectDB();
    
    const clientes = await Cliente.find({}).sort({ dataCadastro: -1 });
    
    return NextResponse.json({ 
      success: true,
      data: clientes 
    });

  } catch (error) {
    return NextResponse.json({
      message: error instanceof Error ? error.message : "Erro ao buscar clientes",
      success: false
    }, { status: 400 });
  }
} 