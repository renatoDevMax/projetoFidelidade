'use client';
import { IoPersonAdd, IoCartOutline } from "react-icons/io5";
import { MdPersonSearch } from "react-icons/md";
import { FaChartLine, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import React from 'react';

interface Compra {
  _id: string;
  nome: string;
  cnpj: string;
  dataCompra: string;
  valor: number;
}

export default function Home() {
  const [compras, setCompras] = useState<Compra[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [totalHoje, setTotalHoje] = useState(0);
  const [mediaDiaria, setMediaDiaria] = useState(0);

  useEffect(() => {
    const fetchCompras = async () => {
      try {
        const response = await fetch('/api/compras');
        const data = await response.json();

        if (data.success) {
          setCompras(data.data);
          
          // Calcula o total de hoje
          const hoje = new Date().toISOString().split('T')[0];
          const comprasHoje = data.data.filter((compra: Compra) => 
            compra.dataCompra.split('T')[0] === hoje
          );
          const totalHoje = comprasHoje.reduce((acc: number, compra: Compra) => 
            acc + compra.valor, 0
          );
          setTotalHoje(totalHoje);

          // Calcula a média diária
          const totalGeral = data.data.reduce((acc: number, compra: Compra) => 
            acc + compra.valor, 0
          );
          const mediaCalculada = totalGeral / data.data.length || 0;
          setMediaDiaria(mediaCalculada);
        } else {
          toast.error('Erro ao carregar compras');
        }
      } catch (error) {
        toast.error('Erro ao carregar compras');
        console.error('Erro:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompras();
  }, []);

  const toggleRow = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const formatarData = (data: string) => {
    return new Date(data).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatarValor = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Toaster />
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-900 mb-2">
            EcoClean
          </h1>
          <p className="text-xl text-blue-600">
            Soluções para o dia a dia
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Ações Rápidas</h2>
            <div className="space-y-4">
              <a href="/cadastroCliente" className="block">
                <button className="w-full flex items-center justify-between bg-green-600 text-white px-6 py-4 rounded-xl hover:bg-green-700 transition-all transform hover:scale-[1.02]">
                  <span className="text-lg">Adicionar Cliente</span>
                  <IoPersonAdd size={24} />
                </button>
              </a>
              
              <a href="/listarClientes" className="block">
                <button className="w-full flex items-center justify-between bg-blue-600 text-white px-6 py-4 rounded-xl hover:bg-blue-700 transition-all transform hover:scale-[1.02]">
                  <span className="text-lg">Listar Clientes</span>
                  <MdPersonSearch size={24} />
                </button>
              </a>

              <a href="/adicionarCompra" className="block">
                <button className="w-full flex items-center justify-between bg-purple-600 text-white px-6 py-4 rounded-xl hover:bg-purple-700 transition-all transform hover:scale-[1.02]">
                  <span className="text-lg">Adicionar Compra</span>
                  <IoCartOutline size={24} />
                </button>
              </a>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Resumo de Vendas</h2>
              <FaChartLine className="text-blue-600" size={24} />
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-xl">
                <p className="text-sm text-blue-600 mb-1">Total Hoje</p>
                <p className="text-2xl font-bold text-blue-900">{formatarValor(totalHoje)}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-xl">
                <p className="text-sm text-green-600 mb-1">Média por Venda</p>
                <p className="text-2xl font-bold text-green-900">{formatarValor(mediaDiaria)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Últimas Transações</h2>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nome
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Valor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Detalhes
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {compras.map((compra) => (
                    <React.Fragment key={compra._id}>
                      <tr 
                        onClick={() => toggleRow(compra._id)}
                        className="hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {compra.nome}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatarValor(compra.valor)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatarData(compra.dataCompra)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          {expandedRow === compra._id ? (
                            <FaChevronUp className="inline-block" />
                          ) : (
                            <FaChevronDown className="inline-block" />
                          )}
                        </td>
                      </tr>
                      {expandedRow === compra._id && (
                        <tr className="bg-blue-50">
                          <td colSpan={4} className="px-6 py-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="font-semibold text-gray-700">Informações do Cliente</p>
                                <p>Nome: {compra.nome}</p>
                                <p>CNPJ: {compra.cnpj}</p>
                              </div>
                              <div>
                                <p className="font-semibold text-gray-700">Informações da Compra</p>
                                <p>Valor: {formatarValor(compra.valor)}</p>
                                <p>Data/Hora: {formatarData(compra.dataCompra)}</p>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
