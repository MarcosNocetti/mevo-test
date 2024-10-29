CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS operations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    sender VARCHAR(255),
    receiver VARCHAR(255),
    amount VARCHAR(255),
    suspicious BOOLEAN 
);

CREATE TABLE IF NOT EXISTS operations_analytics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    suspicious_operation_id UUID REFERENCES operations(id),
    reason VARCHAR(255)
);

DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT 1 
        FROM pg_constraint 
        WHERE conname = 'unique_operation' 
        AND conrelid = 'operations'::regclass
    ) THEN
        ALTER TABLE operations 
        ADD CONSTRAINT unique_operation UNIQUE (sender, receiver, amount);
    END IF;
END $$;
