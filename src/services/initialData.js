// Data Awal Tersamarkan (Anonymized) untuk Trial & Demo Publik SITAMPAN SMK

export const INITIAL_DATA = {
  sekolah: {
    nama: 'SMK BINA KARYA NUSANTARA',
    yayasan: 'Yayasan Lembaga Pendidikan Kejuruan Nusantara (YLPKN)',
    alamat: 'Jalan Pendidikan Vokasi No. 45, Kompleks Pendidikan Nasional',
    akreditasi: 'A (Unggul)',
    telp: '(021) 7891234 / Fax: (021) 7891235',
    email: 'info@smkbinakarya.sch.id',
    web: 'https://smkbinakarya.sch.id',
    kepalaSekolah: 'Drs. H. Mulyadi, M.Pd.',
    tahunAjaranAktif: '2026/2027',
    bankMitra: 'Bank BNI / Jateng / Mandiri Virtual Account',
    logoUrl: null
  },

  jurusan: [
    { 
      id: 1, 
      kode: 'AKL', 
      nama: 'Akuntansi dan Keuangan Lembaga', 
      kelompok: 'BISNIS_MANAJEMEN', 
      namaKelompok: 'Bisnis & Manajemen', 
      kasirPj: 'Hana', 
      warna: 'blue' 
    },
    { 
      id: 2, 
      kode: 'MPLB', 
      nama: 'Manajemen Perkantoran dan Layanan Bisnis', 
      kelompok: 'BISNIS_MANAJEMEN', 
      namaKelompok: 'Bisnis & Manajemen', 
      kasirPj: 'Hana', 
      warna: 'indigo' 
    },
    { 
      id: 3, 
      kode: 'PM', 
      nama: 'Pemasaran', 
      kelompok: 'BISNIS_MANAJEMEN', 
      namaKelompok: 'Bisnis & Manajemen', 
      kasirPj: 'Hana', 
      warna: 'emerald' 
    },
    { 
      id: 4, 
      kode: 'KSP', 
      nama: 'Kecantikan & Spa', 
      kelompok: 'PARIWISATA', 
      namaKelompok: 'Pariwisata', 
      kasirPj: 'Umi', 
      warna: 'rose' 
    },
    { 
      id: 5, 
      kode: 'HTL', 
      nama: 'Perhotelan', 
      kelompok: 'PARIWISATA', 
      namaKelompok: 'Pariwisata', 
      kasirPj: 'Umi', 
      warna: 'amber' 
    }
  ],

  kelas: [
    { id: 1, nama: 'XII PM 1', tingkat: 'XII', jurusanKode: 'PM', rombel: '1', kelompok: 'BISNIS_MANAJEMEN', waliKelas: 'Dra. Hj. Sri Lestari, M.Pd' },
    { id: 2, nama: 'XII AKL 1', tingkat: 'XII', jurusanKode: 'AKL', rombel: '1', kelompok: 'BISNIS_MANAJEMEN', waliKelas: 'Ahmad Junaidi, S.Pd' },
    { id: 3, nama: 'XI MPLB 1', tingkat: 'XI', jurusanKode: 'MPLB', rombel: '1', kelompok: 'BISNIS_MANAJEMEN', waliKelas: 'Hendra Gunawan, S.Pd' },
    { id: 4, nama: 'XI KSP 1', tingkat: 'XI', jurusanKode: 'KSP', rombel: '1', kelompok: 'PARIWISATA', waliKelas: 'Ratna Dewi, S.Pd' },
    { id: 5, nama: 'X HTL 1', tingkat: 'X', jurusanKode: 'HTL', rombel: '1', kelompok: 'PARIWISATA', waliKelas: 'Siti Nurjanah, S.Pd' }
  ],

  posBiaya: [
    { 
      id: 'SPP', 
      nama: 'Uang Sekolah (SPP Bulanan)', 
      tipe: 'BULANAN', 
      nominalDefault: 325000,
      targetJurusan: 'SEMUA',
      targetTingkat: 'SEMUA',
      tarifJurusan: {
        AKL: 325000,
        MPLB: 325000,
        PM: 325000,
        KSP: 375000,
        HTL: 360000
      },
      keterangan: 'Tarif SPP disesuaikan dengan kebutuhan modul & praktek kejuruan'
    },
    { 
      id: 'TABUNGAN', 
      nama: 'Tabungan Wajib Bulanan', 
      tipe: 'BULANAN', 
      nominalDefault: 25000,
      targetJurusan: 'SEMUA',
      targetTingkat: 'SEMUA',
      keterangan: 'Tabungan persiapan biaya uji kompetensi & ujian'
    },
    { 
      id: 'DU', 
      nama: 'Daftar Ulang (DU + Juli)', 
      tipe: 'SEKALI_BAYAR', 
      nominalDefault: 905000,
      targetJurusan: 'SEMUA',
      targetTingkat: 'SEMUA',
      tarifJurusan: {
        AKL: 905000,
        MPLB: 905000,
        PM: 905000,
        KSP: 965000,
        HTL: 950000
      },
      keterangan: 'Daftar ulang tahunan dan SPP bulan Juli'
    },
    { 
      id: 'SPI', 
      nama: 'Sumbangan Pengembangan Institusi (SPI / Gedung)', 
      tipe: 'SEKALI_BAYAR', 
      nominalDefault: 2000000,
      targetJurusan: 'SEMUA',
      targetTingkat: 'X',
      keterangan: 'Uang pangkal gedung sarana prasarana awal masuk'
    },
    { 
      id: 'PRAKTIK_KSP', 
      nama: 'Biaya Bahan Praktik Kecantikan, Facial & Spa', 
      tipe: 'SEKALI_BAYAR', 
      nominalDefault: 350000,
      targetJurusan: 'KSP',
      targetTingkat: 'SEMUA',
      keterangan: 'Khusus siswa Jurusan Kecantikan & Spa (Bahan kosmetik, facial, nail art & spa)'
    },
    { 
      id: 'PRAKTIK_HTL', 
      nama: 'Biaya Bahan Praktik Dapur & Tata Hidang Perhotelan', 
      tipe: 'SEKALI_BAYAR', 
      nominalDefault: 325000,
      targetJurusan: 'HTL',
      targetTingkat: 'SEMUA',
      keterangan: 'Khusus siswa Jurusan Perhotelan (Table manner, cooking & linen laundry)'
    },
    { 
      id: 'PRAKTIK_BISMAN', 
      nama: 'Biaya Praktik Lab Komputer Akuntansi & Kasir Ritel', 
      tipe: 'SEKALI_BAYAR', 
      nominalDefault: 250000,
      targetJurusan: 'SEMUA',
      targetTingkat: 'SEMUA',
      keterangan: 'Khusus siswa Kelompok Bisnis Manajemen (AKL, MPLB, PM)'
    },
    { 
      id: 'UKK', 
      nama: 'Uji Kompetensi Keahlian (UKK / LSP-P1)', 
      tipe: 'SEKALI_BAYAR', 
      nominalDefault: 450000,
      targetJurusan: 'SEMUA',
      targetTingkat: 'XII',
      tarifJurusan: {
        AKL: 400000,
        MPLB: 400000,
        PM: 400000,
        KSP: 475000,
        HTL: 450000
      },
      keterangan: 'Uji sertifikasi kejuruan BNSP tingkat akhir'
    },
    { 
      id: 'OSIS', 
      nama: 'Iuran OSIS (1 Tahun)', 
      tipe: 'SEKALI_BAYAR', 
      nominalDefault: 220000,
      targetJurusan: 'SEMUA',
      targetTingkat: 'SEMUA'
    },
    { 
      id: 'LEMBAGA', 
      nama: 'Iuran Pembinaan Lembaga (1 Tahun)', 
      tipe: 'SEKALI_BAYAR', 
      nominalDefault: 20000,
      targetJurusan: 'SEMUA',
      targetTingkat: 'SEMUA'
    },
    { 
      id: 'MAJALAH', 
      nama: 'Majalah, Pentas Seni & Pelepasan', 
      tipe: 'SEKALI_BAYAR', 
      nominalDefault: 225000,
      targetJurusan: 'SEMUA',
      targetTingkat: 'XII'
    },
    { 
      id: 'SARPRAS', 
      nama: 'Perawatan Sarana Prasarana', 
      tipe: 'SEKALI_BAYAR', 
      nominalDefault: 100000,
      targetJurusan: 'SEMUA',
      targetTingkat: 'SEMUA'
    },
    { 
      id: 'MPLS', 
      nama: 'Kegiatan MPLS & Pengenalan Vokasi', 
      tipe: 'SEKALI_BAYAR', 
      nominalDefault: 25000,
      targetJurusan: 'SEMUA',
      targetTingkat: 'X'
    },
    { 
      id: 'KARTU_FOTO', 
      nama: 'Kartu Pelajar & Pasfoto Raport', 
      tipe: 'SEKALI_BAYAR', 
      nominalDefault: 20000,
      targetJurusan: 'SEMUA',
      targetTingkat: 'X'
    },
    { 
      id: 'TUNGGAKAN_LALU', 
      nama: 'Tunggakan SPP Tahun Lalu', 
      tipe: 'SEKALI_BAYAR', 
      nominalDefault: 0,
      targetJurusan: 'SEMUA',
      targetTingkat: 'XII'
    }
  ],

  // Seluruh Nama Siswa Telah Disamarkan (Anonymized) untuk Menjaga Privasi Data Sekolah
  siswa: [
    {
      id: 1,
      nis: '12643',
      nisn: '0061234561',
      nama: 'Ahmad Fauzi Ramadhan',
      tanggalLahir: '2008-05-12',
      kelasId: 1, // XII PM 1
      jurusanKode: 'PM',
      tingkat: 'XII',
      va: '880812643001',
      telepon: '08123456701',
      status: 'AKTIF',
      spi: 0,
      tunggakanLalu: 0,
      duJuli: 905000,
      bayarBulanan: {
        'Agustus': 325000,
        'September': 325000,
        'Oktober': 325000,
        'November': 325000,
        'Desember': 0
      }
    },
    {
      id: 2,
      nis: '12644',
      nisn: '0061234562',
      nama: 'Adelia Citra Lestari',
      tanggalLahir: '2008-06-18',
      kelasId: 1,
      jurusanKode: 'PM',
      tingkat: 'XII',
      va: '880812644002',
      telepon: '08123456702',
      status: 'AKTIF',
      spi: 0,
      tunggakanLalu: 0,
      duJuli: 905000,
      bayarBulanan: {
        'Agustus': 325000,
        'September': 325000,
        'Oktober': 325000,
        'November': 325000,
        'Desember': 325000
      }
    },
    {
      id: 3,
      nis: '12645',
      nisn: '0061234563',
      nama: 'Cantika Putri Maharani',
      tanggalLahir: '2008-03-22',
      kelasId: 1,
      jurusanKode: 'PM',
      tingkat: 'XII',
      va: '880812645003',
      telepon: '08123456703',
      status: 'AKTIF',
      spi: 0,
      tunggakanLalu: 0,
      duJuli: 905000,
      bayarBulanan: {
        'Agustus': 325000,
        'September': 325000,
        'Oktober': 325000,
        'November': 325000,
        'Desember': 325000
      }
    },
    {
      id: 4,
      nis: '12649',
      nisn: '0061234564',
      nama: 'Erlina Dwi Astuti',
      tanggalLahir: '2008-09-14',
      kelasId: 1,
      jurusanKode: 'PM',
      tingkat: 'XII',
      va: '880812649004',
      telepon: '08123456704',
      status: 'AKTIF',
      spi: 0,
      tunggakanLalu: 0,
      duJuli: 905000,
      bayarBulanan: {
        'Agustus': 325000,
        'September': 0,
        'Oktober': 325000,
        'November': 325000,
        'Desember': 325000
      }
    },
    {
      id: 5,
      nis: '12650',
      nisn: '0061234565',
      nama: 'Elvira Rahmawati',
      tanggalLahir: '2008-12-05',
      kelasId: 1,
      jurusanKode: 'PM',
      tingkat: 'XII',
      va: '880812650005',
      telepon: '08123456705',
      status: 'AKTIF',
      spi: 0,
      tunggakanLalu: 0,
      duJuli: 905000,
      bayarBulanan: {
        'Agustus': 0,
        'September': 0,
        'Oktober': 325000,
        'November': 325000,
        'Desember': 325000
      }
    },
    {
      id: 6,
      nis: '12651',
      nisn: '0061234566',
      nama: 'Gita Melani Safitri',
      tanggalLahir: '2008-04-11',
      kelasId: 1,
      jurusanKode: 'PM',
      tingkat: 'XII',
      va: '880812651006',
      telepon: '08123456706',
      status: 'AKTIF',
      spi: 0,
      tunggakanLalu: 0,
      duJuli: 905000,
      bayarBulanan: {
        'Agustus': 0,
        'September': 0,
        'Oktober': 325000,
        'November': 325000,
        'Desember': 325000
      }
    },
    {
      id: 7,
      nis: '12652',
      nisn: '0061234567',
      nama: 'Lestari Nur Indah',
      tanggalLahir: '2008-11-03',
      kelasId: 1,
      jurusanKode: 'PM',
      tingkat: 'XII',
      va: '880812652007',
      telepon: '08123456707',
      status: 'AKTIF',
      spi: 745000,
      tunggakanLalu: 2275000,
      duJuli: 905000,
      bayarBulanan: {
        'Agustus': 325000,
        'September': 325000,
        'Oktober': 325000,
        'November': 325000,
        'Desember': 325000
      }
    },
    {
      id: 8,
      nis: '12653',
      nisn: '0061234568',
      nama: 'Latifah Aulia Rahmi',
      tanggalLahir: '2008-01-28',
      kelasId: 1,
      jurusanKode: 'PM',
      tingkat: 'XII',
      va: '880812653008',
      telepon: '08123456708',
      status: 'AKTIF',
      spi: 1075000,
      tunggakanLalu: 3575000,
      duJuli: 905000,
      bayarBulanan: {
        'Agustus': 325000,
        'September': 325000,
        'Oktober': 325000,
        'November': 325000,
        'Desember': 325000
      }
    },
    {
      id: 9,
      nis: '12654',
      nisn: '0061234569',
      nama: 'Maya Shintia Dewi',
      tanggalLahir: '2008-07-09',
      kelasId: 1,
      jurusanKode: 'PM',
      tingkat: 'XII',
      va: '880812654009',
      telepon: '08123456709',
      status: 'AKTIF',
      spi: 0,
      tunggakanLalu: 0,
      duJuli: 905000,
      bayarBulanan: {
        'Agustus': 325000,
        'September': 325000,
        'Oktober': 325000,
        'November': 325000,
        'Desember': 325000
      }
    },
    {
      id: 10,
      nis: '12655',
      nisn: '0061234570',
      nama: 'Muhammad Bagas Pratama',
      tanggalLahir: '2008-10-15',
      kelasId: 1,
      jurusanKode: 'PM',
      tingkat: 'XII',
      va: '880812655010',
      telepon: '08123456710',
      status: 'AKTIF',
      spi: 0,
      tunggakanLalu: 0,
      duJuli: 905000,
      bayarBulanan: {
        'Agustus': 0,
        'September': 0,
        'Oktober': 325000,
        'November': 325000,
        'Desember': 325000
      }
    },
    {
      id: 11,
      nis: '12656',
      nisn: '0061234571',
      nama: 'Muhammad Aditya Pratama',
      tanggalLahir: '2008-02-14',
      kelasId: 1,
      jurusanKode: 'PM',
      tingkat: 'XII',
      va: '880812656011',
      telepon: '08123456711',
      status: 'AKTIF',
      spi: 0,
      tunggakanLalu: 1950000,
      duJuli: 905000,
      bayarBulanan: {
        'Agustus': 325000,
        'September': 325000,
        'Oktober': 325000,
        'November': 325000,
        'Desember': 325000
      }
    },
    {
      id: 12,
      nis: '12657',
      nisn: '0061234572',
      nama: 'Muhammad Dimas Saputra',
      tanggalLahir: '2008-08-30',
      kelasId: 1,
      jurusanKode: 'PM',
      tingkat: 'XII',
      va: '880812657012',
      telepon: '08123456712',
      status: 'AKTIF',
      spi: 2000000,
      tunggakanLalu: 0,
      duJuli: 905000,
      bayarBulanan: {
        'Agustus': 0,
        'September': 0,
        'Oktober': 325000,
        'November': 325000,
        'Desember': 325000
      }
    },
    {
      id: 13,
      nis: '12658',
      nisn: '0061234573',
      nama: 'Nabila Salma Az-Zahra',
      tanggalLahir: '2008-05-19',
      kelasId: 1,
      jurusanKode: 'PM',
      tingkat: 'XII',
      va: '880812658013',
      telepon: '08123456713',
      status: 'AKTIF',
      spi: 0,
      tunggakanLalu: 0,
      duJuli: 905000,
      bayarBulanan: {
        'Agustus': 325000,
        'September': 325000,
        'Oktober': 325000,
        'November': 325000,
        'Desember': 325000
      }
    },
    {
      id: 14,
      nis: '12659',
      nisn: '0061234574',
      nama: 'Naufal Hidayatullah',
      tanggalLahir: '2008-06-25',
      kelasId: 1,
      jurusanKode: 'PM',
      tingkat: 'XII',
      va: '880812659014',
      telepon: '08123456714',
      status: 'AKTIF',
      spi: 0,
      tunggakanLalu: 0,
      duJuli: 0,
      bayarBulanan: {
        'Agustus': 0,
        'September': 0,
        'Oktober': 325000,
        'November': 325000,
        'Desember': 325000
      }
    },
    {
      id: 15,
      nis: '12660',
      nisn: '0061234575',
      nama: 'Okta Viana Rahma',
      tanggalLahir: '2008-10-08',
      kelasId: 1,
      jurusanKode: 'PM',
      tingkat: 'XII',
      va: '880812660015',
      telepon: '08123456715',
      status: 'AKTIF',
      spi: 0,
      tunggakanLalu: 0,
      duJuli: 905000,
      bayarBulanan: {
        'Agustus': 325000,
        'September': 325000,
        'Oktober': 325000,
        'November': 325000,
        'Desember': 325000
      }
    },
    {
      id: 16,
      nis: '12661',
      nisn: '0061234576',
      nama: 'Rani Febrianti Putri',
      tanggalLahir: '2008-02-27',
      kelasId: 1,
      jurusanKode: 'PM',
      tingkat: 'XII',
      va: '880812661016',
      telepon: '08123456716',
      status: 'AKTIF',
      spi: 0,
      tunggakanLalu: 0,
      duJuli: 905000,
      bayarBulanan: {
        'Agustus': 325000,
        'September': 325000,
        'Oktober': 325000,
        'November': 325000,
        'Desember': 325000
      }
    },
    {
      id: 17,
      nis: '12663',
      nisn: '0061234577',
      nama: 'Rizky Arya Pratama',
      tanggalLahir: '2008-09-02',
      kelasId: 1,
      jurusanKode: 'PM',
      tingkat: 'XII',
      va: '880812663017',
      telepon: '08123456717',
      status: 'AKTIF',
      spi: 0,
      tunggakanLalu: 0,
      duJuli: 905000,
      bayarBulanan: {
        'Agustus': 325000,
        'September': 325000,
        'Oktober': 325000,
        'November': 325000,
        'Desember': 325000
      }
    },
    {
      id: 18,
      nis: '13242',
      nisn: '0061234578',
      nama: 'Riana Kusuma Wardani',
      tanggalLahir: '2008-04-16',
      kelasId: 1,
      jurusanKode: 'PM',
      tingkat: 'XII',
      va: '880813242018',
      telepon: '08123456718',
      status: 'AKTIF',
      spi: 1920000,
      tunggakanLalu: 1625000,
      duJuli: 905000,
      bayarBulanan: {
        'Agustus': 325000,
        'September': 325000,
        'Oktober': 325000,
        'November': 325000,
        'Desember': 325000
      }
    },
    {
      id: 19,
      nis: '12664',
      nisn: '0061234579',
      nama: 'Satria Bintang Samudera',
      tanggalLahir: '2008-07-21',
      kelasId: 1,
      jurusanKode: 'PM',
      tingkat: 'XII',
      va: '880812664019',
      telepon: '08123456719',
      status: 'AKTIF',
      spi: 0,
      tunggakanLalu: 0,
      duJuli: 0,
      bayarBulanan: {
        'Agustus': 0,
        'September': 0,
        'Oktober': 325000,
        'November': 325000,
        'Desember': 325000
      }
    },
    {
      id: 20,
      nis: '12666',
      nisn: '0061234580',
      nama: 'Silvia Nur Azizah',
      tanggalLahir: '2008-11-19',
      kelasId: 1,
      jurusanKode: 'PM',
      tingkat: 'XII',
      va: '880812666020',
      telepon: '08123456720',
      status: 'AKTIF',
      spi: 0,
      tunggakanLalu: 0,
      duJuli: 0,
      bayarBulanan: {
        'Agustus': 0,
        'September': 0,
        'Oktober': 325000,
        'November': 325000,
        'Desember': 325000
      }
    },
    {
      id: 21,
      nis: '12667',
      nisn: '0061234581',
      nama: 'Sinta Ayu Lestari',
      tanggalLahir: '2008-01-07',
      kelasId: 1,
      jurusanKode: 'PM',
      tingkat: 'XII',
      va: '880812667021',
      telepon: '08123456721',
      status: 'AKTIF',
      spi: 0,
      tunggakanLalu: 0,
      duJuli: 905000,
      bayarBulanan: {
        'Agustus': 325000,
        'September': 325000,
        'Oktober': 325000,
        'November': 325000,
        'Desember': 325000
      }
    },
    {
      id: 22,
      nis: '12668',
      nisn: '0061234582',
      nama: 'Sabrina Putri Maharani',
      tanggalLahir: '2008-08-03',
      kelasId: 1,
      jurusanKode: 'PM',
      tingkat: 'XII',
      va: '880812668022',
      telepon: '08123456722',
      status: 'AKTIF',
      spi: 0,
      tunggakanLalu: 0,
      duJuli: 0,
      bayarBulanan: {
        'Agustus': 0,
        'September': 0,
        'Oktober': 0,
        'November': 325000,
        'Desember': 325000
      }
    },
    {
      id: 23,
      nis: '12669',
      nisn: '0061234583',
      nama: 'Tegar Wicaksono',
      tanggalLahir: '2008-04-25',
      kelasId: 1,
      jurusanKode: 'PM',
      tingkat: 'XII',
      va: '880812669023',
      telepon: '08123456723',
      status: 'AKTIF',
      spi: 0,
      tunggakanLalu: 3125000,
      duJuli: 0,
      bayarBulanan: {
        'Agustus': 0,
        'September': 0,
        'Oktober': 0,
        'November': 0,
        'Desember': 0
      }
    },
    // Siswa Foto 2: Kuitansi (Dewi Anggraini - XII AKL 1)
    {
      id: 24,
      nis: '12640',
      nisn: '0061234584',
      nama: 'Dewi Anggraini',
      tanggalLahir: '2008-08-17',
      kelasId: 2, // XII AKL 1
      jurusanKode: 'AKL',
      tingkat: 'XII',
      va: '880812640024',
      telepon: '08123456724',
      status: 'AKTIF',
      spi: 0,
      tunggakanLalu: 0,
      duJuli: 905000,
      bayarBulanan: {
        'Agustus': 325000,
        'September': 325000,
        'Oktober': 325000,
        'November': 0,
        'Desember': 0
      }
    },
    // Siswa Foto 3: Kartu Kuning (Anisa Larasati Putri - XI KSP 1 Kecantikan & Spa)
    {
      id: 25,
      nis: '12553',
      nisn: '0071234585',
      nama: 'Anisa Larasati Putri',
      tanggalLahir: '2009-02-20',
      kelasId: 4, // XI KSP 1
      jurusanKode: 'KSP',
      tingkat: 'XI',
      va: '880812553025',
      telepon: '08123456725',
      status: 'AKTIF',
      spi: 500000,
      tunggakanLalu: 0,
      duJuli: 965000,
      bayarBulanan: {
        'Agustus': 375000,
        'September': 375000,
        'Oktober': 375000,
        'November': 0,
        'Desember': 0
      }
    },
    // Siswa Jurusan MPLB: Rizki Maulana (XI MPLB 1)
    {
      id: 26,
      nis: '12560',
      nisn: '0071234586',
      nama: 'Rizki Maulana',
      tanggalLahir: '2009-03-10',
      kelasId: 3, // XI MPLB 1
      jurusanKode: 'MPLB',
      tingkat: 'XI',
      va: '880812560026',
      telepon: '08123456726',
      status: 'AKTIF',
      spi: 0,
      tunggakanLalu: 0,
      duJuli: 905000,
      bayarBulanan: {
        'Agustus': 325000,
        'September': 325000,
        'Oktober': 325000,
        'November': 325000,
        'Desember': 0
      }
    },
    // Siswa Jurusan Perhotelan: Kevin Pratama (X HTL 1)
    {
      id: 27,
      nis: '12670',
      nisn: '0081234587',
      nama: 'Kevin Pratama',
      tanggalLahir: '2010-01-15',
      kelasId: 5, // X HTL 1
      jurusanKode: 'HTL',
      tingkat: 'X',
      va: '880812670027',
      telepon: '08123456727',
      status: 'AKTIF',
      spi: 1500000,
      tunggakanLalu: 0,
      duJuli: 950000,
      bayarBulanan: {
        'Agustus': 360000,
        'September': 360000,
        'Oktober': 0,
        'November': 0,
        'Desember': 0
      }
    }
  ],

  // Riwayat Pembayaran Awal
  riwayatPembayaran: [
    {
      id: 'KWT-20261010-0007',
      siswaId: 24,
      namaSiswa: 'Dewi Anggraini',
      kelas: 'XII AKL',
      tanggal: '2026-10-10',
      total: 905000,
      metode: 'TUNAI',
      petugas: 'Kasir TU (Ibu Rini)',
      statusRaport: 'Boleh Ambil',
      rincian: [
        { item: 'Uang Sekolah bl. Juli 2026', nominal: 300000 },
        { item: 'Tabungan Wajib Biaya Ujian', nominal: 25000 },
        { item: 'Iuran OSIS Th. 2026/2027', nominal: 235000 },
        { item: 'Iuran Pembinaan Lembaga', nominal: 20000 },
        { item: 'Majalah, Pentas Seni & Perpisahan Kls XII', nominal: 225000 },
        { item: 'Perawatan Sarana Prasarana', nominal: 100000 }
      ]
    },
    {
      id: 'VA-20261011-8891',
      siswaId: 1,
      namaSiswa: 'Ahmad Fauzi Ramadhan',
      kelas: 'XII PM 1',
      tanggal: '2026-10-11',
      total: 325000,
      metode: 'VA_TRANSFER',
      noReferensi: 'BANK-JATENG-VA-99120',
      petugas: 'SISTEM VA AUTO',
      statusRaport: 'Boleh Ambil',
      rincian: [
        { item: 'SPP Bulan November 2026', nominal: 325000 }
      ]
    }
  ],

  // Modul Persiapan PPDB (Penerimaan Peserta Didik Baru)
  masterPpdb: {
    tahunAjaranPpdb: '2027/2028',
    gelombangAktif: 'Gelombang 1',
    periodePendaftaran: '1 Maret - 30 Juni 2027',
    bankMitraVa: 'Bank BNI / Mandiri / Jateng',
    kodePrefixVa: '8808',
    posBiayaPpdb: [
      { id: 'PPDB_FORMULIR', nama: 'Formulir & Registrasi PPDB', nominal: 150000, wajib: true },
      { id: 'PPDB_SERAGAM', nama: 'Paket Seragam & Atribut Sekolah (5 Stel)', nominal: 750000, wajib: true },
      { id: 'PPDB_MPLS', nama: 'Kegiatan MPLS & Pengenalan Vokasi', nominal: 200000, wajib: true },
      { id: 'PPDB_SPI_AWAL', nama: 'Uang Pangkal / SPI Masuk (Tahap 1)', nominal: 1000000, wajib: false }
    ],
    kuotaJurusan: {
      AKL: { targetSiswa: 72, rombelPerkiraan: 2 },
      MPLB: { targetSiswa: 72, rombelPerkiraan: 2 },
      PM: { targetSiswa: 72, rombelPerkiraan: 2 },
      KSP: { targetSiswa: 36, rombelPerkiraan: 1 },
      HTL: { targetSiswa: 72, rombelPerkiraan: 2 }
    }
  },

  calonSiswaPpdb: [
    {
      id: 101,
      noPendaftaran: 'PPDB-2027-001',
      nisn: '0098765401',
      nama: 'Bagus Setyawan',
      jenisKelamin: 'L',
      asalSekolah: 'SMP Negeri 1 Kudus',
      noHp: '08123456001',
      jurusanKode: 'AKL',
      kelasId: null, // Wali kelas & kelas bisa menyusul
      tanggalDaftar: '2027-03-05',
      va: '88082027000101',
      gelombang: 'Gelombang 1',
      statusPendaftaran: 'DITERIMA',
      totalTagihan: 2100000,
      totalBayar: 2100000,
      statusBayar: 'LUNAS',
      statusFinal: 'CALON'
    },
    {
      id: 102,
      noPendaftaran: 'PPDB-2027-002',
      nisn: '0098765402',
      nama: 'Adelia Putri Maharani',
      jenisKelamin: 'P',
      asalSekolah: 'SMP Negeri 3 Kudus',
      noHp: '08123456002',
      jurusanKode: 'MPLB',
      kelasId: null,
      tanggalDaftar: '2027-03-08',
      va: '88082027000102',
      gelombang: 'Gelombang 1',
      statusPendaftaran: 'DITERIMA',
      totalTagihan: 2100000,
      totalBayar: 1100000,
      statusBayar: 'CICILAN',
      statusFinal: 'CALON'
    },
    {
      id: 103,
      noPendaftaran: 'PPDB-2027-003',
      nisn: '0098765403',
      nama: 'Cantika Ayu Wardani',
      jenisKelamin: 'P',
      asalSekolah: 'MTs Negeri 1 Kudus',
      noHp: '08123456003',
      jurusanKode: 'KSP',
      kelasId: null,
      tanggalDaftar: '2027-03-12',
      va: '88082027000103',
      gelombang: 'Gelombang 1',
      statusPendaftaran: 'DITERIMA',
      totalTagihan: 2250000,
      totalBayar: 150000,
      statusBayar: 'CICILAN',
      statusFinal: 'CALON'
    },
    {
      id: 104,
      noPendaftaran: 'PPDB-2027-004',
      nisn: '0098765404',
      nama: 'Dimas Arya Pratama',
      jenisKelamin: 'L',
      asalSekolah: 'SMP IT Al-Madani',
      noHp: '08123456004',
      jurusanKode: 'HTL',
      kelasId: null,
      tanggalDaftar: '2027-03-15',
      va: '88082027000104',
      gelombang: 'Gelombang 1',
      statusPendaftaran: 'TERDAFTAR',
      totalTagihan: 2200000,
      totalBayar: 0,
      statusBayar: 'BELUM_BAYAR',
      statusFinal: 'CALON'
    },
    {
      id: 105,
      noPendaftaran: 'PPDB-2027-005',
      nisn: '0098765405',
      nama: 'Fajar Nugroho',
      jenisKelamin: 'L',
      asalSekolah: 'SMP Negeri 2 Mejobo',
      noHp: '08123456005',
      jurusanKode: 'PM',
      kelasId: null,
      tanggalDaftar: '2027-03-18',
      va: '88082027000105',
      gelombang: 'Gelombang 1',
      statusPendaftaran: 'DITERIMA',
      totalTagihan: 2100000,
      totalBayar: 2100000,
      statusBayar: 'LUNAS',
      statusFinal: 'CALON'
    },
    {
      id: 106,
      noPendaftaran: 'PPDB-2027-006',
      nisn: '0098765406',
      nama: 'Nabila Khairunnisa',
      jenisKelamin: 'P',
      asalSekolah: 'SMP Negeri 1 Gebog',
      noHp: '08123456006',
      jurusanKode: 'AKL',
      kelasId: null,
      tanggalDaftar: '2027-03-20',
      va: '88082027000106',
      gelombang: 'Gelombang 1',
      statusPendaftaran: 'DITERIMA',
      totalTagihan: 2100000,
      totalBayar: 1100000,
      statusBayar: 'CICILAN',
      statusFinal: 'CALON'
    },
    {
      id: 107,
      noPendaftaran: 'PPDB-2027-007',
      nisn: '0098765407',
      nama: 'Rendy Dwi Saputra',
      jenisKelamin: 'L',
      asalSekolah: 'SMP Negeri 4 Kudus',
      noHp: '08123456007',
      jurusanKode: 'HTL',
      kelasId: null,
      tanggalDaftar: '2027-03-22',
      va: '88082027000107',
      gelombang: 'Gelombang 1',
      statusPendaftaran: 'TERDAFTAR',
      totalTagihan: 2200000,
      totalBayar: 0,
      statusBayar: 'BELUM_BAYAR',
      statusFinal: 'CALON'
    },
    {
      id: 108,
      noPendaftaran: 'PPDB-2027-008',
      nisn: '0098765408',
      nama: 'Salsa Bela Ramadhani',
      jenisKelamin: 'P',
      asalSekolah: 'SMP PGRI Kudus',
      noHp: '08123456008',
      jurusanKode: 'KSP',
      kelasId: null,
      tanggalDaftar: '2027-03-25',
      va: '88082027000108',
      gelombang: 'Gelombang 1',
      statusPendaftaran: 'DITERIMA',
      totalTagihan: 2250000,
      totalBayar: 2250000,
      statusBayar: 'LUNAS',
      statusFinal: 'CALON'
    }
  ],

  riwayatPembayaranPpdb: [
    {
      id: 'KWT-PPDB-20270305-001',
      calonSiswaId: 101,
      noPendaftaran: 'PPDB-2027-001',
      namaSiswa: 'Bagus Setyawan',
      jurusanKode: 'AKL',
      tanggal: '2027-03-05',
      total: 2100000,
      metode: 'TUNAI',
      petugas: 'Kasir TU - Hana (Bisnis Manajemen)',
      catatan: 'Pelunasan Biaya Formulir, Seragam, MPLS, dan SPI Masuk Tahap 1',
      rincian: [
        { posId: 'PPDB_FORMULIR', nama: 'Formulir & Registrasi PPDB', nominal: 150000 },
        { posId: 'PPDB_SERAGAM', nama: 'Paket Seragam & Atribut Sekolah (5 Stel)', nominal: 750000 },
        { posId: 'PPDB_MPLS', nama: 'Kegiatan MPLS & Pengenalan Vokasi', nominal: 200000 },
        { posId: 'PPDB_SPI_AWAL', nama: 'Uang Pangkal / SPI Masuk (Tahap 1)', nominal: 1000000 }
      ]
    },
    {
      id: 'VA-PPDB-20270308-002',
      calonSiswaId: 102,
      noPendaftaran: 'PPDB-2027-002',
      namaSiswa: 'Adelia Putri Maharani',
      jurusanKode: 'MPLB',
      tanggal: '2027-03-08',
      total: 1100000,
      metode: 'VA_TRANSFER',
      noReferensi: 'BNI-VA-PPDB-88082027000102',
      petugas: 'SISTEM VA AUTO',
      catatan: 'Pembayaran Formulir, Seragam, & MPLS via Virtual Account BNI',
      rincian: [
        { posId: 'PPDB_FORMULIR', nama: 'Formulir & Registrasi PPDB', nominal: 150000 },
        { posId: 'PPDB_SERAGAM', nama: 'Paket Seragam & Atribut Sekolah (5 Stel)', nominal: 750000 },
        { posId: 'PPDB_MPLS', nama: 'Kegiatan MPLS & Pengenalan Vokasi', nominal: 200000 }
      ]
    },
    {
      id: 'KWT-PPDB-20270325-003',
      calonSiswaId: 108,
      noPendaftaran: 'PPDB-2027-008',
      namaSiswa: 'Salsa Bela Ramadhani',
      jurusanKode: 'KSP',
      tanggal: '2027-03-25',
      total: 2250000,
      metode: 'TUNAI',
      petugas: 'Kasir TU - Umi (Pariwisata)',
      catatan: 'Pelunasan Penuh Biaya PPDB Kejuruan Kecantikan & Spa',
      rincian: [
        { posId: 'PPDB_FORMULIR', nama: 'Formulir & Registrasi PPDB', nominal: 150000 },
        { posId: 'PPDB_SERAGAM', nama: 'Paket Seragam & Atribut Sekolah (5 Stel)', nominal: 750000 },
        { posId: 'PPDB_MPLS', nama: 'Kegiatan MPLS & Pengenalan Vokasi', nominal: 200000 },
        { posId: 'PPDB_SPI_AWAL', nama: 'Uang Pangkal / SPI Masuk (Tahap 1)', nominal: 1150000 }
      ]
    }
  ]
};
