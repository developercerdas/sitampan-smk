import React, { useState } from 'react';
import { 
  CreditCard, 
  Copy, 
  Check, 
  Printer, 
  AlertCircle, 
  CheckCircle2, 
  HelpCircle,
  QrCode
} from 'lucide-react';
import { dataService } from '../services/dataService';
import SchoolLogo from './SchoolLogo';

export default function KartuSppView({ data, currentRole }) {
  // Siswa terpilih (misal Anjana Hilmi dari foto 3 atau Dian Verawati dari foto 2)
  const [selectedSiswaId, setSelectedSiswaId] = useState(data.siswa[0]?.id || 1);
  const [copiedVa, setCopiedVa] = useState(false);

  const siswa = data.siswa.find((s) => s.id === Number(selectedSiswaId));
  const kelas = data.kelas.find((k) => k.id === siswa?.kelasId);
  const kalkulasi = siswa ? dataService.getKalkulasiSiswa(siswa) : null;

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
      {/* Selector Siswa untuk Orang Tua & Admin (Hidden saat cetak) */}
      <div className="no-print bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-slate-500 uppercase">
            Pilih Siswa yang Dilihat:
          </label>
          <select
            value={selectedSiswaId}
            onChange={(e) => setSelectedSiswaId(e.target.value)}
            className="bg-slate-50 border border-slate-200 font-bold text-slate-800 text-sm rounded-xl px-3.5 py-2 focus:ring-2 focus:ring-blue-500"
          >
            {data.siswa.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nama} • NIS: {s.nis} ({data.kelas.find((k) => k.id === s.kelasId)?.nama})
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handlePrint}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-xs transition"
        >
          <Printer className="w-4 h-4" />
          Cetak Kartu SPP Digital
        </button>
      </div>

      {/* Kartu Virtual Account Box (Khusus Orang Tua) */}
      <div className="no-print bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-6 rounded-2xl shadow-lg border border-indigo-800/40">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-300">
              Jalur Pembayaran Virtual Account (VA Transfer)
            </span>
            <p className="text-sm text-slate-300">
              Orang tua/siswa dapat mentransfer langsung dari m-Banking / ATM tanpa perlu antre di sekolah.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <span className="text-2xl sm:text-3xl font-black font-mono tracking-widest text-emerald-400">
                {siswa?.va}
              </span>
              <button
                onClick={handleCopyVa}
                className="flex items-center gap-1 text-xs font-bold bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg border border-white/20 transition cursor-pointer"
              >
                {copiedVa ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedVa ? 'Tersalin!' : 'Salin Nomor VA'}
              </button>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 p-4 rounded-xl text-xs space-y-1">
            <p className="font-bold text-indigo-200">Panduan Transfer VA:</p>
            <p className="text-slate-300">• Bank Tujuan: <strong>{data.sekolah.bankMitra}</strong></p>
            <p className="text-slate-300">• Nama Akun: <strong>SPP-{siswa?.nama.slice(0, 15)}</strong></p>
            <p className="text-emerald-400 font-semibold">✓ Verifikasi instan otomatis lunas 24 jam</p>
          </div>
        </div>
      </div>

      {/* REPRODUKSI KARTU KUNING SPP (Sesuai Foto 3 Dokumen Asli SMK PGRI 1 Mejobo) */}
      <div className="bg-[#fef9c3] p-8 rounded-2xl border-2 border-amber-400 shadow-md text-slate-900 print:m-0 print:border-none print:bg-white">
        {/* Header Kartu Kuning */}
        <div className="flex items-center gap-4 pb-4 border-b-2 border-slate-900">
          <SchoolLogo logoUrl={data.sekolah.logoUrl} className="w-16 h-16" />
          <div className="text-center flex-1">
            <p className="text-xs uppercase font-bold text-slate-700 leading-tight">
              {data.sekolah.yayasan || 'Yayasan Pembina Lembaga Pendidikan Dasar dan Menengah PGRI Jawa Tengah (YPLP DM PGRI JT)'}
            </p>
            <h2 className="text-2xl font-black tracking-tight text-slate-900 uppercase">
              {data.sekolah.nama}
            </h2>
            <p className="text-xs text-slate-700 font-medium leading-tight">
              Terakreditasi: {data.sekolah.akreditasi} • {data.sekolah.alamat}
            </p>
            <div className="inline-block mt-2 bg-amber-200 px-4 py-1 border border-slate-800 rounded-sm font-black uppercase text-xs tracking-widest">
              KARTU PEMBAYARAN UANG SEKOLAH (SPP)
            </div>
          </div>
        </div>

        {/* Informasi Siswa */}
        <div className="grid grid-cols-2 gap-4 py-4 border-b border-slate-800 text-sm">
          <div>
            <p><span className="text-slate-700">Nama Siswa :</span> <strong className="text-base">{siswa?.nama}</strong></p>
            <p><span className="text-slate-700">Kelas / Jurusan :</span> <strong>{kelas?.nama} ({siswa?.jurusanKode})</strong></p>
          </div>
          <div className="text-right">
            <p><span className="text-slate-700">No. Induk (NIS) :</span> <strong>{siswa?.nis}</strong></p>
            <p><span className="text-slate-700">Besar SPP Bulanan :</span> <strong className="font-mono">Rp 375.000,-</strong></p>
            <p className="text-[11px] text-slate-600">(Uang Sekolah Rp 350.000 + Tabungan Wajib Rp 25.000)</p>
          </div>
        </div>

        {/* Tabel 12 Bulan (Juli s.d Juni) */}
        <div className="py-4 overflow-x-auto">
          <table className="w-full text-xs border-collapse border border-slate-800 text-center">
            <thead className="bg-amber-300 text-slate-900 font-bold border-b border-slate-800">
              <tr>
                <th className="border border-slate-800 py-2 px-2">Bulan</th>
                <th className="border border-slate-800 py-2 px-2">Uang Sekolah</th>
                <th className="border border-slate-800 py-2 px-2">Tabungan Wajib</th>
                <th className="border border-slate-800 py-2 px-2">Tanggal Bayar</th>
                <th className="border border-slate-800 py-2 px-2">Stempel & Tanda Tangan Penerima</th>
                <th className="border border-slate-800 py-2 px-2">Tanda Tangan Orang Tua</th>
              </tr>
            </thead>
            <tbody>
              {bulan12.map((bln, idx) => {
                const bayar = bln.isDu ? siswa?.duJuli : (siswa?.bayarBulanan?.[bln.nama] || 0);
                const isLunas = bln.isDu ? bayar >= 905000 : bayar >= 325000;

                return (
                  <tr key={idx} className="border-b border-slate-800 hover:bg-amber-100/50">
                    <td className="border border-slate-800 py-2 px-2 font-bold text-left">
                      {bln.nama} {bln.isDu && '(Paket DU + Juli)'}
                    </td>
                    <td className="border border-slate-800 py-2 px-2 font-mono">
                      {bln.isDu ? 'Rp 300.000,-' : 'Rp 300.000,-'}
                    </td>
                    <td className="border border-slate-800 py-2 px-2 font-mono">
                      Rp 25.000,-
                    </td>
                    <td className="border border-slate-800 py-2 px-2 font-mono">
                      {isLunas ? '10 - 10 - 2026' : '-'}
                    </td>
                    <td className="border border-slate-800 py-1 px-2 text-center">
                      {isLunas ? (
                        <div className="inline-block border border-indigo-800 text-indigo-900 text-[9px] font-black px-2 py-0.5 rounded rotate-[-4deg]">
                          LUNAS KEU. PARIWISATA
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Belum Bayar</span>
                      )}
                    </td>
                    <td className="border border-slate-800 py-2 px-2 text-slate-400 italic">
                      {isLunas ? 'Terverifikasi' : '...................'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Catatan Kaki Asli Kartu Kuning */}
        <div className="mt-2 text-xs font-semibold text-slate-700 flex justify-between items-start">
          <div>
            <p>NB :</p>
            <p>• Kartu harap disimpan baik-baik (tidak boleh hilang).</p>
            <p>• Pembayaran uang sekolah tiap bulan selambat-lambatnya tanggal 10.</p>
          </div>
          <div className="text-right">
            <p>Kepala Sekolah,</p>
            <div className="h-12"></div>
            <p className="font-bold underline">{data.sekolah.kepalaSekolah}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
