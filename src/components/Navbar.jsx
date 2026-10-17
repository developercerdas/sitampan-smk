import React from 'react';
import { 
  Building2, 
  CreditCard, 
  BookOpen, 
  GraduationCap, 
  Settings, 
  UserCheck, 
  RotateCcw,
  ShieldCheck,
  Smartphone,
  LogOut,
  User
} from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  currentRole, 
  setCurrentRole, 
  currentUser,
  onLogout,
  onResetData 
}) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs no-print">
      {/* Top Bar Informasi Sekolah & Profil Pengguna */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-md font-bold text-lg">
            S
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-extrabold tracking-tight text-slate-900 leading-tight">
                SITAMPAN <span className="text-blue-600">SMK</span>
              </h1>
              <span className="bg-emerald-50 text-emerald-700 text-xs px-2 py-0.5 rounded-full font-semibold border border-emerald-200">
                Hybrid System (Tunai + VA)
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              SMK PGRI 1 Mejobo Kudus • Terakreditasi A • TA 2026/2027
            </p>
          </div>
        </div>

        {/* User Profile & Actions */}
        <div className="flex items-center flex-wrap gap-2.5">
          {/* Badge Pengguna Aktif */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
            <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
              <User className="w-4 h-4" />
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-slate-800 leading-tight">
                {currentUser?.nama || 'Petugas Keuangan'}
              </p>
              <p className="text-[10px] text-slate-500">
                {currentUser?.role === 'ADMIN'
                  ? 'Kasir & Admin TU'
                  : currentUser?.role === 'WALI_KELAS'
                  ? `Wali Kelas ${currentUser?.namaKelas || 'XII PM 1'}`
                  : `Siswa (NIS: ${currentUser?.nis})`}
              </p>
            </div>
          </div>

          {/* Tombol Reset Data */}
          <button
            onClick={onResetData}
            title="Reset ke data awal dokumen asli SMK PGRI 1 Mejobo"
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-red-600 bg-white hover:bg-red-50 border border-slate-200 hover:border-red-200 px-2.5 py-1.5 rounded-xl transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          {/* Tombol Logout */}
          <button
            onClick={onLogout}
            title="Keluar dari akun"
            className="flex items-center gap-1.5 text-xs text-rose-700 hover:text-white bg-rose-50 hover:bg-rose-600 border border-rose-200 px-3 py-1.5 rounded-xl font-bold transition shadow-2xs"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-1 sm:space-x-4 overflow-x-auto py-2">
          {/* Menu untuk Admin / Kasir */}
          {currentRole === 'ADMIN' && (
            <>
              <button
                onClick={() => setActiveTab('kasir')}
                className={`flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-lg transition whitespace-nowrap ${
                  activeTab === 'kasir'
                    ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <CreditCard className="w-4 h-4 text-blue-600" />
                Loket Kasir & Kuitansi
              </button>

              <button
                onClick={() => setActiveTab('buku-pager')}
                className={`flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-lg transition whitespace-nowrap ${
                  activeTab === 'buku-pager'
                    ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <BookOpen className="w-4 h-4 text-indigo-600" />
                Buku Pager (Rekap Setoran)
              </button>

              <button
                onClick={() => setActiveTab('kenaikan-kelas')}
                className={`flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-lg transition whitespace-nowrap ${
                  activeTab === 'kenaikan-kelas'
                    ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <GraduationCap className="w-4 h-4 text-purple-600" />
                Kenaikan Kelas & Kelulusan
              </button>

              <button
                onClick={() => setActiveTab('master-tarif')}
                className={`flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-lg transition whitespace-nowrap ${
                  activeTab === 'master-tarif'
                    ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Settings className="w-4 h-4 text-slate-600" />
                Master Tarif & Jurusan
              </button>

              <button
                onClick={() => setActiveTab('kartu-spp')}
                className={`flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-lg transition whitespace-nowrap ${
                  activeTab === 'kartu-spp'
                    ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Smartphone className="w-4 h-4 text-emerald-600" />
                Kartu SPP Digital (Cek Siswa)
              </button>
            </>
          )}

          {/* Menu untuk Wali Kelas */}
          {currentRole === 'WALI_KELAS' && (
            <button
              onClick={() => setActiveTab('buku-pager')}
              className={`flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-lg transition whitespace-nowrap bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-2xs`}
            >
              <BookOpen className="w-4 h-4 text-indigo-600" />
              Monitoring Setoran Kelas XII PM 1 & Syarat Rapor
            </button>
          )}

          {/* Menu untuk Siswa & Orang Tua */}
          {currentRole === 'ORTU' && (
            <button
              onClick={() => setActiveTab('kartu-spp')}
              className={`flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-lg transition whitespace-nowrap bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs`}
            >
              <Smartphone className="w-4 h-4 text-emerald-600" />
              Kartu SPP Digital & Nomor Virtual Account
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
