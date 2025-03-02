@echo off
echo CV Şablonları Yönetim Aracı
echo ===========================
echo.

echo 1. Mevcut şablonları temizleme
npx ts-node scripts/clear-templates.ts
echo.

echo 2. Yeni şablonları ekleme
npx ts-node scripts/add-templates.ts
echo.

echo İşlem tamamlandı!
pause 