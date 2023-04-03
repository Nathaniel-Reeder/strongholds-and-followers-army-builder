// Get All Armies button
const getAllBtn = document.getElementById("get-all-armies")

// Get armies by commander button
const getByCommanderBtn = document.getElementById("by-commander")

//base URL
const baseURL = "http://localhost:4000"

// GET from server

const getAllArmies = () => {
    axios.get(`${baseURL}/army/view-all`).then(response => displayArmyCard(response)).catch(err => console.log(err))
}

const getByCommander = event => {
    event.preventDefault()
    let bodyObj = {
        commander: document.getElementById('commander').value
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
    // console.log(response)
    
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
            <h3>${army_name}</h3>
            <h4 id="commander-${commander_id}">Commander: ${commander_name}</h4>
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

            <button onclick="deleteArmy(${armyId})">Delete</button>
            `
        armyContainer.appendChild(armyCard)
        
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