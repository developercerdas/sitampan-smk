import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Users, 
  Key, 
  Check, 
  X, 
  Lock, 
  Sparkles,
  Layers,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function MasterRulesView({ data }) {
  const [selectedRole, setSelectedRole] = useState('ADMIN');

  const roleRules = {
    ADMIN: {
      nama: 'Administrator Keuangan & Kasir TU',
      deskripsi: 'Memiliki hak akses penuh untuk transaksi tunai, mutasi VA, promosi siswa, master biaya, dan pergantian KOP.',
      permissions: [
        { nama: 'Loket Pembayaran Kasir (Tunai & VA)', status: true },
        { nama: 'Cetak Kuitansi Resmi & Stempel Lunas', status: true },
        { nama: 'Akses Rekapitulasi Buku Pager Semua Kelas', status: true },
        { nama: 'Ekspor Data Setoran ke Excel (.xlsx)', status: true },
        { nama: 'Wizard Kenaikan Kelas & Kelulusan Alumni', status: true },
        { nama: 'Manajemen Master Tarif Multi-Jurusan', status: true },
        { nama: 'Ubah Profil & KOP Surat / Kuitansi Sekolah', status: true },
        { nama: 'Konfigurasi Hak Akses & Role Pengguna', status: true }
      ]
    },
    WALI_KELAS: {
      nama: 'Wali Kelas (Guru Pendamping)',
      deskripsi: 'Dibatasi hanya dapat melihat dan memantau siswa pada rombel kelas binaannya sendiri.',
      permissions: [
        { nama: 'Monitoring Lembar Setoran Kelas Bimbingan', status: true },
        { nama: 'Ceklis Syarat Pengambilan Rapor Siswa', status: true },
        { nama: 'Cetak Tagihan Tunggakan Siswa Bimbingan', status: true },
        { nama: 'Akses Kelas Lain', status: false },
        { nama: 'Input Transaksi Kasir / Keuangan', status: false },
        { nama: 'Ubah Tarif & Pos Biaya', status: false },
        { nama: 'Ubah KOP Surat & Logo Sekolah', status: false }
      ]
    },
    ORTU: {
      nama: 'Siswa & Orang Tua Murid',
      deskripsi: 'Hanya dapat melihat data pribadi siswa yang bersangkutan menggunakan verifikasi NIS dan Tanggal Lahir.',
      permissions: [
        { nama: 'Kartu SPP Digital 12 Bulan (Juli–Juni)', status: true },
        { nama: 'Cek Rincian Sisa Tunggakan Berjalan', status: true },
        { nama: 'Salin Kode Virtual Account (VA) untuk Transfer', status: true },
        { nama: 'Unduh Bukti Kuitansi Pembayaran Lunas', status: true },
        { nama: 'Melihat Data Siswa Lain', status: false },
        { nama: 'Akses Rekapitulasi Kasir Sekolah', status: false },
        { nama: 'Ubah Data Keuangan / Tagihan', status: false }
      ]
    }
  };

  const currentRoleConfig = roleRules[selectedRole];

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-teal-800 via-indigo-900 to-slate-900 text-white p-6 rounded-2xl shadow-md">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-xs">
            <ShieldCheck className="w-8 h-8 text-teal-300" />
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-tight">
              Master Hak Akses & Penentuan Rule Pengguna
            </h2>
            <p className="text-teal-100 text-sm mt-0.5">
              Menentukan hak akses sistem dan membatasi menu yang tampil di sidebar sesuai peran (Kasir TU, Wali Kelas, atau Siswa/Ortu).
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Kolom Kiri: Pilihan Role (4 Kolom) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <p className="text-xs font-bold text-slate-500 uppercase px-2 mb-2">
              Daftar Peran (Role) Sistem:
            </p>

            <button
              onClick={() => setSelectedRole('ADMIN')}
              className={`w-full text-left p-3.5 rounded-xl border transition flex items-center justify-between ${
                selectedRole === 'ADMIN'
                  ? 'bg-blue-50 border-blue-500 shadow-xs ring-1 ring-blue-500'
                  : 'bg-white border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div>
                <p className="font-bold text-sm text-slate-900">Kasir & Admin TU</p>
                <p className="text-xs text-slate-500">Akses Penuh Seluruh Modul</p>
              </div>
              <span className="text-xs font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                Full Akses
              </span>
            </button>

            <button
              onClick={() => setSelectedRole('WALI_KELAS')}
              className={`w-full text-left p-3.5 rounded-xl border transition flex items-center justify-between ${
                selectedRole === 'WALI_KELAS'
                  ? 'bg-indigo-50 border-indigo-500 shadow-xs ring-1 ring-indigo-500'
                  : 'bg-white border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div>
                <p className="font-bold text-sm text-slate-900">Wali Kelas</p>
                <p className="text-xs text-slate-500">Monitoring Kelas Bimbingan</p>
              </div>
              <span className="text-xs font-bold bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded">
                Terbatas
              </span>
            </button>

            <button
              onClick={() => setSelectedRole('ORTU')}
              className={`w-full text-left p-3.5 rounded-xl border transition flex items-center justify-between ${
                selectedRole === 'ORTU'
                  ? 'bg-emerald-50 border-emerald-500 shadow-xs ring-1 ring-emerald-500'
                  : 'bg-white border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div>
                <p className="font-bold text-sm text-slate-900">Siswa & Orang Tua</p>
                <p className="text-xs text-slate-500">Verifikasi NIS & Tgl Lahir</p>
              </div>
              <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                Personal
              </span>
            </button>
          </div>
        </div>

        {/* Kolom Kanan: Detail Izin & Rule Matrix (8 Kolom) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
            <div className="pb-4 border-b border-slate-200">
              <span className="text-xs font-extrabold uppercase px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                Rule Matrix
              </span>
              <h3 className="text-lg font-black text-slate-900 mt-2">
                {currentRoleConfig.nama}
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                {currentRoleConfig.deskripsi}
              </p>
            </div>

            {/* Daftar Izin Akses */}
            <div>
              <h4 className="text-xs font-bold text-slate-700 uppercase mb-3">
                Daftar Hak Akses Menu & Aksi:
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {currentRoleConfig.permissions.map((perm, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border flex items-center justify-between ${
                      perm.status
                        ? 'bg-emerald-50/50 border-emerald-200'
                        : 'bg-slate-50 border-slate-200 opacity-60'
                    }`}
                  >
                    <span className="text-xs font-bold text-slate-800">{perm.nama}</span>
                    {perm.status ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                        <Check className="w-3.5 h-3.5" /> Diizinkan
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 bg-slate-200 px-2 py-0.5 rounded">
                        <X className="w-3.5 h-3.5" /> Dikunci
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
