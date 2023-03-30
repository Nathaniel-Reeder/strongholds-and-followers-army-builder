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
    axios.post(`${baseURL}/army`, bodyObj).then((res) => console.log(res.data)).catch((err) => console.log(err))
}

//Display the Army Card of the army that was created.
const displayArmyCard = (response) => {
    //destructure data from the response
    let {ancestry, army_name, commander_name, cost, defense, equipment, level, morale, power, size, toughness, unit_type} = response[0]
    
    const armyCard = document.createElement('div')
    armyCard.classList.add('army-card')

    armyCard.innerHTML = `
        <h3>${army_name}</h3>
        <h4>Commander: ${commander_name}</h4>
        <p>${ancestry} ${equipment} ${level} ${unit_type}</p>
        <p>Cost: ${cost}</p>
        
        <table>
            <tr>
                <td>Attack: +${attack}</td>
                <td>Defense: ${defense + 10}</td>
            </tr>
            <tr>
                <td>Power: +${power}</td>
                <td>Toughness: ${toughness + 10}</td>
            </tr>
            <tr>
                <td>Morale: +${morale}</td>
                <td>Size: ${size}</td>
            </tr>
        </table>

        <h4>Traits:</h4>

    `
    
}

// Handle submit

buildSubmit.addEventListener('submit', buildArmy)