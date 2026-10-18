import React, { useState } from 'react';
import { 
  Search, 
  CreditCard, 
  Banknote, 
  Smartphone, 
  Printer, 
  CheckSquare, 
  Square, 
  Receipt, 
  AlertCircle,
  Calendar,
  Sparkles,
  PieChart,
  Coins,
  Users,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { dataService } from '../services/dataService';

export default function KasirView({ 
  data, 
  onUpdateData, 
  onShowKuitansi, 
  currentUser,
  activeKelompok,
  onSelectKelompok 
}) {
  const username = (currentUser?.username || '').toLowerCase();
  const isKasirHana = currentUser?.role === 'KASIR_HANA' || username === 'hana' || (currentUser?.kasirKelompok === 'BISNIS_MANAJEMEN' && currentUser?.role !== 'ADMIN' && currentUser?.role !== 'BENDAHARA');
  const isKasirUmi = currentUser?.role === 'KASIR_UMI' || username === 'umi' || (currentUser?.kasirKelompok === 'PARIWISATA' && currentUser?.role !== 'ADMIN' && currentUser?.role !== 'BENDAHARA');
  const isKasirTetap = isKasirHana || isKasirUmi || !!currentUser?.isKasirTetap;

  const [internalKelompok, setInternalKelompok] = useState(() => {
    if (isKasirHana) return 'BISNIS_MANAJEMEN';
    if (isKasirUmi) return 'PARIWISATA';
    if (activeKelompok) return activeKelompok;
    if (currentUser?.kasirKelompok) return currentUser.kasirKelompok;
    return 'ALL';
  });

  const kelompokFilter = isKasirHana 
    ? 'BISNIS_MANAJEMEN' 
    : isKasirUmi 
    ? 'PARIWISATA' 
    : (activeKelompok || internalKelompok);

  const [searchQuery, setSearchQuery] = useState('');
  const [metodeBayar, setMetodeBayar] = useState('TUNAI');
  const [catatan, setCatatan] = useState('');

  const [petugasNama, setPetugasNama] = useState(() => {
    if (currentUser?.nama) return currentUser.nama;
    if (kelompokFilter === 'BISNIS_MANAJEMEN') return 'Kasir TU - Bisnis & Manajemen';
    if (kelompokFilter === 'PARIWISATA') return 'Kasir TU - Pariwisata';
    return 'Admin Pusat TU';
  });

  // Tentukan siswa default sesuai kelompok kasir aktif
  const [selectedSiswaId, setSelectedSiswaId] = useState(() => {
    const initKelompok = activeKelompok || currentUser?.kasirKelompok || 'ALL';
    const match = data.siswa.find((s) => {
      if (initKelompok === 'BISNIS_MANAJEMEN') return ['AKL', 'MPLB', 'PM'].includes(s.jurusanKode);
      if (initKelompok === 'PARIWISATA') return ['KSP', 'HTL'].includes(s.jurusanKode);
      return true;
    });
    return match?.id || data.siswa[0]?.id || null;
  });

  // Sinkronkan saat activeKelompok berubah dari global switcher
  React.useEffect(() => {
    if (activeKelompok) {
      setInternalKelompok(activeKelompok);
      if (activeKelompok === 'BISNIS_MANAJEMEN') {
        setPetugasNama(currentUser?.nama || 'Kasir TU - Bisnis & Manajemen');
      } else if (activeKelompok === 'PARIWISATA') {
        setPetugasNama(currentUser?.nama || 'Kasir TU - Pariwisata');
      } else {
        setPetugasNama(currentUser?.nama || 'Admin Pusat TU');
      }

      const matchSiswa = data.siswa.find((s) => {
        if (activeKelompok === 'BISNIS_MANAJEMEN') return ['AKL', 'MPLB', 'PM'].includes(s.jurusanKode);
        if (activeKelompok === 'PARIWISATA') return ['KSP', 'HTL'].includes(s.jurusanKode);
        return true;
      });
      if (matchSiswa) {
        setSelectedSiswaId(matchSiswa.id);
        setSelectedItems({});
      }
    }
  }, [activeKelompok, data.siswa]);

  const handleGantiKelompok = (newKelompok, namaPetugas) => {
    setInternalKelompok(newKelompok);
    if (onSelectKelompok) onSelectKelompok(newKelompok);
    if (namaPetugas) setPetugasNama(namaPetugas);

    const matchSiswa = data.siswa.find((s) => {
      if (newKelompok === 'BISNIS_MANAJEMEN') return ['AKL', 'MPLB', 'PM'].includes(s.jurusanKode);
      if (newKelompok === 'PARIWISATA') return ['KSP', 'HTL'].includes(s.jurusanKode);
      return true;
    });
    if (matchSiswa) {
      setSelectedSiswaId(matchSiswa.id);
      setSelectedItems({});
    }
  };

  // Bulan SPP
  const bulanList = ['Agustus', 'September', 'Oktober', 'November', 'Desember', 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni'];

  // Selected Student
  const selectedSiswa = data.siswa.find((s) => s.id === Number(selectedSiswaId));
  const kelasSiswa = data.kelas.find((k) => k.id === selectedSiswa?.kelasId);
  const kalkulasi = selectedSiswa ? dataService.getKalkulasiSiswa(selectedSiswa) : null;

  // Nominal SPP disesuaikan otomatis dengan Tarif Jurusan Siswa
  const posSpp = data.posBiaya?.find((p) => p.id === 'SPP');
  const nominalSpp = (posSpp?.tarifJurusan && selectedSiswa?.jurusanKode && posSpp.tarifJurusan[selectedSiswa.jurusanKode]) || posSpp?.nominalDefault || 325000;

  // Selected items to pay in current transaction
  // Structure: { [key]: { posId, posNama, targetTotal, sudahMasuk, bayar, sisa, isCicilan } }
  const [selectedItems, setSelectedItems] = useState({});

  const toggleItem = (key, itemData) => {
    setSelectedItems((prev) => {
      const copy = { ...prev };
      if (copy[key]) {
        delete copy[key];
      } else {
        copy[key] = {
          ...itemData,
          bayar: itemData.sisaHarusBayar, // Default bayar lunas sisa
          isCicilan: false
        };
      }
      return copy;
    });
  };

  const updateNominalCicilan = (key, nominalBaru, maxSisa) => {
    const val = Math.max(0, Math.min(Number(nominalBaru), maxSisa));
    setSelectedItems((prev) => {
      if (!prev[key]) return prev;
      return {
        ...prev,
        [key]: {
          ...prev[key],
          bayar: val,
          isCicilan: val < maxSisa
        }
      };
    });
  };

  const totalTagihanDipilih = Object.values(selectedItems).reduce(
    (acc, curr) => acc + Number(curr.bayar || 0),
    0
  );

  const handleProsesBayar = () => {
    if (!selectedSiswa || totalTagihanDipilih <= 0) {
      alert('Pilih minimal satu pos pembayaran dan masukkan nominal bayar/cicilan!');
      return;
    }

    try {
      const itemsArray = Object.values(selectedItems).map((it) => ({
        ...it,
        item: it.isCicilan
          ? `${it.posNama} (Cicilan Sebagian)`
          : it.posNama,
        sisaSetelahBayar: it.sisaHarusBayar - it.bayar
      }));

      const res = dataService.catatPembayaran({
        siswaId: selectedSiswa.id,
        nominal: totalTagihanDipilih,
        metode: metodeBayar,
        nomorReferensi: metodeBayar === 'VA_TRANSFER' ? `VA-${Date.now().toString().slice(-6)}` : null,
        petugas: petugasNama,
        rincianItems: itemsArray,
        catatan,
        statusRaport: kalkulasi.totalTunggakanAktif - totalTagihanDipilih <= 0 ? 'Boleh Ambil Rapor' : 'Tertahan Sebagian (Dalam Cicilan)'
      });

      // Confetti celebration
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.7 }
      });

      // Reset form pilihan
      setSelectedItems({});
      onUpdateData();

      // Buka modal kuitansi langsung
      onShowKuitansi(res);
    } catch (e) {
      alert('Terjadi kesalahan: ' + e.message);
    }
  };

  // Filter siswa berdasarkan Kelompok Kasir dan Kata Kunci Pencarian
  const filteredSiswa = data.siswa.filter((s) => {
    // 1. Filter Kelompok Kasir
    if (kelompokFilter === 'BISNIS_MANAJEMEN') {
      if (!['AKL', 'MPLB', 'PM'].includes(s.jurusanKode)) return false;
    } else if (kelompokFilter === 'PARIWISATA') {
      if (!['KSP', 'HTL'].includes(s.jurusanKode)) return false;
    }

    // 2. Filter Pencarian
    const q = searchQuery.toLowerCase();
    const k = data.kelas.find((k) => k.id === s.kelasId);
    return (
      s.nama.toLowerCase().includes(q) ||
      s.nis.includes(q) ||
      k?.nama.toLowerCase().includes(q) ||
      (s.jurusanKode && s.jurusanKode.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* 1. Panel Pembagian Loket Kasir 2 Kelompok Jurusan (Paling Atas Agar Langsung Terlihat) */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 w-full md:w-auto">
          <div className={`p-3 rounded-2xl border flex items-center justify-center flex-shrink-0 ${
            kelompokFilter === 'BISNIS_MANAJEMEN'
              ? 'bg-blue-50 text-blue-700 border-blue-200'
              : kelompokFilter === 'PARIWISATA'
              ? 'bg-rose-50 text-rose-700 border-rose-200'
              : 'bg-indigo-50 text-indigo-700 border-indigo-200'
          }`}>
            <Receipt className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                Mode Sudut Pandang Loket TU
              </span>
              <span className="text-[11px] font-bold text-slate-500">
                Petugas Kasir: <strong className="text-slate-800">{petugasNama}</strong>
              </span>
            </div>
            <h3 className="text-base font-black text-slate-900 mt-0.5">
              {kelompokFilter === 'BISNIS_MANAJEMEN'
                ? '💼 Kelompok Bisnis & Manajemen'
                : kelompokFilter === 'PARIWISATA'
                ? '🏖️ Kelompok Pariwisata'
                : '🏢 Semua Rombel (5 Jurusan Pusat)'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {kelompokFilter === 'BISNIS_MANAJEMEN'
                ? 'Layanan loket keuangan siswa jurusan AKL, MPLB, dan PM.'
                : kelompokFilter === 'PARIWISATA'
                ? 'Layanan loket keuangan siswa jurusan Kecantikan & Spa dan Perhotelan.'
                : 'Pusat Manajemen: Memantau dan melayani seluruh 5 jurusan sekolah.'}
            </p>
          </div>
        </div>

        {/* Tab Switcher Pembagian Kelompok Kasir (Hanya bisa diubah oleh Admin & Bendahara Pusat) */}
        {!isKasirTetap ? (
          <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold w-full md:w-auto overflow-x-auto">
            <button
              type="button"
              onClick={() => handleGantiKelompok('ALL', 'Admin Pusat TU')}
              className={`flex-1 md:flex-none px-3.5 py-2 rounded-lg transition cursor-pointer whitespace-nowrap ${
                kelompokFilter === 'ALL'
                  ? 'bg-white text-slate-900 shadow-xs font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🏢 Semua Rombel (5 Jurusan Pusat)
            </button>
            <button
              type="button"
              onClick={() => handleGantiKelompok('BISNIS_MANAJEMEN', 'Kasir TU - Bisnis & Manajemen')}
              className={`flex-1 md:flex-none px-3.5 py-2 rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap ${
                kelompokFilter === 'BISNIS_MANAJEMEN'
                  ? 'bg-blue-600 text-white shadow-xs font-black'
                  : 'text-blue-900 hover:bg-blue-100/60'
              }`}
            >
              💼 Kelompok Bisnis & Manajemen
            </button>
            <button
              type="button"
              onClick={() => handleGantiKelompok('PARIWISATA', 'Kasir TU - Pariwisata')}
              className={`flex-1 md:flex-none px-3.5 py-2 rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap ${
                kelompokFilter === 'PARIWISATA'
                  ? 'bg-rose-600 text-white shadow-xs font-black'
                  : 'text-rose-900 hover:bg-rose-100/60'
              }`}
            >
              🏖️ Kelompok Pariwisata
            </button>
          </div>
        ) : (
          <div className="px-3.5 py-2 bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Loket Resmi: {kelompokFilter === 'BISNIS_MANAJEMEN' ? 'Kelompok Bisnis & Manajemen' : kelompokFilter === 'PARIWISATA' ? 'Kelompok Pariwisata' : (currentUser?.kelompokNama || 'Kelompok Khusus')}</span>
          </div>
        )}
      </div>

      {/* 2. Banner Ringkasan Kasir */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white p-6 rounded-2xl shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-blue-500/30 text-blue-100 text-xs px-2.5 py-1 rounded-full font-semibold border border-blue-400/30">
                Loket Kasir Keuangan SMK
              </span>
              <span className="bg-amber-400 text-slate-900 text-xs px-2.5 py-0.5 rounded-full font-extrabold shadow-xs flex items-center gap-1">
                <Coins className="w-3.5 h-3.5" /> Fitur Nyicil / Cicilan Fleksibel Aktif
              </span>
            </div>
            <h2 className="text-2xl font-black mt-2 tracking-tight">
              Penerimaan SPP & Cicilan Biaya Sekolah Terpadu
            </h2>
            <p className="text-blue-100 text-sm mt-1 max-w-2xl">
              Bisa <strong>Bayar Lunas Seketika</strong> atau <strong>Nyicil Sebagian</strong>. Bebas tentukan uang cicilan dialokasikan ke pos mana (Daftar Ulang, SPI, SPP bulan tertentu, dll).
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-xs p-4 rounded-xl border border-white/20 text-right">
            <p className="text-xs text-blue-200 uppercase font-semibold">Tahun Ajaran Aktif</p>
            <p className="text-xl font-bold font-mono">{data.sekolah.tahunAjaranAktif}</p>
            <p className="text-xs text-blue-200 mt-1">Bank Mitra: {data.sekolah.bankMitra}</p>
          </div>
        </div>
      </div>

      {/* Grid Utama Kasir: Kiri Cari Siswa, Kanan Rincian Tagihan & Aksi Bayar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Kolom Kiri: Pemilihan Siswa (4 Kolom) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <label className="block text-xs font-bold text-slate-600 uppercase mb-2">
              Cari Siswa (Nama / NIS / Kelas)
            </label>
            <div className="relative mb-3">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Ketik nama (misal: Dian, Abi, Lusyana)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>

            <div className="max-h-[480px] overflow-y-auto space-y-1.5 pr-1">
              {filteredSiswa.map((s) => {
                const k = data.kelas.find((kls) => kls.id === s.kelasId);
                const isSelected = s.id === selectedSiswa?.id;
                const calc = dataService.getKalkulasiSiswa(s);

                return (
                  <button
                    key={s.id}
                    onClick={() => {
                      setSelectedSiswaId(s.id);
                      setSelectedItems({});
                    }}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-blue-50 border-blue-500 shadow-xs ring-1 ring-blue-500'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <p className="font-bold text-sm text-slate-800 leading-tight">
                        {s.nama}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        NIS: {s.nis} • <span className="font-semibold text-slate-700">{k?.nama}</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          calc.isLunasSmt1
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {calc.isLunasSmt1 ? 'Lunas' : 'Nunggak'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Detail Tagihan Siswa & Form Pembayaran (8 Kolom) */}
        <div className="lg:col-span-8 space-y-4">
          {selectedSiswa && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
              {/* Header Kartu Profil Siswa Terpilih */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-black text-slate-900">{selectedSiswa.nama}</h3>
                    <span className="text-xs px-2.5 py-0.5 rounded-md font-semibold bg-blue-100 text-blue-800">
                      {kelasSiswa?.nama} ({selectedSiswa.jurusanKode})
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    NIS: <strong>{selectedSiswa.nis}</strong> • No. Virtual Account: <strong className="font-mono text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">{selectedSiswa.va}</strong>
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-xs text-slate-500 font-medium">Sisa Tunggakan Aktif</p>
                  <p className="text-2xl font-black text-rose-600 font-mono">
                    Rp {kalkulasi.totalTunggakanAktif.toLocaleString('id-ID')}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Syarat Rapor: <span className="font-semibold">{kalkulasi.syaratRaport}</span>
                  </p>
                </div>
              </div>

              {/* Checklist Tagihan yang Bisa Dipilih untuk Dibayar / Dicicil */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <span>Pilih Pos Tagihan yang Mau Dibayar / Dicicil:</span>
                  </h4>
                  <span className="text-xs bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-lg font-semibold">
                    💡 Centang pos, lalu ubah nominal jika ingin mencicil sebagian
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-3.5">
                  {/* Pos 1: Daftar Ulang (DU) */}
                  {(() => {
                    const targetDu = 905000;
                    const sudahMasuk = selectedSiswa.duJuli || 0;
                    const sisaDu = Math.max(0, targetDu - sudahMasuk);
                    const isSelected = !!selectedItems['DU'];
                    const currentBayar = selectedItems['DU']?.bayar || sisaDu;

                    return (
                      <div className={`p-4 rounded-xl border transition ${
                        sisaDu === 0
                          ? 'bg-slate-50 border-slate-200 opacity-60'
                          : isSelected
                          ? 'bg-blue-50/70 border-blue-500 shadow-xs ring-1 ring-blue-500'
                          : 'bg-white border-slate-200 hover:border-blue-300'
                      }`}>
                        <div className="flex items-center justify-between cursor-pointer" onClick={() => {
                          if (sisaDu > 0) {
                            toggleItem('DU', {
                              posId: 'DU',
                              posNama: 'Daftar Ulang (DU + Juli)',
                              targetTotal: targetDu,
                              sudahMasuk,
                              sisaHarusBayar: sisaDu,
                              tipe: 'SEKALI_BAYAR'
                            });
                          }
                        }}>
                          <div className="flex items-center gap-3">
                            {sisaDu === 0 ? (
                              <CheckSquare className="w-5 h-5 text-emerald-600" />
                            ) : isSelected ? (
                              <CheckSquare className="w-5 h-5 text-blue-600" />
                            ) : (
                              <Square className="w-5 h-5 text-slate-400" />
                            )}
                            <div>
                              <p className="text-sm font-bold text-slate-900">Daftar Ulang (Paket DU + Juli)</p>
                              <p className="text-xs text-slate-500">
                                Target: Rp {targetDu.toLocaleString('id-ID')} • Sudah Masuk: <strong className="text-emerald-700">Rp {sudahMasuk.toLocaleString('id-ID')}</strong>
                              </p>
                            </div>
                          </div>

                          <div className="text-right">
                            <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded ${
                              sisaDu === 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                            }`}>
                              {sisaDu === 0 ? 'LUNAS' : `Sisa: Rp ${sisaDu.toLocaleString('id-ID')}`}
                            </span>
                          </div>
                        </div>

                        {/* Kontrol Input Cicilan jika dicentang */}
                        {isSelected && sisaDu > 0 && (
                          <div className="mt-3 pt-3 border-t border-blue-200 flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-lg border border-blue-100">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-700">Nominal Disetor/Dicicil:</span>
                              <div className="relative">
                                <span className="absolute left-2.5 top-1.5 text-xs font-bold text-slate-500">Rp</span>
                                <input
                                  type="number"
                                  value={currentBayar}
                                  onChange={(e) => updateNominalCicilan('DU', e.target.value, sisaDu)}
                                  className="w-36 pl-8 pr-2 py-1 text-sm font-bold font-mono border border-slate-300 rounded-lg bg-amber-50 focus:bg-white"
                                />
                              </div>
                              <span className="text-xs font-bold text-slate-500">
                                (Sisa Nanti: Rp {(sisaDu - currentBayar).toLocaleString('id-ID')})
                              </span>
                            </div>

                            {/* Tombol Cepat Cicil */}
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => updateNominalCicilan('DU', 200000, sisaDu)}
                                className="text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded"
                              >
                                Cicil 200rb
                              </button>
                              <button
                                type="button"
                                onClick={() => updateNominalCicilan('DU', 300000, sisaDu)}
                                className="text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded"
                              >
                                Cicil 300rb
                              </button>
                              <button
                                type="button"
                                onClick={() => updateNominalCicilan('DU', sisaDu, sisaDu)}
                                className="text-[11px] font-bold bg-blue-100 hover:bg-blue-200 text-blue-800 px-2 py-1 rounded"
                              >
                                Bayar Lunas Sisa
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  {/* Pos 2: SPI (Sumbangan Pengembangan Institusi / Gedung) */}
                  {(() => {
                    const targetSpi = 2000000;
                    const sudahMasukSpi = selectedSiswa.spi || 0;
                    const sisaSpi = Math.max(0, targetSpi - sudahMasukSpi);
                    const isSelected = !!selectedItems['SPI'];
                    const currentBayar = selectedItems['SPI']?.bayar || sisaSpi;

                    return (
                      <div className={`p-4 rounded-xl border transition ${
                        sisaSpi === 0
                          ? 'bg-slate-50 border-slate-200 opacity-60'
                          : isSelected
                          ? 'bg-blue-50/70 border-blue-500 shadow-xs ring-1 ring-blue-500'
                          : 'bg-white border-slate-200 hover:border-blue-300'
                      }`}>
                        <div className="flex items-center justify-between cursor-pointer" onClick={() => {
                          if (sisaSpi > 0) {
                            toggleItem('SPI', {
                              posId: 'SPI',
                              posNama: 'SPI (Sumbangan Pengembangan Institusi)',
                              targetTotal: targetSpi,
                              sudahMasuk: sudahMasukSpi,
                              sisaHarusBayar: sisaSpi,
                              tipe: 'SEKALI_BAYAR'
                            });
                          }
                        }}>
                          <div className="flex items-center gap-3">
                            {sisaSpi === 0 ? (
                              <CheckSquare className="w-5 h-5 text-emerald-600" />
                            ) : isSelected ? (
                              <CheckSquare className="w-5 h-5 text-blue-600" />
                            ) : (
                              <Square className="w-5 h-5 text-slate-400" />
                            )}
                            <div>
                              <p className="text-sm font-bold text-slate-900">SPI (Uang Gedung / Sarana)</p>
                              <p className="text-xs text-slate-500">
                                Target: Rp {targetSpi.toLocaleString('id-ID')} • Sudah Dicicil: <strong className="text-emerald-700">Rp {sudahMasukSpi.toLocaleString('id-ID')}</strong>
                              </p>
                            </div>
                          </div>

                          <div className="text-right">
                            <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded ${
                              sisaSpi === 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                            }`}>
                              {sisaSpi === 0 ? 'LUNAS' : `Sisa: Rp ${sisaSpi.toLocaleString('id-ID')}`}
                            </span>
                          </div>
                        </div>

                        {/* Kontrol Input Cicilan jika dicentang */}
                        {isSelected && sisaSpi > 0 && (
                          <div className="mt-3 pt-3 border-t border-blue-200 flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-lg border border-blue-100">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-700">Nominal Cicilan SPI:</span>
                              <div className="relative">
                                <span className="absolute left-2.5 top-1.5 text-xs font-bold text-slate-500">Rp</span>
                                <input
                                  type="number"
                                  value={currentBayar}
                                  onChange={(e) => updateNominalCicilan('SPI', e.target.value, sisaSpi)}
                                  className="w-36 pl-8 pr-2 py-1 text-sm font-bold font-mono border border-slate-300 rounded-lg bg-amber-50 focus:bg-white"
                                />
                              </div>
                              <span className="text-xs font-bold text-slate-500">
                                (Sisa Nanti: Rp {(sisaSpi - currentBayar).toLocaleString('id-ID')})
                              </span>
                            </div>

                            {/* Tombol Cepat Cicil */}
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => updateNominalCicilan('SPI', 250000, sisaSpi)}
                                className="text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded"
                              >
                                Cicil 250rb
                              </button>
                              <button
                                type="button"
                                onClick={() => updateNominalCicilan('SPI', 500000, sisaSpi)}
                                className="text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded"
                              >
                                Cicil 500rb
                              </button>
                              <button
                                type="button"
                                onClick={() => updateNominalCicilan('SPI', sisaSpi, sisaSpi)}
                                className="text-[11px] font-bold bg-blue-100 hover:bg-blue-200 text-blue-800 px-2 py-1 rounded"
                              >
                                Bayar Lunas Sisa
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  {/* Pos 3: SPP Bulanan (Bisa Dicicil per Bulan) */}
                  <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200">
                    <p className="text-xs font-bold uppercase text-slate-600 mb-2">
                      SPP Bulanan (Bisa Bayar Lunas atau Nyicil per Bulan):
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {bulanList.map((bln) => {
                        const sudahBayar = selectedSiswa.bayarBulanan?.[bln] || 0;
                        const sisaBulan = Math.max(0, nominalSpp - sudahBayar);
                        const key = `BULAN_${bln}`;
                        const isSelected = !!selectedItems[key];
                        const currentBayar = selectedItems[key]?.bayar || sisaBulan;

                        return (
                          <div
                            key={bln}
                            className={`p-3 rounded-xl border transition ${
                              sisaBulan === 0
                                ? 'bg-emerald-50/40 border-emerald-200 opacity-60'
                                : isSelected
                                ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500 shadow-xs'
                                : 'bg-white border-slate-200 hover:border-blue-300'
                            }`}
                          >
                            <div
                              className="flex items-center justify-between cursor-pointer"
                              onClick={() => {
                                if (sisaBulan > 0) {
                                  toggleItem(key, {
                                    posId: 'SPP',
                                    namaBulan: bln,
                                    posNama: `SPP Bulan ${bln}`,
                                    targetTotal: nominalSpp,
                                    sudahMasuk: sudahBayar,
                                    sisaHarusBayar: sisaBulan,
                                    tipe: 'BULANAN'
                                  });
                                }
                              }}
                            >
                              <div className="flex items-center gap-2">
                                {sisaBulan === 0 ? (
                                  <CheckSquare className="w-4 h-4 text-emerald-600" />
                                ) : isSelected ? (
                                  <CheckSquare className="w-4 h-4 text-blue-600" />
                                ) : (
                                  <Square className="w-4 h-4 text-slate-400" />
                                )}
                                <div>
                                  <p className="text-sm font-bold text-slate-800">{bln}</p>
                                  <p className="text-[11px] text-slate-500">
                                    Sudah: Rp {sudahBayar.toLocaleString('id-ID')}
                                  </p>
                                </div>
                              </div>
                              <span className={`text-xs font-mono font-bold ${
                                sisaBulan === 0 ? 'text-emerald-700' : 'text-slate-800'
                              }`}>
                                {sisaBulan === 0 ? 'LUNAS' : `Sisa: ${sisaBulan.toLocaleString('id-ID')}`}
                              </span>
                            </div>

                            {/* Form Cicil Bulan Ini */}
                            {isSelected && sisaBulan > 0 && (
                              <div className="mt-2 pt-2 border-t border-blue-200 flex items-center justify-between gap-2">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-[11px] font-bold text-slate-600">Cicil:</span>
                                  <input
                                    type="number"
                                    value={currentBayar}
                                    onChange={(e) => updateNominalCicilan(key, e.target.value, sisaBulan)}
                                    className="w-24 px-1.5 py-0.5 text-xs font-bold font-mono border border-slate-300 rounded bg-amber-50"
                                  />
                                </div>
                                <button
                                  type="button"
                                  onClick={() => updateNominalCicilan(key, sisaBulan, sisaBulan)}
                                  className="text-[10px] font-bold text-blue-700 hover:underline"
                                >
                                  Lunas Sisa
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Pos Biaya Lain-Lain & Praktik Kejuruan (Custom Pos Biaya) */}
                  {(() => {
                    const customPosList = (data.posBiaya || []).filter((p) => {
                      if (['SPP', 'DU', 'SPI', 'TUNGGAKAN_LALU'].includes(p.id)) return false;
                      const matchJurusan = p.targetJurusan === 'SEMUA' || p.targetJurusan === selectedSiswa?.jurusanKode;
                      const matchTingkat = p.targetTingkat === 'SEMUA' || p.targetTingkat === selectedSiswa?.tingkat;
                      return matchJurusan && matchTingkat;
                    });

                    if (customPosList.length === 0) return null;

                    return (
                      <div className="pt-2">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                            Pos Biaya Lain-Lain & Praktik Kejuruan ({selectedSiswa?.jurusanKode}):
                          </h5>
                          <span className="text-[11px] text-slate-500">
                            Sesuai Jurusan & Tingkat Siswa
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {customPosList.map((pos) => {
                            const key = `POS_${pos.id}`;
                            const targetNominal = (pos.tarifJurusan && selectedSiswa?.jurusanKode && pos.tarifJurusan[selectedSiswa.jurusanKode]) || pos.nominalDefault || 0;
                            const isSelected = !!selectedItems[key];
                            const currentBayar = selectedItems[key]?.bayar !== undefined ? selectedItems[key].bayar : targetNominal;

                            return (
                              <div
                                key={pos.id}
                                className={`p-3.5 rounded-xl border transition ${
                                  isSelected
                                    ? 'bg-purple-50/80 border-purple-400 shadow-xs ring-1 ring-purple-400'
                                    : 'bg-white border-slate-200 hover:border-purple-300'
                                }`}
                              >
                                <div
                                  className="flex items-center justify-between cursor-pointer"
                                  onClick={() => {
                                    toggleItem(key, {
                                      posId: pos.id,
                                      posNama: pos.nama,
                                      targetTotal: targetNominal,
                                      sudahMasuk: 0,
                                      sisaHarusBayar: targetNominal,
                                      tipe: pos.tipe || 'SEKALI_BAYAR'
                                    });
                                  }}
                                >
                                  <div className="flex items-center gap-2.5">
                                    {isSelected ? (
                                      <CheckSquare className="w-4 h-4 text-purple-600 flex-shrink-0" />
                                    ) : (
                                      <Square className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                    )}
                                    <div>
                                      <p className="text-xs font-bold text-slate-900 leading-tight">
                                        {pos.nama}
                                      </p>
                                      <p className="text-[10px] text-slate-500 mt-0.5">
                                        {pos.targetJurusan !== 'SEMUA' ? `Khusus ${pos.targetJurusan}` : 'Semua Jurusan'} • {pos.tipe === 'BULANAN' ? 'Bulanan' : 'Sekali Bayar'}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="text-right">
                                    <span className="text-xs font-mono font-bold text-slate-800">
                                      Rp {targetNominal.toLocaleString('id-ID')}
                                    </span>
                                  </div>
                                </div>

                                {isSelected && (
                                  <div className="mt-2.5 pt-2.5 border-t border-purple-200 flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-[11px] font-bold text-slate-700">Bayar/Cicil:</span>
                                      <div className="relative">
                                        <span className="absolute left-1.5 top-0.5 text-[10px] font-bold text-slate-400">Rp</span>
                                        <input
                                          type="number"
                                          value={currentBayar}
                                          onChange={(e) => updateNominalCicilan(key, e.target.value, targetNominal)}
                                          className="w-28 pl-6 pr-1.5 py-0.5 text-xs font-mono font-bold border border-slate-300 rounded bg-white"
                                        />
                                      </div>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => updateNominalCicilan(key, targetNominal, targetNominal)}
                                      className="text-[10px] font-bold text-purple-700 hover:underline"
                                    >
                                      Lunas (Rp {targetNominal.toLocaleString('id-ID')})
                                    </button>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Form Metode Bayar & Submit Kasir */}
              <div className="pt-4 border-t border-slate-200 space-y-4 bg-slate-50 -mx-6 -mb-6 p-6 rounded-b-2xl">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">
                      Metode Pembayaran
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setMetodeBayar('TUNAI')}
                        className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition ${
                          metodeBayar === 'TUNAI'
                            ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200'
                        }`}
                      >
                        <Banknote className="w-4 h-4" />
                        Tunai Loket
                      </button>

                      <button
                        type="button"
                        onClick={() => setMetodeBayar('VA_TRANSFER')}
                        className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition ${
                          metodeBayar === 'VA_TRANSFER'
                            ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200'
                        }`}
                      >
                        <Smartphone className="w-4 h-4" />
                        Simulasi VA
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">
                      Nama Petugas Kasir
                    </label>
                    <input
                      type="text"
                      value={petugasNama}
                      onChange={(e) => setPetugasNama(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">
                      Catatan Pembayaran
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Titipan orang tua (Cicilan ke-1)..."
                      value={catatan}
                      onChange={(e) => setCatatan(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm"
                    />
                  </div>
                </div>

                {/* Bar Total & Tombol Cetak Kuitansi */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-200">
                  <div>
                    <p className="text-xs text-slate-500 font-semibold uppercase">Total Pembayaran / Cicilan Saat Ini</p>
                    <p className="text-2xl font-black text-slate-900 font-mono">
                      Rp {totalTagihanDipilih.toLocaleString('id-ID')}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Jumlah pos yang disetor: {Object.keys(selectedItems).length} item
                    </p>
                  </div>

                  <button
                    onClick={handleProsesBayar}
                    disabled={totalTagihanDipilih <= 0}
                    className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-md transition ${
                      totalTagihanDipilih > 0
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer hover:shadow-lg'
                        : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    <Receipt className="w-5 h-5" />
                    Proses Bayar & Terbitkan Kuitansi
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Riwayat Transaksi Kasir Terbaru */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <h3 className="font-bold text-slate-800 text-base mb-4 flex items-center gap-2">
          <Receipt className="w-5 h-5 text-blue-600" />
          Riwayat Transaksi Kuitansi Terakhir (Hari Ini)
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 font-bold border-y border-slate-200 text-xs">
              <tr>
                <th className="py-2.5 px-3">No. Transaksi</th>
                <th className="py-2.5 px-3">Nama Siswa</th>
                <th className="py-2.5 px-3">Kelas</th>
                <th className="py-2.5 px-3">Tanggal</th>
                <th className="py-2.5 px-3">Metode</th>
                <th className="py-2.5 px-3 text-right">Nominal</th>
                <th className="py-2.5 px-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.riwayatPembayaran.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/80">
                  <td className="py-2 px-3 font-mono font-medium text-slate-700">{p.id}</td>
                  <td className="py-2 px-3 font-bold text-slate-900">{p.namaSiswa}</td>
                  <td className="py-2 px-3 text-slate-600">{p.kelas}</td>
                  <td className="py-2 px-3 text-slate-500 text-xs">{p.tanggal}</td>
                  <td className="py-2 px-3">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                        p.metode === 'VA_TRANSFER'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {p.metode === 'VA_TRANSFER' ? 'Virtual Account' : 'Tunai Loket'}
                    </span>
                  </td>
                  <td className="py-2 px-3 font-mono font-bold text-slate-900 text-right">
                    Rp {Number(p.total).toLocaleString('id-ID')}
                  </td>
                  <td className="py-2 px-3 text-center">
                    <button
                      onClick={() => onShowKuitansi(p)}
                      className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-semibold bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-md transition"
                    >
                      <Printer className="w-3.5 h-3.5" /> Cetak Ulang
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
