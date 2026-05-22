import { mockUsuarios } from './mockData';

const MOCK_DELAY = 400;
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
let nextId = 300;

export const usuarioService = {
  async listar() {
    await delay(MOCK_DELAY);
    return mockUsuarios.map(({ senha: _s, ...u }) => u);
  },

  async buscarPorId(id) {
    await delay(MOCK_DELAY);
    const u = mockUsuarios.find((u) => u.id === Number(id));
    if (!u) throw new Error('Usuário não encontrado.');
    const { senha: _s, ...semSenha } = u;
    return semSenha;
  },

  async criar(dados) {
    await delay(MOCK_DELAY);
    const existente = mockUsuarios.find((u) => u.email === dados.email);
    if (existente) throw new Error('E-mail já cadastrado.');
    const cpfExistente = mockUsuarios.find((u) => u.cpf === dados.cpf);
    if (cpfExistente) throw new Error('CPF já cadastrado.');
    const novo = { id: nextId++, tipo: dados.tipo || 'cliente', ...dados };
    mockUsuarios.push(novo);
    const { senha: _s, ...semSenha } = novo;
    return semSenha;
  },

  async atualizar(id, dados) {
    await delay(MOCK_DELAY);
    const idx = mockUsuarios.findIndex((u) => u.id === Number(id));
    if (idx === -1) throw new Error('Usuário não encontrado.');
    mockUsuarios[idx] = { ...mockUsuarios[idx], ...dados };
    const { senha: _s, ...semSenha } = mockUsuarios[idx];
    return semSenha;
  },

  async deletar(id) {
    await delay(MOCK_DELAY);
    const idx = mockUsuarios.findIndex((u) => u.id === Number(id));
    if (idx === -1) throw new Error('Usuário não encontrado.');
    if (mockUsuarios[idx].tipo === 'admin') {
      throw new Error('Não é possível excluir um administrador.');
    }
    mockUsuarios.splice(idx, 1);
    return true;
  },
};
