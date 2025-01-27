'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaSearch, FaQrcode } from 'react-icons/fa';
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

export default function CompraPorQr() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [clienteEncontrado, setClienteEncontrado] = useState<Cliente | null>(null);

  const buscarCliente = async () => {
    if (!searchTerm) {
      toast.error('Por favor, informe um CNPJ');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/clientes');
      const data = await response.json();

      if (data.success) {
        const cliente = data.data.find((c: Cliente) => 
          c.cnpj.replace(/\D/g, '') === searchTerm.replace(/\D/g, '')
        );

        if (cliente) {
          setClienteEncontrado(cliente);
        } else {
          toast.error('Cliente não encontrado');
          setClienteEncontrado(null);
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      buscarCliente();
    }
  };

  return (
    <div className="min-h-screen p-8">
      <Toaster />
      <main className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          EcoClean - Soluções para o dia a dia
        </h1>

        <div className="bg-white shadow-lg rounded-lg p-6">
          <div className="flex justify-center mb-8">
            <button
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              onClick={() => toast.success('Funcionalidade em desenvolvimento')}
            >
              <FaQrcode size={20} />
              Ler QR Code
            </button>
          </div>

          <div className="flex gap-2 mb-6">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Digite o CNPJ do cliente"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={buscarCliente}
              disabled={isLoading}
              className={`bg-blue-600 text-white px-4 rounded-lg hover:bg-blue-700 transition-colors ${
                isLoading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <FaSearch size={20} />
              )}
            </button>
          </div>

          {clienteEncontrado && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Informações do Cliente</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-medium text-gray-700">Nome:</p>
                  <p className="text-gray-900">{clienteEncontrado.nome}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">CNPJ:</p>
                  <p className="text-gray-900">{clienteEncontrado.cnpj}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">Cidade:</p>
                  <p className="text-gray-900">{clienteEncontrado.cidade}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">Bairro:</p>
                  <p className="text-gray-900">{clienteEncontrado.bairro}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">Endereço:</p>
                  <p className="text-gray-900">{`${clienteEncontrado.rua}, ${clienteEncontrado.numero}`}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">Telefone:</p>
                  <p className="text-gray-900">{clienteEncontrado.telefone}</p>
                </div>
                <div className="col-span-2">
                  <p className="font-medium text-gray-700 mb-2">Benefícios:</p>
                  <ul className="list-disc list-inside space-y-1">
                    {clienteEncontrado.beneficios.map((beneficio, index) => (
                      <li key={index} className="text-gray-900">{beneficio}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 