// Get All Armies button
const getAllBtn = document.getElementById("get-all-armies")

// Get armies by commander button
const getByCommanderBtn = document.getElementById("by-commander")

//base URL
const baseURL = "http://localhost:4000"

// GET from server

const getAllArmies = () => {
    //Create a loader 
    armyContainer.innerHTML = `
        <div class="loader"></div>
    `
    axios.get(`${baseURL}/army/view-all`).then(response => displayArmyCard(response)).catch(err => console.log(err))
}

const getByCommander = event => {
    event.preventDefault()
    let bodyObj = {
        commander: document.getElementById('commander').value
    }

    if(bodyObj.commander === ''){
        alert('Please input a commander.')
    } else{
         //Create a loader 
    armyContainer.innerHTML = `
        <div class="loader"></div>
    `
    }

   
    axios.post(`${baseURL}/army/commander`, bodyObj).then(response => displayArmyCard(response)).catch(err => console.log(err))
}

// Event Listeners
getAllBtn.addEventListener('click', getAllArmies)
getByCommanderBtn.addEventListener('click', getByCommander)

// container element for the army cards
const armyContainer = document.getElementById("army-container")

// Function to display army cards 
const displayArmyCard = response => {
    // if the response is an empty array, give an alert that there are no armies to display
    console.log(response.data)
    if (response.data.length === 0){
        alert('Cannot display armies; none were found.')
    }

    // Loop over the response
    // console.log(response.data[0].id)
    armyContainer.innerHTML = ``
    for (let i = 0; i < response.data.length; i++) {
        // console.log(`For loop iteration ${i}`)
        let prev = i - 1
        // console.log(prev)
        //get the ID of the current Army
        let armyID = response.data[i].id
        let prevArmyID = undefined
        if (prev >= 0) {
            prevArmyID = response.data[prev].id
        }
        
        createArmyCard(response, armyID, prevArmyID, i)
    }
}
//Function to capitalize the first letter of each string
const capitalize = s => s && s[0].toUpperCase() + s.slice(1)

//Function to create the HTML army card
const createArmyCard = (response, armyId, prevId, i) => {
    console.log(response)

    // Create the army card element
    const armyCard = document.createElement('div')
    armyCard.classList.add('army-card')
    armyCard.setAttribute('id', `army-${armyId}`)

    // If the army has already been logged, only get the traits, otherwise create the initial army card
    if(armyId === prevId){
        // console.log(`Army ID: ${armyId}`, `prevId: ${prevId}`)
        const {name, description} = response.data[i]
        const traitsSection = document.getElementById(`traits-${armyId}`)
        const traitCard = document.createElement('div')
        traitCard.classList.add('trait')
        traitCard.innerHTML = `
        <h5>${name}</h5>
        <p>${description}</p>
        `
        traitsSection.appendChild(traitCard)
    } else {
        // Destructure army data from the response
        let {ancestry, army_name, commander_name, equipment, level, unit_type, cost, attack, defense, power, toughness, morale, size, name, description, commander_id} = response.data[i]
        //Capitalize ancestry and unit_type
        ancestry = capitalize(ancestry)
        unit_type = capitalize(unit_type)

        // console.log(armyId, name, description)
        armyCard.innerHTML = `
            <h2 class="aelu">${army_name}</h2>
            <h4 id="commander-${commander_id}" class="aelu">Commander: ${commander_name}</h4>
            <p class="aelu">${ancestry} ${equipment} ${level} ${unit_type}</p>
            <p class="aelu">Cost: ${cost}</p>
                
            <table>
                <tr>
                    <td>Attack:</td>
                    <td>${attack}</td>
                    <td>Defense:</td>
                    <td>${defense + 10}</td>
                </tr>
                <tr>
                    <td>Power:</td>
                    <td>${power}</td>
                    <td>Toughness: </td>
                    <td>${toughness + 10}</td>
                </tr>
                <tr>
                    <td>Morale:</td>
                    <td>${morale}</td>
                    <td>Size:</td>
                    <td>${size}</td>
                </tr>
            </table>
            
            <h4>Traits:</h4>
            <section id="traits-${armyId}" class="traits-section"></section>

            <button onclick="deleteArmy(${armyId})">Delete</button>
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

        //If the traits aren't null, add them
        if(name !== null){
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
            <p>This unit has no ancestry traits.</p>
            `
            traitsSection.appendChild(traitCard)
        }
        
        
    }
}

// Function to delete an army card
const deleteArmy = id => {
    axios.delete(`${baseURL}/army/${id}`).then(response => {
        
        armyCard = document.getElementById(`army-${id}`)
        
        if(response.data){
            armyCard.innerHTML = `<p class="delete-message">Army deleted successfully!<p>`
        } else {
            armyCard.innerHTML = `<p class="delete-message">There was a problem deleting the army.</p>`
        }
        
    }).catch(err => console.log(err))
}