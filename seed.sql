CREATE TABLE commander(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE ancestry(
    id SERIAL PRIMARY KEY,
    ancestry VARCHAR(255) NOT NULL,
    attack INTEGER NOT NULL,
    power INTEGER NOT NULL,
    defense INTEGER NOT NULL,
    toughness INTEGER NOT NULL,
    morale INTEGER NOT NULL
);

CREATE TABLE experience(
    id SERIAL PRIMARY KEY,
    level VARCHAR(255) NOT NULL,
    attack INTEGER NOT NULL,
    toughness INTEGER NOT NULL,
    morale INTEGER NOT NULL
);

CREATE TABLE equipment(
    id SERIAL PRIMARY KEY,
    equipment VARCHAR(255),
    power INTEGER,
    defense INTEGER
);

CREATE TABLE type(
    id SERIAL PRIMARY KEY,
    type VARCHAR(255),
    attack INTEGER NOT NULL,
    power INTEGER NOT NULL,
    defense INTEGER NOT NULL,
    toughness INTEGER NOT NULL,
    morale INTEGER NOT NULL,
    cost_mod FLOAT NOT NULL
);

CREATE TABLE size(
    id SERIAL PRIMARY KEY,
    size VARCHAR(255),
    cost_mod FLOAT
);

CREATE TABLE traits(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE,
    description VARCHAR NOT NULL,
    cost INTEGER NOT NULL
);

CREATE TABLE army(
    id SERIAL PRIMARY KEY,
    commander_id ,
    name VARCHAR(255) NOT NULL,
    cost INTEGER NOT NULL,
    ancestry_id ,
    experience_id ,
    equipment_id ,
    type_id ,
    attack INTEGER NOT NULL,
    defense INTEGER NOT NULL,
    power INTEGER NOT NULL,
    toughness INTEGER NOT NULL,
    morale INTEGER NOT NULL,
    size_id 
);
-- Foreign keys still need to be done


