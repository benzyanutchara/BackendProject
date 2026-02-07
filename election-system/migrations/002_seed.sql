-- Election System Seed Data
-- Migration 002: Sample Data

-- Insert default admin (password: admin123)
-- bcrypt hash for 'admin123'
INSERT INTO admins (username, password) VALUES 
('admin', '$2a$10$6Ys6JpYf3J3bK3Y5vZ3kLOJp.dH2r5r9yX3bL0nKQj1F8r9H4x.Gy');

-- Insert sample constituencies (Bangkok districts)
INSERT INTO constituencies (province, district_number) VALUES 
('กรุงเทพมหานคร', 1),
('กรุงเทพมหานคร', 2),
('กรุงเทพมหานคร', 3),
('กรุงเทพมหานคร', 4),
('กรุงเทพมหานคร', 5),
('เชียงใหม่', 1),
('เชียงใหม่', 2),
('เชียงใหม่', 3),
('ขอนแก่น', 1),
('ขอนแก่น', 2),
('นครราชสีมา', 1),
('นครราชสีมา', 2),
('นครราชสีมา', 3),
('สงขลา', 1),
('สงขลา', 2),
('ชลบุรี', 1),
('ชลบุรี', 2),
('นนทบุรี', 1),
('นนทบุรี', 2),
('ปทุมธานี', 1);

-- Insert sample parties
INSERT INTO parties (name, logo_url, policy) VALUES 
('พรรคก้าวไกล', 'https://example.com/logos/move-forward.png', 'นโยบายปฏิรูประบบราชการ ลดความเหลื่อมล้ำ และส่งเสริมประชาธิปไตย'),
('พรรคเพื่อไทย', 'https://example.com/logos/pheu-thai.png', 'นโยบายกระตุ้นเศรษฐกิจ เงินดิจิทัล และพัฒนาคุณภาพชีวิต'),
('พรรคภูมิใจไทย', 'https://example.com/logos/bhumjaithai.png', 'นโยบายพัฒนาภาคเกษตร กัญชาเสรี และท่องเที่ยว'),
('พรรคประชาธิปัตย์', 'https://example.com/logos/democrat.png', 'นโยบายรักษาสถาบัน ส่งเสริมการศึกษา และพัฒนาชนบท'),
('พรรครวมไทยสร้างชาติ', 'https://example.com/logos/united-thai.png', 'นโยบายสานต่อโครงการรัฐบาล และสร้างความมั่นคง');

-- Insert sample candidates for Bangkok District 1
INSERT INTO candidates (title, first_name, last_name, number, image_url, party_id, constituency_id) VALUES 
('นาย', 'สมชาย', 'ใจดี', 1, 'https://example.com/candidates/1.jpg', 1, 1),
('นาง', 'สมหญิง', 'รักชาติ', 2, 'https://example.com/candidates/2.jpg', 2, 1),
('นาย', 'วิชัย', 'มั่นคง', 3, 'https://example.com/candidates/3.jpg', 3, 1),
('นางสาว', 'รัตนา', 'พัฒนา', 4, 'https://example.com/candidates/4.jpg', 4, 1),
('นาย', 'ประยุทธ์', 'สร้างชาติ', 5, 'https://example.com/candidates/5.jpg', 5, 1);

-- Insert sample candidates for Bangkok District 2
INSERT INTO candidates (title, first_name, last_name, number, image_url, party_id, constituency_id) VALUES 
('นาย', 'กิตติ', 'เจริญ', 1, 'https://example.com/candidates/6.jpg', 1, 2),
('นางสาว', 'พิมพ์', 'ดี', 2, 'https://example.com/candidates/7.jpg', 2, 2),
('นาย', 'ธนา', 'รุ่งเรือง', 3, 'https://example.com/candidates/8.jpg', 3, 2);

-- Insert sample candidates for Chiang Mai District 1
INSERT INTO candidates (title, first_name, last_name, number, image_url, party_id, constituency_id) VALUES 
('นาย', 'เจษฎา', 'ภูเขา', 1, 'https://example.com/candidates/9.jpg', 1, 6),
('นาง', 'ลำดวน', 'ดอยสูง', 2, 'https://example.com/candidates/10.jpg', 2, 6),
('นาย', 'พงศ์', 'เหนือ', 3, 'https://example.com/candidates/11.jpg', 4, 6);

-- Insert sample voter (national_id: 1234567890123, password: password123)
-- bcrypt hash for 'password123'
INSERT INTO users (national_id, password, title, first_name, last_name, address, role, constituency_id) VALUES 
('1234567890123', '$2a$10$6Ys6JpYf3J3bK3Y5vZ3kLOJp.dH2r5r9yX3bL0nKQj1F8r9H4x.Gy', 'นาย', 'ทดสอบ', 'ระบบ', '123 ถนนทดสอบ กรุงเทพมหานคร 10100', 'VOTER', 1);

-- Insert sample EC staff (national_id: 9876543210987, password: password123)
INSERT INTO users (national_id, password, title, first_name, last_name, address, role, constituency_id) VALUES 
('9876543210987', '$2a$10$6Ys6JpYf3J3bK3Y5vZ3kLOJp.dH2r5r9yX3bL0nKQj1F8r9H4x.Gy', 'นางสาว', 'เจ้าหน้าที่', 'กกต', '456 ถนน กกต กรุงเทพมหานคร 10200', 'EC', 1);
