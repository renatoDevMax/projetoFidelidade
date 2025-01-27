'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { use } from 'react';
import toast, { Toaster } from 'react-hot-toast';

interface PageProps {
  params: Promise<{ id: string }>;
}

interface ClienteData {
  nome: string;
  cidade: string;
  bairro: string;
  rua: string;
  numero: string;
  telefone: string;
  cnpj: string;
  beneficios: string[];
}

export default function EditarCliente({ params }: PageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const clienteId = resolvedParams.id;

  // Lista de benefícios disponíveis
  const beneficiosDisponiveis = [
    "Desconto de 3% a 8% em produtos",
    "Frete grátis para entregas",
    "Programa de pontuação",
    "Assistência técnica para piscinas e produtos",
    "Atendimento com prioridade"
  ];

  const [formData, setFormData] = useState({
    nome: '',
    cidade: '',
    bairro: '',
    rua: '',
    numero: '',
    telefone: '',
    cnpj: '',
    beneficio1: '',
    beneficio2: '',
    beneficio3: ''
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCliente = async () => {
      try {
        const response = await fetch(`/api/clientes/${clienteId}`);
        const data = await response.json();

        if (data.success) {
          // Convertendo os benefícios do array para campos individuais
          const beneficios = data.data.beneficios || [];
          setFormData({
            ...data.data,
            beneficio1: beneficios[0] || '',
            beneficio2: beneficios[1] || '',
            beneficio3: beneficios[2] || ''
          });
        } else {
          toast.error('Erro ao carregar dados do cliente');
        }
      } catch (error) {
        toast.error('Erro ao carregar dados do cliente');
        console.error('Erro:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (clienteId) {
      fetchCliente();
    }
  }, [clienteId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Convertendo os benefícios individuais para array
      const beneficios = [formData.beneficio1, formData.beneficio2, formData.beneficio3];
      const dataToSend: Partial<ClienteData> = {
        nome: formData.nome,
        cidade: formData.cidade,
        bairro: formData.bairro,
        rua: formData.rua,
        numero: formData.numero,
        telefone: formData.telefone,
        cnpj: formData.cnpj,
        beneficios
      };

      const response = await fetch(`/api/clientes/${clienteId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Cliente atualizado com sucesso!', {
          duration: 3000,
          position: 'top-right',
        });
        setTimeout(() => {
          router.push('/listarClientes');
        }, 1000);
      } else {
        toast.error(data.message || 'Erro ao atualizar cliente');
      }
    } catch (error) {
      toast.error('Erro ao atualizar cliente');
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
      <main className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          EcoClean - Soluções para o dia a dia
        </h1>

        <div className="mb-6">
          <button
            onClick={() => router.push('/listarClientes')}
            className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Voltar
          </button>
        </div>

        <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-6">
          <div className="grid gap-6">
            <div>
              <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
                Nome
              </label>
              <input
                type="text"
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="cidade" className="block text-sm font-medium text-gray-700 mb-1">
                Cidade
              </label>
              <input
                type="text"
                id="cidade"
                name="cidade"
                value={formData.cidade}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="bairro" className="block text-sm font-medium text-gray-700 mb-1">
                Bairro
              </label>
              <input
                type="text"
                id="bairro"
                name="bairro"
                value={formData.bairro}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="rua" className="block text-sm font-medium text-gray-700 mb-1">
                Rua
              </label>
              <input
                type="text"
                id="rua"
                name="rua"
                value={formData.rua}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="numero" className="block text-sm font-medium text-gray-700 mb-1">
                Número
              </label>
              <input
                type="text"
                id="numero"
                name="numero"
                value={formData.numero}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-1">
                Telefone
              </label>
              <input
                type="tel"
                id="telefone"
                name="telefone"
                value={formData.telefone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="cnpj" className="block text-sm font-medium text-gray-700 mb-1">
                CNPJ
              </label>
              <input
                type="text"
                id="cnpj"
                name="cnpj"
                value={formData.cnpj}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="border-t pt-6 mt-6">
              <h2 className="text-xl font-semibold mb-4">Selecione 3 Benefícios</h2>
              
              <div className="grid gap-4">
                <div>
                  <label htmlFor="beneficio1" className="block text-sm font-medium text-gray-700 mb-1">
                    Benefício 1
                  </label>
                  <select
                    id="beneficio1"
                    name="beneficio1"
                    value={formData.beneficio1}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Selecione um benefício</option>
                    {beneficiosDisponiveis.map((beneficio, index) => (
                      <option 
                        key={index} 
                        value={beneficio}
                        disabled={beneficio === formData.beneficio2 || beneficio === formData.beneficio3}
                      >
                        {beneficio}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="beneficio2" className="block text-sm font-medium text-gray-700 mb-1">
                    Benefício 2
                  </label>
                  <select
                    id="beneficio2"
                    name="beneficio2"
                    value={formData.beneficio2}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Selecione um benefício</option>
                    {beneficiosDisponiveis.map((beneficio, index) => (
                      <option 
                        key={index} 
                        value={beneficio}
                        disabled={beneficio === formData.beneficio1 || beneficio === formData.beneficio3}
                      >
                        {beneficio}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="beneficio3" className="block text-sm font-medium text-gray-700 mb-1">
                    Benefício 3
                  </label>
                  <select
                    id="beneficio3"
                    name="beneficio3"
                    value={formData.beneficio3}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Selecione um benefício</option>
                    {beneficiosDisponiveis.map((beneficio, index) => (
                      <option 
                        key={index} 
                        value={beneficio}
                        disabled={beneficio === formData.beneficio1 || beneficio === formData.beneficio2}
                      >
                        {beneficio}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isLoading}
                className={`flex-1 bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-yellow-600 transition-colors ${
                  isLoading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? 'Salvando...' : 'Salvar Alterações'}
              </button>
              <button
                type="button"
                onClick={() => router.push('/listarClientes')}
                disabled={isLoading}
                className={`flex-1 bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors ${
                  isLoading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                Cancelar
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
} 