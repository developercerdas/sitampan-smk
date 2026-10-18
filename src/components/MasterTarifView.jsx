import React, { useState } from 'react';
import { 
  Settings, 
  Layers, 
  Plus, 
  Check, 
  Trash2, 
  Building, 
  DollarSign,
  AlertCircle,
  Edit,
  CheckCircle2,
  Table,
  Filter,
  Users,
  UserCheck,
  GraduationCap,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { dataService } from '../services/dataService';

export default function MasterTarifView({ data, onUpdateData, setActiveTab }) {
  const [subTab, setSubTab] = useState('matriks'); // 'matriks' | 'daftar'
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [pesan, setPesan] = useState({ tipe: '', teks: '' });

  // Filter di daftar pos
  const [filterTipe, setFilterTipe] = useState('SEMUA');
  const [filterJurusan, setFilterJurusan] = useState('SEMUA');
  const [filterPeruntukan, setFilterPeruntukan] = useState('SEMUA'); // 'SEMUA' | 'SISWA_AKTIF' | 'PPDB'

  // Modal Tarif Cepat Per Jurusan
  const [modalJurusanOpen, setModalJurusanOpen] = useState(false);
  const [selectedPosForJurusan, setSelectedPosForJurusan] = useState(null);
  const [tempTarifJurusan, setTempTarifJurusan] = useState({});

  // State Form Tambah/Edit Pos Biaya (Dengan Pemilihan Modul Target)
  const [formData, setFormData] = useState({
    id: '',
    nama: '',
    peruntukan: 'SISWA_AKTIF', // 'SISWA_AKTIF' | 'PPDB' | 'KEDUANYA'
    tipe: 'SEKALI_BAYAR',
    nominalDefault: '',
    targetJurusan: 'SEMUA',
    targetTingkat: 'SEMUA',
    wajibPpdb: true,
    keterangan: '',
    bedaPerJurusan: false,
    tarifJurusan: {}
  });

  const bukaModalTambah = (targetAwal = 'SISWA_AKTIF') => {
    setEditId(null);
    const initialTarif = {};
    data.jurusan.forEach((j) => {
      initialTarif[j.kode] = '';
    });

    setFormData({
      id: '',
      nama: '',
      peruntukan: targetAwal,
      tipe: 'SEKALI_BAYAR',
      nominalDefault: '',
      targetJurusan: 'SEMUA',
      targetTingkat: 'SEMUA',
      wajibPpdb: true,
      keterangan: '',
      bedaPerJurusan: false,
      tarifJurusan: initialTarif
    });
    setModalOpen(true);
  };

  const bukaModalEdit = (pos) => {
    setEditId(pos.id);
    const initialTarif = {};
    data.jurusan.forEach((j) => {
      initialTarif[j.kode] = pos.tarifJurusan?.[j.kode] || pos.nominalDefault || pos.nominal || '';
    });

    setFormData({
      id: pos.id,
      nama: pos.nama,
      peruntukan: pos.isPpdb ? 'PPDB' : 'SISWA_AKTIF',
      tipe: pos.tipe || 'SEKALI_BAYAR',
      nominalDefault: pos.nominalDefault !== undefined ? pos.nominalDefault : (pos.nominal || 0),
      targetJurusan: pos.targetJurusan || 'SEMUA',
      targetTingkat: pos.targetTingkat || 'SEMUA',
      wajibPpdb: pos.wajib !== undefined ? !!pos.wajib : true,
      keterangan: pos.keterangan || '',
      bedaPerJurusan: !!(pos.tarifJurusan && Object.keys(pos.tarifJurusan).length > 0),
      tarifJurusan: initialTarif
    });
    setModalOpen(true);
  };

  const handleSimpanPos = (e) => {
    e.preventDefault();
    if (!formData.nama.trim()) {
      alert('Mohon isi nama pos tagihan!');
      return;
    }
    const nominalAngka = Number(formData.nominalDefault) || 0;

    try {
      const payloadTarif = {};
      if (formData.bedaPerJurusan) {
        data.jurusan.forEach((j) => {
          if (formData.tarifJurusan[j.kode]) {
            payloadTarif[j.kode] = Number(formData.tarifJurusan[j.kode]);
          }
        });
      }

      if (editId) {
        if (formData.peruntukan === 'PPDB') {
          dataService.updatePosBiayaPpdb(editId, {
            nama: formData.nama.trim(),
            nominal: nominalAngka,
            wajib: formData.wajibPpdb,
            keterangan: formData.keterangan.trim()
          });
          setPesan({ tipe: 'sukses', teks: `Pos biaya PPDB "${formData.nama}" berhasil diperbarui!` });
        } else {
          dataService.updatePosBiaya(editId, {
            id: formData.id,
            nama: formData.nama.trim(),
            tipe: formData.tipe,
            nominalDefault: nominalAngka,
            targetJurusan: formData.targetJurusan,
            targetTingkat: formData.targetTingkat,
            tarifJurusan: payloadTarif,
            keterangan: formData.keterangan.trim()
          });
          setPesan({ tipe: 'sukses', teks: `Pos biaya Siswa Aktif "${formData.nama}" berhasil diperbarui!` });
        }
      } else {
        if (formData.peruntukan === 'PPDB') {
          dataService.tambahPosBiayaPpdb({
            nama: formData.nama.trim(),
            nominal: nominalAngka,
            wajib: formData.wajibPpdb,
            keterangan: formData.keterangan.trim()
          });
          setPesan({ tipe: 'sukses', teks: `Pos biaya baru Calon Siswa PPDB "${formData.nama}" berhasil dibuat!` });
        } else if (formData.peruntukan === 'SISWA_AKTIF') {
          dataService.tambahPosBiaya({
            id: formData.id,
            nama: formData.nama.trim(),
            tipe: formData.tipe,
            nominalDefault: nominalAngka,
            targetJurusan: formData.targetJurusan,
            targetTingkat: formData.targetTingkat,
            tarifJurusan: payloadTarif,
            keterangan: formData.keterangan.trim()
          });
          setPesan({ tipe: 'sukses', teks: `Pos biaya baru Siswa Aktif "${formData.nama}" berhasil dibuat!` });
        } else if (formData.peruntukan === 'KEDUANYA') {
          dataService.tambahPosBiaya({
            id: formData.id,
            nama: formData.nama.trim(),
            tipe: formData.tipe,
            nominalDefault: nominalAngka,
            targetJurusan: formData.targetJurusan,
            targetTingkat: formData.targetTingkat,
            tarifJurusan: payloadTarif,
            keterangan: formData.keterangan.trim()
          });
          dataService.tambahPosBiayaPpdb({
            nama: formData.nama.trim(),
            nominal: nominalAngka,
            wajib: formData.wajibPpdb,
            keterangan: formData.keterangan.trim()
          });
          setPesan({ tipe: 'sukses', teks: `Pos biaya "${formData.nama}" berhasil dipasang pada Siswa Aktif DAN Calon Siswa PPDB!` });
        }
      }

      onUpdateData();
      setModalOpen(false);
      setTimeout(() => setPesan({ tipe: '', teks: '' }), 4000);
    } catch (err) {
      alert(err.message || 'Terjadi kesalahan saat menyimpan pos biaya');
    }
  };

  const handleHapusPos = (pos) => {
    if (['SPP', 'DU'].includes(pos.id)) {
      alert(`Pos utama ${pos.nama} tidak dapat dihapus karena digunakan pada buku pager dan kuitansi.`);
      return;
    }

    if (confirm(`Apakah Anda yakin ingin menghapus pos biaya "${pos.nama}"?`)) {
      try {
        if (pos.isPpdb) {
          dataService.hapusPosBiayaPpdb(pos.id);
          setPesan({ tipe: 'sukses', teks: `Pos biaya PPDB "${pos.nama}" berhasil dihapus!` });
        } else {
          dataService.hapusPosBiaya(pos.id);
          setPesan({ tipe: 'sukses', teks: `Pos biaya "${pos.nama}" berhasil dihapus!` });
        }
        onUpdateData();
        setTimeout(() => setPesan({ tipe: '', teks: '' }), 4000);
      } catch (err) {
        alert(err.message);
      }
    }
  };

  // Buka Modal Edit Tarif Khusus Jurusan
  const bukaModalEditTarifJurusan = (pos) => {
    setSelectedPosForJurusan(pos);
    const tar = {};
    data.jurusan.forEach((j) => {
      tar[j.kode] = pos.tarifJurusan?.[j.kode] !== undefined ? pos.tarifJurusan[j.kode] : pos.nominalDefault;
    });
    setTempTarifJurusan(tar);
    setModalJurusanOpen(true);
  };

  const handleSimpanTarifJurusan = () => {
    if (!selectedPosForJurusan) return;

    try {
      Object.keys(tempTarifJurusan).forEach((jKode) => {
        dataService.updateTarifJurusan(
          selectedPosForJurusan.id,
          jKode,
          Number(tempTarifJurusan[jKode]) || 0
        );
      });

      onUpdateData();
      setModalJurusanOpen(false);
      setPesan({
        tipe: 'sukses',
        teks: `Tarif per jurusan untuk "${selectedPosForJurusan.nama}" berhasil disinkronkan!`
      });
      setTimeout(() => setPesan({ tipe: '', teks: '' }), 4000);
    } catch (err) {
      alert(err.message);
    }
  };

  // Gabungkan daftar pos biaya Siswa Aktif dan PPDB dengan identitas jelas
  const posBiayaSiswaAktif = (data.posBiaya || []).map(p => ({ ...p, isPpdb: false, peruntukan: 'SISWA_AKTIF' }));
  const posBiayaPpdbList = (data.masterPpdb?.posBiayaPpdb || []).map(p => ({
    ...p,
    isPpdb: true,
    peruntukan: 'PPDB',
    tipe: 'SEKALI_BAYAR',
    nominalDefault: p.nominal,
    targetJurusan: 'SEMUA',
    targetTingkat: 'X'
  }));

  const allCombinedPos = [...posBiayaSiswaAktif, ...posBiayaPpdbList];

  // Filter daftar pos biaya gabungan
  const filteredPosList = allCombinedPos.filter((p) => {
    const matchPeruntukan = filterPeruntukan === 'SEMUA' || 
      (filterPeruntukan === 'SISWA_AKTIF' && !p.isPpdb) || 
      (filterPeruntukan === 'PPDB' && p.isPpdb);
    const matchTipe = filterTipe === 'SEMUA' || p.tipe === filterTipe;
    const matchJurusan = filterJurusan === 'SEMUA' || p.targetJurusan === 'SEMUA' || p.targetJurusan === filterJurusan;
    return matchPeruntukan && matchTipe && matchJurusan;
  });

  return (
    <div className="space-y-6">
      {/* 1. Banner & Navigasi Cepat Master */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white p-6 rounded-2xl shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-xs">
              <DollarSign className="w-8 h-8 text-amber-300" />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight">
                Master Penentuan Tarif Keuangan & Multi-Jurusan SMK
              </h2>
              <p className="text-blue-200 text-sm mt-0.5">
                Tentukan tarif SPP berbeda tiap kompetensi keahlian, dan kelola pos biaya lain-lain (Praktik, UKK, PKL, Seragam) secara leluasa.
              </p>
            </div>
          </div>

          <button
            onClick={bukaModalTambah}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md transition self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            + Buat Pos Biaya Baru
          </button>
        </div>

        {/* Tab Switcher Master Global */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center gap-2 flex-wrap text-xs">
          <span className="text-slate-400 font-semibold mr-1">Navigasi Master:</span>
          {setActiveTab && (
            <>
              <button
                onClick={() => setActiveTab('master-siswa')}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition"
              >
                👥 Master Siswa ({data.siswa.length})
              </button>
              <button
                onClick={() => setActiveTab('master-kelas')}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition"
              >
                🏫 Master Kelas & Wali Kelas ({data.kelas.length})
              </button>
              <button
                onClick={() => setActiveTab('master-jurusan')}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition"
              >
                🎓 Master Jurusan ({data.jurusan.length})
              </button>
            </>
          )}
          <button
            className="px-3 py-1.5 rounded-lg bg-amber-500 text-slate-900 font-extrabold shadow-xs"
          >
            ⚙️ Master Tarif Pos Biaya ({data.posBiaya.length})
          </button>
        </div>
      </div>

      {pesan.teks && (
        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl flex items-center gap-3 text-emerald-800 text-sm font-semibold animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{pesan.teks}</span>
        </div>
      )}

      {/* 2. Sub Tab Switcher: Matriks Tarif vs Kelola Pos */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-3 rounded-2xl shadow-2xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSubTab('matriks')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              subTab === 'matriks'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Table className="w-4 h-4" />
            Matriks Perbandingan Tarif Per Jurusan
          </button>

          <button
            onClick={() => setSubTab('daftar')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              subTab === 'daftar'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-4 h-4" />
            Daftar Seluruh Pos Tagihan & Biaya Lain-Lain ({allCombinedPos.length})
          </button>
        </div>

        <span className="text-xs text-slate-500 font-medium hidden sm:inline">
          {data.jurusan.length} Jurusan Aktif: {data.jurusan.map((j) => j.kode).join(', ')}
        </span>
      </div>

      {/* 3A. TAMPILAN 1: MATRIKS TARIF PER JURUSAN */}
      {subTab === 'matriks' && (
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-start gap-3 text-amber-900 text-xs">
            <Sparkles className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sm">Kemudahan Pengaturan Tarif SMK:</p>
              <p className="mt-0.5 leading-relaxed">
                Tiap jurusan dapat memiliki nominal SPP atau iuran yang berbeda (misal KSP & HTL memiliki biaya praktek spa/kitchen & hotel lebih tinggi). Klik tombol <strong>"Atur Tarif Jurusan"</strong> pada baris pos biaya untuk menyesuaikan nominal tiap jurusan.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-700 text-xs font-bold border-b border-slate-200 uppercase">
                  <tr>
                    <th className="px-5 py-3.5">Nama Pos Tagihan</th>
                    <th className="px-5 py-3.5">Tipe Tagihan</th>
                    <th className="px-5 py-3.5 text-right">Tarif Acuan (Global)</th>
                    {data.jurusan.map((j) => (
                      <th key={j.id} className="px-5 py-3.5 text-right">
                        <span className="inline-block px-2 py-0.5 rounded bg-blue-100 text-blue-900 text-xs font-black">
                          {j.kode}
                        </span>
                      </th>
                    ))}
                    <th className="px-5 py-3.5 text-center">Aksi Cepat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                  {data.posBiaya.map((pos) => {
                    const isBeda = pos.tarifJurusan && Object.keys(pos.tarifJurusan).length > 0;

                    return (
                      <tr key={pos.id} className="hover:bg-slate-50 transition">
                        <td className="px-5 py-3.5">
                          <p className="font-extrabold text-slate-900">{pos.nama}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] font-mono text-slate-400">ID: {pos.id}</span>
                            {pos.targetJurusan !== 'SEMUA' && (
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-100 text-purple-800 font-bold">
                                Khusus {pos.targetJurusan}
                              </span>
                            )}
                            {pos.targetTingkat !== 'SEMUA' && (
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 font-bold">
                                Kls {pos.targetTingkat}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                            pos.tipe === 'BULANAN'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}>
                            {pos.tipe === 'BULANAN' ? 'Bulanan (SPP)' : 'Sekali Bayar'}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right font-mono font-bold text-slate-700">
                          Rp {Number(pos.nominalDefault || 0).toLocaleString('id-ID')}
                        </td>

                        {data.jurusan.map((j) => {
                          const tarifJurusan = pos.tarifJurusan?.[j.kode] !== undefined
                            ? pos.tarifJurusan[j.kode]
                            : pos.nominalDefault;
                          
                          const isCustomized = pos.tarifJurusan?.[j.kode] !== undefined && pos.tarifJurusan[j.kode] !== pos.nominalDefault;

                          return (
                            <td key={j.id} className="px-5 py-3.5 text-right font-mono">
                              <span className={`font-bold ${isCustomized ? 'text-blue-700 font-black' : 'text-slate-800'}`}>
                                Rp {Number(tarifJurusan || 0).toLocaleString('id-ID')}
                              </span>
                              {isCustomized && (
                                <span className="block text-[9px] font-bold text-blue-600">
                                  (Khusus)
                                </span>
                              )}
                            </td>
                          );
                        })}

                        <td className="px-5 py-3.5 text-center">
                          <button
                            onClick={() => bukaModalEditTarifJurusan(pos)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 rounded-xl text-xs font-bold transition border border-slate-200"
                            title="Atur nominal khusus masing-masing jurusan"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            Atur Tarif Jurusan
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 3B. TAMPILAN 2: DAFTAR SELURUH POS BIAYA & BIAYA LAIN-LAIN */}
      {subTab === 'daftar' && (
        <div className="space-y-4">
          {/* Bar Filter */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-600">Peruntukan:</span>
                <select
                  value={filterPeruntukan}
                  onChange={(e) => setFilterPeruntukan(e.target.value)}
                  className="px-3 py-1.5 border border-slate-300 rounded-xl text-xs font-bold focus:outline-none bg-white text-slate-800"
                >
                  <option value="SEMUA">🌐 Semua Pos (Siswa Aktif & PPDB)</option>
                  <option value="SISWA_AKTIF">🎓 Khusus Siswa Aktif (KBM)</option>
                  <option value="PPDB">🌟 Khusus Calon Siswa (PPDB)</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-600">Tipe Pos:</span>
                <select
                  value={filterTipe}
                  onChange={(e) => setFilterTipe(e.target.value)}
                  className="px-3 py-1.5 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none bg-white text-slate-700"
                >
                  <option value="SEMUA">Semua Tipe</option>
                  <option value="BULANAN">Bulanan Rutin</option>
                  <option value="SEKALI_BAYAR">Sekali Bayar / Insidental</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-600">Target Jurusan:</span>
                <select
                  value={filterJurusan}
                  onChange={(e) => setFilterJurusan(e.target.value)}
                  className="px-3 py-1.5 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none bg-white text-slate-700"
                >
                  <option value="SEMUA">Semua Jurusan</option>
                  {data.jurusan.map((j) => (
                    <option key={j.id} value={j.kode}>{j.kode} - {j.nama}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="text-xs font-bold text-slate-500">
              Total {filteredPosList.length} Pos Tagihan Ditemukan
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPosList.map((pos) => {
              const adaTarifKhusus = pos.tarifJurusan && Object.keys(pos.tarifJurusan).length > 0;

              return (
                <div 
                  key={`${pos.isPpdb ? 'ppdb' : 'aktif'}-${pos.id}`}
                  className={`bg-white rounded-2xl border p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between ${
                    pos.isPpdb ? 'border-purple-200 bg-purple-50/15' : 'border-slate-200'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-xs font-black bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                          {pos.id}
                        </span>
                        {pos.isPpdb ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200 flex items-center gap-1">
                            🌟 Calon PPDB
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200 flex items-center gap-1">
                            🎓 Siswa Aktif
                          </span>
                        )}
                      </div>
                      
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        pos.tipe === 'BULANAN'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {pos.isPpdb ? (pos.wajib ? 'Wajib Awal' : 'Dapat Dicicil') : (pos.tipe === 'BULANAN' ? 'Bulanan' : 'Sekali Bayar')}
                      </span>
                    </div>

                    <h4 className="font-extrabold text-slate-900 text-base leading-tight">
                      {pos.nama}
                    </h4>

                    {pos.keterangan && (
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                        {pos.keterangan}
                      </p>
                    )}

                    <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 font-medium">Nominal Acuan:</span>
                        <span className="font-mono font-black text-slate-900">
                          Rp {Number(pos.nominalDefault || 0).toLocaleString('id-ID')}
                        </span>
                      </div>

                      {pos.isPpdb ? (
                        <>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500 font-medium">Sifat Tagihan:</span>
                            <span className={`font-bold ${pos.wajib ? 'text-amber-700' : 'text-emerald-700'}`}>
                              {pos.wajib ? 'Wajib Lunas Saat Daftar Ulang' : 'Bisa Dicicil Bertahap'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500 font-medium">Peruntukan:</span>
                            <span className="font-bold text-purple-700">Calon Peserta Didik Baru</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500 font-medium">Target Jurusan:</span>
                            <span className="font-bold text-slate-800">
                              {pos.targetJurusan === 'SEMUA' ? 'Semua Jurusan' : `Khusus ${pos.targetJurusan}`}
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-slate-500 font-medium">Target Tingkat:</span>
                            <span className="font-bold text-slate-800">
                              {pos.targetTingkat === 'SEMUA' ? 'Semua Tingkat (X, XI, XII)' : `Hanya Kelas ${pos.targetTingkat}`}
                            </span>
                          </div>
                        </>
                      )}

                      {adaTarifKhusus && !pos.isPpdb && (
                        <div className="pt-2 border-t border-dashed border-slate-200">
                          <p className="text-[10px] font-bold text-blue-700 uppercase mb-1">Tarif Khusus Jurusan:</p>
                          <div className="grid grid-cols-2 gap-1 text-[11px] font-mono">
                            {Object.entries(pos.tarifJurusan).map(([jk, nom]) => (
                              <div key={jk} className="bg-blue-50 px-2 py-0.5 rounded text-blue-900 flex justify-between">
                                <span className="font-bold">{jk}:</span>
                                <span>{Number(nom).toLocaleString('id-ID')}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    {!pos.isPpdb ? (
                      <button
                        onClick={() => bukaModalEditTarifJurusan(pos)}
                        className="px-2.5 py-1.5 bg-slate-50 hover:bg-blue-50 hover:text-blue-700 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1 border border-slate-200"
                      >
                        <Table className="w-3.5 h-3.5" />
                        Tarif Jurusan
                      </button>
                    ) : (
                      <span className="text-[11px] font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded-lg">
                        Modul PPDB Online
                      </span>
                    )}

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => bukaModalEdit(pos)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="Edit Pos Tagihan"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      {!['SPP', 'DU', 'PPDB_FORMULIR', 'PPDB_DAFTAR_ULANG'].includes(pos.id) && (
                        <button
                          onClick={() => handleHapusPos(pos)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Hapus Pos Tagihan"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. MODAL TAMBAH / EDIT POS BIAYA */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-scaleUp max-h-[92vh] flex flex-col">
            <div className="bg-slate-50 border-b border-slate-200 px-5 sm:px-6 py-4 flex items-center justify-between flex-shrink-0">
              <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-blue-600" />
                {editId ? 'Edit Pos Tagihan / Biaya' : 'Buat Pos Biaya Baru (Manual)'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSimpanPos} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              {/* PILIHAN PERUNTUKAN / MODUL SASARAN */}
              {!editId ? (
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                    Mau Dipasang Pada Modul Mana? (Peruntukan Biaya)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, peruntukan: 'SISWA_AKTIF' })}
                      className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                        formData.peruntukan === 'SISWA_AKTIF'
                          ? 'border-blue-600 bg-blue-50/70 text-blue-900 ring-2 ring-blue-500'
                          : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xl">🎓</span>
                        {formData.peruntukan === 'SISWA_AKTIF' && (
                          <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                        )}
                      </div>
                      <div>
                        <p className="font-extrabold text-xs">Khusus Siswa Aktif</p>
                        <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">
                          KBM berjalan, Buku Pager, Kartu SPP & Kasir Siswa
                        </p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, peruntukan: 'PPDB' })}
                      className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                        formData.peruntukan === 'PPDB'
                          ? 'border-purple-600 bg-purple-50/70 text-purple-900 ring-2 ring-purple-500'
                          : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xl">🌟</span>
                        {formData.peruntukan === 'PPDB' && (
                          <span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span>
                        )}
                      </div>
                      <div>
                        <p className="font-extrabold text-xs">Khusus Calon PPDB</p>
                        <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">
                          Pendaftaran baru, Formulir, Kasir PPDB & VA Calon
                        </p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, peruntukan: 'KEDUANYA' })}
                      className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                        formData.peruntukan === 'KEDUANYA'
                          ? 'border-emerald-600 bg-emerald-50/70 text-emerald-900 ring-2 ring-emerald-500'
                          : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xl">🔄</span>
                        {formData.peruntukan === 'KEDUANYA' && (
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                        )}
                      </div>
                      <div>
                        <p className="font-extrabold text-xs">Berlaku Keduanya</p>
                        <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">
                          Seragam, OSIS, Majalah, Perawatan Sarana, dll
                        </p>
                      </div>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">Peruntukan Modul:</span>
                  <span className={`px-2.5 py-0.5 rounded-full font-extrabold ${
                    formData.peruntukan === 'PPDB' 
                      ? 'bg-purple-100 text-purple-800 border border-purple-200' 
                      : 'bg-blue-100 text-blue-800 border border-blue-200'
                  }`}>
                    {formData.peruntukan === 'PPDB' ? '🌟 Calon Siswa Baru (PPDB)' : '🎓 Siswa Aktif (KBM)'}
                  </span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Nama Pos Tagihan / Biaya Sekolah
                </label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Uang Seragam Kejuruan / Iuran OSIS / Sarpras"
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Kode Singkat (ID)
                  </label>
                  <input
                    type="text"
                    disabled={!!editId}
                    placeholder={formData.peruntukan === 'PPDB' ? 'Misal: PPDB_SERAGAM' : 'Misal: SERAGAM'}
                    value={formData.id}
                    onChange={(e) => setFormData({ ...formData, id: e.target.value.toUpperCase().replace(/\s+/g, '_') })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm font-mono uppercase bg-slate-50 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Nominal Acuan Standar (Rp)
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="300000"
                    value={formData.nominalDefault}
                    onChange={(e) => setFormData({ ...formData, nominalDefault: e.target.value })}
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm font-mono font-bold focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* JIKA PPDB ATAU KEDUANYA: PILIHAN SIFAT TAGIHAN PPDB */}
              {(formData.peruntukan === 'PPDB' || formData.peruntukan === 'KEDUANYA') && (
                <div className="p-3 bg-purple-50/70 border border-purple-200 rounded-xl space-y-2">
                  <label className="block text-xs font-extrabold text-purple-900 uppercase">
                    Sifat Tagihan di Modul PPDB (Calon Siswa Baru)
                  </label>
                  <select
                    value={formData.wajibPpdb ? 'WAJIB' : 'CICIL'}
                    onChange={(e) => setFormData({ ...formData, wajibPpdb: e.target.value === 'WAJIB' })}
                    className="w-full px-3 py-2 border border-purple-300 rounded-xl text-xs font-bold bg-white text-purple-900"
                  >
                    <option value="WAJIB">Wajib Lunas Saat Daftar Ulang Awal (Prioritas Utama)</option>
                    <option value="CICIL">Dapat Dicicil Bertahap Selama Periode PPDB Berjalan</option>
                  </select>
                  <p className="text-[11px] text-purple-700">
                    Pos ini akan otomatis tampil pada tabel rincian tagihan calon siswa, Kasir PPDB, dan verifikasi VA Calon Siswa Baru.
                  </p>
                </div>
              )}

              {/* JIKA SISWA AKTIF ATAU KEDUANYA: PILIHAN TARGET KBM */}
              {(formData.peruntukan === 'SISWA_AKTIF' || formData.peruntukan === 'KEDUANYA') && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Tipe Tagihan KBM
                      </label>
                      <select
                        value={formData.tipe}
                        onChange={(e) => setFormData({ ...formData, tipe: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm font-semibold bg-white"
                      >
                        <option value="SEKALI_BAYAR">Sekali Bayar / Insidental</option>
                        <option value="BULANAN">Bulanan (Ditagih Tiap Bulan)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Sasaran Tingkat
                      </label>
                      <select
                        value={formData.targetTingkat}
                        onChange={(e) => setFormData({ ...formData, targetTingkat: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm bg-white"
                      >
                        <option value="SEMUA">Semua Tingkat (X, XI, XII)</option>
                        <option value="X">Kelas X Saja</option>
                        <option value="XI">Kelas XI Saja</option>
                        <option value="XII">Kelas XII Saja</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Sasaran Jurusan KBM
                    </label>
                    <select
                      value={formData.targetJurusan}
                      onChange={(e) => setFormData({ ...formData, targetJurusan: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm bg-white"
                    >
                      <option value="SEMUA">Semua Jurusan</option>
                      {data.jurusan.map((j) => (
                        <option key={j.id} value={j.kode}>Khusus {j.kode} ({j.nama})</option>
                      ))}
                    </select>
                  </div>

                  {/* Opsi Tarif Berbeda Tiap Jurusan */}
                  <div className="pt-2 border-t border-slate-200">
                    <label className="flex items-center gap-2 cursor-pointer mb-2">
                      <input
                        type="checkbox"
                        checked={formData.bedaPerJurusan}
                        onChange={(e) => setFormData({ ...formData, bedaPerJurusan: e.target.checked })}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <span className="text-xs font-bold text-slate-800">
                        Tentukan Nominal Berbeda Khusus Tiap Jurusan (KBM)
                      </span>
                    </label>

                    {formData.bedaPerJurusan && (
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2 mt-2">
                        <p className="text-[11px] text-slate-600 font-medium">
                          Masukkan nominal khusus untuk masing-masing jurusan di bawah ini:
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                          {data.jurusan.map((j) => (
                            <div key={j.id} className="bg-white p-2 rounded-lg border border-slate-200">
                              <span className="block text-[11px] font-bold text-slate-700">{j.kode}</span>
                              <div className="relative mt-0.5">
                                <span className="absolute left-2 top-1 text-[11px] text-slate-400 font-bold">Rp</span>
                                <input
                                  type="number"
                                  placeholder={formData.nominalDefault || '0'}
                                  value={formData.tarifJurusan[j.kode] || ''}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setFormData((prev) => ({
                                      ...prev,
                                      tarifJurusan: {
                                        ...prev.tarifJurusan,
                                        [j.kode]: val
                                      }
                                    }));
                                  }}
                                  className="w-full pl-7 pr-2 py-1 text-xs font-mono font-bold border border-slate-300 rounded"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Keterangan / Catatan Tambahan
                </label>
                <textarea
                  rows="2"
                  placeholder="Keterangan peruntukan dana pos tagihan ini..."
                  value={formData.keterangan}
                  onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md transition"
                >
                  {editId ? 'Simpan Perubahan' : 'Tambah Pos Tagihan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. MODAL EDIT CEPAT TARIF JURUSAN */}
      {modalJurusanOpen && selectedPosForJurusan && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-scaleUp max-h-[92vh] flex flex-col">
            <div className="bg-slate-50 border-b border-slate-200 px-5 sm:px-6 py-4 flex items-center justify-between flex-shrink-0">
              <div>
                <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                  <Table className="w-5 h-5 text-blue-600" />
                  Atur Tarif Jurusan
                </h3>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">
                  Pos: {selectedPosForJurusan.nama}
                </p>
              </div>
              <button
                onClick={() => setModalJurusanOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <div className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
              <p className="text-xs text-slate-600">
                Tentukan nominal yang berlaku untuk masing-masing kompetensi keahlian:
              </p>

              <div className="space-y-3">
                {data.jurusan.map((j) => (
                  <div key={j.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3">
                    <div>
                      <span className="font-extrabold text-xs text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-300">
                        {j.kode}
                      </span>
                      <p className="text-xs font-semibold text-slate-700 mt-0.5">{j.nama}</p>
                    </div>

                    <div className="relative w-40">
                      <span className="absolute left-2.5 top-2 text-xs font-bold text-slate-500">Rp</span>
                      <input
                        type="number"
                        value={tempTarifJurusan[j.kode] !== undefined ? tempTarifJurusan[j.kode] : ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setTempTarifJurusan((prev) => ({
                            ...prev,
                            [j.kode]: val
                          }));
                        }}
                        className="w-full pl-8 pr-3 py-1.5 border border-slate-300 rounded-xl text-sm font-mono font-bold bg-white text-right focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalJurusanOpen(false)}
                  className="px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleSimpanTarifJurusan}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md transition"
                >
                  Simpan Tarif Semua Jurusan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
