export interface Pelanggan {
  id: string;
  nama: string;
  lokasi: string;
  nomor_wa: string;
  paket: string;
  status: 'Aktif' | 'Non-Aktif' | 'Pending';
  created_at: string;
}

export type PelangganForm = Omit<Pelanggan, 'id' | 'created_at'>;

export const PAKET_LIST = [
  { label: '5 Mbps - Rp 100.000/bln', value: '5 Mbps' },
  { label: '10 Mbps - Rp 150.000/bln', value: '10 Mbps' },
  { label: '20 Mbps - Rp 200.000/bln', value: '20 Mbps' },
  { label: '30 Mbps - Rp 250.000/bln', value: '30 Mbps' },
  { label: '50 Mbps - Rp 350.000/bln', value: '50 Mbps' },
  { label: '100 Mbps - Rp 500.000/bln', value: '100 Mbps' },
];

export const STATUS_LIST: Array<Pelanggan['status']> = ['Aktif', 'Non-Aktif', 'Pending'];

export const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: '558net2026@',
};
