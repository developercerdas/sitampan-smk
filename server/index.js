import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { query } from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// 1. Health & Database Check
app.get('/api/status', async (req, res) => {
  try {
    const dbRes = await query('SELECT NOW() as server_time');
    res.json({
      status: 'ONLINE',
      app: 'SITAMPAN SMK API (Node.js + PostgreSQL)',
      sekolah: 'SMK PGRI 1 Mejobo Kudus',
      db_time: dbRes.rows[0].server_time
    });
  } catch (error) {
    res.json({
      status: 'HYBRID_STANDALONE',
      app: 'SITAMPAN SMK API',
      sekolah: 'SMK PGRI 1 Mejobo Kudus',
      db_note: 'PostgreSQL lokal/cloud belum terhubung, beralih ke mode Client-Trial GitHub Pages.',
      error: error.message
    });
  }
});

// 2. Master Data (Tahun Ajaran, Jurusan, Kelas, Pos Biaya)
app.get('/api/master', async (req, res) => {
  try {
    const [tahun, jurusan, kelas, pos, tarif] = await Promise.all([
      query('SELECT * FROM tahun_ajaran ORDER BY id DESC'),
      query('SELECT * FROM jurusan ORDER BY kode ASC'),
      query('SELECT k.*, j.nama as nama_jurusan FROM kelas k LEFT JOIN jurusan j ON k.jurusan_id = j.id ORDER BY k.tingkat DESC, k.nama_kelas ASC'),
      query('SELECT * FROM pos_biaya ORDER BY id ASC'),
      query('SELECT * FROM tarif_biaya')
    ]);

    res.json({
      tahun_ajaran: tahun.rows,
      jurusan: jurusan.rows,
      kelas: kelas.rows,
      pos_biaya: pos.rows,
      tarif: tarif.rows
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Data Siswa
app.get('/api/siswa', async (req, res) => {
  try {
    const { kelas_id, status } = req.query;
    let sql = `
      SELECT s.*, k.nama_kelas, k.tingkat, k.wali_kelas, j.kode as kode_jurusan, j.nama as nama_jurusan 
      FROM siswa s
      LEFT JOIN kelas k ON s.kelas_id = k.id
      LEFT JOIN jurusan j ON k.jurusan_id = j.id
      WHERE 1=1
    `;
    const params = [];
    if (kelas_id) {
      params.push(kelas_id);
      sql += ` AND s.kelas_id = $${params.length}`;
    }
    if (status) {
      params.push(status);
      sql += ` AND s.status = $${params.length}`;
    }
    sql += ' ORDER BY s.nama ASC';
    const result = await query(sql, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Tagihan Siswa
app.get('/api/tagihan/:siswa_id', async (req, res) => {
  try {
    const { siswa_id } = req.params;
    const result = await query(`
      SELECT t.*, p.nama as nama_pos, p.kode as kode_pos, p.tipe as tipe_pos
      FROM tagihan_siswa t
      JOIN pos_biaya p ON t.pos_biaya_id = p.id
      WHERE t.siswa_id = $1
      ORDER BY t.tahun_ajaran_id DESC, t.bulan ASC, p.id ASC
    `, [siswa_id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Pembayaran Kasir / VA (Proses Transaksi)
app.post('/api/bayar', async (req, res) => {
  const { siswa_id, items, metode, nomor_referensi, petugas, catatan } = req.body;
  // items: [{ tagihan_id, bayar }]
  try {
    const totalBayar = items.reduce((acc, it) => acc + Number(it.bayar), 0);
    const noTransaksi = `KWT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Insert Pembayaran
    const insPay = await query(`
      INSERT INTO pembayaran (no_transaksi, siswa_id, total_bayar, metode, nomor_referensi, petugas, catatan)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `, [noTransaksi, siswa_id, totalBayar, metode || 'TUNAI', nomor_referensi || null, petugas || 'Kasir TU', catatan || '']);

    const pembayaranId = insPay.rows[0].id;

    // Loop update tagihan & detail
    for (const item of items) {
      await query(`
        INSERT INTO pembayaran_detail (pembayaran_id, tagihan_id, jumlah_bayar)
        VALUES ($1, $2, $3)
      `, [pembayaranId, item.tagihan_id, item.bayar]);

      await query(`
        UPDATE tagihan_siswa 
        SET terbayar = terbayar + $1,
            status = CASE 
              WHEN (terbayar + $1) >= nominal THEN 'LUNAS'
              ELSE 'SEBAGIAN'
            END
        WHERE id = $2
      `, [item.bayar, item.tagihan_id]);
    }

    res.json({
      success: true,
      message: 'Pembayaran berhasil disimpan.',
      transaksi: insPay.rows[0]
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 6. Webhook Simulasi Virtual Account (Bank Notification)
app.post('/api/va/webhook', async (req, res) => {
  const { nomor_va, nominal, no_ref_bank } = req.body;
  try {
    // Cari siswa dari nomor VA
    const sRes = await query('SELECT id, nama FROM siswa WHERE nomor_va = $1', [nomor_va]);
    if (sRes.rows.length === 0) {
      return res.status(404).json({ error: 'Nomor Virtual Account tidak terdaftar' });
    }
    const siswa = sRes.rows[0];

    // Cari tagihan tertua yang belum lunas
    const tagihanRes = await query(`
      SELECT id, (nominal - terbayar) as sisa 
      FROM tagihan_siswa 
      WHERE siswa_id = $1 AND status != 'LUNAS' 
      ORDER BY bulan ASC, id ASC
    `, [siswa.id]);

    let sisaUang = Number(nominal);
    const bayarItems = [];

    for (const t of tagihanRes.rows) {
      if (sisaUang <= 0) break;
      const bayar = Math.min(sisaUang, Number(t.sisa));
      bayarItems.push({ tagihan_id: t.id, bayar });
      sisaUang -= bayar;
    }

    // Eksekusi pembayaran otomatis
    const noTransaksi = `VA-${Date.now()}-${no_ref_bank || 'AUTO'}`;
    const insPay = await query(`
      INSERT INTO pembayaran (no_transaksi, siswa_id, total_bayar, metode, nomor_referensi, petugas, catatan)
      VALUES ($1, $2, $3, 'VA_TRANSFER', $4, 'SISTEM VA AUTO', 'Pembayaran via Virtual Account')
      RETURNING *
    `, [noTransaksi, siswa.id, nominal, no_ref_bank]);

    for (const item of bayarItems) {
      await query(`
        INSERT INTO pembayaran_detail (pembayaran_id, tagihan_id, jumlah_bayar)
        VALUES ($1, $2, $3)
      `, [insPay.rows[0].id, item.tagihan_id, item.bayar]);

      await query(`
        UPDATE tagihan_siswa 
        SET terbayar = terbayar + $1,
            status = CASE 
              WHEN (terbayar + $1) >= nominal THEN 'LUNAS'
              ELSE 'SEBAGIAN'
            END
        WHERE id = $2
      `, [item.bayar, item.tagihan_id]);
    }

    res.json({
      success: true,
      message: `Pembayaran VA sebesar Rp ${nominal} untuk siswa ${siswa.nama} berhasil diproses otomatis!`,
      no_transaksi: noTransaksi
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 7. Kenaikan Kelas / Promosi Massal
app.post('/api/kenaikan-kelas', async (req, res) => {
  const { kelas_asal_id, kelas_tujuan_id, siswa_ids, tahun_ajaran_baru_id, aksi } = req.body;
  // aksi: 'PROMOSI' atau 'LULUS'
  try {
    for (const sId of siswa_ids) {
      // Hitung total sisa tunggakan belum lunas
      const tunggakanRes = await query(`
        SELECT COALESCE(SUM(nominal - terbayar), 0) as total_tunggakan 
        FROM tagihan_siswa 
        WHERE siswa_id = $1 AND status != 'LUNAS'
      `, [sId]);
      const sisaTunggakan = tunggakanRes.rows[0].total_tunggakan;

      if (aksi === 'LULUS') {
        await query(`UPDATE siswa SET status = 'LULUS' WHERE id = $1`, [sId]);
        await query(`
          INSERT INTO riwayat_kenaikan (siswa_id, dari_kelas_id, ke_kelas_id, tahun_ajaran_id, status_tunggakan_lama, catatan)
          VALUES ($1, $2, NULL, $3, $4, 'Dinyatakan Lulus / Alumni')
        `, [sId, kelas_asal_id, tahun_ajaran_baru_id, sisaTunggakan]);
      } else {
        await query(`UPDATE siswa SET kelas_id = $1 WHERE id = $2`, [kelas_tujuan_id, sId]);
        await query(`
          INSERT INTO riwayat_kenaikan (siswa_id, dari_kelas_id, ke_kelas_id, tahun_ajaran_id, status_tunggakan_lama, catatan)
          VALUES ($1, $2, $3, $4, $5, 'Naik Kelas')
        `, [sId, kelas_asal_id, kelas_tujuan_id, tahun_ajaran_baru_id, sisaTunggakan]);
      }
    }

    res.json({
      success: true,
      message: `Berhasil memproses status untuk ${siswa_ids.length} siswa.`
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 SITAMPAN SMK Node.js Server berjalan di port http://localhost:${PORT}`);
});
