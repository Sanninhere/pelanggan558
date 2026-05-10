import { X, Database, Copy, Check, ExternalLink, Terminal, Key, Globe } from 'lucide-react';
import { useState } from 'react';

interface Props {
  onClose: () => void;
}

const SQL_SCRIPT = `-- 1. Buat tabel pelanggan
CREATE TABLE IF NOT EXISTS pelanggan (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nama        TEXT NOT NULL,
  lokasi      TEXT NOT NULL,
  nomor_wa    TEXT NOT NULL,
  paket       TEXT NOT NULL,
  status      TEXT NOT NULL DEFAULT 'Aktif',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Aktifkan Realtime
ALTER TABLE pelanggan REPLICA IDENTITY FULL;

-- 3. Nonaktifkan RLS (untuk akses publik)
ALTER TABLE pelanggan DISABLE ROW LEVEL SECURITY;

-- 4. Index untuk performa
CREATE INDEX IF NOT EXISTS idx_pelanggan_nama 
  ON pelanggan(nama);
CREATE INDEX IF NOT EXISTS idx_pelanggan_status 
  ON pelanggan(status);
CREATE INDEX IF NOT EXISTS idx_pelanggan_created 
  ON pelanggan(created_at DESC);`;

const ENV_EXAMPLE = `VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`;

