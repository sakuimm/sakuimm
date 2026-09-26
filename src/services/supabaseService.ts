import { supabase, isSupabaseConfigured } from './supabaseClient';
import { storageService } from './storageService';
import { Transaksi, ProgramKerja, Organisasi, AuditLog } from '../types';

export const supabaseService = {
  /**
   * Fetch all Transaksi with Supabase PostgreSQL fallback to storageService
   */
  async getTransaksi(): Promise<Transaksi[]> {
    if (!isSupabaseConfigured()) {
      return storageService.getTransaksiList();
    }

    try {
      const { data, error } = await supabase
        .from('transaksi')
        .select('*')
        .eq('is_deleted', false)
        .order('tanggal', { ascending: false });

      if (error || !data) {
        return storageService.getTransaksiList();
      }

      return data.map((t: any) => ({
        id: t.id,
        tanggal: t.tanggal,
        bidangId: t.bidang_id,
        bidangNama: t.bidang_nama || 'Bidang IMM',
        programKerjaId: t.program_kerja_id,
        programKerjaNama: t.program_kerja_nama || 'Umum',
        kategoriProker: t.kategori_proker || 'Kemahasiswaan',
        keterangan: t.keterangan,
        jenisNominal: t.jenis_nominal,
        nominal: Number(t.nominal),
        jenisTransaksi: t.jenis_transaksi,
        buktiDriveFileId: t.bukti_drive_file_id,
        buktiDriveUrl: t.bukti_drive_url,
        uploadStatus: t.upload_status || 'COMPLETED',
        organisasiNama: t.organisasi_nama || 'IMM',
        isDeleted: t.is_deleted || false,
        statusRevisi: t.status_revisi || 'normal',
        catatanRevisi: t.catatan_revisi
      }));
    } catch {
      return storageService.getTransaksiList();
    }
  },

  /**
   * Create Transaksi
   */
  async createTransaksi(trx: Transaksi, actorNama: string): Promise<Transaksi[]> {
    const updatedLocal = storageService.addTransaksi(trx, actorNama);

    if (isSupabaseConfigured()) {
      try {
        await supabase.from('transaksi').insert({
          id: trx.id,
          tanggal: trx.tanggal,
          bidang_id: trx.bidangId,
          program_kerja_id: trx.programKerjaId,
          keterangan: trx.keterangan,
          jenis_nominal: trx.jenisNominal,
          nominal: trx.nominal,
          jenis_transaksi: trx.jenisTransaksi,
          upload_status: trx.uploadStatus,
          organisasi_nama: trx.organisasiNama
        });
      } catch (e) {
        console.warn('Supabase DB sync skipped (offline or schema mismatch):', e);
      }
    }

    return updatedLocal;
  },

  /**
   * Update (Edit) Transaksi
   */
  async updateTransaksi(trx: Transaksi, actorNama: string): Promise<Transaksi[]> {
    const updatedLocal = storageService.updateTransaksi(trx, actorNama);

    if (isSupabaseConfigured()) {
      try {
        await supabase
          .from('transaksi')
          .update({
            tanggal: trx.tanggal,
            keterangan: trx.keterangan,
            jenis_nominal: trx.jenisNominal,
            nominal: trx.nominal,
            jenis_transaksi: trx.jenisTransaksi,
            updated_at: new Date().toISOString()
          })
          .eq('id', trx.id);
      } catch (e) {
        console.warn('Supabase DB update skipped:', e);
      }
    }

    return updatedLocal;
  },

  /**
   * Delete Transaksi
   */
  async deleteTransaksi(id: string, actorNama: string): Promise<Transaksi[]> {
    const updatedLocal = storageService.deleteTransaksi(id, actorNama);

    if (isSupabaseConfigured()) {
      try {
        await supabase
          .from('transaksi')
          .update({ is_deleted: true, updated_at: new Date().toISOString() })
          .eq('id', id);
      } catch (e) {
        console.warn('Supabase DB delete skipped:', e);
      }
    }

    return updatedLocal;
  },

  /**
   * Fetch Program Kerja
   */
  async getProkerList(): Promise<ProgramKerja[]> {
    if (!isSupabaseConfigured()) {
      return storageService.getProkerList();
    }

    try {
      const { data, error } = await supabase
        .from('program_kerja')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !data) {
        return storageService.getProkerList();
      }

      return data.map((p: any) => ({
        id: p.id,
        bidangId: p.bidang_id,
        bidangNama: p.bidang_nama || 'Bidang Organisasi',
        namaProker: p.nama_proker,
        kategori: p.kategori,
        tanggalPelaksanaan: p.tanggal_pelaksanaan,
        statusLaporan: p.status_laporan || 'Belum',
        penanggungJawab: p.penanggung_jawab,
        targetAnggaran: Number(p.target_anggaran) || undefined,
        deskripsi: p.deskripsi
      }));
    } catch {
      return storageService.getProkerList();
    }
  },

  /**
   * Create Proker
   */
  async createProker(proker: ProgramKerja): Promise<ProgramKerja[]> {
    const updatedLocal = storageService.addProker(proker);

    if (isSupabaseConfigured()) {
      try {
        await supabase.from('program_kerja').insert({
          id: proker.id,
          bidang_id: proker.bidangId,
          nama_proker: proker.namaProker,
          kategori: proker.kategori,
          tanggal_pelaksanaan: proker.tanggalPelaksanaan,
          status_laporan: proker.statusLaporan,
          penanggung_jawab: proker.penanggungJawab,
          target_anggaran: proker.targetAnggaran,
          deskripsi: proker.deskripsi
        });
      } catch (e) {
        console.warn('Supabase DB proker sync skipped:', e);
      }
    }

    return updatedLocal;
  },

  /**
   * Update Proker
   */
  async updateProker(proker: ProgramKerja, actorNama?: string): Promise<ProgramKerja[]> {
    const updatedLocal = storageService.updateProker(proker, actorNama);

    if (isSupabaseConfigured()) {
      try {
        await supabase
          .from('program_kerja')
          .update({
            nama_proker: proker.namaProker,
            kategori: proker.kategori,
            tanggal_pelaksanaan: proker.tanggalPelaksanaan,
            penanggung_jawab: proker.penanggungJawab,
            target_anggaran: proker.targetAnggaran,
            deskripsi: proker.deskripsi
          })
          .eq('id', proker.id);
      } catch (e) {
        console.warn('Supabase DB proker update skipped:', e);
      }
    }

    return updatedLocal;
  },

  /**
   * Delete Proker
   */
  async deleteProker(id: string, actorNama?: string): Promise<ProgramKerja[]> {
    const updatedLocal = storageService.deleteProker(id, actorNama);

    if (isSupabaseConfigured()) {
      try {
        await supabase.from('program_kerja').delete().eq('id', id);
      } catch (e) {
        console.warn('Supabase DB proker delete skipped:', e);
      }
    }

    return updatedLocal;
  }
};
