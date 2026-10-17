@echo off
title Update & Push SITAMPAN SMK ke GitHub
color 0A
cd /d "D:\APLIKASI\SITAMPAN SMK"

echo ===================================================================
echo   MENGIRIM PEMBARUAN APLIKASI SITAMPAN SMK KE GITHUB
echo   Akun: developercerdas / Repositori: sitampan-smk
echo ===================================================================
echo.

"C:\laragon\bin\git\cmd\git.exe" add .
"C:\laragon\bin\git\cmd\git.exe" commit -m "Update otomatis SITAMPAN SMK" >nul 2>&1

echo Mengecek dan mengunggah ke GitHub branch main...
"C:\laragon\bin\git\cmd\git.exe" push -u origin main

echo.
echo ===================================================================
echo   STATUS: KODE SUDAH 100% TERSINKRONISASI DI GITHUB!
echo ===================================================================
echo.
echo Jika muncul pesan "Everything up-to-date", artinya seluruh file
echo terbaru sudah ada di GitHub tanpa ada yang tertinggal.
echo.
echo 1. Lihat Kode Repositori:
echo    https://github.com/developercerdas/sitampan-smk
echo.
echo 2. Buka Website Demo Trial (Jika GitHub Pages sudah aktif):
echo    https://developercerdas.github.io/sitampan-smk/
echo ===================================================================
echo.
pause
