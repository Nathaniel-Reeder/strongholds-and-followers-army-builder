require('dotenv').config()
const Sequelize = require('sequelize')

const sequelize = new Sequelize(process.env.CONNECTION_STRING, {
    dialect: 'postgres',
    dialectOptions: {
        ssl:  {
            rejectUnauthorized: false
        }
    }
})

module.exports = {
    buildArmy: async (req, res) => {
        //destructure info from the req.body
        const {commander, armyName, ancestry, experience, equipment, unitType, size} = req.body
        let replacementObj = {
            commander,
            armyName,
            ancestry,
            experience,
            equipment,
            unitType,
            size
        }
    //Perform calculations to create the army 
        let attack = 0
        let power = 0
        let defense = 0
        let toughness = 0
        let morale = 0
        let traits = []
        let traitCost = []
        
    //Assign trait IDs to the army based on the ancestry
        let extractedTrait = await sequelize.query(`
            SELECT traits_id
            FROM ancestry_traits 
            JOIN traits ON traits_id = traits.id
            WHERE ancestry_id = :ancestry
        `, {replacements: replacementObj})
        extractedTrait[0].forEach((obj) => {traits.push(obj.traits_id)})
    //Get trait costs out of the database
        let extractedTraitCosts = await sequelize.query(`
            SELECT cost
            FROM ancestry_traits 
            JOIN traits ON traits_id = traits.id
            WHERE ancestry_id = :ancestry
        `, {replacements: replacementObj})
        extractedTraitCosts[0].forEach((obj) => {traitCost.push(obj.cost)})
    

    //adjust variables with modifiers collected from the database for ancestry
        let ancAttackMod = await sequelize.query(`SELECT attack FROM ancestry WHERE id = :ancestry;`, {replacements: replacementObj})
        attack += ancAttackMod[0][0].attack
        

        let ancPowerMod = await sequelize.query(`SELECT power FROM ancestry WHERE id = :ancestry;`, {replacements: replacementObj})
        power += ancPowerMod[0][0].power

        let ancDefMod = await sequelize.query(`SELECT defense FROM ancestry WHERE id = :ancestry;`, {replacements: replacementObj})
        defense += ancDefMod[0][0].defense

        let ancToughMod = await sequelize.query(`SELECT toughness FROM ancestry WHERE id = :ancestry;`, {replacements: replacementObj})
        toughness += ancToughMod[0][0].toughness

        let ancMoraleMod = await sequelize.query(`SELECT morale FROM ancestry WHERE id = :ancestry;`, {replacements: replacementObj})
        morale += ancMoraleMod[0][0].morale

    //adjust variables with info from the dtabase using the experience value (attack, toughness, morale)

        let expAtkMod = await sequelize.query(`SELECT attack FROM experience WHERE id = :experience;`, {replacements: replacementObj})
        attack += expAtkMod[0][0].attack
        

        let expToughMod = await sequelize.query(`SELECT toughness FROM experience WHERE id = :experience;`, {replacements: replacementObj})
        toughness += expToughMod[0][0].toughness

        let expMoraleMod = await sequelize.query(`SELECT morale FROM experience WHERE id = :experience;`, {replacements: replacementObj})
        morale += expMoraleMod[0][0].morale

    //adjust variables with info from the database using the equipment value (power, defense)

        let eqPwrMod = await sequelize.query(`SELECT power FROM equipment WHERE id = :equipment;`, {replacements: replacementObj})
        power += eqPwrMod[0][0].power

        let eqDefMod = await sequelize.query(`SELECT defense FROM equipment WHERE id = :equipment;`, {replacements: replacementObj})
        defense += eqDefMod[0][0].defense

    //adjust variables with info from the databuse using the unitType value (attack, power, defense, toughness, morale, cost_mod)

        let unitAtkMod = await sequelize.query(`SELECT attack FROM unit_type WHERE id = :unitType;`, {replacements: replacementObj})
        attack += unitAtkMod[0][0].attack
        

        let unitPwrMod = await sequelize.query(`SELECT power FROM unit_type WHERE id = :unitType;`, {replacements: replacementObj})
        power += unitPwrMod[0][0].power

        let unitDefMod = await sequelize.query(`SELECT defense FROM unit_type WHERE id = :unitType;`, {replacements: replacementObj})
        defense += unitDefMod[0][0].defense

        let unitToughMod = await sequelize.query(`SELECT toughness FROM unit_type WHERE id = :unitType;`, {replacements: replacementObj})
        toughness += unitToughMod[0][0].toughness

        let unitMoraleMod = await sequelize.query(`SELECT morale FROM unit_type WHERE id = :unitType;`, {replacements: replacementObj})
        morale += unitMoraleMod[0][0].morale

        let unitCostMod = await sequelize.query(`SELECT cost_mod FROM unit_type WHERE id = :unitType;`, {replacements: replacementObj})
        unitCostMod = unitCostMod[0][0].cost_mod

    //adjust variables with info from the size value (size, cost_mod)

        let sizeDice = await sequelize.query(`SELECT size FROM size WHERE id = :size;`, {replacements: replacementObj})
        sizeDice = sizeDice[0][0].size

        let sizeCostMod = await sequelize.query(`SELECT cost_mod FROM size WHERE id = :size;`, {replacements: replacementObj})
        sizeCostMod = sizeCostMod[0][0].cost_mod

    //calculate cost value per instructions in Strongholds and Followers book.
    //add up the bonuses to attack, power, defense, and toughness. Add morale bonus * 2.
        let cost = attack + power + defense + toughness + (morale * 2)
    //multiply this total by the Cost Modifier from the unit’s type
        cost = Math.floor(cost * unitCostMod)
    //then multiply it by its Cost Modifier from Size.
        cost = Math.floor(cost * sizeCostMod)
    //Multiply result by 10
        cost = cost * 10
    //Add the cost of all the unit's traits
        traitCost.forEach((num) => cost += num)
    //Add a flat 30
        cost += 30
    
    //Figure out if the commander entered exists
        let commandExistance = await sequelize.query(`
            SELECT EXISTS 
            (SELECT name FROM commander WHERE name = :commander);
        `, {replacements: replacementObj})   

        // If the commander does exist, get its ID, then insert data into the army table in the database
        if (commandExistance[0][0].exists) {
            //get commander ID
            let extractId = await sequelize.query(`SELECT id FROM commander WHERE name = :commander`, {replacements: replacementObj})
            let id = extractId[0][0].id
            //insert that id and other data already gathered into the army table
            await sequelize.query(`
                INSERT INTO army (commander_id, name, cost, ancestry_id, experience_id, equipment_id, unit_type_id, attack, defense, power, toughness, morale, size_id)
                VALUES
                (${id} , :armyName, ${cost}, :ancestry, :experience, :equipment, :unitType, ${attack}, ${defense}, ${power}, ${toughness}, ${morale}, :size);
            `, {replacements: replacementObj})
            // get the ID of the new army
            let extractedArmyId = await sequelize.query(`SELECT id FROM army WHERE name = :armyName`, {replacements: replacementObj})
                extractedArmyId = extractedArmyId[0][0].id
            //Create an entry in army_traits for each trait the army has, linking the traits to the army.
            traits.forEach(async (traitId) => {
                await sequelize.query(`
                    INSERT INTO army_traits (army_id, traits_id)
                    VALUES (${extractedArmyId}, ${traitId});
                `)
            })
        } else {
            //Create the commander in the database
            await sequelize.query(`
                INSERT INTO commander (name) VALUES (:commander);
            `, {replacements: replacementObj})
            //Get the new commander's id
            let extractedCmdId = await sequelize.query(`SELECT id FROM commander WHERE name = :commander`, {replacements: replacementObj})
            extractedCmdId = extractedCmdId[0][0].id
            //insert the commander's id and other data into the army table
            await sequelize.query(`
                INSERT INTO army (commander_id, name, cost, ancestry_id, experience_id, equipment_id, unit_type_id, attack, defense, power, toughness, morale, size_id)
                VALUES (${extractedCmdId} , :armyName, ${cost}, :ancestry, :experience, :equipment, :unitType, ${attack}, ${defense}, ${power}, ${toughness}, ${morale}, :size);
            `, {replacements: replacementObj})
            // get the ID of the new army
            let extractedArmyId = await sequelize.query(`SELECT id FROM army WHERE name = :armyName`, {replacements: replacementObj})
                extractedArmyId = extractedArmyId[0][0].id
            //Create an entry in army_traits for each trait the army has, linking the traits to the army.
            traits.forEach(async (traitId) => {
                await sequelize.query(`
                    INSERT INTO army_traits (army_id, traits_id)
                    VALUES (${extractedArmyId}, ${traitId});
                `)
            })
        }
        let response = await getArmyObj(armyName)
        res.send(response).status(200)
    },
    viewAllArmies: (req, res) => {

    },
    viewCommanderArmies: (req, res) => {

    },
    editArmy: (req, res) => {

    },
    deleteArmy: (req, res) => {
        
    }
}

const getArmyObj = async (army) => {
    let replaceObj = {army}
    let databaseResponse = await sequelize.query(`
        SELECT commander.name AS commander_name, army.name AS army_name, cost, ancestry_id, experience_id, equipment_id, unit_type_id, army.attack, army.defense, army.power, army.toughness, army.morale, size_id, ancestry, level, equipment, unit_type, size 
        FROM army 
            JOIN commander
                ON army.commander_id = commander.id
            JOIN ancestry
                ON army.ancestry_id = ancestry.id
            JOIN experience
                ON army.experience_id = experience.id
            JOIN equipment
                ON army.equipment_id = equipment.id
            JOIN unit_type
                ON army.unit_type_id = unit_type.id
            JOIN size
                ON army.size_id = size.id
            WHERE army.name = :army;
    `, {replacements: replaceObj})

    let traitsResponse = await sequelize.query(`
        SELECT traits.name AS trait_name, description
        FROM army 
            JOIN army_traits
                ON army.id = army_traits.army_id
            JOIN traits 
                ON traits.id = army_traits.traits_id
        WHERE army.name = :army;
    `, {replacements: replaceObj})
    let toRespond = [databaseResponse[0][0], traitsResponse[0][0]]
    return toRespond
}