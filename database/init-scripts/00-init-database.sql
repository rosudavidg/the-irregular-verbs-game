-- Create verbs table
CREATE TABLE IF NOT EXISTS irregular_verbs (
    -- Autoincrement id
    id SERIAL PRIMARY KEY,
    -- Infinitive
    infinitive VARCHAR (32),
    -- Simple past(s) - list of accepted words
    simple_past VARCHAR (128),
    -- Past participle(s) - list of accepted words
    past_particile VARCHAR (128)
);
