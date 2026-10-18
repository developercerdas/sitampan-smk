import React, { useState } from 'react';
import { 
  Building, 
  Plus, 
  Edit, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Users, 
  BookOpen, 
  Palette, 
  Sparkles,
  School,
  GraduationCap
} from 'lucide-react';
import { dataService } from '../services/dataService';

const PILIHAN_WARNA = [
  { id: 'blue', label: 'Biru', bg: 'bg-blue-100 text-blue-800 border-blue-300' },
  { id: 'emerald', label: 'Hijau Emerald', bg: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  { id: 'purple', label: 'Ungu', bg: 'bg-purple-100 text-purple-800 border-purple-300' },
  { id: 'orange', label: 'Oranye', bg: 'bg-orange-100 text-orange-800 border-orange-300' },
  { id: 'cyan', label: 'Cyan / Toska', bg: 'bg-cyan-100 text-cyan-800 border-cyan-300' },
  { id: 'amber', label: 'Kuning Amber', bg: 'bg-amber-100 text-amber-800 border-amber-300' },
  { id: 'rose', label: 'Merah Rose', bg: 'bg-rose-100 text-rose-800 border-rose-300' }
];

export default function MasterJurusanView({ data, onUpdateData, setActiveTab }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [pesan, setPesan] = useState({ tipe: '', teks: '' });

  const [formData, setFormData] = useState({
    kode: '',
    nama: '',
    warna: 'blue',
    kelompok: 'BISNIS_MANAJEMEN',
    kasirPj: 'Hana'
  });

  const bukaModalTambah = () => {
    setEditId(null);
    setFormData({ kode: '', nama: '', warna: 'blue', kelompok: 'BISNIS_MANAJEMEN', kasirPj: 'Hana' });
    setModalOpen(true);
  };

  const bukaModalEdit = (j) => {
    setEditId(j.id);
    setFormData({
      kode: j.kode,
      nama: j.nama,
      warna: j.warna || 'blue',
      kelompok: j.kelompok || (j.kode === 'KSP' || j.kode === 'HTL' ? 'PARIWISATA' : 'BISNIS_MANAJEMEN'),
      kasirPj: j.kasirPj || (j.kelompok === 'PARIWISATA' || j.kode === 'KSP' || j.kode === 'HTL' ? 'Umi' : 'Hana')
    });
    setModalOpen(true);
  };

  const handleSimpan = (e) => {
    e.preventDefault();
    if (!formData.kode.trim() || !formData.nama.trim()) {
      alert('Mohon lengkapi kode dan nama jurusan!');
      return;
    }

    try {
      if (editId) {
        dataService.updateJurusan(editId, formData);
        setPesan({ tipe: 'sukses', teks: `Jurusan ${formData.kode} berhasil diperbarui!` });
      } else {
        // Cek duplikasi kode
        if (data.jurusan.some((j) => j.kode.toUpperCase() === formData.kode.toUpperCase().trim())) {
          alert(`Kode Jurusan ${formData.kode.toUpperCase()} sudah terdaftar! Gunakan kode lain.`);
          return;
        }
        dataService.tambahJurusan(formData);
        setPesan({ tipe: 'sukses', teks: `Jurusan ${formData.kode} berhasil ditambahkan!` });
      }
      onUpdateData();
      setModalOpen(false);
      setTimeout(() => setPesan({ tipe: '', teks: '' }), 4000);
    } catch (err) {
      alert(err.message || 'Terjadi kesalahan saat menyimpan jurusan');
    }
  };

  const handleHapus = (j) => {
    const jmlKelas = data.kelas.filter((k) => k.jurusanKode === j.kode).length;
    if (jmlKelas > 0) {
      alert(`Jurusan "${j.nama} (${j.kode})" tidak dapat dihapus karena masih digunakan oleh ${jmlKelas} kelas! Hapus atau pindahkan kelas terlebih dahulu.`);
      return;
    }

    if (confirm(`Apakah Anda yakin ingin menghapus jurusan "${j.nama} (${j.kode})"?`)) {
      try {
        dataService.hapusJurusan(j.id);
        onUpdateData();
        setPesan({ tipe: 'sukses', teks: `Jurusan ${j.kode} berhasil dihapus!` });
        setTimeout(() => setPesan({ tipe: '', teks: '' }), 4000);
      } catch (err) {
        alert(err.message);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Navigasi Cepat Tab Master */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white p-6 rounded-2xl shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-xs">
              <GraduationCap className="w-8 h-8 text-purple-300" />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight flex items-center gap-2">
                Master Program Keahlian / Jurusan SMK
              </h2>
              <p className="text-purple-200 text-sm mt-0.5">
                Kelola data kompetensi keahlian kejuruan, kode jurusan, serta identitas warna rombel.
              </p>
            </div>
          </div>

          <button
            onClick={bukaModalTambah}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-purple-500 hover:bg-purple-600 text-white rounded-xl text-xs font-bold shadow-md transition self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            Tambah Jurusan Baru
          </button>
        </div>

        {/* Tab Switcher Cepat */}
        <div className="mt-6 pt-4 border-t border-purple-800/60 flex items-center gap-2 flex-wrap text-xs">
          <span className="text-purple-300 font-semibold mr-1">Navigasi Master:</span>
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
            className="px-3 py-1.5 rounded-lg bg-purple-500 text-white font-bold shadow-xs"
          >
            🎓 Master Jurusan ({data.jurusan.length})
          </button>
        </div>
      </div>

      {pesan.teks && (
        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl flex items-center gap-3 text-emerald-800 text-sm font-semibold animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{pesan.teks}</span>
        </div>
      )}

      {/* 2. Grid Daftar Jurusan */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {data.jurusan.map((j) => {
          const jmlKelas = data.kelas.filter((k) => k.jurusanKode === j.kode).length;
          const jmlSiswa = data.siswa.filter((s) => s.jurusanKode === j.kode).length;
          const warnaObj = PILIHAN_WARNA.find((w) => w.id === j.warna) || PILIHAN_WARNA[0];

          return (
            <div 
              key={j.id} 
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-black uppercase tracking-wider border ${warnaObj.bg}`}>
                      {j.kode}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      (j.kelompok === 'PARIWISATA' || j.kode === 'KSP' || j.kode === 'HTL')
                        ? 'bg-rose-100 text-rose-800 border border-rose-200'
                        : 'bg-blue-100 text-blue-800 border border-blue-200'
                    }`}>
                      {(j.kelompok === 'PARIWISATA' || j.kode === 'KSP' || j.kode === 'HTL') ? '🏖️ Pariwisata' : '💼 BisMan'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => bukaModalEdit(j)}
                      className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                      title="Edit Jurusan"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleHapus(j)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                      title="Hapus Jurusan"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="font-extrabold text-slate-900 text-base leading-snug">
                  {j.nama}
                </h3>
                <div className="mt-2 text-xs flex items-center gap-1.5 text-slate-500 font-medium">
                  <span>Alokasi Loket:</span>
                  <span className={`font-bold px-2 py-0.5 rounded-md text-[11px] ${
                    (j.kelompok === 'PARIWISATA' || j.kode === 'KSP' || j.kode === 'HTL' || j.kasirPj === 'Umi')
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : 'bg-blue-50 text-blue-700 border border-blue-200'
                  }`}>
                    {j.kelompok === 'PARIWISATA' || j.kode === 'KSP' || j.kode === 'HTL' || j.kasirPj === 'Umi' ? 'Loket Pariwisata' : 'Loket Bisnis & Manajemen'}
                  </span>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <p className="text-slate-500 text-[10px] font-bold uppercase">Rombel Kelas</p>
                  <p className="text-slate-900 font-extrabold text-sm">{jmlKelas} Kelas</p>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <p className="text-slate-500 text-[10px] font-bold uppercase">Total Siswa</p>
                  <p className="text-slate-900 font-extrabold text-sm">{jmlSiswa} Siswa</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Modal Form Tambah / Edit Jurusan */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-scaleUp max-h-[92vh] flex flex-col">
            <div className="bg-slate-50 border-b border-slate-200 px-5 sm:px-6 py-4 flex items-center justify-between flex-shrink-0">
              <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-purple-600" />
                {editId ? 'Edit Program Keahlian / Jurusan' : 'Tambah Jurusan Baru'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSimpan} className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Kode Singkatan Jurusan (Contoh: AKL, PM, RPL, TKRO)
                </label>
                <input
                  type="text"
                  required
                  placeholder="Misal: RPL"
                  value={formData.kode}
                  onChange={(e) => setFormData({ ...formData, kode: e.target.value.toUpperCase() })}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-bold uppercase focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Nama Lengkap Kompetensi Keahlian
                </label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Rekayasa Perangkat Lunak"
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              {/* Pembagian Kelompok & Kasir Penanggung Jawab */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Kelompok Bidang
                  </label>
                  <select
                    value={formData.kelompok}
                    onChange={(e) => {
                      const kel = e.target.value;
                      setFormData({
                        ...formData,
                        kelompok: kel,
                        namaKelompok: kel === 'PARIWISATA' ? 'Pariwisata' : 'Bisnis & Manajemen',
                        kasirPj: kel === 'PARIWISATA' ? 'Umi' : 'Hana',
                        warna: kel === 'PARIWISATA' ? 'rose' : 'blue'
                      });
                    }}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-800 focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="BISNIS_MANAJEMEN">💼 Bisnis & Manajemen</option>
                    <option value="PARIWISATA">🏖️ Pariwisata</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Alokasi Loket Kasir
                  </label>
                  <select
                    value={formData.kasirPj}
                    onChange={(e) => setFormData({ ...formData, kasirPj: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-800 focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="Hana">💼 Loket Bisnis & Manajemen</option>
                    <option value="Umi">🏖️ Loket Pariwisata</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                  Pilihan Warna Badge Identitas Jurusan
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {PILIHAN_WARNA.map((w) => (
                    <button
                      type="button"
                      key={w.id}
                      onClick={() => setFormData({ ...formData, warna: w.id })}
                      className={`px-3 py-2 rounded-xl text-xs font-bold border transition text-left flex items-center gap-2 ${
                        formData.warna === w.id 
                          ? 'border-purple-600 ring-2 ring-purple-500/20 bg-purple-50 text-purple-900' 
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span className={`w-3 h-3 rounded-full ${w.bg.split(' ')[0]}`}></span>
                      {w.label}
                    </button>
                  ))}
                </div>
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
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md transition"
                >
                  {editId ? 'Simpan Perubahan' : 'Tambah Jurusan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
