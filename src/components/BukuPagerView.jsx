import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Printer, 
  Filter, 
  CheckCircle, 
  XCircle, 
  Download,
  AlertTriangle,
  UserCheck
} from 'lucide-react';
import { dataService } from '../services/dataService';

export default function BukuPagerView({ data, currentRole }) {
  // Jika wali kelas, default ke kelas bimbingan (misal XII PM 1)
  const defaultKelas = currentRole === 'WALI_KELAS' ? 1 : (data.kelas[0]?.id || 1);
  const [selectedKelasId, setSelectedKelasId] = useState(defaultKelas);
  const [tanggalCutOff, setTanggalCutOff] = useState('10 - 10 - 2026');

  const selectedKelas = data.kelas.find((k) => k.id === Number(selectedKelasId));
  const siswaList = data.siswa.filter(
    (s) => s.kelasId === Number(selectedKelasId) && s.status === 'AKTIF'
  );

  // Hitung total kolom bawah
  let totalSpi = 0;
  let totalTunggakanLalu = 0;
  let totalDuJuli = 0;
  let totalAgust = 0;
  let totalSept = 0;
  let totalOkt = 0;
  let totalNop = 0;
  let totalDes = 0;
  let grandTotal = 0;

  siswaList.forEach((s) => {
    totalSpi += Number(s.spi || 0);
    totalTunggakanLalu += Number(s.tunggakanLalu || 0);
    totalDuJuli += Number(s.duJuli || 0);
    totalAgust += Number(s.bayarBulanan?.['Agustus'] || 0);
    totalSept += Number(s.bayarBulanan?.['September'] || 0);
    totalOkt += Number(s.bayarBulanan?.['Oktober'] || 0);
    totalNop += Number(s.bayarBulanan?.['November'] || 0);
    totalDes += Number(s.bayarBulanan?.['Desember'] || 0);

    const calc = dataService.getKalkulasiSiswa(s);
    grandTotal += calc.totalSudahBayar;
  });

  const handleExportExcel = () => {
    dataService.exportBukuPagerToExcel(selectedKelasId);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Filter & Action Bar (Hidden saat cetak) */}
      <div className="no-print bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
              Pilih Rombongan Belajar (Kelas)
            </label>
            <select
              value={selectedKelasId}
              onChange={(e) => setSelectedKelasId(e.target.value)}
              className="bg-slate-50 border border-slate-200 font-bold text-slate-800 text-sm rounded-xl px-3.5 py-2 focus:ring-2 focus:ring-blue-500"
            >
              {data.kelas.map((k) => (
                <option key={k.id} value={k.id}>
                  {k.nama} • Wali: {k.waliKelas}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
              Per Tanggal Rekap (Cut-off)
            </label>
            <input
              type="text"
              value={tanggalCutOff}
              onChange={(e) => setTanggalCutOff(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl px-3 py-2 w-36 font-medium"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold shadow-xs transition"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Ekspor ke Excel
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-xs transition"
          >
            <Printer className="w-4 h-4" />
            Cetak Format Folio
          </button>
        </div>
      </div>

      {/* Tampilan Tabel Folio Asli (Buku Pager Digital) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm print:m-0 print:border-none print:p-0">
        {/* Header Lembar Setoran */}
        <div className="text-center pb-4 border-b-2 border-slate-900 mb-4">
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">
            DAFTAR SETORAN SPP {data.sekolah.nama}
          </h2>
          <p className="text-sm font-bold text-slate-700 uppercase">
            TAHUN PELAJARAN {data.sekolah.tahunAjaranAktif}
          </p>
          <div className="flex justify-between items-center text-xs font-bold mt-3 px-2">
            <span>PER TANGGAL : {tanggalCutOff}</span>
            <span>KELAS : {selectedKelas?.nama} (Wali Kelas: {selectedKelas?.waliKelas})</span>
            <span>DU : Rp 905.000 | SPP : Rp 325.000</span>
          </div>
        </div>

        {/* Tabel Rekapitulasi Data Siswa */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse border border-slate-800">
            <thead className="bg-slate-100 text-slate-900 font-extrabold uppercase text-[11px] text-center border-b border-slate-800">
              <tr>
                <th className="border border-slate-800 py-2 px-1 w-8">NO</th>
                <th className="border border-slate-800 py-2 px-2 w-16">NIS</th>
                <th className="border border-slate-800 py-2 px-3 text-left">NAMA SISWA</th>
                <th className="border border-slate-800 py-2 px-2 text-right">SPI</th>
                <th className="border border-slate-800 py-2 px-2 text-right">Spp kls XI</th>
                <th className="border border-slate-800 py-2 px-2 text-right">DU+JULI</th>
                <th className="border border-slate-800 py-2 px-2 text-right">AGUST.</th>
                <th className="border border-slate-800 py-2 px-2 text-right">SEPT.</th>
                <th className="border border-slate-800 py-2 px-2 text-right">OKT.</th>
                <th className="border border-slate-800 py-2 px-2 text-right">NOP.</th>
                <th className="border border-slate-800 py-2 px-2 text-right">DES.</th>
                <th className="border border-slate-800 py-2 px-3 text-right bg-slate-200">TOTAL</th>
                <th className="border border-slate-800 py-2 px-2 no-print">SYARAT RAPOR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-300 font-mono">
              {siswaList.map((s, idx) => {
                const calc = dataService.getKalkulasiSiswa(s);
                return (
                  <tr key={s.id} className="hover:bg-slate-50">
                    <td className="border border-slate-800 text-center py-1.5 px-1 font-sans">{idx + 1}</td>
                    <td className="border border-slate-800 text-center py-1.5 px-2">{s.nis}</td>
                    <td className="border border-slate-800 py-1.5 px-3 font-sans font-bold text-slate-900">
                      {s.nama}
                    </td>
                    <td className="border border-slate-800 py-1.5 px-2 text-right">
                      {s.spi ? Number(s.spi).toLocaleString('id-ID') : '-'}
                    </td>
                    <td className="border border-slate-800 py-1.5 px-2 text-right text-rose-700 font-semibold">
                      {s.tunggakanLalu ? Number(s.tunggakanLalu).toLocaleString('id-ID') : '-'}
                    </td>
                    <td className="border border-slate-800 py-1.5 px-2 text-right">
                      {s.duJuli ? Number(s.duJuli).toLocaleString('id-ID') : '-'}
                    </td>
                    <td className="border border-slate-800 py-1.5 px-2 text-right">
                      {s.bayarBulanan?.['Agustus'] ? Number(s.bayarBulanan['Agustus']).toLocaleString('id-ID') : '-'}
                    </td>
                    <td className="border border-slate-800 py-1.5 px-2 text-right">
                      {s.bayarBulanan?.['September'] ? Number(s.bayarBulanan['September']).toLocaleString('id-ID') : '-'}
                    </td>
                    <td className="border border-slate-800 py-1.5 px-2 text-right">
                      {s.bayarBulanan?.['Oktober'] ? Number(s.bayarBulanan['Oktober']).toLocaleString('id-ID') : '-'}
                    </td>
                    <td className="border border-slate-800 py-1.5 px-2 text-right">
                      {s.bayarBulanan?.['November'] ? Number(s.bayarBulanan['November']).toLocaleString('id-ID') : '-'}
                    </td>
                    <td className="border border-slate-800 py-1.5 px-2 text-right">
                      {s.bayarBulanan?.['Desember'] ? Number(s.bayarBulanan['Desember']).toLocaleString('id-ID') : '-'}
                    </td>
                    <td className="border border-slate-800 py-1.5 px-3 text-right font-black bg-slate-100">
                      {Number(calc.totalSudahBayar).toLocaleString('id-ID')}
                    </td>
                    <td className="border border-slate-800 py-1 px-2 text-center no-print">
                      {calc.isLunasSmt1 ? (
                        <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          LUNAS
                        </span>
                      ) : (
                        <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">
                          TERTAHAN
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            {/* Baris Total Setoran Bawah */}
            <tfoot className="bg-slate-200 font-mono font-black text-slate-900 border-t-2 border-slate-900">
              <tr>
                <td colSpan="3" className="border border-slate-800 py-2.5 px-3 text-center uppercase font-sans">
                  JUMLAH TOTAL SETORAN
                </td>
                <td className="border border-slate-800 py-2.5 px-2 text-right">
                  {totalSpi.toLocaleString('id-ID')}
                </td>
                <td className="border border-slate-800 py-2.5 px-2 text-right text-rose-800">
                  {totalTunggakanLalu.toLocaleString('id-ID')}
                </td>
                <td className="border border-slate-800 py-2.5 px-2 text-right">
                  {totalDuJuli.toLocaleString('id-ID')}
                </td>
                <td className="border border-slate-800 py-2.5 px-2 text-right">
                  {totalAgust.toLocaleString('id-ID')}
                </td>
                <td className="border border-slate-800 py-2.5 px-2 text-right">
                  {totalSept.toLocaleString('id-ID')}
                </td>
                <td className="border border-slate-800 py-2.5 px-2 text-right">
                  {totalOkt.toLocaleString('id-ID')}
                </td>
                <td className="border border-slate-800 py-2.5 px-2 text-right">
                  {totalNop.toLocaleString('id-ID')}
                </td>
                <td className="border border-slate-800 py-2.5 px-2 text-right">
                  {totalDes.toLocaleString('id-ID')}
                </td>
                <td className="border border-slate-800 py-2.5 px-3 text-right bg-slate-300 text-sm">
                  {grandTotal.toLocaleString('id-ID')}
                </td>
                <td className="border border-slate-800 no-print"></td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Tanda Tangan Wali Kelas & Kasir TU (Print Footer) */}
        <div className="mt-8 pt-4 flex justify-between items-end text-xs font-sans">
          <div className="text-center w-48">
            <p>Mengetahui,</p>
            <p className="font-semibold">Kepala Sekolah</p>
            <div className="h-16"></div>
            <p className="font-bold underline">{data.sekolah.kepalaSekolah}</p>
          </div>

          <div className="text-center w-48">
            <p>Kudus, {tanggalCutOff}</p>
            <p className="font-semibold">Wali Kelas {selectedKelas?.nama}</p>
            <div className="h-16"></div>
            <p className="font-bold underline">{selectedKelas?.waliKelas}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
