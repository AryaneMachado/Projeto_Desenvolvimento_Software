import { mockVeiculos } from './mockData';

const MOCK_DELAY = 400;
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
let nextId = 200;

export const veiculoService = {
  async listar() {
    await delay(MOCK_DELAY);
    return [...mockVeiculos];
  },

  async listarDisponiveis() {
    await delay(MOCK_DELAY);
    return mockVeiculos.filter((v) => v.disponivel === 1);
  },

  async buscarPorId(id) {
    await delay(MOCK_DELAY);
    const v = mockVeiculos.find((v) => v.id === Number(id));
    if (!v) throw new Error('Veículo não encontrado.');
    return { ...v };
  },

  async criar(dados) {
    await delay(MOCK_DELAY);
    const existente = mockVeiculos.find((v) => v.placa === dados.placa);
    if (existente) throw new Error('Já existe um veículo com essa placa.');
    const novo = { id: nextId++, disponivel: 1, valor_diaria: Number(dados.valor_diaria) || 0, ...dados };
    mockVeiculos.push(novo);
    return novo;
  },

  async atualizar(id, dados) {
    await delay(MOCK_DELAY);
    const idx = mockVeiculos.findIndex((v) => v.id === Number(id));
    if (idx === -1) throw new Error('Veículo não encontrado.');
    mockVeiculos[idx] = { ...mockVeiculos[idx], ...dados };
    return mockVeiculos[idx];
  },

  async deletar(id) {
    await delay(MOCK_DELAY);
    const idx = mockVeiculos.findIndex((v) => v.id === Number(id));
    if (idx === -1) throw new Error('Veículo não encontrado.');
    if (mockVeiculos[idx].disponivel === 0) {
      throw new Error('Não é possível excluir um veículo com aluguel ativo.');
    }
    mockVeiculos.splice(idx, 1);
    return true;
  },
};
