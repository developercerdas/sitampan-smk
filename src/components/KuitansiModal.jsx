import React from 'react';
import { Printer, X, CheckCircle2 } from 'lucide-react';
import SchoolLogo from './SchoolLogo';

export default function KuitansiModal({ transaksi, sekolah, onClose }) {
  if (!transaksi) return null;

  const handlePrint = () => {
    window.print();
  };

  const yayasanText = sekolah?.yayasan || 'Yayasan Lembaga Pendidikan Kejuruan Nusantara (YLPKN)';
  const namaSekolah = sekolah?.nama || 'SMK BINA KARYA NUSANTARA';
  const alamatSekolah = sekolah?.alamat || 'Jalan Pendidikan Vokasi No. 45, Kompleks Pendidikan Nasional';
  const telpSekolah = sekolah?.telp || '(021) 7891234';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Modal Action Header (Hidden saat print) */}
        <div className="no-print bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-slate-800">Bukti Pembayaran Kuitansi Digital</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow-xs transition"
            >
              <Printer className="w-4 h-4" />
              Cetak Kuitansi
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Lembar Kuitansi Fisik (Sesuai Format Foto 2 Kuitansi Asli SMK PGRI 1 Mejobo) */}
        <div className="p-8 bg-white text-slate-900 border-dashed border-2 border-slate-300 m-4 rounded-xl print:m-0 print:border-none">
          {/* Header Kuitansi dengan Logo Sekolah Dinamis */}
          <div className="flex items-center gap-4 pb-3 border-b-2 border-slate-900">
            <SchoolLogo logoUrl={sekolah?.logoUrl} className="w-14 h-14" />
            <div className="text-center flex-1">
              <p className="text-[11px] uppercase font-bold tracking-tight text-slate-600 leading-tight">
                {yayasanText}
              </p>
              <h2 className="text-lg font-black tracking-tight text-slate-900 uppercase">
                {namaSekolah}
              </h2>
              <p className="text-[10px] text-slate-600 leading-tight">
                {alamatSekolah} • Telp/Fax: {telpSekolah}
              </p>
              <span className="inline-block mt-1 px-3 py-0.5 border border-slate-900 text-[10px] font-black uppercase tracking-widest">
                Kuitansi Bukti Pembayaran Keuangan
              </span>
            </div>
          </div>

          {/* Informasi Siswa */}
          <div className="grid grid-cols-2 gap-2 text-sm py-4 border-b border-slate-200">
            <div>
              <p><span className="text-slate-500">No. Transaksi :</span> <strong className="font-mono">{transaksi.id}</strong></p>
              <p><span className="text-slate-500">Nama Siswa :</span> <strong>{transaksi.namaSiswa}</strong></p>
            </div>
            <div className="text-right">
              <p><span className="text-slate-500">Kelas :</span> <strong>{transaksi.kelas}</strong></p>
              <p><span className="text-slate-500">Tanggal :</span> {transaksi.tanggal}</p>
            </div>
          </div>

          {/* Rincian Pos yang Dibayar */}
          <div className="py-4">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Guna Membayar :</p>
            <table className="w-full text-sm">
              <tbody>
                {transaksi.rincian?.map((item, idx) => (
                  <tr key={idx} className="border-b border-slate-100">
                    <td className="py-1.5 text-slate-700">
                      • {item.namaBulan ? `Uang Sekolah (SPP) Bulan ${item.namaBulan}` : (item.item || item.posNama || item.posId)}
                      {item.isCicilan && (
                        <span className="block text-[11px] text-amber-700 font-semibold">
                          * Pembayaran Cicilan Sebagian (Sisa Kewajiban: Rp {Number(item.sisaSetelahBayar || 0).toLocaleString('id-ID')})
                        </span>
                      )}
                    </td>
                    <td className="py-1.5 text-right font-mono font-medium align-top">
                      Rp {Number(item.bayar || item.nominal).toLocaleString('id-ID')},-
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Total & Status Rapor */}
          <div className="pt-3 border-t-2 border-slate-900 flex justify-between items-center">
            <div>
              <p className="text-xs text-slate-500">Metode Pembayaran:</p>
              <span className={`inline-block text-xs font-bold px-2 py-0.5 rounded border ${
                transaksi.metode === 'VA_TRANSFER' 
                  ? 'bg-purple-50 text-purple-700 border-purple-200' 
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200'
              }`}>
                {transaksi.metode === 'VA_TRANSFER' ? 'Virtual Account (Transfer Otomatis)' : 'Tunai di Loket Kasir'}
              </span>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500">Jumlah Total:</p>
              <p className="text-xl font-black text-slate-900 font-mono">
                Rp {Number(transaksi.total).toLocaleString('id-ID')},-
              </p>
            </div>
          </div>

          {/* Indikator Rapor (Identik seperti foto 2: Raport: Sudah / Belum) */}
          <div className="mt-4 p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700">Status Syarat Pengambilan Rapor:</span>
            <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
              {transaksi.statusRaport || 'Boleh Ambil Rapor'}
            </span>
          </div>

          {/* Tanda Tangan & Stempel */}
          <div className="mt-6 pt-2 flex justify-between items-end text-xs">
            <div className="text-center w-36">
              <p className="text-slate-500">Mengetahui Orang Tua,</p>
              <div className="h-16"></div>
              <p className="border-t border-slate-400 font-medium">( ..................................... )</p>
            </div>

            <div className="text-center w-48 relative">
              <p className="text-slate-500">Kudus, {transaksi.tanggal}</p>
              <p className="font-semibold text-slate-800">Petugas Penerima,</p>
              
              {/* Tampilan Stempel Lunas Khas SMK Dinamis */}
              <div className="my-1 inline-block border-2 border-indigo-700 text-indigo-700 font-black px-3 py-1 rounded text-center rotate-[-6deg] opacity-80">
                <span className="text-[10px] block leading-none uppercase">{namaSekolah}</span>
                <span className="text-sm font-black tracking-widest block leading-tight">★ LUNAS ★</span>
                <span className="text-[9px] block leading-none">BAGIAN KEUANGAN / TU</span>
              </div>

              <p className="font-bold text-slate-900 underline">{transaksi.petugas || 'Kasir Keuangan TU'}</p>
            </div>
          </div>
        </div>

        {/* Footer Modal Note */}
        <div className="no-print bg-slate-50 border-t border-slate-200 px-6 py-3 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg text-sm font-medium transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
