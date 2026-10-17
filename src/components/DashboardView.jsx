import React from 'react';
import { 
  TrendingUp, 
  CreditCard, 
  Banknote, 
  Smartphone, 
  AlertTriangle, 
  Building, 
  Users, 
  ArrowUpRight, 
  CheckCircle2, 
  Calendar,
  Layers,
  ArrowRight,
  PieChart
} from 'lucide-react';
import { dataService } from '../services/dataService';

export default function DashboardView({ 
  data, 
  onNavigate, 
  activeKelompok = 'ALL', 
  onSelectKelompok,
  currentUser 
}) {
  const role = currentUser?.role || '';
  const username = (currentUser?.username || '').toLowerCase();
  const isKasirHana = role === 'KASIR_HANA' || username === 'hana' || (currentUser?.kasirKelompok === 'BISNIS_MANAJEMEN' && role !== 'ADMIN' && role !== 'BENDAHARA');
  const isKasirUmi = role === 'KASIR_UMI' || username === 'umi' || (currentUser?.kasirKelompok === 'PARIWISATA' && role !== 'ADMIN' && role !== 'BENDAHARA');
  const isBendahara = role === 'BENDAHARA' || username === 'bendahara';
  const isKepsek = role === 'KEPALA_SEKOLAH' || username === 'kepsek';

  // Tentukan kelompok yang berlaku untuk kalkulasi dashboard
  const effectiveKelompok = isKasirHana 
    ? 'BISNIS_MANAJEMEN' 
    : isKasirUmi 
    ? 'PARIWISATA' 
    : activeKelompok;

  // Filter siswa sesuai sudut pandang aktif jika dipilih
  const filteredSiswa = data.siswa.filter((s) => {
    if (s.status !== 'AKTIF') return false;
    if (effectiveKelompok === 'BISNIS_MANAJEMEN') {
      return ['AKL', 'MPLB', 'PM'].includes(s.jurusanKode);
    }
    if (effectiveKelompok === 'PARIWISATA') {
      return ['KSP', 'HTL'].includes(s.jurusanKode);
    }
    return true;
  });

  // 1. Kalkulasi Sesuai Filter Sudut Pandang
  let totalPenerimaan = 0;
  let totalTunggakan = 0;
  let totalSiswaAktif = filteredSiswa.length;
  let totalSiswaLunas = 0;

  filteredSiswa.forEach((s) => {
    const calc = dataService.getKalkulasiSiswa(s);
    totalPenerimaan += calc.totalSudahBayar;
    totalTunggakan += calc.totalTunggakanAktif;
    if (calc.isLunasSmt1) totalSiswaLunas++;
  });

  // Hitung Berdasarkan Metode Pembayaran dari Riwayat
  const filteredSiswaIds = new Set(filteredSiswa.map(s => s.id));
  let totalTunai = 0;
  let totalVa = 0;
  data.riwayatPembayaran.forEach((p) => {
    if (effectiveKelompok !== 'ALL' && !filteredSiswaIds.has(p.siswaId)) return;
    if (p.metode === 'VA_TRANSFER') {
      totalVa += Number(p.total);
    } else {
      totalTunai += Number(p.total);
    }
  });

  // 2. Kalkulasi Per Jurusan Sesuai Filter
  const displayJurusan = data.jurusan.filter(j => {
    if (effectiveKelompok === 'BISNIS_MANAJEMEN') return ['AKL', 'MPLB', 'PM'].includes(j.kode);
    if (effectiveKelompok === 'PARIWISATA') return ['KSP', 'HTL'].includes(j.kode);
    return true;
  });

  const rekapJurusan = displayJurusan.map((j) => {
    const siswaJurusan = data.siswa.filter(
      (s) => s.jurusanKode === j.kode && s.status === 'AKTIF'
    );
    let masuk = 0;
    let nunggak = 0;
    let lunasCount = 0;

    siswaJurusan.forEach((s) => {
      const calc = dataService.getKalkulasiSiswa(s);
      masuk += calc.totalSudahBayar;
      nunggak += calc.totalTunggakanAktif;
      if (calc.isLunasSmt1) lunasCount++;
    });

    const targetTotal = masuk + nunggak;
    const persen = targetTotal > 0 ? Math.round((masuk / targetTotal) * 100) : 0;

    return {
      ...j,
      totalSiswa: siswaJurusan.length,
      lunasCount,
      masuk,
      nunggak,
      persen
    };
  });

  // 3. Kalkulasi Per Kelas Sesuai Filter
  const displayKelas = data.kelas.filter(k => {
    if (effectiveKelompok === 'BISNIS_MANAJEMEN') return ['AKL', 'MPLB', 'PM'].includes(k.jurusanKode);
    if (effectiveKelompok === 'PARIWISATA') return ['KSP', 'HTL'].includes(k.jurusanKode);
    return true;
  });

  const rekapKelas = displayKelas.map((k) => {
    const siswaKelas = data.siswa.filter(
      (s) => s.kelasId === k.id && s.status === 'AKTIF'
    );
    let masuk = 0;
    let nunggak = 0;
    let lunasCount = 0;

    siswaKelas.forEach((s) => {
      const calc = dataService.getKalkulasiSiswa(s);
      masuk += calc.totalSudahBayar;
      nunggak += calc.totalTunggakanAktif;
      if (calc.isLunasSmt1) lunasCount++;
    });

    const targetTotal = masuk + nunggak;
    const persen = targetTotal > 0 ? Math.round((masuk / targetTotal) * 100) : 0;

    return {
      ...k,
      totalSiswa: siswaKelas.length,
      lunasCount,
      masuk,
      nunggak,
      persen
    };
  });

  return (
    <div className="space-y-6">
      {/* Banner Utama */}
      <div className="bg-gradient-to-r from-blue-800 via-indigo-900 to-slate-900 text-white p-6 sm:p-7 rounded-3xl shadow-xl border border-white/10 relative overflow-hidden">
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-emerald-500/20 text-emerald-300 text-xs px-2.5 py-0.5 rounded-full font-bold border border-emerald-500/30 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Monitoring Finansial Real-Time
              </span>
              <span className="bg-white/10 text-slate-200 text-xs px-2.5 py-0.5 rounded-full font-medium">
                TA {data.sekolah.tahunAjaranAktif}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black mt-2 tracking-tight">
              {isKasirHana 
                ? '💼 Dashboard Loket Kasir 1: Bisnis & Manajemen'
                : isKasirUmi
                ? '🏖️ Dashboard Loket Kasir 2: Pariwisata'
                : isBendahara
                ? '💰 Dashboard Real-Time Keuangan Sekolah'
                : isKepsek
                ? '🏛️ Dashboard Monitoring Eksekutif Sekolah'
                : '🏢 Dashboard Pusat Kendali Keuangan SMK'}
            </h2>
            <p className="text-amber-200 text-xs sm:text-sm font-bold mt-1">
              {isKasirHana
                ? 'Layanan Kasir Khusus: Jurusan AKL, MPLB, dan PM (Kasir: Hana Pratiwi, A.Md.)'
                : isKasirUmi
                ? 'Layanan Kasir Khusus: Jurusan Kecantikan & Spa dan Perhotelan (Kasir: Umi Kalsum, S.E.)'
                : isBendahara
                ? 'Manajemen Arus Kas, Setoran Tunai Loket & Rekapitulasi Perbankan'
                : isKepsek
                ? 'Pemantauan Eksekutif Kelancaran Pembayaran & Rekapitulasi Rombel Sekolah'
                : 'Sistem Informasi Tagihan & Manajemen Pembayaran Keuangan SMK'}
            </p>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl">
              {isKasirHana
                ? 'Pantau setoran SPP, cicilan uang gedung (SPI), dan saldo piutang siswa khusus jurusan Bisnis & Manajemen.'
                : isKasirUmi
                ? 'Pantau setoran SPP, cicilan uang praktek spa/kitchen, dan saldo piutang siswa khusus jurusan Pariwisata.'
                : 'Pantau arus penerimaan SPP, cicilan uang gedung (SPI), dan saldo piutang siswa per jurusan serta per kelas secara otomatis.'}
            </p>
          </div>

          <div className="flex gap-2">
            {!isKepsek && (
              <button
                onClick={() => onNavigate('kasir')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center gap-1.5 cursor-pointer"
              >
                <CreditCard className="w-3.5 h-3.5" /> {isKasirHana ? 'Buka Kasir BisMan' : isKasirUmi ? 'Buka Kasir Pariwisata' : 'Buka Loket Kasir'}
              </button>
            )}
            <button
              onClick={() => onNavigate('buku-pager')}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold border border-white/20 transition flex items-center gap-1.5 cursor-pointer"
            >
              Buku Pager
            </button>
          </div>
        </div>
      </div>

      {/* Switcher Cepat Sudut Pandang Loket Kasir di Dashboard (Hanya untuk Admin & Bendahara) */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 w-full md:w-auto">
          <div className={`p-3 rounded-2xl border flex items-center justify-center flex-shrink-0 ${
            effectiveKelompok === 'BISNIS_MANAJEMEN'
              ? 'bg-blue-50 text-blue-700 border-blue-200'
              : effectiveKelompok === 'PARIWISATA'
              ? 'bg-rose-50 text-rose-700 border-rose-200'
              : 'bg-indigo-50 text-indigo-700 border-indigo-200'
          }`}>
            <Building className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                {isKasirHana ? 'Loket Kasir 1' : isKasirUmi ? 'Loket Kasir 2' : 'Mode Sudut Pandang'}
              </span>
              <span className="text-[11px] font-bold text-slate-500">
                {isKasirHana
                  ? 'Petugas Kasir: Hana Pratiwi (AKL, MPLB, PM)'
                  : isKasirUmi
                  ? 'Petugas Kasir: Umi Kalsum (KSP, HTL)'
                  : effectiveKelompok === 'BISNIS_MANAJEMEN'
                  ? 'Sudut Pandang Kasir: Hana (BisMan)'
                  : effectiveKelompok === 'PARIWISATA'
                  ? 'Sudut Pandang Kasir: Umi (Pariwisata)'
                  : 'Manajemen Pusat (Seluruh 5 Jurusan)'}
              </span>
            </div>
            <h3 className="text-base font-black text-slate-900 mt-0.5">
              {effectiveKelompok === 'BISNIS_MANAJEMEN'
                ? '💼 Kelompok BisMan (AKL, MPLB, PM)'
                : effectiveKelompok === 'PARIWISATA'
                ? '🏖️ Kelompok Pariwisata (Kecantikan & Spa, Perhotelan)'
                : '🏢 Semua Rombel (5 Jurusan Pusat)'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {effectiveKelompok === 'BISNIS_MANAJEMEN'
                ? 'Hanya menampilkan data keuangan dan statistik siswa jurusan AKL, MPLB, dan PM.'
                : effectiveKelompok === 'PARIWISATA'
                ? 'Hanya menampilkan data keuangan dan statistik siswa jurusan Kecantikan & Spa dan Perhotelan.'
                : 'Menampilkan seluruh rekapitulasi data keuangan 5 jurusan secara terpusat.'}
            </p>
          </div>
        </div>

        {/* 1-Klik Switcher Buttons (Hanya muncul jika Admin atau Bendahara) */}
        {!isKasirHana && !isKasirUmi ? (
          <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold w-full md:w-auto overflow-x-auto">
            <button
              type="button"
              onClick={() => onSelectKelompok && onSelectKelompok('ALL')}
              className={`flex-1 md:flex-none px-3.5 py-2 rounded-lg transition cursor-pointer whitespace-nowrap ${
                effectiveKelompok === 'ALL'
                  ? 'bg-white text-slate-900 shadow-xs font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🏢 Semua Rombel (5 Jurusan Pusat)
            </button>
            <button
              type="button"
              onClick={() => onSelectKelompok && onSelectKelompok('BISNIS_MANAJEMEN')}
              className={`flex-1 md:flex-none px-3.5 py-2 rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap ${
                effectiveKelompok === 'BISNIS_MANAJEMEN'
                  ? 'bg-blue-600 text-white shadow-xs font-black'
                  : 'text-blue-900 hover:bg-blue-100/60'
              }`}
            >
              💼 Kelompok BisMan (Loket Hana)
            </button>
            <button
              type="button"
              onClick={() => onSelectKelompok && onSelectKelompok('PARIWISATA')}
              className={`flex-1 md:flex-none px-3.5 py-2 rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap ${
                effectiveKelompok === 'PARIWISATA'
                  ? 'bg-rose-600 text-white shadow-xs font-black'
                  : 'text-rose-900 hover:bg-rose-100/60'
              }`}
            >
              🏖️ Kelompok Pariwisata (Loket Umi)
            </button>
          </div>
        ) : (
          <div className="px-3.5 py-2 bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Loket Resmi: {isKasirHana ? 'Hana Pratiwi (BisMan)' : 'Umi Kalsum (Pariwisata)'}</span>
          </div>
        )}
      </div>

      {/* 1. KARTU STATISTIK GLOBAL (4 KARTU) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Penerimaan Masuk */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Total Uang Masuk</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 font-mono">
            Rp {totalPenerimaan.toLocaleString('id-ID')}
          </p>
          <p className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Dari seluruh siswa aktif
          </p>
        </div>

        {/* Card 2: Setoran Tunai Loket */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Penerimaan Tunai</span>
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <Banknote className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 font-mono">
            Rp {totalTunai.toLocaleString('id-ID')}
          </p>
          <p className="text-[11px] text-slate-500">
            Disetor langsung di meja kasir TU
          </p>
        </div>

        {/* Card 3: Setoran Virtual Account (VA) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Virtual Account (VA)</span>
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
              <Smartphone className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-purple-700 font-mono">
            Rp {totalVa.toLocaleString('id-ID')}
          </p>
          <p className="text-[11px] text-purple-700 font-semibold">
            Transfer bank verifikasi instan
          </p>
        </div>

        {/* Card 4: Sisa Tunggakan Tertunda */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Sisa Piutang / Nunggak</span>
            <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-rose-600 font-mono">
            Rp {totalTunggakan.toLocaleString('id-ID')}
          </p>
          <p className="text-[11px] text-rose-700 font-semibold">
            {totalSiswaAktif - totalSiswaLunas} dari {totalSiswaAktif} siswa nunggak
          </p>
        </div>
      </div>

      {/* 2. KARTU HASIL PEMBAYARAN PER JURUSAN */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
            <Building className="w-5 h-5 text-blue-600" />
            Hasil Keuangan Per Program Keahlian (Jurusan)
          </h3>
          <span className="text-xs text-slate-500 font-medium">
            Tarif dan rincian berbeda tiap jurusan
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {rekapJurusan.map((j) => (
            <div
              key={j.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition space-y-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono text-xs font-black bg-blue-50 text-blue-800 px-2.5 py-1 rounded-lg border border-blue-200">
                    {j.kode}
                  </span>
                  <h4 className="font-bold text-sm text-slate-900 mt-2 line-clamp-1" title={j.nama}>
                    {j.nama}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {j.totalSiswa} Siswa Aktif • <strong className="text-emerald-700">{j.lunasCount} Lunas</strong>
                  </p>
                </div>
                <span className="text-xs font-black font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
                  {j.persen}%
                </span>
              </div>

              {/* Progress Bar Kelunasan */}
              <div className="space-y-1">
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${j.persen}%` }}
                  ></div>
                </div>
              </div>

              {/* Breakdown Masuk & Nunggak */}
              <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="text-slate-400 font-medium">Uang Masuk:</p>
                  <p className="font-bold font-mono text-emerald-700">
                    Rp {j.masuk.toLocaleString('id-ID')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-slate-400 font-medium">Tunggakan:</p>
                  <p className="font-bold font-mono text-rose-600">
                    Rp {j.nunggak.toLocaleString('id-ID')}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. KARTU HASIL PEMBAYARAN PER KELAS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" />
            Rekapitulasi Pembayaran Per Rombongan Belajar (Kelas)
          </h3>
          <span className="text-xs text-slate-500 font-medium">
            Monitoring kelayakan ambil rapor per kelas
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-700 text-xs font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Nama Kelas</th>
                  <th className="py-3 px-4">Wali Kelas</th>
                  <th className="py-3 px-4 text-center">Siswa Lunas / Total</th>
                  <th className="py-3 px-4 text-right">Uang Masuk</th>
                  <th className="py-3 px-4 text-right">Sisa Tunggakan</th>
                  <th className="py-3 px-4 text-center">Persentase</th>
                  <th className="py-3 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rekapKelas.map((k) => (
                  <tr key={k.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {k.nama}
                    </td>
                    <td className="py-3 px-4 text-slate-600 text-xs font-medium">
                      {k.waliKelas}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center gap-1 font-semibold text-xs text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                        <strong className="text-emerald-700">{k.lunasCount}</strong> / {k.totalSiswa} siswa
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-emerald-700">
                      Rp {k.masuk.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-rose-600">
                      Rp {k.nunggak.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        k.persen >= 75 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {k.persen}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => onNavigate('buku-pager')}
                        className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center gap-1"
                      >
                        Buka Pager <ArrowRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
