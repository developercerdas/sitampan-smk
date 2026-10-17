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
    { id: 1, kode: 'AKL', nama: 'Akuntansi dan Keuangan Lembaga', warna: 'blue' },
    { id: 2, kode: 'PM', nama: 'Pemasaran / Bisnis Daring', warna: 'emerald' },
    { id: 3, kode: 'PAR', nama: 'Perhotelan & Jasa Pariwisata', warna: 'purple' },
    { id: 4, kode: 'TKRO', nama: 'Teknik Kendaraan Ringan Otomotif', warna: 'orange' }
  ],

  kelas: [
    { id: 1, nama: 'XII PM 1', tingkat: 'XII', jurusanKode: 'PM', rombel: '1', waliKelas: 'Dra. Hj. Sri Lestari, M.Pd' },
    { id: 2, nama: 'XII AKL', tingkat: 'XII', jurusanKode: 'AKL', rombel: '1', waliKelas: 'Ahmad Junaidi, S.Pd' },
    { id: 3, nama: 'XI CS 3', tingkat: 'XI', jurusanKode: 'PAR', rombel: '3', waliKelas: 'Hendra Gunawan, S.Pd' },
    { id: 4, nama: 'X AKL 1', tingkat: 'X', jurusanKode: 'AKL', rombel: '1', waliKelas: 'Ratna Dewi, S.Pd' }
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
        PM: 325000,
        PAR: 350000,
        TKRO: 375000
      },
      keterangan: 'Tarif SPP disesuaikan dengan kebutuhan modul & praktek bengkel kejuruan'
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
        PM: 905000,
        PAR: 950000,
        TKRO: 975000
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
      id: 'PRAKTIK_TKRO', 
      nama: 'Biaya Bahan Praktik Bengkel & Alat Otomotif', 
      tipe: 'SEKALI_BAYAR', 
      nominalDefault: 350000,
      targetJurusan: 'TKRO',
      targetTingkat: 'SEMUA',
      keterangan: 'Khusus siswa Jurusan TKRO (Bahan pelumas, sparepart latih bengkel)'
    },
    { 
      id: 'PRAKTIK_PAR', 
      nama: 'Biaya Bahan Praktik Dapur & Tata Hidang Perhotelan', 
      tipe: 'SEKALI_BAYAR', 
      nominalDefault: 300000,
      targetJurusan: 'PAR',
      targetTingkat: 'SEMUA',
      keterangan: 'Khusus siswa Jurusan Perhotelan (Bahan cooking, table manner & linen)'
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
        PM: 400000,
        PAR: 450000,
        TKRO: 500000
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
    // Siswa Foto 2: Kuitansi (Samaran: Dewi Anggraini - XII AKL)
    {
      id: 24,
      nis: '12640',
      nisn: '0061234584',
      nama: 'Dewi Anggraini',
      tanggalLahir: '2008-08-17',
      kelasId: 2, // XII AKL
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
    // Siswa Foto 3: Kartu Kuning (Samaran: Anisa Larasati Putri - XI PAR)
    {
      id: 25,
      nis: '12553',
      nisn: '0071234585',
      nama: 'Anisa Larasati Putri',
      tanggalLahir: '2009-02-20',
      kelasId: 3, // XI CS 3
      jurusanKode: 'PAR',
      tingkat: 'XI',
      va: '880812553025',
      telepon: '08123456725',
      status: 'AKTIF',
      spi: 500000,
      tunggakanLalu: 0,
      duJuli: 905000,
      bayarBulanan: {
        'Agustus': 375000,
        'September': 375000,
        'Oktober': 375000,
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
  ]
};
