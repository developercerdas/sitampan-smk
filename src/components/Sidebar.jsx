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
  ChevronRight,
  Sparkles
} from 'lucide-react';
import SchoolLogo from './SchoolLogo';

export default function Sidebar({
  activeTab,
  setActiveTab,
  currentUser,
  data,
  onLogout,
  onResetData
}) {
  const role = currentUser?.role || 'ADMIN';

  // Daftar menu yang disesuaikan secara ketat sesuai RULE pengguna
  const getMenuItems = () => {
    if (role === 'ADMIN') {
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
          group: 'AKADEMIK & PROMOSI',
          items: [
            { id: 'kenaikan-kelas', label: 'Kenaikan Kelas & Alumni', icon: GraduationCap, color: 'text-purple-500' }
          ]
        },
        {
          group: 'MASTER & PENGATURAN',
          items: [
            { id: 'master-tarif', label: 'Master Tarif & Jurusan', icon: Settings, color: 'text-slate-500' },
            { id: 'profil-kop', label: 'Profil & KOP Sekolah', icon: School, color: 'text-amber-500' },
            { id: 'master-rules', label: 'Master Hak Akses & Rule', icon: ShieldCheck, color: 'text-teal-500' }
          ]
        }
      ];
    } else if (role === 'WALI_KELAS') {
      return [
        {
          group: 'PEMANTAUAN KELAS',
          items: [
            { id: 'buku-pager', label: `Rekap Setoran ${currentUser?.namaKelas || 'Kelas'}`, icon: BookOpen, color: 'text-indigo-500' },
            { id: 'kartu-spp', label: 'Kartu SPP Siswa Kelas', icon: Smartphone, color: 'text-emerald-500' }
          ]
        }
      ];
    } else {
      // Role SISWA / ORTU
      return [
        {
          group: 'PORTAL KEUANGAN SISWA',
          items: [
            { id: 'kartu-spp', label: 'Kartu SPP 12 Bulan & VA', icon: Smartphone, color: 'text-emerald-500' }
          ]
        }
      ];
    }
  };

  const menuGroups = getMenuItems();

  return (
    <aside className="w-64 lg:w-72 bg-slate-900 text-slate-300 flex flex-col justify-between flex-shrink-0 h-screen sticky top-0 border-r border-slate-800 no-print select-none shadow-xl">
      {/* 1. Header Identitas Sekolah & Logo */}
      <div>
        <div className="p-5 border-b border-slate-800/80 flex items-center gap-3.5 bg-slate-950/40">
          <SchoolLogo logoUrl={data.sekolah.logoUrl} className="w-11 h-11" />
          <div className="overflow-hidden">
            <h1 className="text-base font-extrabold tracking-tight text-white leading-tight flex items-center gap-1.5">
              SITAMPAN <span className="text-amber-400">SMK</span>
            </h1>
            <p className="text-[11px] font-semibold text-slate-400 truncate mt-0.5">
              {data.sekolah.nama}
            </p>
            <span className="inline-block text-[9px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 border border-emerald-800/50 px-1.5 py-0.2 rounded mt-1">
              TA {data.sekolah.tahunAjaranAktif}
            </span>
          </div>
        </div>

        {/* 2. Daftar Menu Sesuai Role Pengguna */}
        <div className="px-3 py-4 space-y-6 overflow-y-auto max-h-[calc(100vh-230px)]">
          {menuGroups.map((grp, idx) => (
            <div key={idx} className="space-y-1">
              <p className="px-3 text-[10px] font-extrabold uppercase tracking-widest text-slate-500">
                {grp.group}
              </p>
              <div className="space-y-0.5">
                {grp.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-extrabold'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.color}`} />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {isActive && <ChevronRight className="w-3.5 h-3.5 text-blue-200" />}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Footer: User Profile Card & Logout */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/60 space-y-2">
        {/* User Card */}
        <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-xs flex-shrink-0 border border-blue-500/30">
              <User className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">
                {currentUser?.nama || 'Pengguna'}
              </p>
              <p className="text-[10px] text-slate-400 truncate">
                {role === 'ADMIN'
                  ? 'Administrator TU'
                  : role === 'WALI_KELAS'
                  ? `Wali Kelas ${currentUser?.namaKelas || 'XII PM 1'}`
                  : `Siswa (${currentUser?.nis})`}
              </p>
            </div>
          </div>

          <button
            onClick={onLogout}
            title="Keluar / Ganti Akun"
            className="p-1.5 text-rose-400 hover:text-white hover:bg-rose-600/80 rounded-lg transition"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        {/* Action Button: Reset Data */}
        <button
          onClick={onResetData}
          className="w-full flex items-center justify-center gap-1.5 py-1 text-[11px] text-slate-500 hover:text-rose-400 transition"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset Data ke Standar Sekolah</span>
        </button>
      </div>
    </aside>
  );
}
