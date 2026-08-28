import React, { useState } from 'react';
import { Transaksi, ProgramKerja, Bidang, JenisNominal, JenisTransaksi, UserRole } from '../types';
import { Camera, Upload, CheckCircle2, History, PlusCircle, AlertCircle, Image as ImageIcon, ShieldCheck, Lock } from 'lucide-react';

interface TransactionFormViewProps {
  transaksiList: Transaksi[];
  prokerList: ProgramKerja[];
  bidangList: Bidang[];
  userRole: UserRole;
  onAddTransaksi: (trx: Transaksi) => void;
}

export const TransactionFormView: React.FC<TransactionFormViewProps> = ({
  transaksiList,
  prokerList,
  bidangList,
  userRole,
  onAddTransaksi,
}) => {
  const [tanggal, setTanggal] = useState('2026-08-28');
  const [selectedBidangId, setSelectedBidangId] = useState(bidangList[1]?.id || 'b2');
  const [selectedProkerId, setSelectedProkerId] = useState(prokerList[0]?.id || 'pr-1');
  const [keterangan, setKeterangan] = useState('');
  const [jenisNominal, setJenisNominal] = useState<JenisNominal>('pengeluaran');
  const [nominalStr, setNominalStr] = useState('');
  const [jenisTransaksi, setJenisTransaksi] = useState<JenisTransaksi>('operasional');
  const [photoSelected, setPhotoSelected] = useState<string | null>(null);
  const [selectedAuditLog, setSelectedAuditLog] = useState<Transaksi | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Filter proker by selected bidang
  const filteredProker = prokerList.filter((p) => p.bidangId === selectedBidangId);
  const currentProker = prokerList.find((p) => p.id === selectedProkerId);

  const handlePhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhotoSelected(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(nominalStr.replace(/\D/g, ''));
    if (!num || num <= 0) return;

    const selectedBidang = bidangList.find((b) => b.id === selectedBidangId);

    const newTrx: Transaksi = {
      id: `TRX-${Math.floor(1000 + Math.random() * 9000)}`,
      tanggal,
      bidangId: selectedBidangId,
      bidangNama: selectedBidang?.nama || 'Bidang Kaderisasi',
      programKerjaId: selectedProkerId,
      programKerjaNama: currentProker?.namaProker || 'Umum',
      kategoriProker: currentProker?.kategori || 'Kemahasiswaan',
      keterangan,
      jenisNominal,
      nominal: num,
      jenisTransaksi,
      buktiDriveFileId: `DRIVE-${Math.random().toString(36).substring(7)}`,
      uploadStatus: 'COMPLETED',
      organisasiNama: 'PK IMM Teknik Mesin UI'
    };

    onAddTransaksi(newTrx);
    setKeterangan('');
    setNominalStr('');
    setPhotoSelected(null);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#2D3748]">Pencatatan Transaksi Harian</h2>
          <p className="text-xs text-slate-500">Pencatatan nota bukti transaksi digital & otomatis watermark Sharp</p>
        </div>
        {showSuccessToast && (
          <div className="px-4 py-2 bg-[#81B29A] text-[#2D3748] text-xs font-bold rounded-lg shadow-sm flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> Transaksi tersimpan & antrean Google Drive diproses!
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Form Input Transaksi or Read-Only Banner */}
        <div className="lg:col-span-1 bg-white border border-slate-200 rounded-card p-5 shadow-xs space-y-4">
          {userRole === 'tim_verifikasi_internal' ? (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#2D3748] text-[#F4A261] mx-auto flex items-center justify-center">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase rounded-full bg-[#F4A261]/20 text-[#9C5217]">
                  Mode Read-Only (Tim Verifikasi)
                </span>
                <h4 className="font-bold text-[#2D3748] text-sm mt-2">Wewenang Tim Verifikasi Internal</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Sebagai Ketua Umum / Sekretaris Umum / Tim Verifikasi, Anda memiliki akses <span className="font-bold">Pantau & Audit Log</span> seluruh pencatatan transaksi nota tanpa hak mengubah data.
                </p>
              </div>
              <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-400 font-medium">
                Pencatatan & pengubahan nota murni dilakukan oleh <span className="font-bold text-[#2D3748]">Bendahara Umum</span>.
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-bold text-[#2D3748] text-base flex items-center gap-2">
                  <PlusCircle className="w-4 h-4 text-[#81B29A]" />
                  <span>Form Input Transaksi</span>
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  Mobile-First
                </span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
            {/* Tanggal */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                Tanggal Transaksi
              </label>
              <input
                type="date"
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-[#2D3748] focus:outline-none focus:border-[#2D3748]"
              />
            </div>

            {/* Dropdown Bidang */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                Bidang IMM
              </label>
              <select
                value={selectedBidangId}
                onChange={(e) => setSelectedBidangId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-[#2D3748] focus:outline-none focus:border-[#2D3748]"
              >
                {bidangList.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.kode} - {b.nama}
                  </option>
                ))}
              </select>
            </div>

            {/* Dropdown Program Kerja (Dependent) */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                Program Kerja
              </label>
              <select
                value={selectedProkerId}
                onChange={(e) => setSelectedProkerId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-[#2D3748] focus:outline-none focus:border-[#2D3748]"
              >
                {filteredProker.length > 0 ? (
                  filteredProker.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.namaProker} ({p.kategori})
                    </option>
                  ))
                ) : (
                  <option value="">-- Bebas / Rutin Organisasi --</option>
                )}
              </select>
            </div>

            {/* Jenis Nominal Toggle (Eksklusif!) */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                Jenis Nominal (Pilih Salah Satu)
              </label>
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-lg">
                <button
                  type="button"
                  onClick={() => setJenisNominal('pemasukan')}
                  className={`py-2 text-xs font-bold rounded-md transition-all flex items-center justify-center gap-1 ${
                    jenisNominal === 'pemasukan'
                      ? 'bg-[#81B29A] text-[#2D3748] shadow-xs'
                      : 'text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  <span>Pemasukan (+Kas)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setJenisNominal('pengeluaran')}
                  className={`py-2 text-xs font-bold rounded-md transition-all flex items-center justify-center gap-1 ${
                    jenisNominal === 'pengeluaran'
                      ? 'bg-[#F4A261] text-[#2D3748] shadow-xs'
                      : 'text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  <span>Pengeluaran (-Kas)</span>
                </button>
              </div>
            </div>

            {/* Nominal Rupiah */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                Nominal Transaksi (Rp)
              </label>
              <input
                type="text"
                value={nominalStr}
                onChange={(e) => setNominalStr(e.target.value)}
                placeholder="Contoh: 250000"
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-[#2D3748] focus:outline-none focus:border-[#2D3748]"
              />
            </div>

            {/* Keterangan */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                Keterangan Transaksi / Nota
              </label>
              <textarea
                value={keterangan}
                onChange={(e) => setKeterangan(e.target.value)}
                placeholder="Rincian pembelian atau sumber dana..."
                rows={2}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-[#2D3748] focus:outline-none focus:border-[#2D3748]"
              />
            </div>

            {/* Jenis Transaksi (Operasional / Inventaris) */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                Kategori Alokasi
              </label>
              <select
                value={jenisTransaksi}
                onChange={(e) => setJenisTransaksi(e.target.value as JenisTransaksi)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-[#2D3748] focus:outline-none focus:border-[#2D3748]"
              >
                <option value="operasional">Operasional Program Kerja</option>
                <option value="inventaris">Inventaris / Aset Organisasi</option>
              </select>
            </div>

            {/* Upload / Capture Kamera Native */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                Foto Bukti Nota (Kamera Native / Unggah)
              </label>
              <div className="border-2 border-dashed border-slate-200 rounded-lg p-3 text-center bg-slate-50/50 hover:bg-slate-50 transition-all">
                {photoSelected ? (
                  <div className="space-y-2">
                    <img src={photoSelected} alt="Nota Preview" className="h-28 mx-auto rounded-md object-cover" />
                    <span className="text-[10px] font-bold text-[#81B29A] bg-[#81B29A]/15 px-2 py-0.5 rounded-full inline-block">
                      Watermark IMM Ready (Sharp Pipe)
                    </span>
                  </div>
                ) : (
                  <label className="cursor-pointer space-y-1 block">
                    <div className="w-8 h-8 rounded-full bg-[#2D3748]/10 text-[#2D3748] mx-auto flex items-center justify-center">
                      <Camera className="w-4 h-4" />
                    </div>
                    <p className="text-xs font-bold text-[#2D3748]">Ambil Foto Kamera / Pilihh File</p>
                    <p className="text-[10px] text-slate-400">Otomatis kompresi Sharp (Max 1200px)</p>
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handlePhotoCapture}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-2.5 bg-[#2D3748] hover:bg-slate-700 text-white font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-2 shadow-xs"
            >
              <span>Simpan & Upload ke Google Drive Queue</span>
              <Upload className="w-3.5 h-3.5 text-[#81B29A]" />
            </button>
          </form>
          </>
          )}
        </div>

        {/* Right Column: Daftar Transaksi & Audit Log Viewer (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-slate-200 rounded-card p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-[#2D3748] text-base">Riwayat Pencatatan Transaksi Organisasi</h3>
              <span className="text-xs text-slate-500 font-medium">Soft-Delete Enabled</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#F8F9FA] text-slate-600 font-semibold border-b border-slate-200">
                    <th className="py-2.5 px-3">Tanggal</th>
                    <th className="py-2.5 px-3">Keterangan</th>
                    <th className="py-2.5 px-3">Bidang / Proker</th>
                    <th className="py-2.5 px-3">Nominal</th>
                    <th className="py-2.5 px-3">Status Drive</th>
                    <th className="py-2.5 px-3">Aksi Audit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {transaksiList.map((trx) => (
                    <tr key={trx.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-3 font-semibold text-[#2D3748] whitespace-nowrap">
                        {trx.tanggal}
                      </td>
                      <td className="py-3 px-3 font-medium text-[#2D3748]">
                        <p className="font-bold">{trx.keterangan}</p>
                        <span className="text-[10px] text-slate-400 uppercase">{trx.jenisTransaksi}</span>
                      </td>
                      <td className="py-3 px-3 text-slate-600">
                        <p className="font-medium">{trx.programKerjaNama}</p>
                        <span className="text-[10px] font-bold text-slate-400">{trx.bidangNama}</span>
                      </td>
                      <td
                        className={`py-3 px-3 font-extrabold ${
                          trx.jenisNominal === 'pemasukan' ? 'text-[#81B29A]' : 'text-[#F4A261]'
                        }`}
                      >
                        {trx.jenisNominal === 'pemasukan' ? '+' : '-'}Rp {trx.nominal.toLocaleString('id-ID')}
                      </td>
                      <td className="py-3 px-3">
                        {trx.uploadStatus === 'COMPLETED' ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#2D5A44] bg-[#81B29A]/15 px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3 h-3" /> Drive Synced
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#9C5217] bg-[#F4A261]/15 px-2 py-0.5 rounded-full">
                            <AlertCircle className="w-3 h-3" /> Queue Pending
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <button
                          onClick={() => setSelectedAuditLog(trx)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-[#2D3748] hover:text-white text-[#2D3748] font-bold text-[10px] rounded-md transition-all flex items-center gap-1"
                        >
                          <History className="w-3 h-3" /> Audit Log
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Audit Log Modal Preview */}
          {selectedAuditLog && (
            <div className="bg-white border border border-slate-200 rounded-card p-4 shadow-sm bg-slate-50/50 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <h4 className="font-bold text-xs text-[#2D3748] flex items-center gap-2">
                  <History className="w-4 h-4 text-[#F4A261]" />
                  <span>Jejak Audit Log: {selectedAuditLog.id} ({selectedAuditLog.keterangan})</span>
                </h4>
                <button
                  onClick={() => setSelectedAuditLog(null)}
                  className="text-xs text-slate-400 font-bold hover:text-[#2D3748]"
                >
                  Tutup ✕
                </button>
              </div>
              <div className="text-xs space-y-2 font-mono bg-[#2D3748] text-slate-200 p-3 rounded-lg">
                <p><span className="text-[#81B29A]">Actor User:</span> Immawan Ahmad (Bendahara Umum)</p>
                <p><span className="text-[#81B29A]">Action Timestamp:</span> 2026-08-28 09:30:12 WIB</p>
                <p><span className="text-[#F4A261]">JSON Payload Data:</span></p>
                <pre className="text-[10px] text-slate-300 bg-slate-900/60 p-2 rounded overflow-x-auto">
{JSON.stringify(
  {
    transaksi_id: selectedAuditLog.id,
    nominal: selectedAuditLog.nominal,
    jenis_nominal: selectedAuditLog.jenisNominal,
    soft_deleted: false,
    google_drive_status: selectedAuditLog.uploadStatus,
    watermark_stamp: "PROPERTI IMM - PK MESIN UI - 28/08/2026"
  },
  null,
  2
)}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
