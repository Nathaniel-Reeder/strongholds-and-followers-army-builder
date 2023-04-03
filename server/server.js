const express = require('express')
const app = express()

app.use(express.json())
app.use(express.static('public'))

const controller = require('./controller')
const {buildArmy, viewAllArmies, viewCommanderArmies, editArmy, deleteArmy} = controller


app.post('/army', buildArmy);
app.get('/army/view-all', viewAllArmies);
app.post('/army/commander', viewCommanderArmies);
app.delete('/army/:id', deleteArmy);

app.listen(4000, () => console.log('Server running on port 4000'))