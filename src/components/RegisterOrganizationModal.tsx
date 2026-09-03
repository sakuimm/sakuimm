import React, { useState } from 'react';
import { OrgLevel } from '../types';
import { Building2, ShieldCheck, Mail, Lock, User, CheckCircle2, X } from 'lucide-react';

interface RegisterOrganizationModalProps {
  onClose: () => void;
  onRegisterSuccess: (namaOrg: string, level: OrgLevel, email: string, namaBendahara: string) => void;
}

export const RegisterOrganizationModal: React.FC<RegisterOrganizationModalProps> = ({
  onClose,
  onRegisterSuccess,
}) => {
  const [level, setLevel] = useState<OrgLevel>('PK');
  const [namaOrganisasi, setNamaOrganisasi] = useState('');
  const [indukNama, setIndukNama] = useState('KORKOM IMM Universitas Indonesia');
  const [namaBendahara, setNamaBendahara] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const parentOptions: Record<OrgLevel, string[]> = {
    PK: ['KORKOM IMM Universitas Indonesia', 'KORKOM IMM Universitas Muhammadiyah Jakarta', 'PC IMM Jakarta Selatan'],
    KORKOM: ['PC IMM Jakarta Selatan', 'PC IMM Jakarta Pusat', 'PC IMM Depok'],
    PC: ['DPD IMM DKI Jakarta', 'DPD IMM Jawa Barat'],
    DPD: ['DPP IMM (Dewan Pimpinan Pusat)'],
    DPP: ['DPP IMM (Pusat)']
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);

    setTimeout(() => {
      onRegisterSuccess(namaOrganisasi, level, email, namaBendahara);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs flex justify-center items-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-200 animate-scale-up">
        {/* Header Modal */}
        <div className="bg-[#7A0C1E] text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/15 rounded-xl border border-white/20">
              <Building2 className="w-6 h-6 text-[#81B29A]" />
            </div>
            <div>
              <h3 className="font-extrabold text-base">Pendaftaran Organisasi IMM</h3>
              <p className="text-xs text-white/80">
                Form Registrasi Mandiri Pimpinan PK / KORKOM / PC / DPD
              </p>
            </div>
          </div>
        </div>

        {/* Content Form */}
        <div className="p-6">
          {isSubmitted ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 bg-[#81B29A]/20 text-[#2D5A44] rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="font-extrabold text-base text-[#2D3748]">
                Pendaftaran Berhasil Dikirim!
              </h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                Permohonan pendaftaran <span className="font-bold text-slate-700">{namaOrganisasi}</span> telah diteruskan ke <span className="font-bold text-slate-700">{indukNama}</span> untuk verifikasi pengesahan.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Level Organisasi */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                  Tingkatan Level Pimpinan *
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(['PK', 'KORKOM', 'PC', 'DPD'] as OrgLevel[]).map((lvl) => (
                    <button
                      type="button"
                      key={lvl}
                      onClick={() => {
                        setLevel(lvl);
                        setIndukNama(parentOptions[lvl][0]);
                      }}
                      className={`py-2 text-xs font-extrabold rounded-xl border transition-all ${
                        level === lvl
                          ? 'bg-[#7A0C1E] text-white border-[#7A0C1E] shadow-xs'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Nama Organisasi */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                  Nama Resmi Pimpinan *
                </label>
                <input
                  type="text"
                  required
                  placeholder={level === 'PK' ? 'Contoh: PK IMM Teknik Mesin UI' : 'Contoh: PC IMM Jakarta Selatan'}
                  value={namaOrganisasi}
                  onChange={(e) => setNamaOrganisasi(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-[#2D3748] focus:outline-none focus:border-[#7A0C1E]"
                />
              </div>

              {/* Pimpinan Induk Naungan */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                  Pimpinan Induk Naungan *
                </label>
                <select
                  value={indukNama}
                  onChange={(e) => setIndukNama(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-[#2D3748] focus:outline-none focus:border-[#7A0C1E]"
                >
                  {parentOptions[level].map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Nama Bendahara Umum */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                    Nama Bendahara Umum *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Nama Lengkap Immawan/Immawati"
                    value={namaBendahara}
                    onChange={(e) => setNamaBendahara(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-[#2D3748] focus:outline-none focus:border-[#7A0C1E]"
                  />
                </div>

                {/* Email Login */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                    Email Pengguna *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="email@imm.or.id"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-[#2D3748] focus:outline-none focus:border-[#7A0C1E]"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                  Kata Sandi *
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-[#2D3748] focus:outline-none focus:border-[#7A0C1E]"
                />
              </div>

              {/* Actions */}
              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs rounded-xl transition-all"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#7A0C1E] hover:bg-[#600917] text-white font-black text-xs rounded-xl shadow-md transition-all active:scale-95"
                >
                  Kirim Permohonan Pendaftaran
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
