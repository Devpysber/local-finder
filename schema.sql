-- Enums for constrained values
CREATE TYPE user_role AS ENUM ('user', 'vendor', 'admin');
CREATE TYPE claim_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE lead_status AS ENUM ('new', 'contacted', 'closed');
CREATE TYPE subscription_status AS ENUM ('active', 'cancelled', 'expired');

-- 1. Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    password_hash VARCHAR(255) NOT NULL,
    role user_role DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Categories Table (Created before businesses for foreign key reference)
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    icon VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Businesses Table
CREATE TABLE businesses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    owner_id UUID REFERENCES users(id) ON DELETE SET NULL, -- Links to the vendor who claimed/created it
    description TEXT,
    phone VARCHAR(50),
    whatsapp VARCHAR(50),
    address TEXT,
    city VARCHAR(100),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    rating DECIMAL(3, 2) DEFAULT 0.00,
    total_reviews INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Business Images Table
CREATE TABLE business_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    image_url VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Claims Table
CREATE TABLE claims (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    status claim_status DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(business_id, user_id) -- Prevent multiple claims by the same user for the same business
);

-- 5. Leads Table
CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    user_name VARCHAR(255) NOT NULL,
    user_phone VARCHAR(50) NOT NULL,
    message TEXT,
    status lead_status DEFAULT 'new',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Subscriptions Table
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    plan_name VARCHAR(100) NOT NULL,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    status subscription_status DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- INDEXING FOR SEARCH & PERFORMANCE
-- ==========================================

-- Full-text search index on business name
CREATE INDEX idx_businesses_name_search ON businesses USING GIN (to_tsvector('english', name));

-- B-Tree indexes for exact matches and filtering
CREATE INDEX idx_businesses_city ON businesses(city);
CREATE INDEX idx_businesses_category_id ON businesses(category_id);
CREATE INDEX idx_businesses_is_featured ON businesses(is_featured);
CREATE INDEX idx_businesses_rating ON businesses(rating DESC);

-- Foreign key indexes (PostgreSQL doesn't index FKs automatically)
CREATE INDEX idx_business_images_business_id ON business_images(business_id);
CREATE INDEX idx_claims_business_id ON claims(business_id);
CREATE INDEX idx_claims_user_id ON claims(user_id);
CREATE INDEX idx_leads_business_id ON leads(business_id);
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);

-- Geospatial index (if using PostGIS in the future, you'd use a GIST index on a geometry column)
-- For now, standard B-Tree indexes on lat/lng can help with simple bounding box queries
CREATE INDEX idx_businesses_location ON businesses(latitude, longitude);
