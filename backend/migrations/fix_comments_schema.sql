-- Migration script to fix comments and activity_logs tables
-- Run this if your database was created with the old schema

-- Drop the updated_at column from comments if it exists
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'comments' 
        AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE comments DROP COLUMN updated_at;
        RAISE NOTICE 'Dropped updated_at column from comments table';
    END IF;
END $$;

-- Update foreign key constraints for comments table
-- Change user_id from CASCADE to SET NULL
DO $$ 
BEGIN
    -- Drop existing constraint
    IF EXISTS (
        SELECT 1 
        FROM information_schema.table_constraints 
        WHERE constraint_name LIKE '%comments_user_id%' 
        AND table_name = 'comments'
    ) THEN
        ALTER TABLE comments 
        DROP CONSTRAINT IF EXISTS comments_user_id_fkey;
        
        -- Add new constraint with SET NULL
        ALTER TABLE comments 
        ADD CONSTRAINT comments_user_id_fkey 
        FOREIGN KEY (user_id) 
        REFERENCES users(id) 
        ON DELETE SET NULL;
        
        RAISE NOTICE 'Updated user_id constraint in comments table';
    END IF;
END $$;

-- Update foreign key constraints for activity_logs table
-- Change user_id from CASCADE to SET NULL
DO $$ 
BEGIN
    -- Drop existing constraint
    IF EXISTS (
        SELECT 1 
        FROM information_schema.table_constraints 
        WHERE constraint_name LIKE '%activity_logs_user_id%' 
        AND table_name = 'activity_logs'
    ) THEN
        ALTER TABLE activity_logs 
        DROP CONSTRAINT IF EXISTS activity_logs_user_id_fkey;
        
        -- Add new constraint with SET NULL
        ALTER TABLE activity_logs 
        ADD CONSTRAINT activity_logs_user_id_fkey 
        FOREIGN KEY (user_id) 
        REFERENCES users(id) 
        ON DELETE SET NULL;
        
        RAISE NOTICE 'Updated user_id constraint in activity_logs table';
    END IF;
END $$;

-- Verify the schema
SELECT 
    table_name, 
    column_name, 
    data_type, 
    is_nullable
FROM 
    information_schema.columns
WHERE 
    table_name IN ('comments', 'activity_logs')
ORDER BY 
    table_name, ordinal_position;

RAISE NOTICE 'Migration completed successfully';
