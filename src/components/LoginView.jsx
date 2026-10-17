import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Lock, 
  User, 
  CreditCard, 
  GraduationCap, 
  Smartphone, 
  LogIn, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle,
  Calendar,
  KeyRound,
  Check,
  Search,
  Sparkles
} from 'lucide-react';
import SchoolLogo from './SchoolLogo';

export default function LoginView({ data, onLogin }) {
  const [activeTab, setActiveTab] = useState('SISWA'); // Default langsung ke Siswa agar user bisa langsung coba
  const [staffRole, setStaffRole] = useState('ADMIN'); // 'ADMIN' | 'BENDAHARA' | 'KEPALA_SEKOLAH'
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  
  // State Khusus Login Siswa & Ortu
  const [inputNis, setInputNis] = useState('12640'); // Default Dian Verawati (AKL)
  const [tglLahir, setTglLahir] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // State Khusus Login Wali Kelas
  const [selectedWaliKelasId, setSelectedWaliKelasId] = useState(data.kelas[0]?.id || 1);

  // Cari data siswa secara otomatis saat NIS diketik
  const matchedSiswa = data.siswa.find(
    (s) => s.nis.trim() === inputNis.trim()
  );
  const matchedKelas = matchedSiswa
    ? data.kelas.find((k) => k.id === matchedSiswa.kelasId)
    : null;
  const matchedJurusan = matchedSiswa
    ? data.jurusan.find((j) => j.kode === matchedSiswa.jurusanKode)
    : null;

  // Set tgl lahir otomatis jika pilih preset demo
  const handlePilihNisPreset = (nis) => {
    setInputNis(nis);
    setErrorMsg('');
    const s = data.siswa.find((item) => item.nis === nis);
    if (s && s.tanggalLahir) {
      setTglLahir(s.tanggalLahir);
    }
  };

  const handleQuickLogin = (role, extra = {}) => {
    if (role === 'ADMIN') {
      onLogin({
        role: 'ADMIN',
        nama: 'Ibu Rini (Kasir Loket TU)',
        username: 'admin_tu'
      });
    } else if (role === 'BENDAHARA') {
      onLogin({
        role: 'BENDAHARA',
        nama: 'Hj. Siti Nurhaliza, S.E. (Bendahara Sekolah)',
        username: 'bendahara_keu'
      });
    } else if (role === 'KEPALA_SEKOLAH') {
      onLogin({
        role: 'KEPALA_SEKOLAH',
        nama: data.sekolah.kepalaSekolah || 'Drs. H. Mulyadi, M.Pd.',
        username: 'kepsek_smk'
      });
    } else if (role === 'WALI_KELAS') {
      const kls = data.kelas.find((k) => k.id === Number(selectedWaliKelasId)) || data.kelas[0];
      onLogin({
        role: 'WALI_KELAS',
        nama: kls?.waliKelas || 'Dra. Hj. Sri Lestari, M.Pd',
        kelasId: kls?.id || 1,
        namaKelas: kls?.nama || 'XII PM 1',
        username: `wali_${kls?.jurusanKode?.toLowerCase() || 'guru'}`
      });
    } else if (role === 'SISWA') {
      const s = extra.siswa || matchedSiswa || data.siswa[0];
      const k = data.kelas.find((kls) => kls.id === s.kelasId);
      const j = data.jurusan.find((jrs) => jrs.kode === s.jurusanKode);
      onLogin({
        role: 'ORTU',
        nama: s.nama,
        nis: s.nis,
        siswaId: s.id,
        kelasNama: k?.nama,
        jurusanKode: s.jurusanKode,
        jurusanNama: j?.nama,
        va: s.va
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (activeTab === 'ADMIN' || activeTab === 'STAFF') {
      const u = username.trim().toLowerCase();
      const p = password.trim();

      if (u === 'admin' && (p === 'admin123' || p === 'admin')) {
        handleQuickLogin('ADMIN');
      } else if (u === 'bendahara' && (p === 'bendahara123' || p === 'bendahara' || p === 'admin123' || p === 'admin')) {
        handleQuickLogin('BENDAHARA');
      } else if (u === 'kepsek' && (p === 'kepsek123' || p === 'kepsek' || p === 'admin123' || p === 'admin')) {
        handleQuickLogin('KEPALA_SEKOLAH');
      } else if (staffRole === 'BENDAHARA' && (p === 'bendahara123' || p === 'admin123' || p === 'admin')) {
        handleQuickLogin('BENDAHARA');
      } else if (staffRole === 'KEPALA_SEKOLAH' && (p === 'kepsek123' || p === 'admin123' || p === 'admin')) {
        handleQuickLogin('KEPALA_SEKOLAH');
      } else if (staffRole === 'ADMIN' && (p === 'admin123' || p === 'admin')) {
        handleQuickLogin('ADMIN');
      } else {
        setErrorMsg('Username atau password tidak sesuai! (Demo: admin/admin123, bendahara/bendahara123, kepsek/kepsek123)');
      }
    } else if (activeTab === 'WALI_KELAS') {
      handleQuickLogin('WALI_KELAS');
    } else if (activeTab === 'SISWA') {
      if (!matchedSiswa) {
        setErrorMsg('NIS tidak ditemukan! Pastikan 5 digit NIS sudah sesuai.');
        return;
      }

      if (!tglLahir) {
        setErrorMsg('Masukkan tanggal lahir siswa untuk verifikasi keamanan!');
        return;
      }

      // Verifikasi Tanggal Lahir
      const expectedDate = matchedSiswa.tanggalLahir || '2008-08-17';
      if (tglLahir === expectedDate) {
        handleQuickLogin('SISWA', { siswa: matchedSiswa });
      } else {
        setErrorMsg(
          `Tanggal lahir tidak sesuai dengan data sekolah! (Bantuan Demo: gunakan tanggal ${expectedDate})`
        );
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 flex items-center justify-center p-4 sm:p-6">
      {/* Background Glow Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-md w-full bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
        {/* Header Logo & Identitas Sekolah Dinamis Sesuai Profil */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white p-6 sm:p-7 text-center relative">
          <div className="flex justify-center mb-2.5">
            <SchoolLogo logoUrl={data.sekolah.logoUrl} className="w-16 h-16 drop-shadow-lg" />
          </div>
          <span className="bg-amber-400/20 text-amber-200 text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full border border-amber-400/30">
            Aplikasi Keuangan Sekolah
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight mt-1.5">
            SITAMPAN <span className="text-amber-300">SMK</span>
          </h1>
          <p className="text-[11px] sm:text-xs font-bold text-amber-200 mt-1 leading-snug max-w-sm mx-auto">
            <span className="text-white underline decoration-amber-400">S</span>istem <span className="text-white underline decoration-amber-400">I</span>nformasi <span className="text-white underline decoration-amber-400">TA</span>gihan & <span className="text-white underline decoration-amber-400">M</span>anajemen <span className="text-white underline decoration-amber-400">P</span>embay<span className="text-white underline decoration-amber-400">A</span>ran Keua<span className="text-white underline decoration-amber-400">N</span>gan SMK
          </p>
          <p className="text-xs text-blue-100 mt-1 font-medium">
            {data.sekolah.nama} • Terakreditasi {data.sekolah.akreditasi}
          </p>
        </div>

        {/* Tab Switcher Role Login */}
        <div className="flex border-b border-slate-200 bg-slate-50 p-1.5 gap-1 text-xs font-bold text-slate-600">
          <button
            type="button"
            onClick={() => {
              setActiveTab('SISWA');
              setErrorMsg('');
            }}
            className={`flex-1 py-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
              activeTab === 'SISWA'
                ? 'bg-white text-emerald-700 shadow-xs border border-slate-200 font-extrabold'
                : 'hover:text-slate-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            Siswa & Ortu
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('WALI_KELAS');
              setErrorMsg('');
            }}
            className={`flex-1 py-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
              activeTab === 'WALI_KELAS'
                ? 'bg-white text-indigo-700 shadow-xs border border-slate-200 font-extrabold'
                : 'hover:text-slate-900'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            Wali Kelas
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('STAFF');
              setErrorMsg('');
            }}
            className={`flex-1 py-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
              activeTab === 'STAFF' || activeTab === 'ADMIN'
                ? 'bg-white text-blue-700 shadow-xs border border-slate-200 font-extrabold'
                : 'hover:text-slate-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            Pimpinan & TU
          </button>
        </div>

        {/* Form Container */}
        <div className="p-6 sm:p-7 space-y-4">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* ========================================================= */}
            {/* FORM KHUSUS SISWA & ORTU: KETIK NIS -> MUNCUL NAMA & JURUSAN -> VERIFIKASI TGL LAHIR */}
            {/* ========================================================= */}
            {activeTab === 'SISWA' && (
              <div className="space-y-3.5">
                {/* 1. Input NIS */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase">
                      1. Ketik Nomor Induk Siswa (NIS)
                    </label>
                    <span className="text-[11px] text-slate-500 font-medium">
                      5 Digit Angka
                    </span>
                  </div>
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={inputNis}
                      onChange={(e) => {
                        setInputNis(e.target.value);
                        setErrorMsg('');
                      }}
                      placeholder="Ketik NIS (Contoh: 12640, 12643, 12553)..."
                      className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold font-mono focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-hidden transition"
                      required
                    />
                  </div>
                </div>

                {/* 2. Kartu Deteksi Otomatis: Muncul Nama & Jurusannya */}
                {matchedSiswa ? (
                  <div className="p-3.5 bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-300 rounded-2xl shadow-xs transition-all animate-fadeIn">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-200/80 text-emerald-900">
                          <CheckCircle2 className="w-3 h-3 text-emerald-700" /> Siswa Terverifikasi
                        </span>
                        <p className="font-extrabold text-sm text-slate-900 leading-snug">
                          {matchedSiswa.nama}
                        </p>
                        <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-600 pt-0.5">
                          <span className="font-bold text-indigo-700 bg-white px-2 py-0.5 rounded border border-indigo-200">
                            {matchedKelas?.nama || matchedSiswa.tingkat}
                          </span>
                          <span>•</span>
                          <span className="font-semibold text-slate-700">
                            Jurusan: {matchedJurusan?.nama || matchedSiswa.jurusanKode}
                          </span>
                        </div>
                      </div>
                      <span className="text-xl">🎓</span>
                    </div>
                  </div>
                ) : (
                  inputNis && (
                    <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-800 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>Siswa dengan NIS <strong>{inputNis}</strong> belum ditemukan. Pastikan nomor sudah benar.</span>
                    </div>
                  )
                )}

                {/* 3. Input Verifikasi Tanggal Lahir (Aktif setelah NIS dikenali) */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase">
                      2. Verifikasi Tanggal Lahir Siswa
                    </label>
                    <span className="text-[11px] text-slate-500">
                      Keamanan Akun
                    </span>
                  </div>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="date"
                      value={tglLahir}
                      onChange={(e) => {
                        setTglLahir(e.target.value);
                        setErrorMsg('');
                      }}
                      className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-hidden transition"
                      required
                    />
                  </div>

                  {/* Tombol Bantu Demo Tanggal Lahir */}
                  {matchedSiswa && (
                    <div className="mt-1.5 flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">Sesuai data sekolah:</span>
                      <button
                        type="button"
                        onClick={() => setTglLahir(matchedSiswa.tanggalLahir || '2008-08-17')}
                        className="text-emerald-700 font-bold hover:underline flex items-center gap-1"
                      >
                        <Sparkles className="w-3 h-3" /> Isi Tgl Demo ({matchedSiswa.tanggalLahir || '2008-08-17'})
                      </button>
                    </div>
                  )}
                </div>

                {/* Pilihan Cepat Uji Coba NIS per Jurusan (Trial Mode) */}
                <div className="pt-2 border-t border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Contoh NIS Siswa per Jurusan (Bisa Diklik Langsung):
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => handlePilihNisPreset('12640')}
                      className={`text-[11px] px-2.5 py-1 rounded-lg border font-semibold transition ${
                        inputNis === '12640'
                          ? 'bg-emerald-100 border-emerald-400 text-emerald-900 font-bold'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      AKL: 12640 (Dian)
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePilihNisPreset('12643')}
                      className={`text-[11px] px-2.5 py-1 rounded-lg border font-semibold transition ${
                        inputNis === '12643'
                          ? 'bg-emerald-100 border-emerald-400 text-emerald-900 font-bold'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      PM: 12643 (Abi)
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePilihNisPreset('12553')}
                      className={`text-[11px] px-2.5 py-1 rounded-lg border font-semibold transition ${
                        inputNis === '12553'
                          ? 'bg-emerald-100 border-emerald-400 text-emerald-900 font-bold'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      PAR: 12553 (Anjana)
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* FORM ROLE 2: PIMPINAN & STAF TU (KEPSEK, BENDAHARA, KASIR TU) */}
            {/* ========================================================= */}
            {(activeTab === 'ADMIN' || activeTab === 'STAFF') && (
              <div className="space-y-3.5">
                {/* Selector 3 Peran: Kepsek, Bendahara, Kasir TU */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                    Pilih Peran Akun Manajemen:
                  </label>
                  <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => {
                        setStaffRole('KEPALA_SEKOLAH');
                        setUsername('kepsek');
                        setPassword('kepsek123');
                        setErrorMsg('');
                      }}
                      className={`py-2 px-1 rounded-lg transition text-center cursor-pointer ${
                        staffRole === 'KEPALA_SEKOLAH'
                          ? 'bg-amber-400 text-slate-900 shadow-xs font-black'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                      }`}
                    >
                      🏛️ Kepsek
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setStaffRole('BENDAHARA');
                        setUsername('bendahara');
                        setPassword('bendahara123');
                        setErrorMsg('');
                      }}
                      className={`py-2 px-1 rounded-lg transition text-center cursor-pointer ${
                        staffRole === 'BENDAHARA'
                          ? 'bg-purple-600 text-white shadow-xs font-black'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                      }`}
                    >
                      💰 Bendahara
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setStaffRole('ADMIN');
                        setUsername('admin');
                        setPassword('admin123');
                        setErrorMsg('');
                      }}
                      className={`py-2 px-1 rounded-lg transition text-center cursor-pointer ${
                        staffRole === 'ADMIN'
                          ? 'bg-blue-600 text-white shadow-xs font-black'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                      }`}
                    >
                      💼 Kasir TU
                    </button>
                  </div>
                </div>

                {/* Badge Info Nama Petugas Sesuai Peran Terpilih */}
                <div className={`p-3 rounded-xl border text-xs space-y-0.5 transition ${
                  staffRole === 'KEPALA_SEKOLAH'
                    ? 'bg-amber-50 border-amber-200 text-amber-950'
                    : staffRole === 'BENDAHARA'
                    ? 'bg-purple-50 border-purple-200 text-purple-950'
                    : 'bg-blue-50 border-blue-200 text-blue-950'
                }`}>
                  <p className="font-bold flex items-center gap-1.5 text-xs">
                    <ShieldCheck className="w-4 h-4 flex-shrink-0" />
                    {staffRole === 'KEPALA_SEKOLAH'
                      ? data.sekolah.kepalaSekolah || 'Drs. H. Mulyadi, M.Pd.'
                      : staffRole === 'BENDAHARA'
                      ? 'Hj. Siti Nurhaliza, S.E. (Bendahara Sekolah)'
                      : 'Ibu Rini (Kasir Loket TU)'}
                  </p>
                  <p className="text-[11px] opacity-80 leading-tight">
                    {staffRole === 'KEPALA_SEKOLAH'
                      ? 'Monitoring Eksekutif Keuangan & Laporan Seluruh Kelas'
                      : staffRole === 'BENDAHARA'
                      ? 'Manajemen Keuangan, Tarif Multi-Jurusan & Validasi Setoran'
                      : 'Loket Penerimaan Pembayaran Tunai Siswa & Cetak Kuitansi'}
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">
                    Username
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Username"
                      className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white outline-hidden transition"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">
                    Kata Sandi (Password)
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white outline-hidden transition"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* FORM ROLE 3: WALI KELAS */}
            {/* ========================================================= */}
            {activeTab === 'WALI_KELAS' && (
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                  Pilih Guru / Wali Kelas Binaan:
                </label>
                <select
                  value={selectedWaliKelasId}
                  onChange={(e) => setSelectedWaliKelasId(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500"
                >
                  {data.kelas.map((k) => (
                    <option key={k.id} value={k.id}>
                      {k.nama} — {k.waliKelas}
                    </option>
                  ))}
                </select>

                {(() => {
                  const kls = data.kelas.find((k) => k.id === Number(selectedWaliKelasId)) || data.kelas[0];
                  return (
                    <div className="p-3.5 bg-indigo-50 border border-indigo-200 rounded-xl text-xs text-indigo-900 space-y-1">
                      <p className="font-bold flex items-center gap-1.5 text-sm">
                        <ShieldCheck className="w-4 h-4 text-indigo-600" />
                        {kls?.waliKelas || 'Dra. Hj. Sri Lestari, M.Pd'}
                      </p>
                      <p className="text-indigo-700">Wali Kelas: <strong>{kls?.nama} ({kls?.jurusanKode})</strong></p>
                    </div>
                  );
                })()}

                <p className="text-[11px] text-slate-500">
                  Wali kelas dapat langsung memantau buku pager setoran uang SPP kelas binaannya dan verifikasi syarat kelayakan pengambilan rapor siswa.
                </p>
              </div>
            )}

            {/* Tombol Submit Utama */}
            <button
              type="submit"
              className={`w-full py-3 text-white rounded-xl text-sm font-bold shadow-lg flex items-center justify-center gap-2 transition cursor-pointer ${
                activeTab === 'SISWA'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 shadow-emerald-500/25'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 shadow-blue-500/25'
              }`}
            >
              <LogIn className="w-4 h-4" />
              {activeTab === 'SISWA' ? 'Verifikasi & Masuk Portal Siswa' : 'Masuk ke Aplikasi'}
            </button>
          </form>

          {/* Quick 1-Click Demo Testing Box */}
          <div className="pt-3 border-t border-slate-200 text-center">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-center gap-1">
              <KeyRound className="w-3.5 h-3.5" /> Akses Sekali Klik (Demo Cepat)
            </p>
            <div className="flex flex-wrap gap-1.5 justify-center">
              <button
                type="button"
                onClick={() => handleQuickLogin('KEPALA_SEKOLAH')}
                className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-lg text-xs font-bold border border-amber-300 transition cursor-pointer"
                title="Login sebagai Kepala Sekolah"
              >
                🏛️ Kepala Sekolah
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('BENDAHARA')}
                className="px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-900 rounded-lg text-xs font-bold border border-purple-300 transition cursor-pointer"
                title="Login sebagai Bendahara Sekolah"
              >
                💰 Bendahara
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('ADMIN')}
                className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold border border-blue-200 transition cursor-pointer"
                title="Login sebagai Kasir Loket TU"
              >
                💼 Kasir TU
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('WALI_KELAS')}
                className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-semibold border border-indigo-200 transition cursor-pointer"
                title="Login sebagai Wali Kelas"
              >
                👨‍🏫 Wali Kelas
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('SISWA', { siswa: data.siswa[0] })}
                className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs font-semibold border border-emerald-200 transition cursor-pointer"
                title="Login sebagai Siswa PM (Abi)"
              >
                🎓 Siswa PM (Abi)
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('SISWA', { siswa: data.siswa[1] || data.siswa[0] })}
                className="px-2.5 py-1 bg-teal-50 hover:bg-teal-100 text-teal-800 rounded-lg text-xs font-semibold border border-teal-200 transition cursor-pointer"
                title="Login sebagai Siswa AKL (Dian)"
              >
                🎓 Siswa AKL (Dian)
              </button>
            </div>
          </div>
        </div>

        {/* Footer Card */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3 text-center text-[11px] text-slate-500 space-y-0.5">
          <p className="font-bold text-slate-700">
            SITAMPAN SMK — Sistem Informasi Tagihan & Manajemen Pembayaran
          </p>
          <p className="text-[10px] text-slate-400">
            Manajemen Keuangan SPP & Kasir Terpadu • {data.sekolah.nama}
          </p>
        </div>
      </div>
    </div>
  );
}
