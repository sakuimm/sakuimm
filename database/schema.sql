-- ====================================================================
-- SKEMA BASIS DATA POSTGRESQL & CLOSURE TABLE (SAKU IMM DATABASE)
-- Berdasarkan IMPLEMENTATION_GUIDE.md (Versi 1.0)
-- ====================================================================

-- 1. TIPE ENUM UTAMA
CREATE TYPE level_organisasi AS ENUM ('DPP', 'DPD', 'PC', 'PK');
CREATE TYPE status_organisasi AS ENUM ('pending', 'verified', 'rejected');
CREATE TYPE role_user AS ENUM ('bendahara_umum', 'tim_verifikasi_internal', 'super_admin');
CREATE TYPE kategori_proker AS ENUM ('Keagamaan', 'Kemahasiswaan', 'Kemasyarakatan');
CREATE TYPE jenis_nominal AS ENUM ('pemasukan', 'pengeluaran');
CREATE TYPE jenis_transaksi AS ENUM ('operasional', 'inventaris');

-- 2. TABEL ORGANISASI (MULTI-TENANT HIERARKIS)
CREATE TABLE IF NOT EXISTS organisasi (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nama VARCHAR(255) NOT NULL,
    level level_organisasi NOT NULL,
    status status_organisasi NOT NULL DEFAULT 'pending',
    alasan_penolakan TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. TABEL CLOSURE TABLE HIERARKI (`organisasi_ancestry`)
-- Query O(1) roll-up agregat dari PK hingga DPP tanpa recursive CTE lambat
CREATE TABLE IF NOT EXISTS organisasi_ancestry (
    ancestor_id UUID NOT NULL REFERENCES organisasi(id) ON DELETE CASCADE,
    descendant_id UUID NOT NULL REFERENCES organisasi(id) ON DELETE CASCADE,
    depth INT NOT NULL,
    PRIMARY KEY (ancestor_id, descendant_id)
);

-- 4. TABEL USER & AUTENTIKASI
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organisasi_id UUID NOT NULL REFERENCES organisasi(id) ON DELETE CASCADE,
    nama VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role role_user NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. TABEL MASTER BIDANG (22 BIDANG RESMI IMM)
CREATE TABLE IF NOT EXISTS bidang (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organisasi_id UUID NOT NULL REFERENCES organisasi(id) ON DELETE CASCADE,
    kode VARCHAR(50) NOT NULL,
    nama VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. TABEL PROGRAM KERJA
CREATE TABLE IF NOT EXISTS program_kerja (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organisasi_id UUID NOT NULL REFERENCES organisasi(id) ON DELETE CASCADE,
    bidang_id UUID NOT NULL REFERENCES bidang(id) ON DELETE CASCADE,
    nama_proker VARCHAR(255) NOT NULL,
    kategori kategori_proker NOT NULL,
    tanggal_pelaksanaan VARCHAR(100),
    status_laporan VARCHAR(50) DEFAULT 'Belum',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. TABEL TRANSAKSI KAS NOTA HARIAN
CREATE TABLE IF NOT EXISTS transaksi (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organisasi_id UUID NOT NULL REFERENCES organisasi(id) ON DELETE CASCADE,
    bidang_id UUID NOT NULL REFERENCES bidang(id) ON DELETE CASCADE,
    program_kerja_id UUID NOT NULL REFERENCES program_kerja(id) ON DELETE CASCADE,
    tanggal DATE NOT NULL,
    keterangan TEXT NOT NULL,
    jenis_nominal jenis_nominal NOT NULL,
    nominal NUMERIC(15, 2) NOT NULL CHECK (nominal > 0),
    jenis_transaksi jenis_transaksi NOT NULL,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. TABEL BUKTI TRANSAKSI & GOOGLE DRIVE QUEUE
CREATE TABLE IF NOT EXISTS bukti_transaksi (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaksi_id UUID UNIQUE NOT NULL REFERENCES transaksi(id) ON DELETE CASCADE,
    drive_file_id VARCHAR(255),
    drive_view_url TEXT,
    upload_status VARCHAR(50) DEFAULT 'PENDING',
    watermarked_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. TABEL AUDIT LOG (JSONB SNAPSHOT TRACKING)
CREATE TABLE IF NOT EXISTS audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organisasi_id UUID NOT NULL REFERENCES organisasi(id) ON DELETE CASCADE,
    transaksi_id UUID REFERENCES transaksi(id),
    actor_user_id UUID REFERENCES users(id),
    actor_nama VARCHAR(255) NOT NULL,
    aksi VARCHAR(50) NOT NULL, -- CREATE, UPDATE, SOFT_DELETE
    keterangan TEXT NOT NULL,
    data_before JSONB,
    data_after JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. TABEL LOGIN LOGS (SECURITY AUDIT)
CREATE TABLE IF NOT EXISTS login_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    ip_address VARCHAR(45) NOT NULL,
    user_agent TEXT NOT NULL,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ====================================================================
-- INDEKS OPTIMASI PERFORMA DATABASE
-- ====================================================================
CREATE INDEX IF NOT EXISTS idx_transaksi_org_tanggal ON transaksi(organisasi_id, tanggal) WHERE is_deleted = FALSE;
CREATE INDEX IF NOT EXISTS idx_ancestry_ancestor ON organisasi_ancestry(ancestor_id);
CREATE INDEX IF NOT EXISTS idx_ancestry_descendant ON organisasi_ancestry(descendant_id);
CREATE INDEX IF NOT EXISTS idx_audit_org ON audit_log(organisasi_id);

-- ====================================================================
-- HELPER STORED PROCEDURE: INSERT CLOSURE TABLE ANCESTRY AUTOMATICALLY
-- ====================================================================
CREATE OR REPLACE PROCEDURE sp_register_organisasi_ancestry(
    new_org_id UUID,
    parent_org_id UUID
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- 1. Self-link: depth 0
    INSERT INTO organisasi_ancestry (ancestor_id, descendant_id, depth)
    VALUES (new_org_id, new_org_id, 0);

    -- 2. Ancestor link dari parent organisasi
    IF parent_org_id IS NOT NULL THEN
        INSERT INTO organisasi_ancestry (ancestor_id, descendant_id, depth)
        SELECT ancestor_id, new_org_id, depth + 1
        FROM organisasi_ancestry
        WHERE descendant_id = parent_org_id;
    END IF;
END;
$$;
