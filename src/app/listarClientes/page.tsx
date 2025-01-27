'use client';
import { useRouter } from 'next/navigation';
import { FaEdit, FaSearch, FaHistory } from 'react-icons/fa';
import { useEffect, useState } from 'react';
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
  dataCadastro: string;
}

export default function ListarClientes() {
  const router = useRouter();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

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
    (cliente.nome?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (cliente.cnpj || '').includes(searchTerm)
  );

  return (
    <div className="min-h-screen p-8">
      <Toaster />
      <main className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          EcoClean - Soluções para o dia a dia
        </h1>

        <div className="mb-6 flex justify-between items-center gap-4">
          <button
            onClick={() => router.push('/')}
            className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Voltar
          </button>

          <div className="flex-1 max-w-md relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar por nome ou CNPJ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredClientes.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <p className="text-gray-600 text-lg">
              {searchTerm ? 'Nenhum cliente encontrado com esses termos.' : 'Nenhum cliente cadastrado ainda.'}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg">
            <div className="max-h-[700px] overflow-y-auto">
              <table className="w-full">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                      Nome
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                      CNPJ
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredClientes.map((cliente) => (
                    <tr key={cliente._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {cliente.nome}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {cliente.cnpj}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => router.push(`/editarCliente/${cliente._id}`)}
                            className="bg-yellow-500 text-white p-2 rounded-lg hover:bg-yellow-600 transition-colors"
                            title="Editar cliente"
                          >
                            <FaEdit size={18} />
                          </button>
                          <button
                            onClick={() => router.push(`/historicoCompras/${cliente._id}`)}
                            className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors"
                            title="Histórico de compras"
                          >
                            <FaHistory size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
} 