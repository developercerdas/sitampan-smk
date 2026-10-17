import React, { useState } from 'react';
import { 
  GraduationCap, 
  ArrowRight, 
  CheckSquare, 
  Square, 
  AlertTriangle, 
  CheckCircle2, 
  History, 
  Users 
} from 'lucide-react';
import { dataService } from '../services/dataService';

export default function KenaikanKelasView({ data, onUpdateData }) {
  const [kelasAsalId, setKelasAsalId] = useState(data.kelas[0]?.id || 1);
  const [kelasTujuanId, setKelasTujuanId] = useState(data.kelas[1]?.id || 2);
  const [tahunBaru, setTahunBaru] = useState('2027/2028');
  const [selectedSiswaIds, setSelectedSiswaIds] = useState([]);
  const [pesanSukses, setPesanSukses] = useState('');

  const kelasAsal = data.kelas.find((k) => k.id === Number(kelasAsalId));
  const kelasTujuan = data.kelas.find((k) => k.id === Number(kelasTujuanId));
  const siswaAsal = data.siswa.filter(
    (s) => s.kelasId === Number(kelasAsalId) && s.status === 'AKTIF'
  );

  const toggleSelectSiswa = (id) => {
    setSelectedSiswaIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedSiswaIds.length === siswaAsal.length) {
      setSelectedSiswaIds([]);
    } else {
      setSelectedSiswaIds(siswaAsal.map((s) => s.id));
    }
  };

  const handleProses = (aksi) => {
    if (selectedSiswaIds.length === 0) {
      alert('Pilih minimal satu siswa untuk diproses!');
      return;
    }

    if (
      !confirm(
        `Apakah Anda yakin ingin memproses ${aksi === 'LULUS' ? 'KELULUSAN' : 'KENAIKAN KELAS'} untuk ${selectedSiswaIds.length} siswa terpilih?\n\nCatatan: Sisa tunggakan yang belum lunas akan otomatis disimpan sebagai Saldo Piutang/Tunggakan Lama.`
      )
    ) {
      return;
    }

    const res = dataService.prosesKenaikanKelas({
      kelasAsalId,
      kelasTujuanId,
      siswaIds: selectedSiswaIds,
      aksi,
      tahunAjaranBaru: tahunBaru
    });

    setPesanSukses(
      `Berhasil memproses ${res.totalDiproses} siswa ${aksi === 'LULUS' ? 'menjadi Alumni/Lulus' : `naik ke ${kelasTujuan?.nama}`}. Saldo tunggakan lama telah terakumulasi otomatis!`
    );
    setSelectedSiswaIds([]);
    onUpdateData();

    setTimeout(() => setPesanSukses(''), 6000);
  };

  // Daftar Alumni
  const alumniList = data.siswa.filter((s) => s.status === 'LULUS');

  return (
    <div className="space-y-6">
      {/* Banner Kenaikan Kelas */}
      <div className="bg-gradient-to-r from-purple-800 via-indigo-800 to-purple-900 text-white p-6 rounded-2xl shadow-md">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-white/10 rounded-xl backdrop-blur-xs">
            <GraduationCap className="w-8 h-8 text-purple-200" />
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-tight">
              Sistem Kenaikan Kelas & Kelulusan (Promotion Wizard)
            </h2>
            <p className="text-purple-200 text-sm mt-0.5">
              Otomatis memindahkan rombel siswa ke tingkat berikutnya dan <strong>mengunci sisa tunggakan lama ke kolom piutang tahun lalu</strong> tanpa hilang.
            </p>
          </div>
        </div>
      </div>

      {pesanSukses && (
        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl flex items-center gap-3 text-emerald-800 text-sm font-semibold">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{pesanSukses}</span>
        </div>
      )}

      {/* Form Wizard Pengaturan Kenaikan */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
        <h3 className="font-bold text-slate-800 text-base">
          1. Tentukan Rombongan Belajar Asal & Tujuan
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
              Kelas Saat Ini (Asal)
            </label>
            <select
              value={kelasAsalId}
              onChange={(e) => {
                setKelasAsalId(e.target.value);
                setSelectedSiswaIds([]);
              }}
              className="w-full bg-white border border-slate-200 font-bold text-slate-800 rounded-lg p-2.5 text-sm"
            >
              {data.kelas.map((k) => (
                <option key={k.id} value={k.id}>
                  {k.nama} ({k.tingkat})
                </option>
              ))}
            </select>
            <p className="text-xs text-slate-500 mt-2">
              Total Siswa Aktif: <strong>{siswaAsal.length} orang</strong>
            </p>
          </div>

          <div className="flex justify-center text-slate-400">
            <ArrowRight className="w-8 h-8 hidden md:block text-purple-600 animate-pulse" />
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
              Kelas Baru (Tujuan Kenaikan)
            </label>
            <select
              value={kelasTujuanId}
              onChange={(e) => setKelasTujuanId(e.target.value)}
              className="w-full bg-white border border-slate-200 font-bold text-slate-800 rounded-lg p-2.5 text-sm"
            >
              {data.kelas.map((k) => (
                <option key={k.id} value={k.id}>
                  {k.nama} ({k.tingkat})
                </option>
              ))}
            </select>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs text-slate-500">Tahun Ajaran Baru:</span>
              <input
                type="text"
                value={tahunBaru}
                onChange={(e) => setTahunBaru(e.target.value)}
                className="w-24 text-xs font-bold bg-white border border-slate-200 px-2 py-1 rounded"
              />
            </div>
          </div>
        </div>

        {/* Tabel Siswa yang Akan Diproses */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-bold text-slate-800 text-sm">
              2. Pilih Siswa yang Naik Kelas / Lulus:
            </h4>
            <button
              onClick={selectAll}
              className="text-xs font-semibold text-purple-700 hover:text-purple-900 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-lg transition"
            >
              {selectedSiswaIds.length === siswaAsal.length ? 'Batal Pilih Semua' : 'Pilih Semua Siswa'}
            </button>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden max-h-80 overflow-y-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-600 text-xs font-bold border-b border-slate-200 sticky top-0">
                <tr>
                  <th className="py-2.5 px-3 w-10 text-center">Pilih</th>
                  <th className="py-2.5 px-3">NIS</th>
                  <th className="py-2.5 px-3">Nama Siswa</th>
                  <th className="py-2.5 px-3 text-right">Sisa Tunggakan Saat Ini</th>
                  <th className="py-2.5 px-3 text-center">Status Keuangan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {siswaAsal.map((s) => {
                  const isChecked = selectedSiswaIds.includes(s.id);
                  const calc = dataService.getKalkulasiSiswa(s);

                  return (
                    <tr
                      key={s.id}
                      onClick={() => toggleSelectSiswa(s.id)}
                      className={`cursor-pointer transition ${
                        isChecked ? 'bg-purple-50/70' : 'hover:bg-slate-50'
                      }`}
                    >
                      <td className="py-2 px-3 text-center">
                        {isChecked ? (
                          <CheckSquare className="w-4 h-4 text-purple-600 mx-auto" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-400 mx-auto" />
                        )}
                      </td>
                      <td className="py-2 px-3 font-mono font-medium text-slate-600">{s.nis}</td>
                      <td className="py-2 px-3 font-bold text-slate-900">{s.nama}</td>
                      <td className="py-2 px-3 text-right font-mono font-semibold text-rose-600">
                        {calc.totalTunggakanAktif > 0
                          ? `Rp ${calc.totalTunggakanAktif.toLocaleString('id-ID')}`
                          : 'Rp 0'}
                      </td>
                      <td className="py-2 px-3 text-center">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            calc.isLunasSmt1
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {calc.isLunasSmt1 ? 'LUNAS' : 'Ada Tunggakan'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tombol Eksekusi Aksi */}
        <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            Terpilih: <strong>{selectedSiswaIds.length} dari {siswaAsal.length} siswa</strong>
          </p>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleProses('NAIK_KELAS')}
              className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-bold shadow-md transition cursor-pointer"
            >
              Proses Naik Kelas ke {kelasTujuan?.nama}
            </button>

            <button
              onClick={() => handleProses('LULUS')}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold shadow-md transition cursor-pointer"
            >
              Luluskan Siswa (Jadikan Alumni)
            </button>
          </div>
        </div>
      </div>

      {/* Bagian Audit Alumni & Ijazah */}
      {alumniList.length > 0 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <h3 className="font-bold text-slate-800 text-base mb-3 flex items-center gap-2">
            <History className="w-5 h-5 text-indigo-600" />
            Daftar Alumni / Siswa Lulus (Pengecekan Syarat Ambil Ijazah)
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-600 text-xs font-bold border-y border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">NIS</th>
                  <th className="py-2.5 px-3">Nama Alumni</th>
                  <th className="py-2.5 px-3">Jurusan</th>
                  <th className="py-2.5 px-3 text-right">Sisa Tunggakan Tertahan</th>
                  <th className="py-2.5 px-3 text-center">Status Pengambilan Ijazah</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {alumniList.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50">
                    <td className="py-2 px-3 font-mono text-slate-600">{a.nis}</td>
                    <td className="py-2 px-3 font-bold text-slate-900">{a.nama}</td>
                    <td className="py-2 px-3 text-slate-600">{a.jurusanKode}</td>
                    <td className="py-2 px-3 text-right font-mono font-bold text-rose-600">
                      Rp {Number(a.tunggakanLalu || 0).toLocaleString('id-ID')}
                    </td>
                    <td className="py-2 px-3 text-center">
                      {(a.tunggakanLalu || 0) <= 0 ? (
                        <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                          Bebas Tanggungan (Boleh Ambil Ijazah)
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-rose-800 bg-rose-100 px-2 py-0.5 rounded">
                          Ijazah Ditahan (Wajib Lunasi Tunggakan)
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
