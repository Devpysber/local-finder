-- 1. Users Table
CREATE TABLE users (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('user', 'vendor', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Categories Table
CREATE TABLE categories (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(100) UNIQUE NOT NULL,
    icon VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Businesses Table
CREATE TABLE businesses (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    category_id CHAR(36),
    owner_id CHAR(36),
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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 3. Business Images Table
CREATE TABLE business_images (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    business_id CHAR(36),
    image_url VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE
);

-- 4. Claims Table
CREATE TABLE claims (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    business_id CHAR(36),
    user_id CHAR(36),
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(business_id, user_id),
    FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 5. Leads Table
CREATE TABLE leads (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    business_id CHAR(36),
    user_name VARCHAR(255) NOT NULL,
    user_phone VARCHAR(50) NOT NULL,
    message TEXT,
    status ENUM('new', 'contacted', 'closed') DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE
);

-- 6. Subscriptions Table
CREATE TABLE subscriptions (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id CHAR(36),
    plan_name VARCHAR(100) NOT NULL,
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,
    status ENUM('active', 'cancelled', 'expired') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ==========================================
-- INDEXING FOR SEARCH & PERFORMANCE
-- ==========================================

-- Full-text search index on business name
ALTER TABLE businesses ADD FULLTEXT INDEX idx_businesses_name_search (name);

-- B-Tree indexes for exact matches and filtering
CREATE INDEX idx_businesses_city ON businesses(city);
CREATE INDEX idx_businesses_category_id ON businesses(category_id);
CREATE INDEX idx_businesses_is_featured ON businesses(is_featured);
CREATE INDEX idx_businesses_rating ON businesses(rating DESC);

-- Geospatial index
CREATE INDEX idx_businesses_location ON businesses(latitude, longitude);
