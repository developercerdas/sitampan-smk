import React, { useState } from 'react';
import { 
  Settings, 
  Layers, 
  Plus, 
  Check, 
  Trash2, 
  Building, 
  DollarSign,
  AlertCircle 
} from 'lucide-react';

export default function MasterTarifView({ data, onUpdateData }) {
  const [posBiayaList, setPosBiayaList] = useState(data.posBiaya);
  const [jurusanList, setJurusanList] = useState(data.jurusan);
  const [kelasList, setKelasList] = useState(data.kelas);

  // Form Tambah Pos Biaya Baru
  const [namaPosBaru, setNamaPosBaru] = useState('');
  const [kodePosBaru, setKodePosBaru] = useState('');
  const [tipePosBaru, setTipePosBaru] = useState('SEKALI_BAYAR');
  const [nominalBaru, setNominalBaru] = useState('');

  const handleTambahPos = (e) => {
    e.preventDefault();
    if (!namaPosBaru || !nominalBaru) return;

    const kode = kodePosBaru || namaPosBaru.toUpperCase().replace(/\s+/g, '_');
    const newPos = {
      id: kode,
      nama: namaPosBaru,
      tipe: tipePosBaru,
      nominalDefault: Number(nominalBaru)
    };

    const updated = [...posBiayaList, newPos];
    setPosBiayaList(updated);
    data.posBiaya = updated;
    onUpdateData();

    setNamaPosBaru('');
    setKodePosBaru('');
    setNominalBaru('');
    alert('Pos biaya baru berhasil ditambahkan!');
  };

  return (
    <div className="space-y-6">
      {/* Banner Master Tarif */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white p-6 rounded-2xl shadow-md">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-white/10 rounded-xl backdrop-blur-xs">
            <Settings className="w-8 h-8 text-blue-300" />
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-tight">
              Master Tarif & Pos Biaya Sekolah Multi-Jurusan
            </h2>
            <p className="text-slate-300 text-sm mt-0.5">
              Atur tarif berbeda untuk tiap Jurusan (AKL, PM, Pariwisata) dan Tingkat (X, XI, XII). Anda juga bebas menambah pos iuran manual baru.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Kolom Kiri: Form Tambah Pos Biaya Manual Baru (4 Kolom) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <h3 className="font-bold text-slate-800 text-base mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-blue-600" />
              Buat Pos Iuran / Tagihan Baru
            </h3>

            <form onSubmit={handleTambahPos} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                  Nama Pos Tagihan
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Kunjungan Industri / UKK"
                  value={namaPosBaru}
                  onChange={(e) => setNamaPosBaru(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                  Kode Singkat (Opsional)
                </label>
                <input
                  type="text"
                  placeholder="Contoh: UKK_2026"
                  value={kodePosBaru}
                  onChange={(e) => setKodePosBaru(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono uppercase"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                  Tipe Tagihan
                </label>
                <select
                  value={tipePosBaru}
                  onChange={(e) => setTipePosBaru(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                >
                  <option value="SEKALI_BAYAR">Sekali Bayar / Tahunan / Insidental</option>
                  <option value="BULANAN">Bulanan Rutin (Seperti SPP)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                  Nominal Standar (Rp)
                </label>
                <input
                  type="number"
                  placeholder="Contoh: 150000"
                  value={nominalBaru}
                  onChange={(e) => setNominalBaru(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-xs transition"
              >
                + Simpan Pos Tagihan
              </button>
            </form>
          </div>

          {/* Master Jurusan */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <h3 className="font-bold text-slate-800 text-sm mb-3 flex items-center gap-2">
              <Building className="w-4 h-4 text-emerald-600" />
              Program Keahlian (Jurusan) SMK
            </h3>
            <div className="space-y-2">
              {jurusanList.map((j) => (
                <div
                  key={j.id}
                  className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between"
                >
                  <div>
                    <span className="font-mono text-xs font-bold bg-white px-2 py-0.5 rounded border border-slate-300">
                      {j.kode}
                    </span>
                    <p className="text-sm font-semibold text-slate-800 mt-1">{j.nama}</p>
                  </div>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                    Aktif
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Daftar Pos Biaya Saat Ini (8 Kolom) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <h3 className="font-bold text-slate-800 text-base mb-4 flex items-center justify-between">
              <span>Daftar Pos Biaya yang Berlaku (Sesuai Konfigurasi Sekolah)</span>
              <span className="text-xs font-normal text-slate-500">
                Total: {posBiayaList.length} Pos
              </span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-600 text-xs font-bold border-y border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Kode</th>
                    <th className="py-2.5 px-3">Nama Pos Tagihan</th>
                    <th className="py-2.5 px-3">Tipe</th>
                    <th className="py-2.5 px-3 text-right">Nominal Acuan</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {posBiayaList.map((pos) => (
                    <tr key={pos.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-mono font-bold text-blue-700 text-xs">
                        {pos.id}
                      </td>
                      <td className="py-2.5 px-3 font-bold text-slate-800">{pos.nama}</td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            pos.tipe === 'BULANAN'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {pos.tipe === 'BULANAN' ? 'Bulanan' : 'Sekali Bayar'}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                        Rp {Number(pos.nominalDefault || 0).toLocaleString('id-ID')}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                          ✓ Terdaftar
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
