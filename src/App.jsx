import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import LoginView from './components/LoginView';
import DashboardView from './components/DashboardView';
import KasirView from './components/KasirView';
import BukuPagerView from './components/BukuPagerView';
import KartuSppView from './components/KartuSppView';
import KenaikanKelasView from './components/KenaikanKelasView';
import MasterTarifView from './components/MasterTarifView';
import ProfilKopView from './components/ProfilKopView';
import MasterRulesView from './components/MasterRulesView';
import KuitansiModal from './components/KuitansiModal';
import { dataService } from './services/dataService';
import { Database, GitBranch, Bell } from 'lucide-react';

const USER_STORAGE_KEY = 'SITAMPAN_CURRENT_USER';

export default function App() {
  const [data, setData] = useState(() => dataService.getData());

  // Sinkronkan judul browser tab secara dinamis sesuai profil sekolah aktif
  useEffect(() => {
    if (data?.sekolah?.nama) {
      document.title = `${data.sekolah.nama} - SITAMPAN SMK`;
    }
  }, [data?.sekolah?.nama]);
  
  // Auth state
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem(USER_STORAGE_KEY);
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [activeTab, setActiveTab] = useState(currentUser?.role === 'ADMIN' ? 'dashboard' : 'kartu-spp');
  const [activeKuitansi, setActiveKuitansi] = useState(null);

  // Sync role and tab when logging in
  const handleLogin = (userObj) => {
    setCurrentUser(userObj);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userObj));

    if (userObj.role === 'WALI_KELAS') {
      setActiveTab('buku-pager');
    } else if (userObj.role === 'ORTU') {
      setActiveTab('kartu-spp');
    } else {
      setActiveTab('dashboard');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem(USER_STORAGE_KEY);
  };

  const handleUpdateData = () => {
    setData({ ...dataService.getData() });
  };

  const handleResetData = () => {
    if (
      confirm(
        'Apakah Anda ingin mereset data aplikasi kembali ke data profil & tarif awal default?'
      )
    ) {
      const fresh = dataService.resetToDefault();
      setData({ ...fresh });
      alert('Data berhasil di-reset ke data awal!');
    }
  };

  // If user is not logged in, render the login portal
  if (!currentUser) {
    return <LoginView data={data} onLogin={handleLogin} />;
  }

  const role = currentUser?.role || 'ADMIN';

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* 1. SIDEBAR KIRI (Navigasi Sesuai Role Pengguna) */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        data={data}
        onLogout={handleLogout}
        onResetData={handleResetData}
      />

      {/* 2. AREA KONTEN UTAMA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto h-screen">
        {/* Top Bar Informasi */}
        <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between no-print sticky top-0 z-30 shadow-2xs">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <div>
              <p className="text-xs font-bold text-slate-900 leading-tight">
                {data.sekolah.nama}
              </p>
              <p className="text-[10px] text-slate-500">
                {currentUser.nama} ({role === 'ADMIN' ? 'Kasir TU' : role === 'WALI_KELAS' ? 'Wali Kelas' : 'Siswa/Ortu'})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="bg-blue-50 text-blue-700 font-bold px-2.5 py-1 rounded-lg border border-blue-200 hidden sm:inline-block">
              Mitra VA: {data.sekolah.bankMitra}
            </span>
            <span className="bg-slate-100 text-slate-700 font-bold px-2.5 py-1 rounded-lg border border-slate-200">
              TA {data.sekolah.tahunAjaranAktif}
            </span>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* Dashboard Real-Time (Khusus Admin) */}
          {activeTab === 'dashboard' && role === 'ADMIN' && (
            <DashboardView data={data} onNavigate={setActiveTab} />
          )}

          {/* Menu Khusus Admin: Loket Kasir */}
          {activeTab === 'kasir' && role === 'ADMIN' && (
            <KasirView
              data={data}
              onUpdateData={handleUpdateData}
              onShowKuitansi={(kwt) => setActiveKuitansi(kwt)}
            />
          )}

          {/* Buku Pager (Bisa diakses Admin & Wali Kelas) */}
          {activeTab === 'buku-pager' && (
            <BukuPagerView data={data} currentRole={role} />
          )}

          {/* Kartu SPP (Bisa diakses Siswa/Ortu & Admin & Wali Kelas) */}
          {activeTab === 'kartu-spp' && (
            <KartuSppView data={data} currentRole={role} />
          )}

          {/* Kenaikan Kelas (Khusus Admin) */}
          {activeTab === 'kenaikan-kelas' && role === 'ADMIN' && (
            <KenaikanKelasView data={data} onUpdateData={handleUpdateData} />
          )}

          {/* Master Tarif & Pos Biaya (Khusus Admin) */}
          {activeTab === 'master-tarif' && role === 'ADMIN' && (
            <MasterTarifView data={data} onUpdateData={handleUpdateData} />
          )}

          {/* Master Profil & KOP Sekolah (Khusus Admin) */}
          {activeTab === 'profil-kop' && role === 'ADMIN' && (
            <ProfilKopView data={data} onUpdateData={handleUpdateData} />
          )}

          {/* Master Hak Akses & Rule (Khusus Admin) */}
          {activeTab === 'master-rules' && role === 'ADMIN' && (
            <MasterRulesView data={data} />
          )}
        </main>

        {/* Footer */}
        <footer className="no-print bg-white border-t border-slate-200 py-4 px-6 text-center text-xs text-slate-500">
          <p className="font-semibold text-slate-700">
            SITAMPAN SMK — {data.sekolah.nama}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Sistem Informasi Terpadu Administrasi & Manajemen Pembayaran SPP (Hybrid Tunai + VA)
          </p>
        </footer>
      </div>

      {/* Modal Cetak Kuitansi dengan Logo & KOP Dinamis */}
      <KuitansiModal
        transaksi={activeKuitansi}
        sekolah={data.sekolah}
        onClose={() => setActiveKuitansi(null)}
      />
    </div>
  );
}
