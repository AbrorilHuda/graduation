-- ============================================================
-- Informatika '22 Yearbook — Seed Data
-- Jalankan SETELAH schema.sql
-- ============================================================
-- Catatan: password_hash di bawah adalah bcrypt hash dari "password123" (cost=12)
-- Hash: $2b$12$5t695NXJTk0NBFFqbRTFH.83Wc0pplqz2YJouMkk9pRLs036KxDGq
-- ============================================================

-- Insert students
insert into students (id, nim, name, role, specialization) values
  ('a1b2c3d4-0001-0001-0001-000000000001', '220101014', 'Clara Dian Paramitha', 'admin',   'Business Intelligence'),
  ('a1b2c3d4-0002-0002-0002-000000000002', '220101032', 'Fahri Hamzah',         'student', 'Smart Agriculture'),
  ('a1b2c3d4-0003-0003-0003-000000000003', '220101048', 'Gita Lestari',         'student', 'Business Intelligence'),
  ('a1b2c3d4-0004-0004-0004-000000000004', '220101089', 'Kevin Wijaya',         'student', 'Smart Agriculture')
on conflict (nim) do nothing;

-- Insert milestones
insert into milestones (student_id, proposal, seminar, defense, graduation) values
  ('a1b2c3d4-0001-0001-0001-000000000001', true,  true,  true,  true),   -- Clara: Graduated
  ('a1b2c3d4-0002-0002-0002-000000000002', true,  true,  true,  false),  -- Fahri: Defense Completed
  ('a1b2c3d4-0003-0003-0003-000000000003', true,  true,  false, false),  -- Gita: Seminar Completed
  ('a1b2c3d4-0004-0004-0004-000000000004', true,  true,  true,  true)    -- Kevin: Graduated
on conflict (student_id) do nothing;

-- Insert profiles
insert into profiles (student_id, quote, avatar_url) values
  ('a1b2c3d4-0001-0001-0001-000000000001',
   'Analyzing data taught me how to find truth; four years of friendship taught me how to find joy.',
   '/images/student_1.png'),
  ('a1b2c3d4-0002-0002-0002-000000000002',
   'Code that irrigation micro-sensor right, and you feed a village. We made every single loop count.',
   '/images/student_2.png'),
  ('a1b2c3d4-0003-0003-0003-000000000003',
   'Behind every intelligence report is a testament of our collaborative lab nights.',
   '/images/student_3.png'),
  ('a1b2c3d4-0004-0004-0004-000000000004',
   'From soil monitoring IoT nodes to the graduation stage, our growth was beautiful.',
   '/images/student_4.png')
on conflict (student_id) do nothing;

-- Insert password registry (password "password123" di-hash bcrypt cost=12)
-- PENTING: Hash ini dibuat offline. Jika ingin hash ulang, gunakan script Node.js berikut:
--   const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('password123', 12));
insert into password_registry (student_id, password_hash) values
  ('a1b2c3d4-0001-0001-0001-000000000001', '$2b$12$5t695NXJTk0NBFFqbRTFH.83Wc0pplqz2YJouMkk9pRLs036KxDGq'),
  ('a1b2c3d4-0002-0002-0002-000000000002', '$2b$12$5t695NXJTk0NBFFqbRTFH.83Wc0pplqz2YJouMkk9pRLs036KxDGq'),
  ('a1b2c3d4-0003-0003-0003-000000000003', '$2b$12$5t695NXJTk0NBFFqbRTFH.83Wc0pplqz2YJouMkk9pRLs036KxDGq'),
  ('a1b2c3d4-0004-0004-0004-000000000004', '$2b$12$5t695NXJTk0NBFFqbRTFH.83Wc0pplqz2YJouMkk9pRLs036KxDGq')
on conflict (student_id) do nothing;
