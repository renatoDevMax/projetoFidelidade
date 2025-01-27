'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';

interface Cliente {
  _id: string;
  nome: string;
  cnpj: string;
  cidade: string;
  beneficios: string[];
}

interface ValoresDesconto {
  valorMinimo: string;
  valorMaximo: string;
  valorSugerido: string;
}

export default function AdicionarCompra() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<Cliente | null>(null);
  const [valorExibicao, setValorExibicao] = useState('');
  const [valorNumerico, setValorNumerico] = useState('');

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await fetch('/api/clientes');
        const data = await response.json();

        if (data.success) {
          setClientes(data.data);
        } else {
          toast.error('Erro ao carregar clientes');
        }
      } catch (error) {
        toast.error('Erro ao carregar clientes');
        console.error('Erro:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClientes();
  }, []);

  const filteredClientes = clientes.filter(cliente =>
    cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (cliente.cnpj && cliente.cnpj.includes(searchTerm))
  );

  const handleSelectClient = (cliente: Cliente) => {
    setSelectedClient(cliente);
  };

  const formatarValorMonetario = (valor: string) => {
    // Remove tudo que não é número
    const apenasNumeros = valor.replace(/\D/g, '');
    
    // Converte para número e divide por 100 para ter os centavos
    const valorNumerico = (parseInt(apenasNumeros) / 100).toFixed(2);
    
    // Formata o valor para exibição
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
    if (!selectedClient?.beneficios?.includes('Desconto de 3% a 8% em produtos')) {
      return null;
    }

    const descontoMinimo = valor * 0.97; // valor - 3%
    const descontoMaximo = valor * 0.92; // valor - 8%

    // Encontra um valor inteiro entre o desconto máximo e mínimo
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
    if (!selectedClient) {
      toast.error('Selecione um cliente');
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
          nomeCliente: selectedClient.nome,
          cnpjCliente: selectedClient.cnpj,
          valor: valorNumerico
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Compra registrada com sucesso!', {
          duration: 3000,
          position: 'top-right',
        });
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

  return (
    <div className="min-h-screen p-8">
      <Toaster />
      <main className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          EcoClean - Soluções para o dia a dia
        </h1>

        <div className="mb-6">
          <button
            onClick={() => router.push('/')}
            className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Voltar
          </button>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6">
          <div className="grid gap-6">
            <div>
              <label htmlFor="searchCliente" className="block text-sm font-medium text-gray-700 mb-1">
                Buscar Cliente
              </label>
              <input
                type="text"
                id="searchCliente"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nome ou CNPJ"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="border rounded-lg">
              <div className="max-h-[800px] overflow-y-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                        Nome
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                        CNPJ
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                        Cidade
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {filteredClientes.map((cliente) => (
                      <tr 
                        key={cliente._id} 
                        onClick={() => handleSelectClient(cliente)}
                        className={`cursor-pointer hover:bg-gray-50 transition-colors ${
                          selectedClient?._id === cliente._id ? 'bg-blue-50' : ''
                        }`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {cliente.nome}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {cliente.cnpj}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {cliente.cidade}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {selectedClient && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">Cliente Selecionado:</h3>
                <p className="text-blue-800">{selectedClient.nome} - {selectedClient.cnpj}</p>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mt-4">
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

              {selectedClient?.beneficios?.includes('Desconto de 3% a 8% em produtos') && 
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
                  disabled={isLoading || !selectedClient}
                  className={`flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors ${
                    (isLoading || !selectedClient) ? 'opacity-70 cursor-not-allowed' : ''
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
        </div>
      </main>
    </div>
  );
} 