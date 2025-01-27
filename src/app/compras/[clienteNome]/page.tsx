'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { use } from 'react';
import toast, { Toaster } from 'react-hot-toast';

interface Cliente {
  _id: string;
  nome: string;
  cidade: string;
  bairro: string;
  rua: string;
  numero: string;
  telefone: string;
  cnpj: string;
  beneficios: string[];
}

interface ValoresDesconto {
  valorMinimo: string;
  valorMaximo: string;
  valorSugerido: string;
}

interface PageProps {
  params: Promise<{ clienteNome: string }>;
}

export default function ComprasPorCliente({ params }: PageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const nomeCliente = decodeURIComponent(resolvedParams.clienteNome);

  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [valorExibicao, setValorExibicao] = useState('');
  const [valorNumerico, setValorNumerico] = useState('');

  useEffect(() => {
    const fetchCliente = async () => {
      try {
        const response = await fetch('/api/clientes');
        const data = await response.json();

        if (data.success) {
          const clienteEncontrado = data.data.find((c: Cliente) => 
            c.nome.toLowerCase() === nomeCliente.toLowerCase()
          );

          if (clienteEncontrado) {
            setCliente(clienteEncontrado);
          } else {
            toast.error('Cliente não encontrado');
            setTimeout(() => router.push('/'), 2000);
          }
        } else {
          toast.error('Erro ao buscar cliente');
        }
      } catch (error) {
        toast.error('Erro ao buscar cliente');
        console.error('Erro:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCliente();
  }, [nomeCliente, router]);

  const formatarValorMonetario = (valor: string) => {
    const apenasNumeros = valor.replace(/\D/g, '');
    const valorNumerico = (parseInt(apenasNumeros) / 100).toFixed(2);
    
    const valorFormatado = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(Number(valorNumerico));

    return {
      valorFormatado,
      valorNumerico
    };
  };

  const handleValorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const novoValor = e.target.value.replace(/\D/g, '');
    
    if (novoValor) {
      const { valorFormatado, valorNumerico } = formatarValorMonetario(novoValor);
      setValorExibicao(valorFormatado);
      setValorNumerico(valorNumerico);
    } else {
      setValorExibicao('');
      setValorNumerico('');
    }
  };

  const calcularDescontos = (valor: number): ValoresDesconto | null => {
    if (!cliente?.beneficios?.includes('Desconto de 3% a 8% em produtos')) {
      return null;
    }

    const descontoMinimo = valor * 0.97;
    const descontoMaximo = valor * 0.92;
    const intervalo = Math.floor(descontoMinimo - descontoMaximo);
    const valorAleatorio = Math.floor(Math.random() * intervalo);
    const valorSugerido = Math.floor(descontoMaximo) + valorAleatorio;

    return {
      valorMinimo: new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(descontoMinimo),
      valorMaximo: new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(descontoMaximo),
      valorSugerido: new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(valorSugerido)
    };
  };

  const valoresComDesconto = valorNumerico ? 
    calcularDescontos(Number(valorNumerico)) : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cliente) {
      toast.error('Cliente não encontrado');
      return;
    }

    if (!valorNumerico) {
      toast.error('Informe o valor da compra');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/compras', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nomeCliente: cliente.nome,
          cnpjCliente: cliente.cnpj,
          valor: valorNumerico
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Compra registrada com sucesso!');
        setTimeout(() => {
          router.push('/');
        }, 1000);
      } else {
        toast.error(data.message || 'Erro ao registrar compra');
      }
    } catch (error) {
      toast.error('Erro ao registrar compra');
      console.error('Erro:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen p-8 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <Toaster />
      <main className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          EcoClean - Soluções para o dia a dia
        </h1>

        {cliente && (
          <div className="bg-white shadow-lg rounded-lg p-6">
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Informações do Cliente</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-medium text-gray-700">Nome:</p>
                  <p className="text-gray-900">{cliente.nome}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">CNPJ:</p>
                  <p className="text-gray-900">{cliente.cnpj}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">Cidade:</p>
                  <p className="text-gray-900">{cliente.cidade}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">Bairro:</p>
                  <p className="text-gray-900">{cliente.bairro}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">Endereço:</p>
                  <p className="text-gray-900">{`${cliente.rua}, ${cliente.numero}`}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">Telefone:</p>
                  <p className="text-gray-900">{cliente.telefone}</p>
                </div>
                <div className="col-span-2">
                  <p className="font-medium text-gray-700 mb-2">Benefícios:</p>
                  <ul className="list-disc list-inside space-y-1">
                    {cliente.beneficios.map((beneficio, index) => (
                      <li key={index} className="text-gray-900">{beneficio}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mt-6">
                <label htmlFor="valor" className="block text-sm font-medium text-gray-700 mb-1">
                  Valor da Compra
                </label>
                <input
                  type="text"
                  id="valor"
                  value={valorExibicao}
                  onChange={handleValorChange}
                  placeholder="R$ 0,00"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {cliente.beneficios?.includes('Desconto de 3% a 8% em produtos') && 
               valoresComDesconto && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg space-y-2">
                  <h3 className="font-medium text-green-900">Sugestões de Desconto:</h3>
                  <div className="space-y-1 text-sm text-green-800">
                    <p>Valor com desconto mínimo (3%): {valoresComDesconto.valorMinimo}</p>
                    <p>Valor com desconto máximo (8%): {valoresComDesconto.valorMaximo}</p>
                    <p className="font-medium pt-2 border-t border-green-200">
                      Valor sugerido: {valoresComDesconto.valorSugerido}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex gap-4 mt-6">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors ${
                    isLoading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                      Registrando...
                    </>
                  ) : (
                    'Registrar Compra'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => router.push('/')}
                  disabled={isLoading}
                  className={`flex-1 bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors ${
                    isLoading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
} 