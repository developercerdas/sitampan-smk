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

export default function LoginView({ data, onLogin }) {
  const [activeTab, setActiveTab] = useState('SISWA'); // Default langsung ke Siswa agar user bisa langsung coba
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  
  // State Khusus Login Siswa & Ortu
  const [inputNis, setInputNis] = useState('12640'); // Default Dian Verawati (AKL)
  const [tglLahir, setTglLahir] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

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
        nama: 'Ibu Rini (Kasir TU & Bendahara)',
        username: 'admin_tu'
      });
    } else if (role === 'WALI_KELAS') {
      onLogin({
        role: 'WALI_KELAS',
        nama: 'Dra. Hj. Siti Aminah, M.Pd',
        kelasId: 1,
        namaKelas: 'XII PM 1',
        username: 'wali_pm1'
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

    if (activeTab === 'ADMIN') {
      if (username === 'admin' && (password === 'admin123' || password === 'admin')) {
        handleQuickLogin('ADMIN');
      } else {
        setErrorMsg('Username atau password admin salah! (Demo: admin / admin123)');
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
        {/* Header Logo & Identitas Sekolah */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white p-6 sm:p-7 text-center relative">
          <div className="w-14 h-14 mx-auto bg-white rounded-2xl flex items-center justify-center text-blue-700 font-black text-2xl shadow-lg shadow-black/20 mb-3 border-2 border-white/60">
            S
          </div>
          <span className="bg-blue-500/30 text-blue-100 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-blue-400/30">
            Sistem Informasi Keuangan Siswa
          </span>
          <h1 className="text-2xl font-black tracking-tight mt-1.5">
            SITAMPAN <span className="text-amber-300">SMK</span>
          </h1>
          <p className="text-xs text-blue-100 mt-1 font-medium">
            SMK PGRI 1 Mejobo Kudus • Terakreditasi A
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
              setActiveTab('ADMIN');
              setErrorMsg('');
            }}
            className={`flex-1 py-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
              activeTab === 'ADMIN'
                ? 'bg-white text-blue-700 shadow-xs border border-slate-200 font-extrabold'
                : 'hover:text-slate-900'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            Kasir / TU
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
            {/* FORM ROLE 2: ADMIN / KASIR TU */}
            {/* ========================================================= */}
            {activeTab === 'ADMIN' && (
              <div className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">
                    Username Petugas
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="admin"
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
                  Pilih Guru / Wali Kelas
                </label>
                <div className="p-3.5 bg-indigo-50 border border-indigo-200 rounded-xl text-xs text-indigo-900 space-y-1">
                  <p className="font-bold flex items-center gap-1.5 text-sm">
                    <ShieldCheck className="w-4 h-4 text-indigo-600" />
                    Hj. Khofifah, S.Pd
                  </p>
                  <p className="text-indigo-700">Wali Kelas: <strong>XII PM 1 (Sesuai Dokumen Rekap Asli)</strong></p>
                </div>
                <p className="text-[11px] text-slate-500">
                  Wali kelas dapat langsung memantau buku pager setoran uang SPP kelasnya dan verifikasi syarat pengambilan rapor siswa.
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
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                type="button"
                onClick={() => handleQuickLogin('ADMIN')}
                className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold border border-blue-200 transition"
              >
                ⚡ Kasir TU
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('WALI_KELAS')}
                className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-semibold border border-indigo-200 transition"
              >
                ⚡ Wali Kelas
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('SISWA', { siswa: data.siswa[0] })}
                className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs font-semibold border border-emerald-200 transition"
              >
                ⚡ Siswa PM (Abi)
              </button>
            </div>
          </div>
        </div>

        {/* Footer Card */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-2.5 text-center text-[11px] text-slate-500">
          SITAMPAN SMK • Keuangan Digital SMK PGRI 1 Mejobo Kudus
        </div>
      </div>
    </div>
  );
}
