import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Printer, 
  Filter, 
  CheckCircle, 
  XCircle, 
  Download,
  AlertTriangle,
  UserCheck,
  Smartphone,
  Table,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Users
} from 'lucide-react';
import { dataService } from '../services/dataService';

export default function BukuPagerView({ 
  data, 
  currentRole, 
  currentUser, 
  activeKelompok,
  onShowKuitansi 
}) {
  const isWaliKelas = currentRole === 'WALI_KELAS';
  const username = (currentUser?.username || '').toLowerCase();
  const isKasirHana = currentRole === 'KASIR_HANA' || username === 'hana' || (currentUser?.kasirKelompok === 'BISNIS_MANAJEMEN' && currentRole !== 'ADMIN' && currentRole !== 'BENDAHARA');
  const isKasirUmi = currentRole === 'KASIR_UMI' || username === 'umi' || (currentUser?.kasirKelompok === 'PARIWISATA' && currentRole !== 'ADMIN' && currentRole !== 'BENDAHARA');
  const isKasirTetap = isKasirHana || isKasirUmi || !!currentUser?.isKasirTetap;
  const effectiveKelompok = isKasirHana ? 'BISNIS_MANAJEMEN' : isKasirUmi ? 'PARIWISATA' : (activeKelompok || currentUser?.kasirKelompok || 'ALL');

  // Jika wali kelas, default ke kelas bimbingan miliknya. Jika kasir spesifik, default ke rombel kelompoknya
  let defaultKelas = data.kelas[0]?.id || 1;
  if (isWaliKelas && currentUser?.kelasId) {
    defaultKelas = currentUser.kelasId;
  } else if (isKasirHana) {
    const kBis = data.kelas.find(k => k.kelompok === 'BISNIS_MANAJEMEN' || ['AKL', 'MPLB', 'PM'].includes(k.jurusanKode));
    if (kBis) defaultKelas = kBis.id;
  } else if (isKasirUmi) {
    const kPar = data.kelas.find(k => k.kelompok === 'PARIWISATA' || ['KSP', 'HTL'].includes(k.jurusanKode));
    if (kPar) defaultKelas = kPar.id;
  }

  const [selectedKelasId, setSelectedKelasId] = useState(defaultKelas);
  const [tanggalCutOff, setTanggalCutOff] = useState('10 - 10 - 2026');
  const [subTab, setSubTab] = useState('tabel-folio'); // 'tabel-folio' | 'kartu-siswa'

  // Sinkronkan kelas pilihan saat activeKelompok diganti dari global switcher
  React.useEffect(() => {
    if (activeKelompok === 'BISNIS_MANAJEMEN') {
      const kBis = data.kelas.find(k => k.kelompok === 'BISNIS_MANAJEMEN' || ['AKL', 'MPLB', 'PM'].includes(k.jurusanKode));
      if (kBis) setSelectedKelasId(kBis.id);
    } else if (activeKelompok === 'PARIWISATA') {
      const kPar = data.kelas.find(k => k.kelompok === 'PARIWISATA' || ['KSP', 'HTL'].includes(k.jurusanKode));
      if (kPar) setSelectedKelasId(kPar.id);
    }
  }, [activeKelompok, data.kelas]);

  const selectedKelas = data.kelas.find((k) => k.id === Number(selectedKelasId)) || data.kelas[0];
  const siswaList = data.siswa.filter(
    (s) => s.kelasId === Number(selectedKelasId) && s.status === 'AKTIF'
  );

  // Pisahkan kelas berdasarkan kelompok
  const kelasBisMan = data.kelas.filter(k => k.kelompok === 'BISNIS_MANAJEMEN' || ['AKL', 'MPLB', 'PM'].includes(k.jurusanKode));
  const kelasPariwisata = data.kelas.filter(k => k.kelompok === 'PARIWISATA' || ['KSP', 'HTL'].includes(k.jurusanKode));
  const kelasLain = data.kelas.filter(k => !kelasBisMan.some(b => b.id === k.id) && !kelasPariwisata.some(p => p.id === k.id));

  // Hitung total kolom bawah & statistik kelas
  let totalSpi = 0;
  let totalTunggakanLalu = 0;
  let totalDuJuli = 0;
  let totalAgust = 0;
  let totalSept = 0;
  let totalOkt = 0;
  let totalNop = 0;
  let totalDes = 0;
  let grandTotal = 0;
  let totalLunasCount = 0;

  siswaList.forEach((s) => {
    totalSpi += Number(s.spi || 0);
    totalTunggakanLalu += Number(s.tunggakanLalu || 0);
    totalDuJuli += Number(s.duJuli || 0);
    totalAgust += Number(s.bayarBulanan?.['Agustus'] || 0);
    totalSept += Number(s.bayarBulanan?.['September'] || 0);
    totalOkt += Number(s.bayarBulanan?.['Oktober'] || 0);
    totalNop += Number(s.bayarBulanan?.['November'] || 0);
    totalDes += Number(s.bayarBulanan?.['Desember'] || 0);

    const calc = dataService.getKalkulasiSiswa(s);
    grandTotal += calc.totalSudahBayar;
    if (calc.isLunasSmt1) totalLunasCount++;
  });

  const handleExportExcel = () => {
    dataService.exportBukuPagerToExcel(selectedKelasId);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* 1. TOP FILTER & ACTION BAR */}
      <div className="no-print bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
              {isWaliKelas ? 'Kelas Bimbingan Anda' : 'Pilih Rombongan Belajar (Kelas)'}
            </label>
            <select
              value={selectedKelasId}
              onChange={(e) => setSelectedKelasId(Number(e.target.value))}
              className="bg-slate-50 border border-slate-300 font-bold text-slate-800 text-xs sm:text-sm rounded-xl px-3.5 py-2 focus:ring-2 focus:ring-blue-500"
            >
              {(!isKasirTetap || isKasirHana) && (
                <optgroup label="💼 Kelompok Bisnis & Manajemen (Kasir: Hana)">
                  {kelasBisMan.map((k) => (
                    <option key={k.id} value={k.id}>
                      {k.nama} • Wali: {k.waliKelas} {isWaliKelas && k.id === currentUser?.kelasId ? '★ (Kelas Anda)' : ''}
                    </option>
                  ))}
                </optgroup>
              )}
              {(!isKasirTetap || isKasirUmi) && (
                <optgroup label="🏖️ Kelompok Pariwisata (Kasir: Umi)">
                  {kelasPariwisata.map((k) => (
                    <option key={k.id} value={k.id}>
                      {k.nama} • Wali: {k.waliKelas} {isWaliKelas && k.id === currentUser?.kelasId ? '★ (Kelas Anda)' : ''}
                    </option>
                  ))}
                </optgroup>
              )}
              {!isKasirTetap && kelasLain.length > 0 && (
                <optgroup label="Lainnya">
                  {kelasLain.map((k) => (
                    <option key={k.id} value={k.id}>
                      {k.nama} • Wali: {k.waliKelas}
                    </option>
                  ))}
                </optgroup>
              )}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
              Per Tanggal Rekap (Cut-off)
            </label>
            <input
              type="text"
              value={tanggalCutOff}
              onChange={(e) => setTanggalCutOff(e.target.value)}
              className="bg-slate-50 border border-slate-300 text-slate-800 text-xs sm:text-sm rounded-xl px-3 py-2 w-32 sm:w-36 font-medium"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportExcel}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs transition cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Ekspor Excel
          </button>

          <button
            onClick={handlePrint}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs transition cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            Cetak Folio
          </button>
        </div>
      </div>

      {/* 2. STATISTIK RINGKAS KELAS (4 KARTU) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 no-print">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase">Siswa Terdaftar</p>
          <p className="text-xl sm:text-2xl font-black text-slate-900 mt-1 font-mono">
            {siswaList.length} <span className="text-xs font-normal text-slate-500">Siswa</span>
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">{selectedKelas?.nama}</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase">Rapor Aman (Lunas)</p>
          <p className="text-xl sm:text-2xl font-black text-emerald-600 mt-1 font-mono">
            {totalLunasCount} <span className="text-xs font-normal text-slate-500">Siswa</span>
          </p>
          <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">Boleh Ambil Rapor</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase">Rapor Tertahan</p>
          <p className="text-xl sm:text-2xl font-black text-rose-600 mt-1 font-mono">
            {siswaList.length - totalLunasCount} <span className="text-xs font-normal text-slate-500">Siswa</span>
          </p>
          <p className="text-[11px] text-rose-700 font-semibold mt-0.5">Ada Tunggakan</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase">Total Uang Masuk</p>
          <p className="text-lg sm:text-xl font-black text-blue-700 mt-1 font-mono">
            Rp {grandTotal.toLocaleString('id-ID')}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">Seluruh Pos Setoran</p>
        </div>
      </div>

      {/* 3. SUB-TAB SWITCHER: TABEL FOLIO vs KARTU SISWA (RESPONSIF MOBILE) */}
      <div className="no-print flex items-center gap-1.5 p-1 bg-slate-200/80 rounded-2xl border border-slate-300 text-xs font-bold">
        <button
          type="button"
          onClick={() => setSubTab('tabel-folio')}
          className={`flex-1 py-2 px-3 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer ${
            subTab === 'tabel-folio'
              ? 'bg-white text-blue-700 shadow-xs font-extrabold ring-1 ring-slate-300'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Table className="w-4 h-4 text-blue-600 flex-shrink-0" />
          <span>📋 Tabel Folio Asli (13 Kolom)</span>
        </button>

        <button
          type="button"
          onClick={() => setSubTab('kartu-siswa')}
          className={`flex-1 py-2 px-3 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer ${
            subTab === 'kartu-siswa'
              ? 'bg-white text-indigo-700 shadow-xs font-extrabold ring-1 ring-slate-300'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Smartphone className="w-4 h-4 text-indigo-600 flex-shrink-0" />
          <span>📱 Rekap Siswa Per Kartu (Mobile)</span>
        </button>
      </div>

      {/* 4A. TAMPILAN TABEL FOLIO DIGITAL (SESUAI DOKUMEN ASLI FOTO 1) */}
      {subTab === 'tabel-folio' && (
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm print:m-0 print:border-none print:p-0 animate-fadeIn">
          {/* Mobile Scroll Hint Banner */}
          <div className="no-print mb-3 p-2.5 bg-blue-50 border border-blue-200 rounded-xl text-xs font-semibold text-blue-900 flex items-center justify-between gap-2 md:hidden">
            <span>💡 <strong>Layar HP:</strong> Geser tabel ke samping untuk melihat seluruh bulan & syarat rapor</span>
            <span>👉</span>
          </div>

          {/* Header Lembar Setoran */}
          <div className="text-center pb-4 border-b-2 border-slate-900 mb-4">
            <h2 className="text-lg sm:text-xl font-black text-slate-900 uppercase tracking-tight">
              DAFTAR SETORAN SPP {data.sekolah.nama}
            </h2>
            <p className="text-xs sm:text-sm font-bold text-slate-700 uppercase">
              TAHUN PELAJARAN {data.sekolah.tahunAjaranAktif}
            </p>
            <div className="flex flex-col sm:flex-row justify-between items-center text-[11px] sm:text-xs font-bold mt-3 px-1 gap-1">
              <span>PER TANGGAL : {tanggalCutOff}</span>
              <span>KELAS : {selectedKelas?.nama} (Wali Kelas: {selectedKelas?.waliKelas})</span>
              <span>DU : Rp 905.000 | SPP : Rp 325.000</span>
            </div>
          </div>

          {/* Tabel Rekapitulasi Data Siswa (Scrollable Horizontal Safe) */}
          <div className="overflow-x-auto">
            <table className="min-w-[760px] w-full text-xs text-left border-collapse border border-slate-800">
              <thead className="bg-slate-100 text-slate-900 font-extrabold uppercase text-[11px] text-center border-b border-slate-800">
                <tr>
                  <th className="border border-slate-800 py-2 px-1 w-8">NO</th>
                  <th className="border border-slate-800 py-2 px-2 w-16">NIS</th>
                  <th className="border border-slate-800 py-2 px-3 text-left">NAMA SISWA</th>
                  <th className="border border-slate-800 py-2 px-2 text-right">SPI</th>
                  <th className="border border-slate-800 py-2 px-2 text-right">Spp Lalu</th>
                  <th className="border border-slate-800 py-2 px-2 text-right">DU+JULI</th>
                  <th className="border border-slate-800 py-2 px-2 text-right">AGUST.</th>
                  <th className="border border-slate-800 py-2 px-2 text-right">SEPT.</th>
                  <th className="border border-slate-800 py-2 px-2 text-right">OKT.</th>
                  <th className="border border-slate-800 py-2 px-2 text-right">NOP.</th>
                  <th className="border border-slate-800 py-2 px-2 text-right">DES.</th>
                  <th className="border border-slate-800 py-2 px-3 text-right bg-slate-200">TOTAL</th>
                  <th className="border border-slate-800 py-2 px-2 no-print text-center">SYARAT RAPOR</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-300 font-mono">
                {siswaList.map((s, idx) => {
                  const calc = dataService.getKalkulasiSiswa(s);
                  return (
                    <tr key={s.id} className="hover:bg-slate-50">
                      <td className="border border-slate-800 text-center py-1.5 px-1 font-sans">{idx + 1}</td>
                      <td className="border border-slate-800 text-center py-1.5 px-2">{s.nis}</td>
                      <td className="border border-slate-800 py-1.5 px-3 font-sans font-bold text-slate-900">
                        {s.nama}
                      </td>
                      <td className="border border-slate-800 py-1.5 px-2 text-right">
                        {s.spi ? Number(s.spi).toLocaleString('id-ID') : '-'}
                      </td>
                      <td className="border border-slate-800 py-1.5 px-2 text-right">
                        {s.tunggakanLalu ? Number(s.tunggakanLalu).toLocaleString('id-ID') : '-'}
                      </td>
                      <td className="border border-slate-800 py-1.5 px-2 text-right font-bold text-blue-900">
                        {s.duJuli ? Number(s.duJuli).toLocaleString('id-ID') : '-'}
                      </td>
                      <td className="border border-slate-800 py-1.5 px-2 text-right">
                        {s.bayarBulanan?.['Agustus'] ? Number(s.bayarBulanan['Agustus']).toLocaleString('id-ID') : '-'}
                      </td>
                      <td className="border border-slate-800 py-1.5 px-2 text-right">
                        {s.bayarBulanan?.['September'] ? Number(s.bayarBulanan['September']).toLocaleString('id-ID') : '-'}
                      </td>
                      <td className="border border-slate-800 py-1.5 px-2 text-right">
                        {s.bayarBulanan?.['Oktober'] ? Number(s.bayarBulanan['Oktober']).toLocaleString('id-ID') : '-'}
                      </td>
                      <td className="border border-slate-800 py-1.5 px-2 text-right">
                        {s.bayarBulanan?.['November'] ? Number(s.bayarBulanan['November']).toLocaleString('id-ID') : '-'}
                      </td>
                      <td className="border border-slate-800 py-1.5 px-2 text-right">
                        {s.bayarBulanan?.['Desember'] ? Number(s.bayarBulanan['Desember']).toLocaleString('id-ID') : '-'}
                      </td>
                      <td className="border border-slate-800 py-1.5 px-3 text-right bg-slate-100 font-bold text-slate-900">
                        {calc.totalSudahBayar ? Number(calc.totalSudahBayar).toLocaleString('id-ID') : '-'}
                      </td>
                      <td className="border border-slate-800 py-1.5 px-2 no-print text-center font-sans">
                        {calc.isLunasSmt1 ? (
                          <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                            <CheckCircle className="w-3 h-3 text-emerald-600" /> Boleh Ambil
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded-full">
                            <XCircle className="w-3 h-3 text-rose-600" /> Tertahan
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="bg-slate-200 font-bold border-t-2 border-slate-900 font-mono text-[11px]">
                <tr>
                  <td colSpan="3" className="border border-slate-800 text-center py-2 px-2 font-sans font-black">
                    JUMLAH SETORAN KELAS
                  </td>
                  <td className="border border-slate-800 py-2 px-2 text-right">
                    {totalSpi ? totalSpi.toLocaleString('id-ID') : '-'}
                  </td>
                  <td className="border border-slate-800 py-2 px-2 text-right">
                    {totalTunggakanLalu ? totalTunggakanLalu.toLocaleString('id-ID') : '-'}
                  </td>
                  <td className="border border-slate-800 py-2 px-2 text-right">
                    {totalDuJuli ? totalDuJuli.toLocaleString('id-ID') : '-'}
                  </td>
                  <td className="border border-slate-800 py-2 px-2 text-right">
                    {totalAgust ? totalAgust.toLocaleString('id-ID') : '-'}
                  </td>
                  <td className="border border-slate-800 py-2 px-2 text-right">
                    {totalSept ? totalSept.toLocaleString('id-ID') : '-'}
                  </td>
                  <td className="border border-slate-800 py-2 px-2 text-right">
                    {totalOkt ? totalOkt.toLocaleString('id-ID') : '-'}
                  </td>
                  <td className="border border-slate-800 py-2 px-2 text-right">
                    {totalNop ? totalNop.toLocaleString('id-ID') : '-'}
                  </td>
                  <td className="border border-slate-800 py-2 px-2 text-right">
                    {totalDes ? totalDes.toLocaleString('id-ID') : '-'}
                  </td>
                  <td className="border border-slate-800 py-2 px-3 text-right bg-slate-300 font-black">
                    Rp {grandTotal.toLocaleString('id-ID')}
                  </td>
                  <td className="border border-slate-800 no-print"></td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Bagian Tanda Tangan Folio */}
          <div className="mt-8 pt-4 grid grid-cols-2 text-center text-xs font-semibold text-slate-800">
            <div>
              <p>Mengetahui,</p>
              <p>Kepala SMK,</p>
              <div className="h-16"></div>
              <p className="font-bold underline">{data.sekolah.kepalaSekolah}</p>
            </div>
            <div>
              <p>{data.sekolah.alamat ? data.sekolah.alamat.split(',')[0] : 'Kudus'}, {tanggalCutOff}</p>
              <p>Wali Kelas {selectedKelas?.nama},</p>
              <div className="h-16"></div>
              <p className="font-bold underline">{selectedKelas?.waliKelas}</p>
            </div>
          </div>
        </div>
      )}

      {/* 4B. TAMPILAN KARTU SISWA KELAS (MOBILE-FRIENDLY REKAP) */}
      {subTab === 'kartu-siswa' && (
        <div className="space-y-3 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {siswaList.map((s, idx) => {
              const calc = dataService.getKalkulasiSiswa(s);
              return (
                <div
                  key={s.id}
                  className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3 hover:border-blue-300 transition"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        #{idx + 1} • NIS: {s.nis}
                      </span>
                      <h4 className="font-black text-slate-900 text-sm mt-1">
                        {s.nama}
                      </h4>
                    </div>

                    <span
                      className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full ${
                        calc.isLunasSmt1
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {calc.isLunasSmt1 ? '✅ Boleh Rapor' : '⚠️ Tertahan'}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-semibold">Total Masuk</p>
                      <p className="font-bold font-mono text-emerald-700">
                        Rp {calc.totalSudahBayar.toLocaleString('id-ID')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-slate-400 uppercase font-semibold">Sisa Tunggakan</p>
                      <p className="font-bold font-mono text-rose-600">
                        Rp {calc.totalTunggakanAktif.toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-xl text-[11px] space-y-1">
                    <p className="font-bold text-slate-700">Status Setoran Pokok:</p>
                    <div className="flex flex-wrap gap-1">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${s.duJuli >= 905000 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                        DU: {s.duJuli >= 905000 ? 'Lunas' : s.duJuli ? `${Math.round(s.duJuli/1000)}k` : 'Kosong'}
                      </span>
                      {['Agustus', 'September', 'Oktober', 'November', 'Desember'].map((bln) => {
                        const byr = s.bayarBulanan?.[bln] || 0;
                        return (
                          <span
                            key={bln}
                            className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                              byr >= 325000
                                ? 'bg-emerald-100 text-emerald-800'
                                : byr > 0
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-slate-200 text-slate-600'
                            }`}
                          >
                            {bln.slice(0, 3)}: {byr >= 325000 ? '✓' : byr > 0 ? `${Math.round(byr/1000)}k` : 'x'}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
