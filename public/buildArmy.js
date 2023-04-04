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
    console.log(bodyObj.commander)
    console.log(bodyObj.armyName)
    axios.post(`${baseURL}/army`, bodyObj).then(response => displayArmyCard(response)).catch((err) => {
        console.log(err)
        if (err.message === 'Request failed with status code 400') {
            return alert('Any army with this name assigned to this commander already exists. Please try again!')
        }
    })
}
// section to contain the army card
const armyContainer = document.getElementById("army-container")

//Function to capitalize the first letter of each string
const capitalize = s => s && s[0].toUpperCase() + s.slice(1)

//Display the Army Card of the army that was created.

const displayArmyCard = response => {
    console.log(response)
    armyContainer.innerHTML = ``
    // Create the army card element
    const armyCard = document.createElement('div')
    armyCard.classList.add('army-card')
    let armyId = response.data[0][0].id
    for (let i = 0; i < response.data[0].length; i++){
        // Destructure army data from the response
        let {ancestry, army_name, commander_name, equipment, level, unit_type, cost, attack, defense, power, toughness, morale, size, name, description} = response.data[0][i]
        ancestry = capitalize(ancestry)
        unit_type = capitalize(unit_type)
        
        // If i is 0, create the army card. Otherwise, just add the trait data. 
        if(i === 0){
            //Create the army card
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
                <section id="traits-${armyId}"></section>
                
                `
            armyContainer.appendChild(armyCard)

            //Check if the army is a siege engine or cavalry and add the appropriate traits.
            if(unit_type === 'Cavalry'){
                const traitsSection = document.getElementById(`traits-${armyId}`)
                const traitCard = document.createElement('div')
                traitCard.classList.add('trait')
                traitCard.innerHTML = `
                <h5>Charge</h5>
                <p>Cannot use while engaged. A Charge is an attack with advantage on the Attack check. It inflicts 2 casualties on a successful Power check. The charging unit is then engaged with the defending unit and must make a DC 13 Morale check to disengage.</p>
                `
                traitsSection.appendChild(traitCard)
            }
             
            if(unit_type === 'Siege'){
                const traitsSection = document.getElementById(`traits-${armyId}`)
                const traitCard = document.createElement('div')
                traitCard.classList.add('trait')
                traitCard.innerHTML = `
                <h5>Siege Engine</h5>
                <p>This unit can attack fortifications, dealing 1d6 damage on a hit.</p>
                `
                traitsSection.appendChild(traitCard)
            }

            // Add the first trait if it's not null

            if (name !== null) {
                const traitsSection = document.getElementById(`traits-${armyId}`)
                const traitCard = document.createElement('div')
                traitCard.classList.add('trait')
                traitCard.innerHTML = `
                <h5>${name}</h5>
                <p>${description}</p>
                `
                traitsSection.appendChild(traitCard)
            } else {
                const traitsSection = document.getElementById(`traits-${armyId}`)
                const traitCard = document.createElement('div')
                traitCard.classList.add('trait')
                traitCard.innerHTML = `
                <p>This unit has no racial traits.</p>
                `
                traitsSection.appendChild(traitCard)
            }
        } else { 
            // only add things if the trait isn't null
            
            const traitsSection = document.getElementById(`traits-${armyId}`)
            const traitCard = document.createElement('div')
            traitCard.classList.add('trait')
            traitCard.innerHTML = `
            <h5>${name}</h5>
            <p>${description}</p>
            `
            traitsSection.appendChild(traitCard)
        }
    }
    

}

// Handle submit

buildSubmit.addEventListener('submit', buildArmy)