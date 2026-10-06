import { Transaksi, ProgramKerja, OrgLevel } from '../types';

export const exportService = {
  /**
   * Export list of transactions to Excel (.csv format with UTF-8 BOM)
   */
  exportTransactionsToExcel(
    transaksiList: Transaksi[],
    orgLevel: OrgLevel,
    fileNamePrefix: string = 'Laporan_Keuangan_SAKU_IMM'
  ): void {
    if (!transaksiList || transaksiList.length === 0) return;

    // Header CSV
    const headers = [
      'ID Transaksi',
      'Tanggal',
      'Nama Organisasi',
      'Bidang Naungan',
      'Program Kerja',
      'Kategori Proker',
      'Keterangan Transaksi',
      'Jenis Nominal',
      'Nominal (Rp)',
      'Kategori Alokasi',
      'Status Google Drive'
    ];

    // Build Rows
    const rows = transaksiList.map((t) => [
      `"${t.id}"`,
      `"${t.tanggal}"`,
      `"${t.organisasiNama || 'PK IMM Teknik Mesin UI'}"`,
      `"${t.bidangNama}"`,
      `"${t.programKerjaNama}"`,
      `"${t.kategoriProker}"`,
      `"${t.keterangan.replace(/"/g, '""')}"`,
      `"${t.jenisNominal === 'pemasukan' ? 'Pemasukan (+)' : 'Pengeluaran (-)'}"`,
      t.nominal,
      `"${t.jenisTransaksi}"`,
      `"${t.uploadStatus}"`
    ]);

    // CSV Content String with UTF-8 BOM (\uFEFF) for Excel compatibility
    const csvContent =
      '\uFEFF' +
      [headers.join(';'), ...rows.map((row) => row.join(';'))].join('\r\n');

    // Create Blob & Trigger Download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const dateStr = new Date().toISOString().split('T')[0];
    const fileName = `${fileNamePrefix}_${orgLevel}_${dateStr}.csv`;

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  /**
   * Export Program Kerja Financial Summary to Excel
   */
  exportProkerSummaryToExcel(
    prokerList: ProgramKerja[],
    transaksiList: Transaksi[],
    orgLevel: OrgLevel
  ): void {
    const headers = [
      'ID Proker',
      'Nama Program Kerja',
      'Bidang Naungan',
      'Kategori',
      'Tanggal Pelaksanaan',
      'Total Pemasukan (Rp)',
      'Total Pengeluaran (Rp)',
      'Surplus / Defisit (Rp)',
      'Status Laporan'
    ];

    const rows = prokerList.map((p) => {
      const pTrx = transaksiList.filter((t) => t.programKerjaId === p.id);
      const pem = pTrx
        .filter((t) => t.jenisNominal === 'pemasukan')
        .reduce((sum, t) => sum + t.nominal, 0);
      const peng = pTrx
        .filter((t) => t.jenisNominal === 'pengeluaran')
        .reduce((sum, t) => sum + t.nominal, 0);
      const diff = pem - peng;

      return [
        `"${p.id}"`,
        `"${p.namaProker}"`,
        `"${p.bidangNama}"`,
        `"${p.kategori}"`,
        `"${p.tanggalPelaksanaan || '02 - 04 Sept 2026'}"`,
        pem,
        peng,
        diff,
        `"${p.statusLaporan || 'Belum'}"`
      ];
    });

    const csvContent =
      '\uFEFF' +
      [headers.join(';'), ...rows.map((row) => row.join(';'))].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const dateStr = new Date().toISOString().split('T')[0];
    const fileName = `Laporan_Per_Proker_${orgLevel}_${dateStr}.csv`;

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  /**
   * Export Official Cash Flow Statement (Laporan Arus Kas) to Excel (.csv)
   */
  exportCashFlowStatementToExcel(
    transaksiList: Transaksi[],
    orgLevel: OrgLevel
  ): void {
    const totalPemasukan = (transaksiList || [])
      .filter((t) => t.jenisNominal === 'pemasukan')
      .reduce((sum, t) => sum + t.nominal, 0);

    const totalPengeluaran = (transaksiList || [])
      .filter((t) => t.jenisNominal === 'pengeluaran')
      .reduce((sum, t) => sum + t.nominal, 0);

    const saldoAkhir = totalPemasukan - totalPengeluaran;

    const lines = [
      'LAPORAN ARUS KAS SAKU IMM',
      `Tingkat Organisasi;${orgLevel}`,
      `Tanggal Export;${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`,
      '',
      '1. RINGKASAN ARUS KAS',
      'Keterangan;Jumlah (Rp)',
      `Total Pemasukan Kas;${totalPemasukan}`,
      `Total Pengeluaran Kas;${totalPengeluaran}`,
      `Saldo Kas Akhir;${saldoAkhir}`,
      '',
      '2. RINCIAN ARUS KAS (TRANSAKSI)',
      'ID Transaksi;Tanggal;Program Kerja;Bidang Naungan;Keterangan;Pemasukan (Rp);Pengeluaran (Rp)',
      ...(transaksiList || []).map((t) =>
        `"${t.id}";"${t.tanggal}";"${t.programKerjaNama}";"${t.bidangNama}";"${t.keterangan.replace(/"/g, '""')}";${
          t.jenisNominal === 'pemasukan' ? t.nominal : 0
        };${t.jenisNominal === 'pengeluaran' ? t.nominal : 0}`
      )
    ];

    const csvContent = '\uFEFF' + lines.join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const dateStr = new Date().toISOString().split('T')[0];
    const fileName = `Laporan_Arus_Kas_${orgLevel}_${dateStr}.csv`;

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};

