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
    KEPALA_SEKOLAH: {
      nama: 'Kepala Sekolah (Supervisi Eksekutif)',
      subjudul: 'Drs. H. Mulyadi, M.Pd.',
      deskripsi: 'Akses supervisi dan audit eksekutif untuk memantau performa keuangan, persentase setoran semua rombel, kartu SPP siswa, dan data induk sekolah.',
      badge: 'Eksekutif',
      badgeColor: 'bg-purple-100 text-purple-800',
      activeClass: 'bg-purple-50 border-purple-500 shadow-xs ring-1 ring-purple-500',
      permissions: [
        { nama: 'Dashboard Eksekutif & Real-Time KPI Keuangan', status: true },
        { nama: 'Laporan Setoran Seluruh Kelas (Folio Pager)', status: true },
        { nama: 'Monitoring & Audit Kartu SPP Siswa', status: true },
        { nama: 'Ekspor Rekapitulasi Laporan ke Excel (.xlsx)', status: true },
        { nama: 'Supervisi Data Induk Siswa & Daftar Kelas', status: true },
        { nama: 'Supervisi Struktur Tarif & Pos Biaya', status: true },
        { nama: 'Tinjau Profil & Legalitas Sekolah', status: true },
        { nama: 'Input Transaksi Kasir / Terima Uang Tunai', status: false },
        { nama: 'Ubah Data Tarif & Konfigurasi Sistem', status: false }
      ]
    },
    BENDAHARA: {
      nama: 'Bendahara Sekolah (Finance & Treasury Officer)',
      subjudul: 'Hj. Siti Nurhaliza, S.E.',
      deskripsi: 'Pengelolaan kas masuk, rekonsiliasi pembayaran tunai & VA, monitoring buku pager, verifikasi penerimaan SPP, dan konfigurasi master tarif.',
      badge: 'Treasury',
      badgeColor: 'bg-emerald-100 text-emerald-800',
      activeClass: 'bg-emerald-50 border-emerald-500 shadow-xs ring-1 ring-emerald-500',
      permissions: [
        { nama: 'Dashboard Real-Time Kas & Penerimaan', status: true },
        { nama: 'Loket Pembayaran Kasir (Tunai & VA)', status: true },
        { nama: 'Cetak Kuitansi Resmi & Stempel Lunas', status: true },
        { nama: 'Rekapitulasi Buku Pager Semua Rombel', status: true },
        { nama: 'Manajemen Master Tarif Multi-Jurusan & DSP', status: true },
        { nama: 'Supervisi Master Siswa, Kelas & Jurusan', status: true },
        { nama: 'Ekspor Data Setoran ke Excel (.xlsx)', status: true },
        { nama: 'Wizard Kenaikan Kelas & Kelulusan Alumni', status: false },
        { nama: 'Ubah Profil Sekolah & Hak Akses Pengguna', status: false }
      ]
    },
    ADMIN: {
      nama: 'Administrator Pusat & Koordinator TU',
      subjudul: 'Ahmad Junaidi, S.Kom.',
      deskripsi: 'Memiliki hak akses penuh untuk transaksi tunai semua jurusan, pembagian loket kasir, mutasi VA, promosi siswa, master biaya, dan pergantian KOP.',
      badge: 'Full Akses',
      badgeColor: 'bg-slate-100 text-slate-800',
      activeClass: 'bg-slate-100 border-slate-500 shadow-xs ring-1 ring-slate-500',
      permissions: [
        { nama: 'Loket Pembayaran Kasir (Semua 5 Jurusan)', status: true },
        { nama: 'Pembagian & Supervisi Kasir (Hana & Umi)', status: true },
        { nama: 'Cetak Kuitansi Resmi & Stempel Lunas', status: true },
        { nama: 'Akses Rekapitulasi Buku Pager Semua Kelas', status: true },
        { nama: 'Ekspor Data Setoran ke Excel (.xlsx)', status: true },
        { nama: 'Wizard Kenaikan Kelas & Kelulusan Alumni', status: true },
        { nama: 'Manajemen Master Tarif Multi-Jurusan', status: true },
        { nama: 'Ubah Profil & KOP Surat / Kuitansi Sekolah', status: true },
        { nama: 'Konfigurasi Hak Akses & Role Pengguna', status: true }
      ]
    },
    KASIR_HANA: {
      nama: 'Kasir 1: Hana (Kelompok Bisnis & Manajemen)',
      subjudul: 'Hana Pratiwi, A.Md.',
      deskripsi: 'Bertanggung jawab melayani pembayaran, mutasi VA, dan kartu SPP siswa khusus jurusan AKL, MPLB, dan PM.',
      badge: 'Kasir BisMan',
      badgeColor: 'bg-blue-100 text-blue-800',
      activeClass: 'bg-blue-50 border-blue-500 shadow-xs ring-1 ring-blue-500',
      permissions: [
        { nama: 'Loket Kasir Siswa AKL, MPLB, & PM', status: true },
        { nama: 'Cetak Kuitansi Resmi Stempel Kasir Hana', status: true },
        { nama: 'Buku Pager Setoran Rombel Bisnis Manajemen', status: true },
        { nama: 'Ekspor Setoran Kasir BisMan ke Excel', status: true },
        { nama: 'Monitoring Kartu SPP Siswa AKL, MPLB, PM', status: true },
        { nama: 'Akses Siswa Kelompok Pariwisata', status: false },
        { nama: 'Ubah Struktur Master Tarif & Pos Biaya', status: false },
        { nama: 'Ubah KOP Surat & Hak Akses Pengguna', status: false }
      ]
    },
    KASIR_UMI: {
      nama: 'Kasir 2: Umi (Kelompok Pariwisata)',
      subjudul: 'Umi Kalsum, S.E.',
      deskripsi: 'Bertanggung jawab melayani pembayaran, mutasi VA, dan kartu SPP siswa khusus jurusan Kecantikan & Spa dan Perhotelan.',
      badge: 'Kasir Pariwisata',
      badgeColor: 'bg-rose-100 text-rose-800',
      activeClass: 'bg-rose-50 border-rose-500 shadow-xs ring-1 ring-rose-500',
      permissions: [
        { nama: 'Loket Kasir Siswa Kecantikan & Perhotelan', status: true },
        { nama: 'Cetak Kuitansi Resmi Stempel Kasir Umi', status: true },
        { nama: 'Buku Pager Setoran Rombel Pariwisata', status: true },
        { nama: 'Ekspor Setoran Kasir Pariwisata ke Excel', status: true },
        { nama: 'Monitoring Kartu SPP Siswa KSP & HTL', status: true },
        { nama: 'Akses Siswa Kelompok Bisnis Manajemen', status: false },
        { nama: 'Ubah Struktur Master Tarif & Pos Biaya', status: false },
        { nama: 'Ubah KOP Surat & Hak Akses Pengguna', status: false }
      ]
    },
    WALI_KELAS: {
      nama: 'Wali Kelas (Guru Pendamping)',
      subjudul: 'Ibu Rini / Dra. Hj. Sri Lestari',
      deskripsi: 'Dibatasi hanya dapat melihat dan memantau siswa pada rombel kelas binaannya sendiri.',
      badge: 'Terbatas',
      badgeColor: 'bg-indigo-100 text-indigo-800',
      activeClass: 'bg-indigo-50 border-indigo-500 shadow-xs ring-1 ring-indigo-500',
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
      subjudul: 'Abi Priyanto / Dian Verawati',
      deskripsi: 'Hanya dapat melihat data pribadi siswa yang bersangkutan menggunakan verifikasi NIS dan Tanggal Lahir.',
      badge: 'Personal',
      badgeColor: 'bg-amber-100 text-amber-800',
      activeClass: 'bg-amber-50 border-amber-500 shadow-xs ring-1 ring-amber-500',
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

  const currentRoleConfig = roleRules[selectedRole] || roleRules.ADMIN;

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
              Menentukan hak akses sistem dan membatasi menu yang tampil di sidebar sesuai peran (Kepala Sekolah, Bendahara, Kasir TU, Wali Kelas, atau Siswa/Ortu).
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
              onClick={() => setSelectedRole('KEPALA_SEKOLAH')}
              className={`w-full text-left p-3.5 rounded-xl border transition flex items-center justify-between ${
                selectedRole === 'KEPALA_SEKOLAH'
                  ? roleRules.KEPALA_SEKOLAH.activeClass
                  : 'bg-white border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div>
                <p className="font-bold text-sm text-slate-900">🏛️ Kepala Sekolah</p>
                <p className="text-xs text-slate-500">{roleRules.KEPALA_SEKOLAH.subjudul}</p>
              </div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded ${roleRules.KEPALA_SEKOLAH.badgeColor}`}>
                {roleRules.KEPALA_SEKOLAH.badge}
              </span>
            </button>

            <button
              onClick={() => setSelectedRole('BENDAHARA')}
              className={`w-full text-left p-3.5 rounded-xl border transition flex items-center justify-between ${
                selectedRole === 'BENDAHARA'
                  ? roleRules.BENDAHARA.activeClass
                  : 'bg-white border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div>
                <p className="font-bold text-sm text-slate-900">💰 Bendahara Sekolah</p>
                <p className="text-xs text-slate-500">{roleRules.BENDAHARA.subjudul}</p>
              </div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded ${roleRules.BENDAHARA.badgeColor}`}>
                {roleRules.BENDAHARA.badge}
              </span>
            </button>

            <button
              onClick={() => setSelectedRole('ADMIN')}
              className={`w-full text-left p-3.5 rounded-xl border transition flex items-center justify-between ${
                selectedRole === 'ADMIN'
                  ? roleRules.ADMIN.activeClass
                  : 'bg-white border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div>
                <p className="font-bold text-sm text-slate-900">🏢 Admin Pusat TU</p>
                <p className="text-xs text-slate-500">{roleRules.ADMIN.subjudul}</p>
              </div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded ${roleRules.ADMIN.badgeColor}`}>
                {roleRules.ADMIN.badge}
              </span>
            </button>

            <button
              onClick={() => setSelectedRole('KASIR_HANA')}
              className={`w-full text-left p-3.5 rounded-xl border transition flex items-center justify-between ${
                selectedRole === 'KASIR_HANA'
                  ? roleRules.KASIR_HANA.activeClass
                  : 'bg-white border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div>
                <p className="font-bold text-sm text-slate-900">💼 Kasir Hana (BisMan)</p>
                <p className="text-xs text-slate-500">{roleRules.KASIR_HANA.subjudul}</p>
              </div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded ${roleRules.KASIR_HANA.badgeColor}`}>
                {roleRules.KASIR_HANA.badge}
              </span>
            </button>

            <button
              onClick={() => setSelectedRole('KASIR_UMI')}
              className={`w-full text-left p-3.5 rounded-xl border transition flex items-center justify-between ${
                selectedRole === 'KASIR_UMI'
                  ? roleRules.KASIR_UMI.activeClass
                  : 'bg-white border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div>
                <p className="font-bold text-sm text-slate-900">🏖️ Kasir Umi (Pariwisata)</p>
                <p className="text-xs text-slate-500">{roleRules.KASIR_UMI.subjudul}</p>
              </div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded ${roleRules.KASIR_UMI.badgeColor}`}>
                {roleRules.KASIR_UMI.badge}
              </span>
            </button>

            <button
              onClick={() => setSelectedRole('WALI_KELAS')}
              className={`w-full text-left p-3.5 rounded-xl border transition flex items-center justify-between ${
                selectedRole === 'WALI_KELAS'
                  ? roleRules.WALI_KELAS.activeClass
                  : 'bg-white border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div>
                <p className="font-bold text-sm text-slate-900">👨‍🏫 Wali Kelas</p>
                <p className="text-xs text-slate-500">{roleRules.WALI_KELAS.subjudul}</p>
              </div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded ${roleRules.WALI_KELAS.badgeColor}`}>
                {roleRules.WALI_KELAS.badge}
              </span>
            </button>

            <button
              onClick={() => setSelectedRole('ORTU')}
              className={`w-full text-left p-3.5 rounded-xl border transition flex items-center justify-between ${
                selectedRole === 'ORTU'
                  ? roleRules.ORTU.activeClass
                  : 'bg-white border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div>
                <p className="font-bold text-sm text-slate-900">🎓 Siswa & Orang Tua</p>
                <p className="text-xs text-slate-500">{roleRules.ORTU.subjudul}</p>
              </div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded ${roleRules.ORTU.badgeColor}`}>
                {roleRules.ORTU.badge}
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
