CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DROP TABLE IF EXISTS revenue CASCADE;
DROP TABLE IF EXISTS product_sale_details CASCADE;
DROP TABLE IF EXISTS sales CASCADE;
DROP TABLE IF EXISTS batch_materials CASCADE;
DROP TABLE IF EXISTS production_batches CASCADE;
DROP TABLE IF EXISTS raw_materials CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS suppliers CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS attendance CASCADE;
DROP TABLE IF EXISTS employees CASCADE;
DROP TABLE IF EXISTS expenses CASCADE;
DROP TABLE IF EXISTS users CASCADE;

DROP SEQUENCE IF EXISTS employee_id_seq;
DROP SEQUENCE IF EXISTS revenue_id_seq;
DROP SEQUENCE IF EXISTS customer_id_seq;
DROP SEQUENCE IF EXISTS product_id_seq;
DROP SEQUENCE IF EXISTS sale_id_seq;

-- Sequences that back the sequential prefixed IDs
CREATE SEQUENCE employee_id_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE revenue_id_seq  START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE customer_id_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE product_id_seq  START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE sale_id_seq     START WITH 1 INCREMENT BY 1;

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(150) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- employees  ->  EMP-0001
CREATE TABLE employees (
  id VARCHAR(10) PRIMARY KEY DEFAULT ('EMP-' || LPAD(nextval('employee_id_seq')::text, 4, '0')),
  name VARCHAR(150) NOT NULL,
  contact_no VARCHAR(50) NOT NULL,
  email_address VARCHAR(255),
  address TEXT,
  position VARCHAR(50) NOT NULL DEFAULT 'OTHER'
    CHECK (position IN ('MANAGER', 'PRODUCTION_STAFF', 'SALES_STAFF', 'ACCOUNTANT', 'OTHER')),
  salary NUMERIC(12, 2) NOT NULL DEFAULT 0,
  joined_date DATE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id VARCHAR(10) NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  status VARCHAR(20) NOT NULL
    CHECK (status IN ('PRESENT', 'ABSENT', 'LEAVE', 'HALF_DAY')),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (employee_id, date)
);


CREATE TABLE suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(150) NOT NULL,
  contact_no VARCHAR(50) NOT NULL,
  email_address VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE raw_materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id UUID NOT NULL REFERENCES suppliers(id),
  material_name VARCHAR(150) NOT NULL,
  stock_qty NUMERIC(12, 2) NOT NULL DEFAULT 0,
  reorder_level NUMERIC(12, 2) NOT NULL DEFAULT 0,
  unit VARCHAR(30) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- products  ->  P-0001
CREATE TABLE products (
  id VARCHAR(10) PRIMARY KEY DEFAULT ('P-' || LPAD(nextval('product_id_seq')::text, 4, '0')),
  product_name VARCHAR(150) NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  price NUMERIC(12, 2) NOT NULL,
  stock_qty INTEGER NOT NULL DEFAULT 0,
  category VARCHAR(100),
  image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE production_batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id VARCHAR(10) NOT NULL REFERENCES products(id),
  production_date DATE NOT NULL,
  produced_qty INTEGER NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'PLANNED'
    CHECK (status IN ('PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  stock_applied BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE batch_materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id UUID NOT NULL REFERENCES production_batches(id) ON DELETE CASCADE,
  material_id UUID NOT NULL REFERENCES raw_materials(id),
  used_qty NUMERIC(12, 2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- customers  ->  C-0001
CREATE TABLE customers (
  id VARCHAR(10) PRIMARY KEY DEFAULT ('C-' || LPAD(nextval('customer_id_seq')::text, 4, '0')),
  name VARCHAR(150) NOT NULL,
  contact_no VARCHAR(50) NOT NULL,
  email_address VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- sales  ->  O-0001  (O for "Order")
CREATE TABLE sales (
  id VARCHAR(10) PRIMARY KEY DEFAULT ('O-' || LPAD(nextval('sale_id_seq')::text, 4, '0')),
  customer_id VARCHAR(10) NOT NULL REFERENCES customers(id),
  sale_date DATE NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'PENDING'
    CHECK (status IN ('PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED')),
  stock_applied BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE product_sale_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sale_id VARCHAR(10) NOT NULL REFERENCES sales(id) ON DELETE CASCADE,
  product_id VARCHAR(10) NOT NULL REFERENCES products(id),
  buy_qty INTEGER NOT NULL,
  unit_price NUMERIC(12, 2) NOT NULL,
  total_amount NUMERIC(12, 2) NOT NULL
);

-- revenue  ->  REV-0001
CREATE TABLE revenue (
  id VARCHAR(10) PRIMARY KEY DEFAULT ('REV-' || LPAD(nextval('revenue_id_seq')::text, 4, '0')),
  sale_id VARCHAR(10) NOT NULL REFERENCES sales(id),
  amount NUMERIC(12, 2) NOT NULL,
  received_date DATE NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  description TEXT NOT NULL,
  amount NUMERIC(12, 2) NOT NULL,
  expense_date DATE NOT NULL,
  category VARCHAR(100),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_raw_materials_supplier ON raw_materials(supplier_id);
CREATE INDEX IF NOT EXISTS idx_batches_product ON production_batches(product_id);
CREATE INDEX IF NOT EXISTS idx_sales_customer ON sales(customer_id);
CREATE INDEX IF NOT EXISTS idx_attendance_employee ON attendance(employee_id);
CREATE INDEX IF NOT EXISTS idx_materials_low_stock ON raw_materials(stock_qty, reorder_level);