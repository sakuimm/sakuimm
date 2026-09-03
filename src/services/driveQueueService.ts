import { Transaksi } from '../types';

export interface DriveQueueJob {
  id: string;
  transaksiId: string;
  organisasiNama: string;
  fileName: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  driveFolder: string;
  watermarkText: string;
  timestamp: string;
}

class DriveQueueService {
  private queue: DriveQueueJob[] = [];

  /**
   * Push a new receipt image to background upload queue
   */
  enqueueReceiptUpload(transaksi: Transaksi, file?: File): DriveQueueJob {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const folderPath = `IMM Drive Storage / ${transaksi.organisasiNama || 'PK IMM TM UI'} / ${year} / ${month}`;
    const watermarkText = `PROPERTI IMM - ${transaksi.organisasiNama || 'PK IMM TM UI'} - ${transaksi.tanggal}`;

    const job: DriveQueueJob = {
      id: `JOB-${Math.floor(1000 + Math.random() * 9000)}`,
      transaksiId: transaksi.id,
      organisasiNama: transaksi.organisasiNama || 'PK IMM TM UI',
      fileName: file ? file.name : `nota_${transaksi.id}.jpg`,
      status: 'PENDING',
      driveFolder: folderPath,
      watermarkText,
      timestamp: new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })
    };

    this.queue.push(job);

    // Simulate Background Processing Worker (Sharp compression & Google Drive API upload)
    setTimeout(() => {
      job.status = 'PROCESSING';
    }, 1500);

    setTimeout(() => {
      job.status = 'COMPLETED';
    }, 3500);

    return job;
  }

  getQueueStatus(): DriveQueueJob[] {
    return this.queue;
  }
}

export const driveQueueService = new DriveQueueService();
