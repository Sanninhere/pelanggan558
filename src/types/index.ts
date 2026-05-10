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
  { label: '25 Mbps - Rp 165.000/bln', value: '25 Mbps' },
  { label: '40 Mbps - Rp 197.000/bln', value: '40 Mbps' },
  { label: '55 Mbps - Rp 245.000/bln', value: '55 Mbps' },
];

export const STATUS_LIST: Array<Pelanggan['status']> = ['Aktif', 'Non-Aktif', 'Pending'];

export const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: '558net2026@',
};
