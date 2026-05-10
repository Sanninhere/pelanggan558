import { useState, useMemo, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import {
  Wifi, Users, UserCheck, UserX, Clock, Plus, Search,
  LogOut, Shield, RefreshCw, Database, Filter, X, Menu, ChevronDown,
  TrendingUp, Signal
} from 'lucide-react';
import { usePelanggan } from './hooks/usePelanggan';
import { Pelanggan, PelangganForm } from './types';
import LoginModal from './components/LoginModal';
import PelangganFormModal from './components/PelangganForm';
import DeleteModal from './components/DeleteModal';
import StatCard from './components/StatCard';
import PelangganTable from './components/PelangganTable';
import SetupGuide from './components/SetupGuide';

type ModalState =
  | { type: 'none' }
  | { type: 'login' }
  | { type: 'add' }
  | { type: 'edit'; pelanggan: Pelanggan }
  | { type: 'delete'; pelanggan: Pelanggan }
  | { type: 'setup' };

const SESSION_KEY = '588net_admin_session';

export default function App() {
  const {
    pelangganList, loading, saving, usingSupabase,
    fetchData, tambahPelanggan, editPelanggan, hapusPelanggan
  } = usePelanggan();

  const [isAdmin, setIsAdmin] = useState(() => {
    return sessionStorage.getItem(SESSION_KEY) === 'true';
  });
  const [modal, setModal] = useState<ModalState>({ type: 'none' });
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('Semua');
  const [filterPaket, setFilterPaket] = useState<string>('Semua');
  const [showFilters, setShowFilters] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Track last save time
  useEffect(() => {
    if (!loading) setLastSaved(new Date());
  }, [pelangganList, loading]);

  // Stats
  const stats = useMemo(() => {
    const total = pelangganList.length;
    const aktif = pelangganList.filter(p => p.status === 'Aktif').length;
    const nonAktif = pelangganList.filter(p => p.status === 'Non-Aktif').length;
    const pending = pelangganList.filter(p => p.status === 'Pending').length;
    return { total, aktif, nonAktif, pending };
  }, [pelangganList]);

  // Filtered list
  const filteredList = useMemo(() => {
    return pelangganList.filter(p => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        p.nama.toLowerCase().includes(q) ||
        p.lokasi.toLowerCase().includes(q) ||
        p.nomor_wa.includes(q) ||
        p.paket.toLowerCase().includes(q);
      const matchStatus = filterStatus === 'Semua' || p.status === filterStatus;
      const matchPaket = filterPaket === 'Semua' || p.paket === filterPaket;
      return matchSearch && matchStatus && matchPaket;
    });
  }, [pelangganList, search, filterStatus, filterPaket]);

  // Unique paket list
  const paketOptions = useMemo(() => {
    const unique = [...new Set(pelangganList.map(p => p.paket))];
    return unique.sort((a, b) => parseInt(a) - parseInt(b));
  }, [pelangganList]);

  const handleLogin = () => {
    setIsAdmin(true);
    sessionStorage.setItem(SESSION_KEY, 'true');
    setModal({ type: 'none' });
  };

  const handleLogout = () => {
    setIsAdmin(false);
    sessionStorage.removeItem(SESSION_KEY);
    setMobileMenuOpen(false);
  };

  const handleAdd = async (form: PelangganForm) => {
    const ok = await tambahPelanggan(form);
    if (ok) setLastSaved(new Date());
    return ok;
  };

  const handleEdit = async (form: PelangganForm) => {
    if (modal.type !== 'edit') return false;
    const ok = await editPelanggan(modal.pelanggan.id, form);
    if (ok) setLastSaved(new Date());
    return ok;
  };

  const handleDelete = async () => {
    if (modal.type !== 'delete') return;
    const ok = await hapusPelanggan(modal.pelanggan.id);
    if (ok) {
      setLastSaved(new Date());
      setModal({ type: 'none' });
    }
  };

  const clearFilters = () => {
    setSearch('');
    setFilterStatus('Semua');
    setFilterPaket('Semua');
  };

  const hasActiveFilters = search || filterStatus !== 'Semua' || filterPaket !== 'Semua';

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: '#1f2937', color: '#f3f4f6', border: '1px solid #374151' },
          success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        }}
      />

      {/* ── NAVBAR ──────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-gray-950/90 backdrop-blur-xl border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/30">
                  <Wifi className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-gray-950 animate-pulse" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white leading-none">588.NET</h1>
                <p className="text-gray-500 text-[10px] leading-none mt-0.5">Manajemen Pelanggan WiFi</p>
              </div>
            </div>

            {/* Desktop Nav */}
            <div className="hidden sm:flex items-center gap-3">
              {/* Supabase status */}
              <button
                onClick={() => setModal({ type: 'setup' })}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                  usingSupabase
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                    : 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/20'
                }`}
                title="Klik untuk panduan setup Supabase"
              >
                <Database className="w-3.5 h-3.5" />
                {usingSupabase ? 'Supabase Terhubung' : 'Mode Lokal'}
              </button>

              {/* Last saved */}
              {lastSaved && (
                <div className="flex items-center gap-1.5 text-xs text-gray-600">
                  <RefreshCw className="w-3 h-3" />
                  Tersimpan {lastSaved.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                </div>
              )}

              {/* Year */}
              <div className="text-xs text-gray-600 font-mono">© 2026</div>

              {/* Auth */}
              {isAdmin ? (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/30 px-3 py-1.5 rounded-lg">
                    <Shield className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="text-cyan-400 text-xs font-medium">Admin</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-400 hover:text-white text-xs transition-all"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Keluar
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setModal({ type: 'login' })}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-sm font-medium rounded-lg transition-all shadow-lg shadow-cyan-500/20"
                >
                  <Shield className="w-3.5 h-3.5" /> Login Admin
                </button>
              )}
            </div>

            {/* Mobile menu toggle */}
            <button
              className="sm:hidden p-2 text-gray-400 hover:text-white"
              onClick={() => setMobileMenuOpen(v => !v)}
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-t border-gray-800 bg-gray-900 px-4 py-3 space-y-3">
            <button
              onClick={() => { setModal({ type: 'setup' }); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm border ${
                usingSupabase
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'
              }`}
            >
              <Database className="w-4 h-4" />
              {usingSupabase ? 'Supabase Terhubung' : 'Mode Lokal — Lihat Panduan'}
            </button>
            {isAdmin ? (
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-2 bg-gray-800 border border-gray-700 text-gray-300 rounded-lg text-sm"
              >
                <LogOut className="w-4 h-4" /> Logout Admin
              </button>
            ) : (
              <button
                onClick={() => { setModal({ type: 'login' }); setMobileMenuOpen(false); }}
                className="w-full flex items-center justify-center gap-2 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg text-sm font-medium"
              >
                <Shield className="w-4 h-4" /> Login Admin
              </button>
            )}
          </div>
        )}
      </header>

      {/* ── MAIN ────────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Hero Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 via-blue-950 to-gray-900 border border-gray-800 p-6 sm:p-8">
          {/* BG decoration */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
          </div>

          <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Signal className="w-4 h-4 text-cyan-400" />
                <span className="text-cyan-400 text-sm font-medium tracking-wide">Internet Service Provider</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                Data Pelanggan <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">588.NET</span>
              </h2>
              <p className="text-gray-400 text-sm">
                Sistem manajemen pelanggan internet terpadu · Tahun 2026
              </p>
              {lastSaved && (
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                  Auto-saved · {lastSaved.toLocaleString('id-ID')}
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <button
                onClick={fetchData}
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 hover:text-white rounded-xl text-sm transition-all"
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              {isAdmin && (
                <button
                  onClick={() => setModal({ type: 'add' })}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98] text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Tambah Pelanggan
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard
            title="Total Pelanggan"
            value={stats.total}
            icon={Users}
            gradient="from-blue-500 to-cyan-500"
            shadowColor="shadow-blue-500/30"
            subtitle="Semua pelanggan"
          />
          <StatCard
            title="Aktif"
            value={stats.aktif}
            icon={UserCheck}
            gradient="from-emerald-500 to-teal-500"
            shadowColor="shadow-emerald-500/30"
            subtitle={`${stats.total > 0 ? Math.round((stats.aktif / stats.total) * 100) : 0}% dari total`}
          />
          <StatCard
            title="Non-Aktif"
            value={stats.nonAktif}
            icon={UserX}
            gradient="from-red-500 to-rose-500"
            shadowColor="shadow-red-500/30"
            subtitle="Perlu tindak lanjut"
          />
          <StatCard
            title="Pending"
            value={stats.pending}
            icon={Clock}
            gradient="from-yellow-500 to-amber-500"
            shadowColor="shadow-yellow-500/30"
            subtitle="Menunggu aktivasi"
          />
        </div>

        {/* Search & Filters */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Cari nama, lokasi, nomor WA, atau paket..."
                className="w-full bg-gray-900 border border-gray-800 text-white pl-11 pr-4 py-3 rounded-xl focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 transition-all placeholder-gray-600 text-sm"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filter toggle */}
            <button
              onClick={() => setShowFilters(v => !v)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                hasActiveFilters
                  ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-400'
                  : 'bg-gray-900 border-gray-800 text-gray-400 hover:border-gray-700 hover:text-white'
              }`}
            >
              <Filter className="w-4 h-4" />
              Filter
              {hasActiveFilters && (
                <span className="w-2 h-2 bg-cyan-400 rounded-full" />
              )}
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 px-4 py-3 rounded-xl border border-gray-800 bg-gray-900 text-gray-400 hover:text-white text-sm transition-all"
              >
                <X className="w-4 h-4" /> Reset
              </button>
            )}
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-gray-900 border border-gray-800 rounded-xl p-4">
              <div className="space-y-1.5">
                <label className="text-xs text-gray-500 font-medium uppercase tracking-wider">Status</label>
                <div className="flex flex-wrap gap-2">
                  {['Semua', 'Aktif', 'Non-Aktif', 'Pending'].map(s => (
                    <button
                      key={s}
                      onClick={() => setFilterStatus(s)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                        filterStatus === s
                          ? 'bg-cyan-500 border-cyan-400 text-white'
                          : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600 hover:text-white'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-gray-500 font-medium uppercase tracking-wider">Paket</label>
                <div className="flex flex-wrap gap-2">
                  {['Semua', ...paketOptions].map(pk => (
                    <button
                      key={pk}
                      onClick={() => setFilterPaket(pk)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                        filterPaket === pk
                          ? 'bg-blue-500 border-blue-400 text-white'
                          : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600 hover:text-white'
                      }`}
                    >
                      {pk}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Table Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          {/* Table header */}
          <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Daftar Pelanggan</h3>
                <p className="text-gray-500 text-xs">
                  {loading
                    ? 'Memuat data...'
                    : `${filteredList.length} dari ${pelangganList.length} pelanggan`
                  }
                </p>
              </div>
            </div>

            {!isAdmin && (
              <div className="flex items-center gap-2 text-xs text-gray-600 bg-gray-800 border border-gray-700 px-3 py-1.5 rounded-lg">
                <Shield className="w-3.5 h-3.5" />
                Mode Baca Saja
              </div>
            )}
          </div>

          {/* Loading state */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="relative">
                <div className="w-12 h-12 border-2 border-gray-800 rounded-full" />
                <div className="absolute inset-0 w-12 h-12 border-2 border-t-cyan-500 rounded-full animate-spin" />
              </div>
              <p className="text-gray-500 text-sm">Memuat data pelanggan...</p>
            </div>
          ) : (
            <div className="p-6">
              <PelangganTable
                pelangganList={filteredList}
                isAdmin={isAdmin}
                onEdit={(p) => setModal({ type: 'edit', pelanggan: p })}
                onDelete={(p) => setModal({ type: 'delete', pelanggan: p })}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="text-center py-6 border-t border-gray-800">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Wifi className="w-4 h-4 text-cyan-500" />
            <span className="text-white font-bold">588.NET</span>
          </div>
          <p className="text-gray-600 text-xs">
            Sistem Manajemen Pelanggan WiFi · 2026 · All Rights Reserved
          </p>
          <p className="text-gray-700 text-xs mt-1">
            {usingSupabase ? '🟢 Terhubung ke Supabase Database' : '🟡 Mode Lokal — Data tersimpan di browser ini'}
          </p>
        </footer>
      </main>

      {/* ── MODALS ──────────────────────────────────────────── */}
      {modal.type === 'login' && (
        <LoginModal
          onLogin={handleLogin}
          onClose={() => setModal({ type: 'none' })}
        />
      )}
      {modal.type === 'add' && (
        <PelangganFormModal
          mode="add"
          onSubmit={handleAdd}
          onClose={() => setModal({ type: 'none' })}
          saving={saving}
        />
      )}
      {modal.type === 'edit' && (
        <PelangganFormModal
          mode="edit"
          pelanggan={modal.pelanggan}
          onSubmit={handleEdit}
          onClose={() => setModal({ type: 'none' })}
          saving={saving}
        />
      )}
      {modal.type === 'delete' && (
        <DeleteModal
          pelanggan={modal.pelanggan}
          onConfirm={handleDelete}
          onClose={() => setModal({ type: 'none' })}
          saving={saving}
        />
      )}
      {modal.type === 'setup' && (
        <SetupGuide onClose={() => setModal({ type: 'none' })} />
      )}
    </div>
  );
}
