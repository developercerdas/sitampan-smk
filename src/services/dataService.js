import { INITIAL_DATA } from './initialData';
import * as XLSX from 'xlsx';

const STORAGE_KEY = 'SITAMPAN_SMK_DATA_V1';

export const dataService = {
  // Cek parameter dari URL untuk sinkronisasi profil sekolah saat link dibagikan
  checkUrlProfileSync() {
    try {
      if (typeof window === 'undefined') return null;
      const params = new URLSearchParams(window.location.search);
      const nama = params.get('nama') || params.get('sekolah');
      const yayasan = params.get('yayasan');
      const alamat = params.get('alamat');
      const profilEncoded = params.get('profil');

      let customProfile = null;
      if (profilEncoded) {
        try {
          customProfile = JSON.parse(decodeURIComponent(escape(atob(profilEncoded))));
        } catch (e) {
          console.warn('Gagal membaca profil dari token URL:', e);
        }
      }

      if (!customProfile && nama) {
        customProfile = {
          nama: decodeURIComponent(nama),
          ...(yayasan ? { yayasan: decodeURIComponent(yayasan) } : {}),
          ...(alamat ? { alamat: decodeURIComponent(alamat) } : {})
        };
      }

      return customProfile;
    } catch {
      return null;
    }
  },

  // Helper untuk membuat Link Share yang membawa data profil sekolah
  getShareableLink(sekolahObj) {
    if (typeof window === 'undefined') return '';
    const origin = window.location.origin + window.location.pathname;
    try {
      const dataToEncode = {
        nama: sekolahObj.nama,
        yayasan: sekolahObj.yayasan || '',
        alamat: sekolahObj.alamat || '',
        telp: sekolahObj.telp || '',
        email: sekolahObj.email || '',
        akreditasi: sekolahObj.akreditasi || ''
      };
      const token = btoa(unescape(encodeURIComponent(JSON.stringify(dataToEncode))));
      return `${origin}?profil=${token}`;
    } catch (e) {
      return `${origin}?sekolah=${encodeURIComponent(sekolahObj.nama || 'SMK BINA KARYA NUSANTARA')}`;
    }
  },

  // 1. Ambil data saat ini (LocalStorage, Fallback ke Initial, atau Sinkron dari Link)
  getData() {
    try {
      const urlProfile = this.checkUrlProfileSync();
      const stored = localStorage.getItem(STORAGE_KEY);
      let parsed = null;

      if (stored) {
        parsed = JSON.parse(stored);

        // Migrasi data lama jika masih mengandung 'PGRI 1' atau 'Mejobo'
        if (parsed.sekolah?.nama?.includes('PGRI 1') || parsed.sekolah?.alamat?.includes('Mejobo')) {
          parsed.sekolah = {
            ...INITIAL_DATA.sekolah,
            logoUrl: parsed.sekolah?.logoUrl || null
          };
          this.saveData(parsed);
        }

        // Pastikan setiap siswa memiliki field tanggalLahir
        parsed.siswa = (parsed.siswa || []).map((s) => ({
          ...s,
          tanggalLahir: s.tanggalLahir || (
            s.nis === '12640' ? '2008-08-17' :
            s.nis === '12643' ? '2008-05-12' :
            s.nis === '12553' ? '2009-02-20' :
            s.nis === '12652' ? '2008-11-03' :
            s.nis === '12669' ? '2008-04-25' :
            '2008-07-15'
          )
        }));
      } else {
        parsed = JSON.parse(JSON.stringify(INITIAL_DATA));
      }

      // Jika ada profil dari URL link yang di-share, prioritaskan dan simpan
      if (urlProfile && urlProfile.nama) {
        parsed.sekolah = {
          ...parsed.sekolah,
          ...urlProfile
        };
        this.saveData(parsed);
      } else if (!stored) {
        this.saveData(parsed);
      }

      return parsed;
    } catch (e) {
      console.warn('Gagal membaca LocalStorage, memuat data awal default:', e);
      return INITIAL_DATA;
    }
  },

  // 2. Simpan perubahan ke LocalStorage
  saveData(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Gagal menyimpan ke LocalStorage:', e);
    }
  },

  // 3. Reset data ke kondisi awal default
  resetToDefault() {
    this.saveData(INITIAL_DATA);
    return INITIAL_DATA;
  },

  // 3b. Update Profil & KOP Surat / Kuitansi Sekolah
  updateProfilSekolah(sekolahObj) {
    const data = this.getData();
    data.sekolah = { ...data.sekolah, ...sekolahObj };
    this.saveData(data);
    return data.sekolah;
  },

  // 4. Proses Transaksi Kasir / VA (Hybrid Payment Engine)
  catatPembayaran({ siswaId, nominal, metode, nomorReferensi, petugas, rincianItems, catatan, statusRaport }) {
    const data = this.getData();
    const siswaIndex = data.siswa.findIndex((s) => s.id === Number(siswaId));
    if (siswaIndex === -1) throw new Error('Siswa tidak ditemukan');

    const siswa = data.siswa[siswaIndex];
    const noKwitansi = `KWT-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`;

    // Update kolom setoran siswa berdasarkan rincian yang dibayar (Mendukung Pembayaran Penuh & Cicilan)
    rincianItems.forEach((item) => {
      const bayarNominal = Number(item.bayar);
      if (item.tipe === 'BULANAN') {
        siswa.bayarBulanan[item.namaBulan] = (siswa.bayarBulanan[item.namaBulan] || 0) + bayarNominal;
      } else if (item.posId === 'DU') {
        siswa.duJuli = (siswa.duJuli || 0) + bayarNominal;
      } else if (item.posId === 'SPI') {
        siswa.spi = (siswa.spi || 0) + bayarNominal;
      } else if (item.posId === 'TUNGGAKAN_LALU') {
        siswa.tunggakanLalu = (siswa.tunggakanLalu || 0) + bayarNominal;
      }
    });

    const transaksiBaru = {
      id: noKwitansi,
      siswaId: siswa.id,
      namaSiswa: siswa.nama,
      nis: siswa.nis,
      kelas: data.kelas.find((k) => k.id === siswa.kelasId)?.nama || siswa.tingkat,
      tanggal: new Date().toISOString().split('T')[0],
      total: Number(nominal),
      metode: metode || 'TUNAI',
      nomorReferensi: nomorReferensi || null,
      petugas: petugas || 'Kasir TU (Ibu Rini)',
      statusRaport: statusRaport || 'Boleh Ambil',
      catatan: catatan || '',
      rincian: rincianItems
    };

    data.riwayatPembayaran.unshift(transaksiBaru);
    this.saveData(data);
    return transaksiBaru;
  },

  // 5. Hitung Ringkasan Keuangan Siswa (Total Tagihan, Total Bayar, Sisa Tunggakan)
  getKalkulasiSiswa(siswa) {
    const nominalSpp = 325000;
    const bulanDaftar = ['Agustus', 'September', 'Oktober', 'November', 'Desember', 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni'];

    // Hitung yang sudah dibayar
    let totalBayarSpp = 0;
    bulanDaftar.forEach((bln) => {
      totalBayarSpp += Number(siswa.bayarBulanan?.[bln] || 0);
    });

    const totalSudahBayar = (Number(siswa.duJuli) || 0) + totalBayarSpp;

    // Hitung tunggakan berjalan (misal cut-off sampai Desember)
    const targetBulanSmt1 = ['Agustus', 'September', 'Oktober', 'November', 'Desember'];
    let tunggakanSmt1 = 0;
    targetBulanSmt1.forEach((bln) => {
      const bayar = Number(siswa.bayarBulanan?.[bln] || 0);
      if (bayar < nominalSpp) {
        tunggakanSmt1 += nominalSpp - bayar;
      }
    });

    const duBelumLunas = (Number(siswa.duJuli) || 0) < 905000 ? 905000 - (Number(siswa.duJuli) || 0) : 0;
    const totalTunggakanAktif = tunggakanSmt1 + duBelumLunas + (Number(siswa.tunggakanLalu) || 0) + (Number(siswa.spi) || 0);

    return {
      totalSudahBayar,
      totalTunggakanAktif,
      duBelumLunas,
      tunggakanSmt1,
      isLunasSmt1: totalTunggakanAktif === 0,
      syaratRaport: totalTunggakanAktif === 0 ? 'Boleh Ambil Rapor' : `Tertahan (Kurang Rp ${totalTunggakanAktif.toLocaleString('id-ID')})`
    };
  },

  // 6. Engine Kenaikan Kelas & Kelulusan (Student Promotion)
  prosesKenaikanKelas({ kelasAsalId, kelasTujuanId, siswaIds, aksi, tahunAjaranBaru }) {
    const data = this.getData();

    siswaIds.forEach((sId) => {
      const siswa = data.siswa.find((s) => s.id === Number(sId));
      if (!siswa) return;

      const kalkulasi = this.getKalkulasiSiswa(siswa);

      if (aksi === 'LULUS') {
        siswa.status = 'LULUS';
        // Tunggakan tersimpan sebagai beban alumni
        siswa.tunggakanLalu = kalkulasi.totalTunggakanAktif;
      } else {
        // Naik Kelas: Pindahkan kelas_id & update tingkat
        const kelasTujuan = data.kelas.find((k) => k.id === Number(kelasTujuanId));
        if (kelasTujuan) {
          siswa.kelasId = kelasTujuan.id;
          siswa.tingkat = kelasTujuan.tingkat;
        }
        // Akumulasikan sisa tunggakan lama ke kolom "Tunggakan Lalu" (seperti kolom Spp kls XI)
        siswa.tunggakanLalu = (siswa.tunggakanLalu || 0) + kalkulasi.tunggakanSmt1;
        // Reset kolom bulanan untuk tahun ajaran baru
        siswa.bayarBulanan = {};
        siswa.duJuli = 0;
      }
    });

    if (tahunAjaranBaru) {
      data.sekolah.tahunAjaranAktif = tahunAjaranBaru;
    }

    this.saveData(data);
    return { success: true, totalDiproses: siswaIds.length };
  },

  // 7. Ekspor ke Excel (Daftar Setoran SPP ala Buku Pager Asli)
  exportBukuPagerToExcel(kelasId) {
    const data = this.getData();
    const kelas = data.kelas.find((k) => k.id === Number(kelasId));
    const siswaList = data.siswa.filter((s) => s.kelasId === Number(kelasId) && s.status === 'AKTIF');

    const rows = siswaList.map((s, idx) => {
      const calc = this.getKalkulasiSiswa(s);
      return {
        'NO': idx + 1,
        'NIS': s.nis,
        'NAMA SISWA': s.nama,
        'SPI': s.spi || 0,
        'SPP KLS LALU': s.tunggakanLalu || 0,
        'DU + JULI': s.duJuli || 0,
        'AGUST.': s.bayarBulanan?.['Agustus'] || 0,
        'SEPT.': s.bayarBulanan?.['September'] || 0,
        'OKT.': s.bayarBulanan?.['Oktober'] || 0,
        'NOP.': s.bayarBulanan?.['November'] || 0,
        'DES.': s.bayarBulanan?.['Desember'] || 0,
        'TOTAL SETORAN': calc.totalSudahBayar,
        'STATUS RAPORT': calc.isLunasSmt1 ? 'LUNAS (Boleh Ambil)' : 'TERTAHAN'
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, `Rekap_${kelas?.nama || 'Kelas'}`);
    XLSX.writeFile(workbook, `DAFTAR_SETORAN_${kelas?.nama || 'SMK'}_${new Date().toISOString().split('T')[0]}.xlsx`);
  }
};
