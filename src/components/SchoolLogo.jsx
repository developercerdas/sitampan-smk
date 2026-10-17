import React from 'react';

export default function SchoolLogo({ logoUrl, nama, className = "w-12 h-12" }) {
  // Jika sekolah sudah mengunggah logo kustom sendiri
  if (logoUrl) {
    return (
      <img
        src={logoUrl}
        alt="Logo Sekolah"
        className={`${className} object-contain rounded-xl drop-shadow-xs`}
      />
    );
  }

  // Logo Vektor Resmi Khas SMK & Pendidikan (Lambang Perisai, Buku, Obor Api & Padi Emas)
  return (
    <div className={`${className} flex items-center justify-center flex-shrink-0`}>
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full drop-shadow-md"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Lingkaran Luar Emas & Biru */}
        <circle cx="50" cy="50" r="48" fill="#1e3a8a" stroke="#f59e0b" strokeWidth="3" />
        <circle cx="50" cy="50" r="42" fill="#0f172a" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="3 2" />

        {/* Perisai Segilima Dalam */}
        <polygon
          points="50,15 82,32 72,76 50,86 28,76 18,32"
          fill="#1e40af"
          stroke="#fbbf24"
          strokeWidth="2"
        />

        {/* Sayap / Padi Emas Kiri & Kanan */}
        <path
          d="M26 62C23 52 25 40 31 32M74 62C77 52 75 40 69 32"
          stroke="#f59e0b"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Buku Terbuka (Pendidikan) */}
        <path
          d="M36 68C42 66 48 68 50 71C52 68 58 66 64 68V54C58 52 52 54 50 57C48 54 42 52 36 54V68Z"
          fill="#ffffff"
          stroke="#0f172a"
          strokeWidth="1.5"
        />

        {/* Tangkai Obor */}
        <path
          d="M48 62L52 62L51 46L49 46Z"
          fill="#d97706"
          stroke="#fef08a"
          strokeWidth="1"
        />

        {/* Nyala Api Obor (Semangat Kejuruan) */}
        <path
          d="M50 30C46 36 44 42 47 46C49 48 51 48 53 46C56 42 54 36 50 30Z"
          fill="#ef4444"
        />
        <path
          d="M50 35C48 39 47 43 49 45C50 46 51 46 52 45C53 43 52 39 50 35Z"
          fill="#fbbf24"
        />

        {/* Tulisan SMK Melingkar Bawah */}
        <path id="curve" d="M25 80 A 30 30 0 0 0 75 80" fill="none" />
        <text className="text-[7px] font-black tracking-widest fill-amber-300">
          <textPath href="#curve" startOffset="50%" textAnchor="middle">
            {nama ? nama.slice(0, 15).toUpperCase() : 'SITAMPAN SMK'}
          </textPath>
        </text>
      </svg>
    </div>
  );
}
