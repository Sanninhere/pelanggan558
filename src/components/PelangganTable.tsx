import { Edit2, Trash2, Phone, MapPin, Package, Calendar, ExternalLink } from 'lucide-react';
import { Pelanggan } from '../types';

interface Props {
  pelangganList: Pelanggan[];
  isAdmin: boolean;
  onEdit: (p: Pelanggan) => void;
  onDelete: (p: Pelanggan) => void;
}

function StatusBadge({ status }: { status: Pelanggan['status'] }) {
  const styles = {
    'Aktif': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    'Non-Aktif': 'bg-red-500/10 text-red-400 border-red-500/30',
    'Pending': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
  };
  const dots = {
    'Aktif': 'bg-emerald-400',
    'Non-Aktif': 'bg-red-400',
    'Pending': 'bg-yellow-400',
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dots[status]} ${status === 'Aktif' ? 'animate-pulse' : ''}`} />
      {status}
    </span>
  );
}

function PaketBadge({ paket }: { paket: string }) {
  const speed = parseInt(paket);
  let color = 'from-blue-500 to-cyan-500';
  if (speed >= 50) color = 'from-purple-500 to-pink-500';
  else if (speed >= 20) color = 'from-cyan-500 to-teal-500';
  else if (speed >= 10) color = 'from-blue-500 to-cyan-500';

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-gradient-to-r ${color} text-white shadow-sm`}>
      <Package className="w-3 h-3" />
      {paket}
    </span>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('id-ID', {
    day: '2-digit', month: 'short', year: 'numeric'
  });
}

export default function PelangganTable({ pelangganList, isAdmin, onEdit, onDelete }: Props) {
  if (pelangganList.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Package className="w-8 h-8 text-gray-600" />
        </div>
        <p className="text-gray-500 font-medium">Belum ada data pelanggan</p>
        <p className="text-gray-600 text-sm mt-1">
          {isAdmin ? 'Klik "Tambah Pelanggan" untuk menambahkan data baru' : 'Data pelanggan belum tersedia'}
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800">
              {['#', 'Nama', 'Lokasi Instalasi', 'Nomor WA', 'Paket', 'Status', 'Terdaftar', ...(isAdmin ? ['Aksi'] : [])].map(h => (
                <th
                  key={h}
                  className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider pb-4 px-3 first:pl-0"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/60">
            {pelangganList.map((p, i) => (
              <tr
                key={p.id}
                className="hover:bg-gray-800/40 transition-colors group"
              >
                <td className="py-4 px-3 first:pl-0">
                  <span className="text-gray-600 text-sm font-mono">{String(i + 1).padStart(2, '0')}</span>
                </td>
                <td className="py-4 px-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-sm">
                      {p.nama.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-white font-medium text-sm">{p.nama}</span>
                  </div>
                </td>
                <td className="py-4 px-3 max-w-[200px]">
                  <div className="flex items-center gap-1.5 text-gray-400 text-sm">
                    <MapPin className="w-3.5 h-3.5 text-gray-600 shrink-0" />
                    <span className="truncate">{p.lokasi}</span>
                  </div>
                </td>
                <td className="py-4 px-3">
                  <a
                    href={`https://wa.me/${p.nomor_wa.replace(/\D/g, '').replace(/^0/, '62')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 text-sm transition-colors group/wa"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    {p.nomor_wa}
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover/wa:opacity-100 transition-opacity" />
                  </a>
                </td>
                <td className="py-4 px-3">
                  <PaketBadge paket={p.paket} />
                </td>
                <td className="py-4 px-3">
                  <StatusBadge status={p.status} />
                </td>
                <td className="py-4 px-3">
                  <div className="flex items-center gap-1 text-gray-500 text-xs">
                    <Calendar className="w-3 h-3" />
                    {formatDate(p.created_at)}
                  </div>
                </td>
                {isAdmin && (
                  <td className="py-4 px-3">
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onEdit(p)}
                        className="w-8 h-8 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 hover:border-blue-500/60 text-blue-400 rounded-lg flex items-center justify-center transition-all"
                        title="Edit"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDelete(p)}
                        className="w-8 h-8 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500/60 text-red-400 rounded-lg flex items-center justify-center transition-all"
                        title="Hapus"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {pelangganList.map((p, i) => (
          <div
            key={p.id}
            className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 space-y-3"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-sm">
                  {p.nama.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-white font-semibold">{p.nama}</p>
                  <p className="text-gray-500 text-xs">#{String(i + 1).padStart(2, '0')}</p>
                </div>
              </div>
              <StatusBadge status={p.status} />
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-1.5 text-gray-400">
                <MapPin className="w-3.5 h-3.5 text-gray-600" />
                <span className="truncate text-xs">{p.lokasi}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <PaketBadge paket={p.paket} />
              </div>
              <a
                href={`https://wa.me/${p.nomor_wa.replace(/\D/g, '').replace(/^0/, '62')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-emerald-400 text-xs"
              >
                <Phone className="w-3.5 h-3.5" />
                {p.nomor_wa}
              </a>
              <div className="flex items-center gap-1 text-gray-500 text-xs">
                <Calendar className="w-3 h-3" />
                {formatDate(p.created_at)}
              </div>
            </div>

            {isAdmin && (
              <div className="flex gap-2 pt-1 border-t border-gray-700">
                <button
                  onClick={() => onEdit(p)}
                  className="flex-1 flex items-center justify-center gap-2 py-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-lg text-sm transition-all"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  onClick={() => onDelete(p)}
                  className="flex-1 flex items-center justify-center gap-2 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg text-sm transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Hapus
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
