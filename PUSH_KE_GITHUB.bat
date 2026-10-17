@echo off
title Update & Push SITAMPAN SMK ke GitHub
color 0A
cd /d "D:\APLIKASI\SITAMPAN SMK"

echo ===================================================================
echo   MENGIRIM PEMBARUAN APLIKASI SITAMPAN SMK KE GITHUB
echo   Akun: developercerdas / Repositori: sitampan-smk
echo ===================================================================
echo.
echo Sedang menyiapkan pembaruan fitur:
echo   [+] Dashboard Keuangan Real-Time (Card per Jurusan & per Kelas)
echo   [+] Sidebar Kiri Dinamis Sesuai Role (Admin, Wali Kelas, Siswa)
echo   [+] Master Profil & KOP Surat / Kuitansi Sekolah (Logo Ganti Bebas)
echo   [+] Login Siswa: Ketik NIS -^> Otomatis Muncul Nama & Verifikasi Tgl Lahir
echo   [+] Fitur Nyicil / Cicilan Fleksibel Terarah
echo   [+] Nama Siswa & Wali Kelas Sudah Disamarkan untuk Keamanan Demo
echo.

"C:\laragon\bin\git\cmd\git.exe" add .
"C:\laragon\bin\git\cmd\git.exe" commit -m "Update Fitur Dashboard Keuangan Real-Time, Sidebar, KOP Dinamis, dan Login NIS"

REM Cek apakah remote origin sudah ada
"C:\laragon\bin\git\cmd\git.exe" remote get-url origin >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Menghubungkan ke repositori GitHub...
    "C:\laragon\bin\git\cmd\git.exe" remote add origin https://github.com/developercerdas/sitampan-smk.git
)

echo Mengunggah ke GitHub branch main...
"C:\laragon\bin\git\cmd\git.exe" push -u origin main

echo.
if %ERRORLEVEL% EQU 0 (
    echo ===================================================================
    echo   BERHASIL 100%! Aplikasi SITAMPAN SMK Telah Terkirim ke GitHub!
    echo ===================================================================
    echo.
    echo Buka GitHub Repository:
    echo   https://github.com/developercerdas/sitampan-smk
    echo.
    echo Website GitHub Pages (Setelah Workflow Actions Selesai):
    echo   https://developercerdas.github.io/sitampan-smk/
    echo ===================================================================
) else (
    echo ===================================================================
    echo   Catatan: Pastikan repositori "sitampan-smk" sudah dibuat di GitHub
    echo   pada akun Anda (https://github.com/new).
    echo ===================================================================
)
echo.
pause
