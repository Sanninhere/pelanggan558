import { AlertTriangle, Trash2, X } from 'lucide-react';
import { Pelanggan } from '../types';

interface Props {
  pelanggan: Pelanggan;
  onConfirm: () => void;
  onClose: () => void;
  saving: boolean;
}

export default function DeleteModal({ pelanggan, onConfirm, onClose, saving }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl blur opacity-40" />
        <div className="relative bg-gray-900 rounded-2xl border border-gray-700 shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gray-800 px-6 py-4 border-b border-gray-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-red-500/20 border border-red-500/40 rounded-lg flex items-center justify-center">
                <Trash2 className="w-4 h-4 text-red-400" />
              </div>
              <h3 className="text-white font-semibold">Hapus Pelanggan</h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-white hover:bg-gray-700 p-1.5 rounded-lg transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <p className="text-white font-medium mb-1">
                  Yakin ingin menghapus pelanggan ini?
                </p>
                <p className="text-gray-400 text-sm">
                  Data <span className="text-white font-semibold">{pelanggan.nama}</span> akan dihapus
                  secara permanen dan tidak dapat dikembalikan.
                </p>
              </div>
            </div>

            {/* Info Card */}
            <div className="bg-gray-800 rounded-xl p-4 mb-6 border border-gray-700 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Nama</span>
                <span className="text-white font-medium">{pelanggan.nama}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Lokasi</span>
                <span className="text-white font-medium text-right max-w-[200px]">{pelanggan.lokasi}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Paket</span>
                <span className="text-cyan-400 font-medium">{pelanggan.paket}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium py-3 rounded-xl transition-all border border-gray-700"
              >
                Batal
              </button>
              <button
                onClick={onConfirm}
                disabled={saving}
                className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-500/20"
              >
                <Trash2 className="w-4 h-4" />
                {saving ? 'Menghapus...' : 'Hapus Sekarang'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
