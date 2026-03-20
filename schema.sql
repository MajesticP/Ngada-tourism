-- ============================================================
-- Database Schema: Ngada Tourism (Next.js Rebuild)
-- Run this on a FRESH database only.
-- For existing DBs, see schema.migrations.sql
-- ============================================================

CREATE DATABASE IF NOT EXISTS ngada_tourism CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ngada_tourism;

-- Admin table
CREATE TABLE IF NOT EXISTS admin (
  id_admin  INT AUTO_INCREMENT PRIMARY KEY,
  username  VARCHAR(100) NOT NULL UNIQUE,
  password  VARCHAR(255) NOT NULL  -- bcrypt hashed
);

-- Kabupaten (sub-districts of Ngada)
CREATE TABLE IF NOT EXISTS kabupaten (
  id_kabupaten   INT AUTO_INCREMENT PRIMARY KEY,
  nama_kabupaten VARCHAR(150) NOT NULL
);

-- Lokasi (GPS coordinates for tourist spots)
CREATE TABLE IF NOT EXISTS lokasi (
  id_lokasi   INT AUTO_INCREMENT PRIMARY KEY,
  nama_lokasi VARCHAR(150) NOT NULL,
  lat         DECIMAL(10, 7) NULL,
  lng         DECIMAL(10, 7) NULL
);

-- Galeri (photo gallery)
CREATE TABLE IF NOT EXISTS galeri (
  id_galeri   INT AUTO_INCREMENT PRIMARY KEY,
  nama_galeri VARCHAR(150) NOT NULL,
  gambar      VARCHAR(255) NULL,
  keterangan  TEXT NULL
);

-- Tempat Wisata (tourist attractions)
CREATE TABLE IF NOT EXISTS tempat_wisata (
  id_tempat_wisata   INT AUTO_INCREMENT PRIMARY KEY,
  nama_tempat_wisata VARCHAR(200) NOT NULL,
  alamat             TEXT NOT NULL,
  informasi1         TEXT NOT NULL,
  kategori           VARCHAR(50) NOT NULL DEFAULT 'wisata_alam',
  akses_jalan        VARCHAR(100) NULL,
  parkir             VARCHAR(100) NULL,
  toilet             VARCHAR(100) NULL,
  jarak_atm          VARCHAR(100) NULL,
  jarak_rs           VARCHAR(150) NULL,
  spot_foto          VARCHAR(100) NULL,
  id_kabupaten       INT NULL,
  id_lokasi          INT NULL,
  id_galeri          INT NULL,
  created_at         TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at         TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (id_kabupaten) REFERENCES kabupaten(id_kabupaten) ON DELETE SET NULL,
  FOREIGN KEY (id_lokasi)    REFERENCES lokasi(id_lokasi) ON DELETE SET NULL,
  FOREIGN KEY (id_galeri)    REFERENCES galeri(id_galeri) ON DELETE SET NULL
);

-- Foto (multiple photos per tempat wisata)
CREATE TABLE IF NOT EXISTS foto (
  id_foto          INT  NOT NULL AUTO_INCREMENT PRIMARY KEY,
  id_tempat_wisata INT  NOT NULL,
  url              TEXT NOT NULL,
  urutan           INT  NOT NULL DEFAULT 0,

  FOREIGN KEY (id_tempat_wisata) REFERENCES tempat_wisata(id_tempat_wisata) ON DELETE CASCADE
);

-- Contact messages
CREATE TABLE IF NOT EXISTS pesan (
  id_pesan   INT          NOT NULL AUTO_INCREMENT,
  nama       VARCHAR(255) NOT NULL,
  email      VARCHAR(255) NOT NULL,
  subjek     VARCHAR(255)          DEFAULT NULL,
  pesan      TEXT         NOT NULL,
  sudah_baca TINYINT(1)   NOT NULL DEFAULT 0,
  created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_pesan)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- Seed Data
-- ============================================================

