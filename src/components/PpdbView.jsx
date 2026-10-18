import React, { useState } from 'react';
import {
  UserPlus,
  Search,
  Filter,
  CreditCard,
  Building,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileSpreadsheet,
  Printer,
  Copy,
  Edit,
  Trash2,
  Plus,
  ArrowRight,
  TrendingUp,
  GraduationCap,
  Sparkles,
  QrCode,
  DollarSign,
  Users,
  Settings,
  Share2,
  Calendar,
  Phone,
  ShieldCheck,
  Check
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { dataService } from '../services/dataService';
import SchoolLogo from './SchoolLogo';

export default function PpdbView({
  data,
  currentUser,
  activeKelompok,
  onUpdateData
}) {
  const role = currentUser?.role || 'ADMIN';
  const username = (currentUser?.username || '').toLowerCase();
  const isKasirHana = role === 'KASIR_HANA' || username === 'hana' || (currentUser?.kasirKelompok === 'BISNIS_MANAJEMEN' && role !== 'ADMIN' && role !== 'BENDAHARA');
  const isKasirUmi = role === 'KASIR_UMI' || username === 'umi' || (currentUser?.kasirKelompok === 'PARIWISATA' && role !== 'ADMIN' && role !== 'BENDAHARA');
  const isBendahara = role === 'BENDAHARA' || username === 'bendahara';
  const isKepsek = role === 'KEPALA_SEKOLAH' || username === 'kepsek';
  const isAdmin = role === 'ADMIN';

  // Tentukan kelompok yang berlaku untuk saringan data
  const effectiveKelompok = isKasirHana 
    ? 'BISNIS_MANAJEMEN' 
    : isKasirUmi 
    ? 'PARIWISATA' 
    : activeKelompok || 'ALL';

  // Sub Tab Navigation
  const [subTab, setSubTab] = useState('calon-siswa'); // 'calon-siswa' | 'kasir-ppdb' | 'master-kelas-kuota' | 'master-biaya'
  
  // State Filter & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [filterJurusan, setFilterJurusan] = useState('SEMUA');
  const [filterStatusBayar, setFilterStatusBayar] = useState('SEMUA');
  const [copiedVa, setCopiedVa] = useState(null);
  const [notifPesan, setNotifPesan] = useState({ tipe: '', teks: '' });

  // Modal State
  const [modalDaftarOpen, setModalDaftarOpen] = useState(false);
  const [editCalonId, setEditCalonId] = useState(null);
  const [modalBayarOpen, setModalBayarOpen] = useState(false);
  const [bayarCalonSiswa, setBayarCalonSiswa] = useState(null);
  const [modalKuitansiPpdb, setModalKuitansiPpdb] = useState(null);
  const [modalKartuPpdb, setModalKartuPpdb] = useState(null);
  const [modalTambahKelasOpen, setModalTambahKelasOpen] = useState(false);
  const [modalPromosiOpen, setModalPromosiOpen] = useState(null);

  // Master Pos Biaya PPDB State (Tambah, Edit, Hapus)
  const [modalPosPpdbOpen, setModalPosPpdbOpen] = useState(false);
  const [editPosPpdbId, setEditPosPpdbId] = useState(null);
  const [formPosPpdb, setFormPosPpdb] = useState({
    nama: '',
    nominal: '',
    wajib: true,
    keterangan: ''
  });

  // State Rincian Cicilan & Alokasi Pintar Bayar PPDB
  const [ppdbSelectedItems, setPpdbSelectedItems] = useState({});
  const [uangDiterimaPpdb, setUangDiterimaPpdb] = useState('');

  // Form Calon Siswa State
  const [formCalon, setFormCalon] = useState({
    nama: '',
    nisn: '',
    jenisKelamin: 'L',
    asalSekolah: '',
    noHp: '',
    jurusanKode: isKasirUmi ? 'KSP' : 'AKL',
    kelasId: '',
    gelombang: data.masterPpdb?.gelombangAktif || 'Gelombang 1',
    vaManual: '',
    isManualVa: false
  });

  // Form Bayar PPDB State
  const [formBayar, setFormBayar] = useState({
    nominal: 0,
    metode: 'TUNAI',
    nomorReferensi: '',
    catatan: '',
    itemsTerpilih: {}
  });

  // Form Tambah Kelas PPDB State
  const [formKelas, setFormKelas] = useState({
    tingkat: 'X',
    jurusanKode: isKasirUmi ? 'KSP' : 'AKL',
    rombel: '1',
    nama: '',
    waliKelas: ''
  });

  // Filter Jurusan Sesuai Hak Akses Pengguna
  const availableJurusan = data.jurusan.filter(j => {
    if (isKasirHana) return ['AKL', 'MPLB', 'PM'].includes(j.kode);
    if (isKasirUmi) return ['KSP', 'HTL'].includes(j.kode);
    if (effectiveKelompok === 'BISNIS_MANAJEMEN') return ['AKL', 'MPLB', 'PM'].includes(j.kode);
    if (effectiveKelompok === 'PARIWISATA') return ['KSP', 'HTL'].includes(j.kode);
    return true;
  });

  // Calon Siswa List Tersaring
  const rawCalonList = data.calonSiswaPpdb || [];
  const filteredCalon = rawCalonList.filter(s => {
    // 1. Saringan Hak Akses Kelompok Kasir
    if (isKasirHana && !['AKL', 'MPLB', 'PM'].includes(s.jurusanKode)) return false;
    if (isKasirUmi && !['KSP', 'HTL'].includes(s.jurusanKode)) return false;
    if (effectiveKelompok === 'BISNIS_MANAJEMEN' && !['AKL', 'MPLB', 'PM'].includes(s.jurusanKode)) return false;
    if (effectiveKelompok === 'PARIWISATA' && !['KSP', 'HTL'].includes(s.jurusanKode)) return false;

    // 2. Saringan Dropdown Jurusan
    if (filterJurusan !== 'SEMUA' && s.jurusanKode !== filterJurusan) return false;

    // 3. Saringan Status Bayar
    if (filterStatusBayar !== 'SEMUA' && s.statusBayar !== filterStatusBayar) return false;

    // 4. Saringan Pencarian (Nama, No Pendaftaran, NISN, Asal Sekolah, VA)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchNama = s.nama?.toLowerCase().includes(q);
      const matchNo = s.noPendaftaran?.toLowerCase().includes(q);
      const matchNisn = s.nisn?.toLowerCase().includes(q);
      const matchAsal = s.asalSekolah?.toLowerCase().includes(q);
      const matchVa = s.va?.toLowerCase().includes(q);
      return matchNama || matchNo || matchNisn || matchAsal || matchVa;
    }

    return true;
  });

  // Statistik PPDB Sesuai Saringan Aktif
  const totalCalon = filteredCalon.length;
  const totalUangMasuk = filteredCalon.reduce((acc, curr) => acc + (curr.totalBayar || 0), 0);
  const totalTargetBiaya = filteredCalon.reduce((acc, curr) => acc + (curr.totalTagihan || 0), 0);
  const totalSisaTagihan = Math.max(0, totalTargetBiaya - totalUangMasuk);
  const totalLunasCount = filteredCalon.filter(s => s.statusBayar === 'LUNAS').length;

  // Handler Copy VA ke Clipboard
  const handleCopyVa = (vaNum) => {
    navigator.clipboard?.writeText(vaNum);
    setCopiedVa(vaNum);
    setTimeout(() => setCopiedVa(null), 2500);
  };

  // Handler Buka Modal Tambah Calon Siswa
  const handleBukaDaftar = () => {
    setEditCalonId(null);
    const defJur = availableJurusan[0]?.kode || 'AKL';
    const autoVa = dataService.generateVaPpdb(defJur);
    setFormCalon({
      nama: '',
      nisn: '',
      jenisKelamin: 'L',
      asalSekolah: '',
      noHp: '',
      jurusanKode: defJur,
      kelasId: '',
      gelombang: data.masterPpdb?.gelombangAktif || 'Gelombang 1',
      vaManual: autoVa,
      isManualVa: false
    });
    setModalDaftarOpen(true);
  };

  // Handler Buka Modal Edit Calon Siswa
  const handleBukaEdit = (s) => {
    setEditCalonId(s.id);
    setFormCalon({
      nama: s.nama,
      nisn: s.nisn || '',
      jenisKelamin: s.jenisKelamin || 'L',
      asalSekolah: s.asalSekolah || '',
      noHp: s.noHp || '',
      jurusanKode: s.jurusanKode,
      kelasId: s.kelasId || '',
      gelombang: s.gelombang || 'Gelombang 1',
      vaManual: s.va || '',
      isManualVa: true
    });
    setModalDaftarOpen(true);
  };

  // Handler Simpan Calon Siswa
  const handleSimpanCalon = (e) => {
    e.preventDefault();
    if (!formCalon.nama.trim()) {
      alert('Nama Calon Siswa wajib diisi!');
      return;
    }

    try {
      if (editCalonId) {
        dataService.updateCalonSiswaPpdb(editCalonId, {
          nama: formCalon.nama.trim(),
          nisn: formCalon.nisn.trim(),
          jenisKelamin: formCalon.jenisKelamin,
          asalSekolah: formCalon.asalSekolah.trim(),
          noHp: formCalon.noHp.trim(),
          jurusanKode: formCalon.jurusanKode,
          kelasId: formCalon.kelasId ? Number(formCalon.kelasId) : null,
          gelombang: formCalon.gelombang,
          va: formCalon.vaManual.trim()
        });
        setNotifPesan({ tipe: 'sukses', teks: `Data calon siswa ${formCalon.nama} berhasil diperbarui!` });
      } else {
        const baru = dataService.tambahCalonSiswaPpdb({
          ...formCalon,
          vaManual: formCalon.isManualVa ? formCalon.vaManual : null
        });
        setNotifPesan({ tipe: 'sukses', teks: `Calon siswa baru ${baru.nama} berhasil didaftarkan dengan No. ${baru.noPendaftaran}!` });
      }

      onUpdateData();
      setModalDaftarOpen(false);
      setTimeout(() => setNotifPesan({ tipe: '', teks: '' }), 4000);
    } catch (err) {
      alert(err.message || 'Gagal menyimpan data calon siswa');
    }
  };

  // Handler Hapus Calon Siswa
  const handleHapusCalon = (s) => {
    if (confirm(`Apakah Anda yakin ingin menghapus data calon siswa "${s.nama}" (${s.noPendaftaran})?`)) {
      dataService.hapusCalonSiswaPpdb(s.id);
      onUpdateData();
      setNotifPesan({ tipe: 'sukses', teks: `Data calon siswa ${s.nama} telah dihapus.` });
      setTimeout(() => setNotifPesan({ tipe: '', teks: '' }), 3500);
    }
  };

  // Handler Buka Modal Bayar PPDB (Dengan Rincian Item Dinamis & Alokasi Pintar)
  const handleBukaBayar = (calon) => {
    setBayarCalonSiswa(calon);
    const calc = dataService.getKalkulasiPpdb(calon);
    const initialSelected = {};
    (calc?.daftarItemTagihan || []).forEach(it => {
      if (it.sisa > 0) {
        initialSelected[it.id] = {
          posId: it.posId,
          nama: it.nama,
          target: it.target,
          sudahMasuk: it.sudahMasuk,
          sisa: it.sisa,
          bayar: it.sisa, // Default: bayar lunas sisa item ini
          isCicilan: false
        };
      }
    });

    setPpdbSelectedItems(initialSelected);
    setUangDiterimaPpdb(calc?.totalSisa > 0 ? String(calc.totalSisa) : '');
    setFormBayar({
      nominal: calc?.totalSisa > 0 ? calc.totalSisa : 0,
      metode: 'TUNAI',
      nomorReferensi: '',
      catatan: `Pembayaran Registrasi PPDB & Uang Masuk - ${calon.nama}`
    });
    setModalBayarOpen(true);
  };

  // Helper Bayar Pas Seluruh Sisa Tagihan PPDB
  const handleBayarPenuhPpdb = () => {
    if (!bayarCalonSiswa) return;
    const calc = dataService.getKalkulasiPpdb(bayarCalonSiswa);
    const newItems = {};
    (calc?.daftarItemTagihan || []).forEach(it => {
      if (it.sisa > 0) {
        newItems[it.id] = {
          posId: it.posId,
          nama: it.nama,
          target: it.target,
          sudahMasuk: it.sudahMasuk,
          sisa: it.sisa,
          bayar: it.sisa,
          isCicilan: false
        };
      }
    });
    setPpdbSelectedItems(newItems);
    setUangDiterimaPpdb(calc?.totalSisa > 0 ? String(calc.totalSisa) : '');
  };

  // Helper Alokasi Otomatis dari Nominal Uang Masuk ke Pos Tagihan Secara Berurutan
  const handleAlokasiOtomatisPpdb = () => {
    if (!bayarCalonSiswa) return;
    const nominalUang = Number(uangDiterimaPpdb);
    if (!nominalUang || nominalUang <= 0) {
      alert('Masukkan nominal uang yang diterima terlebih dahulu (contoh: 500000)!');
      return;
    }
    const calc = dataService.getKalkulasiPpdb(bayarCalonSiswa);
    const alokasi = dataService.alokasikanOtomatis(calc.daftarItemTagihan, nominalUang);
    const newItems = {};
    calc.daftarItemTagihan.forEach(it => {
      const uangItem = alokasi[it.id] || 0;
      if (uangItem > 0) {
        newItems[it.id] = {
          posId: it.posId,
          nama: it.nama,
          target: it.target,
          sudahMasuk: it.sudahMasuk,
          sisa: it.sisa,
          bayar: uangItem,
          isCicilan: uangItem < it.sisa
        };
      }
    });
    setPpdbSelectedItems(newItems);
  };

  const handleTogglePpdbItem = (posId, itemData) => {
    setPpdbSelectedItems(prev => {
      const copy = { ...prev };
      if (copy[posId]) {
        delete copy[posId];
      } else {
        copy[posId] = {
          posId: itemData.posId,
          nama: itemData.nama,
          target: itemData.target,
          sudahMasuk: itemData.sudahMasuk,
          sisa: itemData.sisa,
          bayar: itemData.sisa,
          isCicilan: false
        };
      }
      return copy;
    });
  };

  const handleUpdateNominalItemPpdb = (posId, val, maxSisa) => {
    const nominalAngka = Math.max(0, Math.min(Number(val) || 0, maxSisa));
    setPpdbSelectedItems(prev => {
      if (!prev[posId]) return prev;
      return {
        ...prev,
        [posId]: {
          ...prev[posId],
          bayar: nominalAngka,
          isCicilan: nominalAngka < maxSisa
        }
      };
    });
  };

  const totalDipilihPpdb = Object.values(ppdbSelectedItems).reduce(
    (acc, curr) => acc + Number(curr.bayar || 0),
    0
  );

  // Handler Simpan Transaksi Pembayaran PPDB
  const handleSimpanBayar = (e) => {
    e.preventDefault();
    if (!bayarCalonSiswa) return;
    if (totalDipilihPpdb <= 0) {
      alert('Pilih minimal satu pos pembayaran PPDB dan masukkan nominal bayar/cicilan!');
      return;
    }

    try {
      const namaPetugas = currentUser?.nama || (
        isKasirHana 
          ? 'Kasir TU - Bisnis & Manajemen'
          : isKasirUmi
          ? 'Kasir TU - Pariwisata'
          : isBendahara
          ? 'Bendahara Sekolah'
          : 'Petugas Kasir PPDB'
      );

      const rincianList = Object.values(ppdbSelectedItems).map(it => ({
        posId: it.posId,
        nama: it.nama,
        nominal: Number(it.bayar),
        bayar: Number(it.bayar),
        sisaSetelahBayar: Math.max(0, it.sisa - it.bayar),
        isCicilan: it.isCicilan
      }));

      const kwt = dataService.catatPembayaranPpdb({
        calonSiswaId: bayarCalonSiswa.id,
        nominal: totalDipilihPpdb,
        metode: formBayar.metode,
        nomorReferensi: formBayar.nomorReferensi || (formBayar.metode === 'VA_TRANSFER' ? `VA-${Date.now().toString().slice(-6)}` : null),
        petugas: namaPetugas,
        catatan: formBayar.catatan,
        rincianItems: rincianList
      });

      onUpdateData();
      setModalBayarOpen(false);
      setModalKuitansiPpdb(kwt);
      setNotifPesan({ tipe: 'sukses', teks: `Pembayaran Rp ${totalDipilihPpdb.toLocaleString('id-ID')} berhasil dicatat! Kuitansi siap dicetak.` });
      setTimeout(() => setNotifPesan({ tipe: '', teks: '' }), 4000);
    } catch (err) {
      alert(err.message || 'Terjadi kesalahan saat memproses pembayaran PPDB');
    }
  };

  // Handler Verifikasi VA Calon Siswa (Tombol 'Sudah Bayar' Admin 1-Klik)
  const handleVerifikasiVaCalon = (calon, customNominal) => {
    const calc = dataService.getKalkulasiPpdb(calon);
    const sisa = customNominal !== undefined ? customNominal : (calc ? calc.totalSisa : Math.max(0, (calon.totalTagihan || 0) - (calon.totalBayar || 0)));
    if (sisa <= 0) {
      alert(`Calon siswa "${calon.nama}" sudah lunas seluruh biaya PPDB!`);
      return;
    }

    if (confirm(`Verifikasi pembayaran Virtual Account (VA) untuk calon siswa:\n\nNama: ${calon.nama}\nNo. VA: ${calon.va}\nNominal: Rp ${sisa.toLocaleString('id-ID')}\n\nTandai transaksi ini sebagai SUDAH BAYAR?`)) {
      try {
        const namaPetugas = currentUser?.nama || 'Admin Pusat TU (Verifikasi VA)';
        const kwt = dataService.verifikasiPembayaranVaPpdb({
          calonSiswaId: calon.id,
          nominal: sisa,
          petugas: namaPetugas
        });
        onUpdateData();
        setModalBayarOpen(false);
        setModalKuitansiPpdb(kwt);
        setNotifPesan({
          tipe: 'sukses',
          teks: `Pembayaran VA calon siswa ${calon.nama} sebesar Rp ${sisa.toLocaleString('id-ID')} telah BERHASIL DIVERIFIKASI (Sudah Bayar)!`
        });
        setTimeout(() => setNotifPesan({ tipe: '', teks: '' }), 4500);
      } catch (err) {
        alert(err.message || 'Gagal memverifikasi pembayaran VA');
      }
    }
  };

  // Master Pos Biaya PPDB Handlers (Tambah, Edit, Hapus)
  const handleBukaTambahPosPpdb = () => {
    setEditPosPpdbId(null);
    setFormPosPpdb({ nama: '', nominal: '', wajib: true, keterangan: '' });
    setModalPosPpdbOpen(true);
  };

  const handleBukaEditPosPpdb = (pos) => {
    setEditPosPpdbId(pos.id);
    setFormPosPpdb({
      nama: pos.nama,
      nominal: pos.nominal,
      wajib: !!pos.wajib,
      keterangan: pos.keterangan || ''
    });
    setModalPosPpdbOpen(true);
  };

  const handleSimpanPosPpdb = (e) => {
    e.preventDefault();
    if (!formPosPpdb.nama.trim()) {
      alert('Nama pos tagihan PPDB wajib diisi!');
      return;
    }
    const nom = Number(formPosPpdb.nominal);
    if (isNaN(nom) || nom < 0) {
      alert('Nominal pos tagihan harus angka valid dan tidak negatif!');
      return;
    }

    try {
      if (editPosPpdbId) {
        dataService.updatePosBiayaPpdb(editPosPpdbId, {
          nama: formPosPpdb.nama.trim(),
          nominal: nom,
          wajib: formPosPpdb.wajib,
          keterangan: formPosPpdb.keterangan.trim()
        });
        setNotifPesan({ tipe: 'sukses', teks: `Pos biaya PPDB "${formPosPpdb.nama}" berhasil diperbarui!` });
      } else {
        dataService.tambahPosBiayaPpdb({
          nama: formPosPpdb.nama.trim(),
          nominal: nom,
          wajib: formPosPpdb.wajib,
          keterangan: formPosPpdb.keterangan.trim()
        });
        setNotifPesan({ tipe: 'sukses', teks: `Pos biaya PPDB baru "${formPosPpdb.nama}" berhasil ditambahkan!` });
      }
      onUpdateData();
      setModalPosPpdbOpen(false);
      setTimeout(() => setNotifPesan({ tipe: '', teks: '' }), 4000);
    } catch (err) {
      alert(err.message || 'Gagal menyimpan pos biaya PPDB');
    }
  };

  const handleHapusPosPpdb = (pos) => {
    if (confirm(`Apakah Anda yakin ingin menghapus pos biaya PPDB "${pos.nama}" (Rp ${Number(pos.nominal).toLocaleString('id-ID')})?`)) {
      dataService.hapusPosBiayaPpdb(pos.id);
      onUpdateData();
      setNotifPesan({ tipe: 'sukses', teks: `Pos biaya PPDB "${pos.nama}" berhasil dihapus!` });
      setTimeout(() => setNotifPesan({ tipe: '', teks: '' }), 4000);
    }
  };

  // Handler Tambah Kelas Baru Tingkat X Dinamis
  const handleBukaTambahKelas = () => {
    const defJur = availableJurusan[0]?.kode || 'AKL';
    const rombelTerakhir = data.kelas.filter(k => k.jurusanKode === defJur && k.tingkat === 'X').length + 1;
    setFormKelas({
      tingkat: 'X',
      jurusanKode: defJur,
      rombel: String(rombelTerakhir),
      nama: `X ${defJur} ${rombelTerakhir}`,
      waliKelas: ''
    });
    setModalTambahKelasOpen(true);
  };

  const handleSimpanKelasBaru = (e) => {
    e.preventDefault();
    if (!formKelas.nama.trim()) {
      alert('Nama kelas wajib diisi!');
      return;
    }

    try {
      dataService.tambahKelas({
        ...formKelas,
        waliKelas: formKelas.waliKelas.trim() || 'Belum Ditentukan (Menyusul)'
      });
      onUpdateData();
      setModalTambahKelasOpen(false);
      setNotifPesan({ tipe: 'sukses', teks: `Rombel kelas baru ${formKelas.nama} berhasil dibuka!` });
      setTimeout(() => setNotifPesan({ tipe: '', teks: '' }), 4000);
    } catch (err) {
      alert(err.message || 'Gagal menambahkan kelas baru');
    }
  };

  // Handler Promosikan Calon Siswa ke Siswa Aktif
  const handlePromosikanSiswa = (e) => {
    e.preventDefault();
    if (!modalPromosiOpen) return;
    const kelasTargetId = e.target.kelasTarget.value;
    if (!kelasTargetId) {
      alert('Pilih kelas target rombel untuk siswa ini!');
      return;
    }

    try {
      const siswaBaru = dataService.promosikanSiswaPpdbKeAktif(
        modalPromosiOpen.id,
        kelasTargetId,
        e.target.nisBaru?.value
      );
      onUpdateData();
      setModalPromosiOpen(null);
      alert(`Selamat! Calon siswa "${siswaBaru.nama}" telah resmi dipromosikan menjadi SISWA AKTIF di kelas ${data.kelas.find(k => k.id === Number(kelasTargetId))?.nama} dengan NIS ${siswaBaru.nis}!`);
    } catch (err) {
      alert(err.message || 'Gagal mempromosikan siswa');
    }
  };

  // Handler Ekspor Excel Data PPDB
  const handleEksporExcel = () => {
    const dataRows = filteredCalon.map((s, idx) => ({
      'No': idx + 1,
      'No Pendaftaran': s.noPendaftaran,
      'NISN': s.nisn || '-',
      'Nama Calon Siswa': s.nama,
      'L/P': s.jenisKelamin,
      'Asal Sekolah': s.asalSekolah,
      'No. WhatsApp': s.noHp || '-',
      'Jurusan': s.jurusanKode,
      'Virtual Account (VA)': s.va,
      'Gelombang': s.gelombang,
      'Total Biaya': s.totalTagihan,
      'Total Terbayar': s.totalBayar,
      'Sisa Tagihan': Math.max(0, s.totalTagihan - s.totalBayar),
      'Status Bayar': s.statusBayar,
      'Status Siswa': s.statusFinal === 'RESMI_AKTIF' ? 'SUDAH AKTIF' : 'CALON SISWA'
    }));

    const ws = XLSX.utils.json_to_sheet(dataRows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Data_PPDB_SITAMPAN');
    XLSX.writeFile(wb, `Rekap_PPDB_${data.sekolah.nama.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner Modul Persiapan PPDB */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-indigo-900 text-white p-6 sm:p-7 rounded-3xl shadow-xl border border-white/10 relative overflow-hidden">
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-amber-300 text-slate-950 text-xs px-3 py-1 rounded-full font-black flex items-center gap-1.5 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                MODUL PERSIAPAN PPDB & SISWA BARU
              </span>
              <span className="bg-white/20 text-white text-xs px-2.5 py-1 rounded-full font-bold backdrop-blur-xs">
                Tahun Ajaran {data.masterPpdb?.tahunAjaranPpdb || '2027/2028'}
              </span>
              <span className="bg-emerald-400 text-slate-950 text-xs px-2.5 py-0.5 rounded-full font-black">
                {data.masterPpdb?.gelombangAktif || 'Gelombang 1'} Aktif
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black mt-2.5 tracking-tight flex items-center gap-2.5">
              <span>Penerimaan Peserta Didik Baru (PPDB)</span>
            </h2>

            <p className="text-amber-100 text-xs sm:text-sm font-semibold mt-1 max-w-3xl">
              {isKasirHana
                ? 'Loket Pelayanan PPDB Khusus Kelompok Bisnis & Manajemen: Akuntansi (AKL), Manajemen Perkantoran (MPLB), dan Pemasaran (PM).'
                : isKasirUmi
                ? 'Loket Pelayanan PPDB Khusus Kelompok Pariwisata: Kecantikan & Spa (KSP) dan Perhotelan (HTL).'
                : isBendahara
                ? 'Manajemen Keuangan Penerimaan PPDB, Pembayaran Biaya Masuk Tunai/VA Otomatis, dan Monitoring Setoran Kasir.'
                : 'Pendaftaran Siswa Baru, Pengisian VA Otomatis & Manual, Pencatatan Pembayaran Uang Masuk, dan Pembukaan Kelas X Baru Dinamis.'}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleBukaDaftar}
              className="px-4 py-2.5 bg-white text-slate-900 hover:bg-amber-50 rounded-xl text-xs sm:text-sm font-black shadow-lg transition flex items-center gap-2 cursor-pointer"
            >
              <UserPlus className="w-4 h-4 text-amber-600" />
              + Daftar Siswa Baru
            </button>

            <button
              onClick={handleBukaTambahKelas}
              className="px-3.5 py-2.5 bg-black/25 hover:bg-black/40 text-white rounded-xl text-xs sm:text-sm font-bold border border-white/20 transition flex items-center gap-1.5 cursor-pointer backdrop-blur-xs"
              title="Buka Kelas X Baru Dinamis Sesuai Jumlah Siswa PPDB"
            >
              <Plus className="w-4 h-4" />
              + Rombel Kelas X Baru
            </button>
          </div>
        </div>
      </div>

      {/* Pesan Notifikasi Sukses */}
      {notifPesan.teks && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs sm:text-sm font-bold flex items-center gap-2.5 animate-fadeIn shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{notifPesan.teks}</span>
        </div>
      )}

      {/* 2. Kartu Ringkasan Statistik PPDB (4 Kartu) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Calon Siswa Terdaftar */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Total Pendaftar PPDB</span>
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 font-mono">
            {totalCalon} <span className="text-sm font-medium text-slate-500">Calon Siswa</span>
          </p>
          <p className="text-[11px] text-blue-700 font-bold flex items-center gap-1">
            <Check className="w-3.5 h-3.5" /> {totalLunasCount} siswa telah lunas biaya awal
          </p>
        </div>

        {/* Card 2: Total Uang Masuk PPDB */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Total Uang PPDB Masuk</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-700 font-mono">
            Rp {totalUangMasuk.toLocaleString('id-ID')}
          </p>
          <p className="text-[11px] text-slate-500 font-medium">
            Gabungan setoran Tunai & Virtual Account
          </p>
        </div>

        {/* Card 3: Sisa Tunggakan Uang Masuk */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Sisa Tagihan / Cicilan</span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-amber-600 font-mono">
            Rp {totalSisaTagihan.toLocaleString('id-ID')}
          </p>
          <p className="text-[11px] text-slate-500 font-medium">
            Dapat dicicil selama periode pendaftaran
          </p>
        </div>

        {/* Card 4: Bank Mitra & Status VA Otomatis */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Engine Virtual Account</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <QrCode className="w-4 h-4" />
            </div>
          </div>
          <p className="text-base font-black text-indigo-900 leading-tight">
            {data.masterPpdb?.bankMitraVa || 'Bank BNI / Mandiri / Jateng'}
          </p>
          <p className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Prefix VA: {data.masterPpdb?.kodePrefixVa || '8808'} (Aktif)
          </p>
        </div>
      </div>

      {/* 3. Sub Tabs Navigasi PPDB */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          <button
            onClick={() => setSubTab('calon-siswa')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              subTab === 'calon-siswa'
                ? 'bg-amber-500 text-slate-950 shadow-sm font-black'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Data Calon Siswa Baru ({totalCalon})</span>
          </button>

          <button
            onClick={() => setSubTab('kasir-ppdb')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              subTab === 'kasir-ppdb'
                ? 'bg-amber-500 text-slate-950 shadow-sm font-black'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Loket Pembayaran PPDB</span>
          </button>

          <button
            onClick={() => setSubTab('master-kelas-kuota')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              subTab === 'master-kelas-kuota'
                ? 'bg-amber-500 text-slate-950 shadow-sm font-black'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Building className="w-4 h-4" />
            <span>Master Kelas & Kuota Jurusan</span>
          </button>

          <button
            onClick={() => setSubTab('master-biaya')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              subTab === 'master-biaya'
                ? 'bg-amber-500 text-slate-950 shadow-sm font-black'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Biaya Masuk & Gelombang</span>
          </button>
        </div>

        {subTab === 'calon-siswa' && (
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={handleEksporExcel}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Ekspor Excel</span>
            </button>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* TAB 1: DATA CALON SISWA BARU & VIRTUAL ACCOUNT (VA)       */}
      {/* ========================================================= */}
      {subTab === 'calon-siswa' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden space-y-4 p-4 sm:p-5">
          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div className="flex-1 min-w-[240px] relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Cari Calon Siswa (Nama, No Pendaftaran, NISN, SMP Asal, VA)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-amber-500 transition"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={filterJurusan}
                onChange={(e) => setFilterJurusan(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:ring-2 focus:ring-amber-500"
              >
                <option value="SEMUA">Semua Jurusan</option>
                {availableJurusan.map(j => (
                  <option key={j.id} value={j.kode}>{j.kode} - {j.nama}</option>
                ))}
              </select>

              <select
                value={filterStatusBayar}
                onChange={(e) => setFilterStatusBayar(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:ring-2 focus:ring-amber-500"
              >
                <option value="SEMUA">Semua Status Bayar</option>
                <option value="LUNAS">Lunas</option>
                <option value="CICILAN">Cicilan / Nyicil</option>
                <option value="BELUM_BAYAR">Belum Bayar</option>
              </select>
            </div>
          </div>

          {/* Tabel Calon Siswa */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 text-slate-600 uppercase text-[11px] font-black border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">No. Pendaftaran & Nama</th>
                  <th className="px-4 py-3">Jurusan & Rombel</th>
                  <th className="px-4 py-3">Virtual Account (VA) Bank</th>
                  <th className="px-4 py-3 text-right">Rincian Pembayaran</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3 text-center">Aksi Cepat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCalon.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-12 text-slate-400">
                      <UserPlus className="w-10 h-10 mx-auto mb-2 text-slate-300 opacity-60" />
                      <p className="font-bold text-slate-600">Tidak ada calon siswa ditemukan</p>
                      <p className="text-xs text-slate-400 mt-0.5">Coba sesuaikan kata kunci pencarian atau filter jurusan Anda.</p>
                    </td>
                  </tr>
                ) : (
                  filteredCalon.map((s) => {
                    const jurusanObj = data.jurusan.find(j => j.kode === s.jurusanKode);
                    const kelasObj = data.kelas.find(k => k.id === s.kelasId);
                    const sisa = Math.max(0, (s.totalTagihan || 0) - (s.totalBayar || 0));

                    return (
                      <tr key={s.id} className="hover:bg-amber-50/40 transition">
                        {/* Kolom 1: No Pendaftaran & Nama */}
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs flex-shrink-0">
                              {s.jenisKelamin === 'P' ? '👩' : '👨'}
                            </div>
                            <div>
                              <p className="font-extrabold text-slate-900 leading-tight">{s.nama}</p>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="font-mono text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-bold">
                                  {s.noPendaftaran}
                                </span>
                                <span className="text-[10px] text-slate-400">
                                  NISN: {s.nisn || '-'}
                                </span>
                              </div>
                              <p className="text-[10px] text-slate-500 mt-0.5 truncate max-w-[200px]">
                                Asal: {s.asalSekolah || '-'}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Kolom 2: Jurusan & Rombel */}
                        <td className="px-4 py-3.5">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-black border ${
                            s.jurusanKode === 'AKL' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                            s.jurusanKode === 'MPLB' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                            s.jurusanKode === 'PM' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                            s.jurusanKode === 'KSP' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                            'bg-amber-50 text-amber-800 border-amber-200'
                          }`}>
                            {s.jurusanKode}
                          </span>
                          <p className="text-[11px] font-bold text-slate-700 mt-1">
                            {kelasObj ? kelasObj.nama : (
                              <span className="text-slate-400 font-normal italic">
                                Rombel & Wali Kelas Menyusul
                              </span>
                            )}
                          </p>
                          <span className="text-[10px] text-slate-400">
                            {s.gelombang || 'Gelombang 1'}
                          </span>
                        </td>

                        {/* Kolom 3: Virtual Account (VA) Bank */}
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono font-black text-xs text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-1 rounded-lg">
                              {s.va}
                            </span>
                            <button
                              onClick={() => handleCopyVa(s.va)}
                              className="p-1 text-slate-400 hover:text-indigo-600 rounded hover:bg-indigo-50 transition cursor-pointer"
                              title="Salin Nomor VA"
                            >
                              {copiedVa === s.va ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                          <div className="mt-1 flex items-center gap-1">
                            <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-bold ${
                              s.vaStatus === 'SUDAH_BAYAR' || s.statusBayar === 'LUNAS'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : s.statusBayar === 'CICILAN'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                            }`}>
                              {s.vaStatus === 'SUDAH_BAYAR' || s.statusBayar === 'LUNAS' ? '✓ VA Terverifikasi' : '⏳ Auto VA Aktif'}
                            </span>
                          </div>
                        </td>

                        {/* Kolom 4: Rincian Pembayaran */}
                        <td className="px-4 py-3.5 text-right font-mono">
                          <p className="font-black text-slate-900 text-xs">
                            Masuk: Rp {(s.totalBayar || 0).toLocaleString('id-ID')}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            Total: Rp {(s.totalTagihan || 0).toLocaleString('id-ID')}
                          </p>
                          {sisa > 0 && (
                            <p className="text-[10px] font-bold text-amber-600">
                              Sisa: Rp {sisa.toLocaleString('id-ID')}
                            </p>
                          )}
                        </td>

                        {/* Kolom 5: Status Bayar & Final */}
                        <td className="px-4 py-3.5 text-center">
                          <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            s.statusBayar === 'LUNAS'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : s.statusBayar === 'CICILAN'
                              ? 'bg-amber-100 text-amber-800 border border-amber-300'
                              : 'bg-rose-100 text-rose-800 border border-rose-300'
                          }`}>
                            {s.statusBayar === 'LUNAS' ? '✓ Lunas' : s.statusBayar === 'CICILAN' ? 'Cicilan' : 'Belum Bayar'}
                          </span>

                          {s.statusFinal === 'RESMI_AKTIF' ? (
                            <span className="block mt-1 text-[9px] font-black text-emerald-600">
                              ★ Siswa Aktif
                            </span>
                          ) : (
                            <span className="block mt-1 text-[9px] text-slate-400">
                              Calon PPDB
                            </span>
                          )}
                        </td>

                        {/* Kolom 6: Aksi */}
                        <td className="px-4 py-3.5 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => handleBukaBayar(s)}
                              className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer shadow-xs"
                              title="Bayar Uang Masuk / PPDB (Alokasi Pintar & Cicilan Bebas)"
                            >
                              <CreditCard className="w-3.5 h-3.5" />
                              <span className="hidden md:inline">Bayar</span>
                            </button>

                            {sisa > 0 && (
                              <button
                                onClick={() => handleVerifikasiVaCalon(s)}
                                className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer shadow-xs"
                                title="Verifikasi Mutasi Transfer VA: Tandai Sudah Bayar"
                              >
                                <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
                                <span className="hidden lg:inline">Sudah Bayar</span>
                              </button>
                            )}

                            <button
                              onClick={() => setModalKartuPpdb(s)}
                              className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                              title="Cetak Bukti Pendaftaran & QR VA"
                            >
                              <Printer className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => handleBukaEdit(s)}
                              className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition cursor-pointer"
                              title="Edit Data / Nomor VA"
                            >
                              <Edit className="w-4 h-4" />
                            </button>

                            {s.statusFinal !== 'RESMI_AKTIF' && (
                              <button
                                onClick={() => setModalPromosiOpen(s)}
                                className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition cursor-pointer"
                                title="Promosikan Jadi Siswa Aktif"
                              >
                                <GraduationCap className="w-4 h-4" />
                              </button>
                            )}

                            <button
                              onClick={() => handleHapusCalon(s)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                              title="Hapus Calon Siswa"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: LOKET PEMBAYARAN PPDB (KASIR & RIWAYAT)            */}
      {/* ========================================================= */}
      {subTab === 'kasir-ppdb' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <h3 className="text-base font-black text-slate-900 mb-1 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-amber-600" />
              <span>Loket Penerimaan Pembayaran PPDB</span>
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Pilih calon siswa untuk menginput setoran biaya masuk, formulir pendaftaran, seragam, atau uang pangkal (tunai maupun auto VA).
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {filteredCalon.map(calon => {
                const sisa = Math.max(0, (calon.totalTagihan || 0) - (calon.totalBayar || 0));
                return (
                  <div 
                    key={calon.id}
                    className="p-3.5 rounded-xl border border-slate-200 hover:border-amber-400 hover:shadow-md transition bg-slate-50/50 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold text-slate-500">{calon.noPendaftaran}</span>
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                          {calon.jurusanKode}
                        </span>
                      </div>
                      <p className="font-extrabold text-slate-900 text-sm mt-1">{calon.nama}</p>
                      <p className="text-[11px] text-slate-500">VA: <strong className="font-mono text-indigo-700">{calon.va}</strong></p>
                      <div className="mt-2 text-xs font-mono">
                        <span className="text-slate-500">Terbayar: </span>
                        <strong className="text-emerald-700">Rp {(calon.totalBayar || 0).toLocaleString('id-ID')}</strong>
                      </div>
                      <div className="text-xs font-mono">
                        <span className="text-slate-500">Sisa: </span>
                        <strong className="text-amber-600">Rp {sisa.toLocaleString('id-ID')}</strong>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-3">
                      <button
                        onClick={() => handleBukaBayar(calon)}
                        className="flex-1 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-lg text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Input Bayar</span>
                      </button>
                      {sisa > 0 && (
                        <button
                          onClick={() => handleVerifikasiVaCalon(calon)}
                          className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs transition flex items-center justify-center gap-1 cursor-pointer shadow-xs"
                          title="Verifikasi VA: Tandai Sudah Bayar"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
                          <span>Sudah Bayar</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Riwayat Pembayaran PPDB */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Printer className="w-5 h-5 text-indigo-600" />
              <span>Riwayat Kuitansi & Setoran PPDB Terakhir</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 text-slate-600 uppercase text-[11px] font-bold border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-2.5">No. Kuitansi</th>
                    <th className="px-4 py-2.5">Tanggal</th>
                    <th className="px-4 py-2.5">Nama Calon Siswa</th>
                    <th className="px-4 py-2.5">Metode Bayar</th>
                    <th className="px-4 py-2.5 text-right">Nominal</th>
                    <th className="px-4 py-2.5">Petugas Kasir</th>
                    <th className="px-4 py-2.5 text-center">Cetak</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {(data.riwayatPembayaranPpdb || []).length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center py-6 text-slate-400">
                        Belum ada riwayat transaksi pembayaran PPDB.
                      </td>
                    </tr>
                  ) : (
                    (data.riwayatPembayaranPpdb || []).map((kwt) => (
                      <tr key={kwt.id} className="hover:bg-slate-50 transition">
                        <td className="px-4 py-2.5 font-mono font-bold text-slate-800">{kwt.id}</td>
                        <td className="px-4 py-2.5 text-slate-600">{kwt.tanggal}</td>
                        <td className="px-4 py-2.5 font-bold text-slate-900">{kwt.namaSiswa} ({kwt.jurusanKode})</td>
                        <td className="px-4 py-2.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            kwt.metode === 'VA_TRANSFER'
                              ? 'bg-indigo-100 text-indigo-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {kwt.metode === 'VA_TRANSFER' ? 'Virtual Account' : 'Tunai Kasir'}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 text-right font-mono font-black text-emerald-700">
                          Rp {Number(kwt.total).toLocaleString('id-ID')}
                        </td>
                        <td className="px-4 py-2.5 text-slate-600 text-xs">{kwt.petugas}</td>
                        <td className="px-4 py-2.5 text-center">
                          <button
                            onClick={() => setModalKuitansiPpdb(kwt)}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-indigo-600 hover:text-white rounded-lg text-xs font-bold transition cursor-pointer"
                          >
                            Cetak
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: MASTER KELAS BARU & KUOTA PEMINAT JURUSAN           */}
      {/* ========================================================= */}
      {subTab === 'master-kelas-kuota' && (
        <div className="space-y-6">
          {/* Penjelasan Instruksi Fleksibilitas Kelas PPDB */}
          <div className="bg-amber-50 border border-amber-200 p-4 sm:p-5 rounded-2xl flex items-start gap-3.5">
            <div className="p-2 bg-amber-400 text-slate-950 rounded-xl font-bold flex-shrink-0">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-amber-950 text-sm">
                Manajemen Kelas Dinamis Sesuai Perolehan Calon Siswa Baru
              </h4>
              <p className="text-xs text-amber-900 mt-1 leading-relaxed">
                Karena baru masa pendaftaran PPDB dan sekolah belum mengetahui pasti berapa jumlah kelas yang didapat per jurusan,
                Anda dapat <strong>menambah rombel kelas X baru kapan saja</strong>. Nama guru wali kelas <strong>bisa dikosongkan terlebih dahulu (menyusul)</strong> dan diisi nanti saat pembagian rombel definitif.
              </p>
            </div>
          </div>

          {/* Kuota & Daya Tampung Per Jurusan */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h3 className="text-base font-black text-slate-900">
                Monitoring Kuota & Perolehan Calon Siswa Per Jurusan
              </h3>
              <button
                onClick={handleBukaTambahKelas}
                className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>+ Buka Rombel Kelas X Baru</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableJurusan.map(j => {
                const pendaftarJur = rawCalonList.filter(s => s.jurusanKode === j.kode);
                const targetSiswa = data.masterPpdb?.kuotaJurusan?.[j.kode]?.targetSiswa || 72;
                const perkiraanRombel = Math.ceil(pendaftarJur.length / 36) || 1;
                const persenIsi = Math.min(100, Math.round((pendaftarJur.length / targetSiswa) * 100));

                const kelasTingkatX = data.kelas.filter(k => k.jurusanKode === j.kode && k.tingkat === 'X');

                return (
                  <div key={j.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-black text-sm px-2.5 py-0.5 rounded-lg bg-blue-100 text-blue-900">
                        {j.kode}
                      </span>
                      <span className="text-xs text-slate-500 font-bold">
                        {pendaftarJur.length} / {targetSiswa} Siswa
                      </span>
                    </div>

                    <div>
                      <p className="font-bold text-slate-900 text-xs truncate">{j.nama}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Kelompok: {j.namaKelompok}</p>
                    </div>

                    {/* Progress Bar Kuota */}
                    <div>
                      <div className="flex justify-between text-[11px] font-bold mb-1">
                        <span className="text-slate-500">Keterisian Kuota</span>
                        <span className="text-blue-700">{persenIsi}%</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500"
                          style={{ width: `${persenIsi}%` }}
                        />
                      </div>
                    </div>

                    {/* Rombel Kelas X yang Sudah Dibuka */}
                    <div className="pt-2 border-t border-slate-200 text-xs">
                      <p className="font-bold text-slate-700 text-[11px] uppercase">Rombel Kelas X Aktif:</p>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {kelasTingkatX.length === 0 ? (
                          <span className="text-[11px] text-slate-400 italic">Belum ada kelas X dibuat</span>
                        ) : (
                          kelasTingkatX.map(k => (
                            <span key={k.id} className="px-2 py-0.5 bg-white border border-slate-300 rounded font-bold text-[11px] text-slate-800">
                              {k.nama}
                            </span>
                          ))
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1">
                        Kebutuhan rombel saat ini: ~{perkiraanRombel} kelas (asumsi 36 siswa/kelas).
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 4: MASTER POS BIAYA & GELOMBANG PPDB (CRUD LENGKAP)    */}
      {/* ========================================================= */}
      {subTab === 'master-biaya' && (
        <div className="space-y-6">
          <div className="bg-amber-50 border border-amber-200 p-4 sm:p-5 rounded-2xl flex items-start gap-3.5">
            <div className="p-2 bg-amber-400 text-slate-950 rounded-xl font-bold flex-shrink-0">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-amber-950 text-sm">
                Master Pos Biaya PPDB Fleksibel (Bisa Ditambah, Diedit & Dihapus)
              </h4>
              <p className="text-xs text-amber-900 mt-1 leading-relaxed">
                Setiap pos biaya PPDB (misalnya: <strong>Uang Sekolah bulan Juli 2026, Uang Seragam & Atribut, Iuran OSIS 2026/2027, Iuran Majalah, Iuran Perawatan Sarana, Formulir</strong>, dll.) dapat Anda ubah tarifnya, ditambah pos baru, atau dihapus sewaktu-waktu. Perubahan otomatis menyinkronkan total tagihan seluruh calon siswa baru.
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-amber-600" />
                  <span>Daftar Master Pos Biaya Penerimaan Siswa Baru (PPDB)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Rincian komponen biaya yang dibebankan kepada calon siswa baru pada masa pendaftaran dan registrasi ulang.
                </p>
              </div>

              <button
                onClick={handleBukaTambahPosPpdb}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl text-xs sm:text-sm shadow-md transition flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ Tambah Pos Biaya PPDB Baru</span>
              </button>
            </div>

            {/* Tabel Master Pos Biaya PPDB */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 text-slate-600 uppercase text-[11px] font-black border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 text-center w-12">No</th>
                    <th className="px-4 py-3">Nama Pos Biaya Tagihan</th>
                    <th className="px-4 py-3">Sifat Pembayaran</th>
                    <th className="px-4 py-3 text-right">Tarif Biaya (Rp)</th>
                    <th className="px-4 py-3">Keterangan</th>
                    <th className="px-4 py-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(data.masterPpdb?.posBiayaPpdb || []).length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-8 text-slate-400">
                        Belum ada pos biaya PPDB yang dikonfigurasi. Klik tombol "+ Tambah Pos Biaya PPDB Baru" di atas.
                      </td>
                    </tr>
                  ) : (
                    (data.masterPpdb?.posBiayaPpdb || []).map((pos, idx) => (
                      <tr key={pos.id} className="hover:bg-slate-50/80 transition">
                        <td className="px-4 py-3.5 font-bold text-slate-400 text-center w-12">{idx + 1}</td>
                        <td className="px-4 py-3.5">
                          <p className="font-extrabold text-slate-900">{pos.nama}</p>
                          <span className="font-mono text-[10px] text-slate-400">ID: {pos.id}</span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            pos.wajib
                              ? 'bg-amber-100 text-amber-800 border border-amber-300'
                              : 'bg-blue-100 text-blue-800 border border-blue-300'
                          }`}>
                            {pos.wajib ? '★ Wajib Awal' : 'Dapat Dicicil'}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-right font-mono font-black text-emerald-700 text-sm">
                          Rp {Number(pos.nominal || 0).toLocaleString('id-ID')}
                        </td>
                        <td className="px-4 py-3.5 text-slate-600 text-xs">
                          {pos.keterangan || '-'}
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => handleBukaEditPosPpdb(pos)}
                              className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition cursor-pointer"
                              title="Edit Pos Biaya"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleHapusPosPpdb(pos)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                              title="Hapus Pos Biaya"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                  {/* Total Tagihan PPDB Keseluruhan */}
                  <tr className="bg-amber-50/70 border-t-2 border-slate-300 font-black">
                    <td colSpan="3" className="px-4 py-3.5 text-slate-900 text-right uppercase tracking-wider text-xs">
                      TOTAL BIAYA MASUK KESELURUHAN (TAGIHAN AWAL PPDB):
                    </td>
                    <td className="px-4 py-3.5 text-right font-mono text-emerald-800 text-base">
                      Rp {(data.masterPpdb?.posBiayaPpdb || []).reduce((acc, p) => acc + Number(p.nominal || 0), 0).toLocaleString('id-ID')}
                    </td>
                    <td colSpan="2" className="px-4 py-3.5 text-slate-500 text-xs font-normal italic">
                      Diberikan otomatis kepada seluruh calon siswa baru
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 1: FORM INPUT CALON SISWA BARU & VA               */}
      {/* ========================================================= */}
      {modalDaftarOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-scaleUp max-h-[92vh] flex flex-col">
            <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-5 sm:px-6 py-4 flex items-center justify-between flex-shrink-0">
              <h3 className="font-black text-base flex items-center gap-2">
                <UserPlus className="w-5 h-5" />
                <span>{editCalonId ? 'Edit Data Calon Siswa & VA' : 'Pendaftaran Calon Siswa Baru'}</span>
              </h3>
              <button
                onClick={() => setModalDaftarOpen(false)}
                className="text-white/80 hover:text-white font-bold text-lg p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSimpanCalon} className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Nama Lengkap Calon Siswa *
                </label>
                <input
                  type="text"
                  required
                  value={formCalon.nama}
                  onChange={(e) => setFormCalon({ ...formCalon, nama: e.target.value })}
                  placeholder="Misal: Bagus Setyawan"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-bold focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    NISN (Opsional)
                  </label>
                  <input
                    type="text"
                    value={formCalon.nisn}
                    onChange={(e) => setFormCalon({ ...formCalon, nisn: e.target.value })}
                    placeholder="009..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Jenis Kelamin
                  </label>
                  <select
                    value={formCalon.jenisKelamin}
                    onChange={(e) => setFormCalon({ ...formCalon, jenisKelamin: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm font-bold bg-white focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="L">Laki-laki (L)</option>
                    <option value="P">Perempuan (P)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Asal Sekolah (SMP/MTs)
                  </label>
                  <input
                    type="text"
                    value={formCalon.asalSekolah}
                    onChange={(e) => setFormCalon({ ...formCalon, asalSekolah: e.target.value })}
                    placeholder="SMP Negeri 1..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    No. WhatsApp Ortu/Siswa
                  </label>
                  <input
                    type="text"
                    value={formCalon.noHp}
                    onChange={(e) => setFormCalon({ ...formCalon, noHp: e.target.value })}
                    placeholder="0812..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Pilihan Jurusan Vokasi
                  </label>
                  <select
                    value={formCalon.jurusanKode}
                    onChange={(e) => {
                      const newJur = e.target.value;
                      const newVa = dataService.generateVaPpdb(newJur);
                      setFormCalon({
                        ...formCalon,
                        jurusanKode: newJur,
                        vaManual: formCalon.isManualVa ? formCalon.vaManual : newVa
                      });
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm font-bold bg-white focus:ring-2 focus:ring-amber-500"
                  >
                    {availableJurusan.map(j => (
                      <option key={j.id} value={j.kode}>{j.kode} - {j.nama}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Rombel Kelas <span className="text-slate-400 font-normal lowercase">(bisa menyusul)</span>
                  </label>
                  <select
                    value={formCalon.kelasId}
                    onChange={(e) => setFormCalon({ ...formCalon, kelasId: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm bg-white focus:ring-2 focus:ring-amber-500 font-medium"
                  >
                    <option value="">(Belum Ditentukan / Menyusul)</option>
                    {data.kelas
                      .filter(k => k.jurusanKode === formCalon.jurusanKode && k.tingkat === 'X')
                      .map(k => (
                        <option key={k.id} value={k.id}>{k.nama}</option>
                      ))
                    }
                  </select>
                </div>
              </div>

              {/* Area Nomor Virtual Account (VA) Otomatis / Manual */}
              <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-indigo-950 uppercase flex items-center gap-1.5">
                    <QrCode className="w-4 h-4 text-indigo-700" />
                    <span>Nomor Virtual Account (VA) Bank</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const autoVa = dataService.generateVaPpdb(formCalon.jurusanKode);
                      setFormCalon({ ...formCalon, vaManual: autoVa, isManualVa: false });
                    }}
                    className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer"
                  >
                    ⚡ Auto-Generate Ulang
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    required
                    value={formCalon.vaManual}
                    onChange={(e) => setFormCalon({ ...formCalon, vaManual: e.target.value, isManualVa: true })}
                    placeholder="Contoh: 88082027000101"
                    className="flex-1 px-3 py-2 bg-white border border-indigo-300 rounded-xl text-sm font-mono font-black text-indigo-900 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <p className="text-[11px] text-indigo-800">
                  Nomor VA dibuat <strong>otomatis</strong> oleh sistem SITAMPAN, dan <strong>bisa Anda edit/ketik manual</strong> jika bank mitra sudah memberikan format nomor VA tersendiri.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setModalDaftarOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-black transition cursor-pointer shadow-md"
                >
                  {editCalonId ? 'Simpan Perubahan' : 'Daftarkan Siswa Sekarang'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: INPUT BAYAR KASIR PPDB (ALOKASI & CICILAN PER ITEM) */}
      {/* ========================================================= */}
      {modalBayarOpen && bayarCalonSiswa && (() => {
        const calcPpdb = dataService.getKalkulasiPpdb(bayarCalonSiswa) || { totalTagihan: 0, totalSudahBayar: 0, totalSisa: 0, daftarItemTagihan: [] };
        const sisaSaatIni = calcPpdb.totalSisa;
        const totalUangAkanDibayar = totalDipilihPpdb;
        const kekuranganAkhir = Math.max(0, sisaSaatIni - totalUangAkanDibayar);

        return (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
            <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-scaleUp max-h-[94vh] flex flex-col">
              {/* Header Modal */}
              <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-800 text-white px-5 sm:px-6 py-4 flex items-center justify-between flex-shrink-0">
                <div>
                  <h3 className="font-black text-base sm:text-lg flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-amber-300" />
                    <span>Loket Kasir Pembayaran Calon Siswa PPDB</span>
                  </h3>
                  <p className="text-xs text-emerald-100 mt-0.5">
                    {bayarCalonSiswa.nama} ({bayarCalonSiswa.noPendaftaran}) • Jurusan: <strong>{bayarCalonSiswa.jurusanKode}</strong> • VA: <span className="font-mono">{bayarCalonSiswa.va}</span>
                  </p>
                </div>
                <button
                  onClick={() => setModalBayarOpen(false)}
                  className="text-white/80 hover:text-white font-bold text-lg p-1 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
                {/* 3 KPI Badges Ringkasan Keuangan Siswa PPDB */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Total Biaya Masuk PPDB</span>
                    <span className="text-xl font-black font-mono text-slate-900">
                      Rp {calcPpdb.totalTagihan.toLocaleString('id-ID')}
                    </span>
                  </div>

                  <div className="bg-emerald-50 p-3.5 rounded-2xl border border-emerald-200">
                    <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">Total Sudah Masuk</span>
                    <span className="text-xl font-black font-mono text-emerald-800">
                      Rp {calcPpdb.totalSudahBayar.toLocaleString('id-ID')}
                    </span>
                  </div>

                  <div className="bg-amber-50 p-3.5 rounded-2xl border border-amber-200">
                    <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block">Sisa Kewajiban Tagihan</span>
                    <span className="text-xl font-black font-mono text-amber-700">
                      Rp {sisaSaatIni.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>

                {/* Bilah Alokasi Otomatis & Input Uang Pintar */}
                <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 p-4 rounded-2xl border border-amber-200 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex-1 min-w-[260px]">
                    <label className="block text-xs font-black text-amber-950 uppercase mb-1 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      <span>Input Nominal Uang Diterima (Untuk Alokasi Otomatis)</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-xs font-black text-amber-700 font-mono">Rp</span>
                      <input
                        type="number"
                        min="0"
                        placeholder="Contoh: 500000 atau nominal transfer VA..."
                        value={uangDiterimaPpdb}
                        onChange={(e) => setUangDiterimaPpdb(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 bg-white border border-amber-300 rounded-xl text-sm font-mono font-black text-slate-900 focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap self-end">
                    <button
                      type="button"
                      onClick={handleAlokasiOtomatisPpdb}
                      className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-black shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                      title="Alokasikan otomatis uang yang diterima dari pos atas ke bawah"
                    >
                      <span>🎯 Alokasikan Otomatis</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleBayarPenuhPpdb}
                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                      title="Bayar lunas seluruh pos tagihan yang belum lunas"
                    >
                      <span>⚡ Bayar Pas Sisa Tagihan</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setPpdbSelectedItems({});
                        setUangDiterimaPpdb('');
                      }}
                      className="px-3 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
                    >
                      <span>🔄 Reset</span>
                    </button>
                  </div>
                </div>

                {/* Tabel Rincian Pos Tagihan PPDB (Input Manual / Cicilan per Item & Indikator Sisa Kekurangan) */}
                <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs sm:text-sm">
                      <thead className="bg-slate-100 text-slate-700 text-[11px] font-black border-b border-slate-200 uppercase">
                        <tr>
                          <th className="px-3 py-2.5 text-center w-10">Pilih</th>
                          <th className="px-3 py-2.5">Pos Tagihan PPDB</th>
                          <th className="px-3 py-2.5 text-right">Tarif</th>
                          <th className="px-3 py-2.5 text-right">Sudah Masuk</th>
                          <th className="px-3 py-2.5 text-right">Sisa Piutang</th>
                          <th className="px-3 py-2.5 text-right min-w-[140px]">Bayar Sekarang (Rp)</th>
                          <th className="px-3 py-2.5 text-right">Kekurangan Nanti (Rp)</th>
                          <th className="px-3 py-2.5 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {calcPpdb.daftarItemTagihan.map((it) => {
                          const itemTerpilih = ppdbSelectedItems[it.id];
                          const isChecked = !!itemTerpilih;
                          const bayarSekarang = itemTerpilih ? Number(itemTerpilih.bayar || 0) : 0;
                          const sisaKurangNanti = Math.max(0, it.sisa - bayarSekarang);

                          return (
                            <tr key={it.id} className={isChecked ? 'bg-amber-50/50' : 'hover:bg-slate-50'}>
                              {/* Checkbox */}
                              <td className="px-3 py-2.5 text-center">
                                <input
                                  type="checkbox"
                                  disabled={it.sisa === 0}
                                  checked={isChecked}
                                  onChange={() => handleTogglePpdbItem(it.id, it)}
                                  className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 cursor-pointer disabled:opacity-40"
                                />
                              </td>

                              {/* Nama Pos */}
                              <td className="px-3 py-2.5">
                                <p className="font-extrabold text-slate-900 text-xs sm:text-sm">{it.nama}</p>
                                <span className={`inline-block text-[9px] font-bold px-1.5 py-0.2 rounded mt-0.5 ${
                                  it.wajib ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                                }`}>
                                  {it.wajib ? 'Wajib Awal' : 'Dapat Dicicil'}
                                </span>
                              </td>

                              {/* Tarif */}
                              <td className="px-3 py-2.5 text-right font-mono text-slate-600 text-xs">
                                Rp {it.target.toLocaleString('id-ID')}
                              </td>

                              {/* Sudah Masuk */}
                              <td className="px-3 py-2.5 text-right font-mono text-emerald-700 text-xs font-bold">
                                Rp {it.sudahMasuk.toLocaleString('id-ID')}
                              </td>

                              {/* Sisa Piutang */}
                              <td className="px-3 py-2.5 text-right font-mono font-bold text-amber-700 text-xs">
                                Rp {it.sisa.toLocaleString('id-ID')}
                              </td>

                              {/* Input Bayar Sekarang (Manual / Auto) */}
                              <td className="px-3 py-2.5 text-right">
                                {it.sisa === 0 ? (
                                  <span className="text-xs text-emerald-700 font-bold font-mono">Lunas (Rp 0)</span>
                                ) : (
                                  <input
                                    type="number"
                                    min="0"
                                    max={it.sisa}
                                    value={isChecked ? bayarSekarang : ''}
                                    placeholder="0"
                                    disabled={!isChecked}
                                    onChange={(e) => handleUpdateNominalItemPpdb(it.id, e.target.value, it.sisa)}
                                    className="w-32 px-2.5 py-1 text-right font-mono font-bold text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 bg-white disabled:bg-slate-100"
                                  />
                                )}
                              </td>

                              {/* Kekurangan Nanti (Sisa Kurang Rp) */}
                              <td className="px-3 py-2.5 text-right font-mono">
                                {it.sisa === 0 ? (
                                  <span className="text-slate-400 text-xs">-</span>
                                ) : sisaKurangNanti === 0 ? (
                                  <span className="text-emerald-700 font-black text-xs">Rp 0 (Lunas)</span>
                                ) : (
                                  <span className="text-rose-600 font-bold text-xs">
                                    Rp {sisaKurangNanti.toLocaleString('id-ID')}
                                  </span>
                                )}
                              </td>

                              {/* Status */}
                              <td className="px-3 py-2.5 text-center">
                                <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                                  it.sisa === 0 || (isChecked && sisaKurangNanti === 0)
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : isChecked && bayarSekarang > 0
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-rose-100 text-rose-800'
                                }`}>
                                  {it.sisa === 0 || (isChecked && sisaKurangNanti === 0)
                                    ? 'Lunas'
                                    : isChecked && bayarSekarang > 0
                                    ? 'Cicilan'
                                    : 'Belum'}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                      {/* Baris Total Setoran Saat Ini */}
                      <tfoot className="bg-slate-50 border-t-2 border-slate-300 font-black">
                        <tr>
                          <td colSpan="5" className="px-3 py-3 text-right uppercase tracking-wider text-xs text-slate-800">
                            TOTAL NOMINAL SETORAN INI:
                          </td>
                          <td className="px-3 py-3 text-right font-mono text-emerald-700 text-sm sm:text-base">
                            Rp {totalUangAkanDibayar.toLocaleString('id-ID')}
                          </td>
                          <td className="px-3 py-3 text-right font-mono text-amber-700 text-xs sm:text-sm">
                            Kurang: Rp {kekuranganAkhir.toLocaleString('id-ID')}
                          </td>
                          <td className="px-3 py-3 text-center text-xs text-slate-500">
                            {kekuranganAkhir === 0 ? '✓ Pelunasan' : '★ Cicilan'}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>

                {/* Form Metode Bayar, Referensi & Catatan */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Metode Pembayaran
                    </label>
                    <select
                      value={formBayar.metode}
                      onChange={(e) => setFormBayar({ ...formBayar, metode: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm font-bold bg-white focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="TUNAI">💵 Tunai (Loket Kasir TU)</option>
                      <option value="VA_TRANSFER">⚡ Virtual Account (Auto Transfer Bank)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Nomor Referensi / Bank
                    </label>
                    <input
                      type="text"
                      value={formBayar.nomorReferensi}
                      onChange={(e) => setFormBayar({ ...formBayar, nomorReferensi: e.target.value })}
                      placeholder="Contoh: BNI-VA-..."
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm font-mono focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Keterangan / Catatan Kuitansi
                    </label>
                    <input
                      type="text"
                      value={formBayar.catatan}
                      onChange={(e) => setFormBayar({ ...formBayar, catatan: e.target.value })}
                      placeholder="Cicilan / pelunasan seragam & formulir..."
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Footer Modal Actions */}
              <div className="bg-slate-50 px-5 sm:px-6 py-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 flex-shrink-0">
                <div className="text-xs text-slate-500 font-mono">
                  Sisa Tagihan Nanti: <strong className="text-amber-700">Rp {kekuranganAkhir.toLocaleString('id-ID')}</strong>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setModalBayarOpen(false)}
                    className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-100 transition cursor-pointer"
                  >
                    Batal
                  </button>

                  {/* Tombol Khusus Admin / Petugas: Verifikasi VA 1-Klik */}
                  {sisaSaatIni > 0 && (
                    <button
                      type="button"
                      onClick={() => handleVerifikasiVaCalon(bayarCalonSiswa, totalUangAkanDibayar > 0 ? totalUangAkanDibayar : sisaSaatIni)}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black shadow-md transition flex items-center gap-1.5 cursor-pointer"
                      title="Verifikasi Mutasi Transfer Virtual Account: Tandai Sudah Bayar"
                    >
                      <ShieldCheck className="w-4 h-4 text-amber-300" />
                      <span>✅ Tandai Sudah Bayar (Verifikasi VA)</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleSimpanBayar}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-md transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>💵 Simpan Pembayaran & Cetak Kuitansi</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ========================================================= */}
      {/* MODAL: TAMBAH / EDIT MASTER POS BIAYA PPDB                */}
      {/* ========================================================= */}
      {modalPosPpdbOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-scaleUp">
            <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-5 sm:px-6 py-4 flex items-center justify-between">
              <h3 className="font-black text-base flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                <span>{editPosPpdbId ? 'Edit Pos Biaya PPDB' : 'Tambah Pos Biaya PPDB Baru'}</span>
              </h3>
              <button
                onClick={() => setModalPosPpdbOpen(false)}
                className="text-white/80 hover:text-white font-bold text-lg p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSimpanPosPpdb} className="p-5 sm:p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Nama Pos Biaya PPDB *
                </label>
                <input
                  type="text"
                  required
                  value={formPosPpdb.nama}
                  onChange={(e) => setFormPosPpdb({ ...formPosPpdb, nama: e.target.value })}
                  placeholder="Misal: Uang Seragam, Iuran OSIS, Iuran Majalah..."
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm font-bold focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Nominal Biaya (Rp) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formPosPpdb.nominal}
                  onChange={(e) => setFormPosPpdb({ ...formPosPpdb, nominal: e.target.value })}
                  placeholder="750000"
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm font-mono font-black text-emerald-700 focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Sifat Pembayaran
                </label>
                <select
                  value={formPosPpdb.wajib ? 'true' : 'false'}
                  onChange={(e) => setFormPosPpdb({ ...formPosPpdb, wajib: e.target.value === 'true' })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm font-bold bg-white focus:ring-2 focus:ring-amber-500"
                >
                  <option value="true">★ Wajib Lunas Awal Registrasi</option>
                  <option value="false">Dapat Dicicil Selama Pendaftaran</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Keterangan (Opsional)
                </label>
                <input
                  type="text"
                  value={formPosPpdb.keterangan}
                  onChange={(e) => setFormPosPpdb({ ...formPosPpdb, keterangan: e.target.value })}
                  placeholder="Atribut lengkap, jas almamater, dasi, topi..."
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setModalPosPpdbOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-black transition cursor-pointer shadow-md"
                >
                  {editPosPpdbId ? 'Simpan Perubahan' : 'Tambahkan Pos Biaya'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 3: TAMBAH KELAS X BARU DINAMIS (WALI MENYUSUL)       */}
      {/* ========================================================= */}
      {modalTambahKelasOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-scaleUp max-h-[92vh] flex flex-col">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-5 sm:px-6 py-4 flex items-center justify-between flex-shrink-0">
              <h3 className="font-black text-base flex items-center gap-2">
                <Building className="w-5 h-5" />
                <span>Buka Rombel Kelas X Baru</span>
              </h3>
              <button
                onClick={() => setModalTambahKelasOpen(false)}
                className="text-white/80 hover:text-white font-bold text-lg p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSimpanKelasBaru} className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Jurusan
                  </label>
                  <select
                    value={formKelas.jurusanKode}
                    onChange={(e) => {
                      const jCode = e.target.value;
                      const nextRombel = data.kelas.filter(k => k.jurusanKode === jCode && k.tingkat === 'X').length + 1;
                      setFormKelas({
                        ...formKelas,
                        jurusanKode: jCode,
                        rombel: String(nextRombel),
                        nama: `X ${jCode} ${nextRombel}`
                      });
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm font-bold bg-white focus:ring-2 focus:ring-blue-500"
                  >
                    {availableJurusan.map(j => (
                      <option key={j.id} value={j.kode}>{j.kode} - {j.nama}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Rombel Ke-
                  </label>
                  <input
                    type="text"
                    required
                    value={formKelas.rombel}
                    onChange={(e) => {
                      const r = e.target.value;
                      setFormKelas({
                        ...formKelas,
                        rombel: r,
                        nama: `X ${formKelas.jurusanKode} ${r}`
                      });
                    }}
                    placeholder="1"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm font-bold text-center focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Nama Kelas Otomatis
                </label>
                <input
                  type="text"
                  required
                  value={formKelas.nama}
                  onChange={(e) => setFormKelas({ ...formKelas, nama: e.target.value })}
                  placeholder="Misal: X AKL 2"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Guru Wali Kelas <span className="text-slate-400 font-normal lowercase">(Bisa menyusul)</span>
                </label>
                <input
                  type="text"
                  value={formKelas.waliKelas}
                  onChange={(e) => setFormKelas({ ...formKelas, waliKelas: e.target.value })}
                  placeholder="Bisa dikosongkan (default: Belum Ditentukan)"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Sesuai kebutuhan PPDB, nama wali kelas bisa ditentukan nanti setelah pembagian guru selesai.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setModalTambahKelasOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black transition cursor-pointer shadow-md"
                >
                  Buka Kelas Baru
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 4: PROMOSIKAN KE SISWA AKTIF                        */}
      {/* ========================================================= */}
      {modalPromosiOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-scaleUp">
            <div className="bg-gradient-to-r from-indigo-700 to-purple-800 text-white px-5 sm:px-6 py-4 flex items-center justify-between">
              <h3 className="font-black text-base flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-amber-300" />
                <span>Promosi Siswa PPDB ke Siswa Aktif</span>
              </h3>
              <button
                onClick={() => setModalPromosiOpen(null)}
                className="text-white/80 hover:text-white font-bold text-lg p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePromosikanSiswa} className="p-5 sm:p-6 space-y-4">
              <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200 text-xs">
                <p className="font-extrabold text-indigo-950 text-sm">{modalPromosiOpen.nama}</p>
                <p className="text-indigo-800 mt-0.5">Jurusan: <strong>{modalPromosiOpen.jurusanKode}</strong> • VA: {modalPromosiOpen.va}</p>
                <p className="text-slate-600 mt-1">
                  Status Bayar: <strong className="text-emerald-700">{modalPromosiOpen.statusBayar}</strong>
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Pilih Kelas Definitif Tingkat X *
                </label>
                <select
                  name="kelasTarget"
                  required
                  defaultValue={modalPromosiOpen.kelasId || ''}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-bold bg-white focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">-- Pilih Rombel Kelas X --</option>
                  {data.kelas
                    .filter(k => k.jurusanKode === modalPromosiOpen.jurusanKode && k.tingkat === 'X')
                    .map(k => (
                      <option key={k.id} value={k.id}>{k.nama} (Wali: {k.waliKelas})</option>
                    ))
                  }
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Nomor Induk Siswa (NIS) Baru
                </label>
                <input
                  type="text"
                  name="nisBaru"
                  placeholder="Kosongkan jika ingin auto-generate"
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm font-mono focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setModalPromosiOpen(null)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black transition cursor-pointer shadow-md flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Jadikan Siswa Aktif</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 5: CETAK KUITANSI RESMI PPDB                        */}
      {/* ========================================================= */}
      {modalKuitansiPpdb && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-scaleUp">
            <div className="p-6 space-y-4 printable-area" id="kuitansi-ppdb-print">
              {/* KOP Surat */}
              <div className="border-b-2 border-slate-900 pb-3 text-center relative">
                <p className="text-[10px] uppercase font-bold text-slate-500">{data.sekolah.yayasan}</p>
                <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-tight">
                  {data.sekolah.nama}
                </h3>
                <p className="text-[10px] text-slate-600 mt-0.5">{data.sekolah.alamat} • Telp: {data.sekolah.telp}</p>
              </div>

              <div className="text-center py-1">
                <span className="text-xs font-black uppercase tracking-wider px-3 py-0.5 bg-amber-100 text-amber-950 rounded-full border border-amber-300">
                  TANDA BUKTI PEMBAYARAN PPDB
                </span>
                <p className="font-mono text-xs text-slate-500 font-bold mt-1">No: {modalKuitansiPpdb.id}</p>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Nama Calon Siswa:</span>
                  <strong className="font-extrabold text-slate-900">{modalKuitansiPpdb.namaSiswa}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">No. Pendaftaran:</span>
                  <strong className="font-mono">{modalKuitansiPpdb.noPendaftaran}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Pilihan Jurusan:</span>
                  <span className="font-bold text-blue-700">{modalKuitansiPpdb.jurusanKode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Tanggal Bayar:</span>
                  <span>{modalKuitansiPpdb.tanggal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Metode Bayar:</span>
                  <span className="font-bold">{modalKuitansiPpdb.metode === 'VA_TRANSFER' ? 'Virtual Account' : 'Tunai Kasir'}</span>
                </div>
              </div>

              {/* Rincian Pos */}
              <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                <table className="w-full">
                  <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                    <tr>
                      <th className="px-3 py-1.5 text-left">Rincian Pos Biaya</th>
                      <th className="px-3 py-1.5 text-right">Nominal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(modalKuitansiPpdb.rincian || []).map((r, i) => (
                      <tr key={i}>
                        <td className="px-3 py-1.5">{r.nama || r.item || 'Biaya Masuk PPDB'}</td>
                        <td className="px-3 py-1.5 text-right font-mono font-bold">
                          Rp {Number(r.nominal).toLocaleString('id-ID')}
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-slate-50 font-black">
                      <td className="px-3 py-2 text-slate-800">TOTAL SETORAN</td>
                      <td className="px-3 py-2 text-right font-mono text-emerald-700 text-sm">
                        Rp {Number(modalKuitansiPpdb.total).toLocaleString('id-ID')}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between items-end pt-3 text-[11px]">
                <div className="text-center space-y-1">
                  <QrCode className="w-12 h-12 text-slate-800" />
                  <span className="text-[9px] text-slate-400 font-mono">VERIFIKASI SISTEM</span>
                </div>
                <div className="text-center">
                  <p className="text-slate-500">{data.sekolah.alamat?.split(',')[1] || 'Kudus'}, {modalKuitansiPpdb.tanggal}</p>
                  <p className="text-slate-500">Petugas Penerima,</p>
                  <div className="h-10"></div>
                  <p className="font-extrabold text-slate-900 underline">{modalKuitansiPpdb.petugas}</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-end gap-2 no-print">
              <button
                onClick={() => setModalKuitansiPpdb(null)}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-100 transition cursor-pointer"
              >
                Tutup
              </button>
              <button
                onClick={() => window.print()}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black transition cursor-pointer shadow-md flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak Kuitansi</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 6: CETAK BUKTI REGISTRASI PPDB & QR VA             */}
      {/* ========================================================= */}
      {modalKartuPpdb && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-scaleUp">
            <div className="p-6 space-y-4 printable-area">
              <div className="border-b-2 border-slate-900 pb-3 text-center">
                <h3 className="text-sm font-black text-slate-900 uppercase">
                  {data.sekolah.nama}
                </h3>
                <p className="text-[10px] text-slate-500">KARTU REGISTRASI & VIRTUAL ACCOUNT PPDB</p>
              </div>

              <div className="text-center space-y-1">
                <p className="font-mono font-bold text-xs text-slate-400">NO. PENDAFTARAN</p>
                <p className="text-xl font-black font-mono text-slate-900">{modalKartuPpdb.noPendaftaran}</p>
                <span className="inline-block px-3 py-0.5 rounded-full bg-blue-100 text-blue-800 font-black text-xs">
                  {modalKartuPpdb.jurusanKode}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-indigo-50/80 border border-indigo-200 text-center space-y-1">
                <p className="text-[10px] font-black uppercase tracking-wider text-indigo-700">
                  NOMOR VIRTUAL ACCOUNT (TRANSFER BANK)
                </p>
                <p className="text-2xl font-black font-mono text-indigo-950 tracking-wider">
                  {modalKartuPpdb.va}
                </p>
                <p className="text-[10px] text-indigo-800">
                  {data.masterPpdb?.bankMitraVa || 'Bank BNI / Mandiri / Jateng'}
                </p>
              </div>

              <div className="space-y-1 text-xs border border-slate-200 p-3 rounded-xl">
                <div className="flex justify-between">
                  <span className="text-slate-500">Nama Siswa:</span>
                  <strong className="font-bold text-slate-900">{modalKartuPpdb.nama}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">NISN:</span>
                  <span>{modalKartuPpdb.nisn || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Asal Sekolah:</span>
                  <span>{modalKartuPpdb.asalSekolah}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Status Pembayaran:</span>
                  <span className="font-bold text-emerald-700">{modalKartuPpdb.statusBayar}</span>
                </div>
              </div>

              <p className="text-[10px] text-slate-400 text-center italic">
                Simpan kartu ini sebagai bukti pendaftaran resmi dan gunakan nomor VA di atas untuk pembayaran via m-banking atau ATM.
              </p>
            </div>

            <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-end gap-2 no-print">
              <button
                onClick={() => setModalKartuPpdb(null)}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-100 transition cursor-pointer"
              >
                Tutup
              </button>
              <button
                onClick={() => window.print()}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black transition cursor-pointer shadow-md flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak Kartu</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
