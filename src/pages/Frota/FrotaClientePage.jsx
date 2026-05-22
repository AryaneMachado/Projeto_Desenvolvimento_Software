import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Car, Search, Fuel, Users, Activity, DollarSign } from 'lucide-react';
import ClienteLayout from '../../components/layout/ClienteLayout';
import Badge from '../../components/ui/Badge';
import { veiculoService } from '../../services/veiculoService';
import { formatarMoeda } from '../../utils/validators';

const CATEGORIAS = ['Todos', 'Econômico', 'SUV', 'Sedan', 'Picape'];

function VeiculoCard({ veiculo }) {
  const disponivel = veiculo.disponivel === 1;
  return (
    <Link to={`/veiculos/${veiculo.id}`} className={`group block rounded-2xl border transition-all duration-300 overflow-hidden
      hover:-translate-y-1 hover:shadow-2xl
      ${disponivel
        ? 'bg-gray-900 border-white/10 hover:border-indigo-500/40 hover:shadow-indigo-500/10'
        : 'bg-gray-900/60 border-white/5 opacity-75'
      }`}
    >
      {/* Car Visual */}
      <div className={`relative h-40 flex items-center justify-center
        ${disponivel
          ? 'bg-gradient-to-br from-indigo-900/40 to-gray-900'
          : 'bg-gray-800/50'
        }`}
      >
        <div className={`absolute inset-0 transition-opacity duration-300 ${disponivel ? 'group-hover:opacity-100 opacity-70' : ''}`}>
          <div className="absolute -right-8 -top-8 w-40 h-40 bg-indigo-600/5 rounded-full blur-2xl" />
        </div>
        <div className={`relative w-20 h-20 rounded-2xl flex items-center justify-center
          ${disponivel
            ? 'bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border border-indigo-500/30'
            : 'bg-gray-700/50 border border-white/5'
          }`}
        >
          <Car size={36} className={disponivel ? 'text-indigo-400' : 'text-gray-600'} />
        </div>

        {/* Availability Badge */}
        <div className="absolute top-3 right-3">
          {disponivel
            ? <Badge variant="success">Disponível</Badge>
            : <Badge variant="danger">Alugado</Badge>
          }
        </div>

        {/* Category */}
        {veiculo.categoria && (
          <div className="absolute top-3 left-3">
            <Badge variant="info">{veiculo.categoria}</Badge>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-5">
        <h3 className="font-bold text-white text-base group-hover:text-indigo-300 transition-colors">
          {veiculo.fabricante} {veiculo.modelo}
        </h3>
        <p className="text-sm text-gray-500 mt-0.5">{veiculo.ano} · {veiculo.cor}</p>

        {/* Specs Row */}
        <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
          <span className="flex items-center gap-1"><Activity size={12} />{veiculo.cambio || 'Manual'}</span>
          <span className="flex items-center gap-1"><Fuel size={12} />{veiculo.combustivel || 'Flex'}</span>
          <span className="flex items-center gap-1"><Users size={12} />{veiculo.passageiros || 5}p</span>
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
          <div>
            <p className="text-xs text-gray-500">A partir de</p>
            <p className="text-lg font-bold text-emerald-400">{formatarMoeda(veiculo.valor_diaria || 0)}<span className="text-xs text-gray-500 font-normal">/dia</span></p>
          </div>
          {disponivel && (
            <span className="px-3 py-1.5 rounded-xl bg-indigo-600/20 text-indigo-400 text-xs font-semibold border border-indigo-500/30
              group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all duration-200">
              Reservar
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

export default function FrotaClientePage() {
  const [veiculos, setVeiculos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState('');
  const [categoria, setCategoria] = useState('Todos');
  const [apenasDisponiveis, setApenasDisponiveis] = useState(false);

  useEffect(() => {
    veiculoService.listar().then((data) => { setVeiculos(data); setLoading(false); });
  }, []);

  const filtrados = veiculos.filter((v) => {
    const q = busca.toLowerCase();
    const matchBusca = !q || v.modelo.toLowerCase().includes(q) || v.fabricante.toLowerCase().includes(q);
    const matchCat = categoria === 'Todos' || v.categoria === categoria;
    const matchDisp = !apenasDisponiveis || v.disponivel === 1;
    return matchBusca && matchCat && matchDisp;
  });

  const disponiveis = veiculos.filter((v) => v.disponivel === 1).length;

  return (
    <ClienteLayout>
      <div className="space-y-8">
        {/* Hero */}
        <div className="relative py-10 px-6 rounded-3xl bg-gradient-to-br from-indigo-950 to-gray-900 border border-indigo-500/20 overflow-hidden text-center">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-amber-600/5 rounded-full blur-3xl" />
          </div>
          <div className="relative">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-4">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {disponiveis} veículos disponíveis agora
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              Encontre o carro <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-amber-400">perfeito</span>
            </h1>
            <p className="text-gray-400 text-base max-w-lg mx-auto">
              Explore nossa frota completa. Reservas simples, preços transparentes.
            </p>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              placeholder="Buscar por modelo ou fabricante..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {CATEGORIAS.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoria(cat)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                  ${categoria === cat
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                    : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/10'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <label className="flex items-center gap-2 cursor-pointer px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-400 hover:text-white transition-colors">
            <input
              type="checkbox"
              checked={apenasDisponiveis}
              onChange={(e) => setApenasDisponiveis(e.target.checked)}
              className="rounded border-white/30 bg-white/10 text-indigo-500 focus:ring-indigo-500"
            />
            Disponíveis
          </label>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-72 rounded-2xl bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : filtrados.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-600">
            <Car size={56} className="mb-4 opacity-30" />
            <p className="font-medium text-lg">Nenhum veículo encontrado</p>
            <p className="text-sm mt-1">Tente ajustar os filtros de busca.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtrados.map((v) => <VeiculoCard key={v.id} veiculo={v} />)}
          </div>
        )}
      </div>
    </ClienteLayout>
  );
}
