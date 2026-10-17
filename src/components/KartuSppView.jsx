import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Copy, 
  Check, 
  Printer, 
  AlertCircle, 
  CheckCircle2, 
  HelpCircle,
  QrCode,
  Smartphone,
  Calendar,
  Layers,
  Receipt,
  Download,
  ExternalLink,
  ShieldCheck,
  User,
  Clock,
  Sparkles,
  ChevronRight,
  FileText
} from 'lucide-react';
import { dataService } from '../services/dataService';
import SchoolLogo from './SchoolLogo';

export default function KartuSppView({ 
  data, 
  currentRole, 
  currentUser, 
  onShowKuitansi 
}) {
  const isOrtu = currentRole === 'ORTU';
  const isWaliKelas = currentRole === 'WALI_KELAS';
  const isAdmin = currentRole === 'ADMIN';

  // 1. Tentukan Daftar Siswa yang Boleh Dilihat sesuai ROLE
  const getFilteredStudents = () => {
    if (isOrtu && currentUser?.siswaId) {
      return data.siswa.filter((s) => s.id === currentUser.siswaId || s.nis === currentUser.nis);
    }
    if (isWaliKelas && currentUser?.kelasId) {
      return data.siswa.filter((s) => s.kelasId === currentUser.kelasId && s.status === 'AKTIF');
    }
    return data.siswa.filter((s) => s.status === 'AKTIF');
  };

  const allowedStudents = getFilteredStudents();

  // 2. State Siswa Terpilih
  const [selectedSiswaId, setSelectedSiswaId] = useState(() => {
    if (isOrtu && currentUser?.siswaId) {
      return currentUser.siswaId;
    }
    if (isWaliKelas && allowedStudents.length > 0) {
      return allowedStudents[0].id;
    }
    return data.siswa[0]?.id || 1;
  });

  // Sinkronkan jika currentUser berganti
  useEffect(() => {
    if (isOrtu && currentUser?.siswaId) {
      setSelectedSiswaId(currentUser.siswaId);
    } else if (isWaliKelas && allowedStudents.length > 0) {
      if (!allowedStudents.some((s) => s.id === Number(selectedSiswaId))) {
        setSelectedSiswaId(allowedStudents[0].id);
      }
    }
  }, [currentUser, isOrtu, isWaliKelas]);

  // 3. Tab Tampilan: Ringkasan Digital (Mobile-first) vs Format Kartu Kuning Fisik vs Riwayat Kuitansi
  const [activeSubTab, setActiveSubTab] = useState('ringkasan'); // 'ringkasan' | 'kartu-kuning' | 'kuitansi'
  const [copiedVa, setCopiedVa] = useState(false);
  const [showVaGuide, setShowVaGuide] = useState(false);

  const siswa = data.siswa.find((s) => s.id === Number(selectedSiswaId)) || allowedStudents[0] || data.siswa[0];
  const kelas = data.kelas.find((k) => k.id === siswa?.kelasId);
  const jurusan = data.jurusan.find((j) => j.kode === siswa?.jurusanKode);
  const kalkulasi = siswa ? dataService.getKalkulasiSiswa(siswa) : null;

  // Nominal SPP Dinamis Sesuai Jurusan Siswa
  const posSpp = data.posBiaya?.find((p) => p.id === 'SPP');
  const nominalSpp = (posSpp?.tarifJurusan && siswa?.jurusanKode && posSpp.tarifJurusan[siswa.jurusanKode]) || posSpp?.nominalDefault || 325000;
  const tabunganWajib = 25000;
  const sppPokok = Math.max(0, nominalSpp - tabunganWajib);

  // Daftar 12 Bulan (Juli s.d Juni)
  const bulan12 = [
    { nama: 'Juli', isDu: true },
    { nama: 'Agustus' },
    { nama: 'September' },
    { nama: 'Oktober' },
    { nama: 'November' },
    { nama: 'Desember' },
    { nama: 'Januari' },
    { nama: 'Februari' },
    { nama: 'Maret' },
    { nama: 'April' },
    { nama: 'Mei' },
    { nama: 'Juni' }
  ];

  // Riwayat Pembayaran Khusus Siswa Ini
  const riwayatSiswa = (data.riwayatPembayaran || []).filter(
    (p) => p.siswaId === siswa?.id || (p.namaSiswa && p.namaSiswa.toLowerCase() === siswa?.nama?.toLowerCase())
  );

  // Pos Biaya Lain yang Relevan untuk Siswa Ini (Sesuai Jurusan & Tingkat)
  const posBiayaLain = (data.posBiaya || []).filter((p) => {
    if (p.id === 'SPP') return false;
    const matchJurusan = !p.targetJurusan || p.targetJurusan === 'SEMUA' || p.targetJurusan === siswa?.jurusanKode;
    const matchTingkat = !p.targetTingkat || p.targetTingkat === 'SEMUA' || p.targetTingkat === siswa?.tingkat;
    return matchJurusan && matchTingkat;
  });

  const handleCopyVa = () => {
    if (!siswa?.va) return;
    navigator.clipboard.writeText(siswa.va);
    setCopiedVa(true);
    setTimeout(() => setCopiedVa(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* ========================================================================= */}
      {/* 1. TOP BAR PENGGUNA & FILTER SISWA (RESPONSIF & DISESUAIKAN ROLE)         */}
      {/* ========================================================================= */}
      <div className="no-print bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Jika Siswa / Ortu: Kunci ke profilnya sendiri, jangan ada dropdown */}
        {isOrtu ? (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-sm flex-shrink-0 border border-emerald-300">
              🎓
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 inline-block">
                Akun Terverifikasi Siswa
              </span>
              <h2 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                {siswa?.nama}
              </h2>
              <p className="text-xs text-slate-500">
                NIS: <strong>{siswa?.nis}</strong> • Kelas: <strong>{kelas?.nama}</strong> ({jurusan?.nama || siswa?.jurusanKode})
              </p>
            </div>
          </div>
        ) : (
          /* Jika Admin / Wali Kelas: Selector Siswa */
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <label className="text-xs font-bold text-slate-600 uppercase flex-shrink-0">
              {isWaliKelas ? `Siswa Kelas ${currentUser?.namaKelas || 'Bimbingan'}:` : 'Pilih Siswa yang Dilihat:'}
            </label>
            <select
              value={selectedSiswaId}
              onChange={(e) => setSelectedSiswaId(Number(e.target.value))}
              className="w-full sm:w-auto bg-slate-50 border border-slate-300 font-bold text-slate-800 text-xs sm:text-sm rounded-xl px-3.5 py-2 focus:ring-2 focus:ring-blue-500"
            >
              {allowedStudents.map((s) => {
                const k = data.kelas.find((kls) => kls.id === s.kelasId);
                return (
                  <option key={s.id} value={s.id}>
                    {s.nama} • NIS {s.nis} ({k?.nama || s.tingkat})
                  </option>
                );
              })}
            </select>
          </div>
        )}

        {/* Action Buttons: Cetak */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={handlePrint}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs transition cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            Cetak Kartu SPP
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. SUB-TAB SWITCHER: Ringkasan Digital vs Kartu Kuning Fisik vs Kuitansi  */}
      {/* ========================================================================= */}
      <div className="no-print flex items-center gap-1.5 p-1.5 bg-slate-200/80 rounded-2xl border border-slate-300 text-xs font-bold overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveSubTab('ringkasan')}
          className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer ${
            activeSubTab === 'ringkasan'
              ? 'bg-white text-blue-700 shadow-xs font-extrabold ring-1 ring-slate-300/60'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
          }`}
        >
          <Smartphone className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>📱 Ringkasan & Tagihan Digital</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('kartu-kuning')}
          className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer ${
            activeSubTab === 'kartu-kuning'
              ? 'bg-amber-400 text-slate-900 shadow-xs font-black ring-1 ring-amber-500'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
          }`}
        >
          <FileText className="w-4 h-4 text-amber-700 flex-shrink-0" />
          <span>📄 Format Asli Kartu Kuning</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('kuitansi')}
          className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer ${
            activeSubTab === 'kuitansi'
              ? 'bg-white text-indigo-700 shadow-xs font-extrabold ring-1 ring-slate-300/60'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
          }`}
        >
          <Receipt className="w-4 h-4 text-indigo-600 flex-shrink-0" />
          <span>🧾 Riwayat Kuitansi ({riwayatSiswa.length})</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 3. TAMPILAN 1: RINGKASAN DIGITAL & TAGIHAN (MOBILE-FIRST)                  */}
      {/* ========================================================================= */}
      {activeSubTab === 'ringkasan' && (
        <div className="space-y-6 animate-fadeIn">
          {/* A. Hero Banner Profil Siswa */}
          <div className="bg-gradient-to-r from-blue-800 via-indigo-900 to-slate-900 text-white p-5 sm:p-7 rounded-3xl shadow-xl border border-white/10 relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
              <div className="flex items-start sm:items-center gap-3.5">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-200 text-slate-950 font-black text-xl sm:text-2xl flex items-center justify-center shadow-lg border-2 border-white/40 flex-shrink-0">
                  {siswa?.nama ? siswa.nama.charAt(0) : 'S'}
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="bg-blue-500/30 text-blue-200 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-blue-400/30">
                      Tahun Ajaran {data.sekolah.tahunAjaranAktif}
                    </span>
                    <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                      Status: {siswa?.status || 'AKTIF'}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black tracking-tight mt-1.5 leading-snug">
                    {siswa?.nama}
                  </h3>

                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300 mt-1">
                    <span>NIS: <strong className="text-white font-mono">{siswa?.nis}</strong></span>
                    {siswa?.nisn && <span>• NISN: <strong className="text-white font-mono">{siswa.nisn}</strong></span>}
                    <span>• Kelas: <strong className="text-amber-300">{kelas?.nama}</strong></span>
                    <span>• Jurusan: <strong className="text-white">{jurusan?.nama || siswa?.jurusanKode}</strong></span>
                  </div>
                </div>
              </div>

              {/* Status Kelayakan Pengambilan Rapor */}
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 self-start md:self-auto min-w-[200px]">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-300">
                  Syarat Kelayakan Rapor
                </p>
                <div className="mt-1 flex items-center gap-2">
                  {kalkulasi?.isLunasSmt1 ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-black text-emerald-300 leading-tight">
                          Boleh Ambil Rapor
                        </p>
                        <p className="text-[11px] text-emerald-200">Bebas Tunggakan Smt. Ini</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-black text-amber-300 leading-tight">
                          Rapor Tertahan Sebagian
                        </p>
                        <p className="text-[11px] text-amber-200">
                          Sisa: Rp {kalkulasi?.totalTunggakanAktif?.toLocaleString('id-ID')}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* B. Kartu Virtual Account Bank Transfer (Mobile Responsive & Sleek) */}
          <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-5 sm:p-6 rounded-3xl shadow-xl border border-indigo-700/40 relative overflow-hidden">
            {/* Glow Decorative */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
              <div className="space-y-2 max-w-xl">
                <div className="flex items-center gap-2">
                  <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    Jalur Transfer Otomatis 24 Jam
                  </span>
                  <span className="text-xs text-slate-400">
                    Mitra: <strong className="text-white">{data.sekolah.bankMitra}</strong>
                  </span>
                </div>

                <h4 className="text-base sm:text-lg font-bold text-slate-100">
                  Nomor Virtual Account (VA) Siswa
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Bisa ditransfer langsung dari aplikasi m-Banking (BCA, Mandiri, BRI, BNI, BSI) atau ATM mana pun. Pembayaran terverifikasi seketika tanpa antre di sekolah.
                </p>

                {/* Nomor VA & Tombol Salin */}
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <div className="px-4 py-2.5 bg-slate-950/80 rounded-2xl border border-indigo-400/40 flex items-center gap-3 shadow-inner">
                    <CreditCard className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                    <span className="text-lg sm:text-2xl font-black font-mono tracking-wider text-emerald-400 select-all break-all">
                      {siswa?.va || `8808${siswa?.nis}001`}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopyVa}
                    className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer ${
                      copiedVa
                        ? 'bg-emerald-600 text-white font-extrabold ring-2 ring-emerald-300'
                        : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                    }`}
                  >
                    {copiedVa ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedVa ? 'Nomor Tersalin!' : 'Salin Nomor VA'}</span>
                  </button>
                </div>
              </div>

              {/* Panduan Cepat Transfer */}
              <div className="w-full md:w-auto bg-white/5 border border-white/10 p-4 rounded-2xl text-xs space-y-2 flex-shrink-0">
                <p className="font-bold text-amber-300 flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4" /> Cara Bayar Lewat m-Banking:
                </p>
                <ol className="text-slate-300 space-y-1 pl-4 list-decimal text-[11px] leading-relaxed">
                  <li>Pilih menu <strong>Transfer Virtual Account</strong></li>
                  <li>Masukkan nomor VA di samping</li>
                  <li>Nama akun otomatis: <strong>SPP-{siswa?.nama?.slice(0, 14)}</strong></li>
                  <li>Konfirmasi & tagihan otomatis lunas</li>
                </ol>
              </div>
            </div>
          </div>

          {/* C. 3 Kartu Metrik Keuangan Siswa */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Card 1: Sudah Terbayar */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Total Sudah Dibayar
              </span>
              <p className="text-2xl font-black text-emerald-700 font-mono">
                Rp {kalkulasi?.totalSudahBayar?.toLocaleString('id-ID')}
              </p>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-emerald-500 h-2 rounded-full"
                  style={{
                    width: `${
                      kalkulasi?.totalKewajiban > 0
                        ? Math.min(100, Math.round((kalkulasi.totalSudahBayar / kalkulasi.totalKewajiban) * 100))
                        : 100
                    }%`
                  }}
                ></div>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Daftar Ulang, SPP Bulanan & Pos Lain
              </p>
            </div>

            {/* Card 2: Sisa Tagihan Berjalan */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Sisa Tagihan / Tunggakan
              </span>
              <p className={`text-2xl font-black font-mono ${kalkulasi?.totalTunggakanAktif > 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
                Rp {kalkulasi?.totalTunggakanAktif?.toLocaleString('id-ID')}
              </p>
              <p className="text-[11px] text-slate-500 font-medium">
                {kalkulasi?.totalTunggakanAktif > 0
                  ? 'Harap diselesaikan sebelum periode ujian/rapor'
                  : '✅ Selamat! Semua kewajiban semester lunas'}
              </p>
            </div>

            {/* Card 3: Tarif SPP Jurusan Ini */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Besar SPP Bulanan Siswa
              </span>
              <p className="text-2xl font-black text-blue-700 font-mono">
                Rp {nominalSpp.toLocaleString('id-ID')}
              </p>
              <p className="text-[11px] text-slate-500 font-medium">
                Uang Sekolah Rp {sppPokok.toLocaleString('id-ID')} + Tabungan Rp {tabunganWajib.toLocaleString('id-ID')}
              </p>
            </div>
          </div>

          {/* D. STATUS 12 BULAN SPP (KARTU RESPONSIF MOBILE-FRIENDLY) */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h4 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  Status Pembayaran SPP 12 Bulan (Juli s.d Juni)
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tarif bulanan disesuaikan dengan Program Keahlian {jurusan?.nama || siswa?.jurusanKode} (Rp {nominalSpp.toLocaleString('id-ID')}/bln).
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActiveSubTab('kartu-kuning')}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1 self-start sm:self-auto cursor-pointer"
              >
                Lihat Format Cetak Kartu Kuning <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Grid 12 Bulan */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {bulan12.map((bln, idx) => {
                const bayar = bln.isDu ? siswa?.duJuli : (siswa?.bayarBulanan?.[bln.nama] || 0);
                const isLunas = bln.isDu ? bayar >= 905000 : bayar >= nominalSpp;
                const isSebagian = bayar > 0 && !isLunas;

                return (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-2xl border transition relative overflow-hidden flex flex-col justify-between ${
                      isLunas
                        ? 'bg-emerald-50/60 border-emerald-200 hover:bg-emerald-50'
                        : isSebagian
                        ? 'bg-amber-50/60 border-amber-200 hover:bg-amber-50'
                        : 'bg-slate-50/70 border-slate-200 hover:bg-white'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1.5">
                        <span className="font-black text-sm text-slate-900">
                          {bln.nama}
                        </span>
                        <span
                          className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                            isLunas
                              ? 'bg-emerald-200 text-emerald-900'
                              : isSebagian
                              ? 'bg-amber-200 text-amber-900'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {isLunas ? 'LUNAS' : isSebagian ? 'CICILAN' : 'BELUM BAYAR'}
                        </span>
                      </div>

                      {bln.isDu && (
                        <span className="inline-block text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.2 rounded-md mb-1.5">
                          Paket DU + SPP Juli
                        </span>
                      )}

                      <p className="text-xs text-slate-600 font-medium">
                        Kewajiban: <strong className="font-mono text-slate-900">Rp {bln.isDu ? '905.000' : nominalSpp.toLocaleString('id-ID')}</strong>
                      </p>
                      <p className="text-xs text-slate-600 font-medium mt-0.5">
                        Tercatat: <strong className="font-mono text-emerald-700">Rp {Number(bayar || 0).toLocaleString('id-ID')}</strong>
                      </p>
                    </div>

                    <div className="pt-2 mt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400 font-mono">
                        {isLunas ? 'Terverifikasi' : isSebagian ? `Sisa: ${(bln.isDu ? 905000 : nominalSpp) - bayar}` : 'Jatuh tempo tgl 10'}
                      </span>

                      {isLunas && (
                        <span className="text-emerald-700 font-bold flex items-center gap-0.5">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Lunas
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* E. POS BIAYA LAIN-LAIN & PRAKTIK KEJURUAN */}
          {posBiayaLain.length > 0 && (
            <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <div>
                <h4 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                  <Layers className="w-5 h-5 text-indigo-600" />
                  Pos Biaya Lain-Lain & Praktik Kejuruan Siswa
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Kewajiban penunjang pembelajaran kejuruan (Uang Gedung/SPI, Praktik Bengkel/Perhotelan, UKK).
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {/* 1. SPI / Uang Gedung */}
                {(() => {
                  const targetSpi = 1500000;
                  const sudahSpi = Number(siswa?.spi || 0);
                  const sisaSpi = Math.max(0, targetSpi - sudahSpi);
                  const isSpiLunas = sisaSpi === 0;

                  return (
                    <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-black text-sm text-slate-900">
                          Sumbangan Gedung (SPI)
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isSpiLunas ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                          {isSpiLunas ? 'LUNAS' : 'DICICIL'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600">
                        Target: <strong className="font-mono">Rp {targetSpi.toLocaleString('id-ID')}</strong> • Masuk: <strong className="font-mono text-emerald-700">Rp {sudahSpi.toLocaleString('id-ID')}</strong>
                      </p>
                      <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-indigo-600 h-1.5 rounded-full"
                          style={{ width: `${Math.min(100, Math.round((sudahSpi / targetSpi) * 100))}%` }}
                        ></div>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Sisa Tanggungan: <strong className="font-mono text-rose-600">Rp {sisaSpi.toLocaleString('id-ID')}</strong>
                      </p>
                    </div>
                  );
                })()}

                {/* 2. Pos Khusus Kejuruan Siswa */}
                {posBiayaLain.map((pos) => {
                  const nominal = (pos.tarifJurusan && siswa?.jurusanKode && pos.tarifJurusan[siswa.jurusanKode]) || pos.nominalDefault || 0;
                  return (
                    <div key={pos.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-black text-sm text-slate-900 truncate" title={pos.nama}>
                          {pos.nama}
                        </span>
                        <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                          {pos.tipe === 'BULANAN' ? 'Bulanan' : 'Sekali Bayar'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600">
                        Besar Biaya: <strong className="font-mono text-slate-900">Rp {Number(nominal).toLocaleString('id-ID')}</strong>
                      </p>
                      <p className="text-[11px] text-slate-500 leading-tight">
                        Target: Jurusan {pos.targetJurusan || 'SEMUA'} • Tingkat {pos.targetTingkat || 'SEMUA'}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. TAMPILAN 2: REPRODUKSI FORMAT ASLI KARTU KUNING FISIK SEKOLAH          */}
      {/* ========================================================================= */}
      {activeSubTab === 'kartu-kuning' && (
        <div className="space-y-4 animate-fadeIn">
          {/* Banner Petunjuk di Layar HP */}
          <div className="no-print p-3 bg-amber-100/90 border border-amber-300 rounded-2xl text-xs font-semibold text-amber-950 flex items-center justify-between gap-2 md:hidden">
            <span>💡 <strong>Layar HP:</strong> Geser tabel ke samping untuk melihat seluruh kolom paraf & stempel</span>
            <span className="text-base">👉</span>
          </div>

          <div className="bg-[#fef9c3] p-4 sm:p-8 rounded-3xl border-2 border-amber-400 shadow-md text-slate-900 print:m-0 print:border-none print:bg-white print:p-0">
            {/* Header Kartu Kuning */}
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 pb-4 border-b-2 border-slate-900 text-center sm:text-left">
              <SchoolLogo logoUrl={data.sekolah.logoUrl} className="w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0" />
              <div className="flex-1 text-center">
                <p className="text-[11px] sm:text-xs uppercase font-bold text-slate-700 leading-tight">
                  {data.sekolah.yayasan || 'Yayasan Lembaga Pendidikan Kejuruan Nusantara (YLPKN)'}
                </p>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 uppercase">
                  {data.sekolah.nama}
                </h2>
                <p className="text-[11px] sm:text-xs text-slate-700 font-medium leading-tight">
                  Terakreditasi: {data.sekolah.akreditasi} • {data.sekolah.alamat}
                </p>
                <div className="inline-block mt-2 bg-amber-200 px-4 py-1 border border-slate-800 rounded-sm font-black uppercase text-xs tracking-widest">
                  KARTU PEMBAYARAN UANG SEKOLAH (SPP)
                </div>
              </div>
            </div>

            {/* Informasi Siswa */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 py-4 border-b border-slate-800 text-xs sm:text-sm">
              <div className="space-y-1">
                <p><span className="text-slate-700">Nama Siswa :</span> <strong className="text-base text-slate-900">{siswa?.nama}</strong></p>
                <p><span className="text-slate-700">Kelas / Jurusan :</span> <strong>{kelas?.nama} ({jurusan?.nama || siswa?.jurusanKode})</strong></p>
              </div>
              <div className="sm:text-right space-y-1">
                <p><span className="text-slate-700">No. Induk (NIS) :</span> <strong className="font-mono">{siswa?.nis}</strong></p>
                <p><span className="text-slate-700">Besar SPP Bulanan :</span> <strong className="font-mono">Rp {nominalSpp.toLocaleString('id-ID')},-</strong></p>
                <p className="text-[11px] text-slate-600">(Uang Sekolah Rp {sppPokok.toLocaleString('id-ID')} + Tabungan Wajib Rp {tabunganWajib.toLocaleString('id-ID')})</p>
              </div>
            </div>

            {/* Tabel 12 Bulan (Juli s.d Juni) */}
            <div className="py-4 overflow-x-auto">
              <table className="min-w-[620px] w-full text-xs border-collapse border border-slate-800 text-center">
                <thead className="bg-amber-300 text-slate-900 font-black border-b border-slate-800">
                  <tr>
                    <th className="border border-slate-800 py-2 px-2 text-left">Bulan</th>
                    <th className="border border-slate-800 py-2 px-2">Uang Sekolah</th>
                    <th className="border border-slate-800 py-2 px-2">Tabungan Wajib</th>
                    <th className="border border-slate-800 py-2 px-2">Tanggal Bayar</th>
                    <th className="border border-slate-800 py-2 px-2">Stempel & Tanda Tangan Penerima</th>
                    <th className="border border-slate-800 py-2 px-2">Paraf Orang Tua</th>
                  </tr>
                </thead>
                <tbody>
                  {bulan12.map((bln, idx) => {
                    const bayar = bln.isDu ? siswa?.duJuli : (siswa?.bayarBulanan?.[bln.nama] || 0);
                    const isLunas = bln.isDu ? bayar >= 905000 : bayar >= nominalSpp;

                    return (
                      <tr key={idx} className="border-b border-slate-800 hover:bg-amber-100/50">
                        <td className="border border-slate-800 py-2 px-2 font-bold text-left">
                          {bln.nama} {bln.isDu && '(Paket DU + Juli)'}
                        </td>
                        <td className="border border-slate-800 py-2 px-2 font-mono">
                          Rp {sppPokok.toLocaleString('id-ID')},-
                        </td>
                        <td className="border border-slate-800 py-2 px-2 font-mono">
                          Rp {tabunganWajib.toLocaleString('id-ID')},-
                        </td>
                        <td className="border border-slate-800 py-2 px-2 font-mono">
                          {isLunas ? '10 - 10 - 2026' : '-'}
                        </td>
                        <td className="border border-slate-800 py-1 px-2 text-center">
                          {isLunas ? (
                            <div className="inline-block border border-indigo-900 text-indigo-950 bg-indigo-50/60 text-[9px] font-black px-2 py-0.5 rounded rotate-[-3deg] uppercase">
                              LUNAS KEU. {siswa?.jurusanKode || 'SMK'}
                            </div>
                          ) : (
                            <span className="text-slate-400 italic">Belum Bayar</span>
                          )}
                        </td>
                        <td className="border border-slate-800 py-2 px-2 text-slate-500 italic">
                          {isLunas ? 'Terverifikasi' : '...................'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Catatan Kaki Asli Kartu Kuning */}
            <div className="mt-3 pt-3 border-t border-slate-800 text-xs font-semibold text-slate-700 flex flex-col sm:flex-row justify-between items-start gap-4">
              <div>
                <p className="font-bold">NB :</p>
                <p>• Kartu harap disimpan baik-baik (tidak boleh hilang).</p>
                <p>• Pembayaran uang sekolah tiap bulan selambat-lambatnya tanggal 10.</p>
              </div>
              <div className="sm:text-right self-end sm:self-auto">
                <p>Kepala Sekolah,</p>
                <div className="h-12"></div>
                <p className="font-bold underline text-slate-900">{data.sekolah.kepalaSekolah}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. TAMPILAN 3: RIWAYAT KUITANSI & UNDUH BUKTI PEMBAYARAN                   */}
      {/* ========================================================================= */}
      {activeSubTab === 'kuitansi' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-indigo-600" />
                  Riwayat Bukti Transaksi Kuitansi Siswa
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Seluruh pembayaran tunai kasir maupun transfer Virtual Account yang telah diverifikasi sekolah.
                </p>
              </div>

              <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-xl">
                {riwayatSiswa.length} Transaksi
              </span>
            </div>

            {riwayatSiswa.length === 0 ? (
              <div className="text-center py-10 px-4 bg-slate-50 rounded-2xl border border-dashed border-slate-300 space-y-2">
                <Receipt className="w-10 h-10 text-slate-400 mx-auto" />
                <p className="font-bold text-slate-700 text-sm">Belum Ada Transaksi Kuitansi</p>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Transaksi pembayaran tunai kasir atau transfer VA akan otomatis terbit di sini beserta nomor bukti resmi.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {riwayatSiswa.map((r) => (
                  <div
                    key={r.id}
                    className="p-4 rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-xs transition bg-slate-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                          {r.id}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            r.metode === 'VA_TRANSFER'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {r.metode === 'VA_TRANSFER' ? 'Virtual Account' : 'Tunai Loket'}
                        </span>
                        <span className="text-xs text-slate-400">• {r.tanggal}</span>
                      </div>

                      <p className="font-bold text-sm text-slate-900">
                        {r.rincian?.map((item) => item.posNama || item.item).join(', ') || 'Pembayaran SPP / DU'}
                      </p>

                      <p className="text-xs text-slate-500">
                        Petugas: <strong>{r.petugas || 'Kasir TU'}</strong>
                      </p>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200">
                      <div className="text-right">
                        <p className="text-[10px] text-slate-400 uppercase font-semibold">Total Disetor</p>
                        <p className="text-lg font-black text-slate-900 font-mono">
                          Rp {Number(r.total).toLocaleString('id-ID')}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => onShowKuitansi && onShowKuitansi(r)}
                        className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        Cetak Kuitansi
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
