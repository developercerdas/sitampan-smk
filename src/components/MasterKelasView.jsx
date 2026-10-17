import React, { useState } from 'react';
import { 
  BookOpen, 
  Plus, 
  Edit, 
  Trash2, 
  CheckCircle2, 
  UserCheck, 
  Users, 
  GraduationCap, 
  Search,
  Filter
} from 'lucide-react';
import { dataService } from '../services/dataService';

export default function MasterKelasView({ data, onUpdateData, setActiveTab }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [pesan, setPesan] = useState({ tipe: '', teks: '' });

  const [filterTingkat, setFilterTingkat] = useState('SEMUA');
  const [filterJurusan, setFilterJurusan] = useState('SEMUA');
  const [searchQuery, setSearchQuery] = useState('');

  const [formData, setFormData] = useState({
    tingkat: 'X',
    jurusanKode: data.jurusan[0]?.kode || 'AKL',
    rombel: '1',
    nama: '',
    waliKelas: ''
  });

  const bukaModalTambah = () => {
    setEditId(null);
    const defJurusan = data.jurusan[0]?.kode || 'AKL';
    setFormData({
      tingkat: 'X',
      jurusanKode: defJurusan,
      rombel: '1',
      nama: `X ${defJurusan} 1`,
      waliKelas: ''
    });
    setModalOpen(true);
  };

  const bukaModalEdit = (k) => {
    setEditId(k.id);
    setFormData({
      tingkat: k.tingkat,
      jurusanKode: k.jurusanKode,
      rombel: k.rombel,
      nama: k.nama,
      waliKelas: k.waliKelas
    });
    setModalOpen(true);
  };

  // Update auto-name saat tingkat / jurusan / rombel berubah di form
  const handleTingkatOrJurusanChange = (field, val) => {
    const updated = { ...formData, [field]: val };
    updated.nama = `${updated.tingkat} ${updated.jurusanKode} ${updated.rombel}`;
    setFormData(updated);
  };

  const handleSimpan = (e) => {
    e.preventDefault();
    if (!formData.nama.trim() || !formData.waliKelas.trim()) {
      alert('Mohon lengkapi Nama Kelas dan Nama Guru Wali Kelas!');
      return;
    }

    try {
      if (editId) {
        dataService.updateKelas(editId, formData);
        setPesan({ tipe: 'sukses', teks: `Data Kelas ${formData.nama} berhasil diperbarui!` });
      } else {
        // Cek duplikasi nama kelas
        if (data.kelas.some((k) => k.nama.toUpperCase() === formData.nama.toUpperCase().trim())) {
          alert(`Nama Kelas "${formData.nama}" sudah ada! Mohon gunakan nomor rombel lain.`);
          return;
        }
        dataService.tambahKelas(formData);
        setPesan({ tipe: 'sukses', teks: `Kelas ${formData.nama} berhasil ditambahkan!` });
      }
      onUpdateData();
      setModalOpen(false);
      setTimeout(() => setPesan({ tipe: '', teks: '' }), 4000);
    } catch (err) {
      alert(err.message || 'Terjadi kesalahan saat menyimpan kelas');
    }
  };

  const handleHapus = (k) => {
    const jmlSiswa = data.siswa.filter((s) => s.kelasId === k.id).length;
    if (jmlSiswa > 0) {
      alert(`Kelas "${k.nama}" tidak dapat dihapus karena masih menampung ${jmlSiswa} siswa aktif!`);
      return;
    }

    if (confirm(`Apakah Anda yakin ingin menghapus kelas "${k.nama}"?`)) {
      try {
        dataService.hapusKelas(k.id);
        onUpdateData();
        setPesan({ tipe: 'sukses', teks: `Kelas ${k.nama} berhasil dihapus!` });
        setTimeout(() => setPesan({ tipe: '', teks: '' }), 4000);
      } catch (err) {
        alert(err.message);
      }
    }
  };

  // Filter kelas
  const filteredKelas = data.kelas.filter((k) => {
    const matchTingkat = filterTingkat === 'SEMUA' || k.tingkat === filterTingkat;
    const matchJurusan = filterJurusan === 'SEMUA' || k.jurusanKode === filterJurusan;
    const matchSearch = 
      k.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      k.waliKelas.toLowerCase().includes(searchQuery.toLowerCase());
    return matchTingkat && matchJurusan && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* 1. Header & Tab Switcher */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-6 rounded-2xl shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-xs">
              <UserCheck className="w-8 h-8 text-emerald-300" />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight">
                Master Rombel Kelas & Penugasan Wali Kelas
              </h2>
              <p className="text-emerald-200 text-sm mt-0.5">
                Kelola rombongan belajar tingkat X, XI, XII dan tentukan penugasan guru Wali Kelas untuk akses buku setoran.
              </p>
            </div>
          </div>

          <button
            onClick={bukaModalTambah}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-md transition self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            Tambah Kelas Baru
          </button>
        </div>

        {/* Tab Switcher Cepat */}
        <div className="mt-6 pt-4 border-t border-emerald-800/60 flex items-center gap-2 flex-wrap text-xs">
          <span className="text-emerald-300 font-semibold mr-1">Navigasi Master:</span>
          <button
            onClick={() => setActiveTab('master-siswa')}
            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition"
          >
            👥 Master Siswa ({data.siswa.length})
          </button>
          <button
            onClick={() => setActiveTab('master-kelas')}
            className="px-3 py-1.5 rounded-lg bg-emerald-500 text-white font-bold shadow-xs"
          >
            🏫 Master Kelas & Wali Kelas ({data.kelas.length})
          </button>
          <button
            onClick={() => setActiveTab('master-jurusan')}
            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition"
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

      {/* 2. Filter & Pencarian Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Cari kelas atau nama wali kelas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-slate-600">Tingkat:</span>
            <select
              value={filterTingkat}
              onChange={(e) => setFilterTingkat(e.target.value)}
              className="px-3 py-1.5 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            >
              <option value="SEMUA">Semua Tingkat</option>
              <option value="X">Kelas X</option>
              <option value="XI">Kelas XI</option>
              <option value="XII">Kelas XII</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-slate-600">Jurusan:</span>
            <select
              value={filterJurusan}
              onChange={(e) => setFilterJurusan(e.target.value)}
              className="px-3 py-1.5 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            >
              <option value="SEMUA">Semua Jurusan</option>
              {data.jurusan.map((j) => (
                <option key={j.id} value={j.kode}>{j.kode} - {j.nama}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 3. Tabel Master Kelas & Wali Kelas */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 text-xs font-bold border-b border-slate-200 uppercase">
              <tr>
                <th className="px-5 py-3.5">Nama Rombel Kelas</th>
                <th className="px-5 py-3.5">Tingkat</th>
                <th className="px-5 py-3.5">Kompetensi Keahlian</th>
                <th className="px-5 py-3.5">Guru Wali Kelas</th>
                <th className="px-5 py-3.5 text-center">Jumlah Siswa</th>
                <th className="px-5 py-3.5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {filteredKelas.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-slate-400 text-xs">
                    Tidak ada rombel kelas yang cocok dengan filter pencarian.
                  </td>
                </tr>
              ) : (
                filteredKelas.map((k) => {
                  const jurusanObj = data.jurusan.find((j) => j.kode === k.jurusanKode);
                  const jmlSiswa = data.siswa.filter((s) => s.kelasId === k.id).length;

                  return (
                    <tr key={k.id} className="hover:bg-slate-50 transition">
                      <td className="px-5 py-3.5">
                        <span className="font-extrabold text-slate-900 bg-slate-100 border border-slate-300 px-2.5 py-1 rounded-lg text-xs">
                          {k.nama}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                          Kelas {k.tingkat}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="text-xs">
                          <p className="font-bold text-slate-900">{k.jurusanKode}</p>
                          <p className="text-[11px] text-slate-500">{jurusanObj?.nama || '-'}</p>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                            {k.waliKelas?.charAt(0) || 'G'}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-xs">{k.waliKelas}</p>
                            <span className="text-[10px] text-slate-400">Guru Wali Kelas</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-100 text-slate-800 font-bold text-xs">
                          <Users className="w-3.5 h-3.5 text-slate-500" />
                          {jmlSiswa} Siswa
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => bukaModalEdit(k)}
                            className="p-1.5 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition"
                            title="Edit Wali Kelas / Kelas"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleHapus(k)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Hapus Kelas"
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

      {/* 4. Modal Form Tambah / Edit Kelas */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-scaleUp max-h-[92vh] flex flex-col">
            <div className="bg-slate-50 border-b border-slate-200 px-5 sm:px-6 py-4 flex items-center justify-between flex-shrink-0">
              <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-emerald-600" />
                {editId ? 'Edit Rombel Kelas & Wali Kelas' : 'Tambah Rombel Kelas Baru'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSimpan} className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Tingkat
                  </label>
                  <select
                    value={formData.tingkat}
                    onChange={(e) => handleTingkatOrJurusanChange('tingkat', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm font-bold bg-white focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="X">Kelas X</option>
                    <option value="XI">Kelas XI</option>
                    <option value="XII">Kelas XII</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Jurusan
                  </label>
                  <select
                    value={formData.jurusanKode}
                    onChange={(e) => handleTingkatOrJurusanChange('jurusanKode', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm font-bold bg-white focus:ring-2 focus:ring-emerald-500"
                  >
                    {data.jurusan.map((j) => (
                      <option key={j.id} value={j.kode}>{j.kode}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Rombel
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.rombel}
                    onChange={(e) => handleTingkatOrJurusanChange('rombel', e.target.value)}
                    placeholder="1"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm font-bold text-center focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Label Nama Kelas Lengkap
                </label>
                <input
                  type="text"
                  required
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  placeholder="Misal: XII PM 1"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Nama Guru Wali Kelas & Gelar
                </label>
                <input
                  type="text"
                  required
                  value={formData.waliKelas}
                  onChange={(e) => setFormData({ ...formData, waliKelas: e.target.value })}
                  placeholder="Misal: Dra. Hj. Siti Handayani, M.Pd"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Nama wali kelas ini akan tertera di portal Wali Kelas dan buku setoran kelas terkait.
                </p>
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
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition"
                >
                  {editId ? 'Simpan Perubahan' : 'Tambah Kelas'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
