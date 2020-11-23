-- Create verbs table
CREATE TABLE IF NOT EXISTS (
    -- Autoincrement id
    id SERIAL PRIMARY KEY,
    -- Infinitive
    infitive VARCHAR (32),
    -- Simple past(s) - list of accepted words
    simple_past VARCHAR (128),
    -- Past participle(s) - list of accepted words
    past_particile VARCHAR (128)
);
