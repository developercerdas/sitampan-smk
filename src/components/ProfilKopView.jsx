import React, { useState } from 'react';
import { 
  Building2, 
  Upload, 
  Save, 
  RotateCcw, 
  CheckCircle2, 
  Eye, 
  HelpCircle,
  Image as ImageIcon,
  Sparkles,
  School
} from 'lucide-react';
import confetti from 'canvas-confetti';
import SchoolLogo from './SchoolLogo';
import { dataService } from '../services/dataService';

export default function ProfilKopView({ data, onUpdateData }) {
  const [formData, setFormData] = useState({
    nama: data.sekolah.nama || 'SMK PGRI 1 MEJOBO KUDUS',
    yayasan: data.sekolah.yayasan || 'Yayasan Pembina Lembaga Pendidikan Dasar & Menengah PGRI Jawa Tengah (YPLP DM PGRI JT)',
    alamat: data.sekolah.alamat || 'Jln. Jend. Sudirman Golantepus Mejobo, Kudus 59381',
    akreditasi: data.sekolah.akreditasi || 'A',
    telp: data.sekolah.telp || '0291 435273 / Fax: 0291 435273',
    email: data.sekolah.email || 'smkpgri1kds@yahoo.com',
    web: data.sekolah.web || 'http://www.smkpgri1kudus.sch.id',
    kepalaSekolah: data.sekolah.kepalaSekolah || 'Harry Susilo Kurniawan, M.M., M.Pd',
    tahunAjaranAktif: data.sekolah.tahunAjaranAktif || '2026/2027',
    bankMitra: data.sekolah.bankMitra || 'Bank Jateng / BNI Virtual Account',
    logoUrl: data.sekolah.logoUrl || null
  });

  const [pesanSukses, setPesanSukses] = useState('');

  // Handle Logo Upload (Base64)
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Mohon pilih file gambar (PNG, JPG, atau JPEG)!');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setFormData((prev) => ({
        ...prev,
        logoUrl: event.target.result
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleResetLogo = () => {
    setFormData((prev) => ({
      ...prev,
      logoUrl: null
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dataService.updateProfilSekolah(formData);
    onUpdateData();

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 }
    });

    setPesanSukses('KOP Surat & Profil Sekolah berhasil diperbarui! Seluruh kuitansi, kartu SPP, dan buku pager otomatis menggunakan KOP baru.');
    setTimeout(() => setPesanSukses(''), 6000);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-blue-800 via-indigo-800 to-blue-900 text-white p-6 rounded-2xl shadow-md">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-xs">
            <School className="w-8 h-8 text-amber-300" />
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-tight">
              Master Profil & Pergantian KOP Surat / Kuitansi Sekolah
            </h2>
            <p className="text-blue-100 text-sm mt-0.5">
              Kelola logo sekolah, nama yayasan, alamat, dan pejabat penandatangan. Perubahan di sini <strong>otomatis merubah seluruh KOP kuitansi, kartu SPP kuning, dan lembar setoran</strong>.
            </p>
          </div>
        </div>
      </div>

      {pesanSukses && (
        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl flex items-center gap-3 text-emerald-800 text-sm font-semibold animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{pesanSukses}</span>
        </div>
      )}

      {/* Grid: Kiri Form Edit, Kanan Live Preview KOP */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Kolom Kiri: Form Edit Profil & Upload Logo (7 Kolom) */}
        <div className="lg:col-span-7 space-y-5">
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
            {/* Bagian 1: Logo Sekolah */}
            <div className="pb-4 border-b border-slate-200">
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                Logo Resmi Sekolah
              </label>
              <div className="flex flex-wrap items-center gap-4">
                <SchoolLogo logoUrl={formData.logoUrl} className="w-16 h-16" />
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <label className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition">
                      <Upload className="w-3.5 h-3.5" />
                      Unggah File Logo Baru (PNG/JPG)
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                    </label>
                    {formData.logoUrl && (
                      <button
                        type="button"
                        onClick={handleResetLogo}
                        className="text-xs text-slate-500 hover:text-rose-600 font-semibold px-2 py-1 rounded transition"
                      >
                        Reset ke Logo Default
                      </button>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Format disarankan: PNG transparan persegi. Logo otomatis muncul di kuitansi, kartu SPP, dan sidebar.
                  </p>
                </div>
              </div>
            </div>

            {/* Bagian 2: Teks KOP Surat / Kuitansi */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Nama Yayasan / Lembaga Pembina (KOP Baris 1)
                </label>
                <input
                  type="text"
                  value={formData.yayasan}
                  onChange={(e) => setFormData({ ...formData, yayasan: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Nama Sekolah (KOP Baris 2 - Huruf Besar)
                </label>
                <input
                  type="text"
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:bg-white uppercase"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Status Akreditasi
                  </label>
                  <input
                    type="text"
                    value={formData.akreditasi}
                    onChange={(e) => setFormData({ ...formData, akreditasi: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold"
                    placeholder="Contoh: A / Unggul"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Tahun Pelajaran Aktif
                  </label>
                  <input
                    type="text"
                    value={formData.tahunAjaranAktif}
                    onChange={(e) => setFormData({ ...formData, tahunAjaranAktif: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold"
                    placeholder="2026/2027"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Alamat Lengkap Sekolah (KOP Baris 3)
                </label>
                <input
                  type="text"
                  value={formData.alamat}
                  onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    No. Telepon & Fax KOP
                  </label>
                  <input
                    type="text"
                    value={formData.telp}
                    onChange={(e) => setFormData({ ...formData, telp: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Email Resmi KOP
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Nama Kepala Sekolah & Gelar
                  </label>
                  <input
                    type="text"
                    value={formData.kepalaSekolah}
                    onChange={(e) => setFormData({ ...formData, kepalaSekolah: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Bank Mitra Virtual Account (VA)
                  </label>
                  <input
                    type="text"
                    value={formData.bankMitra}
                    onChange={(e) => setFormData({ ...formData, bankMitra: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Tombol Simpan */}
            <div className="pt-4 border-t border-slate-200 flex justify-end">
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                Simpan Perubahan KOP & Profil
              </button>
            </div>
          </form>
        </div>

        {/* Kolom Kanan: Pratinjau KOP Langsung (Live Preview) (5 Kolom) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
              <Eye className="w-4 h-4 text-blue-600" />
              Pratinjau Live KOP Surat & Kuitansi:
            </h3>

            {/* Kotak KOP Simulasi Lembar Cetak */}
            <div className="p-6 bg-white border-2 border-dashed border-slate-300 rounded-xl space-y-3">
              <div className="flex items-center gap-3 pb-3 border-b-2 border-slate-900">
                <SchoolLogo logoUrl={formData.logoUrl} className="w-14 h-14" />
                <div className="text-center flex-1">
                  <p className="text-[10px] uppercase font-bold text-slate-600 leading-tight">
                    {formData.yayasan}
                  </p>
                  <h4 className="text-base font-black tracking-tight text-slate-900 uppercase leading-snug">
                    {formData.nama}
                  </h4>
                  <p className="text-[9px] text-slate-500 leading-tight">
                    Terakreditasi: {formData.akreditasi} • {formData.alamat}
                  </p>
                  <p className="text-[9px] text-slate-500 leading-tight">
                    Telp: {formData.telp} | Email: {formData.email}
                  </p>
                </div>
              </div>

              <div className="text-center py-2 bg-slate-50 rounded border border-slate-200 text-xs text-slate-500 italic">
                [ Area Isi Kuitansi / Lembar Rekap Setoran ]
              </div>

              <div className="flex justify-between items-end pt-2 text-[10px] text-slate-600">
                <div>
                  <p>Mengetahui,</p>
                  <p className="font-bold">Kepala Sekolah</p>
                  <div className="h-10"></div>
                  <p className="font-bold underline text-slate-900">{formData.kepalaSekolah}</p>
                </div>
                <div className="text-right">
                  <p>Kudus, 17 Oktober 2026</p>
                  <p className="font-bold">Petugas Keuangan</p>
                  <div className="h-10"></div>
                  <p className="font-bold underline text-slate-900">Kasir TU</p>
                </div>
              </div>
            </div>

            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-start gap-2">
              <HelpCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <span>
                Jika ada pergantian logo atau KOP surat di SMK PGRI 1 Mejobo Kudus, Anda cukup mengedit form di samping dan klik <strong>Simpan</strong>.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
