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
  // Structure: { [key]: { posId, namaBulan, posNama, targetTotal, sudahMasuk, bayar, sisaHarusBayar, isCicilan, tipe } }
  const [selectedItems, setSelectedItems] = useState({});
  const [uangDiterima, setUangDiterima] = useState('');

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
    const val = Math.max(0, Math.min(Number(nominalBaru) || 0, maxSisa));
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

  // Tombol Cerdas: Bayar Penuh Sesuai Total (VA / Lunas Semua)
  const handleBayarPenuhSemua = () => {
    if (!kalkulasi?.daftarItemTagihan) return;
    const newItems = {};
    let total = 0;
    kalkulasi.daftarItemTagihan.forEach(it => {
      if (it.sisa > 0) {
        newItems[it.id] = {
          posId: it.posId,
          namaBulan: it.namaBulan,
          posNama: it.nama,
          targetTotal: it.target,
          sudahMasuk: it.sudahMasuk,
          sisaHarusBayar: it.sisa,
          tipe: it.tipe,
          bayar: it.sisa,
          isCicilan: false
        };
        total += it.sisa;
      }
    });
    setSelectedItems(newItems);
    setUangDiterima(total > 0 ? String(total) : '');
  };

  // Tombol Cerdas: Alokasikan Otomatis dari Total Uang Diterima
  const handleAlokasiOtomatis = () => {
    const nominalUang = Number(uangDiterima);
    if (!nominalUang || nominalUang <= 0) {
      alert('Masukkan nominal uang yang diterima terlebih dahulu pada kotak input (contoh: 500000)!');
      return;
    }
    if (!kalkulasi?.daftarItemTagihan) return;

    const alokasiMap = dataService.alokasikanOtomatis(kalkulasi.daftarItemTagihan, nominalUang);
    const newItems = {};
    kalkulasi.daftarItemTagihan.forEach(it => {
      const uangItem = alokasiMap[it.id] || 0;
      if (uangItem > 0) {
        newItems[it.id] = {
          posId: it.posId,
          namaBulan: it.namaBulan,
          posNama: it.nama,
          targetTotal: it.target,
          sudahMasuk: it.sudahMasuk,
          sisaHarusBayar: it.sisa,
          tipe: it.tipe,
          bayar: uangItem,
          isCicilan: uangItem < it.sisa
        };
      }
    });
    setSelectedItems(newItems);
  };

  // Reset Pilihan
  const handleResetPilihan = () => {
    setSelectedItems({});
    setUangDiterima('');
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
        sisaSetelahBayar: Math.max(0, it.sisaHarusBayar - it.bayar)
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

      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.7 }
      });

      setSelectedItems({});
      setUangDiterima('');
      onUpdateData();
      onShowKuitansi(res);
    } catch (e) {
      alert('Terjadi kesalahan: ' + e.message);
    }
  };

  // Verifikasi Pembayaran VA Manual oleh Admin (Tombol 'Sudah Bayar')
  const handleVerifikasiVa = () => {
    if (!selectedSiswa) return;
    const nominal = totalTagihanDipilih > 0 ? totalTagihanDipilih : kalkulasi.totalSisaPiutang;
    if (nominal <= 0) {
      alert('Tagihan siswa ini sudah lunas sepenuhnya!');
      return;
    }

    try {
      let itemsArray = Object.values(selectedItems).map((it) => ({
        ...it,
        item: it.isCicilan ? `${it.posNama} (Cicilan Sebagian)` : it.posNama,
        sisaSetelahBayar: Math.max(0, it.sisaHarusBayar - it.bayar)
      }));

      // Jika belum ada item yang dicentang kasir, otomatis verifikasi lunas seluruh item
      if (itemsArray.length === 0) {
        itemsArray = kalkulasi.daftarItemTagihan.filter(it => it.sisa > 0).map(it => ({
          posId: it.posId,
          namaBulan: it.namaBulan,
          posNama: it.nama,
          targetTotal: it.target,
          sudahMasuk: it.sudahMasuk,
          sisaHarusBayar: it.sisa,
          tipe: it.tipe,
          bayar: it.sisa,
          isCicilan: false,
          item: it.nama,
          sisaSetelahBayar: 0
        }));
      }

      const res = dataService.verifikasiPembayaranVa({
        siswaId: selectedSiswa.id,
        nominal,
        petugas: petugasNama || 'Admin Pusat (Verifikasi VA)',
        rincianItems: itemsArray,
        nomorReferensi: `VA-AUTO-${selectedSiswa.va || Date.now().toString().slice(-6)}`,
        catatan: catatan || 'Verifikasi Transfer Virtual Account Otomatis Terinci (Dikonfirmasi Admin)'
      });

      confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
      setSelectedItems({});
      setUangDiterima('');
      onUpdateData();
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
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <span className="text-xs text-slate-500">
                      NIS: <strong>{selectedSiswa.nis}</strong>
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-xs text-slate-500 flex items-center gap-1.5">
                      No. Virtual Account: 
                      <strong className="font-mono text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded font-black">
                        {selectedSiswa.va}
                      </strong>
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      selectedSiswa.vaStatus === 'SUDAH_BAYAR' || kalkulasi.totalSisaPiutang === 0
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-900'
                    }`}>
                      {selectedSiswa.vaStatus === 'SUDAH_BAYAR' || kalkulasi.totalSisaPiutang === 0 ? '✓ VA Terverifikasi' : '⏳ Menunggu Transfer VA'}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xs text-slate-500 font-medium">Syarat Pengambilan Rapor</p>
                  <p className={`text-sm font-bold ${kalkulasi.isLunasSmt1 ? 'text-emerald-700' : 'text-rose-600'}`}>
                    {kalkulasi.syaratRaport}
                  </p>
                </div>
              </div>

              {/* 4 Kartu Ringkasan Keuangan Siswa Terpilih */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-[11px] font-bold text-slate-500 uppercase">Total Seluruh Tagihan</p>
                  <p className="text-lg font-black font-mono text-slate-900 mt-0.5">
                    Rp {kalkulasi.totalSemuaTagihan.toLocaleString('id-ID')}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Semua pos biaya & SPP berjalan</p>
                </div>

                <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200">
                  <p className="text-[11px] font-bold text-emerald-700 uppercase">Total Sudah Terbayar</p>
                  <p className="text-lg font-black font-mono text-emerald-800 mt-0.5">
                    Rp {kalkulasi.totalSudahBayar.toLocaleString('id-ID')}
                  </p>
                  <p className="text-[10px] text-emerald-600 mt-0.5">Uang masuk tunai & transfer VA</p>
                </div>

                <div className="p-3.5 bg-rose-50 rounded-xl border border-rose-200">
                  <p className="text-[11px] font-bold text-rose-700 uppercase">Sisa Piutang / Belum Bayar</p>
                  <p className="text-lg font-black font-mono text-rose-700 mt-0.5">
                    Rp {kalkulasi.totalSisaPiutang.toLocaleString('id-ID')}
                  </p>
                  <p className="text-[10px] text-rose-500 mt-0.5">Kekurangan total yang harus disetor</p>
                </div>
              </div>

              {/* Bilah Input Uang Diterima & Smart Allocation Engine */}
              <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 p-4 sm:p-5 rounded-2xl border border-blue-200 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <span>Input Uang Diterima & Alokasi Otomatis (VA / Tunai / Nyicil Fleksibel)</span>
                    </h4>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      Ketik uang yang dibawa/ditransfer, lalu klik <strong>Alokasikan Otomatis</strong> untuk merinci lunas/cicilan dari item atas ke bawah secara otomatis.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 pt-1">
                  <div className="relative flex-1 min-w-[200px]">
                    <span className="absolute left-3 top-2.5 text-xs font-black text-slate-400">Rp</span>
                    <input
                      type="number"
                      placeholder="Ketik uang masuk (misal: 500000)..."
                      value={uangDiterima}
                      onChange={(e) => setUangDiterima(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-white border border-blue-300 rounded-xl text-sm font-mono font-black text-slate-900 focus:ring-2 focus:ring-blue-500 shadow-xs"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleAlokasiOtomatis}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                    title="Alokasikan uang masuk secara berurutan ke tiap item tagihan"
                  >
                    <span>🎯 Alokasikan Otomatis</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleBayarPenuhSemua}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                    title="Bayar lunas seluruh pos tagihan sesuai total tagihan VA"
                  >
                    <span>⚡ Bayar Pas Seluruh Tagihan ({kalkulasi.totalSisaPiutang.toLocaleString('id-ID')})</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleResetPilihan}
                    className="px-3 py-2 bg-white hover:bg-slate-100 text-slate-600 rounded-xl text-xs font-bold transition border border-slate-300 cursor-pointer"
                    title="Kosongkan pilihan centang"
                  >
                    <span>🔄 Reset</span>
                  </button>
                </div>
              </div>

              {/* Tabel Rincian Pos Tagihan (Kolom per Item) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                    <Receipt className="w-4 h-4 text-blue-600" />
                    <span>Daftar Rincian Tagihan Keuangan Siswa (Bisa Diisi / Nyicil per Pos):</span>
                  </h4>
                  <span className="text-[11px] text-slate-500">
                    Pos terpilih: <strong className="text-blue-700">{Object.keys(selectedItems).length} item</strong>
                  </span>
                </div>

                <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 text-slate-700 uppercase font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-3 w-10 text-center">Pilih</th>
                        <th className="p-3">Pos Tagihan & Kategori</th>
                        <th className="p-3 text-right">Tarif Total</th>
                        <th className="p-3 text-right">Sudah Masuk</th>
                        <th className="p-3 text-right">Sisa Piutang</th>
                        <th className="p-3 text-center min-w-[200px]">Bayar Sekarang (Input Manual/Auto)</th>
                        <th className="p-3 text-right">Kekurangan Nanti</th>
                        <th className="p-3 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                      {(kalkulasi.daftarItemTagihan || []).map((item) => {
                        const isSelected = !!selectedItems[item.id];
                        const bayarSekarang = isSelected ? (selectedItems[item.id]?.bayar !== undefined ? selectedItems[item.id].bayar : item.sisa) : 0;
                        const sisaNanti = Math.max(0, item.sisa - bayarSekarang);
                        const isLunasPenuh = item.sisa === 0 || (isSelected && sisaNanti === 0);

                        return (
                          <tr 
                            key={item.id} 
                            className={`transition ${
                              item.sisa === 0
                                ? 'bg-slate-50/50 opacity-60'
                                : isSelected
                                ? 'bg-blue-50/60'
                                : 'hover:bg-slate-50'
                            }`}
                          >
                            <td className="p-3 text-center">
                              <input
                                type="checkbox"
                                disabled={item.sisa === 0}
                                checked={isSelected}
                                onChange={() => {
                                  if (item.sisa > 0) {
                                    toggleItem(item.id, {
                                      posId: item.posId,
                                      namaBulan: item.namaBulan,
                                      posNama: item.nama,
                                      targetTotal: item.target,
                                      sudahMasuk: item.sudahMasuk,
                                      sisaHarusBayar: item.sisa,
                                      tipe: item.tipe
                                    });
                                  }
                                }}
                                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                              />
                            </td>

                            <td className="p-3">
                              <p className="font-extrabold text-slate-900 leading-tight">
                                {item.nama}
                              </p>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                                  item.tipe === 'BULANAN'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-purple-100 text-purple-800'
                                }`}>
                                  {item.tipe === 'BULANAN' ? 'Bulanan' : 'Sekali Bayar'}
                                </span>
                              </div>
                            </td>

                            <td className="p-3 text-right font-mono font-bold text-slate-700">
                              Rp {item.target.toLocaleString('id-ID')}
                            </td>

                            <td className="p-3 text-right font-mono font-bold text-emerald-700">
                              Rp {item.sudahMasuk.toLocaleString('id-ID')}
                            </td>

                            <td className="p-3 text-right font-mono font-bold text-slate-900">
                              Rp {item.sisa.toLocaleString('id-ID')}
                            </td>

                            {/* Kolom Input Bayar Sekarang & Quick Chips */}
                            <td className="p-3 text-center">
                              {item.sisa > 0 ? (
                                <div className="space-y-1">
                                  <div className="relative inline-block w-full max-w-[170px]">
                                    <span className="absolute left-2.5 top-1.5 text-[11px] font-bold text-slate-400">Rp</span>
                                    <input
                                      type="number"
                                      value={isSelected ? bayarSekarang : ''}
                                      placeholder={item.sisa.toLocaleString('id-ID')}
                                      onChange={(e) => {
                                        if (!isSelected) {
                                          toggleItem(item.id, {
                                            posId: item.posId,
                                            namaBulan: item.namaBulan,
                                            posNama: item.nama,
                                            targetTotal: item.target,
                                            sudahMasuk: item.sudahMasuk,
                                            sisaHarusBayar: item.sisa,
                                            tipe: item.tipe
                                          });
                                        }
                                        updateNominalCicilan(item.id, e.target.value, item.sisa);
                                      }}
                                      className={`w-full pl-8 pr-2 py-1 text-xs font-mono font-bold border rounded-lg transition ${
                                        isSelected
                                          ? 'border-blue-400 bg-white text-blue-900 focus:ring-1 focus:ring-blue-500'
                                          : 'border-slate-300 bg-slate-50 text-slate-500'
                                      }`}
                                    />
                                  </div>

                                  {/* Chip Cepat Bayar per Baris */}
                                  <div className="flex items-center justify-center gap-1 flex-wrap">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        if (!isSelected) {
                                          toggleItem(item.id, {
                                            posId: item.posId,
                                            namaBulan: item.namaBulan,
                                            posNama: item.nama,
                                            targetTotal: item.target,
                                            sudahMasuk: item.sudahMasuk,
                                            sisaHarusBayar: item.sisa,
                                            tipe: item.tipe
                                          });
                                        }
                                        updateNominalCicilan(item.id, item.sisa, item.sisa);
                                      }}
                                      className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-100 hover:bg-blue-200 text-blue-800 cursor-pointer"
                                    >
                                      Lunas Sisa
                                    </button>
                                    {item.sisa > 100000 && (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          if (!isSelected) {
                                            toggleItem(item.id, {
                                              posId: item.posId,
                                              namaBulan: item.namaBulan,
                                              posNama: item.nama,
                                              targetTotal: item.target,
                                              sudahMasuk: item.sudahMasuk,
                                              sisaHarusBayar: item.sisa,
                                              tipe: item.tipe
                                            });
                                          }
                                          updateNominalCicilan(item.id, 100000, item.sisa);
                                        }}
                                        className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                                      >
                                        100rb
                                      </button>
                                    )}
                                    {item.sisa > 250000 && (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          if (!isSelected) {
                                            toggleItem(item.id, {
                                              posId: item.posId,
                                              namaBulan: item.namaBulan,
                                              posNama: item.nama,
                                              targetTotal: item.target,
                                              sudahMasuk: item.sudahMasuk,
                                              sisaHarusBayar: item.sisa,
                                              tipe: item.tipe
                                            });
                                          }
                                          updateNominalCicilan(item.id, 250000, item.sisa);
                                        }}
                                        className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                                      >
                                        250rb
                                      </button>
                                    )}
                                  </div>
                                </div>
                              ) : (
                                <span className="text-[11px] font-bold text-emerald-700 font-mono">
                                  ✓ Sudah Lunas
                                </span>
                              )}
                            </td>

                            {/* Kolom Kekurangan Nanti (Sisa Kurang Rp) */}
                            <td className="p-3 text-right font-mono">
                              {item.sisa === 0 ? (
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                                  LUNAS (Rp 0)
                                </span>
                              ) : isSelected ? (
                                sisaNanti === 0 ? (
                                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-black">
                                    LUNAS (Rp 0)
                                  </span>
                                ) : (
                                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 font-black">
                                    Kurang: Rp {sisaNanti.toLocaleString('id-ID')}
                                  </span>
                                )
                              ) : (
                                <span className="text-[10px] px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 font-bold">
                                  Kurang: Rp {item.sisa.toLocaleString('id-ID')}
                                </span>
                              )}
                            </td>

                            <td className="p-3 text-center">
                              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                                item.sisa === 0 || (isSelected && sisaNanti === 0)
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : (item.sudahMasuk > 0 || (isSelected && bayarSekarang > 0))
                                  ? 'bg-amber-100 text-amber-900'
                                  : 'bg-slate-100 text-slate-600'
                              }`}>
                                {item.sisa === 0 || (isSelected && sisaNanti === 0)
                                  ? 'LUNAS'
                                  : (item.sudahMasuk > 0 || (isSelected && bayarSekarang > 0))
                                  ? 'CICILAN'
                                  : 'BELUM'}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Form Metode Bayar, Verifikasi VA, dan Submit Kasir */}
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
                        className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition cursor-pointer ${
                          metodeBayar === 'TUNAI'
                            ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <Banknote className="w-4 h-4" />
                        Tunai Loket
                      </button>

                      <button
                        type="button"
                        onClick={() => setMetodeBayar('VA_TRANSFER')}
                        className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition cursor-pointer ${
                          metodeBayar === 'VA_TRANSFER'
                            ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <Smartphone className="w-4 h-4" />
                        Virtual Account
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
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold"
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

                {/* Bar Total, Sisa Kekurangan & Tombol Aksi */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-200">
                  <div className="space-y-0.5">
                    <p className="text-xs text-slate-500 font-semibold uppercase">Total Pembayaran Disetor Saat Ini:</p>
                    <div className="flex items-baseline gap-3">
                      <p className="text-2xl font-black text-slate-900 font-mono">
                        Rp {totalTagihanDipilih.toLocaleString('id-ID')}
                      </p>
                      <span className="text-xs text-slate-500 font-mono">
                        (Sisa Kekurangan: <strong className="text-rose-600 font-bold">Rp {Math.max(0, kalkulasi.totalSisaPiutang - totalTagihanDipilih).toLocaleString('id-ID')}</strong>)
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Item yang dibayar: {Object.keys(selectedItems).length} pos tagihan
                    </p>
                  </div>

                  <div className="flex items-center gap-2.5 flex-wrap">
                    {/* Tombol Verifikasi VA Manual oleh Admin (Tombol 'Sudah Bayar') */}
                    <button
                      type="button"
                      onClick={handleVerifikasiVa}
                      className="px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-black shadow-md transition flex items-center gap-2 cursor-pointer hover:shadow-lg"
                      title="Verifikasi langsung pembayaran via nomor VA (Tandai Sudah Bayar)"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                      <span>✅ Verifikasi VA: Tandai Sudah Bayar</span>
                    </button>

                    {/* Tombol Pembayaran Reguler */}
                    <button
                      onClick={handleProsesBayar}
                      disabled={totalTagihanDipilih <= 0}
                      className={`px-5 py-3 rounded-xl font-black text-xs flex items-center gap-2 shadow-md transition ${
                        totalTagihanDipilih > 0
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer hover:shadow-lg'
                          : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      <Receipt className="w-4 h-4" />
                      <span>Proses Bayar & Terbitkan Kuitansi</span>
                    </button>
                  </div>
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
