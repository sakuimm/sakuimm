import React, { useState } from 'react';
import { Organisasi } from '../types';
import { UserCheck, CheckCircle2, XCircle, Clock, Building2 } from 'lucide-react';

interface OrganizationVerificationViewProps {
  organisasiList: Organisasi[];
  onVerify: (id: string) => void;
  onReject: (id: string) => void;
}

export const OrganizationVerificationView: React.FC<OrganizationVerificationViewProps> = ({
  organisasiList,
  onVerify,
  onReject,
}) => {
  const [rejectReasonModal, setRejectReasonModal] = useState<string | null>(null);
  const [reasonText, setReasonText] = useState('');

  const pendingOrgs = organisasiList.filter((o) => o.status === 'pending');
  const verifiedOrgs = organisasiList.filter((o) => o.status === 'verified');

  const confirmReject = () => {
    if (rejectReasonModal) {
      onReject(rejectReasonModal);
      setRejectReasonModal(null);
      setReasonText('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-[#2D3748]">Verifikasi Pendaftaran Organisasi</h2>
        <p className="text-xs text-slate-500">
          Panel persetujuan pendaftaran organisasi turunan oleh Induk Pimpinan
        </p>
      </div>

      {/* Pending Verifications Card */}
      <div className="bg-white border border-slate-200 rounded-card p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-bold text-[#2D3748] text-base flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#F4A261]" />
            <span>Permohonan Pendaftaran Menunggu Verifikasi ({pendingOrgs.length})</span>
          </h3>
          <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-[#F4A261]/15 text-[#9C5217]">
            Pending Review
          </span>
        </div>

        {pendingOrgs.length > 0 ? (
          <div className="space-y-3">
            {pendingOrgs.map((org) => (
              <div
                key={org.id}
                className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-[#2D3748] text-white">
                      Level {org.level}
                    </span>
                    <h4 className="font-bold text-[#2D3748] text-sm">{org.nama}</h4>
                  </div>
                  <p className="text-xs text-slate-500">
                    Organisasi Induk: <span className="font-semibold text-slate-700">{org.parentNama}</span>
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Pemohon: Bendahara Umum Pendaftar • Tanggal: 28 Agustus 2026
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onVerify(org.id)}
                    className="px-3 py-1.5 bg-[#81B29A] hover:bg-emerald-600 text-[#2D3748] font-bold text-xs rounded-lg transition-all flex items-center gap-1 shadow-xs"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Setujui (Verify)
                  </button>
                  <button
                    onClick={() => setRejectReasonModal(org.id)}
                    className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 font-bold text-xs rounded-lg transition-all flex items-center gap-1"
                  >
                    <XCircle className="w-4 h-4" /> Tolak (Reject)
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center text-slate-400 text-xs font-medium">
            Tidak ada permohonan pendaftaran organisasi baru yang menunggu saat ini.
          </div>
        )}
      </div>

      {/* Verified Organizations Card */}
      <div className="bg-white border border-slate-200 rounded-card p-5 shadow-xs space-y-4">
        <h3 className="font-bold text-[#2D3748] text-base flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-[#81B29A]" />
          <span>Daftar Organisasi Terverifikasi ({verifiedOrgs.length})</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F8F9FA] text-slate-600 font-semibold border-b border-slate-200">
                <th className="py-2.5 px-3">Nama Organisasi</th>
                <th className="py-2.5 px-3">Level</th>
                <th className="py-2.5 px-3">Organisasi Induk</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {verifiedOrgs.map((org) => (
                <tr key={org.id} className="hover:bg-slate-50">
                  <td className="py-3 px-3 font-bold text-[#2D3748]">{org.nama}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-[#2D3748]/10 text-[#2D3748]">
                      {org.level}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-500">{org.parentNama || 'Pusat (Top Level)'}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-[#81B29A]/15 text-[#2D5A44]">
                      Verified (Aktif)
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reject Modal */}
      {rejectReasonModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex justify-center items-center p-4 z-50">
          <div className="bg-white rounded-card p-6 max-w-sm w-full space-y-4 shadow-lg border border-slate-200">
            <h4 className="font-bold text-sm text-[#2D3748]">Alasan Penolakan Organisasi</h4>
            <textarea
              value={reasonText}
              onChange={(e) => setReasonText(e.target.value)}
              placeholder="Tuliskan alasan penolakan..."
              rows={3}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setRejectReasonModal(null)}
                className="px-3 py-1.5 text-xs text-slate-500 font-bold hover:bg-slate-100 rounded-lg"
              >
                Batal
              </button>
              <button
                onClick={confirmReject}
                className="px-3 py-1.5 text-xs bg-red-600 text-white font-bold rounded-lg hover:bg-red-700"
              >
                Tolak Pendaftaran
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
