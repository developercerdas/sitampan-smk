import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { query, pool } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runSeed() {
  console.log('🔄 Memulai inisialisasi schema dan data awal PostgreSQL...');
  try {
    // 1. Baca dan eksekusi schema.sql
    const schemaSql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    await query(schemaSql);
    console.log('✅ Schema tabel PostgreSQL berhasil dibuat/diverifikasi.');

    // 2. Insert Tahun Ajaran
    await query(`
      INSERT INTO tahun_ajaran (nama, is_active) 
      VALUES ('2026/2027', true), ('2025/2026', false)
      ON CONFLICT (nama) DO NOTHING;
    `);

    // 3. Insert Jurusan SMK PGRI 1 Mejobo
    await query(`
      INSERT INTO jurusan (kode, nama, deskripsi) VALUES 
      ('AKL', 'Akuntansi dan Keuangan Lembaga', 'Program keahlian akuntansi dan tata kelola keuangan'),
      ('PM', 'Pemasaran / Bisnis Daring', 'Program keahlian bisnis ritel dan pemasaran digital'),
      ('PAR', 'Perhotelan dan Pariwisata', 'Program keahlian perhotelan dan jasa pariwisata'),
      ('TKRO', 'Teknik Kendaraan Ringan Otomotif', 'Program keahlian otomotif dan rekayasa mekanik')
      ON CONFLICT (kode) DO NOTHING;
    `);

    // 4. Insert Pos Biaya
    await query(`
      INSERT INTO pos_biaya (kode, nama, tipe, keterangan) VALUES
      ('SPP', 'Uang Sekolah (SPP Bulanan)', 'BULANAN', 'Iuran SPP wajib per bulan'),
      ('TABUNGAN', 'Tabungan Wajib Bulanan', 'BULANAN', 'Tabungan wajib ujian & administrasi per bulan'),
      ('DU', 'Daftar Ulang (DU Paket Lengkap)', 'SEKALI_BAYAR', 'Paket administrasi pendaftaran ulang tahunan'),
      ('OSIS', 'Iuran OSIS 1 Tahun', 'SEKALI_BAYAR', 'Iuran kegiatan OSIS tahunan'),
      ('PGRI', 'Iuran PGRI 1 Tahun', 'SEKALI_BAYAR', 'Iuran keanggotaan persatuan guru RI'),
      ('MAJALAH', 'Majalah, Pentas Seni & Pelepasan', 'SEKALI_BAYAR', 'Biaya majalah sekolah Kharisma dan perpisahan'),
      ('SARPRAS', 'Perawatan Sarana & Prasarana', 'SEKALI_BAYAR', 'Pemeliharaan fasilitas sekolah'),
      ('MPLS', 'Kegiatan MPLS', 'SEKALI_BAYAR', 'Masa Pengenalan Lingkungan Sekolah'),
      ('PERPUS', 'Pengembangan Perpustakaan', 'SEKALI_BAYAR', 'Pengadaan literasi dan perpustakaan'),
      ('KOPERASI', 'Pengembangan Koperasi Siswa', 'SEKALI_BAYAR', 'Iuran keanggotaan koperasi siswa'),
      ('KARTU_FOTO', 'Pembuatan Kartu OSIS & Foto Raport', 'SEKALI_BAYAR', 'Penerbitan kartu pelajar & foto cetak rapor'),
      ('SPI', 'Sumbangan Pengembangan Institusi (SPI)', 'SEKALI_BAYAR', 'Uang pembangunan gedung & fasilitas')
      ON CONFLICT (kode) DO NOTHING;
    `);

    console.log('✅ Seed Master Data Dasar Berhasil!');
  } catch (error) {
    console.error('❌ Gagal menjalankan seed PostgreSQL:', error.message);
  } finally {
    await pool.end();
  }
}

runSeed();
