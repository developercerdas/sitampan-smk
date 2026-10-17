import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter, 
  CheckCircle2, 
  Smartphone, 
  CreditCard, 
  AlertCircle, 
  Calendar, 
  Phone, 
  GraduationCap,
  ExternalLink
} from 'lucide-react';
import { dataService } from '../services/dataService';

export default function MasterSiswaView({ data, onUpdateData, setActiveTab, onSelectSiswaForSpp }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterJurusan, setFilterJurusan] = useState('SEMUA');
  const [filterKelas, setFilterKelas] = useState('SEMUA');
  const [filterStatus, setFilterStatus] = useState('SEMUA');

  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [pesan, setPesan] = useState({ tipe: '', teks: '' });

  const [formData, setFormData] = useState({
    nis: '',
    nisn: '',
    nama: '',
    tanggalLahir: '2008-01-01',
    kelasId: data.kelas[0]?.id || 1,
    telepon: '',
    va: '',
    status: 'AKTIF',
    spi: 0,
    tunggakanLalu: 0,
    duJuli: 905000
  });

  const bukaModalTambah = () => {
    setEditId(null);
    const defKelas = data.kelas[0]?.id || 1;
    const randomNis = String(Math.floor(12600 + Math.random() * 900));
    setFormData({
      nis: randomNis,
      nisn: `00${randomNis}123`,
      nama: '',
      tanggalLahir: '2008-07-15',
      kelasId: defKelas,
      telepon: '08123456789',
      va: `8808${randomNis}001`,
      status: 'AKTIF',
      spi: 0,
      tunggakanLalu: 0,
      duJuli: 905000
    });
    setModalOpen(true);
  };

  const bukaModalEdit = (s) => {
    setEditId(s.id);
    setFormData({
      nis: s.nis,
      nisn: s.nisn || '',
      nama: s.nama,
      tanggalLahir: s.tanggalLahir || '2008-01-01',
      kelasId: s.kelasId,
      telepon: s.telepon || '',
      va: s.va || '',
      status: s.status || 'AKTIF',
      spi: s.spi || 0,
      tunggakanLalu: s.tunggakanLalu || 0,
      duJuli: s.duJuli || 0
    });
    setModalOpen(true);
  };

  const handleNisChange = (e) => {
    const newNis = e.target.value;
    setFormData((prev) => ({
      ...prev,
      nis: newNis,
      va: `8808${newNis}001`
    }));
  };

  const handleSimpan = (e) => {
    e.preventDefault();
    if (!formData.nis.trim() || !formData.nama.trim()) {
      alert('Mohon lengkapi NIS dan Nama Lengkap Siswa!');
      return;
    }

    try {
      if (editId) {
        dataService.updateSiswa(editId, formData);
        setPesan({ tipe: 'sukses', teks: `Data Siswa ${formData.nama} berhasil diperbarui!` });
      } else {
        if (data.siswa.some((s) => s.nis === formData.nis.trim())) {
          alert(`NIS ${formData.nis} sudah terdaftar pada siswa lain!`);
          return;
        }
        dataService.tambahSiswa(formData);
        setPesan({ tipe: 'sukses', teks: `Siswa baru ${formData.nama} berhasil ditambahkan!` });
      }
      onUpdateData();
      setModalOpen(false);
      setTimeout(() => setPesan({ tipe: '', teks: '' }), 4000);
    } catch (err) {
      alert(err.message || 'Terjadi kesalahan saat menyimpan data siswa');
    }
  };

  const handleHapus = (s) => {
    if (confirm(`Apakah Anda yakin ingin menghapus siswa "${s.nama}" (NIS: ${s.nis})?`)) {
      try {
        dataService.hapusSiswa(s.id);
        onUpdateData();
        setPesan({ tipe: 'sukses', teks: `Siswa ${s.nama} berhasil dihapus!` });
        setTimeout(() => setPesan({ tipe: '', teks: '' }), 4000);
      } catch (err) {
        alert(err.message);
      }
    }
  };

  // Filter Siswa
  const filteredSiswa = data.siswa.filter((s) => {
    const matchJurusan = filterJurusan === 'SEMUA' || s.jurusanKode === filterJurusan;
    const matchKelas = filterKelas === 'SEMUA' || String(s.kelasId) === String(filterKelas);
    const matchStatus = filterStatus === 'SEMUA' || s.status === filterStatus;
    const q = searchQuery.toLowerCase();
    const matchQuery = 
      s.nama.toLowerCase().includes(q) ||
      s.nis.toLowerCase().includes(q) ||
      (s.nisn && s.nisn.toLowerCase().includes(q)) ||
      (s.va && s.va.toLowerCase().includes(q));

    return matchJurusan && matchKelas && matchStatus && matchQuery;
  });

  // Statistik Ringkas
  const totalSiswa = data.siswa.length;
  const totalAktif = data.siswa.filter((s) => s.status === 'AKTIF').length;
  let totalLunas = 0;
  data.siswa.forEach((s) => {
    const calc = dataService.getKalkulasiSiswa(s);
    if (calc.isLunasSmt1) totalLunas++;
  });

  return (
    <div className="space-y-6">
      {/* 1. Header & Tab Switcher Cepat */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 rounded-2xl shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-xs">
              <Users className="w-8 h-8 text-blue-300" />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight">
                Master Data Siswa & Akun Virtual Account (VA)
              </h2>
              <p className="text-blue-200 text-sm mt-0.5">
                Kelola data pokok peserta didik, nomor NIS/NISN, tanggal lahir login ortu, serta nomor Virtual Account bank mitra.
              </p>
            </div>
          </div>

          <button
            onClick={bukaModalTambah}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-xs font-bold shadow-md transition self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            Tambah Siswa Baru
          </button>
        </div>

        {/* Tab Switcher Cepat */}
        <div className="mt-6 pt-4 border-t border-blue-800/60 flex items-center gap-2 flex-wrap text-xs">
          <span className="text-blue-300 font-semibold mr-1">Navigasi Master:</span>
          <button
            onClick={() => setActiveTab('master-siswa')}
            className="px-3 py-1.5 rounded-lg bg-blue-500 text-white font-bold shadow-xs"
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
        </div>
      </div>

      {pesan.teks && (
        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl flex items-center gap-3 text-emerald-800 text-sm font-semibold animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{pesan.teks}</span>
        </div>
      )}

      {/* 2. Stat Badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <p className="text-[11px] font-bold text-slate-500 uppercase">Total Siswa Terdaftar</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{totalSiswa} <span className="text-xs font-normal text-slate-500">Siswa</span></p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <p className="text-[11px] font-bold text-slate-500 uppercase">Status Aktif</p>
          <p className="text-2xl font-black text-blue-600 mt-1">{totalAktif} <span className="text-xs font-normal text-slate-500">Siswa</span></p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <p className="text-[11px] font-bold text-slate-500 uppercase">Lunas Smt. Ini (Raport Aman)</p>
          <p className="text-2xl font-black text-emerald-600 mt-1">{totalLunas} <span className="text-xs font-normal text-slate-500">Siswa</span></p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <p className="text-[11px] font-bold text-slate-500 uppercase">Ada Tunggakan</p>
          <p className="text-2xl font-black text-amber-600 mt-1">{totalSiswa - totalLunas} <span className="text-xs font-normal text-slate-500">Siswa</span></p>
        </div>
      </div>

      {/* 3. Bar Filter & Pencarian */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col lg:flex-row items-center justify-between gap-3">
        <div className="relative w-full lg:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Cari nama, NIS, NISN, atau no VA..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap w-full lg:w-auto">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-slate-600">Jurusan:</span>
            <select
              value={filterJurusan}
              onChange={(e) => setFilterJurusan(e.target.value)}
              className="px-2.5 py-1.5 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="SEMUA">Semua Jurusan</option>
              {data.jurusan.map((j) => (
                <option key={j.id} value={j.kode}>{j.kode}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-slate-600">Kelas:</span>
            <select
              value={filterKelas}
              onChange={(e) => setFilterKelas(e.target.value)}
              className="px-2.5 py-1.5 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="SEMUA">Semua Kelas</option>
              {data.kelas.map((k) => (
                <option key={k.id} value={k.id}>{k.nama}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-slate-600">Status:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-2.5 py-1.5 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="SEMUA">Semua Status</option>
              <option value="AKTIF">AKTIF</option>
              <option value="LULUS">LULUS (Alumni)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. Tabel Daftar Siswa */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 text-xs font-bold border-b border-slate-200 uppercase">
              <tr>
                <th className="px-5 py-3.5">Identitas Siswa (NIS/NISN)</th>
                <th className="px-5 py-3.5">Nama Peserta Didik</th>
                <th className="px-5 py-3.5">Rombel Kelas</th>
                <th className="px-5 py-3.5">Tgl Lahir (Auth Ortu)</th>
                <th className="px-5 py-3.5">No. Virtual Account</th>
                <th className="px-5 py-3.5 text-center">Status Keuangan</th>
                <th className="px-5 py-3.5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {filteredSiswa.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-slate-400 text-xs">
                    Tidak ada data siswa yang cocok dengan kriteria filter.
                  </td>
                </tr>
              ) : (
                filteredSiswa.map((s) => {
                  const kelasObj = data.kelas.find((k) => k.id === s.kelasId);
                  const calc = dataService.getKalkulasiSiswa(s);

                  return (
                    <tr key={s.id} className="hover:bg-slate-50 transition">
                      <td className="px-5 py-3.5">
                        <span className="font-extrabold text-slate-900 bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-lg text-xs">
                          {s.nis}
                        </span>
                        {s.nisn && (
                          <span className="block text-[10px] text-slate-400 mt-0.5">
                            NISN: {s.nisn}
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="font-extrabold text-slate-900 text-sm">{s.nama}</p>
                        <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3 text-slate-400" />
                          {s.telepon || '-'}
                        </p>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="font-bold text-slate-800 text-xs">
                          {kelasObj?.nama || s.tingkat}
                        </span>
                        <span className="block text-[10px] text-slate-400">
                          {s.jurusanKode}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-xs text-slate-700">
                        <span className="inline-flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-md font-mono text-[11px]">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          {s.tanggalLahir || '-'}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="font-mono text-xs font-bold text-slate-800 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-md">
                          {s.va || '-'}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        {calc.isLunasSmt1 ? (
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            Lunas Smt. 1
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                            Kurang Rp {calc.totalTunggakanAktif.toLocaleString('id-ID')}
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => {
                              if (onSelectSiswaForSpp) onSelectSiswaForSpp(s.id);
                              setActiveTab('kartu-spp');
                            }}
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="Buka Kartu SPP Siswa"
                          >
                            <Smartphone className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => bukaModalEdit(s)}
                            className="p-1.5 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition"
                            title="Edit Data Siswa"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleHapus(s)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Hapus Siswa"
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

      {/* 5. Modal Tambah / Edit Siswa */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-scaleUp">
            <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                {editId ? 'Edit Data Peserta Didik' : 'Tambah Peserta Didik Baru'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSimpan} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Nomor Induk Siswa (NIS)
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nis}
                    onChange={handleNisChange}
                    placeholder="Misal: 12650"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm font-bold font-mono focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    NISN Nasional (Opsional)
                  </label>
                  <input
                    type="text"
                    value={formData.nisn}
                    onChange={(e) => setFormData({ ...formData, nisn: e.target.value })}
                    placeholder="Misal: 0071234567"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm font-mono focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Nama Lengkap Siswa
                </label>
                <input
                  type="text"
                  required
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  placeholder="Misal: Budi Santoso Pratama"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Rombel Kelas
                  </label>
                  <select
                    value={formData.kelasId}
                    onChange={(e) => setFormData({ ...formData, kelasId: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm font-bold bg-white focus:ring-2 focus:ring-blue-500"
                  >
                    {data.kelas.map((k) => (
                      <option key={k.id} value={k.id}>{k.nama} ({k.jurusanKode})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Tanggal Lahir (Login Ortu)
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.tanggalLahir}
                    onChange={(e) => setFormData({ ...formData, tanggalLahir: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Nomor Virtual Account (VA)
                  </label>
                  <input
                    type="text"
                    value={formData.va}
                    onChange={(e) => setFormData({ ...formData, va: e.target.value })}
                    placeholder="880812650001"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm font-mono focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    No. Handphone / WhatsApp
                  </label>
                  <input
                    type="text"
                    value={formData.telepon}
                    onChange={(e) => setFormData({ ...formData, telepon: e.target.value })}
                    placeholder="08123456789"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Status Siswa
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm font-semibold bg-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="AKTIF">AKTIF (Siswa Sedang Belajar)</option>
                  <option value="LULUS">LULUS (Alumni)</option>
                  <option value="PINDAH">PINDAH KELUAR</option>
                </select>
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
                  {editId ? 'Simpan Perubahan' : 'Tambah Siswa'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
