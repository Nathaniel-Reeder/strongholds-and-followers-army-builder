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
        console.log(req.body)
        //destructure info from the req.body
        const {commander, armyName, ancestry, experience, equipment, unitType, size} = req.body

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
            WHERE ancestry_id = ${ancestry}
        `)
        extractedTrait[0].forEach((obj) => {traits.push(obj.traits_id)})
    //Get trait costs out of the database
        let extractedTraitCosts = await sequelize.query(`
            SELECT cost
            FROM ancestry_traits 
            JOIN traits ON traits_id = traits.id
            WHERE ancestry_id = ${ancestry}
        `)
        extractedTraitCosts[0].forEach((obj) => {traitCost.push(obj.cost)})
        console.log('Console Log is Here: ', traitCost)

    //adjust variables with modifiers collected from the database for ancestry
        let ancAttackMod = await sequelize.query(`SELECT attack FROM ancestry WHERE id = ${ancestry};`)
        attack += ancAttackMod[0][0].attack
        console.log('Ancestry attack: ', attack)

        let ancPowerMod = await sequelize.query(`SELECT power FROM ancestry WHERE id = ${ancestry};`)
        power += ancPowerMod[0][0].power

        let ancDefMod = await sequelize.query(`SELECT defense FROM ancestry WHERE id = ${ancestry};`)
        defense += ancDefMod[0][0].defense

        let ancToughMod = await sequelize.query(`SELECT toughness FROM ancestry WHERE id = ${ancestry};`)
        toughness += ancToughMod[0][0].toughness

        let ancMoraleMod = await sequelize.query(`SELECT morale FROM ancestry WHERE id = ${ancestry};`)
        morale += ancMoraleMod[0][0].morale

    //adjust variables with info from the dtabase using the experience value (attack, toughness, morale)

        let expAtkMod = await sequelize.query(`SELECT attack FROM experience WHERE id = ${experience};`)
        attack += expAtkMod[0][0].attack
        console.log('Experience attack: ', attack)

        let expToughMod = await sequelize.query(`SELECT toughness FROM experience WHERE id = ${experience};`)
        toughness += expToughMod[0][0].toughness

        let expMoraleMod = await sequelize.query(`SELECT morale FROM experience WHERE id = ${experience};`)
        morale += expMoraleMod[0][0].morale

    //adjust variables with info from the database using the equipment value (power, defense)

        let eqPwrMod = await sequelize.query(`SELECT power FROM equipment WHERE id = ${equipment};`)
        power += eqPwrMod[0][0].power

        let eqDefMod = await sequelize.query(`SELECT defense FROM equipment WHERE id = ${equipment};`)
        defense += eqDefMod[0][0].defense

    //adjust variables with info from the databuse using the unitType value (attack, power, defense, toughness, morale, cost_mod)

        let unitAtkMod = await sequelize.query(`SELECT attack FROM unit_type WHERE id = ${unitType};`)
        attack += unitAtkMod[0][0].attack
        console.log('Unit Type attack: ', attack)

        let unitPwrMod = await sequelize.query(`SELECT power FROM unit_type WHERE id = ${unitType};`)
        power += unitPwrMod[0][0].power

        let unitDefMod = await sequelize.query(`SELECT defense FROM unit_type WHERE id = ${unitType};`)
        defense += unitDefMod[0][0].defense

        let unitToughMod = await sequelize.query(`SELECT toughness FROM unit_type WHERE id = ${unitType};`)
        toughness += unitToughMod[0][0].toughness

        let unitMoraleMod = await sequelize.query(`SELECT morale FROM unit_type WHERE id = ${unitType};`)
        morale += unitMoraleMod[0][0].morale

        let unitCostMod = await sequelize.query(`SELECT cost_mod FROM unit_type WHERE id = ${unitType};`)
        unitCostMod = unitCostMod[0][0].cost_mod
        console.log("UnitCostMod", unitCostMod)

    //adjust variables with info from the size value (size, cost_mod)

        let sizeDice = await sequelize.query(`SELECT size FROM size WHERE id = ${size};`)
        sizeDice = sizeDice[0][0].size

        let sizeCostMod = await sequelize.query(`SELECT cost_mod FROM size WHERE id = ${size};`)
        sizeCostMod = sizeCostMod[0][0].cost_mod
        console.log('sizeCostMod', sizeCostMod)

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
        console.log('COMMANDER CONSOLE LOG HERE: ', commander)
        let commandExistance = await sequelize.query(`
            SELECT EXISTS 
            (SELECT name FROM commander WHERE name = '${commander}');
        `)   

        // If the commander does exist, get its ID, then insert data into the army table in the database
        if (commandExistance[0][0].exists) {
            //get commander ID
            let extractId = await sequelize.query(`SELECT id FROM commander WHERE name = '${commander}'`)
            let id = extractId[0][0].id
            //insert that id and other data already gathered into the army table
            await sequelize.query(`
                INSERT INTO army (commander_id, name, cost, ancestry_id, experience_id, equipment_id, unit_type_id, attack, defense, power, toughness, morale, size_id)
                VALUES
                (${id} , '${armyName}', ${cost}, ${ancestry}, ${experience}, ${equipment}, ${unitType}, ${attack}, ${defense}, ${power}, ${toughness}, ${morale}, ${size});
            `)
            // get the ID of the new army
            let extractedArmyId = await sequelize.query(`SELECT id FROM army WHERE name = '${armyName}'`)
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
                INSERT INTO commander (name) VALUES ('${commander}');
            `)
            //Get the new commander's id
            let extractedCmdId = await sequelize.query(`SELECT id FROM commander WHERE name = '${commander}'`)
            extractedCmdId = extractedCmdId[0][0].id
            //insert the commander's id and other data into the army table
            await sequelize.query(`
                INSERT INTO army (commander_id, name, cost, ancestry_id, experience_id, equipment_id, unit_type_id, attack, defense, power, toughness, morale, size_id)
                VALUES (${extractedCmdId} , '${armyName}', ${cost}, ${ancestry}, ${experience}, ${equipment}, ${unitType}, ${attack}, ${defense}, ${power}, ${toughness}, ${morale}, ${size});
            `)
            // get the ID of the new army
            let extractedArmyId = await sequelize.query(`SELECT id FROM army WHERE name = '${armyName}'`)
                extractedArmyId = extractedArmyId[0][0].id
            //Create an entry in army_traits for each trait the army has, linking the traits to the army.
            traits.forEach(async (traitId) => {
                await sequelize.query(`
                    INSERT INTO army_traits (army_id, traits_id)
                    VALUES (${extractedArmyId}, ${traitId});
                `)
            })
        }
        res.send('Here is your response!').status(200)
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