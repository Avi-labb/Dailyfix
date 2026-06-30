-- Migration to update customers table to use first_name and last_name
USE dailyfixcare;

-- Check if the customers table has the name column and update it
ALTER TABLE customers 
ADD COLUMN IF NOT EXISTS first_name VARCHAR(255) AFTER id,
ADD COLUMN IF NOT EXISTS last_name VARCHAR(255) AFTER first_name;

-- If name column exists, populate first_name and last_name
UPDATE customers 
SET first_name = SUBSTRING_INDEX(name, ' ', 1),
    last_name = SUBSTRING(name, LOCATE(' ', name) + 1)
WHERE name IS NOT NULL AND name != '';

-- Remove the old name column (uncomment if you want to remove it)
-- ALTER TABLE customers DROP COLUMN IF EXISTS name;
