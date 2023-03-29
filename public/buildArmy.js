//Submit buttons
let buildSubmit = document.querySelector('form')
// default URL

const baseURL = "http://localhost:4000"

//POST to the server the data from the form

const buildArmy = (event) => {
    event.preventDefault()

    let bodyObj = {
        commander: document.getElementById('command-name').value,
        armyName: document.getElementById('army-name').value,
        ancestry: document.getElementById('ancestry').value,
        experience: document.getElementById('experience').value,
        equipment: document.getElementById('equipment').value,
        unitType: document.getElementById('type').value,
        size: document.getElementById('size').value
    }
    // console.log(bodyObj)
    axios.post(`${baseURL}/army`, bodyObj).then(console.log('response received'))
}

//Display the Army Card of the army that was created.
const displayArmyCard = () => {

}

// Handle submit

buildSubmit.addEventListener('submit', buildArmy)