export default function SetupGuide({ onClose }: Props) {
  const [copiedSql, setCopiedSql] = useState(false);
  const [copiedEnv, setCopiedEnv] = useState(false);

  const copyText = (text: string, setter: (v: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setter(true);
    setTimeout(() => setter(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl my-8">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-2xl blur opacity-30" />
        <div className="relative bg-gray-900 rounded-2xl border border-gray-700 shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-900/50 to-cyan-900/50 px-6 py-4 border-b border-gray-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <Database className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Panduan Setup Supabase</h3>
                <p className="text-gray-400 text-xs">Hubungkan 588.NET ke database permanen</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-white hover:bg-gray-700 p-1.5 rounded-lg transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
            {/* Step 1 */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
                  1
                </div>
                <h4 className="text-white font-semibold">Buat Akun & Project Supabase</h4>
              </div>
              <div className="ml-10 space-y-2 text-sm text-gray-400">
                <p>• Buka <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline inline-flex items-center gap-1">supabase.com <ExternalLink className="w-3 h-3" /></a> dan daftar/login</p>
                <p>• Klik <span className="text-white font-medium">"New Project"</span> dan beri nama (contoh: <code className="bg-gray-800 px-1.5 py-0.5 rounded text-cyan-300 text-xs">588net</code>)</p>
                <p>• Tunggu hingga project selesai dibuat (~1-2 menit)</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
                  2
                </div>
                <h4 className="text-white font-semibold">Jalankan SQL untuk Membuat Tabel</h4>
              </div>
              <div className="ml-10 space-y-3">
                <p className="text-sm text-gray-400">
                  Buka <span className="text-white">SQL Editor</span> di dashboard Supabase, paste kode berikut lalu klik <span className="text-green-400 font-medium">Run</span>:
                </p>
                <div className="relative">
                  <pre className="bg-gray-950 border border-gray-800 rounded-xl p-4 text-xs text-cyan-300 overflow-x-auto leading-relaxed font-mono">
                    {SQL_SCRIPT}
                  </pre>
                  <button
                    onClick={() => copyText(SQL_SCRIPT, setCopiedSql)}
                    className="absolute top-3 right-3 flex items-center gap-1.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 text-xs px-3 py-1.5 rounded-lg transition-all"
                  >
                    {copiedSql ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedSql ? 'Tersalin!' : 'Salin'}
                  </button>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
                  3
                </div>
                <h4 className="text-white font-semibold">Salin URL & API Key</h4>
              </div>
              <div className="ml-10 space-y-2 text-sm text-gray-400">
                <p>• Di Supabase dashboard → <span className="text-white">Settings → API</span></p>
                <p>• Salin <span className="text-cyan-400 font-medium">Project URL</span> (format: <code className="bg-gray-800 px-1 py-0.5 rounded text-xs">https://xxx.supabase.co</code>)</p>
                <p>• Salin <span className="text-cyan-400 font-medium">anon public</span> key</p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
                  4
                </div>
                <h4 className="text-white font-semibold flex items-center gap-2">
                  <Key className="w-4 h-4" /> Taruh di Environment Variables
                </h4>
              </div>
              <div className="ml-10 space-y-3">
                <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 space-y-2">
                  <div className="flex items-center gap-2 mb-3">
                    <Terminal className="w-4 h-4 text-orange-400" />
                    <p className="text-white text-sm font-medium">Cara A: File .env (Lokal / Netlify)</p>
                  </div>
                  <p className="text-gray-400 text-xs">Buat file <code className="bg-gray-900 px-1.5 py-0.5 rounded text-cyan-300">.env</code> di root project:</p>
                  <div className="relative">
                    <pre className="bg-gray-950 border border-gray-800 rounded-lg p-3 text-xs text-green-300 font-mono">
                      {ENV_EXAMPLE}
                    </pre>
                    <button
                      onClick={() => copyText(ENV_EXAMPLE, setCopiedEnv)}
                      className="absolute top-2 right-2 flex items-center gap-1 bg-gray-800 border border-gray-700 text-gray-400 text-xs px-2 py-1 rounded-lg transition-all hover:bg-gray-700"
                    >
                      {copiedEnv ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>

                <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 space-y-2">
                  <div className="flex items-center gap-2 mb-3">
                    <Globe className="w-4 h-4 text-blue-400" />
                    <p className="text-white text-sm font-medium">Cara B: Netlify Environment Variables</p>
                  </div>
                  <ol className="text-gray-400 text-xs space-y-1.5">
                    <li>1. Buka Netlify Dashboard → pilih site kamu</li>
                    <li>2. Pergi ke <span className="text-white">Site Settings → Environment Variables</span></li>
                    <li>3. Klik <span className="text-green-400">Add a variable</span></li>
                    <li>4. Tambahkan: <code className="bg-gray-900 px-1 py-0.5 rounded text-cyan-300">VITE_SUPABASE_URL</code></li>
                    <li>5. Tambahkan: <code className="bg-gray-900 px-1 py-0.5 rounded text-cyan-300">VITE_SUPABASE_ANON_KEY</code></li>
                    <li>6. <span className="text-yellow-400">Redeploy</span> site agar perubahan berlaku</li>
                  </ol>
                </div>
              </div>
            </div>

            {/* Step 5 */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
                  5
                </div>
                <h4 className="text-white font-semibold">Aktifkan Realtime di Supabase</h4>
              </div>
              <div className="ml-10 text-sm text-gray-400 space-y-1.5">
                <p>• Buka <span className="text-white">Database → Replication</span></p>
                <p>• Aktifkan toggle untuk tabel <code className="bg-gray-800 px-1.5 py-0.5 rounded text-cyan-300 text-xs">pelanggan</code></p>
                <p>• Data akan ter-sinkron otomatis di semua tab/browser! 🎉</p>
              </div>
            </div>

            {/* Status indicator */}
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
              <p className="text-yellow-400 text-sm font-medium mb-1">⚠️ Mode Saat Ini</p>
              <p className="text-gray-400 text-xs">
                Aplikasi sedang berjalan dalam <strong className="text-white">mode lokal (localStorage)</strong> karena Supabase belum dikonfigurasi.
                Data tidak akan hilang di browser ini, tapi tidak tersinkron antar perangkat.
                Hubungkan ke Supabase untuk penyimpanan permanen.
              </p>
            </div>
          </div>

          <div className="px-6 py-4 border-t border-gray-700">
            <button
              onClick={onClose}
              className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-semibold py-3 rounded-xl transition-all hover:opacity-90"
            >
              Mengerti, Tutup Panduan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
