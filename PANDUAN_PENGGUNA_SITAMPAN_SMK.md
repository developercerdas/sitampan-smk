# BUKU PANDUAN PENGGUNAAN SISTEM (USER MANUAL)
## SITAMPAN SMK — Sistem Informasi Tagihan & Manajemen Pembayaran Keuangan SMK
**Pengembang:** CV. ISTANA BARCODE COMPUTER — DEVELOPER CERDAS  
**Versi Sistem:** 2.0 (Multi-Jurusan & Multi-Kasir Berbasis Rombel)

---

## 1. PENDAHULUAN & ARSITEKTUR LOKET

SITAMPAN SMK dirancang khusus untuk mempermudah tata kelola keuangan sekolah menengah kejuruan (SMK) dengan karakteristik rombel banyak dan jurusan yang beragam.

Sistem membagi operasional keuangan ke dalam **2 Kelompok Bidang Kejuruan** yang dilayani oleh **2 Kasir Loket Khusus**, serta dipantau penuh oleh **Admin Pusat**, **Bendahara**, dan **Kepala Sekolah**.

```mermaid
flowchart TD
    subgraph PUSAT["Manajemen Pusat Sekolah"]
        Admin["👑 Admin Pusat TU<br>(Akses 5 Jurusan & Switcher Loket)"]
        Bendahara["💰 Bendahara Sekolah<br>(Rekap Arus Kas Masuk & Bank)"]
        Kepsek["👔 Kepala Sekolah<br>(Monitoring Eksekutif & Buku Pager)"]
    end

    subgraph LOKET1["Loket 1: Kelompok Bisnis & Manajemen"]
        KasirHana["💼 Kasir 1: Hana Pratiwi<br>(Terkunci: AKL, MPLB, PM)"]
        SiswaBisMan["Siswa:<br>• AKL (Akuntansi)<br>• MPLB (Manajemen Perkantoran)<br>• PM (Pemasaran)"]
        KasirHana --> SiswaBisMan
    end

    subgraph LOKET2["Loket 2: Kelompok Pariwisata"]
        KasirUmi["🏖️ Kasir 2: Umi Kalsum<br>(Terkunci: KSP, HTL)"]
        SiswaPar["Siswa:<br>• KSP (Kecantikan & Spa)<br>• HTL (Perhotelan)"]
        KasirUmi --> SiswaPar
    end

    Admin --> LOKET1
    Admin --> LOKET2
    Bendahara --> LOKET1
    Bendahara --> LOKET2
```

---

## 2. DAFTAR AKUN & HAK AKSES PENGGUNA

| Akun / Peran | Username | Password Default | Wilayah Layanan / Batasan Akses |
| :--- | :--- | :--- | :--- |
| 💼 **Kasir 1 (Hana)** | `hana` | `hana123` | **Terkunci khusus Kelompok Bisnis Manajemen.** Hanya melayani siswa `AKL`, `MPLB`, dan `PM`. Siswa Pariwisata disembunyikan 100%. |
| 🏖️ **Kasir 2 (Umi)** | `umi` | `umi123` | **Terkunci khusus Kelompok Pariwisata.** Hanya melayani siswa `KSP` dan `HTL`. Siswa BisMan disembunyikan 100%. |
| 👑 **Admin Pusat** | `admin` | `admin123` | **Akses Penuh Seluruh 5 Jurusan.** Memiliki bilah *Switcher Sudut Pandang* untuk berganti loket atau memantau seluruh pusat. |
| 💰 **Bendahara** | `bendahara` | `bendahara123` | **Akses Pengawasan Keuangan.** Melihat seluruh mutasi kas tunai loket, transfer bank (Virtual Account), dan pencairan dana. |
| 👔 **Kepala Sekolah** | `kepsek` | `kepsek123` | **Monitoring Eksekutif.** Memantau seluruh rekapitulasi buku pager kelas dan kartu pembayaran siswa. |
| 👩‍🏫 **Wali Kelas** | `wali_akl` / `wali_htl` | `admin123` | Memantau rekap setoran (Buku Pager) siswa di rombel kelas bimbingannya saja. |
| 🎓 **Siswa / Orang Tua** | `NIS Siswa` | Tanggal Lahir (Format: YYYY-MM-DD) | Mengecek sisa tagihan, riwayat kuitansi lunas, dan nomor Virtual Account mandiri. |

---

## 3. PANDUAN PENGOPERASIAN LOKET KASIR (HANA & UMI)

### A. Membuka Loket & Mencari Data Siswa
1. Buka browser dan login menggunakan username loket masing-masing:
   * **Kasir Hana:** username `hana`, password `hana123`.
   * **Kasir Umi:** username `umi`, password `umi123`.
