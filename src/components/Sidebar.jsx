import React from 'react';
import { 
  LayoutDashboard,
  CreditCard, 
  BookOpen, 
  GraduationCap, 
  Settings, 
  Smartphone, 
  School, 
  ShieldCheck, 
  LogOut, 
  RotateCcw,
  User,
  Users,
  UserCheck,
  ChevronRight,
  ChevronLeft,
  Menu,
  X,
  Sparkles,
  PanelLeftClose,
  PanelLeftOpen,
  QrCode
} from 'lucide-react';
import SchoolLogo from './SchoolLogo';

export default function Sidebar({
  activeTab,
  setActiveTab,
  currentUser,
  data,
  onLogout,
  onResetData,
  isCollapsed,
  toggleCollapse,
  isMobileOpen,
  setIsMobileOpen
}) {
  const role = currentUser?.role || 'ADMIN';
  const isKasirHana = role === 'KASIR_HANA' || currentUser?.username === 'hana' || (currentUser?.kasirKelompok === 'BISNIS_MANAJEMEN' && role !== 'ADMIN' && role !== 'BENDAHARA');
  const isKasirUmi = role === 'KASIR_UMI' || currentUser?.username === 'umi' || (currentUser?.kasirKelompok === 'PARIWISATA' && role !== 'ADMIN' && role !== 'BENDAHARA');

  // Daftar menu yang disesuaikan secara ketat sesuai RULE pengguna
  const getMenuItems = () => {
    // 1. KASIR 1: HANA (Khusus Kasir Bisnis Manajemen)
    if (isKasirHana) {
      return [
        {
          group: 'LOKET KASIR BISMAN',
          items: [
            { id: 'kasir', label: 'Loket Kasir & Kuitansi (AKL, MPLB, PM)', icon: CreditCard, color: 'text-blue-500' },
            { id: 'buku-pager', label: 'Buku Pager Rombel BisMan', icon: BookOpen, color: 'text-indigo-500' },
            { id: 'kartu-spp', label: 'Cek Kartu SPP Siswa BisMan', icon: Smartphone, color: 'text-emerald-500' },
            { id: 'dashboard', label: 'Dashboard Kasir Hana', icon: LayoutDashboard, color: 'text-amber-400' }
          ]
        }
      ];
    }

    // 2. KASIR 2: UMI (Khusus Kasir Pariwisata)
    if (isKasirUmi) {
      return [
        {
          group: 'LOKET KASIR PARIWISATA',
          items: [
            { id: 'kasir', label: 'Loket Kasir & Kuitansi (KSP, HTL)', icon: CreditCard, color: 'text-rose-500' },
            { id: 'buku-pager', label: 'Buku Pager Rombel Pariwisata', icon: BookOpen, color: 'text-indigo-500' },
            { id: 'kartu-spp', label: 'Cek Kartu SPP Siswa Pariwisata', icon: Smartphone, color: 'text-emerald-500' },
            { id: 'dashboard', label: 'Dashboard Kasir Umi', icon: LayoutDashboard, color: 'text-amber-400' }
          ]
        }
      ];
    }

    // 3. BENDAHARA (Khusus Keuangan, Setoran Kasir & Tarif)
    if (role === 'BENDAHARA' || currentUser?.username === 'bendahara') {
      return [
        {
          group: 'MANAJEMEN KEUANGAN SEKOLAH',
          items: [
            { id: 'dashboard', label: 'Dashboard Real-Time Keuangan', icon: LayoutDashboard, color: 'text-amber-400' },
            { id: 'kasir', label: 'Monitoring Loket Kasir', icon: CreditCard, color: 'text-blue-500' },
            { id: 'buku-pager', label: 'Buku Pager (Rekap Setoran)', icon: BookOpen, color: 'text-indigo-500' },
            { id: 'kartu-spp', label: 'Kartu SPP Digital Siswa', icon: Smartphone, color: 'text-emerald-500' }
          ]
        },
        {
          group: 'PENETAPAN TARIF & BIAYA',
          items: [
            { id: 'master-tarif', label: 'Master Tarif Pos Biaya', icon: Settings, color: 'text-amber-400' }
          ]
        }
      ];
    }

    // 4. KEPALA SEKOLAH (Khusus Monitoring Eksekutif & Laporan)
    if (role === 'KEPALA_SEKOLAH' || currentUser?.username === 'kepsek') {
      return [
        {
          group: 'MONITORING EKSEKUTIF',
          items: [
            { id: 'dashboard', label: 'Dashboard Eksekutif Sekolah', icon: LayoutDashboard, color: 'text-amber-400' },
            { id: 'buku-pager', label: 'Laporan Setoran Seluruh Kelas', icon: BookOpen, color: 'text-indigo-500' },
            { id: 'kartu-spp', label: 'Monitoring Kartu SPP Siswa', icon: Smartphone, color: 'text-emerald-500' }
          ]
        },
        {
          group: 'DATA INDUK SEKOLAH',
          items: [
            { id: 'master-siswa', label: 'Data Induk Siswa', icon: Users, color: 'text-blue-400' },
            { id: 'master-kelas', label: 'Daftar Kelas & Wali Kelas', icon: UserCheck, color: 'text-emerald-400' },
            { id: 'master-jurusan', label: 'Program Keahlian (Jurusan)', icon: GraduationCap, color: 'text-purple-400' }
          ]
        }
      ];
    }

    // 5. WALI KELAS
    if (role === 'WALI_KELAS') {
      return [
        {
          group: 'PEMANTAUAN KELAS',
          items: [
            { id: 'buku-pager', label: `Rekap Setoran ${currentUser?.namaKelas || 'Kelas'}`, icon: BookOpen, color: 'text-indigo-500' },
            { id: 'kartu-spp', label: 'Kartu SPP Siswa Kelas', icon: Smartphone, color: 'text-emerald-500' }
          ]
        }
      ];
    }

    // 6. SISWA / ORTU
    if (role === 'ORTU' || role === 'SISWA') {
      return [
        {
          group: 'PORTAL KEUANGAN SISWA',
          items: [
            { id: 'kartu-spp', label: 'Kartu SPP & Status Tagihan', icon: Smartphone, color: 'text-emerald-500' }
          ]
        }
      ];
    }

    // 7. ADMIN PUSAT (ALL - Akses Lengkap Seluruh Modul)
    return [
      {
        group: 'RINGKASAN & TRANSAKSI',
        items: [
          { id: 'dashboard', label: 'Dashboard Real-Time', icon: LayoutDashboard, color: 'text-amber-400' },
          { id: 'kasir', label: 'Loket Kasir & Kuitansi', icon: CreditCard, color: 'text-blue-500' },
          { id: 'buku-pager', label: 'Buku Pager (Rekap Setoran)', icon: BookOpen, color: 'text-indigo-500' },
          { id: 'kartu-spp', label: 'Kartu SPP Digital (Cek Siswa)', icon: Smartphone, color: 'text-emerald-500' }
        ]
      },
      {
        group: 'DATA MASTER AKADEMIK',
        items: [
          { id: 'master-siswa', label: 'Master Siswa', icon: Users, color: 'text-blue-400' },
          { id: 'master-kelas', label: 'Master Kelas & Wali Kelas', icon: UserCheck, color: 'text-emerald-400' },
          { id: 'master-jurusan', label: 'Master Jurusan', icon: GraduationCap, color: 'text-purple-400' }
        ]
      },
      {
        group: 'AKADEMIK & PROMOSI',
        items: [
          { id: 'kenaikan-kelas', label: 'Kenaikan Kelas & Alumni', icon: GraduationCap, color: 'text-cyan-400' }
        ]
      },
      {
        group: 'TARIF & PENGATURAN',
        items: [
          { id: 'master-tarif', label: 'Master Tarif Pos Biaya', icon: Settings, color: 'text-amber-400' },
          { id: 'profil-kop', label: 'Profil & KOP Sekolah', icon: School, color: 'text-rose-400' },
          { id: 'master-rules', label: 'Master Hak Akses & Rule', icon: ShieldCheck, color: 'text-teal-400' }
        ]
      }
    ];
  };

  const menuGroups = getMenuItems();

  const handleItemClick = (id) => {
    setActiveTab(id);
    if (setIsMobileOpen) {
      setIsMobileOpen(false);
    }
  };

  return (
    <>
      {/* 1. Backdrop Overlay saat Mobile Drawer Terbuka */}
      {isMobileOpen && (
        <div 
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-slate-950/70 z-40 backdrop-blur-xs md:hidden animate-fadeIn"
          aria-hidden="true"
        />
      )}

      {/* 2. Container Sidebar (Mendukung Full / Mini Icon-Only / Mobile Drawer) */}
      <aside 
        className={`fixed md:sticky top-0 left-0 z-50 h-[100dvh] max-h-[100dvh] bg-slate-900 text-slate-300 flex flex-col justify-between flex-shrink-0 border-r border-slate-800 no-print select-none shadow-2xl transition-all duration-300 ease-in-out ${
          // Lebar responsive: Mini (w-20) vs Penuh (w-64 lg:w-72)
          isCollapsed ? 'md:w-20' : 'md:w-64 lg:w-72'
        } ${
          // Posisi drawer pada mobile
          isMobileOpen ? 'translate-x-0 w-72' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Bagian Atas: Header & Menu (Scrollable Flex-1) */}
        <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
          {/* Header Identitas & Tombol Collapse */}
          {isCollapsed && !isMobileOpen ? (
            /* TAMPILAN MINI (ICON-ONLY): Logo utuh di tengah, tidak terpotong */
            <div className="flex-shrink-0 p-3 border-b border-slate-800/80 flex flex-col items-center justify-center bg-slate-950/60">
              <button
                type="button"
                onClick={toggleCollapse}
                className="group p-1 rounded-xl hover:bg-slate-800 transition cursor-pointer flex items-center justify-center"
                title="SMK Bina Karya Nusantara - Klik untuk Perluas Menu"
              >
                <SchoolLogo logoUrl={data.sekolah.logoUrl} className="w-10 h-10 flex-shrink-0 group-hover:scale-105 transition" />
              </button>
            </div>
          ) : (
            /* TAMPILAN PENUH: Logo + Identitas Sekolah + Tombol Ciutkan / Tutup */
            <div className="flex-shrink-0 p-4 border-b border-slate-800/80 flex items-center justify-between bg-slate-950/60">
              <div className="flex items-center gap-3 overflow-hidden min-w-0">
                <SchoolLogo logoUrl={data.sekolah.logoUrl} className="w-10 h-10 flex-shrink-0" />
                <div className="overflow-hidden min-w-0">
                  <h1 className="text-base font-extrabold tracking-tight text-white leading-tight flex items-center gap-1.5">
                    SITAMPAN <span className="text-amber-400">SMK</span>
                  </h1>
                  <p className="text-[10px] text-amber-300/90 font-medium truncate mt-0.5" title="Sistem Informasi Tagihan & Manajemen Pembayaran Keuangan SMK">
                    Sist. Info Tagihan & Manajemen Pembayaran
                  </p>
                  <p className="text-[11px] font-semibold text-slate-400 truncate mt-0.5" title={data.sekolah.nama}>
                    {data.sekolah.nama}
                  </p>
                  <span className="inline-block text-[9px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 border border-emerald-800/50 px-1.5 py-0.2 rounded mt-0.5">
                    TA {data.sekolah.tahunAjaranAktif}
                  </span>
                </div>
              </div>

              {/* Tombol Tutup (Di HP) */}
              <button
                onClick={() => setIsMobileOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg md:hidden cursor-pointer flex-shrink-0"
                title="Tutup Menu"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Tombol Collapse Icon-Only (Di Desktop/Tablet) */}
              <button
                onClick={toggleCollapse}
                className="hidden md:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer flex-shrink-0"
                title="Ciutkan Sidebar Jadi Logo Kecil"
              >
                <PanelLeftClose className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* 3. Daftar Menu Sesuai Role Pengguna (Scrollable) */}
          <div className={`flex-1 min-h-0 py-4 space-y-6 overflow-y-auto ${isCollapsed ? 'px-2' : 'px-3'}`}>
            {menuGroups.map((grp, idx) => (
              <div key={idx} className="space-y-1">
                {(!isCollapsed || isMobileOpen) ? (
                  <p className="px-3 text-[10px] font-extrabold uppercase tracking-widest text-slate-500">
                    {grp.group}
                  </p>
                ) : (
                  <div className="border-t border-slate-800 my-2" />
                )}

                <div className="space-y-1">
                  {grp.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;

                    return (
                      <button
                        key={item.id}
                        onClick={() => handleItemClick(item.id)}
                        title={item.label}
                        className={`w-full flex items-center rounded-xl transition-all cursor-pointer group ${
                          isCollapsed && !isMobileOpen
                            ? 'justify-center p-3'
                            : 'justify-between px-3 py-2.5 text-xs font-bold'
                        } ${
                          isActive
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 font-extrabold ring-1 ring-blue-400/30'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800/70'
                        }`}
                      >
                        <div className={`flex items-center gap-3 ${isCollapsed && !isMobileOpen ? 'justify-center' : ''}`}>
                          <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : item.color}`} />
                          
                          {(!isCollapsed || isMobileOpen) && (
                            <span className="truncate">{item.label}</span>
                          )}
                        </div>

                        {(!isCollapsed || isMobileOpen) && isActive && (
                          <ChevronRight className="w-3.5 h-3.5 text-blue-200" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Footer: User Profile Card & Logout (Safe Area Padding untuk Browser Android dengan Bottom Address Bar) */}
        <div className={`flex-shrink-0 border-t border-slate-800/80 bg-slate-950/95 ${isCollapsed && !isMobileOpen ? 'p-2 pb-8 md:pb-2' : 'p-3 pb-24 md:pb-3'} space-y-2`}>
          {/* User Card */}
          <div className={`rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between ${isCollapsed && !isMobileOpen ? 'p-2 justify-center' : 'p-2.5'}`}>
            <div className={`flex items-center gap-2.5 min-w-0 ${isCollapsed && !isMobileOpen ? 'justify-center' : ''}`}>
              <div 
                className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-xs flex-shrink-0 border border-blue-500/30"
                title={`${currentUser?.nama} (${role})`}
              >
                <User className="w-4 h-4" />
              </div>

              {(!isCollapsed || isMobileOpen) && (
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate">
                    {currentUser?.nama || 'Pengguna'}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate">
                    {role === 'KASIR_HANA'
                      ? 'Kasir 1: Bisnis Manajemen'
                      : role === 'KASIR_UMI'
                      ? 'Kasir 2: Pariwisata'
                      : role === 'ADMIN'
                      ? 'Admin Pusat TU (All)'
                      : role === 'BENDAHARA'
                      ? 'Bendahara Sekolah'
                      : role === 'KEPALA_SEKOLAH'
                      ? 'Kepala Sekolah'
                      : role === 'WALI_KELAS'
                      ? `Wali Kelas ${currentUser?.namaKelas || 'XII PM 1'}`
                      : `Siswa (${currentUser?.nis})`}
                  </p>
                </div>
              )}
            </div>

            {(!isCollapsed || isMobileOpen) && (
              <button
                onClick={onLogout}
                title="Keluar / Ganti Akun"
                className="p-1.5 text-rose-400 hover:text-white hover:bg-rose-600/80 rounded-lg transition cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Jika mini mode, tombol logout diletakkan di bawah */}
          {isCollapsed && !isMobileOpen && (
            <button
              onClick={onLogout}
              title="Keluar / Ganti Akun"
              className="w-full flex items-center justify-center p-2 text-rose-400 hover:text-white hover:bg-rose-600/80 rounded-xl transition cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}

          {/* Action Button: Reset Data */}
          {(!isCollapsed || isMobileOpen) && (
            <button
              onClick={onResetData}
              className="w-full flex items-center justify-center gap-1.5 py-1 text-[11px] text-slate-500 hover:text-rose-400 transition cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Data Standar</span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
