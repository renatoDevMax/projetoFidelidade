'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { use } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { FaArrowLeft } from 'react-icons/fa';

interface Compra {
  _id: string;
  nome: string;
  cnpj: string;
  dataCompra: string;
  valor: number;
}

interface PageProps {
  params: Promise<{ clienteId: string }>;
}

export default function HistoricoCompras({ params }: PageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const clienteId = resolvedParams.clienteId;
  
  const [compras, setCompras] = useState<Compra[]>([]);
  const [cliente, setCliente] = useState<{ nome: string; cnpj: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Busca o cliente
        const clienteResponse = await fetch(`/api/clientes/${clienteId}`);
        const clienteData = await clienteResponse.json();

        if (clienteData.success) {
          setCliente({
            nome: clienteData.data.nome,
            cnpj: clienteData.data.cnpj
          });

          // Busca as compras do cliente
          const comprasResponse = await fetch(`/api/compras/${clienteData.data.nome}`);
          const comprasData = await comprasResponse.json();

          if (comprasData.success) {
            setCompras(comprasData.data);
          }
        }
      } catch (error) {
        toast.error('Erro ao carregar histórico');
        console.error('Erro:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [clienteId]);

  const formatarData = (data: string) => {
    return new Date(data).toLocaleString('pt-BR');
  };

  const formatarValor = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
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

        <div className="mb-6 flex items-center gap-4">
          <button
            onClick={() => router.push('/listarClientes')}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
          >
            <FaArrowLeft /> Voltar
          </button>
          {cliente && (
            <h2 className="text-xl font-semibold">
              Histórico de Compras - {cliente.nome}
            </h2>
          )}
        </div>

        {compras.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <p className="text-gray-600 text-lg">
              Nenhuma compra registrada para este cliente.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Data
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Valor
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {compras.map((compra) => (
                  <tr key={compra._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatarData(compra.dataCompra)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      {formatarValor(compra.valor)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    Total
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 text-right">
                    {formatarValor(compras.reduce((acc, compra) => acc + compra.valor, 0))}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </main>
    </div>
  );
} 