2. Sistem otomatis membuka menu **Loket Kasir & Kuitansi**.
3. Cari siswa yang datang ke loket melalui kotak pencarian di sisi kiri:
   * Ketik **NIS** (contoh: `12640`) atau **Nama Siswa** (contoh: `Dewi`).
   * Klik nama siswa tersebut untuk memunculkan lembar tagihan resminya di panel kanan.

> [!NOTE]
> Kasir Hana tidak akan pernah menemukan siswa jurusan Pariwisata, dan Kasir Umi tidak akan pernah menemukan siswa jurusan Bisnis Manajemen. Sistem menerapkan proteksi isolasi data agar pembukuan tidak tertukar.

### B. Menerima Pembayaran SPP Bulanan
1. Pada tabel rincian tagihan, cari baris bulan SPP yang ingin dibayar siswa (contoh: *SPP Bulan Oktober 2026*).
2. Centang kotak pilihan pada baris tersebut.
3. Nominal SPP otomatis terisi sesuai tarif resmi jurusan yang telah ditetapkan.

### C. Menerima Pembayaran Cicilan / Nyicil Fleksibel
SITAMPAN SMK dilengkapi fitur **Cicilan Fleksibel Bebas**:
1. Centang pos tagihan berbiaya besar yang ingin dicicil siswa (misalnya: *Daftar Ulang*, *SPI/Uang Gedung*, atau *Uji Kompetensi UKK*).
2. Pada kolom input **"Bayar Sekarang"**, ganti nominalnya dengan uang yang dibawa siswa.
   * *Contoh:* Sisa tagihan SPI Rp 1.500.000, siswa membawa uang Rp 500.000. Cukup ketik angka `500000`.
3. Sistem secara otomatis mencatat transaksi tersebut sebagai **"Cicilan Sebagian"** dan menghitung sisa piutang secara akurat ke saldo siswa.

### D. Memilih Metode Bayar & Mencetak Kuitansi
1. Pilih metode bayar:
   * **💵 Tunai:** Jika siswa membayar langsung di meja loket.
   * **📱 QRIS / VA Transfer:** Jika orang tua mentransfer via Virtual Account Bank.
2. Tambahkan catatan bila diperlukan (misalnya: *Dititipkan lewat wali kelas*).
3. Klik tombol besar hijau: **"Proses Pembayaran & Terbitkan Kuitansi"**.
4. Muncul jendela kuitansi resmi lengkap dengan:
   * Kop Surat Resmi Sekolah.
   * Nomor Kuitansi Transaksi Unik.
   * **QR Code Verifikasi Keaslian Kuitansi**.
   * Rincian pos yang dibayar & sisa saldo tunggakan.
   * Nama dan stempel tanda tangan kasir yang bertugas.
5. Klik **"Cetak Kuitansi"** untuk mencetak ke printer thermal kasir atau printer lembar folio.

---

## 4. PANDUAN ADMIN PUSAT (KENDALI 1-KLIK)

Admin Pusat memiliki tombol navigasi khusus di bilah atas layar:
* **[ 🏢 Semua Rombel (5 Jurusan Pusat) ]**: Menampilkan seluruh data transaksi gabungan dari kedua kasir.
* **[ 💼 Kelompok BisMan (Loket Hana) ]**: Mengalihkan seluruh tampilan, tabel siswa, dan laporan menjadi sudut pandang loket Hana saja.
* **[ 🏖️ Kelompok Pariwisata (Loket Umi) ]**: Mengalihkan seluruh tampilan menjadi sudut pandang loket Umi saja.

---

## 5. PANDUAN PENCETAKAN BUKU PAGER (REKAP FOLIO)

1. Buka menu **Buku Pager (Rekap Setoran)** di sidebar.
2. Pilih kelas rombel yang ingin dicetak pada dropdown di sudut kiri atas:
   * Kelas sudah terkelompok rapi berdasarkan *Kelompok BisMan* dan *Kelompok Pariwisata*.
3. Tentukan tanggal batas (*Cut-off* rekapitulasi).
4. Klik tombol **"Ekspor ke Excel"** untuk mengunduh berkas `.xlsx` pembukuan bendahara.
5. Atau klik **"Cetak Lembar Folio"** untuk mencetak lembar kontrol tanda tangan wali kelas dan kepala sekolah.

---

## 6. PUSAT BANTUAN & PEMELIHARAAN SISTEM

Jika sekolah membutuhkan penambahan akun kasir baru, perubahan logo sekolah, penyesuaian tarif iuran per jurusan, atau integrasi gateway WhatsApp kuitansi:
* **Dukungan Teknis:** CV. ISTANA BARCODE COMPUTER — DEVELOPER CERDAS
* **Layanan:** POS Hardware, Printer Barcode/Thermal, Software Kustom, Jaringan & CCTV.
