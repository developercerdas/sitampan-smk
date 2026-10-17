# SITAMPAN SMK 🏫
### Sistem Informasi Terpadu Administrasi & Manajemen Pembayaran Tunai / Non-tunai
**SMK PGRI 1 MEJOBO KUDUS (Terakreditasi A)**

---

## 📌 Latar Belakang & Masalah yang Diselesaikan
Aplikasi ini dibangun untuk menggantikan sistem pembukuan manual lama yang masih menggunakan:
1. **Buku Pager / Kertas Folio Rekap Excel** ➔ Digantikan dengan **Buku Pager Digital** (rekap otomatis per kelas, per tanggal cut-off tgl 10, ekspor Excel sekali klik).
2. **Kartu SPP Kuning (12 Bulan)** ➔ Digantikan dengan **Kartu SPP Digital** (bisa dipantau siswa/ortu dari HP lengkap dengan nomor Virtual Account).
3. **Buku Kuitansi Sobek Manual** ➔ Digantikan dengan **Loket Kasir & Kuitansi Struk Digital** (lengkap dengan validasi syarat ambil rapor).
4. **Form Biaya Lain-Lain (Kertas Pink)** ➔ Digantikan dengan **Master Pos Biaya Fleksibel** (OSIS, PGRI, Majalah, MPLS, Ujian PAS, SPI, Sarpras).

---

## ⚡ Fitur Utama

- 💳 **Loket Kasir Cepat (Hybrid)**: Terima pembayaran Tunai di loket atau simulasi transfer otomatis via Virtual Account (VA).
- 🖨️ **Cetak Kuitansi Digital**: Desain identik dengan kuitansi asli SMK PGRI 1 Mejobo Kudus, lengkap stempel lunas dan status syarat rapor.
- 📊 **Buku Pager Digital**: Tampilan matriks persis lembar setoran kelas (XII PM 1, XII AKL, dll.) dengan total akumulasi bawah dan fitur ekspor ke Excel `.xlsx`.
- 📱 **Kartu SPP Digital**: Matriks 12 bulan (Juli–Juni) dengan breakdown Uang Sekolah + Tabungan Wajib per bulan.
- 🎓 **Kenaikan Kelas & Kelulusan**: Wizard promosi kelas (X ➔ XI ➔ XII ➔ Alumni) yang secara otomatis mengunci tunggakan lama ke kolom piutang tahun lalu.
- ⚙️ **Master Tarif Multi-Jurusan & Multi-Tingkat**: Bebas mengatur biaya berbeda untuk jurusan AKL, PM, Pariwisata, atau menambah pos iuran manual baru kapan saja.
- 👥 **Role-Based View**: Pilihan akses instan untuk **Kasir & Admin TU**, **Wali Kelas** (monitoring kelasnya saja), dan **Siswa/Orang Tua**.

---

## 🚀 Cara Menjalankan di Komputer Lokal

1. **Jalankan Aplikasi Frontend:**
   ```bash
   npm run client
   ```
   Aplikasi akan langsung terbuka di browser pada `http://localhost:5173`.

2. **Jalankan Mode Fullstack (Node.js + Frontend):**
   ```bash
   npm run dev
   ```

3. **Inisialisasi Database PostgreSQL (Opsional jika ingin backend live):**
   - Atur `DATABASE_URL` di file `.env`.
   - Jalankan perintah seed:
     ```bash
     npm run db:seed
     ```

---

## 🌐 Cara Deploy ke GitHub Pages untuk Trial

1. Buat repository baru di GitHub (misal: `sitampan-smk`).
2. Push seluruh folder ini ke repository GitHub Anda:
   ```bash
   git init
   git add .
   git commit -m "Initial commit SITAMPAN SMK"
   git branch -M main
   git remote add origin https://github.com/USERNAME/sitampan-smk.git
   git push -u origin main
   ```
3. Di repository GitHub Anda, buka menu **Settings** ➔ **Pages** ➔ pada bagian **Build and deployment / Source**, pilih **GitHub Actions**.
4. Workflow otomatis yang sudah kami sediakan di `.github/workflows/deploy.yml` akan langsung mem-build dan mempublikasikan aplikasi Anda ke URL:
   `https://USERNAME.github.io/sitampan-smk/`
5. Aplikasi sudah langsung bisa dicoba (*trial*) oleh Kepala Sekolah, Guru, Wali Kelas, dan Bendahara Yayasan tanpa perlu server database aktif karena sudah dilengkapi sistem *Local Storage Auto-Save*!
