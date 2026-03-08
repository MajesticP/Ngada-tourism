-- ============================================================
-- Database Schema: Ngada Tourism (Next.js Rebuild)
-- ============================================================

CREATE DATABASE IF NOT EXISTS ngada_tourism CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ngada_tourism;

-- Admin table
CREATE TABLE IF NOT EXISTS admin (
  id_admin  INT AUTO_INCREMENT PRIMARY KEY,
  username  VARCHAR(100) NOT NULL UNIQUE,
  password  VARCHAR(255) NOT NULL  -- bcrypt hashed
);

-- Kecamatan (sub-districts of Ngada)
CREATE TABLE IF NOT EXISTS kecamatan (
  id_kecamatan   INT AUTO_INCREMENT PRIMARY KEY,
  nama_kecamatan VARCHAR(150) NOT NULL
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
  id_kecamatan       INT NULL,
  id_lokasi          INT NULL,
  id_galeri          INT NULL,
  created_at         TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at         TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (id_kecamatan) REFERENCES kecamatan(id_kecamatan) ON DELETE SET NULL,
  FOREIGN KEY (id_lokasi)    REFERENCES lokasi(id_lokasi) ON DELETE SET NULL,
  FOREIGN KEY (id_galeri)    REFERENCES galeri(id_galeri) ON DELETE SET NULL
);

-- ============================================================
-- Seed Data
-- ============================================================

-- Default admin (password: admin123 — change in production!)
-- Password hash for 'admin123' using bcrypt
INSERT INTO admin (username, password) VALUES
('admin', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

-- Kecamatan (11 sub-districts of Ngada Regency)
INSERT INTO kecamatan (nama_kecamatan) VALUES
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
INSERT INTO tempat_wisata (nama_tempat_wisata, alamat, informasi1, id_kecamatan, id_lokasi, id_galeri) VALUES
('Kampung Adat Bena', 'Desa Bena, Kecamatan Golewa, Kabupaten Ngada', 'Kampung Adat Bena adalah salah satu kampung megalitik terpenting di Indonesia. Terletak di lereng Gunung Inerie yang menjulang 2.245 meter, kampung ini memiliki lebih dari 40 rumah adat yang masih dihuni oleh keturunan langsung pendirinya. Batu-batu megalitik yang tersusun rapi di tengah kampung menjadi saksi bisu kehidupan leluhur suku Ngada selama berabad-abad.', 5, 3, 1),
('Taman Wisata 17 Pulau Riung', 'Kecamatan Riung, Kabupaten Ngada', 'Taman Wisata Alam Riung terdiri dari 17 pulau kecil yang tersebar di Teluk Riung. Kawasan ini merupakan habitat alami komodo, berbagai spesies burung, dan kekayaan terumbu karang yang memukau. Snorkeling dan diving di sini menawarkan pengalaman bawah laut yang tak terlupakan di antara ikan-ikan berwarna cerah.', 9, 2, 2),
('Wolobobo', 'Desa Wolobobo, Kecamatan Bajawa', 'Wolobobo adalah sebuah bukit yang menawarkan pemandangan 360 derajat kota Bajawa dan alam sekitarnya. Dari puncaknya, pengunjung dapat menyaksikan matahari terbit yang spektakuler dengan latar belakang Gunung Inerie. Jalur trekking menuju puncak melalui hutan pinus yang sejuk menjadikan perjalanan ini tak kalah menarik.', 2, 1, 3),
('Air Panas Mengeruda', 'Desa Mengeruda, Kecamatan Soa, Kabupaten Ngada', 'Air Panas Mengeruda adalah kolam rendam alami yang terbentuk dari aktivitas vulkanik. Airnya mengandung belerang yang dipercaya bermanfaat untuk kesehatan kulit. Dikelilingi oleh sawah hijau dan pemandangan gunung, tempat ini menawarkan pengalaman berendam yang menyegarkan dan terapeutik.', 11, 6, 4),
('Kampung Adat Tololela', 'Desa Tololela, Kecamatan Golewa', 'Kampung Tololela merupakan salah satu kampung adat yang masih mempertahankan tradisi dan arsitektur asli suku Ngada. Rumah adat berbentuk kerucut dengan ornamen khas Ngada menjadi daya tarik utama bagi para wisatawan budaya.', 5, 3, 5),
('Bukit Avatar', 'Kecamatan Bajawa, Kabupaten Ngada', 'Dijuluki Bukit Avatar karena keindahannya yang menyerupai pemandangan dalam film Avatar. Hamparan bukit hijau berlapis-lapis dengan kabut tipis di pagi hari menciptakan atmosfer magis yang memukau setiap pengunjung.', 2, 1, 6),
('Air Panas Boba', 'Desa Soa, Kecamatan Soa', 'Sumber air panas alami Boba terletak di area yang masih asri dan belum banyak dikunjungi wisatawan. Air panasnya mengalir dari celah bebatuan vulkanik, menciptakan kolam-kolam alami yang sempurna untuk berendam.', 11, 6, 7),
('Kampung Adat Belaraghi', 'Desa Belaraghi, Kecamatan Bajawa Utara', 'Kampung Belaraghi menyimpan kekayaan tradisi dan seni budaya Ngada yang autentik. Pengunjung dapat menyaksikan langsung ritual adat, tari-tarian tradisional, dan kerajinan tangan khas daerah.', 3, 1, 8),
('Pantai Lekoena', 'Kecamatan Riung, Kabupaten Ngada', 'Pantai Lekoena menawarkan keindahan pasir putih dan air laut biru jernih yang memesona. Lokasinya yang tersembunyi membuat pantai ini masih terjaga kealamiannya, menjadikannya surga tersembunyi bagi para pelancong.', 9, 2, 9);

-- Tabel pesan dari halaman kontak
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
