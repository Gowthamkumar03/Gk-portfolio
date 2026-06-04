-- ============================================================
-- Gowtham Kumar D — Portfolio Database Schema
-- ============================================================

CREATE DATABASE IF NOT EXISTS portfolio_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE portfolio_db;

-- ─────────────────────────────────────────────────────────────
-- Contact Messages
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS contact_messages (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name         VARCHAR(120)    NOT NULL,
  email        VARCHAR(255)    NOT NULL,
  subject      VARCHAR(255)    NOT NULL,
  message      TEXT            NOT NULL,
  ip_address   VARCHAR(45)     DEFAULT NULL,
  is_read      TINYINT(1)      NOT NULL DEFAULT 0,
  is_replied   TINYINT(1)      NOT NULL DEFAULT 0,
  created_at   DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email      (email),
  INDEX idx_created_at (created_at),
  INDEX idx_is_read    (is_read)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────────────────────
-- Projects (optional CMS extension)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS projects (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title        VARCHAR(200)    NOT NULL,
  description  TEXT            NOT NULL,
  tech_stack   VARCHAR(500)    DEFAULT NULL COMMENT 'Comma-separated list',
  live_url     VARCHAR(500)    DEFAULT NULL,
  github_url   VARCHAR(500)    DEFAULT NULL,
  image_path   VARCHAR(500)    DEFAULT NULL,
  sort_order   TINYINT UNSIGNED NOT NULL DEFAULT 0,
  is_featured  TINYINT(1)      NOT NULL DEFAULT 0,
  is_active    TINYINT(1)      NOT NULL DEFAULT 1,
  created_at   DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────────────────────
-- Certifications (optional CMS extension)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS certifications (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title        VARCHAR(200)    NOT NULL,
  issuer       VARCHAR(200)    DEFAULT NULL,
  issue_date   DATE            DEFAULT NULL,
  cert_url     VARCHAR(500)    DEFAULT NULL,
  icon_class   VARCHAR(100)    DEFAULT NULL COMMENT 'FontAwesome class e.g. fas fa-brain',
  sort_order   TINYINT UNSIGNED NOT NULL DEFAULT 0,
  is_active    TINYINT(1)      NOT NULL DEFAULT 1,
  created_at   DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────────────────────
-- Page Views Analytics (lightweight)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS page_views (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  page         VARCHAR(200)    NOT NULL DEFAULT '/',
  ip_address   VARCHAR(45)     DEFAULT NULL,
  user_agent   VARCHAR(500)    DEFAULT NULL,
  referer      VARCHAR(500)    DEFAULT NULL,
  viewed_at    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_viewed_at (viewed_at),
  INDEX idx_page      (page)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────────────────────
-- Seed Data — Projects
-- ─────────────────────────────────────────────────────────────
INSERT INTO projects (title, description, tech_stack, live_url, github_url, sort_order, is_featured) VALUES
(
  'Expense Tracker System',
  'A comprehensive personal finance management application with real-time tracking, categorized spending analysis, and database-backed history. Features dynamic dashboards and budget alerts.',
  'HTML,CSS,JavaScript,PHP,MySQL',
  '#', '#', 1, 1
),
(
  'Streamline Ticket',
  'A full-featured workflow and ticket management system enabling teams to create, assign, track, and resolve tickets efficiently. Includes role-based access and status pipelines.',
  'HTML,CSS,JavaScript,PHP,MySQL',
  '#', '#', 2, 0
),
(
  'AI Math Tutor',
  'An AI-powered mathematical problem-solving application that provides step-by-step solutions, concept explanations, and adaptive learning paths for students of all levels.',
  'Python,AI/ML,JavaScript,HTML,CSS',
  '#', '#', 3, 0
);

-- ─────────────────────────────────────────────────────────────
-- Seed Data — Certifications
-- ─────────────────────────────────────────────────────────────
INSERT INTO certifications (title, issuer, icon_class, sort_order) VALUES
('AI for Beginners',               'Microsoft / LinkedIn',  'fas fa-brain',           1),
('Data Science & Analytics',       'HP / Academia',         'fas fa-chart-pie',        2),
('Introduction to Cybersecurity',  'Cybersecurity Course',  'fas fa-shield-alt',       3),
('Full Stack Development',         'IBM SkillBuild',        'fas fa-layer-group',      4),
('Business Analytics with Excel',  'Excel Advanced',        'fas fa-table',            5),
('HP AI Foundation',               'Hewlett Packard',       'fas fa-microchip',        6),
('Adobe Design Fundamentals',      'Adobe Creative',        'fas fa-paint-brush',      7);

-- ─────────────────────────────────────────────────────────────
-- Useful views
-- ─────────────────────────────────────────────────────────────
CREATE OR REPLACE VIEW v_unread_messages AS
  SELECT id, name, email, subject, LEFT(message, 100) AS preview, created_at
  FROM   contact_messages
  WHERE  is_read = 0
  ORDER BY created_at DESC;

CREATE OR REPLACE VIEW v_monthly_contacts AS
  SELECT DATE_FORMAT(created_at, '%Y-%m') AS month,
         COUNT(*) AS total
  FROM   contact_messages
  GROUP  BY DATE_FORMAT(created_at, '%Y-%m')
  ORDER  BY month DESC;
