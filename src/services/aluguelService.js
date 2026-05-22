import { mockAlugueis, mockVeiculos } from './mockData';

const MOCK_DELAY = 400;
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
let nextId = 400;

const MIN_DAYS_BETWEEN_RENTALS = 2;

function diffDias(dataA, dataB) {
  const a = new Date(dataA);
  const b = new Date(dataB);
  return Math.round((b - a) / (1000 * 60 * 60 * 24));
}

export const aluguelService = {
  async listar() {
    await delay(MOCK_DELAY);
    return [...mockAlugueis];
  },

  async listarPorUsuario(usuarioId) {
    await delay(MOCK_DELAY);
    return mockAlugueis.filter((a) => a.usuario_id === Number(usuarioId));
  },

  async buscarPorId(id) {
    await delay(MOCK_DELAY);
    const a = mockAlugueis.find((a) => a.id === Number(id));
    if (!a) throw new Error('Aluguel não encontrado.');
    return { ...a };
  },

  async criar(dados) {
    await delay(MOCK_DELAY);
    const veiculo = mockVeiculos.find((v) => v.id === Number(dados.veiculo_id));
    if (!veiculo) throw new Error('Veículo não encontrado.');
    if (veiculo.disponivel === 0) throw new Error('Veículo não está disponível.');

    // Verificar conflito de datas (intervalo mínimo entre aluguéis)
    const conflito = mockAlugueis.some((a) => {
      if (a.veiculo_id !== Number(dados.veiculo_id)) return false;
      const inicioNovo = new Date(dados.data_retirada);
      const fimNovo = new Date(dados.data_entrega);
      const inicioExist = new Date(a.data_retirada);
      const fimExist = new Date(a.data_entrega);
      const fimExistComIntervalo = new Date(fimExist);
      fimExistComIntervalo.setDate(fimExistComIntervalo.getDate() + MIN_DAYS_BETWEEN_RENTALS);
      const inicioNovComIntervalo = new Date(inicioNovo);
      inicioNovComIntervalo.setDate(inicioNovComIntervalo.getDate() + MIN_DAYS_BETWEEN_RENTALS);
      return inicioNovo < fimExistComIntervalo && inicioExist < inicioNovComIntervalo;
    });
    if (conflito) {
      throw new Error(`Este veículo exige intervalo mínimo de ${MIN_DAYS_BETWEEN_RENTALS} dias entre aluguéis.`);
    }

    const dias = diffDias(dados.data_retirada, dados.data_entrega);
    if (dias < 1) throw new Error('Data de entrega deve ser posterior à data de retirada.');

    const valor_total = dias * (veiculo.valor_diaria || 0);
    const novo = {
      id: nextId++,
      ...dados,
      status: 'ativo',
      finalizado_em: null,
      usuario: dados.usuario_nome || '',
      veiculo: veiculo.modelo,
      placa: veiculo.placa,
      valor_total,
    };
    mockAlugueis.push(novo);
    // Marcar veículo como indisponível
    veiculo.disponivel = 0;
    return novo;
  },

  async finalizar(id) {
    await delay(MOCK_DELAY);
    const aluguel = mockAlugueis.find((a) => a.id === Number(id));
    if (!aluguel) throw new Error('Aluguel não encontrado.');
    if (aluguel.status !== 'ativo') throw new Error('Aluguel já foi finalizado.');
    aluguel.status = 'finalizado';
    aluguel.finalizado_em = new Date().toISOString();
    // Liberar veículo
    const veiculo = mockVeiculos.find((v) => v.id === aluguel.veiculo_id);
    if (veiculo) veiculo.disponivel = 1;
    return aluguel;
  },

  async cancelar(id) {
    await delay(MOCK_DELAY);
    const aluguel = mockAlugueis.find((a) => a.id === Number(id));
    if (!aluguel) throw new Error('Aluguel não encontrado.');
    if (aluguel.status !== 'ativo') throw new Error('Apenas aluguéis ativos podem ser cancelados.');
    aluguel.status = 'cancelado';
    const veiculo = mockVeiculos.find((v) => v.id === aluguel.veiculo_id);
    if (veiculo) veiculo.disponivel = 1;
    return aluguel;
  },
};
