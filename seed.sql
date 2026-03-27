-- ==========================================
-- SAMPLE DATA FOR TESTING
-- ==========================================

-- 1. Insert Categories
INSERT INTO categories (id, name, icon) VALUES 
('11111111-1111-1111-1111-111111111111', 'Restaurants', 'Utensils'),
('22222222-2222-2222-2222-222222222222', 'Plumbers', 'Wrench'),
('33333333-3333-3333-3333-333333333333', 'Electricians', 'Zap'),
('44444444-4444-4444-4444-444444444444', 'Gyms', 'Dumbbell')
ON CONFLICT (name) DO NOTHING;

-- 2. Insert Users (Admin, Vendor, User)
INSERT INTO users (id, name, email, phone, password_hash, role) VALUES 
('55555555-5555-5555-5555-555555555555', 'Admin User', 'admin@localfinder.com', '+1234567890', 'hashed_password_123', 'admin'),
('66666666-6666-6666-6666-666666666666', 'Vendor Bob', 'bob@bobsplumbing.com', '+1987654321', 'hashed_password_456', 'vendor'),
('77777777-7777-7777-7777-777777777777', 'Regular Joe', 'joe@example.com', '+1555555555', 'hashed_password_789', 'user')
ON CONFLICT (email) DO NOTHING;

-- 3. Insert Businesses
INSERT INTO businesses (id, name, category_id, owner_id, description, phone, whatsapp, address, city, latitude, longitude, rating, total_reviews, is_featured) VALUES 
('88888888-8888-8888-8888-888888888888', 'Bob''s Expert Plumbing', '22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666666', '24/7 Emergency plumbing services. Fast and reliable.', '+1987654321', '+1987654321', '123 Pipe St', 'New York', 40.7128, -74.0060, 4.8, 120, true),
('99999999-9999-9999-9999-999999999999', 'Spice Route Restaurant', '11111111-1111-1111-1111-111111111111', NULL, 'Authentic spicy food from around the world.', '+1112223333', NULL, '456 Food Ave', 'New York', 40.7138, -74.0070, 4.5, 85, false)
ON CONFLICT DO NOTHING;

-- 4. Insert Business Images
INSERT INTO business_images (business_id, image_url) VALUES 
('88888888-8888-8888-8888-888888888888', 'https://picsum.photos/seed/plumber1/400/300'),
('88888888-8888-8888-8888-888888888888', 'https://picsum.photos/seed/plumber2/400/300'),
('99999999-9999-9999-9999-999999999999', 'https://picsum.photos/seed/food1/400/300');

-- 5. Insert Claims
-- Regular Joe is trying to claim the unclaimed "Spice Route Restaurant"
INSERT INTO claims (business_id, user_id, status) VALUES 
('99999999-9999-9999-9999-999999999999', '77777777-7777-7777-7777-777777777777', 'pending')
ON CONFLICT (business_id, user_id) DO NOTHING;

-- 6. Insert Leads
-- Someone contacted Bob's Plumbing
INSERT INTO leads (business_id, user_name, user_phone, message, status) VALUES 
('88888888-8888-8888-8888-888888888888', 'Alice Smith', '+19998887777', 'I have a leaking pipe in my kitchen, can you help ASAP?', 'new'),
('88888888-8888-8888-8888-888888888888', 'Tom Davis', '+17776665555', 'Need a quote for a new water heater.', 'contacted');

-- 7. Insert Subscriptions
-- Bob has an active premium subscription
INSERT INTO subscriptions (user_id, plan_name, start_date, end_date, status) VALUES 
('66666666-6666-6666-6666-666666666666', 'Premium Listing', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '1 year', 'active');
