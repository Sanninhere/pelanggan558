import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Pelanggan, PelangganForm } from '../types';
import toast from 'react-hot-toast';

const TABLE = 'pelanggan';

// Fallback: LocalStorage key jika Supabase belum dikonfigurasi
const LS_KEY = '588net_pelanggan';

function isSupabaseConfigured(): boolean {
  const url = import.meta.env.VITE_SUPABASE_URL || '';
  return url.startsWith('https://') && !url.includes('your-project');
}

function loadFromLocalStorage(): Pelanggan[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveToLocalStorage(data: Pelanggan[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(data));
}

export function usePelanggan() {
  const [pelangganList, setPelangganList] = useState<Pelanggan[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [usingSupabase] = useState(isSupabaseConfigured());

  // ── FETCH ALL ──────────────────────────────────────────────
  const fetchData = useCallback(async () => {
    setLoading(true);
    if (usingSupabase) {
      const { data, error } = await supabase
        .from(TABLE)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase fetch error:', error);
        toast.error('Gagal memuat data dari server');
        // Fallback ke localStorage
        setPelangganList(loadFromLocalStorage());
      } else {
        const list = (data as Pelanggan[]) ?? [];
        setPelangganList(list);
        saveToLocalStorage(list); // sync backup
      }
    } else {
      // Mode offline / demo - pakai localStorage
      setPelangganList(loadFromLocalStorage());
    }
    setLoading(false);
  }, [usingSupabase]);

  // ── INSERT ──────────────────────────────────────────────────
  const tambahPelanggan = async (form: PelangganForm): Promise<boolean> => {
    setSaving(true);
    const toastId = toast.loading('Menyimpan data pelanggan...');

    if (usingSupabase) {
      const { data, error } = await supabase
        .from(TABLE)
        .insert([form])
        .select()
        .single();

      if (error) {
        console.error('Insert error:', error);
        toast.error('Gagal menyimpan ke database', { id: toastId });
        setSaving(false);
        return false;
      }
      // Realtime akan handle update list, tapi kita tetap update manual juga
      setPelangganList(prev => {
        const updated = [data as Pelanggan, ...prev];
        saveToLocalStorage(updated);
        return updated;
      });
      toast.success('✅ Pelanggan berhasil ditambahkan!', { id: toastId });
    } else {
      // Offline mode
      const newEntry: Pelanggan = {
        ...form,
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
      };
      setPelangganList(prev => {
        const updated = [newEntry, ...prev];
        saveToLocalStorage(updated);
        return updated;
      });
      toast.success('✅ Pelanggan berhasil ditambahkan! (Mode Lokal)', { id: toastId });
    }

    setSaving(false);
    return true;
  };

  // ── UPDATE ──────────────────────────────────────────────────
  const editPelanggan = async (id: string, form: PelangganForm): Promise<boolean> => {
    setSaving(true);
    const toastId = toast.loading('Memperbarui data pelanggan...');

    if (usingSupabase) {
      const { data, error } = await supabase
        .from(TABLE)
        .update(form)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Update error:', error);
        toast.error('Gagal memperbarui data', { id: toastId });
        setSaving(false);
        return false;
      }
      setPelangganList(prev => {
        const updated = prev.map(p => (p.id === id ? (data as Pelanggan) : p));
        saveToLocalStorage(updated);
        return updated;
      });
      toast.success('✅ Data pelanggan berhasil diperbarui!', { id: toastId });
    } else {
      setPelangganList(prev => {
        const updated = prev.map(p =>
          p.id === id ? { ...p, ...form } : p
        );
        saveToLocalStorage(updated);
        return updated;
      });
      toast.success('✅ Data berhasil diperbarui! (Mode Lokal)', { id: toastId });
    }

    setSaving(false);
    return true;
  };

  // ── DELETE ──────────────────────────────────────────────────
  const hapusPelanggan = async (id: string): Promise<boolean> => {
    setSaving(true);
    const toastId = toast.loading('Menghapus data pelanggan...');

    if (usingSupabase) {
      const { error } = await supabase
        .from(TABLE)
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Delete error:', error);
        toast.error('Gagal menghapus data', { id: toastId });
        setSaving(false);
        return false;
      }
      setPelangganList(prev => {
        const updated = prev.filter(p => p.id !== id);
        saveToLocalStorage(updated);
        return updated;
      });
      toast.success('🗑️ Pelanggan berhasil dihapus!', { id: toastId });
    } else {
      setPelangganList(prev => {
        const updated = prev.filter(p => p.id !== id);
        saveToLocalStorage(updated);
        return updated;
      });
      toast.success('🗑️ Pelanggan berhasil dihapus! (Mode Lokal)', { id: toastId });
    }

    setSaving(false);
    return true;
  };

  // ── REALTIME SUBSCRIPTION ────────────────────────────────────
  useEffect(() => {
    fetchData();

    if (!usingSupabase) return;

    const channel = supabase
      .channel('pelanggan-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: TABLE },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setPelangganList(prev => {
              const exists = prev.find(p => p.id === (payload.new as Pelanggan).id);
              if (exists) return prev;
              const updated = [payload.new as Pelanggan, ...prev];
              saveToLocalStorage(updated);
              return updated;
            });
          }
          if (payload.eventType === 'UPDATE') {
            setPelangganList(prev => {
              const updated = prev.map(p =>
                p.id === (payload.new as Pelanggan).id ? payload.new as Pelanggan : p
              );
              saveToLocalStorage(updated);
              return updated;
            });
          }
          if (payload.eventType === 'DELETE') {
            setPelangganList(prev => {
              const updated = prev.filter(p => p.id !== (payload.old as Pelanggan).id);
              saveToLocalStorage(updated);
              return updated;
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchData, usingSupabase]);

  return {
    pelangganList,
    loading,
    saving,
    usingSupabase,
    fetchData,
    tambahPelanggan,
    editPelanggan,
    hapusPelanggan,
  };
}
