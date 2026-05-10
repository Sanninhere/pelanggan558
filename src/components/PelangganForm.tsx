import React, { useState, useEffect } from 'react';
import { X, Save, User, MapPin, Phone, Package, Activity, AlertCircle } from 'lucide-react';
import { Pelanggan, PelangganForm as PelangganFormType, PAKET_LIST, STATUS_LIST } from '../types';

interface Props {
  mode: 'add' | 'edit';
  pelanggan?: Pelanggan;
  onSubmit: (form: PelangganFormType) => Promise<boolean>;
  onClose: () => void;
  saving: boolean;
}

const defaultForm: PelangganFormType = {
  nama: '',
  lokasi: '',
  nomor_wa: '',
  paket: '10 Mbps',
  status: 'Aktif',
};

export default function PelangganFormModal({ mode, pelanggan, onSubmit, onClose, saving }: Props) {
  const [form, setForm] = useState<PelangganFormType>(defaultForm);
  const [errors, setErrors] = useState<Partial<PelangganFormType>>({});

  useEffect(() => {
    if (mode === 'edit' && pelanggan) {
      setForm({
        nama: pelanggan.nama,
        lokasi: pelanggan.lokasi,
        nomor_wa: pelanggan.nomor_wa,
        paket: pelanggan.paket,
        status: pelanggan.status,
      });
    } else {
      setForm(defaultForm);
    }
    setErrors({});
  }, [mode, pelanggan]);

  const validate = (): boolean => {
    const newErrors: Partial<PelangganFormType> = {};
    if (!form.nama.trim()) newErrors.nama = 'Nama wajib diisi';
    if (!form.lokasi.trim()) newErrors.lokasi = 'Lokasi wajib diisi';
    if (!form.nomor_wa.trim()) newErrors.nomor_wa = 'Nomor WA wajib diisi';
    else if (!/^[0-9+\-\s()]{8,15}$/.test(form.nomor_wa.trim())) {
      newErrors.nomor_wa = 'Format nomor tidak valid';
    }
    if (!form.paket) newErrors.paket = 'Paket wajib dipilih';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const success = await onSubmit(form);
    if (success) onClose();
  };

  const handleChange = (field: keyof PelangganFormType, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg">
        {/* Glow */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl blur opacity-40" />

        <div className="relative bg-gray-900 rounded-2xl border border-gray-700 shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-4 border-b border-gray-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                {mode === 'add'
                  ? <User className="w-4 h-4 text-white" />
                  : <Save className="w-4 h-4 text-white" />
                }
              </div>
              <div>
                <h3 className="text-white font-semibold">
                  {mode === 'add' ? 'Tambah Pelanggan Baru' : 'Edit Data Pelanggan'}
                </h3>
                <p className="text-gray-500 text-xs">
                  {mode === 'add' ? 'Isi data lengkap pelanggan' : `Edit: ${pelanggan?.nama}`}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-white hover:bg-gray-700 p-1.5 rounded-lg transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Nama */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-xs font-medium text-gray-400 uppercase tracking-wider">
                <User className="w-3.5 h-3.5" /> Nama Pelanggan
              </label>
              <input
                type="text"
                value={form.nama}
                onChange={e => handleChange('nama', e.target.value)}
                placeholder="Contoh: Budi Santoso"
                className={`w-full bg-gray-800 border ${errors.nama ? 'border-red-500' : 'border-gray-700'} text-white px-4 py-3 rounded-xl focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/40 transition-all placeholder-gray-600 text-sm`}
              />
              {errors.nama && (
                <p className="text-red-400 text-xs flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.nama}
                </p>
              )}
            </div>

            {/* Lokasi */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-xs font-medium text-gray-400 uppercase tracking-wider">
                <MapPin className="w-3.5 h-3.5" /> Lokasi Instalasi
              </label>
              <input
                type="text"
                value={form.lokasi}
                onChange={e => handleChange('lokasi', e.target.value)}
                placeholder="Contoh: Jl. Merdeka No. 10, RT 02"
                className={`w-full bg-gray-800 border ${errors.lokasi ? 'border-red-500' : 'border-gray-700'} text-white px-4 py-3 rounded-xl focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/40 transition-all placeholder-gray-600 text-sm`}
              />
              {errors.lokasi && (
                <p className="text-red-400 text-xs flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.lokasi}
                </p>
              )}
            </div>

            {/* Nomor WA */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-xs font-medium text-gray-400 uppercase tracking-wider">
                <Phone className="w-3.5 h-3.5" /> Nomor WhatsApp
              </label>
              <input
                type="tel"
                value={form.nomor_wa}
                onChange={e => handleChange('nomor_wa', e.target.value)}
                placeholder="Contoh: 08123456789"
                className={`w-full bg-gray-800 border ${errors.nomor_wa ? 'border-red-500' : 'border-gray-700'} text-white px-4 py-3 rounded-xl focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/40 transition-all placeholder-gray-600 text-sm`}
              />
              {errors.nomor_wa && (
                <p className="text-red-400 text-xs flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.nomor_wa}
                </p>
              )}
            </div>

            {/* Paket & Status - 2 col */}
            <div className="grid grid-cols-2 gap-4">
              {/* Paket */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-xs font-medium text-gray-400 uppercase tracking-wider">
                  <Package className="w-3.5 h-3.5" /> Paket
                </label>
                <select
                  value={form.paket}
                  onChange={e => handleChange('paket', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/40 transition-all text-sm appearance-none cursor-pointer"
                >
                  {PAKET_LIST.map(p => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
              </div>

              {/* Status */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-xs font-medium text-gray-400 uppercase tracking-wider">
                  <Activity className="w-3.5 h-3.5" /> Status
                </label>
                <select
                  value={form.status}
                  onChange={e => handleChange('status', e.target.value as PelangganFormType['status'])}
                  className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/40 transition-all text-sm appearance-none cursor-pointer"
                >
                  {STATUS_LIST.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium py-3 rounded-xl transition-all border border-gray-700 hover:border-gray-600"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Menyimpan...' : mode === 'add' ? 'Tambah' : 'Simpan'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
