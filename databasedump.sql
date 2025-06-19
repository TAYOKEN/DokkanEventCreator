-- Création de la table enemy_skills pour PostgreSQL
CREATE TABLE enemy_skills (
    id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    exec_timing_type INTEGER DEFAULT 0,
    turn INTEGER DEFAULT 0,
    is_once INTEGER DEFAULT 0,
    probability INTEGER DEFAULT 0,
    causality_conditions TEXT,
    icon_type INTEGER DEFAULT 1,
    target_type INTEGER DEFAULT 0,
    target_value1 INTEGER DEFAULT 0,
    target_value2 INTEGER DEFAULT 0,
    target_value3 INTEGER DEFAULT 0,
    sub_target_type_set_id INTEGER DEFAULT 0,
    efficacy_type INTEGER DEFAULT 1,
    eff_value1 INTEGER,
    eff_value2 INTEGER,
    eff_value3 INTEGER,
    efficacy_values JSONB DEFAULT '{}',
    calc_option INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index pour améliorer les performances de recherche
CREATE INDEX idx_enemy_skills_name ON enemy_skills(name);
CREATE INDEX idx_enemy_skills_efficacy_type ON enemy_skills(efficacy_type);
CREATE INDEX idx_enemy_skills_created_at ON enemy_skills(created_at);

-- Trigger pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_enemy_skills_updated_at 
    BEFORE UPDATE ON enemy_skills 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Commentaires pour documenter la table
COMMENT ON TABLE enemy_skills IS 'List of enemy skills';
COMMENT ON COLUMN enemy_skills.id IS 'Id to put';
COMMENT ON COLUMN enemy_skills.name IS 'Name of the skill';
COMMENT ON COLUMN enemy_skills.description IS 'Description';
