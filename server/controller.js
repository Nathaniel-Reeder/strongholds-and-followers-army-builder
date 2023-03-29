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

        //adjust variables with modifiers collected from the database
        let ancAttackMod = await sequelize.query(`SELECT attack FROM ancestry WHERE id = ${ancestry};`)
        attack += ancAttackMod[0][0].attack

        let ancPowerMod = await sequelize.query(`SELECT power FROM ancestry WHERE id = ${ancestry};`)
        power += ancPowerMod[0][0].power

        let ancDefMod = await sequelize.query(`SELECT defense FROM ancestry WHERE id = ${ancestry};`)
        defense += ancDefMod[0][0].defense

        let ancToughMod = await sequelize.query(`SELECT toughness FROM ancestry WHERE id = ${ancestry};`)
        toughness += ancToughMod[0][0].toughness

        let ancMoraleMod = await sequelize.query(`SELECT morale FROM ancestry WHERE id = ${ancestry};`)
        morale += ancMoraleMod[0][0].morale

        // console.log('This is the console log', attack, power, defense, toughness, morale)
        //adjust variables with info from the experience value

        let expAtkMod = await sequelize.query(`SELECT attack FROM equipment WHERE id = ${equipment};`)
        attack += expAtkMod[0][0].attack

        

        //adjust variables with info from the equipment value

        //adjust variables with info from the unitType value

        //adjust variables with info from the size value

        //calculate cost value

        //use sequelize to put the army in the database.
        // sequelize.query(`
        //     INSERT INTO army (commander_id, name,)
        // `)
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