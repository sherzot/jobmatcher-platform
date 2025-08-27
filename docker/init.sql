CREATE DATABASE IF NOT EXISTS jobmatcher CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE jobmatcher;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    StaffCode VARCHAR(10) PRIMARY KEY,
    Name VARCHAR(255) NOT NULL,
    Email VARCHAR(255) UNIQUE NOT NULL,
    PasswordHash VARCHAR(255) NOT NULL,
    Role ENUM('user', 'agent', 'admin') DEFAULT 'user',
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Companies table
CREATE TABLE IF NOT EXISTS companies (
    CompanyCode VARCHAR(10) PRIMARY KEY,
    Name VARCHAR(255) NOT NULL,
    Description TEXT,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Jobs table
CREATE TABLE IF NOT EXISTS jobs (
    OrderCode VARCHAR(10) PRIMARY KEY,
    Title VARCHAR(255) NOT NULL,
    Description TEXT,
    CompanyCode VARCHAR(10),
    SalaryMin DECIMAL(10,2),
    SalaryMax DECIMAL(10,2),
    Status ENUM('active', 'closed', 'draft') DEFAULT 'active',
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (CompanyCode) REFERENCES companies(CompanyCode)
);

-- Insert sample data
INSERT IGNORE INTO users (StaffCode, Name, Email, PasswordHash, Role) VALUES
('S0000001', 'Admin User', 'admin@jobmatcher.com', '$2a$10$dummy.hash.for.demo', 'admin'),
('S0000002', 'Test User', 'user@jobmatcher.com', '$2a$10$dummy.hash.for.demo', 'user');

INSERT IGNORE INTO companies (CompanyCode, Name, Description) VALUES
('C0000001', 'Tech Corp', 'Technology company'),
('C0000002', 'Finance Inc', 'Financial services company');

INSERT IGNORE INTO jobs (OrderCode, Title, Description, CompanyCode, SalaryMin, SalaryMax) VALUES
('J0000001', 'Software Engineer', 'Looking for a skilled software engineer', 'C0000001', 50000.00, 80000.00),
('J0000002', 'Data Analyst', 'Data analysis position', 'C0000002', 40000.00, 60000.00);
