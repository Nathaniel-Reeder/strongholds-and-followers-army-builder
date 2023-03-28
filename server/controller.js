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
    buildArmy: (req, res) => {
        console.log(req.body)
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