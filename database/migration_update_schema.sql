-- ====================================================================
-- MIGRATION SCRIPT: SAKU IMM SUPABASE BACKEND UPDATE
-- Jalankan skrip ini di: Supabase Dashboard -> SQL Editor -> Run
-- Skrip ini idempotent (aman dijalankan berulang kali tanpa merusak data)
-- ====================================================================

-- 1. Tambahkan level 'KORKOM' ke ENUM level_organisasi jika belum ada
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_enum 
        JOIN pg_type ON pg_enum.enumtypid = pg_type.oid 
        WHERE pg_type.typname = 'level_organisasi' AND pg_enum.enumlabel = 'KORKOM'
    ) THEN
        ALTER TYPE level_organisasi ADD VALUE 'KORKOM';
    END IF;
END $$;

-- 2. Update Tabel `organisasi`
ALTER TABLE organisasi ADD COLUMN IF NOT EXISTS email VARCHAR(255);
ALTER TABLE organisasi ADD COLUMN IF NOT EXISTS nama_bendahara VARCHAR(255);
ALTER TABLE organisasi ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);
ALTER TABLE organisasi ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES organisasi(id) ON DELETE SET NULL;
ALTER TABLE organisasi ADD COLUMN IF NOT EXISTS parent_nama VARCHAR(255);
ALTER TABLE organisasi ADD COLUMN IF NOT EXISTS tanggal_pendaftaran TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;

-- 3. Update Tabel `program_kerja`
ALTER TABLE program_kerja ADD COLUMN IF NOT EXISTS target_anggaran NUMERIC(15, 2) DEFAULT 0;
ALTER TABLE program_kerja ADD COLUMN IF NOT EXISTS organisasi_nama VARCHAR(255);
ALTER TABLE program_kerja ADD COLUMN IF NOT EXISTS organisasi_level level_organisasi;
ALTER TABLE program_kerja ADD COLUMN IF NOT EXISTS bidang_nama VARCHAR(255);
ALTER TABLE program_kerja ADD COLUMN IF NOT EXISTS deskripsi TEXT;
ALTER TABLE program_kerja ADD COLUMN IF NOT EXISTS penanggung_jawab VARCHAR(255);
ALTER TABLE program_kerja ADD COLUMN IF NOT EXISTS catatan_revisi TEXT;

-- 4. Update Tabel `transaksi`
ALTER TABLE transaksi ADD COLUMN IF NOT EXISTS organisasi_nama VARCHAR(255) DEFAULT 'IMM';
ALTER TABLE transaksi ADD COLUMN IF NOT EXISTS organisasi_level level_organisasi;
ALTER TABLE transaksi ADD COLUMN IF NOT EXISTS bidang_nama VARCHAR(255);
ALTER TABLE transaksi ADD COLUMN IF NOT EXISTS program_kerja_nama VARCHAR(255);
ALTER TABLE transaksi ADD COLUMN IF NOT EXISTS bukti_drive_file_id VARCHAR(255);
ALTER TABLE transaksi ADD COLUMN IF NOT EXISTS bukti_drive_url TEXT;
ALTER TABLE transaksi ADD COLUMN IF NOT EXISTS upload_status VARCHAR(50) DEFAULT 'COMPLETED';
ALTER TABLE transaksi ADD COLUMN IF NOT EXISTS status_revisi VARCHAR(50) DEFAULT 'normal';
ALTER TABLE transaksi ADD COLUMN IF NOT EXISTS catatan_revisi TEXT;

-- 5. Buat Storage Bucket 'receipts' (Jika belum ada)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('receipts', 'receipts', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 6. Kebijakan Akses Storage Bucket 'receipts'
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE policyname = 'Public Read Receipts' AND tablename = 'objects'
    ) THEN
        CREATE POLICY "Public Read Receipts" ON storage.objects FOR SELECT USING (bucket_id = 'receipts');
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE policyname = 'Public Insert Receipts' AND tablename = 'objects'
    ) THEN
        CREATE POLICY "Public Insert Receipts" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'receipts');
    END IF;
END $$;

-- 7. Pastikan Row Level Security (RLS) Permissive untuk client anon/frontend
ALTER TABLE organisasi ENABLE ROW LEVEL SECURITY;
ALTER TABLE program_kerja ENABLE ROW LEVEL SECURITY;
ALTER TABLE transaksi ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    -- Organisasi
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow anon read all organisasi' AND tablename = 'organisasi') THEN
        CREATE POLICY "Allow anon read all organisasi" ON organisasi FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow anon insert organisasi' AND tablename = 'organisasi') THEN
        CREATE POLICY "Allow anon insert organisasi" ON organisasi FOR INSERT WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow anon update organisasi' AND tablename = 'organisasi') THEN
        CREATE POLICY "Allow anon update organisasi" ON organisasi FOR UPDATE USING (true);
    END IF;

    -- Program Kerja
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow anon read all program_kerja' AND tablename = 'program_kerja') THEN
        CREATE POLICY "Allow anon read all program_kerja" ON program_kerja FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow anon insert program_kerja' AND tablename = 'program_kerja') THEN
        CREATE POLICY "Allow anon insert program_kerja" ON program_kerja FOR INSERT WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow anon update program_kerja' AND tablename = 'program_kerja') THEN
        CREATE POLICY "Allow anon update program_kerja" ON program_kerja FOR UPDATE USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow anon delete program_kerja' AND tablename = 'program_kerja') THEN
        CREATE POLICY "Allow anon delete program_kerja" ON program_kerja FOR DELETE USING (true);
    END IF;

    -- Transaksi
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow anon read all transaksi' AND tablename = 'transaksi') THEN
        CREATE POLICY "Allow anon read all transaksi" ON transaksi FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow anon insert transaksi' AND tablename = 'transaksi') THEN
        CREATE POLICY "Allow anon insert transaksi" ON transaksi FOR INSERT WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow anon update transaksi' AND tablename = 'transaksi') THEN
        CREATE POLICY "Allow anon update transaksi" ON transaksi FOR UPDATE USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow anon delete transaksi' AND tablename = 'transaksi') THEN
        CREATE POLICY "Allow anon delete transaksi" ON transaksi FOR DELETE USING (true);
    END IF;
END $$;
