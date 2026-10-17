-- =========================================================================
-- DATABASE SCHEMA: SITAMPAN SMK (SMK PGRI 1 MEJOBO KUDUS)
-- PostgreSQL Database Definition
-- =========================================================================

-- 1. Tabel Tahun Ajaran
CREATE TABLE IF NOT EXISTS tahun_ajaran (
    id SERIAL PRIMARY KEY,
    nama VARCHAR(20) NOT NULL UNIQUE, -- Contoh: '2026/2027', '2025/2026'
    is_active BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabel Master Jurusan / Program Keahlian
CREATE TABLE IF NOT EXISTS jurusan (
    id SERIAL PRIMARY KEY,
    kode VARCHAR(10) NOT NULL UNIQUE, -- Contoh: 'AKL', 'PM', 'PAR', 'TKRO'
    nama VARCHAR(100) NOT NULL,       -- Contoh: 'Akuntansi dan Keuangan Lembaga', 'Pemasaran', 'Perhotelan/Pariwisata'
    deskripsi TEXT
);

-- 3. Tabel Master Kelas & Rombel
CREATE TABLE IF NOT EXISTS kelas (
    id SERIAL PRIMARY KEY,
    tingkat VARCHAR(5) NOT NULL,       -- 'X', 'XI', 'XII'
    jurusan_id INTEGER REFERENCES jurusan(id) ON DELETE CASCADE,
    rombel VARCHAR(5) NOT NULL,        -- '1', '2', '3'
    nama_kelas VARCHAR(50) NOT NULL,   -- 'XII PM 1', 'XII AKL', 'XI PAR'
    wali_kelas VARCHAR(100),           -- Contoh: 'Hj. Khofifah, S.Pd'
    tahun_ajaran_id INTEGER REFERENCES tahun_ajaran(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Tabel Siswa
CREATE TABLE IF NOT EXISTS siswa (
    id SERIAL PRIMARY KEY,
    nis VARCHAR(20) NOT NULL UNIQUE,
    nisn VARCHAR(20),
    nama VARCHAR(150) NOT NULL,
    jenis_kelamin VARCHAR(10) DEFAULT 'L', -- 'L' / 'P'
    kelas_id INTEGER REFERENCES kelas(id) ON DELETE SET NULL,
    nomor_va VARCHAR(30) UNIQUE,           -- Virtual Account (misal: 880123456789)
    telepon_ortu VARCHAR(20),
    alamat TEXT,
    status VARCHAR(20) DEFAULT 'AKTIF',    -- 'AKTIF', 'LULUS', 'PINDAH', 'KELUAR'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Tabel Master Pos Biaya (SPP & Biaya Lain-Lain)
CREATE TABLE IF NOT EXISTS pos_biaya (
    id SERIAL PRIMARY KEY,
    kode VARCHAR(20) NOT NULL UNIQUE,     -- 'SPP', 'TABUNGAN', 'DU', 'SPI', 'OSIS', 'PGRI', 'MAJALAH', 'MPLS', 'PAS'
    nama VARCHAR(150) NOT NULL,          -- 'Uang Sekolah (SPP)', 'Iuran OSIS 1 Tahun', dll.
    tipe VARCHAR(20) NOT NULL,           -- 'BULANAN' atau 'SEKALI_BAYAR'
    keterangan TEXT
);

-- 6. Tabel Master Tarif (Matrix: Pos Biaya x Tahun Ajaran x Tingkat x Jurusan)
CREATE TABLE IF NOT EXISTS tarif_biaya (
    id SERIAL PRIMARY KEY,
    pos_biaya_id INTEGER REFERENCES pos_biaya(id) ON DELETE CASCADE,
    tahun_ajaran_id INTEGER REFERENCES tahun_ajaran(id) ON DELETE CASCADE,
    tingkat VARCHAR(5) NOT NULL,          -- 'X', 'XI', 'XII', atau 'SEMUA'
    jurusan_id INTEGER REFERENCES jurusan(id) ON DELETE CASCADE, -- NULL jika berlaku untuk semua jurusan
    nominal NUMERIC(12, 2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Tabel Tagihan Siswa (Generated per Siswa per Pos / Bulan)
CREATE TABLE IF NOT EXISTS tagihan_siswa (
    id SERIAL PRIMARY KEY,
    siswa_id INTEGER REFERENCES siswa(id) ON DELETE CASCADE,
    pos_biaya_id INTEGER REFERENCES pos_biaya(id) ON DELETE CASCADE,
    tahun_ajaran_id INTEGER REFERENCES tahun_ajaran(id) ON DELETE CASCADE,
    tingkat VARCHAR(5) NOT NULL,          -- Tingkat saat tagihan diterbitkan ('X', 'XI', 'XII')
    bulan INTEGER DEFAULT 0,              -- 1 (Juli) s.d 12 (Juni), 0 untuk jenis SEKALI_BAYAR
    nominal NUMERIC(12, 2) NOT NULL,
    terbayar NUMERIC(12, 2) NOT NULL DEFAULT 0,
    status VARCHAR(20) DEFAULT 'BELUM_BAYAR', -- 'BELUM_BAYAR', 'SEBAGIAN', 'LUNAS'
    jatuh_tempo DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. Tabel Pembayaran / Kuitansi (Mencatat Pembayaran Kasir & VA)
CREATE TABLE IF NOT EXISTS pembayaran (
    id SERIAL PRIMARY KEY,
    no_transaksi VARCHAR(50) NOT NULL UNIQUE, -- Contoh: 'KWT-20261017-0001'
    siswa_id INTEGER REFERENCES siswa(id) ON DELETE CASCADE,
    tanggal_bayar TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_bayar NUMERIC(12, 2) NOT NULL,
    metode VARCHAR(20) NOT NULL DEFAULT 'TUNAI', -- 'TUNAI', 'VA_TRANSFER', 'MANUAL_TRANSFER'
    nomor_referensi VARCHAR(100),               -- No ref mutasi bank jika via VA
    petugas VARCHAR(100) DEFAULT 'Kasir TU',
    catatan TEXT,
    boleh_ambil_raport BOOLEAN DEFAULT true
);

-- 9. Tabel Detail Pembayaran (Alokasi per Tagihan)
CREATE TABLE IF NOT EXISTS pembayaran_detail (
    id SERIAL PRIMARY KEY,
    pembayaran_id INTEGER REFERENCES pembayaran(id) ON DELETE CASCADE,
    tagihan_id INTEGER REFERENCES tagihan_siswa(id) ON DELETE CASCADE,
    jumlah_bayar NUMERIC(12, 2) NOT NULL
);

-- 10. Tabel Riwayat Kenaikan Kelas & Kelulusan (Audit Trail)
CREATE TABLE IF NOT EXISTS riwayat_kenaikan (
    id SERIAL PRIMARY KEY,
    siswa_id INTEGER REFERENCES siswa(id) ON DELETE CASCADE,
    dari_kelas_id INTEGER REFERENCES kelas(id) ON DELETE SET NULL,
    ke_kelas_id INTEGER REFERENCES kelas(id) ON DELETE SET NULL,
    tahun_ajaran_id INTEGER REFERENCES tahun_ajaran(id) ON DELETE CASCADE,
    status_tunggakan_lama NUMERIC(12, 2) DEFAULT 0, -- Sisa tunggakan yang terbawa
    tanggal_proses TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    catatan TEXT
);

-- 11. Tabel Pengguna / Users (Multi-Role)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    nama VARCHAR(150) NOT NULL,
    role VARCHAR(20) NOT NULL, -- 'ADMIN', 'KASIR', 'WALI_KELAS', 'SISWA', 'KEPSEK'
    ref_id INTEGER,           -- ID Kelas untuk Wali Kelas, atau ID Siswa untuk Siswa/Ortu
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indeks untuk kecepatan query
CREATE INDEX IF NOT EXISTS idx_tagihan_siswa ON tagihan_siswa(siswa_id, status);
CREATE INDEX IF NOT EXISTS idx_siswa_kelas ON siswa(kelas_id, status);
CREATE INDEX IF NOT EXISTS idx_pembayaran_siswa ON pembayaran(siswa_id, tanggal_bayar);