-- Default admin (password: admin123 — CHANGE THIS IN PRODUCTION)
INSERT INTO admin (username, password) VALUES
('admin', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

-- Kabupaten (11 sub-districts of Ngada Regency)
INSERT INTO kabupaten (nama_kabupaten) VALUES
('Aimere'),('Bajawa'),('Bajawa Utara'),('Boawae'),
('Golewa'),('Golewa Barat'),('Golewa Selatan'),
('Jerebu''u'),('Riung'),('Riung Barat'),('Soa');

-- Sample Lokasi
INSERT INTO lokasi (nama_lokasi, lat, lng) VALUES
('Bajawa', -8.5590, 121.0890),
('Riung', -8.5270, 121.5200),
('Golewa', -8.6230, 121.0240),
('Aimere', -8.7010, 120.9890),
('Boawae', -8.5490, 121.3920),
('Soa', -8.4610, 120.9870);

-- Sample Galeri
INSERT INTO galeri (nama_galeri, gambar, keterangan) VALUES
('Kampung Adat Bena', 'Kampung Adat Bena.jpg', 'Kampung adat megalitik yang terletak di lereng Gunung Inerie'),
('Taman Wisata 17 Pulau Riung', 'Taman Wisata 17 Pulau Riung.jpg', 'Kawasan konservasi laut dengan 17 pulau kecil yang eksotis'),
('Wolobobo', 'wolobobo.jpg', 'Puncak bukit dengan pemandangan panorama indah Bajawa'),
('Air Panas Mengeruda', 'Air Panas Mengeruda.jpg', 'Pemandian air panas alami dengan kandungan belerang'),
('Kampung Adat Tololela', 'Kampung Adat Tololela.jpg', 'Kampung tradisional suku Ngada dengan rumah adat khas'),
('Bukit Avatar', 'bukit avatar.jpg', 'Bukit hijau dengan pemandangan alam yang menakjubkan'),
('Air Panas Boba', 'Air Panas Boba.jpg', 'Sumber air panas alami di kawasan Soa'),
('Kampung Adat Belaraghi', 'Kampung Adat Belaraghi.jpg', 'Kampung adat dengan tradisi dan budaya Ngada yang kental'),
('Pantai Lekoena', 'Pantai Lekoena.jpg', 'Pantai dengan pasir putih dan air jernih');

-- Sample Tempat Wisata
INSERT INTO tempat_wisata (nama_tempat_wisata, alamat, informasi1, kategori, id_kabupaten, id_lokasi, id_galeri) VALUES
('Kampung Adat Bena', 'Desa Bena, Kabupaten Golewa, Kabupaten Ngada', 'Kampung Adat Bena adalah salah satu kampung megalitik terpenting di Indonesia.', 'kampung_adat', 5, 3, 1),
('Taman Wisata 17 Pulau Riung', 'Kabupaten Riung, Kabupaten Ngada', 'Taman Wisata Alam Riung terdiri dari 17 pulau kecil yang tersebar di Teluk Riung.', 'pulau_eksotis', 9, 2, 2),
('Wolobobo', 'Desa Wolobobo, Kabupaten Bajawa', 'Wolobobo adalah sebuah bukit yang menawarkan pemandangan 360 derajat kota Bajawa.', 'wisata_alam', 2, 1, 3),
('Air Panas Mengeruda', 'Desa Mengeruda, Kabupaten Soa, Kabupaten Ngada', 'Air Panas Mengeruda adalah kolam rendam alami yang terbentuk dari aktivitas vulkanik.', 'wisata_alam', 11, 6, 4),
('Kampung Adat Tololela', 'Desa Tololela, Kabupaten Golewa', 'Kampung Tololela merupakan salah satu kampung adat yang masih mempertahankan tradisi asli suku Ngada.', 'kampung_adat', 5, 3, 5),
('Bukit Avatar', 'Kabupaten Bajawa, Kabupaten Ngada', 'Dijuluki Bukit Avatar karena keindahannya yang menyerupai pemandangan dalam film Avatar.', 'wisata_alam', 2, 1, 6),
('Air Panas Boba', 'Desa Soa, Kabupaten Soa', 'Sumber air panas alami Boba terletak di area yang masih asri dan belum banyak dikunjungi.', 'wisata_alam', 11, 6, 7),
('Kampung Adat Belaraghi', 'Desa Belaraghi, Kabupaten Bajawa Utara', 'Kampung Belaraghi menyimpan kekayaan tradisi dan seni budaya Ngada yang autentik.', 'kampung_adat', 3, 1, 8),
('Pantai Lekoena', 'Kabupaten Riung, Kabupaten Ngada', 'Pantai Lekoena menawarkan keindahan pasir putih dan air laut biru jernih yang memesona.', 'wisata_alam', 9, 2, 9);

-- ============================================================
-- Migration: add fasilitas columns to tempat_wisata
-- Run this if your DB already exists (skip if fresh install)
-- ============================================================
ALTER TABLE tempat_wisata
  ADD COLUMN IF NOT EXISTS akses_jalan VARCHAR(100) NULL AFTER kategori,
  ADD COLUMN IF NOT EXISTS parkir      VARCHAR(100) NULL AFTER akses_jalan,
  ADD COLUMN IF NOT EXISTS toilet      VARCHAR(100) NULL AFTER parkir,
  ADD COLUMN IF NOT EXISTS jarak_atm   VARCHAR(100) NULL AFTER toilet,
  ADD COLUMN IF NOT EXISTS jarak_rs    VARCHAR(150) NULL AFTER jarak_atm,
  ADD COLUMN IF NOT EXISTS spot_foto   VARCHAR(100) NULL AFTER jarak_rs;
