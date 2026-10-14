import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Trash2 } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[SAKU IMM ERROR BOUNDARY]:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleResetCache = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
      if ('caches' in window) {
        caches.keys().then((names) => {
          names.forEach((name) => caches.delete(name));
        });
      }
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          registrations.forEach((r) => r.unregister());
        });
      }
    } catch {
      // ignore
    }
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200 p-6 md:p-8 text-center space-y-6">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shadow-xs">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-extrabold text-[#0f172a]">
                Kendala Tampilan Sistem
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                Sistem mendeteksi inkonsistensi cache lokal atau pembaruan sesi aplikasi. Anda dapat memuat ulang halaman atau membersihkan cache data lokal untuk memulihkan tampilan.
              </p>
              {this.state.error?.message && (
                <div className="mt-3 p-3 bg-slate-50 rounded-xl text-left border border-slate-200 text-[11px] font-mono text-slate-600 break-words">
                  {this.state.error.message}
                </div>
              )}
            </div>

            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#7A0C1E] hover:bg-[#600917] text-white text-xs font-bold rounded-xl transition-all shadow-sm"
              >
                <RefreshCw className="w-4 h-4" />
                Muat Ulang Halaman
              </button>

              <button
                type="button"
                onClick={this.handleResetCache}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all"
              >
                <Trash2 className="w-4 h-4 text-slate-500" />
                Bersihkan Cache & Buka Halaman Utama
              </button>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-[11px] text-slate-400 font-medium">
              <span>SAKU IMM DPP Ikatan Mahasiswa Muhammadiyah</span>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
