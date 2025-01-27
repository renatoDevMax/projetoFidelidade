'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';

export default function CadastroCliente() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Lista atualizada de benefícios disponíveis
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
      const response = await fetch('/api/clientes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Cliente cadastrado com sucesso!', {
          duration: 3000,
          position: 'top-right',
          style: {
            background: '#10B981',
            color: '#fff',
          },
        });
        
        // Aguarda um momento para a notificação ser vista
        setTimeout(() => {
          router.push('/');
        }, 1000);
      } else {
        toast.error(data.message || 'Erro ao cadastrar cliente', {
          duration: 3000,
          position: 'top-right',
        });
      }
    } catch (error) {
      toast.error('Erro ao cadastrar cliente', {
        duration: 3000,
        position: 'top-right',
      });
      console.error('Erro:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <Toaster />
      <main className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          EcoClean - Soluções para o dia a dia
        </h1>

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
                Telefone Contato
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
                className={`flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors ${
                  isLoading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Cadastrando...
                  </>
                ) : (
                  'Cadastrar'
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
          </div>
        </form>
      </main>
    </div>
  );
} 