import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import LoginView from './components/LoginView';
import DashboardView from './components/DashboardView';
import KasirView from './components/KasirView';
import BukuPagerView from './components/BukuPagerView';
import KartuSppView from './components/KartuSppView';
import KenaikanKelasView from './components/KenaikanKelasView';
import MasterTarifView from './components/MasterTarifView';
import MasterSiswaView from './components/MasterSiswaView';
import MasterKelasView from './components/MasterKelasView';
import MasterJurusanView from './components/MasterJurusanView';
import ProfilKopView from './components/ProfilKopView';
import MasterRulesView from './components/MasterRulesView';
import KuitansiModal from './components/KuitansiModal';
import { dataService } from './services/dataService';
import { Database, GitBranch, Bell, Menu, LogOut, QrCode, Sparkles, BadgeCheck, ScanBarcode, Printer, Monitor, Code2, Cctv } from 'lucide-react';

const USER_STORAGE_KEY = 'SITAMPAN_CURRENT_USER';

export default function App() {
  const [data, setData] = useState(() => dataService.getData());

  // State Sidebar Responsif & Ciut/Melebar (Icon-only mode)
  const [isCollapsed, setIsCollapsed] = useState(() => {
    try {
      return localStorage.getItem('SITAMPAN_SIDEBAR_COLLAPSED') === 'true';
    } catch {
      return false;
    }
  });
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('SITAMPAN_SIDEBAR_COLLAPSED', String(next));
      } catch {}
      return next;
    });
  };

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
      {/* 1. SIDEBAR KIRI (Navigasi Sesuai Role Pengguna: Full / Mini Icon-Only / Mobile Drawer) */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        data={data}
        onLogout={handleLogout}
        onResetData={handleResetData}
        isCollapsed={isCollapsed}
        toggleCollapse={toggleCollapse}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* 2. AREA KONTEN UTAMA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto h-[100dvh] max-h-[100dvh]">
        {/* Top Bar Informasi */}
        <header className="bg-white border-b border-slate-200 px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between no-print sticky top-0 z-30 shadow-2xs">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            {/* Tombol Hamburger / Collapse */}
            <button
              type="button"
              onClick={() => {
                if (window.innerWidth < 768) {
                  setIsMobileOpen((prev) => !prev);
                } else {
                  toggleCollapse();
                }
              }}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition flex-shrink-0 cursor-pointer"
              title={isCollapsed ? 'Perluas Menu Sidebar' : 'Ciutkan Sidebar ke Logo Kecil'}
            >
              <Menu className="w-5 h-5 text-slate-700" />
            </button>

            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse flex-shrink-0 hidden xs:inline-block"></span>
            
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-900 leading-tight truncate max-w-[130px] sm:max-w-xs md:max-w-md">
                {data.sekolah.nama}
              </p>
              <p className="text-[10px] text-slate-500 truncate">
                {currentUser.nama} ({
                  role === 'ADMIN'
                    ? 'Kasir TU'
                    : role === 'BENDAHARA'
                    ? 'Bendahara Sekolah'
                    : role === 'KEPALA_SEKOLAH'
                    ? 'Kepala Sekolah'
                    : role === 'WALI_KELAS'
                    ? 'Wali Kelas'
                    : 'Siswa/Ortu'
                })
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2.5 text-xs flex-shrink-0">
            <span className="bg-blue-50 text-blue-700 font-bold px-2.5 py-1 rounded-lg border border-blue-200 hidden md:inline-block text-[11px]">
              Mitra: {data.sekolah.bankMitra}
            </span>
            <span className="bg-slate-100 text-slate-700 font-bold px-2 py-1 rounded-lg border border-slate-200 text-[11px]">
              TA {data.sekolah.tahunAjaranAktif}
            </span>
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-1 px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-lg border border-rose-200 transition text-[11px] cursor-pointer"
              title="Keluar / Ganti Akun"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Keluar</span>
            </button>
          </div>
        </header>

        {/* Content Body (Safe area bottom padding untuk Android address bar) */}
        <main className="flex-1 p-3 sm:p-5 lg:p-7 max-w-7xl w-full mx-auto space-y-6 pb-28 md:pb-12">
          {/* Dashboard Real-Time (Khusus Admin, Bendahara, & Kepala Sekolah) */}
          {activeTab === 'dashboard' && (role === 'ADMIN' || role === 'BENDAHARA' || role === 'KEPALA_SEKOLAH') && (
            <DashboardView data={data} onNavigate={setActiveTab} />
          )}

          {/* Menu Loket Kasir (Admin & Bendahara) */}
          {activeTab === 'kasir' && (role === 'ADMIN' || role === 'BENDAHARA') && (
            <KasirView
              data={data}
              onUpdateData={handleUpdateData}
              onShowKuitansi={(kwt) => setActiveKuitansi(kwt)}
            />
          )}

          {/* Buku Pager (Bisa diakses Admin, Bendahara, Kepala Sekolah, & Wali Kelas) */}
          {activeTab === 'buku-pager' && (
            <BukuPagerView
              data={data}
              currentRole={role}
              currentUser={currentUser}
              onShowKuitansi={(kwt) => setActiveKuitansi(kwt)}
            />
          )}

          {/* Kartu SPP (Bisa diakses Siswa/Ortu, Admin, Bendahara, Kepala Sekolah, & Wali Kelas) */}
          {activeTab === 'kartu-spp' && (
            <KartuSppView
              data={data}
              currentRole={role}
              currentUser={currentUser}
              onShowKuitansi={(kwt) => setActiveKuitansi(kwt)}
            />
          )}

          {/* Kenaikan Kelas (Admin & Bendahara) */}
          {activeTab === 'kenaikan-kelas' && (role === 'ADMIN' || role === 'BENDAHARA') && (
            <KenaikanKelasView data={data} onUpdateData={handleUpdateData} />
          )}

          {/* Master Siswa (Admin, Bendahara, & Kepala Sekolah) */}
          {activeTab === 'master-siswa' && (role === 'ADMIN' || role === 'BENDAHARA' || role === 'KEPALA_SEKOLAH') && (
            <MasterSiswaView
              data={data}
              onUpdateData={handleUpdateData}
              setActiveTab={setActiveTab}
            />
          )}

          {/* Master Kelas & Wali Kelas (Admin, Bendahara, & Kepala Sekolah) */}
          {activeTab === 'master-kelas' && (role === 'ADMIN' || role === 'BENDAHARA' || role === 'KEPALA_SEKOLAH') && (
            <MasterKelasView
              data={data}
              onUpdateData={handleUpdateData}
              setActiveTab={setActiveTab}
            />
          )}

          {/* Master Jurusan (Admin, Bendahara, & Kepala Sekolah) */}
          {activeTab === 'master-jurusan' && (role === 'ADMIN' || role === 'BENDAHARA' || role === 'KEPALA_SEKOLAH') && (
            <MasterJurusanView
              data={data}
              onUpdateData={handleUpdateData}
              setActiveTab={setActiveTab}
            />
          )}

          {/* Master Tarif & Pos Biaya (Admin, Bendahara, & Kepala Sekolah) */}
          {activeTab === 'master-tarif' && (role === 'ADMIN' || role === 'BENDAHARA' || role === 'KEPALA_SEKOLAH') && (
            <MasterTarifView
              data={data}
              onUpdateData={handleUpdateData}
              setActiveTab={setActiveTab}
            />
          )}

          {/* Master Profil & KOP Sekolah (Admin, Bendahara, & Kepala Sekolah) */}
          {activeTab === 'profil-kop' && (role === 'ADMIN' || role === 'BENDAHARA' || role === 'KEPALA_SEKOLAH') && (
            <ProfilKopView data={data} onUpdateData={handleUpdateData} />
          )}

          {/* Master Hak Akses & Rule (Admin, Bendahara, & Kepala Sekolah) */}
          {activeTab === 'master-rules' && (role === 'ADMIN' || role === 'BENDAHARA' || role === 'KEPALA_SEKOLAH') && (
            <MasterRulesView data={data} />
          )}
        </main>

        {/* Footer Aplikasi Internal */}
        <footer className="no-print bg-white border-t border-slate-200 py-4 px-4 sm:px-6 text-center text-xs text-slate-500">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4 max-w-6xl mx-auto">
            <div className="text-center lg:text-left">
              <p className="font-bold text-slate-800 text-xs sm:text-sm">
                SITAMPAN SMK — {data.sekolah.nama}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Sistem Informasi Tagihan & Manajemen Pembayaran Keuangan SMK (Hybrid Tunai & VA)
              </p>
            </div>

            {/* Badge Developer Lengkap CV. ISTANA BARCODE COMPUTER */}
            <div className="bg-[#0b132b] text-white p-3 rounded-2xl border border-slate-800 shadow-md flex flex-col sm:flex-row items-center gap-3.5">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-gradient-to-br from-amber-950/70 to-yellow-950/40 border border-amber-500/50 rounded-xl text-amber-400">
                  <QrCode className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <span className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                    POWERED BY
                  </span>
                  <p className="text-xs font-black tracking-tight text-white leading-tight">
                    CV. ISTANA BARCODE COMPUTER
                  </p>
                  <p className="text-[9px] text-slate-400">
                    Official IT Solution & POS Hardware
                  </p>
                </div>
              </div>

              {/* Developer Cerdas + Service Pills */}
              <div className="flex flex-col sm:items-end gap-1.5 border-t sm:border-t-0 sm:border-l border-slate-800 pt-2 sm:pt-0 sm:pl-3 w-full sm:w-auto">
                <div className="inline-flex items-center justify-center gap-1 px-2.5 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-400 text-cyan-300 font-extrabold text-[10px]">
                  <BadgeCheck className="w-3 h-3 text-cyan-400" />
                  <span>DEVELOPER CERDAS</span>
                </div>
                <div className="flex flex-wrap items-center justify-center sm:justify-end gap-1">
                  <span className="px-2 py-0.5 bg-slate-900 border border-slate-700/80 rounded text-[10px] font-bold text-slate-200 inline-flex items-center gap-1">
                    <ScanBarcode className="w-2.5 h-2.5 text-amber-400" /> Barcode
                  </span>
                  <span className="px-2 py-0.5 bg-slate-900 border border-slate-700/80 rounded text-[10px] font-bold text-slate-200 inline-flex items-center gap-1">
                    <Printer className="w-2.5 h-2.5 text-amber-400" /> POS
                  </span>
                  <span className="px-2 py-0.5 bg-slate-900 border border-slate-700/80 rounded text-[10px] font-bold text-slate-200 inline-flex items-center gap-1">
                    <Monitor className="w-2.5 h-2.5 text-amber-400" /> Komputer
                  </span>
                  <span className="px-2 py-0.5 bg-slate-900 border border-slate-700/80 rounded text-[10px] font-bold text-slate-200 inline-flex items-center gap-1">
                    <Code2 className="w-2.5 h-2.5 text-amber-400" /> Software
                  </span>
                  <span className="px-2 py-0.5 bg-slate-900 border border-slate-700/80 rounded text-[10px] font-bold text-slate-200 inline-flex items-center gap-1">
                    <Cctv className="w-2.5 h-2.5 text-amber-400" /> CCTV
                  </span>
                </div>
              </div>
            </div>
          </div>
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
