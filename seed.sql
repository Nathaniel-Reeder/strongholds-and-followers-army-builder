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

CREATE TABLE unit_type(
    id SERIAL PRIMARY KEY,
    unit_type VARCHAR(255),
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
    cost INTEGER
);

CREATE TABLE army(
    id SERIAL PRIMARY KEY,
    commander_id INTEGER NOT NULL REFERENCES commander(id),
    name VARCHAR(255) NOT NULL,
    cost INTEGER NOT NULL,
    ancestry_id INTEGER NOT NULL REFERENCES ancestry(id),
    experience_id INTEGER NOT NULL REFERENCES experience(id),
    equipment_id INTEGER NOT NULL REFERENCES equipment(id),
    unit_type_id INTEGER NOT NULL REFERENCES unit_type(id),
    attack INTEGER NOT NULL,
    defense INTEGER NOT NULL,
    power INTEGER NOT NULL,
    toughness INTEGER NOT NULL,
    morale INTEGER NOT NULL,
    size_id INTEGER NOT NULL REFERENCES size(id)
);

CREATE TABLE army_traits (
    id SERIAL PRIMARY KEY,
    army_id INTEGER NOT NULL REFERENCES army(id),
    traits_id INTEGER REFERENCES traits(id)
);

CREATE TABLE ancestry_traits (
    id SERIAL PRIMARY KEY,
    ancestry_id INTEGER NOT NULL REFERENCES ancestry(id),
    traits_id INTEGER REFERENCES traits(id)
);

INSERT INTO ancestry (ancestry, attack, power, defense, toughness, morale)
VALUES 
    ('bugbear', 2, 0, 0, 0, 1),
    ('dragonborn', 2, 2, 1, 1, 1),
    ('dwarf', 3, 1, 1, 1, 2),
    ('elf', 2, 0, 0, 0, 1),
    ('elf (winged)', 1, 1, 0, 0, 1),
    ('ghoul', -1, 0, 2, 2, 0),
    ('gnome', 1, -1, 1, -1, 1),
    ('goblin', -1, -1, 1, -1, 0),
    ('hobgoblin', 2, 0, 0, 0, 1),
    ('human', 2, 0, 0, 0, 1),
    ('kobold', -1, -1, 1, -1, -1),
    ('lizardfolk', 2, 1, -1, 1, 1),
    ('ogre', 0, 2, 0, 2, 1),
    ('orc', 2, 1, 1, 1, 2),
    ('skeleton', -2, -1, 1, 1, 1),
    ('treant', 0, 2, 0, 2, 0),
    ('troll', 0, 2, 0, 2, 0),
    ('zombie', -2, 0, 2, 2, 2);

INSERT INTO traits (name, description, cost)
VALUES
    ('Amphibious', 'This unit does not suffer terrain penalties for fighting in water or on land.', 50),
    ('Bred for War', 'This unit cannot be diminished, and cannot have disadvantage on Morale checks.', 100),
    ('Brutal', 'This unit inflicts 2 casualties on a successful Power check.', 200),
    ('Courageous', 'Once per battle, this unit can choose to succeed on a Morale check it just failed.', 50),
    ('Eternal', 'This unit cannot be horrified, and it always succeeds on Morale checks to attack undead and fiends.', 50),
    ('Frenzy', 'If this unit diminishes an enemy unit, it immediately makes a free attack against that unit.', 50),
    ('Horrify', 'If this unit inflicts a casualty on an enemy unit, that unit must make a DC 15 Morale check. Failure exhausts the unit.', 100),
    ('Martial', 'If this unit succeeds on a Power check and its size is greater than the defending unit, it inflicts 2 casualties.', 100),
    ('Mindless', 'This unit cannot fail Morale checks.', 100),
    ('Regenerate', 'When this unit refreshes, increment its casualty die. This trait ceases to function if the unit suffers a casualty from battle magic.', 200),
    ('Ravenous', 'While any enemy unit is diminished, this unit can spend a round feeding on the corpses to increment their casualty die.', 50),
    ('Hurl Rocks', 'If this unit succeeds on an Attack check, it inflicts 2 casualties. against fortifications, it inflicts 1d6 casualties.', 250),
    ('Savage', 'This unit has advantage on the first Attack check it makes each battle.', 50),
    ('Stalwart', 'Enemy battle magic has disadvantage on Power checks against this unit.', 50),
    ('Twisting Roots', 'As an action, this unit can sap the walls of a fortification. Siege units have advantage on Power checks against sapped fortifications.', 200),
    ('Undead', 'Green and regular troops must pass a Morale check to attack this unit. Each enemy unit need only do this once.', 50),
    ('Siege Engine', 'This unit can attack fortifications, dealing 1d6 damage on a hit.', NULL),
    ('Charge', 'Cannot use while engaged. A Charge is an attack with advantage on the Attack check. It inflicts 2 casualties on a successful Power check. The charging unit is then engaged with the defending unit and must make a DC 13 Morale check to disengage.', NULL);

INSERT INTO experience (level, attack, toughness, morale)
VALUES 
    ('Green', 0, 0, 0),
    ('Regular', 1, 1, 1),
    ('Seasoned', 1, 1, 2),
    ('Veteran', 1, 1, 3),
    ('Elite', 2, 2, 4),
    ('Super-Elite', 2, 2, 5);

INSERT INTO equipment (equipment, power, defense)
VALUES 
    ('Light', 1, 1),
    ('Medium', 2, 2),
    ('Heavy', 4, 4),
    ('Super-Heavy', 6, 6);

INSERT INTO unit_type (unit_type, attack, power, defense, toughness, morale, cost_mod)
VALUES 
    ('flying', 0, 0, 0, 0, 3, 2),
    ('archers', 0, 1, 0, 0, 1, 1.75),
    ('cavalry', 1, 1, 0, 0, 2, 1.5),
    ('levies', 0, 0, 0, 0, -1, 0.75),
    ('infantry', 0, 0, 1, 1, 0, 1),
    ('siege', 1, 1, 0, 1, 0, 1.5);

INSERT INTO size (size, cost_mod)
VALUES 
    ('1d4', 0.66),
    ('1d6', 1),
    ('1d8', 1.33),
    ('1d10', 1.66),
    ('1d12', 2);

INSERT INTO ancestry_traits (ancestry_id, traits_id)
VALUES 
    -- bugbear
    (1, 8), 
    -- dragonborn
    (2, 4), 
    -- dwarf
    (3, 14),
    -- elf 
    (4, 5),
    -- elf (winged) 
    (5, 5), 
    -- ghoul
    (6, 16), (6, 7), (6, 11), 
    --gnoll
    (7, 6),
    --gnome 
    (8, NULL),
    --goblin 
    (9, NULL),
    --hobgoblin 
    (10, 2), (10, 8),
    --human 
    (11, 4),
    --kobold 
    (12, NULL),
    --lizardfolk 
    (13, 1),
    --ogre
    (14, 3),
    --orc
    (15, 13),
    --skeleton
    (16, 16), (16, 9),
    --treant
    (17, 17), (17, 15), (17, 12),
    --troll
    (18, 10),
    --zombie
    (19, 16), (19, 9);

