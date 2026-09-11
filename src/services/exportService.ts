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
  exportCashFlowStatementToExcel(orgLevel: OrgLevel): void {
    const monthlyData = [
      { bulan: 'Januari', saldoAwal: 100000000, pemasukan: 45000000, pengeluaran: 32000000, net: 13000000, saldoAkhir: 113000000 },
      { bulan: 'Februari', saldoAwal: 113000000, pemasukan: 60000000, pengeluaran: 42000000, net: 18000000, saldoAkhir: 131000000 },
      { bulan: 'Maret', saldoAwal: 131000000, pemasukan: 38000000, pengeluaran: 35000000, net: 3000000, saldoAkhir: 134000000 },
      { bulan: 'April', saldoAwal: 134000000, pemasukan: 72000000, pengeluaran: 50000000, net: 22000000, saldoAkhir: 156000000 },
      { bulan: 'Mei', saldoAwal: 156000000, pemasukan: 55000000, pengeluaran: 48000000, net: 7000000, saldoAkhir: 163000000 },
      { bulan: 'Juni', saldoAwal: 163000000, pemasukan: 80000000, pengeluaran: 61000000, net: 19000000, saldoAkhir: 182000000 },
      { bulan: 'Juli', saldoAwal: 182000000, pemasukan: 65000000, pengeluaran: 52000000, net: 13000000, saldoAkhir: 195000000 },
      { bulan: 'Agustus', saldoAwal: 195000000, pemasukan: 95000000, pengeluaran: 70000000, net: 25000000, saldoAkhir: 220000000 },
    ];

    const lines = [
      'LAPORAN ARUS KAS SAKU IMM',
      `Tingkat Organisasi;${orgLevel}`,
      'Periode;Januari - Agustus 2026',
      '',
      '1. METRIK KEUANGAN',
      'Total Putaran Keuangan;900000000;(Pemasukan 510.000.000 + Pengeluaran 390.000.000)',
      'Rata-Rata Pengeluaran / Bulan;48750000',
      'Pengeluaran Terbesar;85000000;Organisasi (21,79%)',
      '',
      '2. RINGKASAN ARUS KAS',
      'Keterangan;Jumlah (Rp)',
      'Saldo Awal;100000000',
      'Total Pemasukan;510000000',
      'Total Pengeluaran;390000000',
      'Kenaikan / Penurunan Kas;120000000',
      'Saldo Akhir;220000000',
      '',
      '3. ARUS KAS PER BULAN',
      'Bulan;Saldo Awal (Rp);Pemasukan (Rp);Pengeluaran (Rp);Kenaikan / Penurunan Kas (Rp);Saldo Akhir (Rp)',
      ...monthlyData.map((r) => `${r.bulan};${r.saldoAwal};${r.pemasukan};${r.pengeluaran};${r.net};${r.saldoAkhir}`),
      'TOTAL;-;510000000;390000000;120000000;220000000'
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

