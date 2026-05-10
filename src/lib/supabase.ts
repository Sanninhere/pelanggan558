import { createClient } from '@supabase/supabase-js';

// ============================================================
// 🔧 KONFIGURASI SUPABASE - BACA INSTRUKSI DI BAWAH
// ============================================================
//
// LANGKAH-LANGKAH MENGHUBUNGKAN KE SUPABASE:
//
// 1. Buka https://supabase.com dan login / buat akun
//
// 2. Buat project baru (misal: "588net-pelanggan")
//
// 3. Setelah project dibuat, buka:
//    Settings → API
//    Salin:
//      - "Project URL"  → ganti nilai SUPABASE_URL di bawah
//      - "anon public"  → ganti nilai SUPABASE_ANON_KEY di bawah
//
// 4. Buka SQL Editor di Supabase, lalu jalankan SQL berikut:
//
//    -- Buat tabel pelanggan
//    CREATE TABLE pelanggan (
//      id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
//      nama        TEXT NOT NULL,
//      lokasi      TEXT NOT NULL,
//      nomor_wa    TEXT NOT NULL,
//      paket       TEXT NOT NULL,
//      status      TEXT NOT NULL DEFAULT 'Aktif',
//      created_at  TIMESTAMPTZ DEFAULT NOW()
//    );
//
//    -- Aktifkan Realtime untuk tabel pelanggan
//    ALTER TABLE pelanggan REPLICA IDENTITY FULL;
//
//    -- Nonaktifkan RLS agar data bisa diakses tanpa login Supabase
//    ALTER TABLE pelanggan DISABLE ROW LEVEL SECURITY;
//
// 5. (Opsional untuk Netlify) Tambahkan environment variables di:
//    Netlify → Site Settings → Environment Variables:
//      VITE_SUPABASE_URL  = [Project URL kamu]
//      VITE_SUPABASE_ANON_KEY = [anon public key kamu]
//    Lalu ganti baris di bawah menjadi:
//      const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
//      const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
//
// ============================================================

// Ganti dua baris ini dengan nilai dari Supabase-mu:
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key-here';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ============================================================
// SQL LENGKAP UNTUK DIJALANKAN DI SUPABASE SQL EDITOR:
// ============================================================
/*

CREATE TABLE IF NOT EXISTS pelanggan (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nama        TEXT NOT NULL,
  lokasi      TEXT NOT NULL,
  nomor_wa    TEXT NOT NULL,
  paket       TEXT NOT NULL,
  status      TEXT NOT NULL DEFAULT 'Aktif',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE pelanggan REPLICA IDENTITY FULL;
ALTER TABLE pelanggan DISABLE ROW LEVEL SECURITY;

-- Tambah index untuk performa
CREATE INDEX IF NOT EXISTS idx_pelanggan_nama ON pelanggan(nama);
CREATE INDEX IF NOT EXISTS idx_pelanggan_status ON pelanggan(status);
CREATE INDEX IF NOT EXISTS idx_pelanggan_created_at ON pelanggan(created_at DESC);

*/
