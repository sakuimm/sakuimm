#!/bin/bash
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
OUT_DIR="/Users/macbook/Desktop/Software IMM/public/screenshots"
mkdir -p "$OUT_DIR"

capture() {
  local name="$1"
  local url="$2"
  echo "Capturing $name from $url..."
  "$CHROME" --headless=new --disable-gpu --window-size=1280,850 --screenshot="$OUT_DIR/$name" "$url" >/dev/null 2>&1
}

capture "01-login-page.png" "http://localhost:5173/"
capture "02-dashboard-view.png" "http://localhost:5173/?tab=dashboard"
capture "03-daftar-proker-fullwidth.png" "http://localhost:5173/?tab=master-data"
capture "04-input-proker-standar.png" "http://localhost:5173/?tab=input-proker"
capture "05-transaksi-form-clean.png" "http://localhost:5173/?tab=buat-laporan"
capture "06-detail-lpj-locked.png" "http://localhost:5173/?tab=master-data&detail=1"
capture "07-laporan-arus-kas.png" "http://localhost:5173/?tab=laporan"
capture "08-kop-surat-resmi-modal.png" "http://localhost:5173/?tab=laporan&previewModal=1"
capture "09-verifikasi-downstream.png" "http://localhost:5173/?tab=verifikasi&level=PC"
capture "10-settings-riwayat-log.png" "http://localhost:5173/?tab=pengaturan"

echo "All screenshots captured successfully!"
