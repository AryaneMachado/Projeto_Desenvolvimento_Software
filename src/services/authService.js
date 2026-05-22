import { mockUsuarios } from './mockData';

const MOCK_DELAY = 400;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let nextId = 100;

// Gera um mock JWT (apenas aparência, sem validação real)
function gerarMockToken(usuario) {
  const payload = btoa(JSON.stringify({ sub: usuario.id, tipo: usuario.tipo, nome: usuario.nome_completo }));
  return `mockjwt.${payload}.assinatura`;
}

export const authService = {
  async login(email, senha) {
    await delay(MOCK_DELAY);
    const usuario = mockUsuarios.find(
      (u) => u.email === email && u.senha === senha
    );
    if (!usuario) {
      throw new Error('E-mail ou senha inválidos.');
    }
    const { senha: _senha, ...usuarioSemSenha } = usuario;
    const token = gerarMockToken(usuarioSemSenha);
    return { token, usuario: usuarioSemSenha };
  },

  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  },

  getUsuarioLogado() {
    try {
      const user = localStorage.getItem('auth_user');
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  },

  getToken() {
    return localStorage.getItem('auth_token');
  },

  isAuthenticated() {
    return !!localStorage.getItem('auth_token');
  },

  async registrar(dados) {
    await delay(MOCK_DELAY);
    const existente = mockUsuarios.find((u) => u.email === dados.email);
    if (existente) throw new Error('E-mail já cadastrado.');
    const novo = { id: nextId++, ...dados, tipo: 'cliente' };
    mockUsuarios.push(novo);
    return novo;
  },
};
